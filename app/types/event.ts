// src/types/event.ts
export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  attendees: number;
  category: string[];
  image: string;
  description: string;
  friendsAttending?: Friend[];
}

export interface EventFilters {
  category?: string[];
  priceRange?: [number, number];
  dateRange?: [Date, Date];
  location?: string;
}
