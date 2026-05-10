import type { NormPoint, PlayerPlacement } from "./types";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const normalize = (
  px: number,
  py: number,
  w: number,
  h: number,
): NormPoint => ({ x: clamp01(px / w), y: clamp01(py / h) });

export const toPx = (p: NormPoint, w: number, h: number) => ({
  x: p.x * w,
  y: p.y * h,
});

export const distanceN = (a: NormPoint, b: NormPoint) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function nearestPlayer(
  point: NormPoint,
  players: PlayerPlacement[],
  filter?: (p: PlayerPlacement) => boolean,
): PlayerPlacement | null {
  let best: { player: PlayerPlacement; d: number } | null = null;
  for (const p of players) {
    if (filter && !filter(p)) continue;
    const d = distanceN(point, p);
    if (!best || d < best.d) best = { player: p, d };
  }
  return best?.player ?? null;
}

export const playerHasBall = (
  player: PlayerPlacement,
  ball?: NormPoint,
  threshold = 0.04,
) => !!ball && distanceN(player, ball) < threshold;
