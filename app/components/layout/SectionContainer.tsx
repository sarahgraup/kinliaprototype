// src/components/layout/SectionContainer.tsx
"use client";

import React from "react";
import Link from "next/link";

interface SectionContainerProps {
  title: string;
  subtitle?: string;
  viewMoreLink?: string;
  viewMoreText?: string;
  children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  subtitle,
  viewMoreLink,
  viewMoreText = "View More",
  children,
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1 text-sm">{subtitle}</p>}
        </div>
        {viewMoreLink && (
          <Link
            href={viewMoreLink}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition-colors flex-shrink-0 mt-1"
          >
            {viewMoreText} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};
