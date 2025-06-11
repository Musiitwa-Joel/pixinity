import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Heart,
  Bookmark,
  Share2,
  Eye,
  Calendar,
  Camera,
  MapPin,
  Tag,
  User,
  ExternalLink,
  MessageCircle,
  Send,
  MoreVertical,
} from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

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

const PhotoModal: React.FC = () => {
  const {
    isPhotoModalOpen,
    selectedPhoto,
    closePhotoModal,
    toggleSave,
    savedPhotos,
  } = useApp();
  const { isAuthenticated, user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [downloadsCount, setDownloadsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [hasTrackedModalView, setHasTrackedModalView] = useState(false);

  const isSaved = selectedPhoto ? savedPhotos.has(selectedPhoto.id) : false;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePhotoModal();
      }
    };

    if (isPhotoModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isPhotoModalOpen, closePhotoModal]);

  useEffect(() => {
    if (selectedPhoto && isPhotoModalOpen) {
      setLikesCount(selectedPhoto.likesCount);
      setDownloadsCount(selectedPhoto.downloadsCount);
      setViewsCount(selectedPhoto.viewsCount);
      setHasTrackedModalView(false);
      checkLikeStatus();
      loadComments();

      // Track modal view after a short delay
      setTimeout(() => {
        if (!hasTrackedModalView) {
          trackView("modal_open");
          setHasTrackedModalView(true);
        }
      }, 500);
    }
  }, [selectedPhoto, isPhotoModalOpen, isAuthenticated]);

  // Track view function
  const trackView = async (interaction: string) => {
    if (!selectedPhoto) return;

    try {
      console.log(
        `🔍 Tracking ${interaction} view for photo ${selectedPhoto.id}`
      );

      const response = await fetch(
        `http://localhost:5000/api/photos/${selectedPhoto.id}/view`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interaction,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setViewsCount(data.viewsCount);
        console.log(
          `✅ ${interaction} view tracked. New count: ${data.viewsCount}`
        );
      }
    } catch (error) {
      console.error(`Failed to track ${interaction} view:`, error);
    }
  };

  const checkLikeStatus = async () => {
    if (!selectedPhoto || !isAuthenticated) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${selectedPhoto.id}/like-status`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  const loadComments = async () => {
    if (!selectedPhoto) return;

    setIsLoadingComments(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${selectedPhoto.id}/comments`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const loadReplies = async (commentId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/comments/${commentId}/replies`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReplies((prev) => ({ ...prev, [commentId]: data.replies }));
        setExpandedReplies((prev) => new Set([...prev, commentId]));
      }
    } catch (error) {
      console.error("Failed to load replies:", error);
    }
  };

  const handleLike = async () => {
    if (!selectedPhoto || !isAuthenticated) {
      toast.error("Please sign in to like photos");
      return;
    }

    // Track interaction
    trackView("like_interaction");

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${selectedPhoto.id}/like`,
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
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Failed to like photo");
    }
  };

  const handleSave = () => {
    if (!selectedPhoto || !isAuthenticated) {
      toast.error("Please sign in to save photos");
      return;
    }

    // Track interaction
    trackView("save_interaction");
    toggleSave(selectedPhoto.id);
  };

  const handleDownload = async () => {
    if (!selectedPhoto) return;

    // Track interaction
    trackView("download_interaction");

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${selectedPhoto.id}/download`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDownloadsCount(data.downloadsCount);

        // Create download link
        const link = document.createElement("a");
        link.href = selectedPhoto.url;
        link.download = `${selectedPhoto.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Photo downloaded successfully!");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photo");
    }
  };

  const handleShare = () => {
    if (!selectedPhoto) return;

    // Track interaction
    trackView("share_interaction");

    if (navigator.share) {
      navigator.share({
        title: selectedPhoto.title,
        text: selectedPhoto.description,
        url: window.location.origin + `/photos/${selectedPhoto.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/photos/${selectedPhoto.id}`
      );
      toast.success("Link copied to clipboard");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhoto || !isAuthenticated) return;

    const content = replyTo ? replyContent : newComment;
    if (!content.trim()) return;

    // Track interaction
    trackView("comment_interaction");

    console.log("🚀 Submitting comment:", {
      photoId: selectedPhoto.id,
      content: content.trim(),
      parentId: replyTo,
      userId: user?.id,
    });

    setIsSubmittingComment(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${selectedPhoto.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content: content.trim(),
            parentId: replyTo,
          }),
        }
      );

      console.log("📡 Comment response status:", response.status);

      if (response.ok) {
        const newCommentData = await response.json();
        console.log("✅ Comment created:", newCommentData);

        if (replyTo) {
          // Add to replies
          setReplies((prev) => ({
            ...prev,
            [replyTo]: [...(prev[replyTo] || []), newCommentData],
          }));
          setReplyContent("");
          setReplyTo(null);
          toast.success("Reply added successfully!");
        } else {
          // Add to main comments
          setComments((prev) => [newCommentData, ...prev]);
          setNewComment("");
          toast.success("Comment added successfully!");
        }
      } else {
        const errorData = await response.json();
        console.error("❌ Comment error response:", errorData);
        throw new Error(errorData.error || "Failed to add comment");
      }
    } catch (error: any) {
      console.error("❌ Comment submission error:", error);
      toast.error(error.message || "Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like comments");
      return;
    }

    // Track interaction
    trackView("comment_like_interaction");

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/comments/${commentId}/like`,
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

        // Update reply likes in state
        setReplies((prev) => {
          const newReplies = { ...prev };
          Object.keys(newReplies).forEach((parentId) => {
            newReplies[parentId] = newReplies[parentId].map((reply) =>
              reply.id === commentId
                ? { ...reply, likesCount: data.likesCount }
                : reply
            );
          });
          return newReplies;
        });

        toast.success(data.message);
      }
    } catch (error) {
      console.error("Comment like error:", error);
      toast.error("Failed to like comment");
    }
  };

  if (!selectedPhoto) return null;

  return (
    <AnimatePresence>
      {isPhotoModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePhotoModal}
          />

          {/* Modal Content */}
          <motion.div
            className="relative max-w-7xl max-h-full w-full flex bg-white rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={closePhotoModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Section */}
            <div className="flex-1 relative bg-neutral-100 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info Panel */}
            <div className="w-96 bg-white flex flex-col max-h-full">
              {/* Header */}
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    to={`/@${selectedPhoto.photographer.username}`}
                    className="flex items-center space-x-3 group"
                    onClick={() => trackView("photographer_click")}
                  >
                    <img
                      src={
                        selectedPhoto.photographer.avatar ||
                        `https://ui-avatars.com/api/?name=${selectedPhoto.photographer.firstName}+${selectedPhoto.photographer.lastName}&background=2563eb&color=ffffff`
                      }
                      alt={selectedPhoto.photographer.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {selectedPhoto.photographer.firstName}{" "}
                        {selectedPhoto.photographer.lastName}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        @{selectedPhoto.photographer.username}
                      </p>
                    </div>
                  </Link>

                  <button className="btn-outline text-sm">Follow</button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {isAuthenticated && (
                    <>
                      <button
                        onClick={handleLike}
                        className={`flex-1 btn ${
                          isLiked
                            ? "bg-error-500 text-white hover:bg-error-600"
                            : "btn-outline"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 mr-2 ${
                            isLiked ? "fill-current" : ""
                          }`}
                        />
                        {isLiked ? "Liked" : "Like"}
                      </button>
                      <button
                        onClick={handleSave}
                        className={`flex-1 btn ${
                          isSaved
                            ? "bg-primary-500 text-white hover:bg-primary-600"
                            : "btn-outline"
                        }`}
                      >
                        <Bookmark
                          className={`h-4 w-4 mr-2 ${
                            isSaved ? "fill-current" : ""
                          }`}
                        />
                        {isSaved ? "Saved" : "Save"}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 btn-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button onClick={handleShare} className="btn-outline px-3">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Photo Info */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Title & Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                      {selectedPhoto.title}
                    </h2>
                    {selectedPhoto.description && (
                      <p className="text-neutral-600 leading-relaxed">
                        {selectedPhoto.description}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-neutral-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {viewsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {likesCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Download className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {downloadsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Downloads</div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <MessageCircle className="h-5 w-5 text-neutral-400" />
                      <span className="text-lg font-semibold text-neutral-900">
                        Comments
                      </span>
                      <span className="text-sm text-neutral-500">
                        ({comments.length})
                      </span>
                    </div>

                    {/* Add Comment Form */}
                    {isAuthenticated && (
                      <form onSubmit={handleSubmitComment} className="mb-6">
                        <div className="flex space-x-3">
                          <img
                            src={
                              user?.avatar ||
                              `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563eb&color=ffffff`
                            }
                            alt="Your avatar"
                            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="w-full p-3 border border-neutral-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              rows={3}
                              maxLength={1000}
                            />
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-neutral-500">
                                {newComment.length}/1000
                              </span>
                              <button
                                type="submit"
                                disabled={
                                  !newComment.trim() || isSubmittingComment
                                }
                                className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                              >
                                {isSubmittingComment ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Posting...
                                  </div>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {isLoadingComments ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                        </div>
                      ) : comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="space-y-3">
                            {/* Main Comment */}
                            <div className="flex space-x-3">
                              <img
                                src={
                                  comment.user.avatar ||
                                  `https://ui-avatars.com/api/?name=${comment.user.firstName}+${comment.user.lastName}&background=2563eb&color=ffffff`
                                }
                                alt={comment.user.username}
                                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="bg-neutral-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-neutral-900">
                                      {comment.user.firstName}{" "}
                                      {comment.user.lastName}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                      @{comment.user.username}
                                    </span>
                                    {comment.user.verified && (
                                      <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-neutral-700">
                                    {comment.content}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500">
                                  <span>
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleCommentLike(comment.id)
                                    }
                                    className="flex items-center space-x-1 hover:text-error-500 transition-colors"
                                  >
                                    <Heart className="h-3 w-3" />
                                    <span>{comment.likesCount}</span>
                                  </button>
                                  {isAuthenticated && (
                                    <button
                                      onClick={() => setReplyTo(comment.id)}
                                      className="hover:text-primary-500 transition-colors"
                                    >
                                      Reply
                                    </button>
                                  )}
                                  {comment.repliesCount > 0 && (
                                    <button
                                      onClick={() => loadReplies(comment.id)}
                                      className="hover:text-primary-500 transition-colors"
                                    >
                                      {expandedReplies.has(comment.id)
                                        ? "Hide"
                                        : "Show"}{" "}
                                      {comment.repliesCount} replies
                                    </button>
                                  )}
                                </div>

                                {/* Reply Form */}
                                {replyTo === comment.id && (
                                  <form
                                    onSubmit={handleSubmitComment}
                                    className="mt-3"
                                  >
                                    <div className="flex space-x-2">
                                      <img
                                        src={
                                          user?.avatar ||
                                          `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563eb&color=ffffff`
                                        }
                                        alt="Your avatar"
                                        className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                                      />
                                      <div className="flex-1">
                                        <input
                                          type="text"
                                          value={replyContent}
                                          onChange={(e) =>
                                            setReplyContent(e.target.value)
                                          }
                                          placeholder={`Reply to ${comment.user.firstName}...`}
                                          className="w-full p-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                          maxLength={1000}
                                        />
                                        <div className="flex items-center justify-end space-x-2 mt-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setReplyTo(null);
                                              setReplyContent("");
                                            }}
                                            className="text-xs text-neutral-500 hover:text-neutral-700"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            type="submit"
                                            disabled={
                                              !replyContent.trim() ||
                                              isSubmittingComment
                                            }
                                            className="btn-primary text-xs px-3 py-1 disabled:opacity-50"
                                          >
                                            Reply
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                )}

                                {/* Replies */}
                                {expandedReplies.has(comment.id) &&
                                  replies[comment.id] && (
                                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-neutral-100">
                                      {replies[comment.id].map((reply) => (
                                        <div
                                          key={reply.id}
                                          className="flex space-x-3"
                                        >
                                          <img
                                            src={
                                              reply.user.avatar ||
                                              `https://ui-avatars.com/api/?name=${reply.user.firstName}+${reply.user.lastName}&background=2563eb&color=ffffff`
                                            }
                                            alt={reply.user.username}
                                            className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                                          />
                                          <div className="flex-1">
                                            <div className="bg-neutral-50 rounded-lg p-2">
                                              <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-medium text-neutral-900 text-sm">
                                                  {reply.user.firstName}{" "}
                                                  {reply.user.lastName}
                                                </span>
                                                <span className="text-xs text-neutral-500">
                                                  @{reply.user.username}
                                                </span>
                                              </div>
                                              <p className="text-neutral-700 text-sm">
                                                {reply.content}
                                              </p>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-1 text-xs text-neutral-500">
                                              <span>
                                                {new Date(
                                                  reply.createdAt
                                                ).toLocaleDateString()}
                                              </span>
                                              <button
                                                onClick={() =>
                                                  handleCommentLike(reply.id)
                                                }
                                                className="flex items-center space-x-1 hover:text-error-500 transition-colors"
                                              >
                                                <Heart className="h-3 w-3" />
                                                <span>{reply.likesCount}</span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-neutral-500">
                          <MessageCircle className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                          <p>No comments yet</p>
                          <p className="text-sm">
                            Be the first to share your thoughts!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedPhoto.tags.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Tag className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700">
                          Tags
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700 cursor-pointer transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EXIF Data */}
                  {selectedPhoto.exifData && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Camera className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700">
                          Camera Info
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {selectedPhoto.exifData.camera && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Camera</span>
                            <span className="text-neutral-900">
                              {selectedPhoto.exifData.camera}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exifData.lens && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Lens</span>
                            <span className="text-neutral-900">
                              {selectedPhoto.exifData.lens}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exifData.focalLength && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">
                              Focal Length
                            </span>
                            <span className="text-neutral-900">
                              {selectedPhoto.exifData.focalLength}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exifData.aperture && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Aperture</span>
                            <span className="text-neutral-900">
                              {selectedPhoto.exifData.aperture}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exifData.shutterSpeed && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Shutter</span>
                            <span className="text-neutral-900">
                              {selectedPhoto.exifData.shutterSpeed}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.exifData.iso && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">ISO</span>
                            <span className="text-neutral-900">
                              {selectedPhoto.exifData.iso}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date & Location */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600">
                        Published{" "}
                        {new Date(selectedPhoto.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {selectedPhoto.exifData?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          {selectedPhoto.exifData.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* License */}
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium text-neutral-700">
                        License:{" "}
                      </span>
                      <span className="text-neutral-600">
                        {selectedPhoto.license === "free" && "Free to use"}
                        {selectedPhoto.license === "cc0" && "CC0 Public Domain"}
                        {selectedPhoto.license === "attribution" &&
                          "Attribution Required"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
