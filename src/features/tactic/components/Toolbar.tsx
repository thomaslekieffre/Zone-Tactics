"use client";

import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Play,
  Send,
  Square,
  Target,
  Undo2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useTacticStore,
  courtIsEmpty,
  currentPositions,
} from "../hooks/useTacticStore";
import { nearestPlayer } from "../lib/geometry";
import { cn } from "@/lib/utils";

type Props = {
  onPlay: () => void;
  onStop: () => void;
  className?: string;
};

export function Toolbar({ onPlay, onStop, className }: Props) {
  const tool = useTacticStore((s) => s.tool);
  const data = useTacticStore((s) => s.data);
  const isPlaying = useTacticStore((s) => s.isPlaying);
  const draftMovementsCount = useTacticStore(
    (s) => Object.keys(s.draftMovements).length,
  );
  const draftPass = useTacticStore((s) => s.draftPass);
  const shootPlayerId = useTacticStore((s) => s.shootPlayerId);

  const setTool = useTacticStore((s) => s.setTool);
  const cancelDraft = useTacticStore((s) => s.cancelDraft);
  const validateSequence = useTacticStore((s) => s.validateSequence);
  const removeLastSequence = useTacticStore((s) => s.removeLastSequence);
  const pickPassFrom = useTacticStore((s) => s.pickPassFrom);
  const pickShootPlayer = useTacticStore((s) => s.pickShootPlayer);

  const empty = courtIsEmpty(data);

  /** Joueur team1 actuellement porteur du ballon (le plus proche du ballon). */
  const findHolder = () => {
    const positions = currentPositions(data);
    if (!positions.ball) return null;
    return nearestPlayer(
      positions.ball,
      positions.players,
      (p) => p.team === "team1",
    );
  };

  const onPickPass = () => {
    if (tool === "pass") {
      cancelDraft();
      return;
    }
    const holder = findHolder();
    if (!holder) {
      toast.error("Aucun porteur du ballon");
      return;
    }
    pickPassFrom(holder.id);
  };

  const onPickShoot = () => {
    if (tool === "shoot") {
      cancelDraft();
      return;
    }
    const holder = findHolder();
    if (!holder) {
      toast.error("Aucun porteur du ballon");
      return;
    }
    pickShootPlayer(holder.id);
  };
  const canValidate =
    draftMovementsCount > 0 ||
    !!shootPlayerId ||
    !!(draftPass?.fromPlayerId && draftPass.toPlayerId);

  const onValidate = () => {
    const err = validateSequence();
    if (err) toast.error(err);
    else toast.success("Séquence validée");
  };

  const items: ToolItem[] = [
    {
      id: "arrow",
      label: "Course",
      icon: <ArrowRight className="size-5" />,
      active: tool === "arrow",
      disabled: empty || isPlaying,
      onClick: () => setTool(tool === "arrow" ? "idle" : "arrow"),
    },
    {
      id: "pass",
      label: "Passe",
      icon: <Send className="size-5" />,
      active: tool === "pass",
      disabled: empty || isPlaying || !data.initialSetup.ball,
      onClick: onPickPass,
    },
    {
      id: "shoot",
      label: "Tir",
      icon: <Target className="size-5" />,
      active: tool === "shoot",
      disabled: empty || isPlaying || !data.initialSetup.ball,
      onClick: onPickShoot,
    },
    {
      id: "undo",
      label: "Annuler dernière",
      icon: <Undo2 className="size-5" />,
      disabled: data.sequences.length === 0 || isPlaying,
      onClick: () => removeLastSequence(),
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((it) => (
        <ToolButton key={it.id} {...it} />
      ))}
      <div className="hidden sm:block w-px self-stretch bg-border mx-1" />
      <ToolButton
        id="cancel"
        label="Annuler"
        icon={<X className="size-5" />}
        disabled={tool === "idle" && !canValidate}
        onClick={cancelDraft}
      />
      <Button
        size="sm"
        onClick={onValidate}
        disabled={!canValidate || isPlaying}
        className="gap-2"
      >
        <Check className="size-4" /> Valider
      </Button>
      <div className="ml-auto flex items-center gap-2">
        {isPlaying ? (
          <Button size="sm" variant="destructive" onClick={onStop} className="gap-2">
            <Square className="size-4" /> Stop
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={onPlay}
            disabled={data.sequences.length === 0}
            className="gap-2"
          >
            <Play className="size-4" /> Lecture
          </Button>
        )}
      </div>
    </div>
  );
}

type ToolItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolButton({ icon, label, active, disabled, onClick }: ToolItem) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-10 w-10 grid place-items-center rounded-md border transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card hover:bg-accent",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {icon}
    </button>
  );
}
