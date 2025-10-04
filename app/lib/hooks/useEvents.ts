import { useState, useEffect } from "react";
import { Event, EventFilters } from "@/types";
import { eventsApi } from "@/lib/api/events";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.search(query);
      setEvents(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = async (filters: EventFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.filter(filters);
      setEvents(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Filter failed");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    loadEvents,
    searchEvents,
    filterEvents,
  };
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsApi.getById(id);
      setEvent(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  return { event, loading, error, refetch: loadEvent };
}
