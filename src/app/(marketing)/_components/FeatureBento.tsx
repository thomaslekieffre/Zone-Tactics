"use client";

import { motion } from "motion/react";
import {
  Mic,
  Share2,
  Smartphone,
  Sparkles,
  PlayCircle,
  Users,
  Hand,
} from "lucide-react";

/**
 * Section bento : grille asymétrique 4 colonnes desktop (sm: 2, base: 1).
 * Chaque feature a son propre traitement visuel (decoration SVG thématique
 * basket, numéro éditorial fantôme, animations légères) pour casser la
 * monotonie d'une grille shadcn classique.
 */
export function FeatureBento() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(220px,auto)] gap-4 lg:gap-5">
      <FeatureBentoCell index="01" cls="lg:col-span-2 lg:row-span-2">
        <div className="flex flex-col h-full gap-6">
          <div>
            <Smartphone className="size-7 text-primary" />
            <h3 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">
              Pensé d&apos;abord pour le banc
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">
              Tablette en main pendant le timeout, smartphone à la mi-temps.
              Drag & drop natif, gestes tactiles, zéro lag.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Pointer / touch natif
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Coords normalisées 0..1
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Safe-area iOS
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                60 fps Konva
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <DeviceMock />
          </div>
        </div>
      </FeatureBentoCell>

      <FeatureBentoCell index="02" accent="blue-red">
        <Users className="size-7 text-primary" />
        <h3 className="mt-5 text-xl font-bold">Attaque vs Défense</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Attaquants <span className="text-team1 font-semibold">bleus</span>,
          défenseurs <span className="text-team2 font-semibold">rouges</span>.
          Le ballon s&apos;attache tout seul.
        </p>
        <TeamDots />
      </FeatureBentoCell>

      <FeatureBentoCell index="03">
        <Mic className="size-7 text-primary" />
        <h3 className="mt-5 text-xl font-bold">Coaching vocal</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Enregistrez vos consignes séquence par séquence. Vos joueurs entendent
          votre voix.
        </p>
        <Waveform />
      </FeatureBentoCell>

      <FeatureBentoCell index="04">
        <PlayCircle className="size-7 text-primary" />
        <h3 className="mt-5 text-xl font-bold">Animations fluides</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Fini les flèches statiques. Play, et le système prend vie.
        </p>
        <PlaybackTrail />
      </FeatureBentoCell>

      <FeatureBentoCell index="05">
        <Sparkles className="size-7 text-primary" />
        <h3 className="mt-5 text-xl font-bold">Zéro prise de tête</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Trois outils. C&apos;est tout.
        </p>
        <ToolChips />
      </FeatureBentoCell>

      <FeatureBentoCell index="06" cls="lg:col-span-2">
        <Share2 className="size-7 text-primary" />
        <h3 className="mt-5 text-xl sm:text-2xl font-bold">
          Partage instantané, sans compte
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">
          Un simple lien dans le groupe WhatsApp. Vos joueurs lisent la tactique
          en deux clics, pas besoin de s&apos;inscrire.
        </p>
        <ShareIllu />
      </FeatureBentoCell>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Wrapper card avec hover tilt léger + numéro fantôme        */
