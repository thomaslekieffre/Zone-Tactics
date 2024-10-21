import { list } from "@vercel/blob";

export async function getSubscriptionStatus(
  userId: string
): Promise<"active" | "inactive"> {
  try {
    const { blobs } = await list({ prefix: `subscriptions/${userId}.json` });

    if (blobs.length === 0) {
      return "inactive";
    }

    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const subscriptionData = await response.json();
    return subscriptionData.status === "active" ? "active" : "inactive";
  } catch (error) {
    console.error(
      `Erreur lors de la vérification de l'abonnement pour l'utilisateur ${userId}:`,
      error
    );
    return "inactive";
  }
}
