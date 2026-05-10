"use client";

import { useTacticStore } from "../hooks/useTacticStore";
import type { PlayerNumber, TeamId } from "../lib/types";
import { TEAM_NUMS } from "../lib/types";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export function PlayerPalette({
  className,
  variant = "sidebar",
}: {
  className?: string;
  variant?: "sidebar" | "drawer";
}) {
  const players = useTacticStore((s) => s.data.initialSetup.players);
  const sequencesCount = useTacticStore((s) => s.data.sequences.length);
  const addPlayer = useTacticStore((s) => s.addPlayer);
  const removePlayer = useTacticStore((s) => s.removePlayer);
  const isLocked = sequencesCount > 0;

  const onAdd = (num: PlayerNumber, team: TeamId) => {
    if (isLocked) return;
    // Default position: spread across the half-court
    const offsetY = (num - 1) * 0.16 + 0.1;
    const x = team === "team1" ? 0.3 : 0.65;
    addPlayer(num, team, { x, y: offsetY });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <PlayerRow
        team="team1"
        title="Attaquants (Bleu)"
        players={players}
        onAdd={onAdd}
        onRemove={removePlayer}
        locked={isLocked}
        variant={variant}
      />
      <PlayerRow
        team="team2"
        title="Défenseurs (Rouge)"
        players={players}
        onAdd={onAdd}
        onRemove={removePlayer}
        locked={isLocked}
        variant={variant}
      />
      {isLocked && (
        <p className="text-xs text-muted-foreground">
          Le placement initial est verrouillé une fois la première séquence
          validée.
        </p>
      )}
    </div>
  );
}

function PlayerRow({
  team,
  title,
  players,
  onAdd,
  onRemove,
  locked,
  variant,
}: {
  team: TeamId;
  title: string;
  players: { id: string; num: number; team: TeamId }[];
  onAdd: (n: PlayerNumber, t: TeamId) => void;
  onRemove: (id: string) => void;
  locked: boolean;
  variant: "sidebar" | "drawer";
}) {
  const onCourtNums = new Set(
    players.filter((p) => p.team === team).map((p) => p.num),
  );
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {TEAM_NUMS.map((num) => {
          const onCourt = onCourtNums.has(num);
          const placement = players.find((p) => p.team === team && p.num === num);
          return (
            <button
              key={num}
              type="button"
              disabled={locked || (onCourt && !placement)}
              onClick={() =>
                onCourt && placement
                  ? !locked && onRemove(placement.id)
                  : onAdd(num as PlayerNumber, team)
              }
              className={cn(
                "relative aspect-square rounded-full font-bold text-white grid place-items-center transition-all",
                team === "team1" ? "bg-blue-600" : "bg-red-600",
                onCourt && "ring-2 ring-yellow-400",
                locked && "opacity-50 cursor-not-allowed",
                !locked && "active:scale-95",
                variant === "drawer" ? "text-lg" : "text-base",
              )}
            >
              {num}
              {onCourt && !locked && (
                <span className="absolute -top-1 -right-1 grid place-items-center bg-background rounded-full p-0.5">
                  <Trash2 className="size-3 text-destructive" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
