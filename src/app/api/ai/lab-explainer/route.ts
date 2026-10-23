import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { explainerRequestSchema, getHeuristicLabExplanation } from "@/lib/services/lab-explainer";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = explainerRequestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { reportTitle, parameters, clinicalImpression, userQuestion, history } = parsed.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // Use Gemini 1.5 Flash if available
    if (apiKey && apiKey !== "your-gemini-api-key" && !apiKey.startsWith("test_")) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const formattedParams = parameters
          .map((p) => `- ${p.name}: ${p.result} ${p.unit} (Ref: ${p.reference_range}) [Status: ${p.flag}]`)
          .join("\n");

        const prompt = `
You are MediBot, an empathetic, certified clinical educator and patient communication specialist on the MediConnect platform.
Your mission is to explain medical laboratory reports to patients in brief, simple, warm, human language.

Patient Context:
- Report: "${reportTitle}"
- Parameters:
${formattedParams}
- Clinical Impression: "${clinicalImpression || "Routine laboratory assessment"}"

Patient's Question or Prompt:
"${userQuestion || "Please explain my report simply and tell me what I should know."}"

Previous Conversation Turns (if any):
${(history || []).map((h) => `${h.sender.toUpperCase()}: ${h.text}`).join("\n")}

Guidelines:
1. Explain findings using everyday, relatable metaphors (e.g. comparing hemoglobin to oxygen delivery trucks, HDL to arterial street sweepers).
2. Highlight what is normal and reassuring first, before explaining values that need attention.
3. Be encouraging and calm. Avoid alarming or frightening language.
4. Provide practical, non-prescription lifestyle and dietary tips.
5. Suggest 2-3 specific questions the patient can ask their doctor.
6. Provide output in JSON strictly matching this schema:
{
  "reply": "Your markdown-formatted warm conversational reply",
  "keyTakeaways": ["3-4 concise bullet points summarizing the report"],
  "audioScript": "A brief 2-sentence conversational summary suitable for text-to-speech audio"
}
`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith("```json")) {
          text = text.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const parsedJson = JSON.parse(text);
        return NextResponse.json({
          success: true,
          ...parsedJson,
        });
      } catch (geminiError) {
        console.warn("Gemini lab explanation failed, using clinical heuristic fallback:", geminiError);
      }
    }

    // High-precision conversational heuristic explainer fallback
    const heuristic = getHeuristicLabExplanation(
      reportTitle,
      parameters,
      clinicalImpression,
      userQuestion
    );

    return NextResponse.json({
      success: true,
      ...heuristic,
    });
  } catch (err) {
    console.error("Lab explainer API error:", err);
    return NextResponse.json(
      { error: "Failed to generate lab report explanation" },
      { status: 500 }
    );
  }
}
