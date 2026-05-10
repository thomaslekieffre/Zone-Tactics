import { createHash } from "node:crypto";

/** Doit matcher la formule SQL dans get_shared_tactic_data (extensions.digest). */
export function hashSharePin(slug: string, pin: string): string {
  const p = pin.trim();
  return createHash("sha256")
    .update(`zt_share_pin:${slug}:${p}`)
    .digest("hex");
}

export function isValidSharePin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin.trim());
}
