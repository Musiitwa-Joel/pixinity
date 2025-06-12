import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  FileText,
  FolderPlus,
  Folder,
  Star,
  Calendar,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface HelpCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
  isVisible: boolean;
  articlesCount: number;
}

interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  isVisible: boolean;
  isFeatured: boolean;
  viewsCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

const AdminHelpCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"categories" | "articles">(
    "categories"
  );
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<HelpCategory[]>(
    []
  );
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<HelpArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories();
    } else {
      fetchArticles();
    }
  }, [activeTab]);

  useEffect(() => {
    filterItems();
  }, [
    categories,
    articles,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortBy,
    activeTab,
  ]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setCategories([
        {
          id: "1",
          name: "Getting Started",
          slug: "getting-started",
          description: "Learn the basics of using Pixinity",
          icon: "rocket",
          order: 1,
          isVisible: true,
          articlesCount: 5,
        },
        {
          id: "2",
          name: "Account Management",
          slug: "account-management",
          description: "Manage your account settings and preferences",
          icon: "user",
          order: 2,
          isVisible: true,
          articlesCount: 8,
        },
        {
          id: "3",
          name: "Uploading Photos",
          slug: "uploading-photos",
          description: "Learn how to upload and manage your photos",
          icon: "upload",
          order: 3,
          isVisible: true,
          articlesCount: 6,
        },
        {
          id: "4",
          name: "Collections",
          slug: "collections",
          description: "Create and manage your photo collections",
          icon: "grid",
          order: 4,
          isVisible: true,
          articlesCount: 4,
        },
        {
          id: "5",
          name: "Licensing & Rights",
          slug: "licensing-rights",
          description: "Understand photo licensing and usage rights",
          icon: "shield",
          order: 5,
          isVisible: true,
          articlesCount: 7,
        },
        {
          id: "6",
          name: "API Documentation",
          slug: "api-documentation",
          description: "Technical documentation for developers",
          icon: "code",
          order: 6,
          isVisible: false,
          articlesCount: 3,
        },
      ]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load help categories");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setArticles([
        {
          id: "1",
          title: "How to Create an Account",
          slug: "how-to-create-account",
          content:
            "# Creating Your Pixinity Account\n\nWelcome to Pixinity! This guide will walk you through the process of creating your account.\n\n## Step 1: Visit the Sign Up Page\n\nGo to [pixinity.com/signup](https://pixinity.com/signup) or click the \"Sign Up\" button in the top right corner of the homepage.\n\n## Step 2: Enter Your Information\n\nFill out the registration form with your:\n- Email address\n- Username\n- Password\n- First and last name\n\n## Step 3: Choose Your Account Type\n\nSelect whether you're signing up as a photographer or a company.\n\n## Step 4: Verify Your Email\n\nCheck your inbox for a verification email from Pixinity and click the verification link.\n\n## Step 5: Complete Your Profile\n\nAfter verifying your email, you'll be prompted to complete your profile by adding:\n- Profile picture\n- Bio\n- Location\n- Social media links (optional)\n\nAnd that's it! You're now ready to start using Pixinity.",
          categoryId: "1",
          isVisible: true,
          isFeatured: true,
          viewsCount: 1245,
          helpfulCount: 98,
          notHelpfulCount: 3,
          lastUpdated: "2025-06-01T10:00:00.000Z",
          createdAt: "2025-06-01T10:00:00.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
        {
          id: "2",
          title: "How to Upload Photos",
          slug: "how-to-upload-photos",
          content:
            '# Uploading Photos to Pixinity\n\nThis guide will show you how to upload your photos to Pixinity.\n\n## Supported File Types\n\nPixinity supports the following file formats:\n- JPEG/JPG\n- PNG\n- WebP\n- HEIC\n\nMaximum file size: 50MB per photo\n\n## Step 1: Navigate to Upload\n\nClick the "Upload" button in the top navigation bar.\n\n## Step 2: Select Photos\n\nYou can upload photos in two ways:\n- Drag and drop files into the upload area\n- Click "Browse" to select files from your device\n\n## Step 3: Add Details\n\nFor each photo, you can add:\n- Title\n- Description\n- Tags (helps with discoverability)\n- Category\n- License type\n\n## Step 4: Publish\n\nClick "Upload" to publish your photos immediately, or "Save as Draft" to finish later.\n\n## Bulk Uploading\n\nYou can upload up to 50 photos at once. When bulk uploading, you can apply the same details to all photos or edit them individually.',
          categoryId: "3",
          isVisible: true,
          isFeatured: true,
          viewsCount: 2356,
          helpfulCount: 145,
          notHelpfulCount: 7,
          lastUpdated: "2025-06-05T14:30:00.000Z",
          createdAt: "2025-06-05T14:30:00.000Z",
          updatedAt: "2025-06-05T14:30:00.000Z",
        },
        {
          id: "3",
          title: "Understanding Photo Licenses",
          slug: "understanding-photo-licenses",
          content:
            '# Understanding Photo Licenses on Pixinity\n\nThis guide explains the different license types available on Pixinity and how they work.\n\n## License Types\n\n### Free License\n\nThe Free License allows users to:\n- Use photos for personal and commercial projects\n- Modify photos as needed\n- Use photos worldwide\n\nRequirements:\n- Attribution to the photographer and Pixinity is required\n\nRestrictions:\n- Cannot resell the photo as-is\n- Cannot claim ownership of the photo\n\n### CC0 (Public Domain)\n\nCC0 photos have no copyright restrictions:\n- No attribution required\n- Complete freedom to use, modify, and distribute\n- Can be used for any purpose, including commercial\n\n### Premium License\n\nThe Premium License provides extended rights:\n- All the rights of the Free License\n- No attribution required\n- Exclusive usage options\n- Legal indemnification\n\n## Choosing the Right License\n\nWhen uploading photos, you can select which license to apply. Consider:\n- How you want your work to be used\n- Whether you require attribution\n- If you want to allow commercial use\n\n## Using Licensed Photos\n\nWhen downloading photos, always check the license type and follow its requirements. When attribution is required, include:\n- Photographer\'s name\n- Link to their Pixinity profile\n- Mention of Pixinity\n\nExample: "Photo by [Photographer Name] on Pixinity"',
          categoryId: "5",
          isVisible: true,
          isFeatured: false,
          viewsCount: 1876,
          helpfulCount: 132,
          notHelpfulCount: 5,
          lastUpdated: "2025-05-20T09:15:00.000Z",
          createdAt: "2025-05-20T09:15:00.000Z",
          updatedAt: "2025-05-20T09:15:00.000Z",
        },
        {
          id: "4",
          title: "API Authentication",
          slug: "api-authentication",
          content:
            '# API Authentication\n\nThis guide explains how to authenticate with the Pixinity API.\n\n## Obtaining an API Key\n\nTo use the Pixinity API, you need an API key. To get one:\n\n1. Log in to your Pixinity account\n2. Go to Settings > Developer\n3. Click "Create New API Key"\n4. Name your key and select the permissions you need\n5. Copy your API key (it will only be shown once)\n\n## Authentication Methods\n\n### Bearer Token\n\nThe preferred method is to use your API key as a bearer token in the Authorization header:\n\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n### Query Parameter\n\nAlternatively, you can pass your API key as a query parameter:\n\n```\nhttps://api.pixinity.com/v1/photos?api_key=YOUR_API_KEY\n```\n\n## Rate Limits\n\nAPI requests are subject to the following rate limits:\n\n- Free accounts: 1,000 requests per day\n- Pro accounts: 10,000 requests per day\n- Business accounts: 100,000 requests per day\n\nIf you exceed your rate limit, you\'ll receive a 429 Too Many Requests response.\n\n## Best Practices\n\n- Never expose your API key in client-side code\n- Rotate your API keys periodically\n- Only request the permissions you need\n- Handle rate limit errors gracefully',
          categoryId: "6",
          isVisible: false,
          isFeatured: false,
          viewsCount: 567,
          helpfulCount: 45,
          notHelpfulCount: 2,
          lastUpdated: "2025-04-15T11:30:00.000Z",
          createdAt: "2025-04-15T11:30:00.000Z",
          updatedAt: "2025-04-15T11:30:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to load help articles");
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (activeTab === "categories") {
      let result = [...categories];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (category) =>
            category.name.toLowerCase().includes(query) ||
            category.description.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        if (statusFilter === "visible") {
          result = result.filter((category) => category.isVisible);
        } else if (statusFilter === "hidden") {
          result = result.filter((category) => !category.isVisible);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "articles":
          result.sort((a, b) => b.articlesCount - a.articlesCount);
          break;
        default: // order
          result.sort((a, b) => a.order - b.order);
      }

      setFilteredCategories(result);
    } else if (activeTab === "articles") {
      let result = [...articles];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (categoryFilter !== "all") {
        result = result.filter(
          (article) => article.categoryId === categoryFilter
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        if (statusFilter === "visible") {
          result = result.filter((article) => article.isVisible);
        } else if (statusFilter === "hidden") {
          result = result.filter((article) => !article.isVisible);
        } else if (statusFilter === "featured") {
          result = result.filter((article) => article.isFeatured);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "oldest":
          result.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "title-asc":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title-desc":
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "views":
          result.sort((a, b) => b.viewsCount - a.viewsCount);
          break;
        case "helpful":
          result.sort((a, b) => b.helpfulCount - a.helpfulCount);
          break;
        default: // newest
          result.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }

      setFilteredArticles(result);
    }
  };

  const handleCreateCategory = () => {
    const newCategory: HelpCategory = {
      id: `category-${Date.now()}`,
      name: "New Category",
      slug: "new-category",
      description: "Description of the new category",
      icon: "folder",
      order: categories.length + 1,
      isVisible: false,
      articlesCount: 0,
    };

    setCategories([...categories, newCategory]);
    setCurrentItem(newCategory);
    setFormData({
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description,
      icon: newCategory.icon,
      isVisible: newCategory.isVisible,
    });
    setIsEditing(true);
  };

  const handleCreateArticle = () => {
    const newArticle: HelpArticle = {
      id: `article-${Date.now()}`,
      title: "New Help Article",
      slug: "new-help-article",
      content:
        "# New Help Article\n\nWrite your article content here using Markdown formatting.\n\n## Section 1\n\nThis is the first section of your article.\n\n## Section 2\n\nThis is the second section of your article.",
      categoryId:
        categoryFilter !== "all" ? categoryFilter : categories[0]?.id || "",
      isVisible: false,
      isFeatured: false,
      viewsCount: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setArticles([newArticle, ...articles]);
    setCurrentItem(newArticle);
    setFormData({
      title: newArticle.title,
      slug: newArticle.slug,
      content: newArticle.content,
      categoryId: newArticle.categoryId,
      isVisible: newArticle.isVisible,
      isFeatured: newArticle.isFeatured,
    });
    setIsEditing(true);
  };

  const handleEditCategory = (category: HelpCategory) => {
    setCurrentItem(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      isVisible: category.isVisible,
    });
    setIsEditing(true);
  };

  const handleEditArticle = (article: HelpArticle) => {
    setCurrentItem(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      categoryId: article.categoryId,
      isVisible: article.isVisible,
      isFeatured: article.isFeatured,
    });
    setIsEditing(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? All articles in this category will be orphaned."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the category
      // For now, we'll simulate deleting the category

      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the article
      // For now, we'll simulate deleting the article

      setArticles(articles.filter((article) => article.id !== articleId));
      toast.success("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    }
  };

  const handleToggleVisibility = async (
    id: string,
    isVisible: boolean,
    type: "category" | "article"
  ) => {
    try {
      // In a real implementation, you would make an API call to update the visibility
      // For now, we'll simulate updating the visibility

      if (type === "category") {
        setCategories(
          categories.map((category) =>
            category.id === id
              ? { ...category, isVisible: !isVisible }
              : category
          )
        );
      } else {
        setArticles(
          articles.map((article) =>
            article.id === id ? { ...article, isVisible: !isVisible } : article
          )
        );
      }

      toast.success(
        `${type === "category" ? "Category" : "Article"} ${
          !isVisible ? "published" : "hidden"
        } successfully`
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const handleToggleFeatured = async (
    articleId: string,
    isFeatured: boolean
  ) => {
    try {
      // In a real implementation, you would make an API call to update the featured status
      // For now, we'll simulate updating the featured status

      setArticles(
        articles.map((article) =>
          article.id === articleId
            ? { ...article, isFeatured: !isFeatured }
            : article
        )
      );

      toast.success(
        `Article ${!isFeatured ? "featured" : "unfeatured"} successfully`
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleMoveCategory = (categoryId: string, direction: "up" | "down") => {
    const categoryIndex = categories.findIndex((c) => c.id === categoryId);
    if (
      (direction === "up" && categoryIndex === 0) ||
      (direction === "down" && categoryIndex === categories.length - 1)
    ) {
      return;
    }

    const newCategories = [...categories];
    const targetIndex =
      direction === "up" ? categoryIndex - 1 : categoryIndex + 1;

    // Swap the categories
    [newCategories[categoryIndex], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[categoryIndex],
    ];

    // Update order values
    newCategories.forEach((category, index) => {
      category.order = index + 1;
    });

    setCategories(newCategories);
  };

  const handleSaveCategory = async () => {
    if (!currentItem) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the category
      // For now, we'll simulate updating the category

      const updatedCategory: HelpCategory = {
        ...currentItem,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        icon: formData.icon,
        isVisible: formData.isVisible,
      };

      setCategories(
        categories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        )
      );
      toast.success("Category saved successfully");
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!currentItem) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the article
      // For now, we'll simulate updating the article

      const updatedArticle: HelpArticle = {
        ...currentItem,
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        categoryId: formData.categoryId,
        isVisible: formData.isVisible,
        isFeatured: formData.isFeatured,
        lastUpdated: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setArticles(
        articles.map((article) =>
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );
      toast.success("Article saved successfully");
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
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
                {activeTab === "categories"
                  ? currentItem?.id.includes("category-")
                    ? "Create New Category"
                    : "Edit Category"
                  : currentItem?.id.includes("article-")
                  ? "Create New Article"
                  : "Edit Article"}
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
                onClick={
                  activeTab === "categories"
                    ? handleSaveCategory
                    : handleSaveArticle
                }
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
                    <span>
                      Save {activeTab === "categories" ? "Category" : "Article"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {activeTab === "categories" && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Getting Started"
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
                    placeholder="e.g., getting-started"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe what this category covers..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="folder">Folder</option>
                  <option value="rocket">Rocket</option>
                  <option value="user">User</option>
                  <option value="upload">Upload</option>
                  <option value="grid">Grid</option>
                  <option value="shield">Shield</option>
                  <option value="code">Code</option>
                  <option value="settings">Settings</option>
                  <option value="help-circle">Help Circle</option>
                  <option value="message-circle">Message Circle</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) =>
                      setFormData({ ...formData, isVisible: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <span className="ml-2 text-sm text-neutral-700">
                    Visible (published to help center)
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "articles" && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Article Title
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
                    placeholder="e.g., How to Create an Account"
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
                    placeholder="e.g., how-to-create-account"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                  rows={15}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  placeholder="Write your article content in Markdown format..."
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Use Markdown for formatting. # for headings, * for lists, **
                  for bold, etc.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVisible"
                    checked={formData.isVisible}
                    onChange={(e) =>
                      setFormData({ ...formData, isVisible: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor="isVisible"
                    className="ml-2 block text-sm text-neutral-900"
                  >
                    Visible (published to help center)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 block text-sm text-neutral-900"
                  >
                    Featured (highlighted in help center)
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Help Center Management
              </h1>
              <p className="text-neutral-600">
                Create and manage help center categories and articles
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("categories")}
                className={`btn ${
                  activeTab === "categories" ? "btn-primary" : "btn-outline"
                }`}
              >
                <Folder className="mr-2 h-4 w-4" />
                Categories
              </button>
              <button
                onClick={() => setActiveTab("articles")}
                className={`btn ${
                  activeTab === "articles" ? "btn-primary" : "btn-outline"
                }`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Articles
              </button>
              <button
                onClick={
                  activeTab === "categories"
                    ? handleCreateCategory
                    : handleCreateArticle
                }
                className="btn-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create {activeTab === "categories" ? "Category" : "Article"}
              </button>
            </div>
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
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                />
              </div>

              {/* Category Filter (for articles) */}
              {activeTab === "articles" && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                {activeTab === "articles" && (
                  <option value="featured">Featured</option>
                )}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {activeTab === "categories" ? (
                  <>
                    <option value="order">Order</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="articles">Most Articles</option>
                  </>
                ) : (
                  <>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                    <option value="views">Most Views</option>
                    <option value="helpful">Most Helpful</option>
                  </>
                )}
              </select>
            </div>

            <button
              onClick={
                activeTab === "categories" ? fetchCategories : fetchArticles
              }
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Categories List */}
          {activeTab === "categories" && (
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
              ) : filteredCategories.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {category.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                category.isVisible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {category.isVisible ? "Visible" : "Hidden"}
                            </span>
                          </div>
                          <p className="text-neutral-600 mb-3">
                            {category.description}
                          </p>
                          <div className="flex items-center text-sm text-neutral-500 space-x-4">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              <span>{category.articlesCount} articles</span>
                            </div>
                            <div className="flex items-center">
                              <LinkIcon className="h-4 w-4 mr-1" />
                              <span>/help/{category.slug}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() =>
                              handleMoveCategory(category.id, "up")
                            }
                            disabled={category.order === 1}
                            className={`p-2 rounded-md ${
                              category.order === 1
                                ? "text-neutral-300 cursor-not-allowed"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleMoveCategory(category.id, "down")
                            }
                            disabled={category.order === categories.length}
                            className={`p-2 rounded-md ${
                              category.order === categories.length
                                ? "text-neutral-300 cursor-not-allowed"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleVisibility(
                                category.id,
                                category.isVisible,
                                "category"
                              )
                            }
                            className={`p-2 rounded-md ${
                              category.isVisible
                                ? "text-green-500 hover:bg-green-50"
                                : "text-yellow-500 hover:bg-yellow-50"
                            }`}
                            title={
                              category.isVisible
                                ? "Hide category"
                                : "Show category"
                            }
                          >
                            {category.isVisible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="Edit category"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Folder className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    No categories found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by creating your first help category"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <button
                      onClick={handleCreateCategory}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create First Category
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Articles List */}
          {activeTab === "articles" && (
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
              ) : filteredArticles.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {article.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                article.isVisible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {article.isVisible ? "Visible" : "Hidden"}
                            </span>
                            {article.isFeatured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {article.content
                              .replace(/#+\s|[*_`]/g, "")
                              .substring(0, 150)}
                            ...
                          </p>
                          <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                            <div className="flex items-center">
                              <Folder className="h-4 w-4 mr-1" />
                              <span>
                                {categories.find(
                                  (c) => c.id === article.categoryId
                                )?.name || "Uncategorized"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                Updated:{" "}
                                {new Date(
                                  article.lastUpdated
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{article.viewsCount} views</span>
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{article.helpfulCount} helpful</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() =>
                              handleToggleVisibility(
                                article.id,
                                article.isVisible,
                                "article"
                              )
                            }
                            className={`p-2 rounded-md ${
                              article.isVisible
                                ? "text-green-500 hover:bg-green-50"
                                : "text-yellow-500 hover:bg-yellow-50"
                            }`}
                            title={
                              article.isVisible
                                ? "Hide article"
                                : "Show article"
                            }
                          >
                            {article.isVisible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleToggleFeatured(
                                article.id,
                                article.isFeatured
                              )
                            }
                            className={`p-2 rounded-md ${
                              article.isFeatured
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                            title={article.isFeatured ? "Unfeature" : "Feature"}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                article.isFeatured ? "fill-amber-500" : ""
                              }`}
                            />
                          </button>
                          <a
                            href={`/help/${
                              categories.find(
                                (c) => c.id === article.categoryId
                              )?.slug || "category"
                            }/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="View article"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="Edit article"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete article"
                          >
                            <Trash2 className="h-4 w-4" />
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
                    No articles found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery ||
                    categoryFilter !== "all" ||
                    statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by creating your first help article"}
                  </p>
                  {!searchQuery &&
                    categoryFilter === "all" &&
                    statusFilter === "all" && (
                      <button
                        onClick={handleCreateArticle}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Article
                      </button>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminHelpCenter;
