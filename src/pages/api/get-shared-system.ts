import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const blobUrlTemplate =
  "https://em4avskip3gjifsk.public.blob.vercel-storage.com/user-systems/";

async function getJsonFile(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    console.log(req.query);
    let blobUrl: string = "";

    if (!id || typeof id !== "string") {
      res.status(404);
    } else {
      blobUrl = blobUrlTemplate + id.split('.')[0] + '/' + id.split('.')[1] + ".json";
    }
    console.log('ici')
    console.log(blobUrl);
    const response = await fetch(blobUrl);
    http: if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const jsonData = await response.json();

    return res.status(200).json(jsonData);
  } catch (error) {
    console.error("Error fetching JSON file:", error);
  }
}

export default getJsonFile;
