import type { TacticData } from "./types";
import { EMPTY_TACTIC } from "./types";
import { DEMO_TACTIC } from "./demoTactic";

/** Alignement type zone 2-3 — squelette pour démarrer vite. */
export const ZONE_23_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "t1a", num: 1, team: "team1", x: 0.38, y: 0.5 },
      { id: "t2a", num: 2, team: "team1", x: 0.55, y: 0.22 },
      { id: "t3a", num: 3, team: "team1", x: 0.55, y: 0.78 },
      { id: "t4a", num: 4, team: "team1", x: 0.72, y: 0.35 },
      { id: "t5a", num: 5, team: "team1", x: 0.72, y: 0.65 },
      { id: "t1d", num: 1, team: "team2", x: 0.88, y: 0.5 },
      { id: "t2d", num: 2, team: "team2", x: 0.68, y: 0.18 },
      { id: "t3d", num: 3, team: "team2", x: 0.68, y: 0.82 },
      { id: "t4d", num: 4, team: "team2", x: 0.52, y: 0.32 },
      { id: "t5d", num: 5, team: "team2", x: 0.52, y: 0.68 },
    ],
    ball: { x: 0.38, y: 0.5 },
  },
  sequences: [],
};

export const TACTIC_TEMPLATES: Record<
  string,
  { label: string; data: TacticData }
> = {
  "pick-roll": { label: "Pick & roll", data: DEMO_TACTIC },
  "zone-23": { label: "Zone 2-3 (squelette)", data: ZONE_23_TEMPLATE },
  vide: { label: "Terrain vide", data: EMPTY_TACTIC },
};

export const TEMPLATE_KEYS = Object.keys(TACTIC_TEMPLATES);

export function getTemplateData(key: string | undefined): TacticData {
  if (!key) return EMPTY_TACTIC;
  const entry = TACTIC_TEMPLATES[key];
  return entry?.data ?? EMPTY_TACTIC;
}
