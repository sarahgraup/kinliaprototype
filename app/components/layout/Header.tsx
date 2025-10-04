"use client";

import React from "react";
import { MessageSquare, Bookmark } from "lucide-react";

interface HeaderProps {
  onChatsClick: () => void;
  onBookmarksClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onChatsClick,
  onBookmarksClick,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={onChatsClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Chats</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">Kinlia.ai</span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded">
            BETA
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onBookmarksClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="View collections"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              S
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
