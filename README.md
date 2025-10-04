# Kinlia.ai - Event Discovery Platform

A modern, AI-powered event discovery platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **AI-Powered Search**: Natural language search for events with conversational refinement
- **Smart Collections**: Save and organize events into custom collections
- **Curated Recommendations**: Discover events through curated collections
- **Interactive Chat**: Refine searches through conversational AI
- **Say More Feature**: Get similar events or refine specific aspects
- **Responsive Design**: Fully responsive with mobile-first approach
- **Real-time Updates**: Loading states and optimistic UI updates

## 📁 Project Structure

```
kinlia-events/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # Global styles
│   │   ├── search/              # Search page
│   │   ├── events/[id]/         # Event detail page
│   │   └── collections/         # Collections page
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   ├── events/              # Event-related components
│   │   ├── search/              # Search components
│   │   ├── chat/                # Chat components
│   │   ├── collections/         # Collection components
│   │   ├── modals/              # Modal components
│   │   └── ui/                  # Reusable UI components
│   ├── lib/                     # Utilities and APIs
│   │   ├── api/                 # API layer (mock)
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils/               # Utility functions
│   ├── types/                   # TypeScript type definitions
│   └── data/                    # Mock data
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .eslintrc.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Mock API with easy transition to real backend

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kinlia-events
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📝 Key Components

### Layout Components
- **Header**: Main navigation header
- **MobileNav**: Bottom navigation for mobile devices
- **StickySearch**: Sticky search bar that appears on scroll

### Event Components
- **EventCard**: Reusable event card with hover interactions
- **EventGrid**: Grid layout for displaying events
- **EventDetail**: Full event detail view
- **EventCardSkeleton**: Loading skeleton for event cards

### Search Components
- **SearchInput**: Main search input with suggestions
- **SearchSuggestions**: Dropdown with search suggestions
- **SearchResults**: Search results display

### Chat Components
- **ChatSidebar**: Sidebar with chat history
- **ChatMessage**: Individual chat message
- **ChatInput**: Input for sending messages

### Collection Components
- **CollectionCard**: Card for curated collections
- **CreateCollectionModal**: Modal for creating new collections
- **SaveDropdown**: Dropdown for saving to collections

### UI Components
- **Button**: Reusable button with variants
- **Input**: Form input with validation
- **Modal**: Reusable modal component
- **Toast**: Toast notifications

## 🔌 API Layer

The project includes a complete mock API layer that simulates real backend calls:

### Events API (`src/lib/api/events.ts`)
- `getAll()` - Fetch all events
- `getById(id)` - Fetch single event
- `search(query)` - Search events
- `filter(filters)` - Filter events
- `getByIds(ids)` - Fetch multiple events by IDs

### Collections API (`src/lib/api/collections.ts`)
- `getAll()` - Fetch all collections
- `getById(id)` - Fetch single collection
- `create(input)` - Create new collection
- `update(id, input)` - Update collection
- `delete(id)` - Delete collection
- `addEvent(collectionId, eventId)` - Add event to collection
- `removeEvent(collectionId, eventId)` - Remove event from collection

### Chat API (`src/lib/api/chat.ts`)
- `getAll()` - Fetch all chats
- `getById(id)` - Fetch single chat
- `sendMessage(input)` - Send message
- `createChat(title)` - Create new chat
- `deleteChat(id)` - Delete chat

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your color palette
      },
    },
  },
}
```

### Mock Data
Update mock data in `src/data/`:
- `mockEvents.ts` - Event data
- `mockCollections.ts` - Collection data
- `mockChats.ts` - Chat data

## 🔄 Transitioning to Real API

The mock API layer is designed for easy transition:

1. **Replace API implementations** in `src/lib/api/` with real fetch calls
2. **Update the base URL** in environment variables
3. **Add authentication** if needed
4. **Handle loading and error states** (already built in)

Example transition:
```typescript
// Before (Mock)
async getAll(): Promise<ApiResponse<Event[]>> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { data: mockEvents, status: 200 };
}

// After (Real API)
async getAll(): Promise<ApiResponse<Event[]>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);
  const data = await response.json();
  return { data, status: response.status };
}
```

## 🎯 Best Practices Implemented

1. **TypeScript**: Full type safety throughout the application
2. **Component Separation**: Clear separation of concerns
3. **Custom Hooks**: Reusable logic with custom React hooks
4. **Error Handling**: Comprehensive error handling
5. **Loading States**: Loading indicators for async operations
6. **Responsive Design**: Mobile-first approach
7. **Accessibility**: ARIA labels and semantic HTML
8. **Code Organization**: Logical folder structure
9. **Type Definitions**: Separate type files
10. **Mock API Layer**: Easy transition to real backend

## 🐛 Common Issues

### Issue: Images not loading
**Solution**: Check that image domains are added to `next.config.js`:
```javascript
images: {
  domains: ['images.unsplash.com', 'i.pravatar.cc'],
}
```

### Issue: TypeScript errors
**Solution**: Run type checking:
```bash
npm run type-check
```

### Issue: Styling not applied
**Solution**: Ensure Tailwind is properly configured and CSS is imported in `layout.tsx`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@kinlia.ai or open an issue in the repository.

---

Built with ❤️ using Next.js and TypeScript# kinliaprototype
