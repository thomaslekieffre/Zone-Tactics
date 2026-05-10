import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import {
  FadeUp,
  StaggerChildren,
  StaggerItem,
  HeroBackground,
} from "@/app/(marketing)/_components/MarketingMotion";

export default function PricingPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-12 overflow-hidden">
      <HeroBackground />
      
      <div className="container max-w-xl relative z-10">
        <FadeUp>
          <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight leading-[1.1]">
            Passez au niveau{" "}
            <span className="relative inline-block italic bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              supérieur
            </span>
          </h1>
          <p className="text-balance text-center text-base sm:text-lg text-muted-foreground mb-12 max-w-md mx-auto">
            Toutes les fonctionnalités débloquées. Un seul prix simple et transparent.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-orange-400/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            
            <Card className="relative border-primary/50 shadow-2xl bg-background/95 backdrop-blur-sm">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="size-3" />
                  Offre de lancement
                </span>
              </div>

              <CardHeader className="text-center pb-8 pt-10">
                <CardTitle className="text-2xl font-bold">Coach Pro</CardTitle>
                <CardDescription className="text-base mt-2">Pour une saison complète sans limites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="text-center flex items-center justify-center gap-2">
                  <span className="text-6xl font-extrabold tracking-tighter">10 €</span>
                  <span className="text-xl text-muted-foreground font-medium mt-4"> / an</span>
                </div>
                
                <StaggerChildren className="space-y-4 max-w-sm mx-auto bg-muted/30 p-6 rounded-xl border border-muted">
                  <StaggerItem>
                    <Feature>Création de tactiques illimitées</Feature>
                  </StaggerItem>
                  <StaggerItem>
                    <Feature>Commentaires audio sur vos systèmes</Feature>
                  </StaggerItem>
                  <StaggerItem>
                    <Feature>Partage instantané par lien</Feature>
                  </StaggerItem>
                  <StaggerItem>
                    <Feature>Accessible sur mobile, tablette et desktop</Feature>
                  </StaggerItem>
                </StaggerChildren>
              </CardContent>
              <CardFooter className="pt-4 pb-8 px-8">
                <CheckoutButton className="w-full h-14 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" />
              </CardFooter>
            </Card>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-primary/10 p-1 mt-0.5 shrink-0">
        <Check className="size-4 text-primary" />
      </div>
      <span className="text-base text-foreground/90 font-medium">{children}</span>
    </div>
  );
}
