import { createHmac } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { rsvpSchema } from "@/lib/validations";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const parsed = rsvpSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Confira os dados informados." }, { status: 400 });
  }

  const rateLimitSecret = process.env.RATE_LIMIT_SECRET;
  if (!rateLimitSecret || rateLimitSecret.length < 32) {
    console.error("RSVP is unavailable: RATE_LIMIT_SECRET is missing or too short.");
    return NextResponse.json({ error: "O serviço está temporariamente indisponível. Tente novamente mais tarde." }, { status: 503 });
  }

  const clientIp = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!clientIp) {
    return NextResponse.json({ error: "Não foi possível validar o envio. Tente novamente." }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data: existing, error: lookupError } = await supabase
      .from("rsvps")
      .select("id")
      .eq("submission_key", parsed.data.submission_key)
      .maybeSingle();

    if (lookupError) {
      console.error("RSVP idempotency lookup failed:", lookupError.code);
      return NextResponse.json({ error: "Não foi possível confirmar agora. Tente novamente." }, { status: 500 });
    }
    if (existing) return NextResponse.json({ ok: true });

    const fingerprint = createHmac("sha256", rateLimitSecret).update(clientIp).digest("hex");
    const { data: allowed, error: rateLimitError } = await supabase.rpc("consume_rsvp_rate_limit", {
      p_fingerprint: fingerprint,
    });

    if (rateLimitError) {
      console.error("RSVP rate-limit check failed:", rateLimitError.code);
      return NextResponse.json({ error: "O serviço está temporariamente indisponível. Tente novamente mais tarde." }, { status: 503 });
    }
    if (!allowed) {
      return NextResponse.json({ error: "Muitas tentativas em pouco tempo. Aguarde e tente novamente." }, { status: 429 });
    }

    const { error: insertError } = await supabase.from("rsvps").insert({
      full_name: parsed.data.full_name,
      relationship: parsed.data.relationship,
      submission_key: parsed.data.submission_key,
    });

    if (insertError) {
      if (insertError.code === "23505") return NextResponse.json({ ok: true });
      console.error("RSVP insert failed:", insertError.code);
      return NextResponse.json({ error: "Não foi possível salvar sua confirmação. Tente novamente." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("RSVP service configuration or request failed:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "O serviço está temporariamente indisponível. Tente novamente mais tarde." }, { status: 503 });
  }
}
