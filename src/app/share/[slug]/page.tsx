import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tacticDataSchema } from "@/features/tactic/lib/validation";
import { TacticViewer } from "@/features/tactic/components/TacticViewer";
import { SharePinGate } from "@/features/tactic/components/SharePinGate";

export const dynamic = "force-dynamic";

type RpcPayload = {
  ok?: boolean;
  locked?: boolean;
  error?: string;
  id?: unknown;
  name?: unknown;
  data?: unknown;
};

export default async function SharedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: raw, error } = await supabase.rpc("get_shared_tactic_data", {
    p_slug: slug,
    p_pin: null,
  });

  if (error || raw == null || typeof raw !== "object") notFound();

  const row = raw as RpcPayload;
  if (row.ok === false || row.error === "not_found") notFound();

  if (row.locked === true) {
    return <SharePinGate slug={slug} />;
  }

  const parsed = tacticDataSchema.safeParse(row.data);
  if (!parsed.success) notFound();

  return (
    <TacticViewer
      id={String(row.id)}
      name={String(row.name)}
      data={parsed.data}
    />
  );
}
