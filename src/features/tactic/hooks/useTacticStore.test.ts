import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// localStorage shim for zustand persist
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  get length() {
    return this.store.size;
  }
}

vi.stubGlobal("localStorage", new MemoryStorage());

import {
  useTacticStore,
  currentPositions,
  isSetupLocked,
  courtIsEmpty,
} from "./useTacticStore";
import { EMPTY_TACTIC } from "../lib/types";

beforeEach(() => {
  useTacticStore.getState().reset();
});

afterEach(() => {
  useTacticStore.getState().reset();
});

describe("useTacticStore", () => {
  it("starts empty", () => {
    const s = useTacticStore.getState();
    expect(courtIsEmpty(s.data)).toBe(true);
    expect(s.tool).toBe("idle");
  });

  it("adds a player and tracks dirty", () => {
    const { addPlayer } = useTacticStore.getState();
    addPlayer(1, "team1", { x: 0.3, y: 0.5 });
    const s = useTacticStore.getState();
    expect(s.data.initialSetup.players).toHaveLength(1);
    expect(s.data.initialSetup.players[0]).toMatchObject({
      num: 1,
      team: "team1",
      x: 0.3,
      y: 0.5,
    });
    expect(s.dirty).toBe(true);
  });

  it("clamps coordinates to 0..1", () => {
    const { addPlayer } = useTacticStore.getState();
    addPlayer(1, "team1", { x: 2, y: -0.5 });
    const p = useTacticStore.getState().data.initialSetup.players[0];
    expect(p.x).toBe(1);
    expect(p.y).toBe(0);
  });

  it("doesn't add the same num+team twice", () => {
    const { addPlayer } = useTacticStore.getState();
    addPlayer(1, "team1", { x: 0.3, y: 0.5 });
    addPlayer(1, "team1", { x: 0.5, y: 0.5 });
    expect(useTacticStore.getState().data.initialSetup.players).toHaveLength(1);
  });

  it("validates a sequence with a movement", () => {
    const store = useTacticStore.getState();
    store.addPlayer(1, "team1", { x: 0.3, y: 0.5 });
    const playerId = useTacticStore.getState().data.initialSetup.players[0].id;
    store.setMovementTarget(playerId, { x: 0.6, y: 0.5 });

    const err = useTacticStore.getState().validateSequence();
    expect(err).toBeNull();

    const data = useTacticStore.getState().data;
    expect(data.sequences).toHaveLength(1);
    expect(data.sequences[0].movements[0]).toMatchObject({
      playerId,
      toX: 0.6,
      toY: 0.5,
    });
    expect(isSetupLocked(data)).toBe(true);
  });

  it("rejects empty validation", () => {
    const err = useTacticStore.getState().validateSequence();
    expect(err).toMatch(/Aucun mouvement/);
  });

  it("removes last sequence", () => {
    const store = useTacticStore.getState();
    store.addPlayer(1, "team1", { x: 0.3, y: 0.5 });
    const id = useTacticStore.getState().data.initialSetup.players[0].id;
    store.setMovementTarget(id, { x: 0.6, y: 0.5 });
    store.validateSequence();
    expect(useTacticStore.getState().data.sequences).toHaveLength(1);
    useTacticStore.getState().removeLastSequence();
    expect(useTacticStore.getState().data.sequences).toHaveLength(0);
  });

  it("locks initial setup once a sequence exists", () => {
    const store = useTacticStore.getState();
    store.addPlayer(1, "team1", { x: 0.3, y: 0.5 });
    const id = useTacticStore.getState().data.initialSetup.players[0].id;
    store.setMovementTarget(id, { x: 0.6, y: 0.5 });
    store.validateSequence();

    // attempt to add another player
    store.addPlayer(2, "team1", { x: 0.4, y: 0.5 });
    expect(useTacticStore.getState().data.initialSetup.players).toHaveLength(1);
  });
});

describe("currentPositions", () => {
  it("returns initial setup when no sequences", () => {
    const data = {
      ...EMPTY_TACTIC,
      initialSetup: {
        players: [{ id: "a", num: 1 as const, team: "team1" as const, x: 0.3, y: 0.5 }],
        ball: { x: 0.3, y: 0.5 },
      },
    };
    const result = currentPositions(data);
    expect(result.players[0].x).toBe(0.3);
    expect(result.ball).toEqual({ x: 0.3, y: 0.5 });
  });

  it("applies movements cumulatively", () => {
    const data = {
      version: 1 as const,
      initialSetup: {
        players: [{ id: "a", num: 1 as const, team: "team1" as const, x: 0.3, y: 0.5 }],
      },
      sequences: [
        { id: "s1", movements: [{ playerId: "a", toX: 0.6, toY: 0.5 }] },
        { id: "s2", movements: [{ playerId: "a", toX: 0.8, toY: 0.5 }] },
      ],
    };
    const result = currentPositions(data);
    expect(result.players[0]).toMatchObject({ x: 0.8, y: 0.5 });
  });

  it("moves ball with passing player", () => {
    const data = {
      version: 1 as const,
      initialSetup: {
        players: [
          { id: "a", num: 1 as const, team: "team1" as const, x: 0.3, y: 0.5 },
          { id: "b", num: 2 as const, team: "team1" as const, x: 0.6, y: 0.5 },
        ],
        ball: { x: 0.3, y: 0.5 },
      },
      sequences: [
        {
          id: "s1",
          movements: [],
          pass: { fromPlayerId: "a", toPlayerId: "b" },
        },
      ],
    };
    const result = currentPositions(data);
    expect(result.ball).toEqual({ x: 0.6, y: 0.5 });
  });
});
