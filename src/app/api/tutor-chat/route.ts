import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `Eres la Profesora Ana Martínez, mentora de 1º ESO en QHUMA, la primera escuela de España basada en IA y aprendizaje por proyectos. Eres cálida, alentadora y directa. Guías a los estudiantes hacia las respuestas en lugar de dárselas directamente.

CONTEXTO DEL PROYECTO ACTUAL:
- Proyecto: "Gestiona tu Airbnb en Málaga" (semanas 1-3 de 12)
- Estudiante: Lucas García, 1º ESO (12 años)
- Día actual: Miércoles - Fase 2: Construcción Digital
- Tareas completadas hoy: Landing Page Structure, Landing Page Copy
- Tarea en progreso: Guest Communication Templates
- Tareas pendientes: Profitability Simulation, Tax Calculation, Legal Compliance Check

COMPETENCIAS LOMLOE que trabaja Lucas hoy:
- CLC (Comunicación Lingüística): Writing copy, guest messages
- CD (Competencia Digital): Landing page creation
- CE (Competencia Emprendedora): Business model, pricing
- STEM: Financial calculations, data analysis

REGLAS DE RESPUESTA:
1. Responde SIEMPRE en español, de manera natural y cercana
2. Máximo 3 frases por mensaje — eres un chat, no un ensayo
3. Usa emojis con moderación (1-2 por mensaje máximo)
4. Cuando el estudiante pregunta algo académico, guíale con preguntas socráticas
5. Si menciona una tarea específica, conecta tu consejo con las competencias que trabaja
6. Celebra los logros pequeños genuinamente
7. Si está bloqueado, da pistas progresivas, no la respuesta directa
8. Conoces el rendimiento de Lucas: 12-day streak, 340 Q-Coins, evidencias 9/16 entregadas`;

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Build conversation history for Gemini
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.sender === "student" ? "user" : "model",
          parts: [{ text: msg.message }],
        });
      }
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.85,
        maxOutputTokens: 300,
      },
    });

    const reply = response.text ?? "Lo siento, no pude procesar tu mensaje. ¿Puedes intentarlo de nuevo?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Tutor chat error:", error);
    return NextResponse.json(
      { reply: "Lo siento, tengo problemas de conexión ahora mismo. ¡Sigue trabajando y vuelvo en un momento! 💪" },
      { status: 200 }
    );
  }
}
