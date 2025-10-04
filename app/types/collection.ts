// src/types/collection.ts
export interface Collection {
  id: string;
  name: string;
  description?: string;
  eventIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CuratedCollection {
  id: string;
  title: string;
  tag: string;
  image: string;
  description?: string;
  eventIds: string[];
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
}
