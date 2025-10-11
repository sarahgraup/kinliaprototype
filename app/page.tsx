// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { StickySearch } from "@/components/layout/StickySearch";
import { SearchBar } from "@/components/search/SearchBar";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { HorizontalScrollGrid } from "@/components/layout/HorizontalScrollGrid";
import { CuratedCollection } from "@/components/collections/CuratedCollection";
import { CollectionCard } from "@/components/collections/CollectionCard";
import { CrewCard } from "@/components/crews/CrewCard";
import { EventGrid } from "@/components/events/EventGrid";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { SaveDropdown } from "@/components/collections/SaveDropdown";
import { SayMoreModal } from "@/components/modals/SayMoreModal";
import { Toast } from "@/components/ui/Toast";
import { useEvents } from "@/lib/hooks/useEvents";
import { useCollections } from "@/lib/hooks/useCollections";
import { useCrews } from "@/lib/hooks/useCrews";
import { mockUserCollections } from "@/data/mockCollections";
import { Event } from "@/types";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { events, loading: eventsLoading } = useEvents();
  const { collections, addEventToCollection, createCollection } =
    useCollections();
  const { crews, joinCrew } = useCrews();

  // Filter crews for homepage (open and almost-full only, limit to 8)
  const homepageCrews = React.useMemo(() => {
    return crews
      .filter((crew) => crew.status === "open" || crew.status === "almost-full")
      .slice(0, 8);
  }, [crews]);

  // Filter user collections for homepage (public only, limit to 8, sorted by recent)
  const homepageCollections = React.useMemo(() => {
    return mockUserCollections
      .filter((collection) => collection.isPublic)
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 8);
  }, []);

  // Get all saved event IDs from all collections
  const savedEventIds = React.useMemo(() => {
    const allSavedIds = new Set<string>();
    collections.forEach((collection) => {
      collection.eventIds.forEach((id) => allSavedIds.add(id));
    });
    return Array.from(allSavedIds);
  }, [collections]);

  // Get collections that contain each event (for showing in dropdown)
  const getEventCollections = React.useCallback(
    (eventId: string) => {
      return collections.filter((collection) =>
        collection.eventIds.includes(eventId)
      );
    },
    [collections]
  );

  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  const handleSaveEvent = (event: Event, buttonElement: HTMLElement) => {
    setSelectedEventForSave(event);
    const rect = buttonElement.getBoundingClientRect();
    setSaveDropdownPosition({
      top: rect.bottom + 8,
      left: rect.right, // Position from right edge of button
    });
  };

  const handleQuickSave = async (event: Event) => {
    // Quick save to first collection (All Saves)
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

  const handleSayMore = (event: Event) => {
    setSelectedEventForSayMore(event);
  };

  const handleRefineSearch = (query: string) => {
    handleSearch(query);
  };

  const handleCollectionClick = (collectionId: string) => {
    router.push(`/collections/${collectionId}`);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      <div className="pt-20">
        {/* Hero Search Section */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">
            Hi Sarah. Tell me, what's the event, mood, or activity that you're
            looking for today?
          </h1>
          <div className="relative">
            <SearchBar
              onSearch={handleSearch}
              variant="default"
              showSuggestions={true}
            />
          </div>
        </div>

        {/* Curated Collections */}
        <div className="max-w-7xl mx-auto px-4">
          <CuratedCollection
            onCollectionClick={(id) => router.push(`/collections/${id}`)}
          />
        </div>

        {/* Crew Up Section */}
        <div className="max-w-7xl mx-auto px-4">
          <SectionContainer
            title="Crew Up"
            subtitle="Join groups heading to events you love"
            viewMoreLink="/crews"
            viewMoreText="View All Crews"
          >
            <HorizontalScrollGrid>
              {homepageCrews.map((crew) => (
                <CrewCard
                  key={crew.id}
                  crew={crew}
                  variant="compact"
                  onClick={() => router.push(`/crews/${crew.id}`)}
                  onJoinCrew={async (crewId) => {
                    // Mock current user - in real app would come from auth
                    const mockUser = {
                      userId: "currentUser",
                      userName: "You",
                      avatarUrl: "https://i.pravatar.cc/150?img=60",
                      joinedAt: new Date(),
                    };
                    try {
                      await joinCrew(crewId, mockUser);
                      setToast({
                        message: "Successfully joined crew!",
                        type: "success",
                      });
                    } catch (error) {
                      setToast({
                        message: "Failed to join crew",
                        type: "error",
                      });
                    }
                  }}
                />
              ))}
            </HorizontalScrollGrid>
          </SectionContainer>
        </div>

        {/* Community Boards Section */}
        <div className="max-w-7xl mx-auto px-4">
          <SectionContainer
            title="Community Boards"
            subtitle="Discover collections from other users"
            viewMoreLink="/boards"
            viewMoreText="View All Boards"
          >
            <HorizontalScrollGrid>
              {homepageCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  variant="compact"
                  onClick={() => router.push(`/boards/${collection.id}`)}
                  onLike={(collectionId) => {
                    setToast({
                      message: "Collection liked!",
                      type: "success",
                    });
                  }}
                  currentUserId="currentUser"
                />
              ))}
            </HorizontalScrollGrid>
          </SectionContainer>
        </div>

        {/* Discovery Feed - Limit to 16 events */}
        <div className="max-w-7xl mx-auto px-4">
          <SectionContainer
            title="Discover Events"
            subtitle="Personalized suggestions for you"
            viewMoreLink="/discover"
            viewMoreText="View All Events"
          >
            <EventGrid
              events={events.slice(0, 16)}
              loading={eventsLoading}
              savedEventIds={savedEventIds}
              getEventCollections={getEventCollections}
              onEventClick={handleEventClick}
              onSaveEvent={handleSaveEvent}
              onQuickSave={handleQuickSave}
              onSayMore={handleSayMore}
              onCollectionClick={handleCollectionClick}
            />
          </SectionContainer>
        </div>

        {/* Sticky Search Bar */}
        <StickySearch isVisible={isScrolled} onSearch={handleSearch} />
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
        onRefine={handleRefineSearch}
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
