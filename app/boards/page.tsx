// src/app/boards/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RectangularGrid } from "@/components/layout/RectangularGrid";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toast } from "@/components/ui/Toast";
import { mockUserCollections } from "@/data/mockCollections";
import { Filter, Search } from "lucide-react";

type SortOption = "recent" | "most-liked" | "most-viewed" | "collaborative";

export default function BoardsPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("most-liked");
  const [showCollaborativeOnly, setShowCollaborativeOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    let filtered = mockUserCollections.filter(
      (collection) => collection.isPublic
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (collection) =>
          collection.name.toLowerCase().includes(query) ||
          collection.description?.toLowerCase().includes(query) ||
          collection.ownerName.toLowerCase().includes(query)
      );
    }

    // Collaborative filter
    if (showCollaborativeOnly) {
      filtered = filtered.filter((collection) => collection.isCollaborative);
    }

    // Sort
    switch (sortBy) {
      case "most-liked":
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "most-viewed":
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "recent":
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      case "collaborative":
        filtered.sort((a, b) => {
          if (a.isCollaborative && !b.isCollaborative) return -1;
          if (!a.isCollaborative && b.isCollaborative) return 1;
          return b.likeCount - a.likeCount;
        });
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, showCollaborativeOnly]);

  const handleLike = (collectionId: string) => {
    setToast({
      message: "Collection liked!",
      type: "success",
    });
  };

  const handleShare = (collectionId: string) => {
    // Copy share link to clipboard
    const collection = mockUserCollections.find((c) => c.id === collectionId);
    if (collection?.shareLink) {
      navigator.clipboard.writeText(collection.shareLink);
      setToast({
        message: "Share link copied to clipboard!",
        type: "success",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Community Boards
            </h1>
            <p className="text-gray-600">
              Explore collections created by other users in the community
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections or owners..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="most-liked">Most Liked</option>
                <option value="most-viewed">Most Viewed</option>
                <option value="recent">Recently Updated</option>
                <option value="collaborative">Collaborative</option>
              </select>

              {/* Collaborative Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                {showCollaborativeOnly && (
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              {filteredCollections.length} collection
              {filteredCollections.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCollaborativeOnly}
                  onChange={(e) => setShowCollaborativeOnly(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-gray-900">
                  Show collaborative boards only
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Collections Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <RectangularGrid columns={3}>
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                variant="rectangular"
                onClick={() => router.push(`/boards/${collection.id}`)}
                onLike={handleLike}
                onShare={handleShare}
                currentUserId="currentUser"
              />
            ))}
          </RectangularGrid>

          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No collections found</p>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
              {(searchQuery || showCollaborativeOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowCollaborativeOnly(false);
                  }}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all
                </button>
              )}
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
        activeView="collections"
        onNavigate={(view) => {
          if (view === "collections") router.push("/collections");
          else if (view === "home") router.push("/");
        }}
      />
    </div>
  );
}
