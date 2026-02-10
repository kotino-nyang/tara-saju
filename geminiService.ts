
import { GoogleGenAI, Type } from "@google/genai";
import { FormData } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generatePreview(data: FormData): Promise<string> {
    const prompt = `
      User Info:
      Name: ${data.name}
      Intent: ${data.intent === 'life' ? 'Life/Career/Future' : 'Romance/Marriage'}
      Birth: ${data.birthDate} ${data.birthTime} (${data.calendarType})
      
      Provide a very short, sophisticated "pre-reading" snippet (3 sentences) in Korean that sounds like a professional Saju master. 
      Focus on "flow" and "timing". The tone should be calm, Zen, and insightful (Japandi style).
      End with a welcoming message to the full report.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
        }
      });
      return response.text || "데이터 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    } catch (error) {
      console.error("Gemini Preview Error:", error);
      return "운명의 흐름을 읽는 중입니다. 정밀한 리포트를 위해 상세 데이터를 분석하고 있습니다.";
    }
  }
}

export const geminiService = new GeminiService();
