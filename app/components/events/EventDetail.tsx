// src/components/events/EventDetail.tsx
import React from "react";
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Event } from "@/types";
import { formatPrice, formatAttendees } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";

interface EventDetailProps {
  event: Event;
  onSave: () => void;
  onShare: () => void;
  onSayMore: () => void;
  onGetTickets: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  onSave,
  onShare,
  onSayMore,
  onGetTickets,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <img
        src={event.image}
        alt={event.name}
        className="w-full h-96 object-cover"
      />

      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold flex-1">{event.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Save event"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={onShare}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Share event"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-lg">
            <Calendar className="w-6 h-6 text-gray-400" />
            <span>
              {event.date} at {event.time}
            </span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <MapPin className="w-6 h-6 text-gray-400" />
            <span>
              {event.venue}, {event.location}
            </span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <Users className="w-6 h-6 text-gray-400" />
            <span>{formatAttendees(event.attendees)} people attending</span>
          </div>
        </div>

        <div className="mb-6">
          <span className="text-3xl font-bold text-indigo-600">
            {formatPrice(event.price)}
          </span>
        </div>

        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          {event.description}
        </p>

        <div className="flex gap-4 mb-6">
          <Button onClick={onGetTickets} size="lg" className="flex-1">
            Get Tickets
          </Button>
          <Button
            onClick={onSayMore}
            variant="outline"
            size="lg"
            className="px-6 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Say More
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {event.category.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium"
            >
              {cat}
            </span>
          ))}
        </div>

        {event.friendsAttending && event.friendsAttending.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-3">Friends Attending</h3>
            <div className="flex flex-wrap gap-3">
              {event.friendsAttending.map((friend) => (
                <div key={friend.id} className="flex items-center gap-2">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-sm font-medium">{friend.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
