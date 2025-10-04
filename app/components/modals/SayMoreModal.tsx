// src/components/modals/SayMoreModal.tsx
"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Event } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";

interface SayMoreModalProps {
  isOpen: boolean;
  event: Event | null;
  onClose: () => void;
  onRefine: (query: string) => void;
}

export const SayMoreModal: React.FC<SayMoreModalProps> = ({
  isOpen,
  event,
  onClose,
  onRefine,
}) => {
  const [customQuery, setCustomQuery] = useState("");

  if (!event) return null;

  const handleRefine = (query: string) => {
    onRefine(query);
    onClose();
  };

  const refinementOptions = [
    {
      label: "More like this",
      query: `Events like ${event.name}`,
    },
    {
      label: "Cheaper options",
      query: `Cheaper events similar to ${event.name}`,
    },
    {
      label: "Closer location",
      query: `Events near ${event.location}`,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refine Your Search"
      size="lg"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
          <h3 className="font-bold text-xl mb-2">{event.name}</h3>
          <p className="text-gray-600 mb-2">
            {event.date} • {event.time}
          </p>
          <p className="text-indigo-600 font-bold text-lg">
            {formatPrice(event.price)}
          </p>
        </div>

        <div>
          <p className="text-gray-600 mb-4">
            How would you like to adjust this event?
          </p>
          <div className="space-y-3 mb-6">
            {refinementOptions.map((option) => (
              <Button
                key={option.label}
                onClick={() => handleRefine(option.query)}
                variant="secondary"
                className="w-full justify-start text-left"
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-3">
              Change something specific?
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Describe what you want to change..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-indigo-600 pr-12"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customQuery.trim()) {
                    handleRefine(customQuery);
                  }
                }}
              />
              <button
                onClick={() => customQuery.trim() && handleRefine(customQuery)}
                disabled={!customQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
