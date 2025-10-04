// src/lib/api/collections.ts
import { Collection, CreateCollectionInput, ApiResponse } from "@/types";

const MOCK_DELAY = 800;

// In-memory store for demo purposes
let mockCollections: Collection[] = [
  {
    id: "1",
    name: "All Saves",
    description: "All your saved events",
    eventIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

class CollectionsApi {
  async getAll(): Promise<ApiResponse<Collection[]>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    return {
      data: mockCollections,
      status: 200,
    };
  }

  async getById(id: string): Promise<ApiResponse<Collection>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
    const collection = mockCollections.find((c) => c.id === id);

    if (!collection) {
      throw {
        message: "Collection not found",
        status: 404,
      };
    }

    return {
      data: collection,
      status: 200,
    };
  }

  async create(input: CreateCollectionInput): Promise<ApiResponse<Collection>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: input.name,
      description: input.description,
      eventIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCollections.push(newCollection);

    return {
      data: newCollection,
      status: 201,
      message: "Collection created successfully",
    };
  }

  async update(
    id: string,
    input: Partial<CreateCollectionInput>
  ): Promise<ApiResponse<Collection>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const index = mockCollections.findIndex((c) => c.id === id);

    if (index === -1) {
      throw {
        message: "Collection not found",
        status: 404,
      };
    }

    mockCollections[index] = {
      ...mockCollections[index],
      ...input,
      updatedAt: new Date(),
    };

    return {
      data: mockCollections[index],
      status: 200,
      message: "Collection updated successfully",
    };
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const index = mockCollections.findIndex((c) => c.id === id);

    if (index === -1) {
      throw {
        message: "Collection not found",
        status: 404,
      };
    }

    mockCollections.splice(index, 1);

    return {
      data: undefined as void,
      status: 200,
      message: "Collection deleted successfully",
    };
  }

  async addEvent(
    collectionId: string,
    eventId: string
  ): Promise<ApiResponse<Collection>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const collection = mockCollections.find((c) => c.id === collectionId);

    if (!collection) {
      throw {
        message: "Collection not found",
        status: 404,
      };
    }

    if (!collection.eventIds.includes(eventId)) {
      collection.eventIds.push(eventId);
      collection.updatedAt = new Date();
    }

    return {
      data: collection,
      status: 200,
      message: "Event added to collection",
    };
  }

  async removeEvent(
    collectionId: string,
    eventId: string
  ): Promise<ApiResponse<Collection>> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

    const collection = mockCollections.find((c) => c.id === collectionId);

    if (!collection) {
      throw {
        message: "Collection not found",
        status: 404,
      };
    }

    collection.eventIds = collection.eventIds.filter((id) => id !== eventId);
    collection.updatedAt = new Date();

    return {
      data: collection,
      status: 200,
      message: "Event removed from collection",
    };
  }
}

export const collectionsApi = new CollectionsApi();
