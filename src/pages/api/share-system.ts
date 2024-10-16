import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const STORAGE_FILE = path.join(process.cwd(), "shared-systems.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const systemData = req.body;
      const id = uuidv4();

      let sharedSystems: { [key: string]: any } = {};
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, "utf8");
        sharedSystems = JSON.parse(data);
      }

      sharedSystems[id] = systemData as any;
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(sharedSystems));

      console.log(`Système sauvegardé avec l'ID: ${id}`);
      res.status(200).json({ id });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du système:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
