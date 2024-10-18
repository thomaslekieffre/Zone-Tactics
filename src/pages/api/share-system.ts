import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";

const STORAGE_FILE = path.join(process.cwd(), "shared-systems.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const systemData = req.body;
      if (!systemData.name) {
        return res.status(400).json({ error: "Le nom du système est requis" });
      }
      const id = uuidv4();

      let sharedSystems: { [key: string]: any } = {};
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, "utf8");
        sharedSystems = JSON.parse(data);
      }

      sharedSystems[id] = systemData as any;
      const { url } = await put(
        `shared-systems/${id}.json`,
        JSON.stringify(systemData),
        {
          access: "public",
        }
      );

      console.log(`Système sauvegardé avec l'ID: ${id}`);
      res.status(200).json({ id, url });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du système:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  } else {
    res.status(405).end();
  }
}
