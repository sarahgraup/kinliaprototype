// src/app/boards/[id]/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { HorizontalScrollGrid } from "@/components/layout/HorizontalScrollGrid";
import { RectangularGrid } from "@/components/layout/RectangularGrid";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { EventCard } from "@/components/events/EventCard";
import { Toast } from "@/components/ui/Toast";
import { SaveDropdown } from "@/components/collections/SaveDropdown";
import { SayMoreModal } from "@/components/modals/SayMoreModal";
import { useEvents } from "@/lib/hooks/useEvents";
import { useCollections } from "@/lib/hooks/useCollections";
import { mockUserCollections } from "@/data/mockCollections";
import { Event } from "@/types";
import {
  Heart,
  Eye,
  Share2,
  Users,
  Lock,
  ArrowLeft,
  Grid3x3,
  LayoutGrid,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  const { events } = useEvents();
  const { collections, addEventToCollection } = useCollections();

  const board = mockUserCollections.find((c) => c.id === boardId);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");
  const [selectedEventForSave, setSelectedEventForSave] =
    useState<Event | null>(null);
  const [selectedEventForSayMore, setSelectedEventForSayMore] =
    useState<Event | null>(null);
  const [saveDropdownPosition, setSaveDropdownPosition] = useState<
    { top: number; left: number } | undefined
  >();

  // Get events in this collection
  const collectionEvents = useMemo(() => {
    if (!board) return [];
    return events.filter((event) => board.eventIds.includes(event.id));
  }, [board, events]);

  // Get similar collections
  const similarCollections = useMemo(() => {
    if (!board) return [];
    return mockUserCollections
      .filter(
        (c) =>
          c.id !== board.id &&
          c.isPublic &&
          c.eventIds.some((id) => board.eventIds.includes(id))
      )
      .slice(0, 4);
  }, [board]);

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Board not found
          </h2>
          <p className="text-gray-600 mb-4">
            This collection may be private or doesn't exist
          </p>
          <button
            onClick={() => router.push("/boards")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setToast({
      message: isLiked ? "Removed like" : "Collection liked!",
      type: "success",
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setToast({
      message: isFollowing
        ? "Unfollowed collection"
        : "Following this collection!",
      type: "success",
    });
  };

  const handleShare = () => {
    if (board.shareLink) {
      navigator.clipboard.writeText(board.shareLink);
      setToast({
        message: "Share link copied to clipboard!",
        type: "success",
      });
    }
  };

  const handleRequestCollaboration = () => {
    setToast({
      message: "Collaboration request sent!",
      type: "success",
    });
  };

  const handleSaveEvent = (event: Event, buttonElement: HTMLElement) => {
    setSelectedEventForSave(event);
    const rect = buttonElement.getBoundingClientRect();
    setSaveDropdownPosition({
      top: rect.bottom + 8,
      left: rect.right,
    });
  };

  const handleQuickSave = async (event: Event) => {
    if (collections.length > 0) {
      try {
        await addEventToCollection(collections[0].id, event.id);
        setToast({
          message: "Event saved to All Saves",
          type: "success",
        });
      } catch (error) {
        setToast({
          message: "Failed to save event",
          type: "error",
        });
      }
    }
  };

  const handleSelectCollection = async (collectionId: string) => {
    if (selectedEventForSave) {
      try {
        await addEventToCollection(collectionId, selectedEventForSave.id);
        setToast({
          message: "Event saved to collection",
          type: "success",
        });
      } catch (error) {
        setToast({
          message: "Failed to save event",
          type: "error",
        });
      }
      setSelectedEventForSave(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="pt-16">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>

        {/* Collection Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Cover Image */}
            {board.coverImage && (
              <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src={board.coverImage}
                  alt={board.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {!board.isPublic && (
                    <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Private
                    </span>
                  )}
                  {board.isCollaborative && (
                    <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Collaborative
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Title and Owner */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {board.name}
                </h1>
                {board.description && (
                  <p className="text-lg text-gray-600 mb-4">
                    {board.description}
                  </p>
                )}

                {/* Owner Info */}
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src={board.ownerAvatar || "https://i.pravatar.cc/150?img=1"}
                    alt={board.ownerName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {board.ownerName}
                    </p>
                    <p className="text-sm text-gray-500">Collection owner</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <LayoutGrid className="w-4 h-4" />
                    {board.eventIds.length} events
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {formatCount(board.likeCount)} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatCount(board.viewCount)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {board.commentCount} comments
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLike}
                  className={cn(
                    "px-6 py-2.5 border rounded-lg font-medium transition-colors flex items-center gap-2",
                    isLiked
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                  {isLiked ? "Liked" : "Like"}
                </button>

                <button
                  onClick={handleFollow}
                  className={cn(
                    "px-6 py-2.5 border rounded-lg font-medium transition-colors flex items-center gap-2",
                    isFollowing
                      ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Users className="w-4 h-4" />
                  {isFollowing ? "Following" : "Follow"}
                </button>

                <button
                  onClick={handleShare}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                {board.isCollaborative && (
                  <button
                    onClick={handleRequestCollaboration}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Request to Collaborate
                  </button>
                )}
              </div>
            </div>

            {/* Collaborators */}
            {board.isCollaborative && board.collaboratorIds.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Collaborators:
                  </span>
                  <div className="flex -space-x-2">
                    {board.collaboratorIds.slice(0, 5).map((_, index) => (
                      <img
                        key={index}
                        src={`https://i.pravatar.cc/150?img=${20 + index}`}
                        alt="Collaborator"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                    ))}
                    {board.collaboratorIds.length > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                        +{board.collaboratorIds.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Events in this Collection
            </h2>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("masonry")}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === "masonry"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title="Masonry view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          {collectionEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No events in this collection yet</p>
            </div>
          ) : viewMode === "grid" ? (
            <RectangularGrid columns={4}>
              {collectionEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="rectangular"
                  isSaved={false}
                  onSave={handleSaveEvent}
                  onQuickSave={handleQuickSave}
                  onSayMore={() => setSelectedEventForSayMore(event)}
                  onClick={() => router.push(`/events/${event.id}`)}
                />
              ))}
            </RectangularGrid>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {collectionEvents.map((event) => (
                <div key={event.id} className="break-inside-avoid mb-6">
                  <EventCard
                    event={event}
                    variant="compact"
                    isSaved={false}
                    onSave={handleSaveEvent}
                    onQuickSave={handleQuickSave}
                    onSayMore={() => setSelectedEventForSayMore(event)}
                    onClick={() => router.push(`/events/${event.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Comments ({board.commentCount})
            </h2>
            <div className="text-gray-500 text-center py-8">
              Comments feature coming soon
            </div>
          </div>
        </div>

        {/* Similar Collections */}
        {similarCollections.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Collections
            </h2>
            <HorizontalScrollGrid>
              {similarCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  variant="compact"
                  onClick={() => router.push(`/boards/${collection.id}`)}
                  onLike={() => {}}
                  currentUserId="currentUser"
                />
              ))}
            </HorizontalScrollGrid>
          </div>
        )}
      </div>

      {/* Modals and Dropdowns */}
      <SaveDropdown
        isOpen={!!selectedEventForSave}
        collections={collections}
        onClose={() => setSelectedEventForSave(null)}
        onSelectCollection={handleSelectCollection}
        onCreateNew={() => {}}
        position={saveDropdownPosition}
      />

      <SayMoreModal
        isOpen={!!selectedEventForSayMore}
        event={selectedEventForSayMore}
        onClose={() => setSelectedEventForSayMore(null)}
        onRefine={(query) =>
          router.push(`/search?q=${encodeURIComponent(query)}`)
        }
      />

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
        activeView="collections"
        onNavigate={(view) => {
          if (view === "collections") router.push("/collections");
          else if (view === "home") router.push("/");
        }}
      />
    </div>
  );
}
