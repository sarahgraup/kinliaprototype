// src/data/mockCollections.ts
import { CuratedCollection } from "@/types";

export const mockCuratedCollections: CuratedCollection[] = [
  {
    id: "1",
    title: "Most Popular Events in Oakland",
    tag: "Most Popular",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop",
    description: "Top-rated events with the highest attendance",
    eventIds: ["3", "5", "2"],
  },
  {
    id: "2",
    title: "Halloween Family Fun",
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=600&h=400&fit=crop",
    description: "Spooky and fun activities for the whole family",
    eventIds: ["5"],
  },
  {
    id: "3",
    title: "Live Music This Weekend",
    tag: "New Events",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&h=400&fit=crop",
    description: "Catch live performances this weekend",
    eventIds: ["1", "6"],
  },
  {
    id: "4",
    title: "Date Night Ideas",
    tag: "Curated",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop",
    description: "Perfect evening activities for couples",
    eventIds: ["1", "8"],
  },
];

export const searchSuggestions = [
  "Live music events this weekend in Oakland",
  "Family-friendly activities under $50",
  "Networking events for professionals",
  "Free outdoor activities",
  "Halloween events for kids",
  "Wine tasting experiences",
  "Tech meetups and workshops",
  "Art galleries and exhibitions",
  "Fitness and wellness classes",
  "Food and drink festivals",
];
