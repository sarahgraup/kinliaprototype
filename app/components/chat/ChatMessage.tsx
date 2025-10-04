// src/components/chat/ChatMessage.tsx
"use client";

import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Message } from "@/types";
import { formatRelativeTime } from "@/lib/utils/formatters";

interface ChatMessageProps {
  message: Message;
  onFeedback?: (messageId: string, positive: boolean) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onFeedback,
}) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold">
          K
        </div>
      )}
      <div className="flex-1 max-w-[80%]">
        <div
          className={`${
            isUser ? "bg-indigo-600 text-white ml-auto" : "bg-gray-100"
          } rounded-lg p-4`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-gray-500">
            {formatRelativeTime(message.timestamp)}
          </span>
          {!isUser && onFeedback && (
            <div className="flex gap-1">
              <button
                onClick={() => onFeedback(message.id, true)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                aria-label="Helpful"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onFeedback(message.id, false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                aria-label="Not helpful"
              >
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold">
          S
        </div>
      )}
    </div>
  );
};
