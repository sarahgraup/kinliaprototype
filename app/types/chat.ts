// src/types/chat.ts
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  date: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatInput {
  content: string;
  chatId?: string;
}
