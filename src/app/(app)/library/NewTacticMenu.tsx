"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  ChevronDown,
  GitBranch,
  LayoutGrid,
  Layers,
  Plus,
  Repeat,
  Shuffle,
  Square,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTemplateCatalogEntries } from "@/features/tactic/lib/templates";

const ICONS: Record<string, React.ReactNode> = {
  vide: <Square className="size-4 text-primary shrink-0" />,
  "pick-roll": <Layers className="size-4 text-primary shrink-0" />,
  "zone-23": <LayoutGrid className="size-4 text-primary shrink-0" />,
  horns: <GitBranch className="size-4 text-primary shrink-0" />,
  "iso-wing": <Target className="size-4 text-primary shrink-0" />,
  "spain-pnr": <Repeat className="size-4 text-primary shrink-0" />,
  transition: <Zap className="size-4 text-primary shrink-0" />,
  handoff: <ArrowLeftRight className="size-4 text-primary shrink-0" />,
  "motion-weak": <Shuffle className="size-4 text-primary shrink-0" />,
};

export function NewTacticMenu() {
  const rows = getTemplateCatalogEntries();

  return (
    <div className="flex">
      <Button asChild className="rounded-r-none">
        <Link href="/tactic/new">
          <Plus className="size-4" /> Nouvelle
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            className="rounded-l-none border-l border-primary-foreground/20 px-2"
            aria-label="Choisir un template"
          >
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 max-h-[min(70vh,520px)] overflow-y-auto"
        >
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Partir d&apos;un template
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {rows.map((t) => (
            <DropdownMenuItem key={t.key} asChild className="gap-2 cursor-pointer">
              <Link href={`/tactic/new?template=${t.key}`}>
                {ICONS[t.key] ?? <Layers className="size-4 text-primary shrink-0" />}
                <div>
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.blurb}</div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
