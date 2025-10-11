// src/types/collection.ts
export interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  eventIds: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  collaboratorIds: string[];
  followerIds: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  shareLink?: string;
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
  isPublic?: boolean;
  isCollaborative?: boolean;
}

export interface CollectionComment {
  id: string;
  collectionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}
