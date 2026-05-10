"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, null);

  if (state && "success" in state && state.success) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mb-4 grid place-items-center size-14 rounded-full bg-primary/10">
            <MailCheck className="size-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Vérifiez votre boîte mail</CardTitle>
          <CardDescription className="text-balance">
            Un lien de confirmation a été envoyé à{" "}
            <span className="font-medium text-foreground">{state.email}</span>.
            Cliquez dessus pour activer votre compte avant de vous connecter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-2">
            <p>
              Pas reçu ? Pensez à regarder dans vos <strong>spams</strong> ou
              <strong> indésirables</strong>.
            </p>
            <p>
              Le lien expire au bout de 24h. Vous pourrez en redemander un
              depuis l'écran de connexion.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/login">Aller à la connexion</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const errorMessage =
    state && "error" in state ? state.error : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          Commencez à dessiner vos tactiques en quelques secondes.
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              name="username"
              required
              minLength={3}
              maxLength={30}
              pattern="[a-zA-Z0-9_-]+"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              8 caractères minimum.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Vous recevrez un email de confirmation à valider avant de pouvoir
            vous connecter.
          </p>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Création..." : "Créer mon compte"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
