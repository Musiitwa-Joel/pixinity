import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Image,
  Lock,
  Globe,
  Users,
  Camera,
  Search,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { collectionsService } from "../../../server/services/collectionsService";
import { Collection } from "../../types";
import toast from "react-hot-toast";

interface EditCollectionForm {
  title: string;
  description: string;
  isPrivate: boolean;
  isCollaborative: boolean;
}

interface EditCollectionModalProps {
  isOpen: boolean;
  collection: Collection | null;
  onClose: () => void;
  onCollectionUpdated: (collection: Collection) => void;
}

interface UserPhoto {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  createdAt: string;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isOpen,
  collection,
  onClose,
  onCollectionUpdated,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "details" | "photos" | "collaborators"
  >("details");
  const [collectionPhotos, setCollectionPhotos] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditCollectionForm>();

  const isPrivate = watch("isPrivate");

  useEffect(() => {
    if (collection && isOpen) {
      console.log("Setting up edit modal for collection:", collection);
      reset({
        title: collection.title,
        description: collection.description || "",
        isPrivate: collection.isPrivate,
        isCollaborative: collection.isCollaborative,
      });
      setCollectionPhotos(
        new Set(collection.photos?.map((photo) => photo.id) || [])
      );
    }
  }, [collection, reset, isOpen]);

  // Load user's photos when photos tab is active
  useEffect(() => {
    if (isOpen && user && activeTab === "photos") {
      loadUserPhotos();
    }
  }, [isOpen, user, activeTab]);

  // Filter photos based on search
  const filteredPhotos = userPhotos.filter(
    (photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadUserPhotos = async () => {
    if (!user) return;

    setIsLoadingPhotos(true);
    try {
      const photos = await collectionsService.getUserPhotos(
        user.id,
        searchQuery
      );
      setUserPhotos(photos);
    } catch (error) {
      console.error("Failed to load photos:", error);
      toast.error("Failed to load your photos");
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  // Reload photos when search changes
  useEffect(() => {
    if (user && activeTab === "photos") {
      const timeoutId = setTimeout(() => {
        loadUserPhotos();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const handlePhotoToggle = (photoId: string) => {
    setCollectionPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleUpdateCollection = async (data: EditCollectionForm) => {
    if (!collection) {
      console.error("No collection to update");
      return;
    }

    setIsUpdating(true);

    try {
      console.log("Updating collection:", collection.id, "with data:", data);

      const updateData = {
        title: data.title,
        description: data.description,
        isPrivate: data.isPrivate,
        photoIds: Array.from(collectionPhotos),
      };

      await collectionsService.updateCollection(collection.id, updateData);

      // Create updated collection object for callback
      const updatedCollection: Collection = {
        ...collection,
        title: data.title,
        description: data.description,
        isPrivate: data.isPrivate,
        photosCount: collectionPhotos.size,
        updatedAt: new Date(),
      };

      onCollectionUpdated(updatedCollection);
      toast.success("Collection updated successfully!");
      onClose();
    } catch (error: any) {
      console.error("Update collection error:", error);
      toast.error(error.message || "Failed to update collection");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    console.log("Closing edit modal");
    setActiveTab("details");
    setSearchQuery("");
    setUserPhotos([]);
    onClose();
  };

  if (!collection) {
    console.log("No collection provided to edit modal");
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Edit Collection
                </h2>
                <p className="text-neutral-600">
                  Update your collection details and photos
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
              <div className="flex space-x-1">
                {[
                  { id: "details", label: "Details", icon: Camera },
                  { id: "photos", label: "Photos", icon: Image },
                  { id: "collaborators", label: "Collaborators", icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-500 text-white"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(handleUpdateCollection)}>
              <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Details Tab */}
                {activeTab === "details" && (
                  <motion.div
                    className="p-6 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Collection Title *
                      </label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                        })}
                        type="text"
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        placeholder="Give your collection a name"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                        placeholder="Describe what this collection is about..."
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Privacy Settings
                      </h3>

                      <div className="space-y-3">
                        <label className="flex items-start space-x-3 p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                          <input
                            {...register("isPrivate")}
                            type="checkbox"
                            className="mt-1 text-primary-600 focus:ring-primary-500 rounded"
                          />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Lock className="h-4 w-4 text-neutral-500" />
                              <span className="font-medium text-neutral-900">
                                Private Collection
                              </span>
                            </div>
                            <p className="text-sm text-neutral-600">
                              Only you can see this collection
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                          <input
                            {...register("isCollaborative")}
                            type="checkbox"
                            className="mt-1 text-primary-600 focus:ring-primary-500 rounded"
                            disabled={isPrivate}
                          />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <Users className="h-4 w-4 text-neutral-500" />
                              <span
                                className={`font-medium ${
                                  isPrivate
                                    ? "text-neutral-400"
                                    : "text-neutral-900"
                                }`}
                              >
                                Collaborative Collection
                              </span>
                            </div>
                            <p
                              className={`text-sm ${
                                isPrivate
                                  ? "text-neutral-400"
                                  : "text-neutral-600"
                              }`}
                            >
                              Allow others to contribute photos (Coming soon)
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Photos Tab */}
                {activeTab === "photos" && (
                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Manage Photos
                      </h3>
                      <p className="text-neutral-600">
                        Add or remove photos from this collection
                      </p>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your photos..."
                        className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {/* Selected Count */}
                    <div className="mb-4 text-sm text-neutral-600">
                      {collectionPhotos.size} photo
                      {collectionPhotos.size !== 1 ? "s" : ""} in collection
                    </div>

                    {/* Photos Grid */}
                    {isLoadingPhotos ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className="aspect-square bg-neutral-200 rounded-lg animate-pulse"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
                        {filteredPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="relative aspect-square cursor-pointer group"
                            onClick={() => handlePhotoToggle(photo.id)}
                          >
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <div
                              className={`absolute inset-0 rounded-lg border-2 transition-all ${
                                collectionPhotos.has(photo.id)
                                  ? "border-primary-500 bg-primary-500/20"
                                  : "border-transparent group-hover:border-primary-300"
                              }`}
                            />
                            {collectionPhotos.has(photo.id) && (
                              <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {!isLoadingPhotos && filteredPhotos.length === 0 && (
                      <div className="text-center py-12">
                        <Camera className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-500">
                          {userPhotos.length === 0
                            ? "No photos found. Upload some photos first!"
                            : "No photos match your search."}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Collaborators Tab */}
                {activeTab === "collaborators" && (
                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Collaborators
                      </h3>
                      <p className="text-neutral-600">
                        Collaborative collections are coming soon! This feature
                        will allow multiple users to contribute photos to the
                        same collection.
                      </p>
                    </div>

                    <div className="text-center py-12 text-neutral-500">
                      <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                      <p>Collaboration features coming soon</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-neutral-200 bg-neutral-50 space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 focus:ring-neutral-500 backdrop-blur-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl"
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCollectionModal;
