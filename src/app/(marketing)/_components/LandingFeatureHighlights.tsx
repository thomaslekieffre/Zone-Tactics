"use client";

import Link from "next/link";
import { ArrowRight, Film, Lock, Pencil, Sparkles } from "lucide-react";
import { FeatureBentoCell } from "./FeatureBento";

const ITEMS = [
  {
    index: "07",
    icon: Film,
    title: "GIF + WebM",
    text: "Export animé pour Slack ou montage vertical Reels / TikTok.",
    illu: GifWebmIllu,
  },
  {
    index: "08",
    icon: Lock,
    title: "Partage à PIN",
    text: "Lien public avec code coach — stats de vues sur le partage.",
    illu: PinStatsIllu,
  },
  {
    index: "09",
    icon: Pencil,
    title: "Annotations parquet",
    text: "Craie et libellés figés sur le terrain pour tes consignes.",
    illu: ParquetAnnotIllu,
  },
] as const;

export function LandingFeatureHighlights() {
  return (
    <div className="mt-16 border-t border-border/60 pt-12 md:mt-20 md:pt-16">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
          <Sparkles className="size-3.5 text-primary" />
          Fonctionnalités récentes
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Tout ce qu&apos;il faut pour préparer le match
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-4 lg:gap-5">
        {ITEMS.map((it) => (
          <FeatureBentoCell key={it.index} index={it.index}>
            <it.icon className="size-7 text-primary" />
            <h3 className="mt-5 text-xl font-bold">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {it.text}
            </p>
            <it.illu />
          </FeatureBentoCell>
        ))}
      </div>
      <p className="text-center mt-10 text-sm text-muted-foreground">
        <Link
          href="/signup"
          className="text-primary font-medium inline-flex items-center gap-1 hover:underline"
        >
          Créer un compte
          <ArrowRight className="size-4" />
        </Link>
        {" · "}
        <Link href="/demo" className="underline-offset-4 hover:underline">
          ou voir la démo
        </Link>
      </p>
    </div>
  );
}

/** Pellicule + badges format comme les chips de la card 05 */
function GifWebmIllu() {
  return (
    <div className="mt-auto pt-6 space-y-3">
      <div className="relative h-12">
        <div
          aria-hidden
          className="absolute inset-y-1 left-0 w-14 rounded-lg border border-primary/20 bg-primary/[0.05]"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-3 w-14 rounded-lg border border-primary/25 bg-background shadow-sm"
        />
        <div
          aria-hidden
          className="absolute inset-y-1 left-6 w-14 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/[0.12] to-primary/[0.04]"
        />
        <svg
          aria-hidden
          viewBox="0 0 120 22"
          className="absolute right-0 top-1 h-5 w-28 text-primary/60"
          fill="none"
        >
          <path
            d="M2 16 C 28 4, 52 19, 76 10 S 106 10, 118 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5 4"
          />
        </svg>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold border border-primary/25">
            GIF
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold border border-primary/25">
            WebM
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-[11px] font-semibold border border-border">
            9:16
          </span>
          <span className="px-2 py-1 rounded-full bg-background text-muted-foreground text-[10px] font-medium border border-border">
            Reels/TikTok
          </span>
        </div>
      </div>
    </div>
  );
}

/** Lien + PIN + mini barres « vues » */
function PinStatsIllu() {
  const barsPx = [16, 28, 18, 36, 22, 32, 20];
  return (
    <div className="mt-auto pt-6 space-y-3">
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-2.5 py-2 text-[10px] font-mono text-muted-foreground">
        <Lock className="size-3.5 text-primary shrink-0" aria-hidden />
        <span className="truncate">zonetactics.app/share/…</span>
        <span className="text-primary font-bold tracking-widest shrink-0">
          ••••
        </span>
      </div>
      <div className="flex h-11 items-end gap-1.5 px-0.5">
        {barsPx.map((px, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-primary/35"
            style={{ height: px }}
          />
        ))}
      </div>
      <div className="text-[10px] font-medium text-muted-foreground text-right">
        Vues sur 7 jours
      </div>
    </div>
  );
}

/** Trait type craie + étiquette figée */
function ParquetAnnotIllu() {
  return (
    <div className="mt-auto pt-6">
      <svg
        viewBox="0 0 220 36"
        className="w-full h-9 text-primary/55"
        fill="none"
        aria-hidden
      >
        <path
          d="M 6 26 Q 48 6 96 24 T 188 14 T 214 20"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="5 4"
        />
      </svg>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-700/60">
          Zone 2—3
        </span>
        <span className="text-[10px] font-medium px-2.5 py-1 rounded-md border border-dashed border-primary/40 text-primary/90 bg-background/80">
          Craie
        </span>
      </div>
    </div>
  );
}
