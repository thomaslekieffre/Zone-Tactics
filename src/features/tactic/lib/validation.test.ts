import { describe, expect, it } from "vitest";
import {
  saveTacticSchema,
  tacticDataSchema,
  playerPlacementSchema,
} from "./validation";
import { EMPTY_TACTIC } from "./types";

describe("playerPlacementSchema", () => {
  it("accepts a valid placement", () => {
    const r = playerPlacementSchema.safeParse({
      id: "p1",
      num: 1,
      team: "team1",
      x: 0.5,
      y: 0.5,
    });
    expect(r.success).toBe(true);
  });

  it("rejects out-of-range coords", () => {
    const r = playerPlacementSchema.safeParse({
      id: "p1",
      num: 1,
      team: "team1",
      x: 1.2,
      y: 0.5,
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown team", () => {
    const r = playerPlacementSchema.safeParse({
      id: "p1",
      num: 1,
      team: "team3",
      x: 0.5,
      y: 0.5,
    });
    expect(r.success).toBe(false);
  });

  it("rejects num outside 1..5", () => {
    const r = playerPlacementSchema.safeParse({
      id: "p1",
      num: 6,
      team: "team1",
      x: 0.5,
      y: 0.5,
    });
    expect(r.success).toBe(false);
  });
});

describe("tacticDataSchema", () => {
  it("accepts an empty tactic", () => {
    const r = tacticDataSchema.safeParse(EMPTY_TACTIC);
    expect(r.success).toBe(true);
  });

  it("accepts annotations optionnelles", () => {
    const r = tacticDataSchema.safeParse({
      ...EMPTY_TACTIC,
      annotations: {
        strokes: [{ id: "s1", points: [0.1, 0.2, 0.3, 0.4] }],
        labels: [{ id: "l1", x: 0.5, y: 0.5, text: "ATO" }],
      },
    });
    expect(r.success).toBe(true);
  });

  it("rejects max 10 players", () => {
    const players = Array.from({ length: 11 }, (_, i) => ({
      id: `p${i}`,
      num: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
      team: i < 5 ? ("team1" as const) : ("team2" as const),
      x: 0.5,
      y: 0.5,
    }));
    const r = tacticDataSchema.safeParse({
      version: 1,
      initialSetup: { players },
      sequences: [],
    });
    expect(r.success).toBe(false);
  });

  it("rejects bad version", () => {
    const r = tacticDataSchema.safeParse({
      version: 2,
      initialSetup: { players: [] },
      sequences: [],
    });
    expect(r.success).toBe(false);
  });
});

describe("saveTacticSchema", () => {
  it("accepts a valid save input without id", () => {
    const r = saveTacticSchema.safeParse({
      name: "Mon ATO",
      data: EMPTY_TACTIC,
    });
    expect(r.success).toBe(true);
  });

  it("trims and rejects empty name", () => {
    const r = saveTacticSchema.safeParse({
      name: "   ",
      data: EMPTY_TACTIC,
    });
    expect(r.success).toBe(false);
  });

  it("rejects name > 80", () => {
    const r = saveTacticSchema.safeParse({
      name: "x".repeat(81),
      data: EMPTY_TACTIC,
    });
    expect(r.success).toBe(false);
  });

  it("requires id to be a uuid when provided", () => {
    const r = saveTacticSchema.safeParse({
      id: "not-a-uuid",
      name: "ok",
      data: EMPTY_TACTIC,
    });
    expect(r.success).toBe(false);
  });
});
