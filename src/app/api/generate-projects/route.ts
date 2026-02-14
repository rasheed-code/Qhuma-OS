import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are an expert educational project designer for the Spanish LOMLOE curriculum framework.
You analyze educational content (textbooks, syllabi, curricula) and generate project-based learning proposals.

IMPORTANT RULES:
1. Generate exactly 3 project proposals that cover DIFFERENT areas/units of the provided content. Do NOT focus all 3 on the same topic.
2. Each project must be practical, hands-on, and engaging for secondary school students.
3. Map competencies to the 8 LOMLOE keys: CLC (Comunicación Lingüística), CPL (Plurilingüe), STEM, CD (Digital), CPSAA (Personal/Social), CC (Ciudadana), CE (Emprendedora), CCEC (Cultural).
4. Each project should use at least 4 different competencies.
5. Generate exactly 4 sampleTasks per project (not more). Keep task descriptions to 1-2 sentences.
6. Vary difficulty across the 3 proposals (mix of Intermediate and Advanced).
7. Keep ALL text concise. Descriptions should be 2 sentences max.

Return ONLY valid JSON with this exact structure (no markdown, no code fences, just raw JSON):
{
  "sourceAnalysis": {
    "source": "Name of the curriculum/textbook analyzed",
    "topics": ["topic1", "topic2", ...],
    "learningObjectives": ["objective1", "objective2", ...]
  },
  "projects": [
    {
      "id": "gen-1",
      "name": "Project Title",
      "description": "2-3 sentence description of the project",
      "duration": "X weeks",
      "totalTasks": <number>,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "competencies": ["CE", "CLC", ...],
      "highlights": ["highlight1", "highlight2", "highlight3"],
      "weeklyBreakdown": [
        { "week": 1, "phase": "Phase Name", "taskCount": <number> }
      ],
      "sampleTasks": [
        {
          "id": "gen1-t1",
          "time": "8:30 – 9:30",
          "title": "Task Title",
          "description": "Detailed task description (2-3 sentences)",
          "subject": "Subject Area",
          "competencies": ["CE", "CD"],
          "evidence": "What students submit as evidence",
          "xpReward": <number between 30-90>
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

    // Build context parts
    const contextParts: string[] = [];

    if (grade) contextParts.push(`Grade level: ${grade}`);
    if (duration) contextParts.push(`Desired project duration: ${duration}`);
    if (subjects) contextParts.push(`Subject focus areas: ${subjects}`);
    if (refinement) contextParts.push(`Teacher's refinement request: "${refinement}" — adjust the proposals to match this preference.`);

    let userPrompt = contextParts.length > 0
      ? `Parameters:\n${contextParts.join("\n")}\n\n`
      : "";

    // Handle different input types
    let fileUri: string | null = null;
    let fileMimeType: string | null = null;

    if (file && file.size > 0) {
      // Upload PDF to Gemini Files API
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });
      const uploadResult = await ai.files.upload({
        file: blob,
        config: { mimeType: file.type },
      });
      fileUri = uploadResult.uri!;
      fileMimeType = file.type;
      userPrompt += "Analyze the uploaded curriculum document and generate 3 diverse project proposals based on its content.";
    } else if (url && url.trim()) {
      userPrompt += `The teacher provided this curriculum URL as reference: ${url}\nBased on what this URL likely contains (it's a curriculum/syllabus document), generate 3 diverse project proposals.`;
    } else if (description && description.trim()) {
      userPrompt += `The teacher described the learning content as follows:\n"${description}"\n\nGenerate 3 diverse project proposals based on this description.`;
    } else {
      return NextResponse.json(
        { error: "Please provide a PDF file, URL, or description." },
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
        temperature: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    // Extract text from response
    const rawText = response.text ?? "";

    // Parse JSON — strip code fences if present
    const cleaned = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      projects: parsed.projects,
      sourceAnalysis: parsed.sourceAnalysis,
    });
  } catch (error) {
    console.error("Generate projects error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate projects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
