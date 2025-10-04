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


