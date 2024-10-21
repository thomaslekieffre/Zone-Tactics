import { list } from "@vercel/blob";

export async function getSubscriptionStatus(
  userId: string
): Promise<"active" | "inactive"> {
  try {
    console.log(`Vérification de l'abonnement pour l'utilisateur: ${userId}`);
    const { blobs } = await list({ prefix: `subscriptions/${userId}.json` });

    console.log("Blobs trouvés:", blobs);

    if (blobs.length === 0) {
      console.log(`Aucun abonnement trouvé pour l'utilisateur ${userId}`);
      return "inactive";
    }

    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }

    const subscriptionData = await response.json();
    console.log(`Données d'abonnement pour ${userId}:`, subscriptionData);

    if (subscriptionData.status === "active") {
      console.log(`Abonnement actif pour l'utilisateur ${userId}`);
      return "active";
    } else {
      console.log(`Abonnement inactif pour l'utilisateur ${userId}`);
      return "inactive";
    }
  } catch (error) {
    console.error(
      `Erreur lors de la vérification de l'abonnement pour l'utilisateur ${userId}:`,
      error
    );
    return "inactive";
  }
}
