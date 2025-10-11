// src/components/crews/CrewCard.tsx
"use client";

import React from "react";
import { Crew } from "@/types";
import { Users, Calendar, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CrewCardProps {
  crew: Crew;
  variant: "compact" | "rectangular";
  onClick: () => void;
  onJoinCrew?: (crewId: string) => void;
}

export const CrewCard: React.FC<CrewCardProps> = ({
  crew,
  variant,
  onClick,
  onJoinCrew,
}) => {
  // Calculate status and badge color
  const getStatusInfo = () => {
    if (crew.status === "full" || crew.status === "event-passed") {
      return { label: "Full", color: "bg-gray-500" };
    }
    if (crew.currentSize >= crew.maxSize - 1) {
      return { label: "Almost Full", color: "bg-yellow-500" };
    }
    if (crew.currentSize <= 2) {
      return { label: "Just Started", color: "bg-green-500" };
    }
    return { label: "Looking for More", color: "bg-blue-500" };
  };

  const statusInfo = getStatusInfo();
  const spotsRemaining = crew.maxSize - crew.currentSize;
  const canJoin = crew.status === "open" || crew.status === "almost-full";

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get preference badges
  const getPreferenceBadges = () => {
    const badges = [];
    if (crew.agePreference === "similar") {
      badges.push("Similar age");
    }
    if (crew.genderPreference === "same") {
      badges.push("Same gender");
    }
    return badges;
  };

  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className="min-w-[280px] h-[320px] rounded-xl overflow-hidden relative cursor-pointer group flex-shrink-0 snap-start"
      >
        {/* Background image with gradient overlay */}
        <img
          src={crew.eventImage}
          alt={crew.eventName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold text-white",
              statusInfo.color
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Unread messages indicator */}
        {crew.hasUnreadMessages && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 rounded-full p-1.5">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Creator and members */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={crew.createdBy.avatarUrl}
              alt={crew.createdBy.userName}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            {crew.members.length > 0 && (
              <>
                <div className="flex -space-x-2">
                  {crew.members.slice(0, 3).map((member) => (
                    <img
                      key={member.userId}
                      src={member.avatarUrl}
                      alt={member.userName}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                {crew.members.length > 3 && (
                  <span className="text-white text-xs font-medium">
                    +{crew.members.length - 3} more
                  </span>
                )}
              </>
            )}
          </div>

          {/* Event name */}
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
            {crew.eventName}
          </h3>

          {/* Event date and size */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/90 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(crew.eventDate)}
            </span>
            <span className="text-white/90 text-sm flex items-center gap-1">
              <Users className="w-4 h-4" />
              {crew.targetSize} people
            </span>
          </div>

          {/* Join button */}
          {canJoin && onJoinCrew && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoinCrew(crew.id);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Join Crew
            </button>
          )}
        </div>
      </div>
    );
  }

  // Rectangular variant for full pages
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-gray-300 group"
    >
      {/* Event image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={crew.eventImage}
          alt={crew.eventName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold text-white",
              statusInfo.color
            )}
          >
            {statusInfo.label}
          </span>
          {crew.hasUnreadMessages && (
            <div className="bg-red-500 rounded-full p-1.5">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Creator profile */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <img
            src={crew.createdBy.avatarUrl}
            alt={crew.createdBy.userName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {crew.createdBy.userName}
              {crew.createdBy.age && (
                <span className="text-gray-500 font-normal ml-1">
                  , {crew.createdBy.age}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500">Crew Creator</p>
          </div>
        </div>

        {/* Members */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex -space-x-2">
              <img
                src={crew.createdBy.avatarUrl}
                alt={crew.createdBy.userName}
                className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-200"
              />
              {crew.members.slice(0, 4).map((member) => (
                <img
                  key={member.userId}
                  src={member.avatarUrl}
                  alt={member.userName}
                  className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-200"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {crew.currentSize}/{crew.maxSize} members
              {spotsRemaining > 0 && (
                <span className="text-green-600 ml-1">
                  • {spotsRemaining} spot{spotsRemaining > 1 ? "s" : ""} left
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Event details */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          {crew.eventName}
        </h3>

        <div className="space-y-1.5 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(crew.eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{crew.eventLocation}</span>
          </div>
        </div>

        {/* Creator's description */}
        {crew.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            "{crew.description}"
          </p>
        )}

        {/* Preference tags */}
        {getPreferenceBadges().length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {getPreferenceBadges().map((badge) => (
              <span
                key={badge}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
              >
                {badge}
              </span>
            ))}
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
              <Users className="w-3 h-3" />
              {crew.targetSize}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClick}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          {canJoin && onJoinCrew && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoinCrew(crew.id);
              }}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Join Crew
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
