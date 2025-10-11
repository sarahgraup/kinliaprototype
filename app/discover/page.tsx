// src/app/discover/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RectangularGrid } from "@/components/layout/RectangularGrid";
import { EventCard } from "@/components/events/EventCard";
import { MobileNav } from "@/components/layout/MobileNav";
import { SaveDropdown } from "@/components/collections/SaveDropdown";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { SayMoreModal } from "@/components/modals/SayMoreModal";
import { Toast } from "@/components/ui/Toast";
import { useEvents } from "@/lib/hooks/useEvents";
import { useCollections } from "@/lib/hooks/useCollections";
import { Event } from "@/types";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

export default function DiscoverPage() {
  const router = useRouter();
  const { events, loading: eventsLoading } = useEvents();
  const { collections, addEventToCollection, createCollection } =
    useCollections();

  // Get all saved event IDs
  const savedEventIds = useMemo(() => {
    const allSavedIds = new Set<string>();
    collections.forEach((collection) => {
      collection.eventIds.forEach((id) => allSavedIds.add(id));
    });
    return Array.from(allSavedIds);
  }, [collections]);

  const getEventCollections = (eventId: string) => {
    return collections.filter((collection) =>
      collection.eventIds.includes(eventId)
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<"free" | "paid" | "all">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "weekend" | "next-week"
  >("all");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedEventForSave, setSelectedEventForSave] =
    useState<Event | null>(null);
  const [selectedEventForSayMore, setSelectedEventForSayMore] =
    useState<Event | null>(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [saveDropdownPosition, setSaveDropdownPosition] = useState<
    { top: number; left: number } | undefined
  >();

  // Get unique categories from events
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    events.forEach((event) => {
      event.category.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter((event) =>
        event.category.some((cat) => categoryFilter.includes(cat))
      );
    }

    // Price filter
    if (priceFilter === "free") {
      filtered = filtered.filter((event) => event.price === 0);
    } else if (priceFilter === "paid") {
      filtered = filtered.filter((event) => event.price > 0);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "today") {
      const today = now.toISOString().split("T")[0];
      filtered = filtered.filter((event) => event.date === today);
    } else if (dateFilter === "weekend") {
      const nextSaturday = new Date(now);
      nextSaturday.setDate(now.getDate() + ((6 - now.getDay()) % 7));
      const nextSunday = new Date(nextSaturday);
      nextSunday.setDate(nextSaturday.getDate() + 1);
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.toISOString().split("T")[0] ===
            nextSaturday.toISOString().split("T")[0] ||
          eventDate.toISOString().split("T")[0] ===
            nextSunday.toISOString().split("T")[0]
        );
      });
    } else if (dateFilter === "next-week") {
      const nextWeek = new Date(now);
      nextWeek.setDate(now.getDate() + 7);
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
      });
    }

    return filtered;
  }, [events, searchQuery, categoryFilter, priceFilter, dateFilter]);

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

  const handleCreateCollection = async (input: {
    name: string;
    description?: string;
  }) => {
    try {
      await createCollection(input);
      setToast({
        message: "Collection created successfully",
        type: "success",
      });
    } catch (error) {
      throw error;
    }
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter([]);
    setPriceFilter("all");
    setDateFilter("all");
  };

  const activeFilterCount =
    categoryFilter.length +
    (priceFilter !== "all" ? 1 : 0) +
    (dateFilter !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Events
            </h1>
            <p className="text-gray-600">
              Explore all events happening in your area
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
              placeholder="Search events, venues, or locations..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filters and Filter Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Quick Filters */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setDateFilter(dateFilter === "today" ? "all" : "today")
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === "today"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Today
              </button>
              <button
                onClick={() =>
                  setDateFilter(dateFilter === "weekend" ? "all" : "weekend")
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateFilter === "weekend"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                This Weekend
              </button>
              <button
                onClick={() =>
                  setPriceFilter(priceFilter === "free" ? "all" : "free")
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priceFilter === "free"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Free Events
              </button>
            </div>

            <div className="flex-1" />

            {/* All Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-medium">All Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="text-sm text-gray-600">
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allCategories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={categoryFilter.includes(category)}
                          onChange={() => toggleCategoryFilter(category)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
                  <div className="space-y-2">
                    {(["all", "free", "paid"] as const).map((price) => (
                      <label
                        key={price}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={priceFilter === price}
                          onChange={() => setPriceFilter(price)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-sm capitalize">{price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Date</h3>
                  <div className="space-y-2">
                    {(["all", "today", "weekend", "next-week"] as const).map(
                      (date) => (
                        <label
                          key={date}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="date"
                            checked={dateFilter === date}
                            onChange={() => setDateFilter(date)}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm capitalize">
                            {date === "next-week"
                              ? "Next 7 Days"
                              : date === "weekend"
                              ? "This Weekend"
                              : date}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-6 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          {eventsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No events found</p>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <RectangularGrid columns={4}>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="rectangular"
                  isSaved={savedEventIds.includes(event.id)}
                  savedCollections={getEventCollections(event.id)}
                  onSave={handleSaveEvent}
                  onQuickSave={handleQuickSave}
                  onSayMore={() => setSelectedEventForSayMore(event)}
                  onClick={() => router.push(`/events/${event.id}`)}
                  onCollectionClick={(collectionId) =>
                    router.push(`/collections/${collectionId}`)
                  }
                />
              ))}
            </RectangularGrid>
          )}
        </div>
      </div>

      {/* Modals and Dropdowns */}
      <SaveDropdown
        isOpen={!!selectedEventForSave}
        collections={collections}
        onClose={() => setSelectedEventForSave(null)}
        onSelectCollection={handleSelectCollection}
        onCreateNew={() => setShowCreateCollection(true)}
        position={saveDropdownPosition}
      />

      <CreateCollectionModal
        isOpen={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onSubmit={handleCreateCollection}
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
        activeView="home"
        onNavigate={(view) => {
          if (view === "collections") router.push("/collections");
          else if (view === "home") router.push("/");
        }}
      />
    </div>
  );
}
