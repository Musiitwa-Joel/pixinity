export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    behance?: string;
    dribbble?: string;
  };
  role: "guest" | "photographer" | "company" | "admin";
  verified: boolean;
  followersCount: number;
  followingCount: number;
  uploadsCount: number;
  totalViews: number;
  totalDownloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id: string; // This will be the UUID
  uuid: string; // Explicit UUID field
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "square";
  category: string;
  tags: string[];
  color: string;
  exifData?: {
    camera?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    location?: string;
  };
  license: "free" | "cc0" | "attribution";
  status?: "draft" | "live";
  photographer: User;
  likesCount: number;
  downloadsCount: number;
  viewsCount: number;
  featured: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collaborator {
  id: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  email?: string;
  verified: boolean;
  role: string;
  collaboratorRole: "editor" | "viewer";
  status: "pending" | "accepted" | "declined";
  invitedAt: Date;
  respondedAt?: Date;
}

export interface AccessRequest {
  id: string;
  message?: string;
  requestedAt: Date;
  status: "pending" | "approved" | "denied";
  user: User;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  coverPhoto?: Photo;
  photosCount: number;
  viewsCount?: number;
  likesCount?: number;
  commentsCount?: number;
  isPrivate: boolean;
  isCollaborative: boolean;
  creator: User;
  collaborators?: Collaborator[];
  photos: Photo[];
  accessRequests?: AccessRequest[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  orientation?: "portrait" | "landscape" | "square";
  color?: string;
  sortBy?: "trending" | "newest" | "popular" | "downloads";
}

export interface Notification {
  id: string;
  type:
    | "like"
    | "follow"
    | "download"
    | "feature"
    | "collection_add"
    | "collaboration_invite"
    | "access_request"
    | "collection_like"
    | "collection_comment"
    | "collection_upload";
  message: string;
  read: boolean;
  actionUrl?: string;
  actor?: User;
  createdAt: Date;
}

export interface Analytics {
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  topPhotos: Photo[];
  viewsOverTime: { date: string; views: number }[];
  downloadsOverTime: { date: string; downloads: number }[];
}
