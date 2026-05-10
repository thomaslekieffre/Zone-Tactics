import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import type { ProfileRow } from "./types";

/**
 * Garantit une ligne `profiles` pour l’utilisateur courant (session serveur).
 * Utile si le trigger à la création du compte n’a pas tourné.
 */
export async function ensureProfileRow(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<ProfileRow | null> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const meta = user.user_metadata as { username?: unknown };
  const username =
    typeof meta.username === "string" && meta.username.trim().length > 0
      ? meta.username.trim().slice(0, 30)
      : user.email?.split("@")[0]?.slice(0, 30) ?? "user";

  const { data: inserted, error } = await supabase
    .from("profiles")
    .insert({ id: user.id, username })
    .select("*")
    .single();

  if (error) {
    console.warn("[ensureProfileRow]", error.message);
    return null;
  }

  return inserted;
}
