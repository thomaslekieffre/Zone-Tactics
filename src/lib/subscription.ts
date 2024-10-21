import { list } from "@vercel/blob";

export async function getSubscriptionStatus(
  userId: string
): Promise<"active" | "inactive"> {
  try {
    const { blobs } = await list({ prefix: `subscriptions/${userId}.json` });
    if (blobs.length === 0) {
      return "inactive";
    }

    const blobBuffer = await fetch(blobs[0].url).then((res) =>
      res.arrayBuffer()
    );
    const blobContent = new TextDecoder().decode(blobBuffer);
    const subscriptionData = JSON.parse(blobContent);

    if (subscriptionData.status === "active") {
      return "active";
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du statut d'abonnement:",
      error
    );
  }

  return "inactive";
}
