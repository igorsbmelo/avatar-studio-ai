import { NextResponse } from "next/server";

/**
 * Paid image generation is intentionally disabled while this project is in free mode.
 * Keep the endpoint closed so stale clients cannot accidentally spend API credits.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "A geração de imagens por IA está desativada no modo gratuito. Use Encontrar no catálogo para receber sugestões sem custo.",
      code: "PAID_IMAGE_GENERATION_DISABLED",
    },
    { status: 410 },
  );
}
