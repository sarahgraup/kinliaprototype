// src/components/chat/ChatInput.tsx
"use client";

import React, { useState } from "react";
import { Upload, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Chat to refine...",
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
      <div className="relative bg-gray-50 rounded-xl p-2">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-transparent outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={disabled}
        />
        <div className="flex items-center justify-between mt-2">
          <button
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={disabled}
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
