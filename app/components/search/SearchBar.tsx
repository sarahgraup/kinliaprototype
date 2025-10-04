// src/components/search/SearchBar.tsx
"use client";

import React, { useState } from "react";
import { Search, Upload, Send } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { SearchSuggestions } from "./SearchSuggestions";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  variant?: "default" | "compact" | "expanded";
  showSuggestions?: boolean;
  className?: string;
  containerClassName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFocus,
  placeholder = "Describe what you're looking for...",
  variant = "default",
  showSuggestions = false,
  className = "",
  containerClassName = "",
}) => {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(variant === "expanded");
  const [showSuggestionsState, setShowSuggestionsState] = useState(false);

  const searchRef = useClickOutside<HTMLDivElement>(() => {
    // Handle click outside for both suggestions and expansion
    setShowSuggestionsState(false);
    if (variant === "compact") {
      setIsExpanded(false);
    }
  });

  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
    setQuery("");
    setShowSuggestionsState(false);
    if (variant === "compact") {
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    if (variant === "compact") {
      setIsExpanded(true);
    }
    if (showSuggestions) {
      setShowSuggestionsState(true);
    }
    onFocus?.();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const isCompact = variant === "compact";
  const isExpandedState = isCompact ? isExpanded : variant === "expanded";
  const shouldShowSuggestions = showSuggestions && showSuggestionsState;

  return (
    <div className={`relative ${containerClassName}`}>
      <div
        ref={searchRef}
        className={`relative transition-all duration-300 ease-in-out ${
          isCompact
            ? `bg-gray-50 rounded-xl p-2 ${
                isExpandedState ? "bg-white rounded-2xl shadow-lg" : ""
              }`
            : "bg-white rounded-2xl shadow-lg p-2"
        } ${className}`}
      >
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder={placeholder}
            className={`flex-1 px-2 py-2 bg-transparent outline-none transition-all duration-300 ${
              isExpandedState ? "text-lg py-4" : ""
            }`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSearch(query);
              }
            }}
          />
        </div>

        {/* Action Buttons - Show when expanded or default variant */}
        {(isExpandedState || variant === "default") && (
          <div className="flex items-center justify-between mt-2 animate-fade-in">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => handleSearch(query)}
              disabled={!query.trim()}
              className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Search Suggestions */}
        <SearchSuggestions
          isVisible={shouldShowSuggestions}
          onSelect={handleSuggestionSelect}
        />
      </div>
    </div>
  );
};
