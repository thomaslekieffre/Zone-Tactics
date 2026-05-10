import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const BUCKET = "audio-comments";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const tacticId = String(form.get("tacticId") ?? "");
  const sequenceId = String(form.get("sequenceId") ?? "");

  if (!(file instanceof Blob) || !tacticId || !sequenceId) {
    return new NextResponse("Bad request", { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return new NextResponse("Audio too large (max 5MB)", { status: 413 });
  }

  const path = `${user.id}/${tacticId}/${sequenceId}.webm`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || "audio/webm",
      upsert: true,
    });
  if (error) {
    console.error("[audio upload]", error);
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json({ path });
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) return new NextResponse("Missing path", { status: 400 });

  const service = createServiceClient();

  // Authorize: owner OR a share exists for this tactic
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [userId, tacticId] = path.split("/");
  if (!userId || !tacticId) return new NextResponse("Bad path", { status: 400 });

  let allowed = !!user && user.id === userId;
  if (!allowed) {
    const { count } = await service
      .from("shares")
      .select("id", { count: "exact", head: true })
      .eq("tactic_id", tacticId);
    allowed = (count ?? 0) > 0;
  }
  if (!allowed) return new NextResponse("Forbidden", { status: 403 });

  const { data, error } = await service.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 10);
  if (error || !data) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}

export async function DELETE(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) return new NextResponse("Missing path", { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  if (!path.startsWith(`${user.id}/`)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return new NextResponse(error.message, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
