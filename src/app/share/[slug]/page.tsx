import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tacticDataSchema } from "@/features/tactic/lib/validation";
import { TacticViewer } from "@/features/tactic/components/TacticViewer";

export const dynamic = "force-dynamic";

export default async function SharedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: share } = await supabase
    .from("shares")
    .select("tactic_id, tactics:tactic_id(id, name, data)")
    .eq("slug", slug)
    .maybeSingle();

  const tactic = (share as unknown as
    | { tactics: { id: string; name: string; data: unknown } | null }
    | null)?.tactics;
  if (!tactic) notFound();

  const parsed = tacticDataSchema.safeParse(tactic.data);
  if (!parsed.success) notFound();

  return (
    <TacticViewer
      id={tactic.id}
      name={tactic.name}
      data={parsed.data}
    />
  );
}
