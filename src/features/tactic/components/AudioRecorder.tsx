"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Mic, MicOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTacticStore } from "../hooks/useTacticStore";
import type { Sequence } from "../lib/types";

export function AudioRecorder({
  tacticId,
  sequence,
}: {
  tacticId: string;
  sequence: Sequence;
}) {
  const setAudio = useTacticStore((s) => s.setSequenceAudio);
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!sequence.audioStoragePath) {
      setPreviewUrl(null);
      return;
    }
    setPreviewUrl(`/api/audio?path=${encodeURIComponent(sequence.audioStoragePath)}`);
  }, [sequence.audioStoragePath]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        await upload(blob);
      };
      mr.start();
      recorderRef.current = mr;
      setRecording(true);
    } catch (e) {
      console.error(e);
      toast.error("Microphone indisponible");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const upload = async (blob: Blob) => {
    const fd = new FormData();
    fd.append("file", blob, `${sequence.id}.webm`);
    fd.append("tacticId", tacticId);
    fd.append("sequenceId", sequence.id);
    try {
      const res = await fetch("/api/audio", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const { path } = await res.json();
      setAudio(sequence.id, path);
      toast.success("Audio enregistré");
    } catch (e) {
      console.error(e);
      toast.error("Upload audio impossible");
    }
  };

  const remove = async () => {
    if (!sequence.audioStoragePath) return;
    try {
      await fetch(
        `/api/audio?path=${encodeURIComponent(sequence.audioStoragePath)}`,
        { method: "DELETE" },
      );
      setAudio(sequence.id, null);
      toast.success("Audio supprimé");
    } catch (e) {
      console.error(e);
      toast.error("Suppression impossible");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {recording ? (
        <Button size="sm" variant="destructive" onClick={stop} className="gap-2">
          <MicOff className="size-4" /> Arrêter
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={start} className="gap-2">
          <Mic className="size-4" />
          {sequence.audioStoragePath ? "Réenregistrer" : "Enregistrer"}
        </Button>
      )}

      {previewUrl && (
        <>
          <audio controls src={previewUrl} className="h-9 flex-1" />
          <Button size="icon" variant="ghost" onClick={remove}>
            <Trash2 className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}
