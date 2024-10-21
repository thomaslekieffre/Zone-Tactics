import { list } from "@vercel/blob";

export async function getSubscriptionStatus(
  userId: string
): Promise<"active" | "inactive"> {
  try {
    console.log(`Début de la vérification pour l'utilisateur: ${userId}`);
    const { blobs } = await list();

    console.log(
      "Tous les blobs trouvés:",
      blobs.map((b) => b.pathname)
    );

    const userBlob = blobs.find((blob) =>
      blob.pathname.startsWith(`subscriptions/${userId}`)
    );

    if (!userBlob) {
      console.log(`Aucun blob trouvé pour l'utilisateur ${userId}`);
      return "inactive";
    }

    console.log(`Blob trouvé pour l'utilisateur ${userId}:`, userBlob);

    const response = await fetch(userBlob.url);
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
