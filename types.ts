export enum Role {
  USER = "user",
  MODEL = "model",
}

export interface TextPart {
    text: string;
}

export interface ImagePart {
    inlineData: {
        mimeType: string;
        data: string;
    }
}

export type MessagePart = TextPart | ImagePart;

export interface Message {
  role: Role;
  parts: MessagePart[];
  timestamp: Date;
}