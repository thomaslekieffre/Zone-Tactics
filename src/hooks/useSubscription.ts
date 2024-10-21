import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type SubscriptionStatus = "active" | "inactive" | "loading";

export function useSubscription() {
  const { isSignedIn, user } = useUser();
  const [status, setStatus] = useState<SubscriptionStatus>("loading");

  useEffect(() => {
    let isMounted = true;

    const checkSubscription = async () => {
      setStatus("loading");
      if (isSignedIn && user) {
        try {
          const response = await fetch(
            `/api/check-subscription?userId=${user.id}`
          );
          const data = await response.json();
          if (isMounted) setStatus(data.status);
        } catch (error) {
          if (isMounted) setStatus("inactive");
        }
      } else {
        if (isMounted) setStatus("inactive");
      }
    };

    checkSubscription();

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user]);

  return status;
}
