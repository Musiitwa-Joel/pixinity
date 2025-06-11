const API_BASE_URL = "http://localhost:5000/api";

export interface CollectionFilters {
  filter?: "all" | "public" | "private" | "mine";
  search?: string;
  sort?: "newest" | "oldest" | "photos";
  limit?: number;
  offset?: number;
  user_id?: string;
}

export interface CreateCollectionData {
  title: string;
  description?: string;
  isPrivate?: boolean;
  photoIds?: string[];
  isCollaborative?: boolean;
  collaboratorEmails?: string[];
}

export interface UpdateCollectionData {
  title?: string;
  description?: string;
  isPrivate?: boolean;
  photoIds?: string[];
  isCollaborative?: boolean;
  collaboratorEmails?: string[];
}

class CollectionsService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getCollections(filters: CollectionFilters = {}) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/collections?${params.toString()}`);
  }

  async getCollection(id: string) {
    return this.request(`/collections/${id}`);
  }

  async createCollection(data: CreateCollectionData) {
    return this.request("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCollection(id: string, data: UpdateCollectionData) {
    return this.request(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCollection(id: string) {
    return this.request(`/collections/${id}`, {
      method: "DELETE",
    });
  }

  async getUserPhotos(userId: string, search?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    return this.request(
      `/collections/user/${userId}/photos?${params.toString()}`
    );
  }

  async getCollectionAnalytics(id: string) {
    return this.request(`/collections/${id}/analytics`);
  }
}

export const collectionsService = new CollectionsService();
