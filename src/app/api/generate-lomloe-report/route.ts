import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `Eres un experto en educación española y la LOMLOE (Ley Orgánica de Modificación de la LOE).
Generas informes de progreso trimestrales para familias y evaluaciones de competencias para inspección educativa.

COMPETENCIAS LOMLOE (8 clave):
- CLC: Competencia en Comunicación Lingüística
- CPL: Competencia Plurilingüe
- STEM: Competencia Matemática y en Ciencia, Tecnología e Ingeniería
- CD: Competencia Digital
- CPSAA: Competencia Personal, Social y de Aprender a Aprender
- CC: Competencia Ciudadana
- CE: Competencia Emprendedora
- CCEC: Competencia en Conciencia y Expresión Culturales

FORMATO DE RESPUESTA: JSON válido sin markdown.`;

export async function POST(request: NextRequest) {
  try {
    const { studentName, studentClass, projectName, competencies, evidencesCount, streak, reportType } = await request.json();

    const userPrompt = `Genera un informe ${reportType === "family" ? "para familias" : "de inspección LOMLOE"} para:
- Alumno: ${studentName}
- Clase: ${studentClass}
- Proyecto activo: ${projectName}
- Evidencias entregadas: ${evidencesCount}
- Racha de días consecutivos: ${streak}
- Progreso por competencia: ${JSON.stringify(competencies)}

${reportType === "family"
  ? `Genera un informe narrativo cálido y motivador para la familia. Incluye:
     1. Un párrafo principal (3-4 frases) explicando el progreso general de manera emocionalmente resonante
     2. Puntos fuertes del alumno (máximo 3)
     3. Áreas de mejora (máximo 2, expresadas positivamente)
     4. Mensaje de aliento personalizado`
  : `Genera un informe formal LOMLOE para inspección con:
     1. Evaluación por las 8 competencias clave (nivel: Iniciado/En desarrollo/Consolidado/Destacado)
     2. Conexión con criterios de evaluación del currículo
     3. Metodología de aprendizaje por proyectos aplicada`
}

Devuelve JSON con esta estructura:
{
  "reportType": "${reportType}",
  "generatedAt": "fecha actual",
  "student": "${studentName}",
  ${reportType === "family" ? `
  "summary": "párrafo narrativo para familia",
  "strengths": ["punto fuerte 1", "punto fuerte 2", "punto fuerte 3"],
  "improvements": ["área de mejora 1", "área de mejora 2"],
  "encouragement": "mensaje personalizado de aliento",
  "nextSteps": "qué viene próximamente"
  ` : `
  "competencyEvaluations": [
    {"key": "CLC", "level": "nivel", "justification": "justificación breve", "criteria": ["criterio 1"]},
    ...
  ],
  "methodology": "descripción de la metodología ABP aplicada",
  "overallAssessment": "evaluación global"
  `}
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text ?? "{}";
    const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("LOMLOE report error:", error);
    return NextResponse.json(
      { error: "Error generando el informe. Por favor inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
