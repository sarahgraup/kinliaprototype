// src/types/crew.ts
export interface CrewMember {
  userId: string;
  userName: string;
  avatarUrl: string;
  age?: number;
  bio?: string;
  joinedAt: Date;
}

export interface Crew {
  id: string;
  eventId: string;
  eventName: string;
  eventImage: string;
  eventDate: Date;
  eventLocation: string;
  createdBy: CrewMember;
  members: CrewMember[];
  targetSize: "3-4" | "5-6" | "7+";
  currentSize: number;
  maxSize: number;
  agePreference?: "similar" | "any";
  genderPreference?: "same" | "any";
  status: "open" | "almost-full" | "full" | "event-passed";
  chatId: string;
  hasUnreadMessages?: boolean;
  createdAt: Date;
  description?: string;
}
