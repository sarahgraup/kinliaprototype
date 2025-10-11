// src/components/collections/CollectionCard.tsx
"use client";

import React from "react";
import { CuratedCollection, Collection } from "@/types";
import { Heart, Eye, Share2, MessageCircle, Lock, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CollectionCardProps {
  collection: CuratedCollection | Collection;
  variant: "compact" | "rectangular" | "curated";
  onClick: () => void;
  onLike?: (collectionId: string) => void;
  onShare?: (collectionId: string) => void;
  currentUserId?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  variant,
  onClick,
  onLike,
  onShare,
  currentUserId,
}) => {
  // Type guard to check if it's a user collection
  const isUserCollection = (
    coll: CuratedCollection | Collection
  ): coll is Collection => {
    return "ownerId" in coll;
  };

  // Generate cover image from event grid or use provided cover
  const getCoverImage = () => {
    if ("image" in collection) {
      return collection.image;
    }
    return collection.coverImage || "/api/placeholder/400/300";
  };

  const userCollection = isUserCollection(collection) ? collection : null;
  const curatedCollection = !isUserCollection(collection) ? collection : null;

  // Format stats numbers
  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count;
  };

  // Curated variant (existing style for admin collections)
  if (variant === "curated" && curatedCollection) {
    return (
      <div
        onClick={onClick}
        className="min-w-[300px] h-48 rounded-xl overflow-hidden relative cursor-pointer group flex-shrink-0 snap-start"
      >
        <img
          src={curatedCollection.image}
          alt={curatedCollection.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
            {curatedCollection.tag}
          </span>
          <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            Curated
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {curatedCollection.title}
          </h3>
          {curatedCollection.description && (
            <p className="text-white/80 text-sm mt-1 line-clamp-1">
              {curatedCollection.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Compact variant for user collections
  if (variant === "compact" && userCollection) {
    const isLiked =
      currentUserId && userCollection.followerIds.includes(currentUserId);

    return (
      <div
        onClick={onClick}
        className="min-w-[280px] bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-gray-300 group flex-shrink-0 snap-start"
      >
        {/* Cover image (2x2 grid placeholder or actual cover) */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={getCoverImage()}
            alt={userCollection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!userCollection.isPublic && (
            <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm rounded-full p-1.5">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Collection name */}
          <h3 className="font-bold text-base mb-2 line-clamp-2">
            {userCollection.name}
          </h3>

          {/* Owner info */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={userCollection.ownerAvatar || "/api/placeholder/32/32"}
              alt={userCollection.ownerName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600 truncate">
              {userCollection.ownerName}
            </span>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{userCollection.eventIds.length} events</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {formatCount(userCollection.likeCount)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(userCollection.id);
                }}
                className={cn(
                  "transition-colors",
                  isLiked ? "text-red-500" : "hover:text-red-500"
                )}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rectangular variant for full page listings
  if (variant === "rectangular" && userCollection) {
    const isLiked =
      currentUserId && userCollection.followerIds.includes(currentUserId);

    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-gray-300 group"
      >
        {/* Cover image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={getCoverImage()}
            alt={userCollection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex gap-2">
              {!userCollection.isPublic && (
                <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Private
                </span>
              )}
              {userCollection.isCollaborative && (
                <span className="px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Collaborative
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Collection name and description */}
          <h3 className="font-bold text-lg mb-2 line-clamp-2">
            {userCollection.name}
          </h3>
          {userCollection.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {userCollection.description}
            </p>
          )}

          {/* Owner profile */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
            <img
              src={userCollection.ownerAvatar || "/api/placeholder/32/32"}
              alt={userCollection.ownerName}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {userCollection.ownerName}
              </p>
              <p className="text-xs text-gray-500">Collection owner</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span>{userCollection.eventIds.length} events</span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {formatCount(userCollection.likeCount)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatCount(userCollection.viewCount)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(userCollection.id);
              }}
              className={cn(
                "flex-1 px-4 py-2 border rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                isLiked
                  ? "border-red-500 text-red-500 bg-red-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              {isLiked ? "Liked" : "Like"}
            </button>
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(userCollection.id);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClick}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              View Board
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
