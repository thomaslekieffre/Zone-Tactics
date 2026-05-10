"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  NormPoint,
  PlayerNumber,
  PlayerPlacement,
  Sequence,
  TacticData,
  TeamId,
} from "../lib/types";
import { EMPTY_TACTIC, BASKET_NORM } from "../lib/types";
import { clamp01 } from "../lib/geometry";

export type Tool = "idle" | "arrow" | "pass" | "shoot";

type DraftPass = {
  fromPlayerId: string;
  toPlayerId: string | null;
};

export type TacticStore = {
  tacticId: string | null;
  name: string;
  data: TacticData;

  tool: Tool;
  /** Player whose movement is currently being drawn (arrow start) */
  arrowFromPlayerId: string | null;
  /** Pending movement targets keyed by playerId, applied on validate */
  draftMovements: Record<string, NormPoint>;
  draftPass: DraftPass | null;
  shootPlayerId: string | null;

  dirty: boolean;
  isPlaying: boolean;

  setName: (name: string) => void;
  setTool: (tool: Tool) => void;

  hydrate: (input: { id: string | null; name: string; data: TacticData }) => void;
  reset: () => void;
  markSaved: () => void;
  /** Met à jour l'id de la tactique (utilisé après la 1re sauvegarde auto). */
  setTacticId: (id: string) => void;

  addPlayer: (num: PlayerNumber, team: TeamId, point: NormPoint) => void;
  movePlayerInitial: (playerId: string, point: NormPoint) => void;
  removePlayer: (playerId: string) => void;
  setBall: (point: NormPoint | null) => void;
  giveBallToPlayer: (playerId: string) => void;

  pickArrowFrom: (playerId: string) => void;
  setMovementTarget: (playerId: string, point: NormPoint) => void;
  clearMovementTarget: (playerId: string) => void;
  pickPassFrom: (playerId: string) => void;
  setPassTarget: (playerId: string) => void;
  pickShootPlayer: (playerId: string) => void;
  cancelDraft: () => void;

  validateSequence: () => string | null;
  removeLastSequence: () => void;
  setSequenceComment: (sequenceId: string, comment: string) => void;
  setSequenceAudio: (sequenceId: string, path: string | null) => void;

  setIsPlaying: (v: boolean) => void;
};

const initialDraft = {
  arrowFromPlayerId: null as string | null,
  draftMovements: {} as Record<string, NormPoint>,
  draftPass: null as DraftPass | null,
  shootPlayerId: null as string | null,
};

