// src/lib/api/chat.ts
import { Chat, ChatInput, Message, ApiResponse } from "@/types";
import { mockChats } from "@/data/mockChats";

const MOCK_DELAY = 1200; // Longer delay for AI responses

let chats: Chat[] = [...mockChats];

class ChatApi {
  async getAll(): Promise<ApiResponse<Chat[]>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      data: chats,
      status: 200,
    };
  }

  async getById(id: string): Promise<ApiResponse<Chat>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const chat = chats.find((c) => c.id === id);

    if (!chat) {
      throw {
        message: "Chat not found",
        status: 404,
      };
    }

    return {
      data: chat,
      status: 200,
    };
  }

  async sendMessage(input: ChatInput): Promise<ApiResponse<Message>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.content,
      timestamp: new Date(),
    };

    // Generate mock AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: this.generateMockResponse(input.content),
      timestamp: new Date(),
    };

    if (input.chatId) {
      // Add to existing chat
      const chat = chats.find((c) => c.id === input.chatId);
      if (chat) {
        chat.messages.push(userMessage, aiMessage);
        chat.updatedAt = new Date();
      }
    } else {
      // Create new chat
      const newChat: Chat = {
        id: Date.now().toString(),
        title: input.content.slice(0, 50),
        date: new Date().toISOString().split("T")[0],
        messages: [userMessage, aiMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      chats.unshift(newChat);
    }

    return {
      data: aiMessage,
      status: 200,
    };
  }

  private generateMockResponse(query: string): string {
    const responses = [
      `I found some great events related to "${query}". Here are the top matches!`,
      `These events look perfect for what you're looking for. Would you like me to refine the search?`,
      `I've curated a selection of events that match your interests. Let me know if you'd like different options.`,
      `Based on your search for "${query}", here are some highly-rated events you might enjoy.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async createChat(title: string): Promise<ApiResponse<Chat>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const newChat: Chat = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString().split("T")[0],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chats.unshift(newChat);

    return {
      data: newChat,
      status: 201,
    };
  }

  async deleteChat(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const index = chats.findIndex((c) => c.id === id);

    if (index === -1) {
      throw {
        message: "Chat not found",
        status: 404,
      };
    }

    chats.splice(index, 1);

    return {
      data: undefined as void,
      status: 200,
    };
  }
}

export const chatApi = new ChatApi();
