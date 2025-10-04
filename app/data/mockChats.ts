// src/data/mockChats.ts
import { Chat, Message } from "@/types";

export const mockChats: Chat[] = [
  {
    id: "1",
    title: "Live music this weekend",
    date: "2025-10-01",
    messages: [
      {
        id: "1",
        role: "user",
        content: "Show me live music events this weekend",
        timestamp: new Date("2025-10-01T14:30:00"),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "I found some great live music events for this weekend! Here are the top matches.",
        timestamp: new Date("2025-10-01T14:30:05"),
      },
    ],
    createdAt: new Date("2025-10-01T14:30:00"),
    updatedAt: new Date("2025-10-01T14:30:05"),
  },
];
