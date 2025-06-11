import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Plus,
  Edit3,
  Trash2,
  Users,
  Lock,
  Globe,
  Calendar,
  Eye,
  MoreVertical,
  Grid3X3,
  List,
  Filter,
  UserPlus,
  Mail,
  Check,
  X,
  RefreshCw,
  Key,
  AlertCircle,
  Clock,
  MessageCircle,
  Send,
  Image,
  Upload,
} from "lucide-react";
import { Collection, Photo } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { collectionsService } from "../../server/services/collectionsService";
import PhotoGrid from "../components/Common/PhotoGrid";
import EditCollectionModal from "../components/Collections/EditCollectionModal";
import DeleteCollectionModal from "../components/Collections/DeleteCollectionModal";
import toast from "react-hot-toast";
import { useApp } from "../contexts/AppContext";

interface Collaborator {
  id: string;
  userId: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  verified: boolean;
  role: string | null;
  collaboratorRole: string;
  status: string;
  email: string | null;
  invitedAt: string;
  respondedAt: string | null;
}

interface JoinCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otpCode: string) => void;
  isSubmitting: boolean;
  error: string | null;
}

interface Comment {
  id: string;
  content: string;
  parentId: string | null;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    verified: boolean;
    role: string;
  };
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UploadToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  onUploadComplete: () => void;
}

