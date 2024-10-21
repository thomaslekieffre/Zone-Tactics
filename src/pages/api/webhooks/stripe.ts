import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import { PutBlobResult } from "@vercel/blob";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateUserSubscription(
  userId: string,
  subscriptionStatus: string,
  subscriptionId: string
) {
  const subscriptionData = JSON.stringify({
    status: subscriptionStatus,
    id: subscriptionId,
    updatedAt: new Date().toISOString(),
  });

  try {
    console.log(
      `Tentative de mise à jour de l'abonnement pour l'utilisateur ${userId}`
    );
    const result: PutBlobResult = await put(
      `subscriptions/${userId}.json`,
      subscriptionData,
      {
        access: "public",
        addRandomSuffix: false,
      }
    );

    console.log(
      `Abonnement mis à jour avec succès. URL du blob: ${result.url}`
    );
    return result;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'abonnement pour l'utilisateur ${userId}:`,
      error
    );
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!.trim();
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.client_reference_id && session.subscription) {
          try {
            await updateUserSubscription(
              session.client_reference_id,
              "active",
              session.subscription as string
            );
            console.log(
              `Abonnement activé pour l'utilisateur ${session.client_reference_id}`
            );
          } catch (error) {
            console.error(
              `Erreur lors de l'activation de l'abonnement:`,
              error
            );
          }
        }
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata.userId) {
          await updateUserSubscription(
            subscription.metadata.userId,
            subscription.status,
            subscription.id
          );
        }
        break;
      default:
        console.log(`Événement non géré : ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method Not Allowed");
  }
}
