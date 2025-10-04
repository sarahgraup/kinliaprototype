// src/components/collections/SaveDropdown.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Collection } from "@/types";

interface SaveDropdownProps {
  isOpen: boolean;
  collections: Collection[];
  onClose: () => void;
  onSelectCollection: (collectionId: string) => void;
  onCreateNew: () => void;
  position?: { top: number; left: number };
}

export const SaveDropdown: React.FC<SaveDropdownProps> = ({
  isOpen,
  collections,
  onClose,
  onSelectCollection,
  onCreateNew,
  position,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Trigger re-render after mount to get accurate dimensions
      setIsMounted(true);
    } else {
      setIsMounted(false);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Calculate safe position to prevent dropdown from going off-screen
  const getAdjustedPosition = () => {
    if (!position || !dropdownRef.current) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }

    const dropdownWidth = dropdownRef.current.offsetWidth || 200; // fallback to min-width
    const viewportWidth = window.innerWidth;
    const safetyMargin = 16; // px from edge

    let { top, left } = position;
    let transform = "translateX(-100%)"; // Default: align to right edge of button

    // Calculate where dropdown left edge would be
    const dropdownLeftEdge = left - dropdownWidth;

    // If it goes off the left edge, adjust
    if (dropdownLeftEdge < safetyMargin) {
      // Position from left edge instead, no transform
      left = safetyMargin;
      transform = "none";
    }

    // Check if it goes off the right edge (less common but possible)
    if (left + dropdownWidth > viewportWidth - safetyMargin) {
      left = viewportWidth - dropdownWidth - safetyMargin;
      transform = "none";
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      transform,
    };
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[200px] z-50 animate-fade-in"
      style={getAdjustedPosition()}
    >
      <div className="px-3 py-2 text-sm font-semibold text-gray-500 border-b border-gray-200 mb-2">
        Add to a collection...
      </div>
      <div className="max-h-60 overflow-y-auto">
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => {
              onSelectCollection(collection.id);
              onClose();
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="font-medium">{collection.name}</div>
            {collection.eventIds.length > 0 && (
              <div className="text-xs text-gray-500">
                {collection.eventIds.length} event
                {collection.eventIds.length !== 1 ? "s" : ""}
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          onCreateNew();
          onClose();
        }}
        className="w-full text-left px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 mt-2 border-t border-gray-200 pt-2"
      >
        <Plus className="w-4 h-4" />
        Create collection
      </button>
    </div>
  );
};