export const useTacticStore = create<TacticStore>()(
  persist(
    (set, get) => ({
      tacticId: null,
      name: "",
      data: EMPTY_TACTIC,
      tool: "idle",
      ...initialDraft,
      dirty: false,
      isPlaying: false,

      setName: (name) => set({ name: name.slice(0, 80), dirty: true }),
      setTool: (tool) =>
        set((s) => ({
          tool,
          // when changing tool, clear in-flight draft for that mode
          arrowFromPlayerId: tool === "arrow" ? s.arrowFromPlayerId : null,
          draftPass: tool === "pass" ? s.draftPass : null,
        })),

      hydrate: ({ id, name, data }) =>
        set({
          tacticId: id,
          name,
          data,
          dirty: false,
          tool: "idle",
          ...initialDraft,
        }),

      reset: () =>
        set({
          tacticId: null,
          name: "",
          data: EMPTY_TACTIC,
          dirty: false,
          tool: "idle",
          ...initialDraft,
        }),

      markSaved: () => set({ dirty: false }),

      setTacticId: (id) => set({ tacticId: id }),

      addPlayer: (num, team, point) =>
        set((s) => {
          if (s.data.sequences.length > 0) return s;
          if (
            s.data.initialSetup.players.some(
              (p) => p.num === num && p.team === team,
            )
          )
            return s;
          const placement: PlayerPlacement = {
            id: nanoid(8),
            num,
            team,
            x: clamp01(point.x),
            y: clamp01(point.y),
          };
          // Donne automatiquement le ballon au premier joueur team1 placé,
          // pour que le ballon soit visible sans nécessiter un clic supplémentaire.
          const shouldAutoBall =
            !s.data.initialSetup.ball &&
            team === "team1" &&
            !s.data.initialSetup.players.some((p) => p.team === "team1");
          return {
            data: {
              ...s.data,
              initialSetup: {
                ...s.data.initialSetup,
                players: [...s.data.initialSetup.players, placement],
                ball: shouldAutoBall
                  ? { x: placement.x, y: placement.y }
                  : s.data.initialSetup.ball,
              },
            },
            dirty: true,
          };
        }),

      movePlayerInitial: (playerId, point) =>
        set((s) => {
          if (s.data.sequences.length > 0) return s;
          return {
            data: {
              ...s.data,
              initialSetup: {
                ...s.data.initialSetup,
                players: s.data.initialSetup.players.map((p) =>
                  p.id === playerId
                    ? { ...p, x: clamp01(point.x), y: clamp01(point.y) }
                    : p,
                ),
              },
            },
            dirty: true,
          };
        }),

      removePlayer: (playerId) =>
        set((s) => {
          if (s.data.sequences.length > 0) return s;
          return {
            data: {
              ...s.data,
              initialSetup: {
                ...s.data.initialSetup,
                players: s.data.initialSetup.players.filter(
                  (p) => p.id !== playerId,
                ),
              },
            },
            dirty: true,
          };
        }),

      setBall: (point) =>
        set((s) => {
          if (s.data.sequences.length > 0) return s;
          return {
            data: {
              ...s.data,
              initialSetup: {
                ...s.data.initialSetup,
                ball: point ?? undefined,
              },
            },
            dirty: true,
          };
        }),

      giveBallToPlayer: (playerId) =>
        set((s) => {
          const player = s.data.initialSetup.players.find(
            (p) => p.id === playerId,
          );
          if (!player) return s;
          return {
            data: {
              ...s.data,
              initialSetup: {
                ...s.data.initialSetup,
                ball: { x: player.x, y: player.y },
              },
            },
            dirty: true,
          };
        }),

      pickArrowFrom: (playerId) =>
        set({ tool: "arrow", arrowFromPlayerId: playerId }),

      setMovementTarget: (playerId, point) =>
        set((s) => ({
          draftMovements: {
            ...s.draftMovements,
            [playerId]: { x: clamp01(point.x), y: clamp01(point.y) },
          },
          arrowFromPlayerId: null,
          tool: "idle",
        })),

      clearMovementTarget: (playerId) =>
        set((s) => {
          const next = { ...s.draftMovements };
          delete next[playerId];
          return { draftMovements: next };
        }),

      pickPassFrom: (playerId) =>
        set({ tool: "pass", draftPass: { fromPlayerId: playerId, toPlayerId: null } }),

      setPassTarget: (toPlayerId) =>
        set((s) => {
          if (!s.draftPass) return s;
          return {
            draftPass: { ...s.draftPass, toPlayerId },
            tool: "idle",
          };
        }),

      pickShootPlayer: (playerId) =>
        set({ shootPlayerId: playerId, tool: "shoot" }),

      cancelDraft: () =>
        set({
          tool: "idle",
          ...initialDraft,
        }),

      validateSequence: () => {
        const s = get();
        const movements = Object.entries(s.draftMovements).map(
          ([playerId, pt]) => ({ playerId, toX: pt.x, toY: pt.y }),
        );
        const hasPass =
          !!s.draftPass &&
          !!s.draftPass.fromPlayerId &&
          !!s.draftPass.toPlayerId;
        const hasShoot = !!s.shootPlayerId;

        if (movements.length === 0 && !hasPass && !hasShoot) {
          return "Aucun mouvement à valider.";
        }

        const seq: Sequence = {
          id: nanoid(8),
          movements,
          pass:
            hasPass && s.draftPass
              ? {
                  fromPlayerId: s.draftPass.fromPlayerId,
                  toPlayerId: s.draftPass.toPlayerId!,
                }
              : undefined,
          shoot: s.shootPlayerId ? { playerId: s.shootPlayerId } : undefined,
        };

        set({
          data: { ...s.data, sequences: [...s.data.sequences, seq] },
          dirty: true,
          tool: "idle",
          ...initialDraft,
        });
        return null;
      },

      removeLastSequence: () =>
        set((s) => {
          if (s.data.sequences.length === 0) return s;
          return {
            data: {
              ...s.data,
              sequences: s.data.sequences.slice(0, -1),
            },
            dirty: true,
          };
        }),

      setSequenceComment: (sequenceId, comment) =>
        set((s) => ({
          data: {
            ...s.data,
            sequences: s.data.sequences.map((seq) =>
              seq.id === sequenceId ? { ...seq, comment } : seq,
            ),
          },
          dirty: true,
        })),

      setSequenceAudio: (sequenceId, path) =>
        set((s) => ({
          data: {
            ...s.data,
            sequences: s.data.sequences.map((seq) =>
              seq.id === sequenceId
                ? { ...seq, audioStoragePath: path ?? undefined }
                : seq,
            ),
          },
          dirty: true,
        })),

      setIsPlaying: (v) => set({ isPlaying: v }),
    }),
    {
      name: "zt-tactic-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tacticId: s.tacticId,
        name: s.name,
        data: s.data,
        dirty: s.dirty,
      }),
    },
  ),
);

/**
 * Compute the current state on the court = initial setup + cumulated end of all sequences.
 */
export function currentPositions(data: TacticData): {
  players: PlayerPlacement[];
  ball?: NormPoint;
} {
  let players = data.initialSetup.players.map((p) => ({ ...p }));
  let ball = data.initialSetup.ball ? { ...data.initialSetup.ball } : undefined;

  for (const seq of data.sequences) {
    const ballHolder = ball
      ? players.find((p) => Math.hypot(p.x - ball!.x, p.y - ball!.y) < 0.04)
      : undefined;

    const moveMap = new Map(
      seq.movements.map((m) => [m.playerId, { x: m.toX, y: m.toY }]),
    );
    players = players.map((p) =>
      moveMap.has(p.id) ? { ...p, ...moveMap.get(p.id)! } : p,
    );

    if (seq.pass) {
      const target = players.find((p) => p.id === seq.pass!.toPlayerId);
      if (target) ball = { x: target.x, y: target.y };
    } else if (seq.shoot) {
      ball = { ...BASKET_NORM };
    } else if (ballHolder) {
      const moved = moveMap.get(ballHolder.id);
      if (moved) ball = { x: moved.x, y: moved.y };
    }
  }

  return { players, ball };
}

export const courtIsEmpty = (data: TacticData) =>
  data.initialSetup.players.length === 0 && !data.initialSetup.ball;

export const isSetupLocked = (data: TacticData) => data.sequences.length > 0;
