import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const STORAGE_FILE = path.join(process.cwd(), "shared-systems.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "ID invalide" });
      }

      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, "utf8");
        const sharedSystems = JSON.parse(data);
        if (sharedSystems[id]) {
          return res.status(200).json(sharedSystems[id]);
        }
      }

      res.status(404).json({ error: "Système non trouvé" });
    } catch (error) {
      console.error("Erreur lors de la récupération du système:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
