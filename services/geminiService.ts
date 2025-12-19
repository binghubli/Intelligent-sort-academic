import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get a configured model
const getModel = (modelName: string = 'gemini-3-flash-preview') => {
  return ai.models;
};

// Generate a batch of 4 math questions based on a textbook chapter
export const generateMathBatch = async (chapter: string): Promise<string> => {
  if (!apiKey) return "[]";

  try {
    const prompt = `
      You are a 4th-grade math teacher in China. 
      Generate 4 distinct math word problems or calculation problems specifically for the chapter: "${chapter}".
      
      Strictly follow the JSON schema.
      The output must be a valid JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The math problem text in Chinese" },
              type: { type: Type.STRING, description: "calculation or word_problem" },
              answer: { type: Type.STRING, description: "The numeric or simple text answer" },
              explanation: { type: Type.STRING, description: "Simple explanation in Chinese" }
            }
          }
        }
      }
    });

    return response.text || '[]';
  } catch (error) {
    console.error("Gemini Math Batch Error:", error);
    // Return fallback data if API fails
    return JSON.stringify([
      { question: "API连接失败，请检查网络。10 + 10 = ?", answer: "20", explanation: "请重试", type: "calculation" }
    ]);
  }
};

// Generate English fill-in-the-blank quizzes
export const generateEnglishQuiz = async (): Promise<string> => {
  if (!apiKey) return "[]";

  try {
    const prompt = `
      Create 3 simple English sentences for a 4th grade Chinese student.
      For each sentence, select one key word to be the "missing word".
      Provide the full English sentence, the Chinese translation, the missing word, and 3 incorrect options for that word.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING, description: "Full English sentence" },
              chinese: { type: Type.STRING, description: "Chinese translation" },
              missingWord: { type: Type.STRING, description: "The word to hide" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array containing the correct word and 2 distractors"
              }
            }
          }
        }
      }
    });

    return response.text || '[]';
  } catch (error) {
    console.error("Gemini English Quiz Error:", error);
    return '[]';
  }
};

export const createEnglishTutorChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are Mikey, a friendly and patient English tutor for a 4th-grade Chinese student. Use simple English, encouraging emojis, and short sentences. If the student speaks Chinese, respond in English but ensure it is easy to understand. Correct mistakes gently.',
    },
  });
};