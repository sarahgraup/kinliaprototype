// src/lib/hooks/useCrews.ts
import { useState, useEffect, useCallback } from "react";
import { Crew, CrewMember } from "@/types";
import { mockCrews } from "@/data/mockCrews";

interface CreateCrewInput {
  eventId: string;
  targetSize: "3-4" | "5-6" | "7+";
  agePreference?: "similar" | "any";
  genderPreference?: "same" | "any";
  description?: string;
}

export function useCrews() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCrews();
  }, []);

  const loadCrews = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCrews(mockCrews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load crews");
    } finally {
      setLoading(false);
    }
  };

  const createCrew = async (
    input: CreateCrewInput,
    currentUser: CrewMember
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const maxSize =
        input.targetSize === "3-4" ? 4 : input.targetSize === "5-6" ? 6 : 8;

      const newCrew: Crew = {
        id: `crew_${Date.now()}`,
        eventId: input.eventId,
        eventName: "Event Name", // Would come from event lookup
        eventImage:
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
        eventDate: new Date(),
        eventLocation: "Event Location",
        createdBy: currentUser,
        members: [],
        targetSize: input.targetSize,
        currentSize: 1,
        maxSize,
        agePreference: input.agePreference,
        genderPreference: input.genderPreference,
        status: "open",
        chatId: `chat_${Date.now()}`,
        hasUnreadMessages: false,
        createdAt: new Date(),
        description: input.description,
      };

      setCrews([newCrew, ...crews]);
      return newCrew;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create crew");
      throw err;
    }
  };

  const joinCrew = async (crewId: string, member: CrewMember) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const crew = crews.find((c) => c.id === crewId);
      if (!crew) throw new Error("Crew not found");
      if (crew.currentSize >= crew.maxSize) throw new Error("Crew is full");

      const updatedCrew: Crew = {
        ...crew,
        members: [...crew.members, member],
        currentSize: crew.currentSize + 1,
        status:
          crew.currentSize + 1 >= crew.maxSize
            ? "full"
            : crew.currentSize + 1 >= crew.maxSize - 1
            ? "almost-full"
            : "open",
      };

      setCrews(crews.map((c) => (c.id === crewId ? updatedCrew : c)));
      return updatedCrew;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join crew");
      throw err;
    }
  };

  const leaveCrew = async (crewId: string, userId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const crew = crews.find((c) => c.id === crewId);
      if (!crew) throw new Error("Crew not found");

      const updatedCrew: Crew = {
        ...crew,
        members: crew.members.filter((m) => m.userId !== userId),
        currentSize: crew.currentSize - 1,
        status:
          crew.currentSize - 1 >= crew.maxSize - 1 ? "almost-full" : "open",
      };

      setCrews(crews.map((c) => (c.id === crewId ? updatedCrew : c)));
      return updatedCrew;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave crew");
      throw err;
    }
  };

  const getCrewsByEvent = useCallback(
    (eventId: string) => {
      return crews.filter((crew) => crew.eventId === eventId);
    },
    [crews]
  );

  const getUserCrews = useCallback(
    (userId: string) => {
      return crews.filter(
        (crew) =>
          crew.createdBy.userId === userId ||
          crew.members.some((m) => m.userId === userId)
      );
    },
    [crews]
  );

  const getCrewById = useCallback(
    (crewId: string) => {
      return crews.find((crew) => crew.id === crewId);
    },
    [crews]
  );

  const filterCrews = useCallback(
    (filters: {
      status?: Crew["status"][];
      eventType?: string[];
      dateRange?: [Date, Date];
      groupSize?: Crew["targetSize"][];
    }) => {
      let filtered = crews;

      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter((crew) =>
          filters.status!.includes(crew.status)
        );
      }

      if (filters.groupSize && filters.groupSize.length > 0) {
        filtered = filtered.filter((crew) =>
          filters.groupSize!.includes(crew.targetSize)
        );
      }

      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        filtered = filtered.filter((crew) => {
          const crewDate = new Date(crew.eventDate);
          return crewDate >= start && crewDate <= end;
        });
      }

      return filtered;
    },
    [crews]
  );

  return {
    crews,
    loading,
    error,
    createCrew,
    joinCrew,
    leaveCrew,
    getCrewsByEvent,
    getUserCrews,
    getCrewById,
    filterCrews,
    refetch: loadCrews,
  };
}
