import type { TacticData } from "./types";
import { EMPTY_TACTIC } from "./types";
import { DEMO_TACTIC } from "./demoTactic";

export type TemplateMeta = {
  label: string;
  /** Court texte pour LP / menu */
  blurb: string;
  data: TacticData;
};

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

/** Horns + spacing pour flare / reject / Spain entry. */
export const HORNS_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "h1", num: 1, team: "team1", x: 0.42, y: 0.5 },
      { id: "h2", num: 2, team: "team1", x: 0.22, y: 0.22 },
      { id: "h3", num: 3, team: "team1", x: 0.22, y: 0.78 },
      { id: "h4", num: 4, team: "team1", x: 0.34, y: 0.38 },
      { id: "h5", num: 5, team: "team1", x: 0.34, y: 0.62 },
      { id: "d1", num: 1, team: "team2", x: 0.58, y: 0.5 },
      { id: "d2", num: 2, team: "team2", x: 0.38, y: 0.2 },
      { id: "d3", num: 3, team: "team2", x: 0.38, y: 0.8 },
      { id: "d4", num: 4, team: "team2", x: 0.48, y: 0.36 },
      { id: "d5", num: 5, team: "team2", x: 0.48, y: 0.64 },
    ],
    ball: { x: 0.42, y: 0.5 },
  },
  sequences: [],
};

/** Iso côté fort — spacing faible côté. */
export const ISO_WING_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "i1", num: 1, team: "team1", x: 0.78, y: 0.42 },
      { id: "i2", num: 2, team: "team1", x: 0.42, y: 0.18 },
      { id: "i3", num: 3, team: "team1", x: 0.35, y: 0.82 },
      { id: "i4", num: 4, team: "team1", x: 0.28, y: 0.38 },
      { id: "i5", num: 5, team: "team1", x: 0.52, y: 0.62 },
      { id: "id1", num: 1, team: "team2", x: 0.82, y: 0.44 },
      { id: "id2", num: 2, team: "team2", x: 0.55, y: 0.22 },
      { id: "id3", num: 3, team: "team2", x: 0.48, y: 0.78 },
      { id: "id4", num: 4, team: "team2", x: 0.38, y: 0.48 },
      { id: "id5", num: 5, team: "team2", x: 0.62, y: 0.55 },
    ],
    ball: { x: 0.78, y: 0.42 },
  },
  sequences: [],
};

/** Spain PNR — coin + wing + top. */
export const SPAIN_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "s1", num: 1, team: "team1", x: 0.48, y: 0.55 },
      { id: "s2", num: 2, team: "team1", x: 0.88, y: 0.72 },
      { id: "s3", num: 3, team: "team1", x: 0.88, y: 0.28 },
      { id: "s4", num: 4, team: "team1", x: 0.72, y: 0.48 },
      { id: "s5", num: 5, team: "team1", x: 0.62, y: 0.52 },
      { id: "sd1", num: 1, team: "team2", x: 0.58, y: 0.52 },
      { id: "sd2", num: 2, team: "team2", x: 0.82, y: 0.75 },
      { id: "sd3", num: 3, team: "team2", x: 0.82, y: 0.25 },
      { id: "sd4", num: 4, team: "team2", x: 0.68, y: 0.42 },
      { id: "sd5", num: 5, team: "team2", x: 0.68, y: 0.58 },
    ],
    ball: { x: 0.48, y: 0.55 },
  },
  sequences: [],
};

/** Transition attaque rapide — lanes + trailers. */
export const TRANSITION_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "tr1", num: 1, team: "team1", x: 0.55, y: 0.5 },
      { id: "tr2", num: 2, team: "team1", x: 0.78, y: 0.28 },
      { id: "tr3", num: 3, team: "team1", x: 0.82, y: 0.5 },
      { id: "tr4", num: 4, team: "team1", x: 0.42, y: 0.42 },
      { id: "tr5", num: 5, team: "team1", x: 0.42, y: 0.58 },
      { id: "td1", num: 1, team: "team2", x: 0.88, y: 0.5 },
      { id: "td2", num: 2, team: "team2", x: 0.72, y: 0.24 },
      { id: "td3", num: 3, team: "team2", x: 0.72, y: 0.76 },
      { id: "td4", num: 4, team: "team2", x: 0.58, y: 0.38 },
      { id: "td5", num: 5, team: "team2", x: 0.58, y: 0.62 },
    ],
    ball: { x: 0.55, y: 0.5 },
  },
  sequences: [],
};

