import type { Collection } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

export interface CollectionsResponse {
  collections: Collection[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CollectionFilters {
  search?: string;
  filter?: "all" | "public" | "private" | "collaborative" | "mine";
  sortBy?: "newest" | "oldest" | "popular" | "photos";
  page?: number;
  limit?: number;
}

export const collectionsApi = {
  // Get all collections with filters
  async getCollections(
    filters: CollectionFilters = {}
  ): Promise<CollectionsResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/collections?${params}`, {
      method: "GET",
      credentials: "include", // This sends cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }

    return response.json();
  },

  // Get single collection by ID
  async getCollection(id: string): Promise<Collection> {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: "GET",
      credentials: "include", // This sends cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Collection not found");
      }
      if (response.status === 403) {
        throw new Error("Access denied");
      }
      throw new Error("Failed to fetch collection");
    }

    return response.json();
  },

  // Create new collection
  async createCollection(data: {
    title: string;
    description?: string;
    isPrivate?: boolean;
    photoIds?: string[];
  }): Promise<Collection> {
    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: "POST",
      credentials: "include", // This sends cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create collection");
    }

    return response.json();
  },

  // Update collection
  async updateCollection(
    id: string,
    data: {
      title?: string;
      description?: string;
      isPrivate?: boolean;
      photoIds?: string[];
    }
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: "PUT",
      credentials: "include", // This sends cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update collection");
    }
  },

  // Delete collection
  async deleteCollection(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: "DELETE",
      credentials: "include", // This sends cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete collection");
    }
  },
};
