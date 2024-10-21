import { useRouter } from "next/router";
import { useSubscription } from "@/hooks/useSubscription";

export function withPremiumAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithPremiumAccessComponent(props: P) {
    const subscriptionStatus = useSubscription();
    const router = useRouter();

    if (subscriptionStatus === "loading") {
      return <div>Chargement...</div>;
    }

    if (subscriptionStatus !== "active") {
      router.push("/pricing");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
