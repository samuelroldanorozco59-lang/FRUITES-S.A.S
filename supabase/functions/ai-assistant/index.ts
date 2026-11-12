// ============================================================================
// SUPABASE EDGE FUNCTION: ai-assistant
// ============================================================================
// Atiende las consultas del Asistente Virtual FRUITES llamando al modelo Gemini.
// La clave GEMINI_API_KEY se almacena como secreto seguro en Supabase
// (supabase secrets set GEMINI_API_KEY=tu_clave) y NUNCA se expone en el cliente.
// Mejoras de auditoría (A-03):
// - Cabecera 'x-goog-api-key' en lugar de query string.
// - Campo dedicado 'systemInstruction' en el payload.
// - Códigos de estado HTTP semánticos (500, 503, 400).
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
// Modelo recomendado vigente (Gemini Flash)
const MODEL_NAME = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY no está configurada como secreto en el servidor.",
          reply: "El servicio de IA está en configuración. Por favor contáctanos por WhatsApp al 3249037227 para atenderte de inmediato.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 503 }
      );
    }

    const { message, catalog } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Mensaje inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Sanitización básica y limitación de longitud
    const cleanMessage = message.trim().slice(0, 300);

    // Formatear catálogo recibido para contexto del modelo
    const catalogContext = (catalog && Array.isArray(catalog))
      ? catalog.map((p) => `- ${p.nombre} (${p.fruta}): ${p.descripcion || p.descripcionCorta}`).join("\n")
      : "Mango Tropical, Piña Dorada, Papaya Caribe, Banano Tropical.";

    // Instrucciones de sistema estrictas (Anti-alucinación y tono de marca)
    const systemInstruction = `
Eres el asistente virtual oficial de FRUITES, una marca colombiana de snacks de frutas tropicales deshidratadas en bolsa stand-up pouch resellable, nacida en Barranquilla (WhatsApp oficial: 3249037227).

REGLAS OBLIGATORIAS:
1. Habla en español colombiano cercano, amable, respetuoso y breve (máximo 2 a 3 oraciones concisas).
2. SOLO habla de FRUITES, sus sabores, momentos de consumo, pedidos y venta para negocios (B2B).
3. Recomienda ÚNICAMENTE productos del catálogo recibido:
${catalogContext}
4. Menciona que los pedidos pueden realizarse directamente por la tienda web con envío a toda Colombia, o coordinarse por WhatsApp al 3249037227.
5. PROHIBIDO hacer afirmaciones de salud, propiedades curativas o dietéticas ("adelgaza", "cura", "previene", "antioxidante milagroso"). Enfócate en el sabor natural, la textura suave, la practicidad y el momento del día.
6. NO inventes cifras de ventas, premios ni ingredientes no comprobados.
7. Si el usuario pregunta algo fuera de tema (política, deportes, tareas escolares, etc.), agradécele y redirígelo cordialmente a los snacks FRUITES.
    `.trim();

    // Llamada segura a la API REST de Gemini usando encabezado x-goog-api-key y systemInstruction dedicado
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: cleanMessage }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.6,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Error en llamada a Gemini:", errText);
      return new Response(
        JSON.stringify({
          error: "Error del proveedor de IA",
          reply: "¡Hola! En este momento no pude conectar con el modelo. Te invito a consultar los sabores en nuestra tienda o escribirnos directamente a WhatsApp al 3249037227.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    const data = await geminiRes.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "¡Hola! Gracias por tu mensaje. Para detalles de pedidos o compras en línea, visita nuestra tienda web o escríbenos a nuestro WhatsApp al 3249037227.";

    return new Response(
      JSON.stringify({ reply: replyText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("Excepción en Edge Function:", err);
    return new Response(
      JSON.stringify({
        error: "Excepción en servidor",
        reply: "Ocurrió una pausa en la conexión. Déjanos un mensaje en el formulario o escríbenos por WhatsApp al 3249037227.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
