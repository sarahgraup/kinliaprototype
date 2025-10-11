// src/components/collections/CuratedCollection.tsx
"use client";

import React from "react";
import { mockCuratedCollections } from "@/data/mockCollections";
import { CollectionCard } from "./CollectionCard";

interface CuratedCollectionProps {
  onCollectionClick: (collectionId: string) => void;
}

export const CuratedCollection: React.FC<CuratedCollectionProps> = ({
  onCollectionClick,
}) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Curated Collections</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {mockCuratedCollections.map((collection) => (
          <CollectionCard
            variant="curated"
            key={collection.id}
            collection={collection}
            onClick={() => onCollectionClick(collection.id)}
          />
        ))}
      </div>
    </div>
  );
};
