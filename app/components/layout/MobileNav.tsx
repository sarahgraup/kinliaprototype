// src/components/layout/MobileNav.tsx
"use client";

import React from "react";
import { Home, MessageSquare, Bookmark, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MobileNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onNavigate,
}) => {
  const navItems = [
    { id: "collections", label: "Saved", icon: Bookmark },
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "home", label: "Discover", icon: Home, elevated: true },
    { id: "events", label: "Events", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.elevated) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center gap-1 -mt-6"
              >
                <div
                  className={cn(
                    "p-4 rounded-full shadow-lg transition-colors",
                    isActive ? "bg-indigo-600" : "bg-indigo-600"
                  )}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 transition-colors",
                isActive ? "text-indigo-600" : "text-gray-600"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
