// src/components/events/EventCard.tsx
import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Bookmark,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Event, Collection } from "@/types";
import { formatPrice, formatAttendees } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

interface EventCardProps {
  event: Event;
  isSaved?: boolean;
  savedCollections?: Collection[];
  onSave: (event: Event, buttonElement: HTMLElement) => void;
  onQuickSave?: (event: Event) => void;
  onSayMore: () => void;
  onClick: () => void;
  onCollectionClick?: (collectionId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSaved = false,
  savedCollections = [],
  onSave,
  onQuickSave,
  onSayMore,
  onClick,
  onCollectionClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine dropdown button text based on saved state
  const getDropdownText = () => {
    if (!isSaved) return "All Saves";
    if (savedCollections.length === 1) return savedCollections[0].name;
    if (savedCollections.length > 1)
      return `${savedCollections.length} Collections`;
    return "All Saves";
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-300 overflow-hidden cursor-pointer transition-all hover:border-gray-400 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Save Button - Always visible, expands on hover */}
        <div className="absolute top-3 right-3 left-3">
          {!isHovered ? (
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Save options"
              >
                <Bookmark
                  className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 animate-fade-in">
              {/* Left: Dropdown button - shows saved collections or allows saving */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    isSaved &&
                    savedCollections.length === 1 &&
                    onCollectionClick
                  ) {
                    // If saved to one collection, navigate to it
                    onCollectionClick(savedCollections[0].id);
                  } else {
                    // Otherwise show save dropdown
                    onSave(event, e.currentTarget);
                  }
                }}
                className="px-3 py-2 rounded-lg transition-colors flex items-center gap-1 hover:bg-gray-500/20"
                aria-label={
                  isSaved ? "View saved collections" : "Save to collection"
                }
              >
                <span className="text-sm font-medium text-white drop-shadow-lg">
                  {getDropdownText()}
                </span>
                <ChevronDown className="w-4 h-4 text-white drop-shadow-lg" />
              </button>

              {/* Right: Quick save button - purple if not saved, grey if saved */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSaved) {
                    onQuickSave?.(event);
                  }
                }}
                className={`px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 ${
                  isSaved
                    ? "bg-gray-600 text-white cursor-default"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                aria-label={isSaved ? "Already saved" : "Quick save"}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                />
                <span className="text-sm font-medium">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Say More Button - Shows on hover */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSayMore();
            }}
            className="absolute bottom-3 left-3 bg-white rounded-lg px-3 py-2 shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 animate-fade-in"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium">Say More</span>
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.name}</h3>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{formatAttendees(event.attendees)} attending</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-indigo-600">
            {formatPrice(event.price)}
          </span>
          {event.friendsAttending && event.friendsAttending.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {event.friendsAttending.slice(0, 3).map((friend) => (
                  <img
                    key={friend.id}
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-6 h-6 rounded-full border-2 border-white"
                    title={friend.name}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                {event.friendsAttending.length} friend
                {event.friendsAttending.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {event.category.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
