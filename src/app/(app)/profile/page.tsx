import { createClient } from "@/lib/supabase/server";
import { ensureProfileRow } from "@/lib/supabase/ensureProfile";
import {
  displayMemberSince,
  displayUsername,
} from "@/lib/supabase/profileDisplay";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { SubscriptionStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function subscriptionLabel(status: SubscriptionStatus | undefined): string {
  switch (status) {
    case "active":
      return "Actif";
    case "trialing":
      return "Période d’essai";
    case "past_due":
      return "Paiement en retard";
    case "canceled":
      return "Annulé";
    case "incomplete":
      return "Incomplet";
    case "incomplete_expired":
      return "Expiré";
    case "unpaid":
      return "Impayé";
    case "inactive":
    default:
      return "Inactif";
  }
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    profile = await ensureProfileRow(supabase, user);
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="container py-8 max-w-2xl space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">Mon profil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Nom d'utilisateur" value={displayUsername(user, profile)} />
          <Row label="Membre depuis" value={displayMemberSince(user, profile)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>
            Statut de votre abonnement Zone Tactics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row
            label="Statut"
            value={subscriptionLabel(subscription?.status)}
          />
          {subscription?.current_period_end && (
            <Row
              label="Renouvellement"
              value={new Date(subscription.current_period_end).toLocaleDateString(
                "fr-FR",
              )}
            />
          )}
        </CardContent>
      </Card>

      <form action="/auth/signout" method="post">
        <Button variant="outline" type="submit">
          <LogOut className="size-4" /> Se déconnecter
        </Button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b last:border-0 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
