
// src/components/search/SearchResults.tsx
'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/EventGrid';

interface SearchResultsProps {
  events: Event[];
  loading: boolean;
  onEventClick: (event: Event) => void;
  onSaveEvent: (event: Event) => void;
  onSayMore: (event: Event) => void;
  onRating?: (positive: boolean) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  events,
  loading,
  onEventClick,
  onSaveEvent,
  onSayMore,
  onRating,
}) => {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {loading ? 'Searching...' : `${events.length} Results`}
        </h2>
        {onRating && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rate these results</span>
            <button
              onClick={() => onRating(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Like results"
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => onRating(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Dislike results"
            >
              <ThumbsDown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <EventGrid
        events={events}
        loading={loading}
        onEventClick={onEventClick}
        onSaveEvent={onSaveEvent}
        onSayMore={onSayMore}
      />
    </div>
  );
};
