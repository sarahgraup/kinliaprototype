import { ApiResponse, ApiError } from "@/types";

const MOCK_DELAY = 800; // Simulate network delay

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async mockDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.mockDelay();
    // In production, this would be: fetch(`${this.baseUrl}${endpoint}`)
    throw new Error("Mock implementation - override in specific API files");
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    await this.mockDelay();
    throw new Error("Mock implementation - override in specific API files");
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    await this.mockDelay();
    throw new Error("Mock implementation - override in specific API files");
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.mockDelay();
    throw new Error("Mock implementation - override in specific API files");
  }
}

export const apiClient = new ApiClient();
