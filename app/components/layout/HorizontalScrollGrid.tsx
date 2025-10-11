// src/components/layout/HorizontalScrollGrid.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface HorizontalScrollGridProps {
  children: React.ReactNode;
  className?: string;
}

export const HorizontalScrollGrid: React.FC<HorizontalScrollGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide",
        // Hide scrollbar styles
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
    >
      {children}
    </div>
  );
};
