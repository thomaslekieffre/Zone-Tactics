import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { BasketballIcon } from "@/components/BasketballIcon";
import {
  FadeUp,
  StaggerChildren,
  StaggerItem,
  HeroBackground,
  FeatureCard,
} from "./_components/MarketingMotion";
import { LandingDemo } from "./_components/LandingDemo";

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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto mb-8 leading-tight">
              Dessinez vos systèmes. <br className="hidden sm:block" />
              <span className="text-primary inline-flex items-center gap-3">
                Gagnez vos matchs.
                <BasketballIcon className="size-12 md:size-16 inline-block animate-bounce-soft" />
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Zone Tactics est le tableau noir numérique nouvelle génération. Créez des animations fluides, ajoutez votre voix, et partagez vos tactiques instantanément avec vos joueurs.
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pensé pour le terrain</h2>
              <p className="text-muted-foreground text-lg">
                Une interface épurée qui va à l'essentiel, pour que vous passiez moins de temps sur l'écran et plus de temps à coacher.
              </p>
            </div>
          </FadeUp>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StaggerItem>
              <FeatureCard
                icon="smartphone"
                title="100% Mobile & Tactile"
                description="Utilisez-le sur le banc avec votre tablette ou smartphone. Le drag & drop est natif et ultra-réactif."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon="mic"
                title="Coaching Vocal"
                description="Enregistrez vos consignes audio séquence par séquence. Vos joueurs entendent votre voix en regardant l'animation."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon="share"
                title="Partage Instantané"
                description="Envoyez un simple lien dans le groupe WhatsApp de l'équipe. Pas besoin de compte pour lire une tactique."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon="users"
                title="Attaque vs Défense"
                description="Placez vos attaquants (bleu) et vos défenseurs (rouge). Le ballon s'attache intelligemment."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon="play"
                title="Animations Fluides"
                description="Fini les flèches statiques incompréhensibles. Appuyez sur Play et regardez le système prendre vie."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon="sparkles"
                title="Zéro Prise de Tête"
                description="Pas de menus complexes. Une barre d'outils simple : Course, Passe, Tir. C'est tout."
              />
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container px-4 md:px-6 text-center relative z-10">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à révolutionner vos entraînements ?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez les coachs qui utilisent déjà Zone Tactics pour faire progresser leur équipe.
            </p>
            <Button asChild size="lg" className="h-12 px-8 rounded-full">
              <Link href="/signup">Créer mon compte gratuit</Link>
            </Button>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
