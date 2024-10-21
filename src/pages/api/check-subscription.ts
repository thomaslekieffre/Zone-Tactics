import { NextApiRequest, NextApiResponse } from "next";
import { getSubscriptionStatus } from "@/lib/subscription";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    if (!userId) {
      console.error("UserId non trouvé dans la requête");
      return res.status(400).json({ error: "UserId invalide" });
    }

    console.log("UserId reçu:", userId);

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
