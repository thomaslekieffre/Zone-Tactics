"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Check,
  ChevronLeft,
  CloudOff,
  Loader2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useTacticStore } from "../hooks/useTacticStore";
import { useAutoSave, type SaveStatus } from "../hooks/useAutoSave";
import type { TacticData } from "../lib/types";
import { Toolbar } from "./Toolbar";
import { PlayerPalette } from "./PlayerPalette";
import { Timeline } from "./Timeline";
import { ShareDialog } from "./ShareDialog";
import { ExportVideoButton } from "./ExportVideoButton";
import type { CourtHandle } from "./Court";
import { playTactic, type PlaybackFrame } from "../lib/playback";

const Court = dynamic(() => import("./Court").then((m) => m.Court), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full grid place-items-center text-muted-foreground">
      Chargement...
    </div>
  ),
});

type Props = {
  initialId: string | null;
  initialName: string;
  initialData: TacticData;
  saveAction: (input: {
    id: string | null;
    name: string;
    data: TacticData;
  }) => Promise<{ id: string }>;
  readOnly?: boolean;
};

export function TacticEditor({
  initialId,
  initialName,
  initialData,
  saveAction,
  readOnly = false,
}: Props) {
  const hydrate = useTacticStore((s) => s.hydrate);
  const setName = useTacticStore((s) => s.setName);
  const setIsPlaying = useTacticStore((s) => s.setIsPlaying);
  const setTacticId = useTacticStore((s) => s.setTacticId);
  const markSaved = useTacticStore((s) => s.markSaved);

  const tacticId = useTacticStore((s) => s.tacticId);
  const name = useTacticStore((s) => s.name);
  const data = useTacticStore((s) => s.data);
  const isPlaying = useTacticStore((s) => s.isPlaying);
  const dirty = useTacticStore((s) => s.dirty);

  const [hydrated, setHydrated] = useState(false);
  const courtHandleRef = useRef<CourtHandle | null>(null);
  const playbackAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    hydrate({ id: initialId, name: initialName, data: initialData });
    setHydrated(true);
  }, [hydrate, initialId, initialName, initialData]);

  const onSaved = useCallback(
    (id: string) => {
      if (!tacticId) {
        // Première sauvegarde : on remplace l'URL par l'id réel
        window.history.replaceState(null, "", `/tactic/${id}`);
        setTacticId(id);
      }
      markSaved();
    },
    [tacticId, setTacticId, markSaved],
  );

  const { status: saveStatus } = useAutoSave({
    tacticId,
    name,
    data,
    dirty,
    isPlaying,
    onSaved,
    saveAction,
    disabled: readOnly,
  });

  const onPlay = async () => {
    if (data.sequences.length === 0) return;
    setIsPlaying(true);
    const ctrl = new AbortController();
    playbackAbortRef.current = ctrl;
    try {
      await playTactic(data, {
        signal: ctrl.signal,
        onFrame: (frame) => {
          courtHandleRef.current?.setPlaybackFrame(frame);
        },
      });
    } finally {
      courtHandleRef.current?.setPlaybackFrame(null);
      setIsPlaying(false);
      playbackAbortRef.current = null;
    }
  };

  const onStop = () => {
    playbackAbortRef.current?.abort();
  };

  if (!hydrated) {
    return (
      <div className="grid place-items-center h-dvh text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="px-3 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/library">
              <ChevronLeft className="size-5" />
            </Link>
          </Button>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom de la tactique"
            disabled={readOnly}
            className="max-w-xs h-9"
            maxLength={80}
          />
          {!readOnly && (
            <SaveIndicator status={saveStatus} dirty={dirty} />
          )}
          <div className="ml-auto flex items-center gap-2">
            {!readOnly && <ExportVideoButton courtRef={courtHandleRef} />}
            {!readOnly && tacticId && <ShareDialog tacticId={tacticId} />}
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] min-h-0">
        {/* Desktop palette */}
        {!readOnly && (
          <aside className="hidden lg:flex flex-col gap-4 p-4 border-r overflow-y-auto">
            <h2 className="text-sm font-semibold uppercase text-muted-foreground">
              Joueurs
            </h2>
            <PlayerPalette />
          </aside>
        )}

        {/* Court area */}
        <main className="relative flex flex-col min-h-0 bg-secondary/20">
          <div className="flex-1 min-h-0 p-2 sm:p-4">
            <Court
              readOnly={readOnly}
              onReady={(handle) => {
                courtHandleRef.current = handle;
              }}
            />
          </div>
          {!readOnly && (
            <div className="border-t bg-card/80 backdrop-blur p-2 sm:p-3 safe-bottom">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <div className="lg:hidden">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button size="icon" variant="outline" title="Joueurs">
                        <Users className="size-5" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Joueurs</DrawerTitle>
                      </DrawerHeader>
                      <div className="p-4 pb-8">
                        <PlayerPalette variant="drawer" />
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
                <Toolbar onPlay={onPlay} onStop={onStop} className="flex-1" />
              </div>
            </div>
          )}
          {readOnly && (
            <div className="border-t p-2 sm:p-3 flex justify-center bg-card/80 backdrop-blur">
              <Button onClick={onPlay} disabled={isPlaying || data.sequences.length === 0} className="gap-2">
                Lire l'animation
              </Button>
            </div>
          )}
        </main>

        {/* Timeline / right panel */}
        <aside className="hidden lg:flex flex-col gap-3 p-4 border-l overflow-y-auto">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground">
            Timeline
          </h2>
          <Timeline tacticId={tacticId} readOnly={readOnly} />
        </aside>
      </div>

      {/* Mobile timeline drawer */}
      <div className="lg:hidden border-t max-h-[35vh] overflow-y-auto p-3 bg-card/50">
        <Timeline tacticId={tacticId} readOnly={readOnly} />
      </div>
    </div>
  );
}

function SaveIndicator({
  status,
  dirty,
}: {
  status: SaveStatus;
  dirty: boolean;
}) {
  let label: string;
  let icon: React.ReactNode;
  let cls = "text-muted-foreground";

  if (status === "saving") {
    label = "Sauvegarde...";
    icon = <Loader2 className="size-3.5 animate-spin" />;
  } else if (status === "error") {
    label = "Erreur de sauvegarde";
    icon = <CloudOff className="size-3.5" />;
    cls = "text-destructive";
  } else if (dirty) {
    label = "Modifications en attente";
    icon = <Loader2 className="size-3.5" />;
  } else {
    label = "Sauvegardé";
    icon = <Check className="size-3.5" />;
    cls = "text-emerald-600 dark:text-emerald-400";
  }

  return (
    <span
      className={`hidden md:inline-flex items-center gap-1.5 text-xs ${cls}`}
      aria-live="polite"
    >
      {icon}
      {label}
    </span>
  );
}
