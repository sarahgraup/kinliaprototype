import { useState, useEffect } from "react";
import { Chat, Message, ChatInput } from "@/types";
import { chatApi } from "@/lib/api/chat";

export function useChat(chatId?: string) {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (chatId) {
      loadChat();
    }
  }, [chatId]);

  const loadChat = async () => {
    if (!chatId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getById(chatId);
      setChat(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    try {
      setSending(true);
      setError(null);
      const input: ChatInput = { content, chatId };
      const response = await chatApi.sendMessage(input);

      if (chat) {
        setChat({
          ...chat,
          messages: [...chat.messages, response.data],
        });
      }

      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      throw err;
    } finally {
      setSending(false);
    }
  };

  return {
    chat,
    loading,
    error,
    sending,
    sendMessage,
    refetch: loadChat,
  };
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getAll();
      setChats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string) => {
    try {
      const response = await chatApi.createChat(title);
      setChats([response.data, ...chats]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
      throw err;
    }
  };

  const deleteChat = async (id: string) => {
    try {
      await chatApi.deleteChat(id);
      setChats(chats.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chat");
      throw err;
    }
  };

  return {
    chats,
    loading,
    error,
    createChat,
    deleteChat,
    refetch: loadChats,
  };
}


