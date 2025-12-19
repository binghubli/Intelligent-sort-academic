import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get a configured model
const getModel = (modelName: string = 'gemini-3-flash-preview') => {
  return ai.models;
};

export const generateMathProblem = async (topic: string): Promise<string> => {
  if (!apiKey) return JSON.stringify({ error: "API Key missing" });

  try {
    const prompt = `
      Create a 4th-grade math problem about ${topic}.
      Return ONLY a JSON object with this structure (no markdown code blocks):
      {
        "question": "The text of the question (in Chinese)",
        "type": "geometry", 
        "answer": "The numeric or short text answer",
        "explanation": "A short, fun explanation of the answer (in Chinese)"
      }
      Keep numbers simple enough for mental math or quick calculation.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return response.text || '{}';
  } catch (error) {
    console.error("Gemini Math Error:", error);
    return JSON.stringify({
      question: "出错啦，请稍后再试！",
      answer: "0",
      explanation: "网络有点小问题。"
    });
  }
};

export const createEnglishTutorChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'Mikey', a friendly robot English tutor for a 4th-grade Chinese student. 
      Your goal is to practice simple English conversation.
      1. Use simple vocabulary (CEFR A1/A2 level).
      2. If the user makes a mistake, gently correct them in a supportive way.
      3. Occasionally use an emoji.
      4. Keep responses short (under 30 words).
      5. If the user speaks Chinese, reply in English but add a Chinese translation in parentheses.`
    }
  });
};