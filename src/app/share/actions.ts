"use server";

import { createClient } from "@/lib/supabase/server";
import { tacticDataSchema } from "@/features/tactic/lib/validation";
import type { TacticData } from "@/features/tactic/lib/types";

export async function unlockSharedTactic(
  slug: string,
  pin: string,
): Promise<
  | { ok: true; id: string; name: string; data: TacticData }
  | { ok: false; badPin?: boolean }
> {
  const supabase = await createClient();
  const { data: raw, error } = await supabase.rpc("get_shared_tactic_data", {
    p_slug: slug,
    p_pin: pin.trim(),
  });

  if (error || raw == null || typeof raw !== "object") {
    return { ok: false };
  }

  const row = raw as Record<string, unknown>;
  if (row.ok === false) return { ok: false };
  if (row.locked === true) {
    return { ok: false, badPin: row.bad_pin === true };
  }

  const parsed = tacticDataSchema.safeParse(row.data);
  if (!parsed.success) return { ok: false };

  return {
    ok: true,
    id: String(row.id),
    name: String(row.name),
    data: parsed.data,
  };
}
