// src/app/collections/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Plus } from "lucide-react";
import { EventGrid } from "@/components/events/EventGrid";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { Button } from "@/components/ui/Button";
import { useCollections } from "@/lib/hooks/useCollections";
import { eventsApi } from "@/lib/api/events";
import { Event } from "@/types";

export default function CollectionsPage() {
  const router = useRouter();
  const { collections, createCollection } = useCollections();
  const [activeTab, setActiveTab] = useState<"collections" | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadSavedEvents();
  }, [collections]);

  const loadSavedEvents = async () => {
    const allSaves = collections.find((c) => c.name === "All Saves");
    if (allSaves && allSaves.eventIds.length > 0) {
      try {
        const response = await eventsApi.getByIds(allSaves.eventIds);
        setSavedEvents(response.data);
      } catch (error) {
        console.error("Failed to load saved events:", error);
      }
    } else {
      setSavedEvents([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("collections")}
              className={`pb-4 border-b-2 font-semibold transition-colors ${
                activeTab === "collections"
                  ? "border-indigo-600 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-4 border-b-2 font-semibold transition-colors ${
                activeTab === "all"
                  ? "border-indigo-600 text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              All Saves
            </button>
          </div>

          {savedEvents.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  This collection is empty.
                </h2>
                <p className="text-gray-600 mb-6">
                  Chat with Kinlia.ai to start finding events to save to this
                  collection.
                </p>
                <Button onClick={() => router.push("/")}>
                  Start Searching
                </Button>
              </div>
            </div>
          ) : (
            <EventGrid
              events={savedEvents}
              loading={loading}
              onEventClick={(event) => router.push(`/events/${event.id}`)}
              onSaveEvent={() => {}}
              onSayMore={() => {}}
            />
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label="Create collection"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (input) => {
          await createCollection(input);
        }}
      />
    </div>
  );
}
