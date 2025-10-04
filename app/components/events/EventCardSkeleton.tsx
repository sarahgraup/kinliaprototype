// src/components/events/EventCardSkeleton.tsx
import React from "react";

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-300 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300" />
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2" />
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-3" />
        <div className="flex gap-1">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
};
