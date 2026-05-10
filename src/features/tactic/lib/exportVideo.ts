import type { Stage } from "konva/lib/Stage";
import type { CourtHandle } from "../components/Court";
import type { TacticData } from "./types";
import { playTactic } from "./playback";

export type ExportFormat = "reels" | "youtube";

const DIMENSIONS: Record<ExportFormat, { w: number; h: number }> = {
  reels: { w: 1080, h: 1920 },
  youtube: { w: 1920, h: 1080 },
};

/** Fusionne les canvas des layers Konva (ordre z-index = ordre des enfants). */
export function compositeStage(stage: Stage): HTMLCanvasElement {
  const w = stage.width();
  const h = stage.height();
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponible");

  ctx.clearRect(0, 0, w, h);
  for (const node of stage.getChildren()) {
    const layer = node as {
      getNativeCanvasElement: () => HTMLCanvasElement;
    };
    if (typeof layer.getNativeCanvasElement !== "function") continue;
    const nat = layer.getNativeCanvasElement();
    ctx.drawImage(nat, 0, 0, w, h);
  }
  return c;
}

export function letterbox(
  src: HTMLCanvasElement,
  out: HTMLCanvasElement,
  format: ExportFormat,
) {
  const W = out.width;
  const H = out.height;
  const ctx = out.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0c0c0f";
  ctx.fillRect(0, 0, W, H);

  const sw = src.width;
  const sh = src.height;
  const aspect = sw / sh;

  let dw: number;
  let dh: number;

  if (format === "reels") {
    const boxW = W * 0.92;
    const boxH = H * 0.74;
    if (boxW / boxH > aspect) {
      dh = boxH;
      dw = dh * aspect;
    } else {
      dw = boxW;
      dh = dw / aspect;
    }
  } else {
    const pad = 0.92;
    dw = W * pad;
    dh = dw / aspect;
    if (dh > H * pad) {
      dh = H * pad;
      dw = dh * aspect;
    }
  }

  const ox = (W - dw) / 2;
  const oy = (H - dh) / 2;
  ctx.drawImage(src, 0, 0, sw, sh, ox, oy, dw, dh);

  const fs = Math.round(W * 0.028);
  ctx.font = `600 ${fs}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 6;
  ctx.fillText("Zone Tactics", W * 0.05, H - fs * 1.45);
  ctx.shadowBlur = 0;
  ctx.font = `500 ${Math.round(fs * 0.52)}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("zonetactics.app", W * 0.05, H - fs * 0.55);
}

function pickWebmMime(): string {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) {
      return c;
    }
  }
  return "video/webm";
}

/**
 * Enregistre la lecture de la tactique en WebM (VP8/VP9) via MediaRecorder.
 * Format Reels = 1080×1920, YouTube = 1920×1080, terrain centré + fond sombre + watermark.
 */
export async function exportTacticVideo(opts: {
  data: TacticData;
  court: CourtHandle;
  format: ExportFormat;
  signal?: AbortSignal;
}): Promise<Blob> {
  const { data, court, format, signal } = opts;

  if (data.sequences.length === 0) {
    throw new Error("Ajoute au moins une séquence pour exporter.");
  }

  if (typeof MediaRecorder === "undefined") {
    throw new Error("Export vidéo non supporté sur ce navigateur.");
  }

  const stage = court.getStage();
  if (!stage || stage.width() < 8 || stage.height() < 8) {
    throw new Error("Terrain pas prêt — attends le chargement du parquet.");
  }

  const { w: outW, h: outH } = DIMENSIONS[format];
  const merge = document.createElement("canvas");
  merge.width = outW;
  merge.height = outH;

  const mime = pickWebmMime();
  if (!MediaRecorder.isTypeSupported(mime)) {
    throw new Error("Codec vidéo WebM indisponible (essaie Chrome ou Edge).");
  }

  const chunks: BlobPart[] = [];
  const stream = merge.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: mime,
    videoBitsPerSecond: 5_000_000,
  });

  const blobPromise = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));
    recorder.onerror = () => reject(new Error("Erreur MediaRecorder"));
  });

  const paint = () => {
    const raw = compositeStage(stage);
    letterbox(raw, merge, format);
  };

  recorder.start(200);

  await playTactic(data, {
    signal,
    sequenceMs: 850,
    pauseBetweenMs: 250,
    onFrame: (frame) => {
      court.setPlaybackFrame(frame);
      paint();
    },
  });

  court.setPlaybackFrame(null);
  paint();

  await new Promise<void>((r) => setTimeout(r, 350));
  recorder.stop();

  return blobPromise;
}

export function downloadVideoBlob(blob: Blob, baseName: string) {
  const safe = baseName.replace(/[^a-zA-Z0-9À-ÿ _-]+/gi, "_").trim().replace(/\s+/g, "_").slice(0, 48);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${safe || "tactique"}_zonetactics.webm`;
  a.click();
  URL.revokeObjectURL(a.href);
}
