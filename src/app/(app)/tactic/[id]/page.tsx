import { notFound, redirect } from "next/navigation";
import { TacticEditor } from "@/features/tactic/components/TacticEditor";
import { loadTactic, saveTactic } from "./actions";
import { tacticDataSchema } from "@/features/tactic/lib/validation";
import { EMPTY_TACTIC } from "@/features/tactic/lib/types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TacticPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const tactic = await loadTactic(id);
  if (!tactic) notFound();

  const parsed = tacticDataSchema.safeParse(tactic.data);
  const data = parsed.success ? parsed.data : EMPTY_TACTIC;

  return (
    <TacticEditor
      initialId={tactic.id}
      initialName={tactic.name}
      initialData={data}
      saveAction={saveTactic}
    />
  );
}