const UploadToCollectionModal: React.FC<UploadToCollectionModalProps> = ({
  isOpen,
  onClose,
  collectionId,
  onUploadComplete,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    "Nature",
    "Architecture",
    "Travel",
    "Street",
    "People",
    "Abstract",
    "Food",
    "Fashion",
    "Sports",
    "Technology",
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      // Add form data
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", tags);
      formData.append("category", category);

      // Add files
      files.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await fetch(
        `http://localhost:5000/api/collection-uploads/${collectionId}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload photos");
      }

      const result = await response.json();
      toast.success(result.message);

      // Reset form and close modal
      setFiles([]);
      setTitle("");
      setDescription("");
      setTags("");
      setCategory("");
      onClose();
      onUploadComplete();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload photos");
    } finally {
      setIsUploading(false);
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
            onClick={onClose}
          />

          <motion.div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Add Photos to Collection
                </h2>
                <p className="text-neutral-600">
                  Upload your photos to contribute to this collection
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-[calc(100%-80px)]"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Upload Area */}
                  {files.length === 0 ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                        dragActive
                          ? "border-primary-500 bg-primary-50"
                          : "border-neutral-300 hover:border-primary-400"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-primary-100 rounded-full">
                          <Upload className="h-8 w-8 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                            Drop your images here
                          </h3>
                          <p className="text-neutral-600 mb-4">
                            or click to browse from your device
                          </p>
                          <label className="btn-primary cursor-pointer">
                            <Image className="mr-2 h-4 w-4" />
                            Choose Files
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <p className="text-sm text-neutral-500">
                          Supports: JPG, PNG, WebP (Max 10MB each)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-neutral-900">
                          Selected Images ({files.length})
                        </h3>
                        <label className="btn-outline cursor-pointer">
                          <Plus className="mr-2 h-4 w-4" />
                          Add More
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                                {file.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Photo Details */}
                      <div className="space-y-4 pt-4 border-t border-neutral-200 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                            placeholder="Give your photos a title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="input resize-none"
                            placeholder="Tell the story behind your photos..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Tags
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={tags}
                              onChange={(e) => setTags(e.target.value)}
                              className="input"
                              placeholder="nature, landscape, sunset"
                            />
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">
                            Separate tags with commas
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Category
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input"
                          >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-6 border-t border-neutral-200 bg-neutral-50 space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={files.length === 0 || isUploading}
                  className="btn-primary"
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload to Collection
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

const JoinCollectionModal: React.FC<JoinCollectionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
}) => {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length === 6) {
      onSubmit(otpCode);
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
            onClick={onClose}
          />

          <motion.div
            className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-3 mb-2">
                <Key className="h-5 w-5 text-primary-600" />
                <h2 className="text-xl font-bold text-neutral-900">
                  Join Collection
                </h2>
              </div>
              <p className="text-neutral-600">
                Enter the 6-digit code from your invitation email to join this
                collection as a collaborator.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  maxLength={6}
                />
                <p className="mt-2 text-xs text-neutral-500">
                  The code was sent to your email address in the invitation.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpCode.length !== 6 || isSubmitting}
                  className="flex-1 btn-primary"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    "Join Collection"
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

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { openPhotoModal } = useApp();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [activeTab, setActiveTab] = useState<
    "photos" | "collaborators" | "comments"
  >("photos");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isCollaborator, setIsCollaborator] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadCollection();
    }
  }, [id]);

  useEffect(() => {
    if (id && isAuthenticated) {
      checkMembership();
      checkLikeStatus();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (id && collection) {
      trackView();
    }
  }, [id, collection]);

  const loadCollection = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const collectionData = await collectionsService.getCollection(id);
      setCollection(collectionData);

      // Set engagement metrics
      if (collectionData.viewsCount !== undefined)
        setViewsCount(collectionData.viewsCount);
      if (collectionData.likesCount !== undefined)
        setLikesCount(collectionData.likesCount);
      if (collectionData.commentsCount !== undefined)
        setCommentsCount(collectionData.commentsCount);

      // Set collaborators
      if (collectionData.collaborators) {
        setCollaborators(collectionData.collaborators);
      }
    } catch (error: any) {
      console.error("Failed to load collection:", error);
      toast.error("Failed to load collection");
    } finally {
      setIsLoading(false);
    }
  };

  const checkMembership = async () => {
    if (!id || !isAuthenticated) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/collection-uploads/${id}/check-membership`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsMember(data.isMember);
        setIsOwner(data.isOwner);
        setIsCollaborator(data.isCollaborator);
      }
    } catch (error) {
      console.error("Failed to check membership:", error);
    }
  };

  const checkLikeStatus = async () => {
    if (!id || !isAuthenticated) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/like-status`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  const trackView = async () => {
    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/view`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interaction: "view" }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setViewsCount(data.viewsCount);
      }
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  };

  const loadCollaborators = async () => {
    if (!id || !collection) return;

    setIsLoadingCollaborators(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/collaborators`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCollaborators(data);
      } else {
        throw new Error("Failed to load collaborators");
      }
    } catch (error) {
      console.error("Failed to load collaborators:", error);
      toast.error("Failed to load collaborators");
    } finally {
      setIsLoadingCollaborators(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;

    setIsLoadingComments(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/comments`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setCommentsCount(data.total);
      } else {
        throw new Error("Failed to load comments");
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (activeTab === "collaborators" && collection?.isCollaborative) {
      loadCollaborators();
    } else if (activeTab === "comments") {
      loadComments();
    }
  }, [activeTab, collection]);

  const handleJoinCollection = async (otpCode: string) => {
    if (!id || !isAuthenticated) return;

    setIsJoining(true);
    setJoinError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ otpCode }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("You've successfully joined the collection!");
        setIsJoinModalOpen(false);

        // Update membership status
        setIsMember(true);
        setIsCollaborator(true);

        // Reload collection to update collaborator status
        loadCollection();
      } else {
        const error = await response.json();
        setJoinError(error.error || "Failed to join collection");
      }
    } catch (error: any) {
      console.error("Join collection error:", error);
      setJoinError(error.message || "Failed to join collection");
    } finally {
      setIsJoining(false);
    }
  };

  const handleResendInvitation = async (collaboratorId: string) => {
    if (!id || !collection) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/collaborators/${collaboratorId}/resend`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Invitation resent successfully");
      } else {
        throw new Error("Failed to resend invitation");
      }
    } catch (error) {
      console.error("Failed to resend invitation:", error);
      toast.error("Failed to resend invitation");
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    if (!id || !collection) return;

    if (!confirm("Are you sure you want to remove this collaborator?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/collaborators/${collaboratorId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        toast.success("Collaborator removed successfully");
        // Update collaborators list
        setCollaborators(collaborators.filter((c) => c.id !== collaboratorId));
      } else {
        throw new Error("Failed to remove collaborator");
      }
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
      toast.error("Failed to remove collaborator");
    }
  };

  const handleLikeCollection = async () => {
    if (!id || !isAuthenticated) {
      toast.error("Please sign in to like collections");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
        toast.success(data.message);
      } else {
        throw new Error("Failed to like collection");
      }
    } catch (error) {
      console.error("Like collection error:", error);
      toast.error("Failed to like collection");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !isAuthenticated || !newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ content: newComment.trim() }),
        }
      );

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
        setCommentsCount((prev) => prev + 1);
        toast.success("Comment added successfully");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to add comment");
      }
    } catch (error: any) {
      console.error("Comment submission error:", error);
      toast.error(error.message || "Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like comments");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/comments/${commentId}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Update comment likes in state
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, likesCount: data.likesCount }
              : comment
          )
        );

        toast.success(data.message);
      } else {
        throw new Error("Failed to like comment");
      }
    } catch (error) {
      console.error("Comment like error:", error);
      toast.error("Failed to like comment");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-neutral-200 rounded animate-pulse w-32 mb-4" />
            <div className="h-12 bg-neutral-200 rounded animate-pulse w-96 mb-4" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-64" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 bg-neutral-200 rounded-full mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Collection not found
          </h2>
          <p className="text-neutral-600 mb-4">
            The collection you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="btn-primary"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const canEdit = isOwner || isCollaborator;
  const canJoin =
    isAuthenticated &&
    collection.isCollaborative &&
    !isOwner &&
    !isCollaborator;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: collection.title,
        text: collection.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleCollectionUpdated = (updatedCollection: Collection) => {
    setCollection(updatedCollection);
  };

  const handleCollectionDeleted = () => {
    navigate("/collections");
  };

  const sortedPhotos = [...collection.photos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "popular":
        return b.likesCount - a.likesCount;
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/collections")}
          className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Collections</span>
        </motion.button>

        {/* Collection Header */}
        <motion.div
          className="bg-white rounded-2xl p-8 mb-8 border border-neutral-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              {/* Title and Type */}
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl font-bold text-neutral-900">
                  {collection.title}
                </h1>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    collection.isPrivate
                      ? "bg-red-100 text-red-700"
                      : collection.isCollaborative
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {collection.isPrivate ? (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Private</span>
                    </>
                  ) : collection.isCollaborative ? (
                    <>
                      <Users className="h-3 w-3" />
                      <span>Collaborative</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3" />
                      <span>Public</span>
                    </>
                  )}
                </div>

                {/* Member Badge */}
                {isCollaborator && (
                  <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    <Check className="h-3 w-3" />
                    <span>Member</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {collection.description && (
                <p className="text-lg text-neutral-600 leading-relaxed mb-6 max-w-3xl">
                  {collection.description}
                </p>
              )}

              {/* Creator Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={
                    collection.creator.avatar ||
                    `https://ui-avatars.com/api/?name=${collection.creator.firstName}+${collection.creator.lastName}&background=2563eb&color=ffffff`
                  }
                  alt={collection.creator.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-neutral-900">
                    {collection.creator.firstName} {collection.creator.lastName}
                  </p>
                  <p className="text-neutral-600">
                    @{collection.creator.username}
                  </p>
                </div>
                {!isOwner && (
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`btn ${
                      isFollowing ? "btn-outline" : "btn-primary"
                    }`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created{" "}
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{viewsCount} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                  <span>{likesCount} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{commentsCount} comments</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {canJoin && (
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="btn-primary"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Collection
                </button>
              )}

              {isMember && !isOwner && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="btn-primary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add Photos
                </button>
              )}

              <button
                onClick={handleLikeCollection}
                className={`btn ${
                  isLiked
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "btn-outline"
                }`}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                />
                {isLiked ? "Liked" : "Like"}
              </button>

              <button onClick={handleShare} className="btn-outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </button>

              {canEdit && (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="btn-outline p-3"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-10"
                    >
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Collection</span>
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Collection</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex border-b border-neutral-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "photos"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
            } transition-colors`}
          >
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Photos ({collection.photosCount})</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "comments"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
            } transition-colors`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Comments ({commentsCount})</span>
            </div>
          </button>

          {collection.isCollaborative && (
            <button
              onClick={() => setActiveTab("collaborators")}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === "collaborators"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
              } transition-colors`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Collaborators ({collaborators.length})</span>
              </div>
            </button>
          )}
        </motion.div>

        {/* Photos Section */}
        {activeTab === "photos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Photos Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Photos ({collection.photosCount})
                </h2>
                <p className="text-neutral-600">
                  {collection.photosCount === 0
                    ? "No photos in this collection yet"
                    : `Explore ${collection.photosCount} amazing photos`}
                </p>
              </div>

              {collection.photosCount > 0 && (
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary-500 text-white"
                          : "text-neutral-500 hover:text-primary-500"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list"
                          ? "bg-primary-500 text-white"
                          : "text-neutral-500 hover:text-primary-500"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Photos Grid */}
            {collection.photosCount > 0 ? (
              <PhotoGrid photos={sortedPhotos} loading={false} />
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="h-16 w-16 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No photos yet
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {canEdit
                      ? "Start adding photos to this collection to bring it to life."
                      : "This collection doesn't have any photos yet."}
                  </p>
                  {canEdit && (
                    <button
                      onClick={() =>
                        isOwner
                          ? setIsEditModalOpen(true)
                          : setIsUploadModalOpen(true)
                      }
                      className="btn-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Photos
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Comments Section */}
        {activeTab === "comments" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Comments
                </h2>
                <p className="text-neutral-600">
                  Join the conversation about this collection
                </p>
              </div>

              {/* Add Comment Form */}
              {isAuthenticated && (
                <div className="p-6 border-b border-neutral-200">
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="flex space-x-4">
                      <img
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563eb&color=ffffff`
                        }
                        alt="Your avatar"
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full p-3 border border-neutral-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmittingComment}
                        className="btn-primary"
                      >
                        {isSubmittingComment ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Posting...
                          </div>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Comments List */}
              <div className="divide-y divide-neutral-100">
                {isLoadingComments ? (
                  <div className="p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-6">
                      <div className="flex space-x-4">
                        <img
                          src={
                            comment.user.avatar ||
                            `https://ui-avatars.com/api/?name=${comment.user.firstName}+${comment.user.lastName}&background=2563eb&color=ffffff`
                          }
                          alt={comment.user.username}
                          className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-neutral-900">
                              {comment.user.firstName} {comment.user.lastName}
                            </span>
                            <span className="text-sm text-neutral-500">
                              @{comment.user.username}
                            </span>
                            <span className="text-xs text-neutral-400">
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-neutral-700 mb-3">
                            {comment.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className="flex items-center space-x-1 text-neutral-500 hover:text-red-500 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              <span>{comment.likesCount}</span>
                            </button>
                            {comment.repliesCount > 0 && (
                              <button className="text-neutral-500 hover:text-primary-500 transition-colors">
                                {comment.repliesCount} replies
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">
                      No comments yet
                    </h3>
                    <p className="text-neutral-600 max-w-md mx-auto">
                      Be the first to share your thoughts about this collection
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Collaborators Section */}
        {activeTab === "collaborators" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Collaborators
                </h2>
                <p className="text-neutral-600">
                  People who can contribute to this collection
                </p>
              </div>

              {isLoadingCollaborators ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : collaborators.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {/* Collection Owner */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          collection.creator.avatar ||
                          `https://ui-avatars.com/api/?name=${collection.creator.firstName}+${collection.creator.lastName}&background=2563eb&color=ffffff`
                        }
                        alt={collection.creator.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">
                          {collection.creator.firstName}{" "}
                          {collection.creator.lastName}
                        </p>
                        <p className="text-sm text-neutral-500">
                          @{collection.creator.username}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Owner
                    </span>
                  </div>

                  {/* Collaborators */}
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {collaborator.userId ? (
                          <img
                            src={
                              collaborator.avatar ||
                              `https://ui-avatars.com/api/?name=${collaborator.firstName}+${collaborator.lastName}&background=2563eb&color=ffffff`
                            }
                            alt={collaborator.username || ""}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-neutral-500" />
                          </div>
                        )}
                        <div>
                          {collaborator.userId ? (
                            <>
                              <p className="font-medium text-neutral-900">
                                {collaborator.firstName} {collaborator.lastName}
                              </p>
                              <p className="text-sm text-neutral-500">
                                @{collaborator.username}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-neutral-900">
                                {collaborator.email}
                              </p>
                              <p className="text-sm text-neutral-500">
                                Invited user
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(collaborator.status)}

                        {isOwner && (
                          <div className="flex space-x-1">
                            {collaborator.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleResendInvitation(collaborator.id)
                                }
                                className="p-1 text-neutral-500 hover:text-primary-600 transition-colors"
                                title="Resend invitation"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleRemoveCollaborator(collaborator.id)
                              }
                              className="p-1 text-neutral-500 hover:text-red-600 transition-colors"
                              title="Remove collaborator"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No collaborators yet
                  </h3>
                  <p className="text-neutral-600 max-w-md mx-auto mb-6">
                    {isOwner
                      ? "Invite others to collaborate on this collection. They'll be able to add their photos and help curate the collection."
                      : "This collection doesn't have any collaborators yet."}
                  </p>
                  {isOwner && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="btn-primary"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Collaborators
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <EditCollectionModal
        isOpen={isEditModalOpen}
        collection={collection}
        onClose={() => setIsEditModalOpen(false)}
        onCollectionUpdated={handleCollectionUpdated}
      />

      <DeleteCollectionModal
        isOpen={isDeleteModalOpen}
        collection={collection}
        onClose={() => setIsDeleteModalOpen(false)}
        onCollectionDeleted={handleCollectionDeleted}
      />

      <JoinCollectionModal
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setJoinError(null);
        }}
        onSubmit={handleJoinCollection}
        isSubmitting={isJoining}
        error={joinError}
      />

      <UploadToCollectionModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        collectionId={id || ""}
        onUploadComplete={() => loadCollection()}
      />
    </div>
  );
};

export default CollectionDetailPage;
