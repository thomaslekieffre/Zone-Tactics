import { describe, expect, it, vi } from "vitest";
import { playTactic } from "./playback";
import { BASKET_NORM, type TacticData } from "./types";

// Stub minimal de requestAnimationFrame / performance.now compatible avec Vitest node env.
function rafShim() {
  let now = 0;
  const orig = {
    raf: globalThis.requestAnimationFrame,
    caf: globalThis.cancelAnimationFrame,
    perf: globalThis.performance,
  };
  let id = 0;
  const handles = new Map<number, ReturnType<typeof setTimeout>>();
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    const myId = ++id;
    const handle = setTimeout(() => {
      now += 16;
      cb(now);
    }, 0);
    handles.set(myId, handle);
    return myId;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = ((cbId: number) => {
    const h = handles.get(cbId);
    if (h) clearTimeout(h);
  }) as typeof cancelAnimationFrame;
  globalThis.performance = {
    now: () => now,
  } as Performance;
  return () => {
    globalThis.requestAnimationFrame = orig.raf;
    globalThis.cancelAnimationFrame = orig.caf;
    globalThis.performance = orig.perf;
  };
}

const baseTactic: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "a", num: 1, team: "team1", x: 0.2, y: 0.5 },
      { id: "b", num: 2, team: "team1", x: 0.6, y: 0.5 },
    ],
    ball: { x: 0.2, y: 0.5 },
  },
  sequences: [
    {
      id: "s1",
      movements: [{ playerId: "a", toX: 0.5, toY: 0.5 }],
    },
  ],
};

describe("playTactic", () => {
  it("emits frames and ends with players at target positions", async () => {
    const restore = rafShim();
    const frames: { players: { id: string; x: number; y: number }[] }[] = [];
    try {
      await playTactic(baseTactic, {
        sequenceMs: 50,
        pauseBetweenMs: 10,
        onFrame: (f) =>
          frames.push({
            players: f.players.map((p) => ({ id: p.id, x: p.x, y: p.y })),
          }),
      });
    } finally {
      restore();
    }
    expect(frames.length).toBeGreaterThan(2);
    const final = frames.at(-1)!;
    const a = final.players.find((p) => p.id === "a")!;
    expect(a.x).toBeCloseTo(0.5, 2);
    expect(a.y).toBeCloseTo(0.5, 2);
  });

  it("aborts mid-playback", async () => {
    const restore = rafShim();
    const ctrl = new AbortController();
    let frameCount = 0;
    const promise = playTactic(baseTactic, {
      sequenceMs: 100,
      pauseBetweenMs: 10,
      signal: ctrl.signal,
      onFrame: () => {
        frameCount++;
        if (frameCount === 2) ctrl.abort();
      },
    });
    try {
      await promise;
    } finally {
      restore();
    }
    expect(frameCount).toBeLessThan(20);
  });

  it("moves ball to basket on shoot", async () => {
    const restore = rafShim();
    const tactic: TacticData = {
      version: 1,
      initialSetup: {
        players: [{ id: "a", num: 1, team: "team1", x: 0.2, y: 0.5 }],
        ball: { x: 0.2, y: 0.5 },
      },
      sequences: [
        {
          id: "s1",
          movements: [],
          shoot: { playerId: "a" },
        },
      ],
    };
    const onFrame = vi.fn();
    try {
      await playTactic(tactic, {
        sequenceMs: 30,
        pauseBetweenMs: 5,
        onFrame,
      });
    } finally {
      restore();
    }
    const lastFrame = onFrame.mock.calls.at(-1)?.[0];
    expect(lastFrame.ball.x).toBeCloseTo(BASKET_NORM.x, 2);
    expect(lastFrame.ball.y).toBeCloseTo(BASKET_NORM.y, 2);
  });

  it("moves ball to receiver on pass", async () => {
    const restore = rafShim();
    const tactic: TacticData = {
      version: 1,
      initialSetup: {
        players: [
          { id: "a", num: 1, team: "team1", x: 0.2, y: 0.5 },
          { id: "b", num: 2, team: "team1", x: 0.7, y: 0.4 },
        ],
        ball: { x: 0.2, y: 0.5 },
      },
      sequences: [
        {
          id: "s1",
          movements: [],
          pass: { fromPlayerId: "a", toPlayerId: "b" },
        },
      ],
    };
    const onFrame = vi.fn();
    try {
      await playTactic(tactic, {
        sequenceMs: 30,
        pauseBetweenMs: 5,
        onFrame,
      });
    } finally {
      restore();
    }
    const lastFrame = onFrame.mock.calls.at(-1)?.[0];
    expect(lastFrame.ball.x).toBeCloseTo(0.7, 2);
    expect(lastFrame.ball.y).toBeCloseTo(0.4, 2);
  });

  it("calls onSequenceStart and onSequenceEnd in order", async () => {
    const restore = rafShim();
    const events: string[] = [];
    const tactic: TacticData = {
      ...baseTactic,
      sequences: [
        baseTactic.sequences[0],
        {
          id: "s2",
          movements: [{ playerId: "b", toX: 0.8, toY: 0.5 }],
        },
      ],
    };
    try {
      await playTactic(tactic, {
        sequenceMs: 20,
        pauseBetweenMs: 5,
        onFrame: () => {},
        onSequenceStart: (_, i) => events.push(`start-${i}`),
        onSequenceEnd: (_, i) => events.push(`end-${i}`),
      });
    } finally {
      restore();
    }
    expect(events).toEqual(["start-0", "end-0", "start-1", "end-1"]);
  });
});
