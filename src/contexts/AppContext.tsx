import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Photo, Collection, SearchFilters, Notification } from '../types';

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
    throw new Error('useApp must be used within an AppProvider');
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
    setLikedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const toggleSave = (photoId: string) => {
    setSavedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const toggleFollow = (userId: string) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
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
    markNotificationAsRead
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};