import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { BasketballIcon } from "@/components/BasketballIcon";
import {
  FadeUp,
  HeroBackground,
} from "./_components/MarketingMotion";
import { FeatureBento } from "./_components/FeatureBento";
import { LandingDemo } from "./_components/LandingDemo";

export const metadata: Metadata = {
  title: "Tactiques basketball animées — tableau noir coach mobile",
  description:
    "Zone Tactics : dessine ton playbook sur téléphone ou tablette, anime tes systèmes (course, passe, tir), exporte en vidéo verticale pour Reels / TikTok, partage un lien à ton équipe. Bleu = attaquants, rouge = défenseurs.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zone Tactics — Dessine et anime tes tactiques de basket",
    description:
      "Export vidéo WebM Reels & YouTube, coaching vocal, partage sans compte.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/90 to-muted/50" />
        <HeroBackground />

        <div className="container px-4 md:px-6 text-center relative z-10">
          <FadeUp delay={0.1}>
            <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 leading-[1.05]">
              <span className="text-foreground/90">Dessinez vos </span>
              <span className="relative inline-block text-foreground">
                systèmes.
                <svg
                  aria-hidden
                  viewBox="0 0 220 14"
                  className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-2 sm:h-3 text-primary"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 Q 55 1 110 7 T 218 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              <span className="inline-flex items-center gap-2 sm:gap-3 italic bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Gagnez vos matchs.
              </span>
              <BasketballIcon className="ml-2 size-9 sm:size-12 md:size-16 inline-block align-middle animate-bounce-soft" />
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-balance text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Le tableau noir numérique des coachs modernes. Animations fluides, commentaires audio, partage instantané.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base w-full sm:w-auto rounded-full shadow-lg shadow-primary/20 group">
                <Link href="/signup">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto rounded-full bg-background group">
                <Link href="/demo">
                  Voir la démo en live
                  <PlayCircle className="ml-2 size-4 transition-transform group-hover:scale-110" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Live App Preview */}
      <section className="container px-4 md:px-6 -mt-12 md:-mt-20 relative z-10 pb-24">
        <div className="rounded-2xl border bg-background p-3 md:p-5 shadow-xl ring-1 ring-border/50">
          <LandingDemo />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/30 border-y">
        <div className="container px-4 md:px-6">
          <FadeUp>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                Pensé pour{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">le terrain</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-primary/30 -rotate-1 -z-0 rounded"
                  />
                </span>
              </h2>
              <p className="text-balance text-muted-foreground text-base sm:text-lg">
                Une interface épurée qui va à l&apos;essentiel. Moins de temps sur l&apos;écran, plus de temps à coacher.
              </p>
            </div>
          </FadeUp>

          <FeatureBento />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container px-4 md:px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Prêt à{" "}
              <span className="italic bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                tout changer
              </span>{" "}
              cette saison&nbsp;?
            </h2>
            <p className="text-balance text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez les coachs qui utilisent Zone Tactics pour faire progresser leur équipe, match après match.
            </p>
            <Button asChild size="lg" className="h-12 px-8 rounded-full shadow-lg shadow-primary/20">
              <Link href="/signup">
                Créer mon compte gratuit
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
