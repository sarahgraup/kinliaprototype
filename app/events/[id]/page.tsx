// src/app/events/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { EventDetail } from "@/components/events/EventDetail";
import { SayMoreModal } from "@/components/modals/SayMoreModal";
import { SaveDropdown } from "@/components/collections/SaveDropdown";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { Toast } from "@/components/ui/Toast";
import { useEvent } from "@/lib/hooks/useEvents";
import { useCollections } from "@/lib/hooks/useCollections";
import { Button } from "@/components/ui/Button";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const { event, loading } = useEvent(eventId);
  const { collections, addEventToCollection, createCollection } =
    useCollections();

  const [showSayMore, setShowSayMore] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 flex flex-col items-center justify-center h-[calc(100vh-5rem)]">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleSelectCollection = async (collectionId: string) => {
    try {
      await addEventToCollection(collectionId, event.id);
      setToast({ message: "Event saved", type: "success" });
      setShowSaveDropdown(false);
    } catch (error) {
      setToast({ message: "Failed to save event", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <EventDetail
            event={event}
            onSave={() => setShowSaveDropdown(true)}
            onShare={() => {
              navigator.clipboard.writeText(window.location.href);
              setToast({
                message: "Link copied to clipboard",
                type: "success",
              });
            }}
            onSayMore={() => setShowSayMore(true)}
            onGetTickets={() =>
              setToast({ message: "Redirecting to tickets...", type: "info" })
            }
          />
        </div>
      </div>

      <SaveDropdown
        isOpen={showSaveDropdown}
        collections={collections}
        onClose={() => setShowSaveDropdown(false)}
        onSelectCollection={handleSelectCollection}
        onCreateNew={() => setShowCreateCollection(true)}
      />

      <CreateCollectionModal
        isOpen={showCreateCollection}
        onClose={() => setShowCreateCollection(false)}
        onSubmit={async (input) => {
          await createCollection(input);
        }}
      />

      <SayMoreModal
        isOpen={showSayMore}
        event={event}
        onClose={() => setShowSayMore(false)}
        onRefine={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
