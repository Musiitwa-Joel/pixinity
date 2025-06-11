import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Image,
  Lock,
  Users,
  Camera,
  Search,
  Check,
  Mail,
  UserPlus,
  Trash2,
  Send,
  Shield,
  Globe,
  Settings,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { collectionsService } from "../../../server/services/collectionsService";
import type { Collection } from "../../types";
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
  const [step, setStep] = useState<
    "details" | "settings" | "photos" | "collaborators"
  >("details");
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [collaboratorEmails, setCollaboratorEmails] = useState<string[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");

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
  const isCollaborative = watch("isCollaborative");

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

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail.trim()) return;

    const email = newCollaboratorEmail.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if email is already added
    if (collaboratorEmails.includes(email)) {
      toast.error("This email is already added");
      return;
    }

    // Check if it's the user's own email
    if (email === user?.email?.toLowerCase()) {
      toast.error("You cannot add yourself as a collaborator");
      return;
    }

    setCollaboratorEmails((prev) => [...prev, email]);
    setNewCollaboratorEmail("");
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaboratorEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleCreateCollection = async (data: CreateCollectionForm) => {
    // Validate photos are selected
    if (selectedPhotos.size === 0) {
      toast.error("Please select at least one photo");
      setStep("photos");
      return;
    }

    setIsCreating(true);

    try {
      const collectionData = {
        title: data.title,
        description: data.description,
        isPrivate: data.isPrivate,
        isCollaborative: data.isCollaborative && !data.isPrivate,
        photoIds: Array.from(selectedPhotos),
        collaboratorEmails:
          data.isCollaborative && !data.isPrivate ? collaboratorEmails : [],
      };

      const newCollection = await collectionsService.createCollection(
        collectionData
      );

      onCollectionCreated(newCollection);

      if (
        data.isCollaborative &&
        !data.isPrivate &&
        collaboratorEmails.length > 0
      ) {
        toast.success(
          `Collection created! Invitations sent to ${
            collaboratorEmails.length
          } collaborator${collaboratorEmails.length > 1 ? "s" : ""}.`
        );
      } else {
        toast.success("Collection created successfully!");
      }

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
    setCollaboratorEmails([]);
    setNewCollaboratorEmail("");
    reset();
    onClose();
  };

  const handleNext = () => {
    if (step === "details") {
      setStep("settings");
    } else if (step === "settings") {
      setStep("photos");
    } else if (step === "photos") {
      if (watch("isCollaborative") && !watch("isPrivate")) {
        setStep("collaborators");
      } else {
        // If not collaborative, skip to submission
        handleSubmit(handleCreateCollection)();
      }
    }
  };

  const handleBack = () => {
    if (step === "settings") {
      setStep("details");
    } else if (step === "photos") {
      setStep("settings");
    } else if (step === "collaborators") {
      setStep("photos");
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(handleCreateCollection)();
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
            className="relative max-w-4xl w-full h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
                  { id: "settings", label: "Settings", icon: Settings },
                  { id: "photos", label: "Add Photos", icon: Image },
                  { id: "collaborators", label: "Collaborators", icon: Users },
                ].map((stepItem, index) => (
                  <div key={stepItem.id} className="flex items-center">
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        step === stepItem.id
                          ? "bg-primary-500 text-white"
                          : index <
                            [
                              "details",
                              "settings",
                              "photos",
                              "collaborators",
                            ].indexOf(step)
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      <stepItem.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {stepItem.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="w-8 h-px bg-neutral-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col h-[calc(100%-10rem)]">
              <div className="flex-1 overflow-y-auto min-h-0">
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
                          minLength: {
                            value: 3,
                            message: "Title must be at least 3 characters",
                          },
                          maxLength: {
                            value: 50,
                            message: "Title cannot exceed 50 characters",
                          },
                        })}
                        type="text"
                        className={`input w-full ${
                          errors.title
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-neutral-200 focus:ring-primary-500 focus:border-primary-500"
                        }`}
                        placeholder="Give your collection a name"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register("description", {
                          maxLength: {
                            value: 500,
                            message: "Description cannot exceed 500 characters",
                          },
                        })}
                        rows={4}
                        className={`input resize-none ${
                          errors.description
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-neutral-200 focus:ring-primary-500 focus:border-primary-500"
                        }`}
                        placeholder="Describe what this collection is about..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {errors.description.message}
                        </p>
                      )}
                      <div className="flex justify-end">
                        <span
                          className={`text-xs ${
                            watch("description")?.length > 450
                              ? watch("description")?.length > 500
                                ? "text-red-600"
                                : "text-amber-600"
                              : "text-neutral-500"
                          }`}
                        >
                          {watch("description")?.length || 0}/500
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Collection Settings */}
                {step === "settings" && (
                  <motion.div
                    className="p-6 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Collection Settings
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
                              Only you and invited collaborators can see this
                              collection
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
                          <div className="flex-1">
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
                              Allow others to contribute photos to this
                              collection
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Privacy Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800 mb-1">
                              Privacy & Collaboration
                            </h4>
                            <div className="text-sm text-blue-700 space-y-1">
                              {isPrivate ? (
                                <p>
                                  • Private collections are only visible to you
                                  and invited collaborators
                                </p>
                              ) : (
                                <p>
                                  • Public collections can be discovered by
                                  anyone on Pixinity
                                </p>
                              )}
                              {isCollaborative && !isPrivate && (
                                <p>
                                  • Users can request access to collaborate on
                                  public collaborative collections
                                </p>
                              )}
                              {isCollaborative && (
                                <p>
                                  • Collaborators can add their own photos to
                                  the collection
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Add Photos */}
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
                    {step === "photos" && selectedPhotos.size === 0 && (
                      <p className="mb-4 text-sm text-amber-600 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        Please select at least one photo
                      </p>
                    )}

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
                              src={photo.url || "/placeholder.svg"}
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

                {/* Step 4: Collaborators */}
                {step === "collaborators" && (
                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Invite Collaborators
                      </h3>
                      <p className="text-neutral-600">
                        {isCollaborative
                          ? "Invite people to collaborate on this collection by email. They'll receive an OTP code to join."
                          : "Enable collaborative collection in the previous step to invite collaborators."}
                      </p>
                    </div>

                    {isCollaborative ? (
                      <div className="space-y-6">
                        {/* Add Collaborator */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Invite by Email
                          </label>
                          <div className="flex space-x-3">
                            <div className="flex-1 relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                              <input
                                type="email"
                                value={newCollaboratorEmail}
                                onChange={(e) =>
                                  setNewCollaboratorEmail(e.target.value)
                                }
                                onKeyPress={(e) =>
                                  e.key === "Enter" &&
                                  (e.preventDefault(), handleAddCollaborator())
                                }
                                placeholder="Enter email address"
                                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddCollaborator}
                              className="btn-primary px-4 py-2"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Collaborators List */}
                        {collaboratorEmails.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-neutral-700 mb-3">
                              Invited Collaborators ({collaboratorEmails.length}
                              )
                            </h4>
                            <div className="space-y-2">
                              {collaboratorEmails.map((email, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                      <Mail className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-neutral-900">
                                        {email}
                                      </p>
                                      <p className="text-xs text-neutral-500">
                                        Will receive invitation email
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveCollaborator(email)
                                    }
                                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Collaboration Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Send className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-800 mb-1">
                                How Collaboration Works
                              </h4>
                              <div className="text-sm text-blue-700 space-y-1">
                                <p>
                                  • Invited users receive an email with a
                                  6-digit OTP code
                                </p>
                                <p>
                                  • They can use the OTP to join as collection
                                  editors
                                </p>
                                <p>
                                  • Editors can add their own photos to the
                                  collection
                                </p>
                                <p>
                                  • You can manage collaborators anytime from
                                  the collection page
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {!isPrivate && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-green-800 mb-1">
                                  Public Collaboration
                                </h4>
                                <p className="text-sm text-green-700">
                                  Since this is a public collaborative
                                  collection, other users can also request
                                  access to collaborate. You'll receive
                                  notifications for access requests and can
                                  approve or deny them.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-neutral-500">
                        <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                        <p className="mb-2">Collaboration is disabled</p>
                        <p className="text-sm">
                          Go back to the settings step and enable "Collaborative
                          Collection" to invite collaborators.
                        </p>
                      </div>
                    )}
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
                      type="button"
                      onClick={handleFinalSubmit}
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
                      disabled={
                        (step === "details" &&
                          (!watch("title") ||
                            !!errors.title ||
                            !!errors.description)) ||
                        (step === "photos" && selectedPhotos.size === 0)
                      }
                      className={`btn-primary ${
                        (step === "details" &&
                          (!watch("title") ||
                            !!errors.title ||
                            !!errors.description)) ||
                        (step === "photos" && selectedPhotos.size === 0)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateCollectionModal;
