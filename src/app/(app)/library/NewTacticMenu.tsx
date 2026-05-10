"use client";

import Link from "next/link";
import { Plus, ChevronDown, FileText, Layers, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TEMPLATES: {
  key: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "vide",
    label: "Terrain vide",
    desc: "Place tes joueurs from scratch",
    icon: <Square className="size-4 text-primary" />,
  },
  {
    key: "pick-roll",
    label: "Pick & roll",
    desc: "Démo prête à modifier (4 séquences)",
    icon: <Layers className="size-4 text-primary" />,
  },
  {
    key: "zone-23",
    label: "Zone 2-3",
    desc: "Squelette défensif, 0 séquence",
    icon: <FileText className="size-4 text-primary" />,
  },
];

export function NewTacticMenu() {
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
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Partir d&apos;un template
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {TEMPLATES.map((t) => (
            <DropdownMenuItem key={t.key} asChild className="gap-2 cursor-pointer">
              <Link href={`/tactic/new?template=${t.key}`}>
                {t.icon}
                <div>
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
