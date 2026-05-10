import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-muted-foreground">
          Cette page n'existe pas ou n'est plus disponible.
        </p>
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}
