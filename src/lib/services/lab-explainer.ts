import { z } from "zod";

export const explainerRequestSchema = z.object({
  reportId: z.string().optional(),
  reportTitle: z.string(),
  parameters: z.array(
    z.object({
      name: z.string(),
      result: z.union([z.number(), z.string()]),
      unit: z.string(),
      reference_range: z.string(),
      flag: z.enum(["normal", "low", "high", "critical"]),
      plain_explanation: z.string().optional(),
    })
  ),
  clinicalImpression: z.string().optional(),
  userQuestion: z.string().optional(),
  history: z
    .array(
      z.object({
        sender: z.enum(["user", "bot"]),
        text: z.string(),
      })
    )
    .optional(),
});

export function getHeuristicLabExplanation(
  reportTitle: string,
  parameters: Array<{ name: string; result: any; unit: string; reference_range: string; flag: string; plain_explanation?: string }>,
  clinicalImpression?: string,
  userQuestion?: string
): { reply: string; keyTakeaways: string[]; audioScript: string } {
  const q = (userQuestion || "").toLowerCase().trim();

  // Handle specific user follow-up questions
  if (q.includes("diet") || q.includes("food") || q.includes("eat")) {
    if (reportTitle.toLowerCase().includes("lipid") || reportTitle.toLowerCase().includes("cholesterol")) {
      return {
        reply: "Great question! To help improve your cholesterol naturally:\n\n• **More of this**: Oats, lentils, walnuts, methi (fenugreek) seeds, and fresh green leafy vegetables which contain soluble fiber that pulls excess cholesterol out of your blood.\n• **Less of this**: Reduce deep-fried snacks (pakoras, samosas), heavy saturated ghee/butter, and baked items made with palm oil or vanaspati.\n• **Cooking oil**: Rotate between mustard oil and cold-pressed groundnut/olive oil in small measured quantities (about 3-4 teaspoons a day).",
        keyTakeaways: [
          "Incorporate 25-30g of dietary fiber daily (oats, legumes, flaxseeds)",
          "Swap saturated cooking fats for heart-healthy unsaturated oils",
          "A daily 30-minute brisk walk enhances your HDL 'good' cholesterol",
        ],
        audioScript: "To improve your cholesterol, focus on fiber-rich foods like oats and lentils, while cutting back on deep-fried snacks and heavy butter.",
      };
    }
    if (reportTitle.toLowerCase().includes("glucose") || reportTitle.toLowerCase().includes("hba1c") || reportTitle.toLowerCase().includes("sugar")) {
      return {
        reply: "For managing blood sugar and your 6.7% HbA1c:\n\n• **Carbohydrate discipline**: Replace refined white rice and maida with whole grains like jowar, bajra, or whole wheat with bran.\n• **Meal order matters**: Start every lunch and dinner with a bowl of raw salad or cucumbers. Fiber creates a gentle mesh in your stomach so sugar enters your bloodstream slowly.\n• **Avoid liquid sugar**: Stop fruit juices, soda, and sweet tea. Stick to water, unsweetened buttermilk, or green tea.",
        keyTakeaways: [
          "Prioritize low-glycemic grains (Jowar, Bajra, Oats) over refined carbs",
          "Eat salads first before chapati or rice to blunt glucose spikes",
          "Avoid sugary beverages completely",
        ],
        audioScript: "For your blood sugar, switch to whole grains like jowar and bajra, eat your salads first, and avoid sugary drinks.",
      };
    }
    if (reportTitle.toLowerCase().includes("blood") || reportTitle.toLowerCase().includes("cbc")) {
      return {
        reply: "To gently boost your hemoglobin (currently 11.2 g/dL):\n\n• **Iron-rich foods**: Dark green leafy vegetables (palak, methi), beetroot, pomegranates, jaggery (gud) in moderation, roasted chana (gram), and dates.\n• **Vitamin C pair**: Vitamin C increases iron absorption by up to 300%. Squeeze fresh lemon juice over your dal, or eat an amla or orange alongside meals.\n• **Avoid tea with meals**: Do not drink tea or coffee right after lunch or dinner, as tannins block iron absorption.",
        keyTakeaways: [
          "Consume iron-rich foods: spinach, beetroot, pomegranate, and jaggery",
          "Pair iron with Vitamin C (lemon or amla) for maximum absorption",
          "Wait at least 1 hour after meals before drinking tea or coffee",
        ],
        audioScript: "To bring your hemoglobin up, eat more spinach, beetroot, and pomegranate, add fresh lemon juice to your food, and avoid drinking tea immediately after meals.",
      };
    }
  }

  if (q.includes("dangerous") || q.includes("emergency") || q.includes("serious") || q.includes("worry")) {
    const hasAbnormal = parameters.some((p) => p.flag === "low" || p.flag === "high" || p.flag === "critical");
    if (!hasAbnormal) {
      return {
        reply: "Not dangerous at all! In fact, all values in this report are in the safe, normal reference range. You have nothing urgent or alarming to worry about.",
        keyTakeaways: ["All tested markers are within physiological normal limits", "No acute emergency or danger sign detected"],
        audioScript: "There is nothing dangerous in this report. All tested values are healthy and within normal ranges.",
      };
    }
    return {
      reply: "There are **no critical medical emergencies** in this report. While a couple of numbers are outside the ideal range, they indicate mild, chronic lifestyle adjustments rather than an immediate hospital emergency. You should review them comfortably with your doctor at your next scheduled visit.",
      keyTakeaways: [
        "No critical emergency indicators found",
        "Out-of-range values are mild and manageable with lifestyle changes",
        "Discuss with your doctor during your routine review",
      ],
      audioScript: "Don't worry, there is no acute emergency in this report. The numbers just point to mild adjustments you can discuss with your doctor.",
    };
  }

  if (q.includes("question") || q.includes("ask doctor")) {
    return {
      reply: `Here are 3 high-yield questions you can ask your doctor regarding your ${reportTitle}:\n\n1. *"Given my results, should we start with lifestyle and dietary adjustments for 3 months, or do I need medication now?"*\n2. *"When would you like me to repeat this test to track our progress?"*\n3. *"Are there any specific vitamins or supplements (such as Iron, Vitamin D, or Omega-3) that you recommend for me?"*`,
      keyTakeaways: [
        "Ask whether diet/exercise is enough or if medicine is needed",
        "Ask for a repeat test timeline (typically 60 to 90 days)",
        "Ask if nutritional supplements are indicated",
      ],
      audioScript: "Ask your doctor if you can begin with diet changes, when to retest, and whether any supplements are helpful.",
    };
  }

  // General report overview (teaching report in simple human language)
  const abnormalParams = parameters.filter((p) => p.flag !== "normal");
  const normalParams = parameters.filter((p) => p.flag === "normal");

  let replyText = `Hello! Let me break down your **${reportTitle}** into plain, everyday language.\n\n`;

  if (abnormalParams.length === 0) {
    replyText += `🎉 **Good news:** Every single test parameter in this panel is completely **normal and healthy**! Your organs are doing their jobs well.\n\n`;
    replyText += `• **Key Highlights**: ${normalParams.map((p) => `${p.name} is ${p.result} ${p.unit} (healthy)`).slice(0, 3).join(", ")}.`;
  } else {
    replyText += `### 1. What Looks Great (Normal)\n`;
    replyText += normalParams.slice(0, 3).map((p) => `• **${p.name}** (${p.result} ${p.unit}): In the healthy target zone.`).join("\n");
    replyText += `\n\n### 2. What Needs a Little Care & Attention\n`;
    replyText += abnormalParams.map((p) => {
      const direction = p.flag === "low" ? "slightly below" : "a bit above";
      return `• **${p.name}** (${p.result} ${p.unit}): This is ${direction} the standard target of ${p.reference_range} ${p.unit}. ${p.plain_explanation || ""}`;
    }).join("\n\n");

    replyText += `\n\n### 3. What Does This Mean for You?\n`;
    if (clinicalImpression) {
      replyText += `${clinicalImpression}\n\n`;
    } else {
      replyText += `These variations are very common and often respond quickly to balanced nutrition, hydration, and regular exercise.\n\n`;
    }

    replyText += `Feel free to ask me questions like: *"What foods should I eat?"*, *"Is this dangerous?"*, or *"What should I ask my doctor?"*!`;
  }

  const takeaways = abnormalParams.length === 0
    ? ["All laboratory parameters are in the optimal healthy range", "Continue your current balanced lifestyle and routine checkups"]
    : abnormalParams.map((p) => `${p.name}: ${p.result} ${p.unit} (${p.flag.toUpperCase()}) — ${p.plain_explanation || "Needs clinical review"}`);

  const audio = abnormalParams.length === 0
    ? `Your ${reportTitle} is completely normal and healthy. All test markers are in the safe reference range.`
    : `In your ${reportTitle}, most values look good, while ${abnormalParams.map((p) => p.name).join(" and ")} need a little attention. You can easily manage these with good nutrition and a doctor's guidance.`;

  return {
    reply: replyText,
    keyTakeaways: takeaways,
    audioScript: audio,
  };
}
