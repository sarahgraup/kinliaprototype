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


  const handleChatsClick = () => {

    setShowChatSidebar(!showChatSidebar);

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

            setShowChatSidebar(false);
          }}
          onSelectChat={(id) => {

            router.push(`/search?chatId=${id}`);
          }}
          onNewChat={() => {

            router.push("/search");
          }}
        />

        {children}
      </body>
    </html>
  );
}
