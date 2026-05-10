"use client";

import { useTacticStore } from "../hooks/useTacticStore";
import { AudioRecorder } from "./AudioRecorder";

export function Timeline({
  tacticId,
  readOnly,
}: {
  tacticId: string | null;
  readOnly?: boolean;
}) {
  const sequences = useTacticStore((s) => s.data.sequences);
  const setComment = useTacticStore((s) => s.setSequenceComment);

  if (sequences.length === 0) {
    return (
      <div className="text-sm text-muted-foreground rounded-lg border border-dashed p-4 text-center">
        Aucune séquence pour l'instant. Place tes joueurs, le ballon, dessine
        des flèches puis valide.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sequences.map((seq, idx) => (
        <div
          key={seq.id}
          className="rounded-lg border bg-card p-3 text-sm space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Séquence {idx + 1}</span>
            <span className="text-xs text-muted-foreground">
              {seq.movements.length} mouvement
              {seq.movements.length > 1 ? "s" : ""}
              {seq.pass ? " · passe" : ""}
              {seq.shoot ? " · tir" : ""}
            </span>
          </div>

          <textarea
            disabled={readOnly}
            value={seq.comment ?? ""}
            onChange={(e) => setComment(seq.id, e.target.value.slice(0, 500))}
            rows={2}
            placeholder="Commentaire de coaching..."
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
          />

          {!readOnly && tacticId && (
            <AudioRecorder tacticId={tacticId} sequence={seq} />
          )}

          {readOnly && seq.audioStoragePath && (
            <ReadOnlyAudio path={seq.audioStoragePath} />
          )}
        </div>
      ))}
    </div>
  );
}

function ReadOnlyAudio({ path }: { path: string }) {
  return <audio controls src={`/api/audio?path=${encodeURIComponent(path)}`} className="w-full h-9" />;
}
