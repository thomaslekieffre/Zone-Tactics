import { NextApiRequest, NextApiResponse } from "next";
import stripe from "@/lib/stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(
        session_id as string
      );

      if (session.payment_status === "paid") {
        return res.status(200).json({ status: "active" });
      } else {
        return res.status(200).json({ status: "inactive" });
      }
    } catch (error) {
      console.error("Error verifying subscription:", error);
      return res.status(500).json({ error: "Error verifying subscription" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).send("Method Not Allowed");
  }
}
