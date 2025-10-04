// src/components/search/SearchSuggestions.tsx
"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { searchSuggestions } from "@/data/mockCollections";

interface SearchSuggestionsProps {
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSelect,
  isVisible,
}) => {
  if (!isVisible) return null;

  const handleSuggestionClick = (
    suggestion: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent event bubbling
    onSelect(suggestion);
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl p-4 z-50 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <span className="font-semibold">Event ideas</span>
      </div>
      <div className="space-y-2">
        {searchSuggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={(e) => handleSuggestionClick(suggestion, e)}
            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
