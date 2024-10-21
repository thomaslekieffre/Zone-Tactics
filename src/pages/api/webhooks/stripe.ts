import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { put } from "@vercel/blob";
import stripe from "@/lib/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`Erreur de webhook: ${err.message}`);
      return res.status(400).send(`Erreur de webhook: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.client_reference_id && session.subscription) {
        try {
          await put(
            `subscriptions/${session.client_reference_id}.json`,
            JSON.stringify({
              status: "active",
              subscriptionId: session.subscription,
            }),
            { access: "public" }
          );
          console.log(
            `Abonnement activé pour l'utilisateur ${session.client_reference_id}`
          );
        } catch (error) {
          console.error(
            "Erreur lors de l'enregistrement de l'abonnement dans Blob:",
            error
          );
        }
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method Not Allowed");
  }
}
