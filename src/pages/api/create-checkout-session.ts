import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { priceId, userId } = req.body;

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        client_reference_id: userId,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      res.status(500).json({ error: "Error creating checkout session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).send("Method Not Allowed");
  }
}
