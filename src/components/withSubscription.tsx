import { useRouter } from "next/router";
import { useSubscription } from "../pages/hooks/useSubscription";

export function withSubscription<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithSubscriptionComponent(props: P) {
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
