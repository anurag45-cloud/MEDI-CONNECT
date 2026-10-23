import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiSpecialtyResponseSchema, AISpecialtyResponse } from "@/lib/validation/schemas";

// Input validation schema
const requestBodySchema = z.object({
  symptoms: z.string().min(2, "Symptoms description is required"),
  age: z.number().optional(),
  durationDays: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = requestBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { symptoms, age, durationDays } = parsed.data;

    // Check for acute emergency keywords to prioritize patient safety immediately
    const emergencyKeywords = [
      "chest pain",
      "heart attack",
      "cannot breathe",
      "difficulty breathing",
      "unconscious",
      "seizure",
      "stroke",
      "severe bleeding",
      "choking",
      "loss of speech",
      "sudden paralysis",
    ];

    const isEmergency = emergencyKeywords.some((kw) =>
      symptoms.toLowerCase().includes(kw)
    );

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Deterministic Clinical Heuristic Fallback when GEMINI_API_KEY is absent
      const lower = symptoms.toLowerCase();
      const detectedSpecialties: AISpecialtyResponse["specialties"] = [];
      const redFlags: string[] = [];

      if (
        lower.includes("chest") ||
        lower.includes("heart") ||
        lower.includes("palpitation") ||
        lower.includes("breath")
      ) {
        detectedSpecialties.push({
          name: "Cardiology",
          reason: "Chest discomfort or cardiac rhythm irregularities warrant assessment by a cardiologist.",
          urgency: isEmergency ? "emergency" : "urgent",
        });
        if (isEmergency) {
          redFlags.push("Possible acute cardiac or respiratory event detected.");
        }
      }

      if (
        lower.includes("headache") ||
        lower.includes("seizure") ||
        lower.includes("numb") ||
        lower.includes("dizziness") ||
        lower.includes("stroke")
      ) {
        detectedSpecialties.push({
          name: "Neurology",
          reason: "Neurological symptoms (headaches, dizziness, focal numbness) indicate neurological evaluation.",
          urgency: isEmergency ? "emergency" : "soon",
        });
      }

      if (
        lower.includes("bone") ||
        lower.includes("knee") ||
        lower.includes("joint") ||
        lower.includes("back pain") ||
        lower.includes("fracture")
      ) {
        detectedSpecialties.push({
          name: "Orthopedics",
          reason: "Musculoskeletal pain, joint swelling, or potential fracture should be evaluated by an orthopedic surgeon.",
          urgency: "soon",
        });
      }

      if (
        lower.includes("skin") ||
        lower.includes("rash") ||
        lower.includes("itch") ||
        lower.includes("acne")
      ) {
        detectedSpecialties.push({
          name: "Dermatology",
          reason: "Cutaneous lesions, severe itching, or rashes warrant evaluation by a dermatologist.",
          urgency: "routine",
        });
      }

      if (
        lower.includes("child") ||
        lower.includes("baby") ||
        lower.includes("infant") ||
        (age !== undefined && age < 16)
      ) {
        detectedSpecialties.push({
          name: "Pediatrics",
          reason: "Pediatric age group or childhood symptoms require assessment by a pediatrician.",
          urgency: "soon",
        });
      }

      if (
        lower.includes("pregnancy") ||
        lower.includes("period") ||
        lower.includes("menstrual") ||
        lower.includes("ovary")
      ) {
        detectedSpecialties.push({
          name: "Gynecology",
          reason: "Obstetric or gynecological symptoms warrant assessment by a specialist in women's health.",
          urgency: "soon",
        });
      }

      if (
        lower.includes("cough") ||
        lower.includes("asthma") ||
        lower.includes("phlegm") ||
        lower.includes("lungs")
      ) {
        detectedSpecialties.push({
          name: "Pulmonology",
          reason: "Persistent respiratory distress or cough warrants examination by a pulmonologist.",
          urgency: "soon",
        });
      }

      if (
        lower.includes("stomach") ||
        lower.includes("digest") ||
        lower.includes("vomit") ||
        lower.includes("acid") ||
        lower.includes("liver")
      ) {
        detectedSpecialties.push({
          name: "Gastroenterology",
          reason: "Abdominal discomfort, acid reflux, or hepatic symptoms warrant evaluation by a gastroenterologist.",
          urgency: "soon",
        });
      }

      if (detectedSpecialties.length === 0) {
        detectedSpecialties.push({
          name: "General Medicine",
          reason: "General systemic symptoms benefit from initial diagnostic evaluation by an Internal Medicine physician.",
          urgency: "routine",
        });
      }

      const responsePayload: AISpecialtyResponse = {
        specialties: detectedSpecialties,
        red_flags: redFlags,
        disclaimer: "This is not a medical diagnosis. Consult a qualified doctor.",
      };

      return NextResponse.json(responsePayload);
    }

    // Call Google Gemini Flash with strict structured JSON prompt
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert clinical triage assistant for a healthcare platform.
Analyze the user's reported symptoms and identify the most appropriate medical specialties for a clinical consultation.
You DO NOT diagnose specific diseases and you DO NOT prescribe medication.

Patient Context:
- Reported Symptoms: "${symptoms}"
- Patient Age: ${age ? `${age} years` : "Unspecified"}
- Symptom Duration: ${durationDays ? `${durationDays} days` : "Unspecified"}

Respond with a single valid JSON object strictly matching this schema:
{
  "specialties": [
    {
      "name": "Medical Specialty Name (e.g., Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, Gynecology, General Medicine, Pulmonology, Gastroenterology, ENT, Ophthalmology, Psychiatry)",
      "reason": "Brief clinical explanation why this specialty is appropriate",
      "urgency": "routine" | "soon" | "urgent" | "emergency"
    }
  ],
  "red_flags": ["List of acute danger signs if present, otherwise empty array"],
  "disclaimer": "This is not a medical diagnosis. Consult a qualified doctor."
}

Rules:
1. If symptoms suggest myocardial infarction, acute stroke, severe respiratory failure, or severe anaphylaxis, set urgency to "emergency" and include specific red flags.
2. Output ONLY the raw JSON string without any markdown fences, backticks, or preamble.
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const jsonParsed = JSON.parse(text);
    const validated = aiSpecialtyResponseSchema.parse(jsonParsed);

    return NextResponse.json(validated);
  } catch (error) {
    console.error("Gemini Specialty Advisor Error:", error);
    return NextResponse.json(
      {
        specialties: [
          {
            name: "General Medicine",
            reason: "Initial clinical evaluation by an Internal Medicine physician is recommended.",
            urgency: "routine",
          },
        ],
        red_flags: [],
        disclaimer: "This is not a medical diagnosis. Consult a qualified doctor.",
      },
      { status: 200 }
    );
  }
}
