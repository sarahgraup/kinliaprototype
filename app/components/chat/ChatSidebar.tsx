// src/components/chat/ChatSidebar.tsx
"use client";

import React from "react";
import { X, Plus } from "lucide-react";
import { Chat } from "@/types";
import { formatRelativeTime } from "@/lib/utils/formatters";

interface ChatSidebarProps {
  isOpen: boolean;
  chats: Chat[];
  currentChatId?: string;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  chats,
  currentChatId,
  onClose,
  onSelectChat,
  onNewChat,
}) => {




  const groupedChats = chats.reduce((acc, chat) => {
    const date = new Date(chat.date);
    const key = date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 animate-fade-in"
          onClick={() => {

            onClose();
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 border-r border-gray-200 bg-white flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          willChange: isOpen ? "transform" : "auto",
        }}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Chats</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={onNewChat}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedChats).map(([period, periodChats]) => (
            <div key={period} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                {period}
              </h3>
              <div className="space-y-1">
                {periodChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chat.id === currentChatId
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatRelativeTime(chat.updatedAt)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
