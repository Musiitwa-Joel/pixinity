import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Image,
  Lock,
  Globe,
  Users,
  Camera,
  Upload,
  Search,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { collectionsService } from "../../../server/services/collectionsService";
import { Collection } from "../../types";
import toast from "react-hot-toast";

interface CreateCollectionForm {
  title: string;
  description: string;
  isPrivate: boolean;
  isCollaborative: boolean;
}

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCollectionCreated: (collection: Collection) => void;
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

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCollectionCreated,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<"details" | "photos" | "collaborators">(
    "details"
  );
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateCollectionForm>({
    defaultValues: {
      isPrivate: false,
      isCollaborative: false,
    },
  });

  const isPrivate = watch("isPrivate");

  // Load user's photos when modal opens
  useEffect(() => {
    if (isOpen && user && step === "photos") {
      loadUserPhotos();
    }
  }, [isOpen, user, step]);

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
    if (user && step === "photos") {
      const timeoutId = setTimeout(() => {
        loadUserPhotos();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  const handlePhotoToggle = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleCreateCollection = async (data: CreateCollectionForm) => {
    setIsCreating(true);

    try {
      const collectionData = {
        title: data.title,
        description: data.description,
        isPrivate: data.isPrivate,
        photoIds: Array.from(selectedPhotos),
      };

      const newCollection = await collectionsService.createCollection(
        collectionData
      );

      onCollectionCreated(newCollection);
      toast.success("Collection created successfully!");
      handleClose();
    } catch (error: any) {
      console.error("Create collection error:", error);
      toast.error(error.message || "Failed to create collection");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setStep("details");
    setSelectedPhotos(new Set());
    setSearchQuery("");
    setUserPhotos([]);
    reset();
    onClose();
  };

  const handleNext = () => {
    if (step === "details") {
      setStep("photos");
    } else if (step === "photos") {
      setStep("collaborators");
    }
  };

  const handleBack = () => {
    if (step === "photos") {
      setStep("details");
    } else if (step === "collaborators") {
      setStep("photos");
    }
  };

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
                  Create Collection
                </h2>
                <p className="text-neutral-600">
                  Organize your photos into beautiful collections
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
              <div className="flex items-center space-x-4">
                {[
                  { id: "details", label: "Details", icon: Camera },
                  { id: "photos", label: "Add Photos", icon: Image },
                  { id: "collaborators", label: "Collaborators", icon: Users },
                ].map((stepItem, index) => (
                  <div key={stepItem.id} className="flex items-center">
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        step === stepItem.id
                          ? "bg-primary-500 text-white"
                          : index <
                            ["details", "photos", "collaborators"].indexOf(step)
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <stepItem.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {stepItem.label}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className="w-8 h-px bg-neutral-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(handleCreateCollection)}>
              <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Step 1: Collection Details */}
                {step === "details" && (
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
                        className="input"
                        placeholder="Give your collection a name"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-error-600">
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
                        className="input resize-none"
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

                {/* Step 2: Add Photos */}
                {step === "photos" && (
                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Add Photos
                      </h3>
                      <p className="text-neutral-600">
                        Select photos from your uploads to add to this
                        collection
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
                      {selectedPhotos.size} photo
                      {selectedPhotos.size !== 1 ? "s" : ""} selected
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
                                selectedPhotos.has(photo.id)
                                  ? "border-primary-500 bg-primary-500/20"
                                  : "border-transparent group-hover:border-primary-300"
                              }`}
                            />
                            {selectedPhotos.has(photo.id) && (
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

                {/* Step 3: Collaborators */}
                {step === "collaborators" && (
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
                        Collaborative collections are coming soon! For now, you
                        can create the collection and we'll add collaboration
                        features later.
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
              <div className="flex items-center justify-between p-6 border-t border-neutral-200 bg-neutral-50">
                <div className="flex space-x-3">
                  {step !== "details" && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn-outline"
                    >
                      Back
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn-outline"
                  >
                    Cancel
                  </button>

                  {step === "collaborators" ? (
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="btn-primary"
                    >
                      {isCreating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Collection
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCollectionModal;
