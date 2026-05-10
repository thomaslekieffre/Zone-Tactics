import { describe, expect, it } from "vitest";
import { clamp01, distanceN, nearestPlayer, normalize, toPx } from "./geometry";

describe("clamp01", () => {
  it("clamps", () => {
    expect(clamp01(-0.5)).toBe(0);
    expect(clamp01(1.5)).toBe(1);
    expect(clamp01(0.4)).toBe(0.4);
  });
});

describe("normalize / toPx", () => {
  it("round trips", () => {
    const w = 800;
    const h = 500;
    const n = normalize(400, 250, w, h);
    expect(n.x).toBe(0.5);
    expect(n.y).toBe(0.5);
    const px = toPx(n, w, h);
    expect(px.x).toBe(400);
    expect(px.y).toBe(250);
  });

  it("clamps out-of-bounds points", () => {
    const n = normalize(-100, 9999, 800, 500);
    expect(n.x).toBe(0);
    expect(n.y).toBe(1);
  });
});

describe("distanceN / nearestPlayer", () => {
  it("computes distance", () => {
    expect(distanceN({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  it("finds nearest with filter", () => {
    const players = [
      { id: "a", num: 1 as const, team: "team1" as const, x: 0.1, y: 0.1 },
      { id: "b", num: 2 as const, team: "team2" as const, x: 0.2, y: 0.2 },
      { id: "c", num: 3 as const, team: "team1" as const, x: 0.5, y: 0.5 },
    ];
    const got = nearestPlayer(
      { x: 0.6, y: 0.5 },
      players,
      (p) => p.team === "team1",
    );
    expect(got?.id).toBe("c");
  });
});
