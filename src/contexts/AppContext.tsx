import React, { createContext, useContext, useState, ReactNode } from "react";
import { Photo, Collection, SearchFilters, Notification } from "../types";
import toast from "react-hot-toast";

interface AppContextType {
  photos: Photo[];
  collections: Collection[];
  searchFilters: SearchFilters;
  notifications: Notification[];
  isPhotoModalOpen: boolean;
  selectedPhoto: Photo | null;
  isUploadModalOpen: boolean;
  likedPhotos: Set<string>;
  savedPhotos: Set<string>;
  followedUsers: Set<string>;
  setPhotos: (photos: Photo[]) => void;
  setCollections: (collections: Collection[]) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  openPhotoModal: (photo: Photo) => void;
  closePhotoModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  toggleLike: (photoId: string) => void;
  toggleSave: (photoId: string) => void;
  toggleFollow: (userId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [savedPhotos, setSavedPhotos] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setSelectedPhoto(null);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const toggleLike = (photoId: string) => {
    // This is now handled by individual components making API calls
    // Keep this for backward compatibility but it's not used
    setLikedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const toggleSave = async (photoId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${photoId}/save`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedPhotos((prev) => {
          const newSet = new Set(prev);
          if (data.saved) {
            newSet.add(photoId);
          } else {
            newSet.delete(photoId);
          }
          return newSet;
        });
        toast.success(data.message);
      } else {
        throw new Error("Failed to save photo");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save photo");
    }
  };

  const toggleFollow = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/users/${userId}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          if (data.following) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
        toast.success(data.message);
      } else {
        throw new Error("Failed to follow user");
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Failed to follow user");
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const value = {
    photos,
    collections,
    searchFilters,
    notifications,
    isPhotoModalOpen,
    selectedPhoto,
    isUploadModalOpen,
    likedPhotos,
    savedPhotos,
    followedUsers,
    setPhotos,
    setCollections,
    setSearchFilters,
    openPhotoModal,
    closePhotoModal,
    openUploadModal,
    closeUploadModal,
    toggleLike,
    toggleSave,
    toggleFollow,
    markNotificationAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
