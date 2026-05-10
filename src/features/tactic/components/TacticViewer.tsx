"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Play, Square } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTacticStore } from "../hooks/useTacticStore";
import type { TacticData } from "../lib/types";
import { Timeline } from "./Timeline";
import { playTactic, type PlaybackFrame } from "../lib/playback";

const Court = dynamic(() => import("./Court").then((m) => m.Court), {
  ssr: false,
});

type Props = {
  id: string;
  name: string;
  data: TacticData;
  autoPlay?: boolean;
  loop?: boolean;
};

export function TacticViewer({ id, name, data, autoPlay, loop }: Props) {
  const hydrate = useTacticStore((s) => s.hydrate);
  const setIsPlaying = useTacticStore((s) => s.setIsPlaying);
  const isPlaying = useTacticStore((s) => s.isPlaying);

  const [hydrated, setHydrated] = useState(false);
  const handleRef = useRef<{
    setPlaybackFrame: (f: PlaybackFrame | null) => void;
  } | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    hydrate({ id, name, data });
    setHydrated(true);
  }, [hydrate, id, name, data]);

  const onPlay = useCallback(async () => {
    setIsPlaying(true);
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    try {
      do {
        await playTactic(data, {
          signal: ctrl.signal,
          onFrame: (frame) => handleRef.current?.setPlaybackFrame(frame),
        });
        if (ctrl.signal.aborted) break;
        if (loop) {
          await new Promise((r) => setTimeout(r, 800));
        }
      } while (loop && !ctrl.signal.aborted);
    } finally {
      handleRef.current?.setPlaybackFrame(null);
      setIsPlaying(false);
    }
  }, [data, loop, setIsPlaying]);

  useEffect(() => {
    if (!hydrated || !autoPlay) return;
    const t = setTimeout(() => onPlay(), 600);
    const ref = ctrlRef;
    return () => {
      clearTimeout(t);
      ref.current?.abort();
    };
  }, [hydrated, autoPlay, onPlay]);

  const onStop = () => ctrlRef.current?.abort();

  if (!hydrated) {
    return <div className="grid place-items-center h-dvh">Chargement...</div>;
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <header className="border-b">
        <div className="px-4 h-14 flex items-center gap-3">
          <Link href="/" className="font-semibold text-primary">
            Zone Tactics
          </Link>
          <h1 className="font-medium truncate">· {name}</h1>
          <div className="ml-auto">
            {isPlaying ? (
              <Button onClick={onStop} variant="destructive" size="sm" className="gap-2">
                <Square className="size-4" /> Stop
              </Button>
            ) : (
              <Button onClick={onPlay} size="sm" className="gap-2">
                <Play className="size-4" /> Lire
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] min-h-0">
        <div className="p-2 sm:p-4">
          <Court
            readOnly
            onReady={(handle) => {
              handleRef.current = handle;
            }}
          />
        </div>
        <aside className="hidden lg:flex flex-col gap-3 p-4 border-l overflow-y-auto">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Séquences
          </h2>
          <Timeline tacticId={id} readOnly />
        </aside>
      </main>
      <div className="lg:hidden border-t max-h-[35vh] overflow-y-auto p-3 bg-card/50">
        <Timeline tacticId={id} readOnly />
      </div>
    </div>
  );
}
