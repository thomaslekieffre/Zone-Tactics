"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireActiveSubscription } from "@/lib/subscription";

export type TacticListItem = {
  id: string;
  name: string;
  updatedAt: string;
  sequenceCount: number;
};

export async function listTactics(): Promise<TacticListItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("tactics")
    .select("id, name, updated_at, data")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[listTactics]", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    updatedAt: row.updated_at,
    sequenceCount: Array.isArray(row.data?.sequences)
      ? row.data.sequences.length
      : 0,
  }));
}

export async function duplicateTactic(id: string): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const isActive = await requireActiveSubscription();
  if (!isActive) throw new Error("Abonnement requis");

  const { data: row, error: loadErr } = await supabase
    .from("tactics")
    .select("name, data")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (loadErr || !row) throw new Error("Tactique introuvable");

  const copyLabel = `${row.name} (copie)`.slice(0, 80);
  const { data: inserted, error } = await supabase
    .from("tactics")
    .insert({
      user_id: user.id,
      name: copyLabel,
      data: row.data,
    })
    .select("id")
    .single();

  if (error || !inserted) throw new Error(error?.message ?? "Duplication impossible");

  revalidatePath("/library");
  return { id: inserted.id };
}

export async function deleteTactic(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("tactics").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/library");
}
