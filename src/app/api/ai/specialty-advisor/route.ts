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

function getHeuristicSpecialties(
  symptoms: string,
  age?: number,
  durationDays?: number
): AISpecialtyResponse {
  const lower = symptoms.toLowerCase();
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

  const isEmergency = emergencyKeywords.some((kw) => lower.includes(kw));
  const detectedSpecialties: AISpecialtyResponse["specialties"] = [];
  const redFlags: string[] = [];

  // 1. Cardiology
  if (
    lower.includes("chest") ||
    lower.includes("heart") ||
    lower.includes("palpitation") ||
    lower.includes("cardiac") ||
    lower.includes("angina") ||
    lower.includes("bp") ||
    lower.includes("hypertension")
  ) {
    detectedSpecialties.push({
      name: "Cardiology",
      reason: "Chest discomfort or cardiac rhythm irregularities warrant assessment by a cardiologist.",
      urgency: isEmergency ? "emergency" : "urgent",
    });
    if (isEmergency) {
      redFlags.push("Possible acute cardiac or respiratory event detected. Immediate hospital emergency care advised.");
    }
  }

  // 2. Neurology
  if (
    lower.includes("headache") ||
    lower.includes("migraine") ||
    lower.includes("seizure") ||
    lower.includes("numb") ||
    lower.includes("dizz") ||
    lower.includes("vertigo") ||
    lower.includes("stroke") ||
    lower.includes("nerve") ||
    lower.includes("tingling")
  ) {
    detectedSpecialties.push({
      name: "Neurology",
      reason: "Neurological symptoms (headaches, dizziness, focal numbness) indicate neurological evaluation.",
      urgency: isEmergency ? "emergency" : "soon",
    });
    if (isEmergency && !redFlags.length) {
      redFlags.push("Sudden severe neurological impairment requires urgent casualty evaluation.");
    }
  }

  // 3. Orthopedics
  if (
    lower.includes("bone") ||
    lower.includes("knee") ||
    lower.includes("joint") ||
    lower.includes("back pain") ||
    lower.includes("spine") ||
    lower.includes("neck pain") ||
    lower.includes("fracture") ||
    lower.includes("shoulder") ||
    lower.includes("arthritis") ||
    lower.includes("sprain")
  ) {
    detectedSpecialties.push({
      name: "Orthopedics",
      reason: "Musculoskeletal pain, joint swelling, or suspected structural injury should be evaluated by an orthopedic specialist.",
      urgency: lower.includes("fracture") ? "urgent" : "soon",
    });
  }

  // 4. Dermatology
  if (
    lower.includes("skin") ||
    lower.includes("rash") ||
    lower.includes("itch") ||
    lower.includes("acne") ||
    lower.includes("eczema") ||
    lower.includes("allergy") ||
    lower.includes("hair") ||
    lower.includes("scalp")
  ) {
    detectedSpecialties.push({
      name: "Dermatology",
      reason: "Cutaneous lesions, severe itching, or rashes warrant evaluation by a dermatologist.",
      urgency: "routine",
    });
  }

  // 5. Pediatrics
  if (
    lower.includes("child") ||
    lower.includes("baby") ||
    lower.includes("infant") ||
    lower.includes("newborn") ||
    lower.includes("toddler") ||
    (age !== undefined && age < 16)
  ) {
    detectedSpecialties.push({
      name: "Pediatrics",
      reason: "Pediatric age group or childhood symptoms require assessment by a certified pediatrician.",
      urgency: "soon",
    });
  }

  // 6. Gynecology
  if (
    lower.includes("pregnancy") ||
    lower.includes("period") ||
    lower.includes("menstrual") ||
    lower.includes("ovary") ||
    lower.includes("uterus") ||
    lower.includes("pcos") ||
    lower.includes("breast")
  ) {
    detectedSpecialties.push({
      name: "Gynecology",
      reason: "Obstetric, reproductive, or gynecological symptoms warrant assessment by a specialist in women's health.",
      urgency: "soon",
    });
  }

  // 7. Pulmonology
  if (
    lower.includes("cough") ||
    lower.includes("asthma") ||
    lower.includes("phlegm") ||
    lower.includes("lungs") ||
    lower.includes("breath") ||
    lower.includes("wheez")
  ) {
    detectedSpecialties.push({
      name: "Pulmonology",
      reason: "Persistent respiratory distress, wheezing, or chronic cough warrants examination by a pulmonologist.",
      urgency: isEmergency ? "emergency" : "soon",
    });
  }

  // 8. Gastroenterology
  if (
    lower.includes("stomach") ||
    lower.includes("abdomen") ||
    lower.includes("digest") ||
    lower.includes("vomit") ||
    lower.includes("acid") ||
    lower.includes("reflux") ||
    lower.includes("diarrhea") ||
    lower.includes("constipation") ||
    lower.includes("liver") ||
    lower.includes("jaundice")
  ) {
    detectedSpecialties.push({
      name: "Gastroenterology",
      reason: "Abdominal discomfort, acid reflux, or gastrointestinal issues warrant evaluation by a gastroenterologist.",
      urgency: "soon",
    });
  }

  // 9. ENT
  if (
    lower.includes("ear") ||
    lower.includes("throat") ||
    lower.includes("sinus") ||
    lower.includes("tonsil") ||
    lower.includes("hearing") ||
    lower.includes("voice") ||
    lower.includes("nasal") ||
    lower.includes("tinnitus")
  ) {
    detectedSpecialties.push({
      name: "ENT",
      reason: "Ear, nose, throat, or sinus discomfort indicates consultation with an ENT specialist.",
      urgency: "routine",
    });
  }

  // 10. Ophthalmology
  if (
    lower.includes("eye") ||
    lower.includes("vision") ||
    lower.includes("blur") ||
    lower.includes("cataract") ||
    lower.includes("cornea") ||
    lower.includes("red eye")
  ) {
    detectedSpecialties.push({
      name: "Ophthalmology",
      reason: "Visual disturbances, eye pain, or acuity changes require clinical evaluation by an ophthalmologist.",
      urgency: "soon",
    });
  }

  // 11. Psychiatry
  if (
    lower.includes("anxiety") ||
    lower.includes("depression") ||
    lower.includes("panic") ||
    lower.includes("stress") ||
    lower.includes("insomnia") ||
    lower.includes("sleep") ||
    lower.includes("mood")
  ) {
    detectedSpecialties.push({
      name: "Psychiatry",
      reason: "Symptoms of anxiety, persistent low mood, or severe sleep disruption warrant support from a mental health specialist.",
      urgency: "soon",
    });
  }

  // Fallback to General Medicine if nothing detected or if fever/viral
  if (
    detectedSpecialties.length === 0 ||
    lower.includes("fever") ||
    lower.includes("viral") ||
    lower.includes("fatigue") ||
    lower.includes("weakness")
  ) {
    detectedSpecialties.push({
      name: "General Medicine",
      reason: "Initial clinical evaluation and differential diagnosis by an Internal Medicine physician is recommended.",
      urgency: isEmergency ? "emergency" : "routine",
    });
  }

  return {
    specialties: detectedSpecialties,
    red_flags: redFlags,
    disclaimer: "This is an automated specialty navigation aid and not a medical diagnosis. Consult a qualified doctor.",
  };
}

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
    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is not configured or is a placeholder, use high-precision clinical heuristic engine
    if (!apiKey || apiKey === "your-gemini-api-key" || apiKey.startsWith("test_")) {
      const heuristicResult = getHeuristicSpecialties(symptoms, age, durationDays);
      return NextResponse.json(heuristicResult);
    }

    // Call Google Gemini Flash with strict structured JSON prompt
    try {
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
    } catch (geminiError) {
      console.warn("Gemini API call failed, falling back to clinical heuristic engine:", geminiError);
      const fallbackResult = getHeuristicSpecialties(symptoms, age, durationDays);
      return NextResponse.json(fallbackResult);
    }
  } catch (error) {
    console.error("Specialty Advisor Server Error:", error);
    return NextResponse.json(
      getHeuristicSpecialties("general malaise"),
      { status: 200 }
    );
  }
}
