import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { MessagePart } from './types';

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
        systemInstruction: 'You are a super-intelligent AI with a persistent memory. You are an expert programmer and creative assistant. When asked to code, provide well-commented and efficient code snippets using markdown for formatting. Be helpful, creative, and provide detailed, accurate responses. Maintain context from previous parts of the conversation to have a coherent, long-running dialogue.',
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

export const generateImage = async (prompt: string): Promise<MessagePart[]> => {
    const aiInstance = getAIInstance();
    try {
        const response = await aiInstance.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
        });

        if (response.candidates && response.candidates.length > 0) {
            const parts = response.candidates[0].content.parts;
            const messageParts: MessagePart[] = parts.map((part: Part) => {
                if (part.text) {
                    return { text: part.text };
                }
                if (part.inlineData) {
                    return {
                        inlineData: {
                            mimeType: part.inlineData.mimeType,
                            data: part.inlineData.data,
                        }
                    };
                }
                return null;
            }).filter((p): p is MessagePart => p !== null);

            if (messageParts.length === 0) {
               throw new Error("The model did not return any content.");
            }

            return messageParts;
        } else {
            throw new Error("No response from the image generation model.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the image.");
    }
};