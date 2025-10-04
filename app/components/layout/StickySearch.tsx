// src/components/layout/StickySearch.tsx
"use client";

import React from "react";
import { SearchBar } from "@/components/search/SearchBar";

interface StickySearchProps {
  onSearch: (query: string) => void;
  isVisible: boolean;
}

export const StickySearch: React.FC<StickySearchProps> = ({
  onSearch,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 py-3 animate-slide-down">
      <div className="max-w-2xl mx-auto px-4 transition-all duration-300 ease-in-out">
        <SearchBar
          onSearch={onSearch}
          variant="compact"
          showSuggestions={true}
          placeholder="Describe what you're looking for..."
        />
      </div>
    </div>
  );
};
