"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useTacticStore } from "@/features/tactic/hooks/useTacticStore";
import { DEMO_TACTIC } from "@/features/tactic/lib/demoTactic";
import { playTactic, type PlaybackFrame } from "@/features/tactic/lib/playback";
import { COURT_ASPECT_RATIO } from "@/features/tactic/lib/types";

const Court = dynamic(
  () => import("@/features/tactic/components/Court").then((m) => m.Court),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">
        Chargement de la démo...
      </div>
    ),
  },
);

export function LandingDemo() {
  const hydrate = useTacticStore((s) => s.hydrate);
  const setIsPlaying = useTacticStore((s) => s.setIsPlaying);

  const [hydrated, setHydrated] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seqIndex, setSeqIndex] = useState<number>(-1);
  const [inView, setInView] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<{
    setPlaybackFrame: (f: PlaybackFrame | null) => void;
  } | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);
  const cancelledRef = useRef(false);

  // Pause auto si la démo n'est plus visible (gros gain perf : plus de RAF).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Sauvegarde le draft localStorage de l'utilisateur pour ne pas l'écraser
    // avec la démo. Restauré au démontage.
    const STORAGE_KEY = "zt-tactic-draft";
    let savedDraft: string | null = null;
    try {
      savedDraft = localStorage.getItem(STORAGE_KEY);
    } catch {}

    hydrate({ id: "demo", name: "Pick & Roll", data: DEMO_TACTIC });
    setHydrated(true);

    return () => {
      try {
        if (savedDraft) localStorage.setItem(STORAGE_KEY, savedDraft);
        else localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };
  }, [hydrate]);

  const startLoop = useCallback(() => {
    cancelledRef.current = false;
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setIsPlaying(true);
    (async () => {
      try {
        while (!cancelledRef.current && !ctrl.signal.aborted) {
          await playTactic(DEMO_TACTIC, {
            signal: ctrl.signal,
            // démo : tempo nettement plus rapide que l'éditeur.
            sequenceMs: 700,
            pauseBetweenMs: 150,
            onFrame: (f) => handleRef.current?.setPlaybackFrame(f),
            onSequenceStart: (_, i) => setSeqIndex(i),
          });
          if (cancelledRef.current || ctrl.signal.aborted) break;
          await new Promise<void>((r) => {
            const t = setTimeout(r, 600);
            ctrl.signal.addEventListener("abort", () => {
              clearTimeout(t);
              r();
            });
          });
        }
      } finally {
        setIsPlaying(false);
      }
    })();
  }, [setIsPlaying]);

  const stopLoop = useCallback(() => {
    cancelledRef.current = true;
    ctrlRef.current?.abort();
    handleRef.current?.setPlaybackFrame(null);
    setSeqIndex(-1);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (paused || !inView) {
      stopLoop();
      return;
    }
    const t = setTimeout(() => startLoop(), 400);
    return () => {
      clearTimeout(t);
      stopLoop();
    };
  }, [hydrated, paused, inView, startLoop, stopLoop]);

  const togglePause = () => {
    if (paused) {
      setPaused(false);
      startLoop();
    } else {
      setPaused(true);
      stopLoop();
    }
  };

  const restart = () => {
    stopLoop();
    setPaused(false);
    setTimeout(startLoop, 80);
  };

  const currentSeq =
    seqIndex >= 0 && seqIndex < DEMO_TACTIC.sequences.length
      ? DEMO_TACTIC.sequences[seqIndex]
      : null;

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="relative w-full overflow-hidden rounded-xl border bg-[#ffedd5]"
        style={{ aspectRatio: String(COURT_ASPECT_RATIO) }}
      >
        {hydrated && (
          <Court
            readOnly
            onReady={(h) => {
              handleRef.current = h;
            }}
          />
        )}

        {/* Badge "DÉMO LIVE" */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow-lg">
          <span className="size-2 rounded-full bg-white animate-pulse" />
          DÉMO LIVE
        </div>

        {/* Légende équipes */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 rounded-lg bg-background/95 px-3 py-2 text-xs shadow-lg border">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-blue-600" />
            <span className="font-medium">Attaquants</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-600" />
            <span className="font-medium">Défenseurs</span>
          </div>
        </div>

        {/* Caption de la séquence en cours */}
        {currentSeq?.comment && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-16 z-10 max-w-[80%] rounded-full bg-foreground/95 text-background px-4 py-2 text-sm font-medium shadow-xl text-center">
            {currentSeq.comment}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePause}
            className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
            {paused ? "Reprendre" : "Pause"}
          </button>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <RotateCcw className="size-4" />
            Recommencer
          </button>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Créer ma propre tactique →
        </Link>
      </div>
    </div>
  );
}
