import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "shared-systems.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { id } = req.query;

    if (typeof id !== "string") {
      return res.status(400).json({ error: "ID invalide" });
    }

    let sharedSystems: { [key: string]: any } = {};

    try {
      const data = await fs.readFile(STORAGE_FILE, "utf8");
      sharedSystems = JSON.parse(data);
    } catch (readError) {
      console.log("Erreur lors de la lecture du fichier:", readError);
      return res.status(404).json({ error: "Système non trouvé" });
    }

    const systemData = sharedSystems[id];

    if (!systemData) {
      return res.status(404).json({ error: "Système non trouvé" });
    }

    res.status(200).json(systemData);
  } catch (error) {
    console.error("Erreur lors de la récupération du système:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
