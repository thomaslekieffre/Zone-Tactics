import { NextApiRequest, NextApiResponse } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: { role: "Admin" },
    });
    res.status(200).json({ message: "Rôle Admin défini avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la définition du rôle Admin:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
