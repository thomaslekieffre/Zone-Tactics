import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { priceId } = req.body; // Assurez-vous de passer priceId depuis le client

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
      });

      res.status(200).json({ id: session.id });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method Not Allowed");
  }
}
