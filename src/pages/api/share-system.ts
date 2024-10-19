import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  if (req.method === "POST") {
    try {
      const systemData = req.body;
      if (!systemData.name) {
        return res.status(400).json({ error: "Le nom du système est requis" });
      }
      const id = uuidv4();

      const { url } = await put(
        `user-systems/${userId}/${id}.json`,
        JSON.stringify(systemData),
        {
          access: "public",
        }
      );

      console.log(`Système sauvegardé avec l'ID: ${id}`);
      res.status(200).json({ id, url, userId });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du système:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  } else {
    res.status(405).end();
  }
}
