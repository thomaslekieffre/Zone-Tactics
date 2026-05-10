import { z } from "zod";

const norm = z.number().min(0).max(1);

export const playerPlacementSchema = z.object({
  id: z.string().min(1),
  num: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  team: z.enum(["team1", "team2"]),
  x: norm,
  y: norm,
});

export const initialSetupSchema = z.object({
  players: z.array(playerPlacementSchema).max(10),
  ball: z.object({ x: norm, y: norm }).optional(),
});

export const movementSchema = z.object({
  playerId: z.string().min(1),
  toX: norm,
  toY: norm,
});

export const sequenceSchema = z.object({
  id: z.string().min(1),
  movements: z.array(movementSchema).max(10),
  pass: z
    .object({ fromPlayerId: z.string(), toPlayerId: z.string() })
    .optional(),
  shoot: z.object({ playerId: z.string() }).optional(),
  comment: z.string().max(500).optional(),
  audioStoragePath: z.string().max(500).optional(),
  durationMs: z.number().int().positive().max(60_000).optional(),
});

const annotationStrokeSchema = z.object({
  id: z.string().min(1),
  points: z
    .array(z.number())
    .max(4000)
    .refine((arr) => arr.length >= 4 && arr.length % 2 === 0, {
      message: "points doit contenir au moins 2 points (x,y) normalisés",
    }),
});

const annotationLabelSchema = z.object({
  id: z.string().min(1),
  x: norm,
  y: norm,
  text: z.string().max(200),
});

export const courtAnnotationsSchema = z.object({
  strokes: z.array(annotationStrokeSchema).max(80),
  labels: z.array(annotationLabelSchema).max(60),
});

export const tacticDataSchema = z.object({
  version: z.literal(1),
  initialSetup: initialSetupSchema,
  sequences: z.array(sequenceSchema).max(100),
  annotations: courtAnnotationsSchema.optional(),
});

export const saveTacticSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(80),
  data: tacticDataSchema,
});

export type SaveTacticInput = z.infer<typeof saveTacticSchema>;
