// src/lib/api/events.ts
import { Event, EventFilters, ApiResponse } from "@/types";
import { mockEvents } from "@/data/mockEvents";

const MOCK_DELAY = 800;

class EventsApi {
  async getAll(): Promise<ApiResponse<Event[]>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      data: mockEvents,
      status: 200,
      message: "Events fetched successfully",
    };
  }

  async getById(id: string): Promise<ApiResponse<Event>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      throw {
        message: "Event not found",
        status: 404,
      };
    }

    return {
      data: event,
      status: 200,
    };
  }

  async search(query: string): Promise<ApiResponse<Event[]>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const filtered = mockEvents.filter((event) => {
      const searchText = query.toLowerCase();
      return (
        event.name.toLowerCase().includes(searchText) ||
        event.description.toLowerCase().includes(searchText) ||
        event.category.some((cat) => cat.toLowerCase().includes(searchText)) ||
        event.location.toLowerCase().includes(searchText)
      );
    });

    return {
      data: filtered,
      status: 200,
      message: `Found ${filtered.length} events`,
    };
  }

  async filter(filters: EventFilters): Promise<ApiResponse<Event[]>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    let filtered = [...mockEvents];

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter((event) =>
        event.category.some((cat) => filters.category?.includes(cat))
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(
        (event) => event.price >= min && event.price <= max
      );
    }

    if (filters.location) {
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return {
      data: filtered,
      status: 200,
    };
  }

  async getByIds(ids: string[]): Promise<ApiResponse<Event[]>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const events = mockEvents.filter((event) => ids.includes(event.id));

    return {
      data: events,
      status: 200,
    };
  }
}

export const eventsApi = new EventsApi();
