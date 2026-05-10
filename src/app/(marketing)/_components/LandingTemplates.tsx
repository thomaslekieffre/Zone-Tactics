import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  GitBranch,
  LayoutGrid,
  Layers,
  Repeat,
  Shuffle,
  Square,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTemplateCatalogEntries } from "@/features/tactic/lib/templates";

const ICONS: Record<string, React.ReactNode> = {
  vide: <Square className="size-5 text-primary shrink-0" />,
  "pick-roll": <Layers className="size-5 text-primary shrink-0" />,
  "zone-23": <LayoutGrid className="size-5 text-primary shrink-0" />,
  horns: <GitBranch className="size-5 text-primary shrink-0" />,
  "iso-wing": <Target className="size-5 text-primary shrink-0" />,
  "spain-pnr": <Repeat className="size-5 text-primary shrink-0" />,
  transition: <Zap className="size-5 text-primary shrink-0" />,
  handoff: <ArrowLeftRight className="size-5 text-primary shrink-0" />,
  "motion-weak": <Shuffle className="size-5 text-primary shrink-0" />,
};

export function LandingTemplates() {
  const entries = getTemplateCatalogEntries();

  return (
    <section id="templates" className="py-24 scroll-mt-20">
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Modèles prêts à l&apos;emploi
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg text-balance">
            Démarre depuis un terrain pré-rempli : Horns, Spain, zone, transition…
            Tu ouvres l&apos;éditeur avec les placements déjà posés.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {entries.map((t) => {
            const href =
              t.key === "vide"
                ? "/login?redirect=%2Ftactic%2Fnew"
                : `/login?redirect=${encodeURIComponent(`/tactic/new?template=${t.key}`)}`;

            return (
              <div
                key={t.key}
                className="flex flex-col rounded-xl border bg-card p-4 text-left shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex gap-3 items-start mb-2">
                  {ICONS[t.key] ?? (
                    <Layers className="size-5 text-primary shrink-0" />
                  )}
                  <div>
                    <h3 className="font-semibold leading-tight">{t.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">
                      {t.blurb}
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="secondary" className="mt-auto w-full">
                  <Link href={href}>
                    Ouvrir ce modèle
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-primary font-medium underline-offset-4 hover:underline">
            Inscription gratuite
          </Link>
        </p>
      </div>
    </section>
  );
}
