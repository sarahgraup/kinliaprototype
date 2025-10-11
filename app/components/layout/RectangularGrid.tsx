// src/components/layout/RectangularGrid.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface RectangularGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const RectangularGrid: React.FC<RectangularGridProps> = ({
  children,
  columns = 3,
  className,
}) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {children}
    </div>
  );
};
