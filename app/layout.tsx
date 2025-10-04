// src/app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { Header } from "@/components/layout/Header";
import { useChats } from "@/lib/hooks/useChat";
import { useRouter, usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { chats } = useChats();
  const [showChatSidebar, setShowChatSidebar] = useState(false);

  console.log("🔵 Layout - Chat Sidebar State:", showChatSidebar);
  console.log("🔵 Layout - Current Path:", pathname);
  console.log("🔵 Layout - Chats Count:", chats.length);

  const handleChatsClick = () => {
    console.log("🟢 Header Chats Button Clicked!");
    console.log("🟢 Previous State:", showChatSidebar);
    setShowChatSidebar(!showChatSidebar);
    console.log("🟢 New State Should Be:", !showChatSidebar);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header
          onChatsClick={handleChatsClick}
          onBookmarksClick={() => router.push("/collections")}
        />

        <ChatSidebar
          isOpen={showChatSidebar}
          chats={chats}
          onClose={() => {
            console.log("🔴 Closing Chat Sidebar");
            setShowChatSidebar(false);
          }}
          onSelectChat={(id) => {
            console.log("💬 Chat Selected:", id);
            router.push(`/search?chatId=${id}`);
          }}
          onNewChat={() => {
            console.log("✨ New Chat Clicked");
            router.push("/search");
          }}
        />

        {children}
      </body>
    </html>
  );
}
