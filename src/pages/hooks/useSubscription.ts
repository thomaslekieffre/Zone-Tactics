import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type SubscriptionStatus = "active" | "inactive" | "loading";

export function useSubscription() {
  const { isSignedIn, user } = useUser();
  const [status, setStatus] = useState<SubscriptionStatus>("loading");

  useEffect(() => {
    if (isSignedIn && user) {
      fetch(`/api/check-subscription?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.status);
        })
        .catch(() => setStatus("inactive"));
    } else {
      setStatus("inactive");
    }
  }, [isSignedIn, user]);

  return status;
}
