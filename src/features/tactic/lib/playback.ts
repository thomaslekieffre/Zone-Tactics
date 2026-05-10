import type { NormPoint, PlayerPlacement, Sequence, TacticData } from "./types";
import { BASKET_NORM } from "./types";

export type PlaybackFrame = {
  players: PlayerPlacement[];
  ball?: NormPoint;
};

export type EaseFn = (t: number) => number;

export type PlaybackOptions = {
  sequenceMs?: number;
  pauseBetweenMs?: number;
  /** Easing function. Default: easeOutCubic (snappy départ, fin smooth). */
  ease?: EaseFn;
  onFrame: (frame: PlaybackFrame, ctx: { sequenceIndex: number; t: number }) => void;
  onSequenceStart?: (sequence: Sequence, index: number) => void;
  onSequenceEnd?: (sequence: Sequence, index: number) => void;
  signal?: AbortSignal;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut: EaseFn = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
export const easeOutCubic: EaseFn = (t) => 1 - Math.pow(1 - t, 3);

export async function playTactic(
  data: TacticData,
  opts: PlaybackOptions,
): Promise<void> {
  const {
    sequenceMs = 850,
    pauseBetweenMs = 250,
    ease = easeOutCubic,
    onFrame,
    signal,
  } = opts;
  let players = data.initialSetup.players.map((p) => ({ ...p }));
  let ball = data.initialSetup.ball ? { ...data.initialSetup.ball } : undefined;

  onFrame({ players, ball }, { sequenceIndex: -1, t: 0 });

  await sleep(pauseBetweenMs, signal);
  if (signal?.aborted) return;

  for (let i = 0; i < data.sequences.length; i++) {
    const seq = data.sequences[i];
    opts.onSequenceStart?.(seq, i);

    const moveMap = new Map(
      seq.movements.map((m) => [m.playerId, { x: m.toX, y: m.toY }]),
    );
    const startPlayers = players.map((p) => ({ ...p }));
    const targetPlayers = players.map((p) =>
      moveMap.has(p.id) ? { ...p, ...moveMap.get(p.id)! } : p,
    );

    const startBall = ball ? { ...ball } : undefined;
    let endBall: NormPoint | undefined;
    if (seq.pass) {
      const target = targetPlayers.find((p) => p.id === seq.pass!.toPlayerId);
      endBall = target ? { x: target.x, y: target.y } : startBall;
    } else if (seq.shoot) {
      endBall = { ...BASKET_NORM };
    } else if (startBall) {
      const holder = startPlayers.find(
        (p) => Math.hypot(p.x - startBall.x, p.y - startBall.y) < 0.04,
      );
      if (holder && moveMap.has(holder.id)) {
        const m = moveMap.get(holder.id)!;
        endBall = { x: m.x, y: m.y };
      } else {
        endBall = startBall;
      }
    }

    await tween(sequenceMs, (t) => {
      const e = ease(t);
      const pls = startPlayers.map((sp, idx) => {
        const tp = targetPlayers[idx];
        return { ...sp, x: lerp(sp.x, tp.x, e), y: lerp(sp.y, tp.y, e) };
      });
      const b =
        startBall && endBall
          ? { x: lerp(startBall.x, endBall.x, e), y: lerp(startBall.y, endBall.y, e) }
          : (endBall ?? startBall);
      onFrame({ players: pls, ball: b }, { sequenceIndex: i, t });
    }, signal);

    if (signal?.aborted) return;

    players = targetPlayers;
    ball = endBall;
    onFrame({ players, ball }, { sequenceIndex: i, t: 1 });

    opts.onSequenceEnd?.(seq, i);
    await sleep(pauseBetweenMs, signal);
    if (signal?.aborted) return;
  }
}

function tween(
  durationMs: number,
  onTick: (t: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      if (signal?.aborted) {
        cancelAnimationFrame(raf);
        resolve();
        return;
      }
      const t = Math.min((now - start) / durationMs, 1);
      onTick(t);
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    raf = requestAnimationFrame(step);
  });
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) return resolve();
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      resolve();
    });
  });
}
