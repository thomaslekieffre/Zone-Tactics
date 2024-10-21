import { list } from "@vercel/blob";

export async function getSubscriptionStatus(
  userId: string
): Promise<"active" | "inactive"> {
  try {
    console.log(
      `Vérification du statut d'abonnement pour l'utilisateur: ${userId}`
    );
    const { blobs } = await list({ prefix: `subscriptions/${userId}.json` });
    console.log(`Blobs trouvés:`, blobs);

    if (blobs.length === 0) {
      console.log(`Aucun blob trouvé pour l'utilisateur ${userId}`);
      return "inactive";
    }

    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blobContent = await response.text();
    console.log(`Contenu du blob:`, blobContent);

    const subscriptionData = JSON.parse(blobContent);

    if (subscriptionData.status === "active") {
      console.log(`Abonnement actif pour l'utilisateur ${userId}`);
      return "active";
    }
    console.log(`Abonnement inactif pour l'utilisateur ${userId}`);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du statut d'abonnement pour l'utilisateur ${userId}:`,
      error
    );
  }

  return "inactive";
}
