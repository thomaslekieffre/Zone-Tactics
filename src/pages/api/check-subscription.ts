import { NextApiRequest, NextApiResponse } from "next";
import { getSubscriptionStatus } from "@/lib/subscription";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "UserId invalide" });
    }

    try {
      const status = await getSubscriptionStatus(userId);
      console.log(`Statut d'abonnement pour ${userId}:`, status);
      res.status(200).json({ status });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'abonnement:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).send("Method Not Allowed");
  }
}
