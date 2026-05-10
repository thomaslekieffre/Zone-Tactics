import type { User } from "@supabase/supabase-js";
import type { ProfileRow } from "./types";

/** Affichage username : table profiles > metadata signup > partie locale de l’email */
export function displayUsername(user: User, profile: ProfileRow | null): string {
  const meta = user.user_metadata as { username?: unknown };
  const fromMeta =
    typeof meta.username === "string" && meta.username.trim().length > 0
      ? meta.username.trim()
      : null;
  const fromProfile =
    profile?.username && profile.username.trim().length > 0
      ? profile.username.trim()
      : null;
  const fromEmail = user.email?.split("@")[0]?.trim() || null;
  return fromProfile ?? fromMeta ?? fromEmail ?? "—";
}

/** Date d’inscription : profiles.created_at sinon auth created_at */
export function displayMemberSince(user: User, profile: ProfileRow | null): string {
  const iso = profile?.created_at ?? user.created_at;
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
