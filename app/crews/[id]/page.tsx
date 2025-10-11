// src/app/crews/[id]/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { HorizontalScrollGrid } from "@/components/layout/HorizontalScrollGrid";
import { CrewCard } from "@/components/crews/CrewCard";
import { Toast } from "@/components/ui/Toast";
import { useCrews } from "@/lib/hooks/useCrews";
import {
  Calendar,
  MapPin,
  Users,
  MessageCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function CrewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const crewId = params.id as string;

  const { crews, getCrewById, getCrewsByEvent, joinCrew } = useCrews();
  const crew = getCrewById(crewId);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Get related crews (same event, different crews)
  const relatedCrews = useMemo(() => {
    if (!crew) return [];
    return getCrewsByEvent(crew.eventId)
      .filter((c) => c.id !== crew.id)
      .slice(0, 4);
  }, [crew, getCrewsByEvent]);

  if (!crew) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Crew not found
          </h2>
          <p className="text-gray-600 mb-4">
            This crew may have been deleted or doesn't exist
          </p>
          <button
            onClick={() => router.push("/crews")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Crews
          </button>
        </div>
      </div>
    );
  }

  const spotsRemaining = crew.maxSize - crew.currentSize;
  const canJoin = crew.status === "open" || crew.status === "almost-full";

  const getStatusBadge = () => {
    const statusConfig = {
      open: { label: "Open", color: "bg-green-500" },
      "almost-full": { label: "Almost Full", color: "bg-yellow-500" },
      full: { label: "Full", color: "bg-gray-500" },
      "event-passed": { label: "Event Passed", color: "bg-gray-500" },
    };
    return statusConfig[crew.status];
  };

  const statusBadge = getStatusBadge();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleJoinCrew = async () => {
    const mockUser = {
      userId: "currentUser",
      userName: "You",
      avatarUrl: "https://i.pravatar.cc/150?img=60",
      joinedAt: new Date(),
    };

    try {
      await joinCrew(crew.id, mockUser);
      setToast({
        message: "Successfully joined crew! Check your messages.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Failed to join crew",
        type: "error",
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="pt-16">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Event Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={crew.eventImage}
            alt={crew.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0">
            <div className="max-w-5xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold text-white",
                    statusBadge.color
                  )}
                >
                  {statusBadge.label}
                </span>
                {crew.hasUnreadMessages && (
                  <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-semibold text-white flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    New messages
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {crew.eventName}
              </h1>
              <p className="text-white/90 text-lg">
                {formatDate(crew.eventDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Crew Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Creator Profile */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Crew Creator
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={crew.createdBy.avatarUrl}
                    alt={crew.createdBy.userName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {crew.createdBy.userName}
                      {crew.createdBy.age && (
                        <span className="text-gray-500 font-normal ml-1">
                          , {crew.createdBy.age}
                        </span>
                      )}
                    </p>
                    {crew.createdBy.bio && (
                      <p className="text-sm text-gray-600 mt-1">
                        {crew.createdBy.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {crew.description && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    About This Crew
                  </h2>
                  <p className="text-gray-700">{crew.description}</p>
                </div>
              )}

              {/* Members */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Crew Members ({crew.currentSize}/{crew.maxSize})
                </h2>

                <div className="space-y-4">
                  {/* Creator */}
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <img
                      src={crew.createdBy.avatarUrl}
                      alt={crew.createdBy.userName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {crew.createdBy.userName}
                        {crew.createdBy.age && (
                          <span className="text-gray-500 font-normal ml-1">
                            , {crew.createdBy.age}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-indigo-600 font-medium">
                        Crew Creator
                      </p>
                    </div>
                  </div>

                  {/* Other Members */}
                  {crew.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg"
                    >
                      <img
                        src={member.avatarUrl}
                        alt={member.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {member.userName}
                          {member.age && (
                            <span className="text-gray-500 font-normal ml-1">
                              , {member.age}
                            </span>
                          )}
                        </p>
                        {member.bio && (
                          <p className="text-sm text-gray-600">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty Spots */}
                  {spotsRemaining > 0 &&
                    Array.from({ length: spotsRemaining }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="flex items-center gap-3 p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 italic">Open spot</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* AI Chat Preview */}
              {canJoin ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-bold text-gray-900">
                      Join to Chat
                    </h2>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Join this crew to access the group chat and get to know
                    everyone before the event! Our AI facilitator helps break
                    the ice.
                  </p>
                  <button
                    onClick={handleJoinCrew}
                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Join This Crew
                  </button>
                </div>
              ) : null}
            </div>

            {/* Right Column - Event Details & Preferences */}
            <div className="space-y-6">
              {/* Event Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Event Details
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(crew.eventDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {crew.eventLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Group Size</p>
                      <p className="font-medium text-gray-900">
                        {crew.targetSize} people
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/events/${crew.eventId}`)}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Event Details
                </button>
              </div>

              {/* Preferences */}
              {getPreferenceBadges().length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Preferences
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {getPreferenceBadges().map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {crew.targetSize}
                    </span>
                  </div>
                </div>
              )}

              {/* Join Button (sticky on mobile) */}
              {canJoin && (
                <div className="sticky top-20">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {spotsRemaining} spot{spotsRemaining !== 1 ? "s" : ""}{" "}
                        left
                      </p>
                      <p className="text-sm text-gray-600">
                        {crew.currentSize}/{crew.maxSize} members
                      </p>
                    </div>
                    <button
                      onClick={handleJoinCrew}
                      className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Join Crew
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Crews */}
          {relatedCrews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Other Crews for This Event
              </h2>
              <HorizontalScrollGrid>
                {relatedCrews.map((relatedCrew) => (
                  <CrewCard
                    key={relatedCrew.id}
                    crew={relatedCrew}
                    variant="compact"
                    onClick={() => router.push(`/crews/${relatedCrew.id}`)}
                    onJoinCrew={handleJoinCrew}
                  />
                ))}
              </HorizontalScrollGrid>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav
        activeView="home"
        onNavigate={(view) => {
          if (view === "collections") router.push("/collections");
          else if (view === "home") router.push("/");
        }}
      />
    </div>
  );
}
