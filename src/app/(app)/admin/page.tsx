import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/library");
  }

  const [{ count: usersCount }, { count: tacticsCount }, { count: subsCount }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("tactics").select("id", { count: "exact", head: true }),
      supabase
        .from("subscriptions")
        .select("user_id", { count: "exact", head: true })
        .eq("status", "active"),
    ]);

  return (
    <div className="container py-8 max-w-3xl space-y-6">
      <h1 className="text-2xl sm:text-3xl font-semibold">Admin</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Utilisateurs" value={usersCount ?? 0} />
        <Stat label="Tactiques" value={tacticsCount ?? 0} />
        <Stat label="Abonnés actifs" value={subsCount ?? 0} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
