import { GoogleGenAI } from "@google/genai";
import { BlueprintContext } from "../types";
import { MASTER_PROMPT_TEMPLATE } from "../constants";

// Initialize Gemini Client
// Note: API Key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlueprintStream = async (
  context: BlueprintContext,
  onChunk: (text: string) => void
) => {
  const modelId = "gemini-2.5-flash"; // Using Flash for speed/efficiency with long context

  // Interpolate variables into the prompt
  // Using split/join to ensure all instances in the long prompt are updated (compatibility fix for replaceAll)
  const filledPrompt = MASTER_PROMPT_TEMPLATE
    .split("${country}").join(context.country)
    .split("${city}").join(context.city)
    .split("${niche1}").join(context.niche1)
    .split("${niche2}").join(context.niche2)
    .split("${systemSpec}").join(context.systemSpec);

  try {
    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: [
        {
          role: "user",
          parts: [{ text: filledPrompt }],
        },
      ],
      config: {
        // Thinking budget optional for logic, but here we just need structured text gen.
        // We will stick to standard generation.
        maxOutputTokens: 8192, // Allow for long documentation
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            onChunk(text);
        }
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate documentation.");
  }
};