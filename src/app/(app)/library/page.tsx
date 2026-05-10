import Link from "next/link";
import { listTactics } from "./actions";
import { TacticCard } from "./TacticCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const tactics = await listTactics();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold">Ma bibliothèque</h1>
        <Button asChild>
          <Link href="/tactic/new">
            <Plus className="size-4" /> Nouvelle
          </Link>
        </Button>
      </div>

      {tactics.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground mb-4">
            Aucune tactique pour le moment.
          </p>
          <Button asChild>
            <Link href="/tactic/new">Créer ma première tactique</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tactics.map((t) => (
            <TacticCard key={t.id} tactic={t} />
          ))}
        </div>
      )}
    </div>
  );
}
