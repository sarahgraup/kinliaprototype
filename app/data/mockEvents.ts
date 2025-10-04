import { Event, Friend } from "@/types";

export const mockFriends: Friend[] = [
  { id: "1", name: "Sarah", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Mike", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Emma", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "4", name: "John", avatar: "https://i.pravatar.cc/150?img=4" },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "Jazz Night at The Blue Note",
    date: "2025-10-15",
    time: "8:00 PM",
    location: "Oakland, CA",
    venue: "The Blue Note Jazz Club",
    price: 35,
    attendees: 142,
    category: ["Music", "Jazz", "Nightlife"],
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop",
    description:
      "An evening of smooth jazz featuring local artists. Enjoy live performances in an intimate setting with craft cocktails and light bites.",
    friendsAttending: [mockFriends[0], mockFriends[1]],
  },
  {
    id: "2",
    name: "Oakland Art Walk",
    date: "2025-10-20",
    time: "2:00 PM",
    location: "Oakland, CA",
    venue: "Downtown Oakland",
    price: 0,
    attendees: 523,
    category: ["Art", "Culture", "Walking"],
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop",
    description:
      "Explore local galleries and street art in downtown Oakland. Self-guided tour with maps provided.",
    friendsAttending: [mockFriends[2]],
  },
  {
    id: "3",
    name: "Food Truck Festival",
    date: "2025-10-22",
    time: "12:00 PM",
    location: "Oakland, CA",
    venue: "Lake Merritt",
    price: 15,
    attendees: 1247,
    category: ["Food", "Festival", "Family"],
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    description:
      "Sample cuisines from 50+ food trucks. Live music, kids activities, and beautiful lakeside views.",
  },
  {
    id: "4",
    name: "Tech Networking Mixer",
    date: "2025-10-18",
    time: "6:00 PM",
    location: "Oakland, CA",
    venue: "Impact Hub Oakland",
    price: 25,
    attendees: 89,
    category: ["Networking", "Tech", "Professional"],
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
    description:
      "Connect with local tech professionals. Includes welcome drink and appetizers.",
    friendsAttending: [mockFriends[0]],
  },
  {
    id: "5",
    name: "Halloween Family Fun Fair",
    date: "2025-10-31",
    time: "3:00 PM",
    location: "Oakland, CA",
    venue: "Dimond Park",
    price: 10,
    attendees: 856,
    category: ["Family", "Halloween", "Festival"],
    image:
      "https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=300&fit=crop",
    description:
      "Costume contests, games, and treats for all ages. Pumpkin decorating and face painting included.",
    friendsAttending: [mockFriends[1], mockFriends[2]],
  },
  {
    id: "6",
    name: "Indie Rock Concert",
    date: "2025-10-25",
    time: "9:00 PM",
    location: "Oakland, CA",
    venue: "Fox Theater",
    price: 45,
    attendees: 312,
    category: ["Music", "Rock", "Concert"],
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
    description:
      "Live performance by up-and-coming indie bands. Full bar available.",
  },
  {
    id: "7",
    name: "Yoga in the Park",
    date: "2025-10-16",
    time: "9:00 AM",
    location: "Oakland, CA",
    venue: "Joaquin Miller Park",
    price: 0,
    attendees: 67,
    category: ["Wellness", "Outdoor", "Exercise"],
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
    description:
      "Free outdoor yoga session for all levels. Bring your own mat and water.",
    friendsAttending: [mockFriends[2]],
  },
  {
    id: "8",
    name: "Wine Tasting Evening",
    date: "2025-10-27",
    time: "7:00 PM",
    location: "Oakland, CA",
    venue: "Urban Wine Works",
    price: 55,
    attendees: 42,
    category: ["Food & Drink", "Social", "Wine"],
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
    description:
      "Sample premium California wines with expert guidance. Cheese pairings included.",
  },
];
