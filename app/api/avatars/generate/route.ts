import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hkbsfabrxgdwbjdveesz.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_phopOGsWG3qRAEchg2FeGw_FhDLp31m";

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "A geração por IA ainda não está configurada. Adicione OPENAI_API_KEY às variáveis de ambiente do servidor." }, { status: 503 });
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Entre na sua conta para gerar um avatar." }, { status: 401 });
  }

  let body: { prompt?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Envie uma descrição válida para o avatar." }, { status: 400 });
  }
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (prompt.length < 8 || prompt.length > 1200) {
    return NextResponse.json({ error: "A descrição deve ter entre 8 e 1.200 caracteres." }, { status: 400 });
  }

  const safePrompt = [
    "Create one original fictional adult character avatar, suitable for a social media creator profile.",
    "No real-person impersonation, no minors, no nudity, no sexual content, no graphic violence.",
    "Make the character visually clear, polished, expressive, with a simple background and centered composition.",
    "User's creative brief: " + prompt,
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-flare",
        prompt: safePrompt,
        size: "1024x1024",
        quality: "medium",
        output_format: "webp",
        n: 1,
        moderation: "auto",
      }),
      signal: AbortSignal.timeout(90000),
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("OpenAI image generation failed", response.status, result?.error?.code || "unknown_error");
      return NextResponse.json({ error: response.status === 429 ? "Limite temporário da geração por IA. Tente novamente mais tarde." : "Não foi possível gerar a imagem. Verifique a configuração da API e tente novamente." }, { status: response.status === 429 ? 429 : 502 });
    }
    const image = result?.data?.[0]?.b64_json;
    if (typeof image !== "string" || !image.length) {
      return NextResponse.json({ error: "A IA não retornou uma imagem. Tente novamente." }, { status: 502 });
    }
    return NextResponse.json({ image: `data:image/webp;base64,${image}`, model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2.5-flare" });
  } catch (error) {
    console.error("OpenAI image generation request failed", error instanceof Error ? error.name : "unknown_error");
    return NextResponse.json({ error: "Falha ao conectar com o serviço de geração. Tente novamente." }, { status: 502 });
  }
}
