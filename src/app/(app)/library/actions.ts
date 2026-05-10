"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
