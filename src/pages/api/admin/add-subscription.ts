import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  const user = await clerkClient.users.getUser(userId);
  const isAdminUser = user.publicMetadata?.role === "Admin";

  if (!isAdminUser) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  if (req.method === "POST") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId manquant" });
    }

    try {
      const subscriptionId = uuidv4();
      await put(
        `subscriptions/${userId}-${subscriptionId}.json`,
        JSON.stringify({
          status: "active",
          subscriptionId,
        }),
        { access: "public" }
      );

      res.status(200).json({ message: "Abonnement ajouté avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'abonnement:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
