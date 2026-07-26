import { NextResponse } from "next/server";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Heartbeat pour empêcher la pause du projet Supabase free (7j d'inactivité).
 * Appelé par le cron Vercel (vercel.json) — backup du workflow GitHub Actions
 * qui peut être désactivé après 60j sans activité repo.
 *
 * Auth : `Authorization: Bearer $CRON_SECRET` (recommandé).
 * Sans CRON_SECRET, on accepte uniquement les requêtes Vercel Cron
 * (`x-vercel-cron: 1`).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (cronSecret) {
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else if (!isVercelCron) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = getSupabaseUrl().replace(/\/$/, "");
  const key = getSupabasePublishableKey();
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };

  const checks: Record<string, number> = {};

  try {
    const authRes = await fetch(`${url}/auth/v1/health`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
    checks.auth = authRes.status;

    const restRes = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
    checks.rest = restRes.status;

    const ok = [checks.auth, checks.rest].some((s) => s === 200 || s === 206);
    if (!ok) {
      return NextResponse.json(
        { ok: false, checks, at: new Date().toISOString() },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      checks,
      at: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ping failed";
    return NextResponse.json(
      { ok: false, error: message, at: new Date().toISOString() },
      { status: 502 },
    );
  }
}
