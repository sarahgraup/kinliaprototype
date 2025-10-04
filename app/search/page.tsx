// src/app/search/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { SearchResults } from "@/components/search/SearchResults";
import { useEvents } from "@/lib/hooks/useEvents";
import { useChats, useChat } from "@/lib/hooks/useChat";
import { useCollections } from "@/lib/hooks/useCollections";
import { Event, Message } from "@/types";
import { SaveDropdown } from "@/components/collections/SaveDropdown";
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal";
import { SayMoreModal } from "@/components/modals/SayMoreModal";
import { Toast } from "@/components/ui/Toast";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const { searchEvents, events, loading: eventsLoading } = useEvents();
  const { chats, createChat } = useChats();
  const { sendMessage, chat, sending } = useChat();
  const { collections, addEventToCollection, createCollection } =
    useCollections();

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedEventForSave, setSelectedEventForSave] =
    useState<Event | null>(null);
  const [selectedEventForSayMore, setSelectedEventForSayMore] =
    useState<Event | null>(null);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (query) {
      handleInitialSearch(query);
    }
  }, [query]);

  const handleInitialSearch = async (searchQuery: string) => {
    const results = await searchEvents(searchQuery);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: searchQuery,
      timestamp: new Date(),
    };

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `I found ${results.length} events matching "${searchQuery}". Here are the top results!`,
      timestamp: new Date(),
    };

    setMessages([userMsg, aiMsg]);
  };

  const handleSendMessage = async (content: string) => {
    try {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);

      const results = await searchEvents(content);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Found ${results.length} events for "${content}"`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSelectCollection = async (collectionId: string) => {
    if (selectedEventForSave) {
      try {
        await addEventToCollection(collectionId, selectedEventForSave.id);
        setToast({ message: "Event saved", type: "success" });
      } catch (error) {
        setToast({ message: "Failed to save event", type: "error" });
      }
      setSelectedEventForSave(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20 h-[calc(100vh-5rem)]">
        <div className="flex h-full overflow-hidden">
          <div className="w-1/3 border-r border-gray-200 bg-white p-6 overflow-y-auto">
            <div className="space-y-4 mb-6">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>
            <ChatInput onSend={handleSendMessage} disabled={sending} />
          </div>

          <SearchResults
            events={events}
            loading={eventsLoading}
            onEventClick={(event) => router.push(`/events/${event.id}`)}
            onSaveEvent={setSelectedEventForSave}
            onSayMore={setSelectedEventForSayMore}
          />
        </div>
      </div>

      <SaveDropdown
        isOpen={!!selectedEventForSave}
        collections={collections}
        onClose={() => setSelectedEventForSave(null)}
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
        isOpen={!!selectedEventForSayMore}
        event={selectedEventForSayMore}
        onClose={() => setSelectedEventForSayMore(null)}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
