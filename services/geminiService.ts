
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

// The history object expects a specific structure that we must adhere to.
interface ChatHistory {
    role: string;
    parts: { text: string }[];
}

export const initializeChat = (history?: ChatHistory[]): Chat => {
  const aiInstance = getAIInstance();
  return aiInstance.chats.create({
    model: 'gemini-3-pro-preview',
    history: history,
    config: {
        systemInstruction: 'You are a super-intelligent AI with a persistent memory. Be helpful, creative, and provide detailed, accurate responses. Maintain context from previous parts of the conversation to have a coherent, long-running dialogue.',
    },
  });
};

export const sendMessageToAI = async (chat: Chat, message: string): Promise<AsyncIterable<string>> => {
    const result = await chat.sendMessageStream({ message });
    
    const stream = (async function* () {
        for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                yield c.text;
            }
        }
    })();
    
    return stream;
};
