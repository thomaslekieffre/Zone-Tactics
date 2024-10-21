import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type SubscriptionStatus = "active" | "inactive" | "loading";

export function useSubscription() {
  const { isSignedIn, user } = useUser();
  const [status, setStatus] = useState<SubscriptionStatus>("loading");

  useEffect(() => {
    const checkSubscription = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch(`/api/check-subscription`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Statut d'abonnement reçu:", data.status);
          setStatus(data.status);
        } catch (error) {
          console.error(
            "Erreur lors de la vérification de l'abonnement:",
            error
          );
          setStatus("inactive");
        }
      } else {
        setStatus("inactive");
      }
    };

    checkSubscription();
  }, [isSignedIn, user]);

  return status;
}
