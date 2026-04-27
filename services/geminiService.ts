import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'undefined') {
  console.warn("WARNING: GEMINI_API_KEY is not set or undefined. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_API_KEY' });

export const analyzeMediaIntegrity = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `Perform a rigorous forensic analysis on this image to detect signs of AI generation or digital manipulation (Deepfake).

            Investigate the following indicators:
            1. **Lighting & Physics**: Inspect eye reflections (corneal specular highlights) for consistency. Check shadow fall-off and directionality.
            2. **Texture Analysis**: Look for overly smooth skin ('wax-like'), repetitive hair strands, or inconsistent fabric textures.
            3. **Anatomical Consistency**: Check ear symmetry, finger count/shape, teeth alignment, and eyeglass rendering.
            4. **Background Artifacts**: Identify warped lines, nonsensical object blending, or depth-of-field anomalies.
            5. **Noise Patterns**: Check for inconsistent digital noise (ISO grain) between the subject and background.

            Output requirements:
            - **Score**: 0 (Definite Fake) to 100 (Definite Real). Be critical.
            - **Verdict**: 'REAL' (Score > 85), 'FAKE' (Score < 50), 'UNCERTAIN' (50-85).
            - **Summary**: A concise, executive summary of findings suitable for a security report.
            - **Artifacts**: A bulleted list of specific visual evidence found (e.g., "Mismatched earrings", "Inconsistent pupil shape").
            - **Technical Metrics**: Rate specific aspects on a 0-10 scale (10 being perfectly natural).
            `
          }
        ]
      },
      config: {
        systemInstruction: "You are TrueSight, a senior digital forensics AI. Your tone is clinical, objective, and extremely precise. Do not hallucinate artifacts; only report what is visually evident.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "0 to 100 integrity score." },
            verdict: { type: Type.STRING, enum: ["REAL", "FAKE", "UNCERTAIN"] },
            summary: { type: Type.STRING },
            artifacts: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of visual anomalies."
            },
            technicalMetrics: {
              type: Type.OBJECT,
              properties: {
                lightingConsistency: { type: Type.NUMBER, description: "0-10" },
                textureNaturalness: { type: Type.NUMBER, description: "0-10" },
                anatomyCorrectness: { type: Type.NUMBER, description: "0-10" },
                backgroundCoherence: { type: Type.NUMBER, description: "0-10" }
              },
              required: ["lightingConsistency", "textureNaturalness", "anatomyCorrectness", "backgroundCoherence"]
            },
            reasoning: { type: Type.STRING }
          },
          required: ["score", "verdict", "summary", "artifacts", "technicalMetrics", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Deepfake analysis failed:", error);
    throw error;
  }
};