/* ---------------------------------------------------------- */
export function FeatureBentoCell({
  children,
  index,
  cls = "",
}: {
  children: React.ReactNode;
  index: string;
  cls?: string;
  accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border bg-background p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-primary/30 transition-shadow ${cls}`}
    >
      <span
        aria-hidden
        className="absolute top-3 right-4 font-black text-6xl sm:text-7xl tracking-tighter text-foreground/[0.03] select-none pointer-events-none"
      >
        {index}
      </span>
      <CourtLines />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.div>
  );
}

/* ---------------------------------------------------------- */
/* Decorations                                                 */
/* ---------------------------------------------------------- */

/** Lignes de terrain de basket en filigrane, en bas à droite de chaque card */
function CourtLines() {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-8 -right-8 w-40 h-40 text-primary/[0.04] group-hover:text-primary/[0.08] transition-colors"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="2" y="2" width="96" height="96" />
      <circle cx="50" cy="50" r="14" />
      <line x1="50" y1="2" x2="50" y2="98" />
      <path d="M2 30 H 25 V 70 H 2" />
      <path d="M98 30 H 75 V 70 H 98" />
      <path d="M2 50 A 48 48 0 0 1 50 2" />
    </svg>
  );
}

/**
 * Aperçu « tableau tactique » horizontal : pas de cadre noir type téléphone,
 * plutôt une planche glass + demi-terrain vue du dessus (lisible sur mobile).
 */
function DeviceMock() {
  return (
    <div className="relative w-full">
      <div className="rounded-2xl bg-gradient-to-br from-background/95 via-court/50 to-primary/[0.07] p-3 sm:p-4 shadow-lg shadow-primary/10 ring-1 ring-primary/25 backdrop-blur-[2px] transition-transform duration-500 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            Live bench
          </span>
          <span className="text-[10px] font-mono text-primary/80 tabular-nums">
            24<span className="text-muted-foreground">:</span>00
          </span>
        </div>
        {/* Demi-terrain horizontal — proportions NBA-like simplifiées */}
        <div className="relative aspect-[16/9] max-h-[132px] rounded-xl bg-[hsl(var(--court))] shadow-inner ring-1 ring-black/[0.06] overflow-hidden">
          <svg
            viewBox="0 0 200 112"
            className="absolute inset-0 size-full text-primary/35"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="1" y="1" width="198" height="110" rx="3" />
            <line x1="100" y1="1" x2="100" y2="111" />
            <circle cx="100" cy="56" r="18" />
            <path d="M 1 35 H 48 V 77 H 1" />
            <path d="M 199 35 H 152 V 77 H 199" />
          </svg>
          {/* Joueurs + ballon — positions fixes lisibles */}
          <motion.div
            className="absolute left-[14%] top-[42%] size-4 rounded-full bg-team1 shadow-md ring-2 ring-white"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute left-[38%] top-[58%] size-3.5 rounded-full bg-team2 ring-2 ring-white shadow-sm" />
          <div className="absolute left-[62%] top-[38%] size-3.5 rounded-full bg-team1 ring-2 ring-white shadow-sm" />
          <div className="absolute left-[72%] top-[52%] size-2.5 rounded-full bg-primary ring-2 ring-white shadow-md" />
          {/* Ghost finger drag */}
          <motion.div
            className="absolute right-[18%] bottom-[12%] size-8 rounded-full border-2 border-primary/40 bg-white/70 backdrop-blur-[1px] shadow-md flex items-center justify-center pointer-events-none"
            animate={{ x: [-6, 10, -6], y: [4, -8, 4] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            <Hand className="size-4 text-primary" strokeWidth={2} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/** 2 dots bleu/rouge avec ligne de "défense" entre */
function TeamDots() {
  return (
    <div className="relative mt-auto pt-6 h-16">
      <motion.div
        className="absolute left-2 bottom-2 size-8 rounded-full bg-team1 grid place-items-center text-white text-xs font-bold ring-4 ring-team1/20"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        4
      </motion.div>
      <motion.div
        className="absolute right-2 bottom-2 size-8 rounded-full bg-team2 grid place-items-center text-white text-xs font-bold ring-4 ring-team2/20"
        animate={{ x: [0, -30, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        4
      </motion.div>
    </div>
  );
}

/** Waveform animée pour le coaching vocal */
function Waveform() {
  return (
    <div className="mt-auto pt-6 flex items-end gap-1 h-12">
      {[0.5, 0.8, 0.4, 1, 0.6, 0.9, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6].map((h, i) => (
        <motion.span
          key={i}
          className="flex-1 bg-primary rounded-full origin-bottom"
          initial={{ scaleY: h }}
          animate={{ scaleY: [h, h * 0.4, h * 1.1, h] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.06,
            ease: "easeInOut",
          }}
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}

/**
 * Trajectoire « playback » : la courbe se dessine en boucle (pathLength),
 * jalons bleu / rouge / ballon — plus lisible qu’un point orange qui saute.
 */
function PlaybackTrail() {
  const d =
    "M 14 52 C 52 8 108 64 148 28 C 172 8 210 36 246 18";

  return (
    <div className="relative mt-auto pt-6">
      <svg
        viewBox="0 0 260 64"
        className="w-full h-[68px] overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id="playbackStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--team1))" stopOpacity="0.25" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--team2))" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {/* Fond fantôme */}
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-muted-foreground/25"
          strokeLinecap="round"
        />
        {/* Trait animé */}
        <motion.path
          d={d}
          fill="none"
          stroke="url(#playbackStroke)"
          strokeWidth="2.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            repeatDelay: 0.7,
            ease: [0.45, 0, 0.55, 1],
          }}
        />
        {/* Jalons */}
        <circle cx="14" cy="52" r="5" className="fill-team1" />
        <circle cx="148" cy="28" r="5" className="fill-team2" />
        <circle cx="246" cy="18" r="4" className="fill-primary stroke-white stroke-2" />
      </svg>
      <div className="flex justify-between gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mt-1 px-0.5">
        <span>Départ</span>
        <span className="text-primary">Course</span>
        <span>Fin</span>
      </div>
    </div>
  );
}

/** Trois petits chips : Course / Passe / Tir */
function ToolChips() {
  return (
    <div className="mt-auto pt-6 flex flex-wrap gap-2">
      {["Course", "Passe", "Tir"].map((label) => (
        <span
          key={label}
          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/** Bulle de chat avec lien partagé */
function ShareIllu() {
  return (
    <div className="mt-auto pt-6 flex justify-end -mr-2">
      <div className="relative max-w-[280px] rounded-2xl rounded-br-sm bg-emerald-500 text-white p-3 text-sm shadow-md">
        <div className="font-medium">Coach Tom</div>
        <div className="opacity-90 text-xs mt-0.5">
          Voilà le pick & roll pour samedi 👇
        </div>
        <div className="mt-2 rounded-lg bg-white/15 p-2 text-xs flex items-center gap-2">
          <span className="size-7 rounded bg-primary grid place-items-center text-[10px] font-bold">
            ZT
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">Pick & Roll — vs zone</div>
            <div className="text-[10px] opacity-80 truncate">
              zonetactics.app/share/k7p…
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
