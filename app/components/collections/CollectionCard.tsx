// src/components/collections/CollectionCard.tsx
"use client";

import React from "react";
import { CuratedCollection } from "@/types";

interface CollectionCardProps {
  collection: CuratedCollection;
  onClick: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="min-w-[300px] h-48 rounded-xl overflow-hidden relative cursor-pointer group"
    >
      <img
        src={collection.image}
        alt={collection.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
          {collection.tag}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="text-white font-bold text-lg line-clamp-2">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-white/80 text-sm mt-1 line-clamp-1">
            {collection.description}
          </p>
        )}
      </div>
    </div>
  );
};
