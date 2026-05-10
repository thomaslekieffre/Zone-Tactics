import type { TacticData } from "./types";

/** Tactique d'exemple : Pick & Roll classique pour la démo de la landing page. */
export const DEMO_TACTIC: TacticData = {
  version: 1,
  initialSetup: {
    players: [
      // Attaquants (Bleu) — alignement offensif
      { id: "a1", num: 1, team: "team1", x: 0.45, y: 0.5 },
      { id: "a2", num: 2, team: "team1", x: 0.6, y: 0.15 },
      { id: "a3", num: 3, team: "team1", x: 0.6, y: 0.85 },
      { id: "a4", num: 4, team: "team1", x: 0.78, y: 0.25 },
      { id: "a5", num: 5, team: "team1", x: 0.78, y: 0.75 },
      // Défenseurs (Rouge) — homme à homme
      { id: "d1", num: 1, team: "team2", x: 0.52, y: 0.5 },
      { id: "d2", num: 2, team: "team2", x: 0.65, y: 0.16 },
      { id: "d3", num: 3, team: "team2", x: 0.65, y: 0.84 },
      { id: "d4", num: 4, team: "team2", x: 0.81, y: 0.27 },
      { id: "d5", num: 5, team: "team2", x: 0.81, y: 0.73 },
    ],
    ball: { x: 0.45, y: 0.5 },
  },
  sequences: [
    {
      id: "s1",
      movements: [
        { playerId: "a5", toX: 0.5, toY: 0.42 },
        { playerId: "d5", toX: 0.53, toY: 0.4 },
      ],
      comment: "Le 5 monte poser un écran sur le défenseur du meneur.",
    },
    {
      id: "s2",
      movements: [
        { playerId: "a1", toX: 0.72, toY: 0.42 },
        { playerId: "d1", toX: 0.55, toY: 0.5 },
        { playerId: "a5", toX: 0.85, toY: 0.55 },
        { playerId: "d5", toX: 0.62, toY: 0.45 },
      ],
      comment: "Le meneur drive sur l'écran, le 5 plonge au cercle.",
    },
    {
      id: "s3",
      movements: [],
      pass: { fromPlayerId: "a1", toPlayerId: "a5" },
      comment: "Passe lobée vers le pivot démarqué.",
    },
    {
      id: "s4",
      movements: [],
      shoot: { playerId: "a5" },
      comment: "Tir au cercle, panier facile.",
    },
  ],
};
