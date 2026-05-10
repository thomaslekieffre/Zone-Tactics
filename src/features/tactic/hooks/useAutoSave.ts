"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TacticData } from "../lib/types";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

type SaveAction = (input: {
  id: string | null;
  name: string;
  data: TacticData;
}) => Promise<{ id: string }>;

type Options = {
  /** Identifiant courant de la tactique. null = pas encore créée. */
  tacticId: string | null;
  name: string;
  data: TacticData;
  dirty: boolean;
  /** True quand on lit l'animation : on bloque l'autosave. */
  isPlaying: boolean;
  /** Callback à appeler avec le `id` retourné par le backend (utile à la 1re save). */
  onSaved: (id: string) => void;
  saveAction: SaveAction;
  /** Délai après la dernière modification avant de save (default 800 ms). */
  debounceMs?: number;
  /** Si true, on désactive complètement l'autosave (mode lecture seule). */
  disabled?: boolean;
};

/**
 * Sauvegarde automatique debounced de la tactique en cours.
 *
 * - Déclenche `saveAction` après `debounceMs` d'inactivité dès que `dirty=true`.
 * - Si `name` est vide à la première save, on génère "Tactique du <date>".
 * - Bloque pendant `isPlaying`.
 * - Évite les saves concurrentes (file d'attente : si une save est en cours,
 *   on relance après son retour).
 * - Save immédiate au beforeunload pour éviter de perdre des modifs.
 */
export function useAutoSave({
  tacticId,
  name,
  data,
  dirty,
  isPlaying,
  onSaved,
  saveAction,
  debounceMs = 800,
  disabled = false,
}: Options): { status: SaveStatus; lastError: string | null; flush: () => Promise<void> } {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  const stateRef = useRef({ tacticId, name, data, dirty, isPlaying });
  const saveActionRef = useRef(saveAction);
  const onSavedRef = useRef(onSaved);

  const inFlightRef = useRef(false);
  const pendingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Évite la récursion directe dans useCallback (règles react-hooks). */
  const performSaveRef = useRef(async (): Promise<void> => {});

  const performSave = useCallback(async (): Promise<void> => {
    const s = stateRef.current;
    if (disabled || !s.dirty || s.isPlaying) return;
    if (inFlightRef.current) {
      pendingRef.current = true;
      return;
    }

    const finalName = s.name.trim() || defaultName();

    inFlightRef.current = true;
    setStatus("saving");
    setLastError(null);
    try {
      const { id } = await saveActionRef.current({
        id: s.tacticId,
        name: finalName,
        data: s.data,
      });
      onSavedRef.current(id);
      setStatus("saved");
    } catch (e) {
      console.error("[autoSave]", e);
      setStatus("error");
      setLastError(e instanceof Error ? e.message : "Erreur");
    } finally {
      inFlightRef.current = false;
      if (pendingRef.current) {
        pendingRef.current = false;
        queueMicrotask(() => void performSaveRef.current());
      }
    }
  }, [disabled]);

  useLayoutEffect(() => {
    stateRef.current = { tacticId, name, data, dirty, isPlaying };
    saveActionRef.current = saveAction;
    onSavedRef.current = onSaved;
    performSaveRef.current = performSave;
  }, [
    tacticId,
    name,
    data,
    dirty,
    isPlaying,
    saveAction,
    onSaved,
    performSave,
  ]);

  useEffect(() => {
    if (disabled || !dirty || isPlaying) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void performSave();
    }, debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dirty, data, name, isPlaying, disabled, debounceMs, performSave]);

  useEffect(() => {
    if (disabled) return;
    const handler = () => {
      if (stateRef.current.dirty && !stateRef.current.isPlaying) {
        void performSave();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [disabled, performSave]);

  return { status, lastError, flush: performSave };
}

function defaultName(): string {
  const d = new Date();
  return `Tactique du ${d.toLocaleDateString("fr-FR")} ${d.toLocaleTimeString(
    "fr-FR",
    { hour: "2-digit", minute: "2-digit" },
  )}`;
}
