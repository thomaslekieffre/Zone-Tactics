import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type { Stage } from "konva/lib/Stage";
import type { CourtHandle } from "../components/Court";
import type { TacticData } from "./types";
import { playTactic } from "./playback";
import { compositeStage, letterbox } from "./exportVideo";

/** Export GIF 16:9 léger (réseaux / Slack). ~15 fps max pour limiter la taille. */
const OUT_W = 640;
const OUT_H = 360;
const MIN_FRAME_GAP_MS = 66;

export async function exportTacticGif(opts: {
  data: TacticData;
  court: CourtHandle;
  signal?: AbortSignal;
}): Promise<Blob> {
  const { data, court, signal } = opts;

  if (data.sequences.length === 0) {
    throw new Error("Ajoute au moins une séquence pour exporter.");
  }

  const stage = court.getStage();
  if (!stage || stage.width() < 8 || stage.height() < 8) {
    throw new Error("Terrain pas prêt — attends le chargement du parquet.");
  }

  const merge = document.createElement("canvas");
  merge.width = OUT_W;
  merge.height = OUT_H;

  const paint = () => {
    const raw = compositeStage(stage as Stage);
    letterbox(raw, merge, "youtube");
  };

  const gif = GIFEncoder({ auto: true });
  let sharedPalette: ReturnType<typeof quantize> | null = null;
  let lastCapture = 0;

  const captureFrame = (delayMs: number) => {
    const ctx2d = merge.getContext("2d");
    if (!ctx2d) return;
    const imageData = ctx2d.getImageData(0, 0, OUT_W, OUT_H);
    if (!sharedPalette) {
      sharedPalette = quantize(imageData.data, 256, { format: "rgb565" });
    }
    const index = applyPalette(imageData.data, sharedPalette, "rgb565");
    gif.writeFrame(index, OUT_W, OUT_H, {
      palette: sharedPalette,
      delay: delayMs,
    });
  };

  await playTactic(data, {
    signal,
    sequenceMs: 850,
    pauseBetweenMs: 250,
    onFrame: (_frame, ctx) => {
      court.setPlaybackFrame(_frame);
      paint();
      const now = performance.now();
      const isIntro = ctx.sequenceIndex === -1;
      if (
        !isIntro &&
        ctx.t < 0.98 &&
        now - lastCapture < MIN_FRAME_GAP_MS
      ) {
        return;
      }
      lastCapture = now;
      captureFrame(isIntro ? 150 : MIN_FRAME_GAP_MS);
    },
  });

  court.setPlaybackFrame(null);
  paint();
  captureFrame(400);

  gif.finish();
  const bytes = gif.bytes();
  return new Blob([bytes], { type: "image/gif" });
}

export function downloadGifBlob(blob: Blob, baseName: string) {
  const safe = baseName
    .replace(/[^a-zA-Z0-9À-ÿ _-]+/gi, "_")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 48);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${safe || "tactique"}_zonetactics.gif`;
  a.click();
  URL.revokeObjectURL(a.href);
}
