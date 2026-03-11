import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `Eres un experto diseñador de proyectos educativos para el currículo español LOMLOE.
Analizas contenido educativo (libros de texto, programaciones, sílabos, artículos) y generas propuestas de Aprendizaje Basado en Proyectos (ABP) de nivel mundial.

REGLAS CRÍTICAS:
1. Genera exactamente 3 propuestas de proyecto que cubran ÁREAS DIFERENTES del contenido. Nunca las 3 sobre el mismo tema.
2. Cada proyecto debe ser práctico, conectado con el mundo real, y motivador para estudiantes de secundaria.
3. Mapea las competencias a las 8 claves LOMLOE: CLC (Comunicación Lingüística), CPL (Plurilingüe), STEM, CD (Digital), CPSAA (Personal/Social/Aprender a Aprender), CC (Ciudadana), CE (Emprendedora), CCEC (Cultural).
4. Usa los niveles de Bloom en español: Recordar, Comprender, Aplicar, Analizar, Evaluar, Crear.
5. Cada proyecto debe usar al menos 4 competencias diferentes.
6. Genera exactamente 4 sampleTasks por proyecto, distribuidas en distintas semanas.
7. Varía dificultad: usa "Básico", "Intermedio" o "Avanzado".
8. TODO el texto debe estar en ESPAÑOL.
9. Los proyectos deben tener un producto final tangible y real (no solo un informe).
10. Incluye impacto real: métricas concretas que el proyecto generaría (p.ej., €/ahorro, personas impactadas, datos reales).

Devuelve SOLO JSON válido con esta estructura exacta (sin markdown, sin comillas de código, solo JSON puro):
{
  "sourceAnalysis": {
    "source": "Nombre del currículo/libro analizado",
    "detectedSubject": "Asignatura principal detectada",
    "contentSummary": "Resumen de 2 frases del contenido analizado",
    "suggestedGrade": "Curso recomendado (ej: 1º ESO)",
    "topics": ["tema1", "tema2", "tema3", "tema4"],
    "learningObjectives": ["objetivo1", "objetivo2", "objetivo3"],
    "keyVocabulary": ["término1", "término2", "término3", "término4", "término5"]
  },
  "projects": [
    {
      "id": "gen-1",
      "emoji": "🚀",
      "name": "Título del Proyecto",
      "description": "Descripción de 2-3 frases del proyecto",
      "realWorldContext": "Conexión concreta con situaciones reales (1 frase)",
      "finalProduct": "Qué entregan los estudiantes al final (concreto)",
      "targetAudience": "Audiencia real del producto final",
      "duration": "X semanas",
      "totalTasks": <número>,
      "difficulty": "Básico" | "Intermedio" | "Avanzado",
      "competencies": ["CE", "CLC"],
      "highlights": ["ventaja1", "ventaja2", "ventaja3"],
      "crossCurricularLinks": ["Asignatura1", "Asignatura2"],
      "weeklyBreakdown": [
        { "week": 1, "phase": "Nombre de la Fase", "taskCount": <número>, "phaseGoal": "Objetivo de la semana" }
      ],
      "impactMetrics": [
        { "metric": "Personas impactadas", "value": "32", "description": "Clientes del mercadillo" }
      ],
      "differentiationTips": {
        "support": "Adaptación para estudiantes que necesitan apoyo",
        "extension": "Reto extra para estudiantes avanzados"
      },
      "teacherNotes": "Consejo breve para el profesor sobre cómo gestionar este proyecto",
      "sampleTasks": [
        {
          "id": "gen1-t1",
          "time": "50 min",
          "title": "Título de la Tarea",
          "description": "Descripción detallada (2-3 frases) de qué hace el alumno",
          "subject": "Asignatura",
          "competencies": ["CE", "CD"],
          "bloomLevel": "Analizar",
          "grouping": "pairs",
          "estimatedMinutes": 50,
          "evidence": "Qué entrega el alumno como evidencia",
          "xpReward": <número entre 40-90>
        }
      ],
      "rubric": [
        {
          "criterion": "Criterio de evaluación",
          "competency": "CE",
          "excellent": "Descripción nivel excelente",
          "good": "Descripción nivel bueno",
          "developing": "Descripción en desarrollo"
        }
      ]
    }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const description = formData.get("description") as string | null;
    const url = formData.get("url") as string | null;
    const grade = formData.get("grade") as string | null;
    const duration = formData.get("duration") as string | null;
    const subjects = formData.get("subjects") as string | null;
    const refinement = formData.get("refinement") as string | null;
    const bloomFocus = formData.get("bloomFocus") as string | null;
    const grouping = formData.get("grouping") as string | null;
    const modality = formData.get("modality") as string | null;
    const projectStyle = formData.get("projectStyle") as string | null;
    const extraContext = formData.get("extraContext") as string | null;

    // Build context parts
    const contextParts: string[] = [];

    if (grade) contextParts.push(`Curso/Nivel: ${grade}`);
    if (duration) contextParts.push(`Duración deseada: ${duration}`);
    if (subjects) contextParts.push(`Asignaturas/Áreas de enfoque: ${subjects}`);
    if (bloomFocus && bloomFocus !== "Cualquiera") contextParts.push(`Niveles de Bloom preferidos: ${bloomFocus}`);
    if (grouping && grouping !== "Mixto") contextParts.push(`Tipo de agrupamiento preferido: ${grouping}`);
    if (modality && modality !== "Presencial") contextParts.push(`Modalidad: ${modality}`);
    if (projectStyle && projectStyle !== "Cualquiera") contextParts.push(`Estilo de proyecto preferido: ${projectStyle}`);
    if (extraContext) contextParts.push(`Contexto adicional del profesor: "${extraContext}"`);
    if (refinement) contextParts.push(`Petición de refinamiento del profesor: "${refinement}" — ajusta las propuestas para satisfacer esta preferencia.`);

    let userPrompt = contextParts.length > 0
      ? `Parámetros pedagógicos:\n${contextParts.join("\n")}\n\n`
      : "";

    // Handle different input types
    let fileUri: string | null = null;
    let fileMimeType: string | null = null;

    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });
      const uploadResult = await ai.files.upload({
        file: blob,
        config: { mimeType: file.type },
      });
      fileUri = uploadResult.uri!;
      fileMimeType = file.type;
      userPrompt += "Analiza el documento curricular subido y genera 3 propuestas de proyecto ABP diversas y de alta calidad basadas en su contenido.";
    } else if (url && url.trim()) {
      userPrompt += `El profesor proporcionó esta URL de referencia curricular: ${url}\nBasándote en lo que probablemente contiene, genera 3 propuestas de proyecto ABP diversas y alineadas con LOMLOE.`;
    } else if (description && description.trim()) {
      userPrompt += `El profesor describió el contenido de aprendizaje así:\n"${description}"\n\nGenera 3 propuestas de proyecto ABP diversas y de alta calidad basadas en esta descripción.`;
    } else {
      return NextResponse.json(
        { error: "Por favor, proporciona un archivo PDF, URL o descripción." },
        { status: 400 }
      );
    }

    // Build contents
    const parts: Array<{ text: string } | { fileData: { fileUri: string; mimeType: string } }> = [];
    if (fileUri) {
      parts.push({ fileData: { fileUri, mimeType: fileMimeType! } });
    }
    parts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.75,
        maxOutputTokens: 12000,
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text ?? "";
    const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      projects: parsed.projects,
      sourceAnalysis: parsed.sourceAnalysis,
    });
  } catch (error) {
    console.error("Generate projects error:", error);
    const message = error instanceof Error ? error.message : "Error al generar proyectos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
