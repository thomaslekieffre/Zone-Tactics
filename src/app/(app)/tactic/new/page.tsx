import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TacticEditor } from "@/features/tactic/components/TacticEditor";
import { EMPTY_TACTIC } from "@/features/tactic/lib/types";
import { saveTactic } from "../[id]/actions";
import { getSubscriptionStatus } from "@/lib/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewTacticPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { isActive } = await getSubscriptionStatus(user.id);
  if (!isActive) {
    return (
      <div className="container py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Abonnement requis</CardTitle>
            <CardDescription>
              La création de tactiques est réservée aux abonnés Coach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TacticEditor
      initialId={null}
      initialName=""
      initialData={EMPTY_TACTIC}
      saveAction={saveTactic}
    />
  );
}
