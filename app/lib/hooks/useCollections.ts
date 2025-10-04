// src/lib/hooks/useCollections.ts
import { useState, useEffect, useCallback } from "react";
import { Collection, CreateCollectionInput } from "@/types";
import { collectionsApi } from "@/lib/api/collections";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await collectionsApi.getAll();
      setCollections(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load collections"
      );
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (input: CreateCollectionInput) => {
    try {
      const response = await collectionsApi.create(input);
      setCollections([...collections, response.data]);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create collection"
      );
      throw err;
    }
  };

  const updateCollection = async (
    id: string,
    input: Partial<CreateCollectionInput>
  ) => {
    try {
      const response = await collectionsApi.update(id, input);
      setCollections(collections.map((c) => (c.id === id ? response.data : c)));
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update collection"
      );
      throw err;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      await collectionsApi.delete(id);
      setCollections(collections.filter((c) => c.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete collection"
      );
      throw err;
    }
  };

  const addEventToCollection = async (
    collectionId: string,
    eventId: string
  ) => {
    try {
      const response = await collectionsApi.addEvent(collectionId, eventId);
      setCollections(
        collections.map((c) => (c.id === collectionId ? response.data : c))
      );
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add event");
      throw err;
    }
  };

  const removeEventFromCollection = async (
    collectionId: string,
    eventId: string
  ) => {
    try {
      const response = await collectionsApi.removeEvent(collectionId, eventId);
      setCollections(
        collections.map((c) => (c.id === collectionId ? response.data : c))
      );
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove event");
      throw err;
    }
  };

  return {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    addEventToCollection,
    removeEventFromCollection,
    refetch: loadCollections,
  };
}
