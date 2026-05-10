"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { saveTacticSchema } from "@/features/tactic/lib/validation";
import type { TacticData } from "@/features/tactic/lib/types";
import { requireActiveSubscription } from "@/lib/subscription";

export async function loadTactic(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("tactics")
    .select("id, name, data")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function saveTactic(input: {
  id: string | null;
  name: string;
  data: TacticData;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const isActive = await requireActiveSubscription();
  if (!isActive) throw new Error("Abonnement requis");

  const parsed = saveTacticSchema.parse({
    id: input.id ?? undefined,
    name: input.name,
    data: input.data,
  });

  if (parsed.id) {
    const { error } = await supabase
      .from("tactics")
      .update({ name: parsed.name, data: parsed.data })
      .eq("id", parsed.id);
    if (error) throw new Error(error.message);
    revalidatePath("/library");
    return { id: parsed.id };
  }

  const { data, error } = await supabase
    .from("tactics")
    .insert({
      user_id: user.id,
      name: parsed.name,
      data: parsed.data,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Save failed");
  revalidatePath("/library");
  return { id: data.id };
}

export async function createShare(tacticId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // ensure ownership (RLS will block otherwise but we double-check)
  const { data: tactic } = await supabase
    .from("tactics")
    .select("id")
    .eq("id", tacticId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!tactic) throw new Error("Tactique introuvable");

  const slug = nanoid(10);
  const { error } = await supabase.from("shares").insert({
    tactic_id: tacticId,
    slug,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);

  return { slug };
}
