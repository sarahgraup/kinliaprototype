// src/app/crews/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { RectangularGrid } from "@/components/layout/RectangularGrid";
import { CrewCard } from "@/components/crews/CrewCard";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toast } from "@/components/ui/Toast";
import { useCrews } from "@/lib/hooks/useCrews";
import { Crew } from "@/types";
import { Filter } from "lucide-react";

export default function CrewsPage() {
  const router = useRouter();
  const { crews, joinCrew } = useCrews();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Crew["status"][]>([]);
  const [groupSizeFilter, setGroupSizeFilter] = useState<Crew["targetSize"][]>(
    []
  );
  const [showFilters, setShowFilters] = useState(false);

  // Filter crews based on selected filters
  const filteredCrews = useMemo(() => {
    let filtered = crews;

    if (statusFilter.length > 0) {
      filtered = filtered.filter((crew) => statusFilter.includes(crew.status));
    }

    if (groupSizeFilter.length > 0) {
      filtered = filtered.filter((crew) =>
        groupSizeFilter.includes(crew.targetSize)
      );
    }

    return filtered;
  }, [crews, statusFilter, groupSizeFilter]);

  const handleJoinCrew = async (crewId: string) => {
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
  };

  const toggleStatusFilter = (status: Crew["status"]) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleGroupSizeFilter = (size: Crew["targetSize"]) => {
    setGroupSizeFilter((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crew Up</h1>
            <p className="text-gray-600">
              Join groups heading to events you love or create your own crew
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4"
          >
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {(statusFilter.length > 0 || groupSizeFilter.length > 0) && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                {statusFilter.length + groupSizeFilter.length}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                  <div className="space-y-2">
                    {(["open", "almost-full", "full"] as Crew["status"][]).map(
                      (status) => (
                        <label
                          key={status}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(status)}
                            onChange={() => toggleStatusFilter(status)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm capitalize">
                            {status === "almost-full" ? "Almost Full" : status}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Group Size Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Group Size
                  </h3>
                  <div className="space-y-2">
                    {(["3-4", "5-6", "7+"] as Crew["targetSize"][]).map(
                      (size) => (
                        <label
                          key={size}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={groupSizeFilter.includes(size)}
                            onChange={() => toggleGroupSizeFilter(size)}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-sm">{size} people</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(statusFilter.length > 0 || groupSizeFilter.length > 0) && (
                <button
                  onClick={() => {
                    setStatusFilter([]);
                    setGroupSizeFilter([]);
                  }}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Crews Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="mb-4 text-sm text-gray-600">
            {filteredCrews.length} crew{filteredCrews.length !== 1 ? "s" : ""}{" "}
            found
          </div>

          <RectangularGrid columns={3}>
            {filteredCrews.map((crew) => (
              <CrewCard
                key={crew.id}
                crew={crew}
                variant="rectangular"
                onClick={() => router.push(`/crews/${crew.id}`)}
                onJoinCrew={handleJoinCrew}
              />
            ))}
          </RectangularGrid>

          {filteredCrews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No crews found matching your filters
              </p>
              <button
                onClick={() => {
                  setStatusFilter([]);
                  setGroupSizeFilter([]);
                }}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filters
              </button>
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
        activeView="home"
        onNavigate={(view) => {
          if (view === "collections") router.push("/collections");
          else if (view === "home") router.push("/");
        }}
      />
    </div>
  );
}
