import { createClient } from "@/lib/supabase/server";
import type { SubscriptionStatus } from "@/lib/supabase/types";

const ACTIVE_STATUSES: SubscriptionStatus[] = ["active", "trialing"];

/** Dev / preview : tout le monde est considéré comme abonné actif (pas de Stripe). */
export function isPaidGateDisabled(): boolean {
  const v = process.env.DISABLE_PAID_GATE;
  return v === "1" || v === "true";
}

export async function getSubscriptionStatus(
  userId?: string,
): Promise<{ status: SubscriptionStatus; isActive: boolean }> {
  if (isPaidGateDisabled()) {
    return { status: "active", isActive: true };
  }

  const supabase = await createClient();
  let id = userId;
  if (!id) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    id = user?.id;
  }
  if (!id) return { status: "inactive", isActive: false };

  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", id)
    .maybeSingle();

  const status = (data?.status as SubscriptionStatus | undefined) ?? "inactive";
  return { status, isActive: ACTIVE_STATUSES.includes(status) };
}

export async function requireActiveSubscription() {
  if (isPaidGateDisabled()) return true;
  const { isActive } = await getSubscriptionStatus();
  return isActive;
}
