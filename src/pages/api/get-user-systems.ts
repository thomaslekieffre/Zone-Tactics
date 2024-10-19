import { NextApiRequest, NextApiResponse } from "next";
import { list } from "@vercel/blob";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const { blobs } = await list({
      prefix: `user-systems/${userId}/`,
    });

    const systems = await Promise.all(
      blobs.map(async (blob) => {
        console.log(blob);
        const response = await fetch(blob.url);
        const systemData = await response.json();
        const id = blob.url.split("/")[4] + "." + blob.url.split("/")[5];
        console.log('user-systems/' + id.replace('.json', ''));
        return {
          id: id.replace('.json', ''),
          name: systemData.name,
          createdAt: blob.uploadedAt,
        };
      })
    );

    res.status(200).json(systems);
  } catch (error) {
    console.error("Erreur lors de la récupération des systèmes:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
