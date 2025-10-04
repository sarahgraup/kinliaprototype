// src/components/events/EventGrid.tsx
import React from "react";
import { Event, Collection } from "@/types";
import { EventCard } from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

interface EventGridProps {
  events: Event[];
  loading?: boolean;
  savedEventIds?: string[];
  getEventCollections?: (eventId: string) => Collection[];
  onEventClick: (event: Event) => void;
  onSaveEvent: (event: Event, buttonElement: HTMLElement) => void;
  onQuickSave?: (event: Event) => void;
  onSayMore: (event: Event) => void;
  onCollectionClick?: (collectionId: string) => void;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  loading = false,
  savedEventIds = [],
  getEventCollections,
  onEventClick,
  onSaveEvent,
  onQuickSave,
  onSayMore,
  onCollectionClick,
}) => {
  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="break-inside-avoid mb-4">
            <EventCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No events found</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-2">
      {events.map((event) => (
        <div key={event.id} className="break-inside-avoid mb-2">
          <EventCard
            event={event}
            isSaved={savedEventIds.includes(event.id)}
            savedCollections={getEventCollections?.(event.id) || []}
            onClick={() => onEventClick(event)}
            onSave={onSaveEvent}
            onQuickSave={onQuickSave}
            onSayMore={() => onSayMore(event)}
            onCollectionClick={onCollectionClick}
          />
        </div>
      ))}
    </div>
  );
};
