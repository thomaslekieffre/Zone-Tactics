import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import stripe from "@/lib/stripe";
import { list, del } from "@vercel/blob";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    // Récupérer l'ID de l'abonnement depuis Blob
    const { blobs } = await list({ prefix: `subscriptions/${userId}` });
    const subscriptionBlob = blobs[0];

    if (!subscriptionBlob) {
      return res.status(404).json({ error: "Abonnement non trouvé" });
    }

    const subscriptionData = await fetch(subscriptionBlob.url).then((r) =>
      r.json()
    );
    const { subscriptionId } = subscriptionData;

    // Annuler l'abonnement dans Stripe
    await stripe.subscriptions.cancel(subscriptionId);

    // Supprimer le fichier d'abonnement de Blob
    await del(subscriptionBlob.url);

    res.status(200).json({ message: "Abonnement résilié avec succès" });
  } catch (error) {
    console.error("Erreur lors de la résiliation de l'abonnement:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
