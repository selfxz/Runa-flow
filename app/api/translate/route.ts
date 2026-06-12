import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: "Faltan parámetros: text, sourceLang, targetLang" },
        { status: 400 }
      );
    }

    // Google Translate free API — soporta quechua (qu)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Translate respondió con status ${response.status}`);
    }

    const data = await response.json();

    if (data && data[0]) {
      const translated = data[0]
        .map((item: string[]) => item[0])
        .filter(Boolean)
        .join("");

      return NextResponse.json({ translated, source: "google" });
    }

    return NextResponse.json(
      { error: "No se pudo obtener la traducción" },
      { status: 500 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error en traducción:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
