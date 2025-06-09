const API_BASE_URL = "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface Photo {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}

export const photosApi = {
  // Get user's photos
  async getUserPhotos(search?: string): Promise<Photo[]> {
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }

    const response = await fetch(`${API_BASE_URL}/photos/user?${params}`, {
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user photos");
    }

    return response.json();
  },
};