/** Hand-off / dribble pitch haute — deux guards + lift corners. */
export const HANDOFF_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "ho1", num: 1, team: "team1", x: 0.52, y: 0.48 },
      { id: "ho2", num: 2, team: "team1", x: 0.38, y: 0.52 },
      { id: "ho3", num: 3, team: "team1", x: 0.22, y: 0.78 },
      { id: "ho4", num: 4, team: "team1", x: 0.22, y: 0.22 },
      { id: "ho5", num: 5, team: "team1", x: 0.68, y: 0.52 },
      { id: "hd1", num: 1, team: "team2", x: 0.58, y: 0.48 },
      { id: "hd2", num: 2, team: "team2", x: 0.45, y: 0.55 },
      { id: "hd3", num: 3, team: "team2", x: 0.32, y: 0.75 },
      { id: "hd4", num: 4, team: "team2", x: 0.32, y: 0.25 },
      { id: "hd5", num: 5, team: "team2", x: 0.72, y: 0.52 },
    ],
    ball: { x: 0.52, y: 0.48 },
  },
  sequences: [],
};

/** Motion weak-side — ball reverse côté faible. */
export const MOTION_WEAK_TEMPLATE: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      { id: "m1", num: 1, team: "team1", x: 0.32, y: 0.48 },
      { id: "m2", num: 2, team: "team1", x: 0.78, y: 0.35 },
      { id: "m3", num: 3, team: "team1", x: 0.72, y: 0.68 },
      { id: "m4", num: 4, team: "team1", x: 0.48, y: 0.22 },
      { id: "m5", num: 5, team: "team1", x: 0.55, y: 0.52 },
      { id: "md1", num: 1, team: "team2", x: 0.42, y: 0.5 },
      { id: "md2", num: 2, team: "team2", x: 0.82, y: 0.38 },
      { id: "md3", num: 3, team: "team2", x: 0.75, y: 0.65 },
      { id: "md4", num: 4, team: "team2", x: 0.58, y: 0.25 },
      { id: "md5", num: 5, team: "team2", x: 0.62, y: 0.52 },
    ],
    ball: { x: 0.32, y: 0.48 },
  },
  sequences: [],
};

export const TACTIC_TEMPLATES: Record<string, TemplateMeta> = {
  vide: {
    label: "Terrain vide",
    blurb: "Place tes joueurs from scratch.",
    data: EMPTY_TACTIC,
  },
  "pick-roll": {
    label: "Pick & roll",
    blurb: "Démo complète (4 séquences) à adapter.",
    data: DEMO_TACTIC,
  },
  "zone-23": {
    label: "Zone 2-3",
    blurb: "Squelette défensif 2-3.",
    data: ZONE_23_TEMPLATE,
  },
  horns: {
    label: "Horns",
    blurb: "Double post haut, spacing flare / Spain.",
    data: HORNS_TEMPLATE,
  },
  "iso-wing": {
    label: "Iso aile",
    blurb: "Iso côté fort, spacing côté faible.",
    data: ISO_WING_TEMPLATE,
  },
  "spain-pnr": {
    label: "Spain PNR",
    blurb: "Corner + wing + top pour Spain pick & roll.",
    data: SPAIN_TEMPLATE,
  },
  transition: {
    label: "Transition",
    blurb: "Lanes + trailers contre-attaque.",
    data: TRANSITION_TEMPLATE,
  },
  handoff: {
    label: "Hand-off guard",
    blurb: "Double guard haute + corners lift.",
    data: HANDOFF_TEMPLATE,
  },
  "motion-weak": {
    label: "Motion weak",
    blurb: "Ball reversal et occupation côté faible.",
    data: MOTION_WEAK_TEMPLATE,
  },
};

export const TEMPLATE_KEYS = Object.keys(TACTIC_TEMPLATES);

/** Ordre affichage menu / LP (vide en premier). */
export const TEMPLATE_CATALOG_ORDER = [
  "vide",
  "pick-roll",
  "horns",
  "iso-wing",
  "spain-pnr",
  "zone-23",
  "transition",
  "handoff",
  "motion-weak",
] as const;

export function getTemplateCatalogEntries(): Array<TemplateMeta & { key: string }> {
  return TEMPLATE_CATALOG_ORDER.filter((k) => k in TACTIC_TEMPLATES).map(
    (key) => ({
      key,
      ...TACTIC_TEMPLATES[key],
    }),
  );
}

export function getTemplateData(key: string | undefined): TacticData {
  if (!key) return EMPTY_TACTIC;
  const entry = TACTIC_TEMPLATES[key];
  return entry?.data ?? EMPTY_TACTIC;
}
