export type TeamId = "team1" | "team2";
export type PlayerNumber = 1 | 2 | 3 | 4 | 5;

export type NormPoint = { x: number; y: number };

export type PlayerPlacement = {
  id: string;
  num: PlayerNumber;
  team: TeamId;
  x: number;
  y: number;
};

export type InitialSetup = {
  players: PlayerPlacement[];
  ball?: NormPoint;
};

export type Movement = {
  playerId: string;
  toX: number;
  toY: number;
};

export type Sequence = {
  id: string;
  movements: Movement[];
  pass?: { fromPlayerId: string; toPlayerId: string };
  shoot?: { playerId: string };
  comment?: string;
  audioStoragePath?: string;
  durationMs?: number;
};

/** Traits et textes figés sur le parquet (hors séquences). */
export type CourtAnnotations = {
  strokes: { id: string; points: number[] }[];
  labels: { id: string; x: number; y: number; text: string }[];
};

export type TacticData = {
  version: 1;
  initialSetup: InitialSetup;
  sequences: Sequence[];
  annotations?: CourtAnnotations;
};

export const EMPTY_TACTIC: TacticData = {
  version: 1,
  initialSetup: { players: [] },
  sequences: [],
};

export const COURT_ASPECT_RATIO = 1200 / 640;
export const BASKET_NORM: NormPoint = { x: 0.92, y: 0.5 };

export const TEAM_COLORS: Record<TeamId, string> = {
  team1: "hsl(var(--team1))",
  team2: "hsl(var(--team2))",
};

export const TEAM_NUMS: PlayerNumber[] = [1, 2, 3, 4, 5];
