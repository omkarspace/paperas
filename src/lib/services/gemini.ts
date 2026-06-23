import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function summarizeAbstract(text: string): Promise<string> {
  if (!genAI) {
    return "AI summarization not configured. Add GEMINI_API_KEY to enable.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Summarize this research abstract in 150-200 words, keeping the key findings and methodology:\n\n${text}`
    );
    return result.response.text();
  } catch (error) {
    console.error("Gemini summarization error:", error);
    return "Failed to generate summary";
  }
}

export async function extractKeywords(text: string): Promise<string[]> {
  if (!genAI) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Extract 5-8 relevant research keywords from this text. Return only a comma-separated list:\n\n${text}`
    );
    const response = result.response.text();
    return response.split(",").map((k) => k.trim().toLowerCase());
  } catch (error) {
    console.error("Gemini keyword extraction error:", error);
    return [];
  }
}

export async function improveWriting(text: string): Promise<string> {
  if (!genAI) {
    return text;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(
      `Improve the academic writing quality of this text while preserving the meaning:\n\n${text}`
    );
    return result.response.text();
  } catch (error) {
    console.error("Gemini improvement error:", error);
    return text;
  }
}
