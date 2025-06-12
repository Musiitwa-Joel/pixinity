import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Eye,
  Calendar,
  User,
  Tag,
  Save,
  Image,
  ArrowLeft,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing posts
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    published: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, statusFilter, sortBy]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setPosts([
        {
          id: "1",
          title: "Getting Started with Pixinity",
          slug: "getting-started-with-pixinity",
          excerpt:
            "Learn how to make the most of your Pixinity account with these tips and tricks.",
          content:
            "# Getting Started with Pixinity\n\nWelcome to Pixinity! This guide will help you get started with our platform and make the most of your photography experience.\n\n## Setting Up Your Profile\n\nFirst, make sure your profile is complete. Add a profile picture, bio, and link your social media accounts.\n\n## Uploading Your First Photos\n\nTo upload photos, click the 'Upload' button in the top navigation bar. You can drag and drop multiple files at once.\n\n## Creating Collections\n\nOrganize your photos into collections to showcase your work in themed galleries.",
          coverImage:
            "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
          author: {
            id: "6",
            name: "Musiitwa Joel",
            avatar: undefined,
          },
          tags: ["tutorial", "beginners", "guide"],
          published: true,
          createdAt: "2025-06-01T10:00:00.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
        {
          id: "2",
          title: "Photography Tips for Beginners",
          slug: "photography-tips-for-beginners",
          excerpt:
            "Essential photography tips to help beginners improve their skills and take better photos.",
          content:
            "# Photography Tips for Beginners\n\nWhether you're just starting out or looking to improve your photography skills, these tips will help you take better photos.\n\n## Understanding Exposure\n\nExposure is the amount of light that reaches your camera's sensor. It's controlled by three settings: aperture, shutter speed, and ISO.\n\n## Composition Techniques\n\nLearn about the rule of thirds, leading lines, and framing to create more compelling images.\n\n## Lighting Basics\n\nGood lighting is essential for great photography. Learn how to work with natural light and when to use artificial lighting.",
          coverImage:
            "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
          author: {
            id: "6",
            name: "Musiitwa Joel",
            avatar: undefined,
          },
          tags: ["photography", "tips", "beginners"],
          published: true,
          createdAt: "2025-06-05T14:30:00.000Z",
          updatedAt: "2025-06-05T14:30:00.000Z",
        },
        {
          id: "3",
          title: "Advanced Editing Techniques",
          slug: "advanced-editing-techniques",
          excerpt:
            "Take your photo editing to the next level with these advanced techniques.",
          content:
            "# Advanced Editing Techniques\n\nOnce you've mastered the basics of photo editing, it's time to explore more advanced techniques to make your images stand out.\n\n## Color Grading\n\nLearn how to create a consistent color palette across your photos and develop your own signature style.\n\n## Frequency Separation\n\nThis technique allows you to edit the texture and color/tone of your images separately, giving you more control over your retouching process.\n\n## Compositing\n\nCombine multiple images to create surreal or impossible scenes that capture the imagination.",
          coverImage:
            "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
          author: {
            id: "7",
            name: "Manager Bollz",
            avatar:
              "/uploads/avatars/avatar-1749549001086-174615677_processed.jpeg",
          },
          tags: ["editing", "advanced", "photoshop"],
          published: false,
          createdAt: "2025-06-10T09:15:00.000Z",
          updatedAt: "2025-06-10T09:15:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let result = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isPublished = statusFilter === "published";
      result = result.filter((post) => post.published === isPublished);
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredPosts(result);
  };

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: "New Blog Post",
      slug: "new-blog-post",
      excerpt: "Write a short excerpt for your blog post here.",
      content: "# New Blog Post\n\nStart writing your content here...",
      coverImage:
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
      author: {
        id: "6", // Default to the admin user
        name: "Musiitwa Joel",
        avatar: undefined,
      },
      tags: ["draft"],
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    setCurrentPost(newPost);
    setFormData({
      title: newPost.title,
      slug: newPost.slug,
      excerpt: newPost.excerpt,
      content: newPost.content,
      coverImage: newPost.coverImage,
      tags: newPost.tags.join(", "),
      published: newPost.published,
    });
    setIsEditing(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      tags: post.tags.join(", "),
      published: post.published,
    });
    setIsEditing(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the post
      // For now, we'll simulate deleting the post

      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleTogglePublish = async (postId: string, isPublished: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the post's published status
      // For now, we'll simulate updating the status

      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                published: !isPublished,
                updatedAt: new Date().toISOString(),
              }
            : post
        )
      );
      toast.success(
        `Post ${!isPublished ? "published" : "unpublished"} successfully`
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
      toast.error("Failed to update publish status");
    }
  };

  const handleSavePost = async () => {
    if (!currentPost) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the post
      // For now, we'll simulate updating the post

      const updatedPost: BlogPost = {
        ...currentPost,
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        published: formData.published,
        updatedAt: new Date().toISOString(),
      };

      setPosts(
        posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      toast.success("Post saved successfully");
      setIsEditing(false);
      setCurrentPost(null);
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-700" />
              </button>
              <h1 className="text-3xl font-bold text-neutral-900">
                {currentPost?.id.includes("post-")
                  ? "Create New Post"
                  : "Edit Post"}
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePost}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Post</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="post-slug"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write a short excerpt..."
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Cover Image URL
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.coverImage && (
                <div className="mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="h-40 w-full object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Content (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={12}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                placeholder="Write your post content in Markdown..."
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm text-neutral-700">
                  Publish this post
                </span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Blog Management
              </h1>
              <p className="text-neutral-600">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <button
              onClick={handleCreatePost}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Posts</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>

            <button
              onClick={fetchPosts}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Blog Posts */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-4 w-20 bg-neutral-200 rounded"></div>
                      <div className="h-4 w-20 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {post.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.published
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-neutral-600 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(post.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1" />
                            <span>{post.tags.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() =>
                            handleTogglePublish(post.id, post.published)
                          }
                          className={`p-2 rounded-md ${
                            post.published
                              ? "text-green-500 hover:bg-green-50"
                              : "text-yellow-500 hover:bg-yellow-50"
                          }`}
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                          title="Edit post"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          title="Delete post"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">
                  No blog posts found
                </h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating your first blog post"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <button
                    onClick={handleCreatePost}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
