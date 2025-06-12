import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Calendar,
  Users,
  Image,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Camera,
  Save,
  Upload,
  ArrowLeft,
  Tag,
  Link as LinkIcon,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  rules: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: "draft" | "active" | "completed" | "cancelled";
  prizes: {
    first: string;
    second?: string;
    third?: string;
  };
  participantsCount: number;
  submissionsCount: number;
  viewsCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing challenges
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    rules: "",
    coverImage: "",
    startDate: "",
    endDate: "",
    status: "draft",
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
    featured: false,
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    filterChallenges();
  }, [challenges, searchQuery, statusFilter, sortBy]);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setChallenges([
        {
          id: "1",
          title: "Summer Landscapes",
          slug: "summer-landscapes-2025",
          description:
            "Capture the beauty of summer landscapes in your area. Show us the vibrant colors, warm light, and natural beauty of the season.",
          rules:
            "- Photos must be taken during summer 2025\n- Minimal editing allowed\n- Must include location information\n- One submission per participant",
          coverImage:
            "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
          startDate: "2025-06-01T00:00:00.000Z",
          endDate: "2025-07-15T23:59:59.000Z",
          status: "active",
          prizes: {
            first: "Premium Pixinity Subscription (1 year) + $500",
            second: "Premium Pixinity Subscription (6 months) + $250",
            third: "Premium Pixinity Subscription (3 months) + $100",
          },
          participantsCount: 124,
          submissionsCount: 156,
          viewsCount: 3450,
          featured: true,
          createdAt: "2025-05-15T10:00:00.000Z",
          updatedAt: "2025-06-01T08:30:00.000Z",
        },
        {
          id: "2",
          title: "Urban Architecture",
          slug: "urban-architecture-2025",
          description:
            "Showcase the most impressive urban architecture from your city. Focus on lines, symmetry, and the interplay of light and shadow.",
          rules:
            "- Must be taken in 2025\n- Both exterior and interior architecture allowed\n- HDR allowed but not required\n- Maximum 3 submissions per participant",
          coverImage:
            "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
          startDate: "2025-07-01T00:00:00.000Z",
          endDate: "2025-08-15T23:59:59.000Z",
          status: "draft",
          prizes: {
            first: "Professional Camera Lens + $300",
            second: "Photography Accessories Pack + $150",
            third: "Editing Software License",
          },
          participantsCount: 0,
          submissionsCount: 0,
          viewsCount: 1250,
          featured: false,
          createdAt: "2025-05-20T14:30:00.000Z",
          updatedAt: "2025-05-20T14:30:00.000Z",
        },
        {
          id: "3",
          title: "Wildlife Portraits",
          slug: "wildlife-portraits-2025",
          description:
            "Capture stunning portraits of wildlife in their natural habitat. Show the character and spirit of animals through your lens.",
          rules:
            "- No captive animals (zoos, etc.)\n- No baiting or disturbing wildlife\n- Must include camera settings\n- Maximum 2 submissions per participant",
          coverImage:
            "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg",
          startDate: "2025-05-01T00:00:00.000Z",
          endDate: "2025-05-31T23:59:59.000Z",
          status: "completed",
          prizes: {
            first: "Wildlife Photography Workshop + $400",
            second: "Photography Backpack + $200",
            third: "Photo Printing Voucher",
          },
          participantsCount: 89,
          submissionsCount: 142,
          viewsCount: 2780,
          featured: false,
          createdAt: "2025-04-10T09:15:00.000Z",
          updatedAt: "2025-06-02T16:45:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to load challenges");
    } finally {
      setIsLoading(false);
    }
  };

  const filterChallenges = () => {
    let result = [...challenges];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(query) ||
          challenge.description.toLowerCase().includes(query) ||
          challenge.rules.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((challenge) => challenge.status === statusFilter);
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
      case "participants":
        result.sort((a, b) => b.participantsCount - a.participantsCount);
        break;
      case "submissions":
        result.sort((a, b) => b.submissionsCount - a.submissionsCount);
        break;
      case "views":
        result.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredChallenges(result);
  };

  const handleCreateChallenge = () => {
    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: "New Photo Challenge",
      slug: "new-photo-challenge",
      description: "Write a description for your challenge here.",
      rules: "- Rule 1\n- Rule 2\n- Rule 3",
      coverImage:
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      status: "draft",
      prizes: {
        first: "First Prize",
        second: "Second Prize",
        third: "Third Prize",
      },
      participantsCount: 0,
      submissionsCount: 0,
      viewsCount: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setChallenges([newChallenge, ...challenges]);
    setCurrentChallenge(newChallenge);
    setFormData({
      title: newChallenge.title,
      slug: newChallenge.slug,
      description: newChallenge.description,
      rules: newChallenge.rules,
      coverImage: newChallenge.coverImage,
      startDate: new Date(newChallenge.startDate).toISOString().split("T")[0],
      endDate: new Date(newChallenge.endDate).toISOString().split("T")[0],
      status: newChallenge.status,
      firstPrize: newChallenge.prizes.first,
      secondPrize: newChallenge.prizes.second || "",
      thirdPrize: newChallenge.prizes.third || "",
      featured: newChallenge.featured,
    });
    setIsEditing(true);
  };

  const handleEditChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setFormData({
      title: challenge.title,
      slug: challenge.slug,
      description: challenge.description,
      rules: challenge.rules,
      coverImage: challenge.coverImage,
      startDate: new Date(challenge.startDate).toISOString().split("T")[0],
      endDate: new Date(challenge.endDate).toISOString().split("T")[0],
      status: challenge.status,
      firstPrize: challenge.prizes.first,
      secondPrize: challenge.prizes.second || "",
      thirdPrize: challenge.prizes.third || "",
      featured: challenge.featured,
    });
    setIsEditing(true);
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this challenge? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the challenge
      // For now, we'll simulate deleting the challenge

      setChallenges(
        challenges.filter((challenge) => challenge.id !== challengeId)
      );
      toast.success("Challenge deleted successfully");
    } catch (error) {
      console.error("Error deleting challenge:", error);
      toast.error("Failed to delete challenge");
    }
  };

  const handleToggleStatus = async (
    challengeId: string,
    newStatus: "draft" | "active" | "completed" | "cancelled"
  ) => {
    try {
      // In a real implementation, you would make an API call to update the challenge's status
      // For now, we'll simulate updating the status

      setChallenges(
        challenges.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : challenge
        )
      );

      toast.success(`Challenge status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update challenge status");
    }
  };

  const handleToggleFeatured = async (
    challengeId: string,
    isFeatured: boolean
  ) => {
    try {
      // In a real implementation, you would make an API call to update the challenge's featured status
      // For now, we'll simulate updating the status

      setChallenges(
        challenges.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                featured: !isFeatured,
                updatedAt: new Date().toISOString(),
              }
            : challenge
        )
      );

      toast.success(
        `Challenge ${!isFeatured ? "featured" : "unfeatured"} successfully`
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleSaveChallenge = async () => {
    if (!currentChallenge) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the challenge
      // For now, we'll simulate updating the challenge

      const updatedChallenge: Challenge = {
        ...currentChallenge,
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        rules: formData.rules,
        coverImage: formData.coverImage,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status as any,
        prizes: {
          first: formData.firstPrize,
          second: formData.secondPrize || undefined,
          third: formData.thirdPrize || undefined,
        },
        featured: formData.featured,
        updatedAt: new Date().toISOString(),
      };

      setChallenges(
        challenges.map((challenge) =>
          challenge.id === updatedChallenge.id ? updatedChallenge : challenge
        )
      );
      toast.success("Challenge saved successfully");
      setIsEditing(false);
      setCurrentChallenge(null);
    } catch (error) {
      console.error("Error saving challenge:", error);
      toast.error("Failed to save challenge");
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
            Draft
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return null;
    }
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
                {currentChallenge?.id.includes("challenge-")
                  ? "Create New Challenge"
                  : "Edit Challenge"}
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
                onClick={handleSaveChallenge}
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
                    <span>Save Challenge</span>
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
                  placeholder="Challenge title"
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
                  placeholder="challenge-slug"
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
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write a description for the challenge..."
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Rules
              </label>
              <textarea
                value={formData.rules}
                onChange={(e) =>
                  setFormData({ ...formData, rules: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List the rules for the challenge..."
              ></textarea>
              <p className="mt-1 text-xs text-neutral-500">
                Use a new line for each rule, preferably with a dash or bullet
                point
              </p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">
                Prizes
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    First Prize
                  </label>
                  <input
                    type="text"
                    value={formData.firstPrize}
                    onChange={(e) =>
                      setFormData({ ...formData, firstPrize: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., $500 + Premium Subscription"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Second Prize (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.secondPrize}
                    onChange={(e) =>
                      setFormData({ ...formData, secondPrize: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., $250 + Premium Subscription"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Third Prize (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.thirdPrize}
                    onChange={(e) =>
                      setFormData({ ...formData, thirdPrize: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., $100 + Premium Subscription"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm text-neutral-700">
                  Feature this challenge on the homepage
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
                Photo Challenges
              </h1>
              <p className="text-neutral-600">
                Create and manage photography challenges for your community
              </p>
            </div>
            <button
              onClick={handleCreateChallenge}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Challenge</span>
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
                  placeholder="Search challenges..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Challenges</option>
                <option value="draft">Drafts</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="participants">Most Participants</option>
                <option value="submissions">Most Submissions</option>
                <option value="views">Most Views</option>
              </select>
            </div>

            <button
              onClick={fetchChallenges}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Challenges List */}
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
            ) : filteredChallenges.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {filteredChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {challenge.title}
                          </h3>
                          {getStatusBadge(challenge.status)}
                          {challenge.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-600 mb-3 line-clamp-2">
                          {challenge.description}
                        </p>
                        <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(
                                challenge.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>
                              {challenge.participantsCount} participants
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Image className="h-4 w-4 mr-1" />
                            <span>
                              {challenge.submissionsCount} submissions
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{challenge.viewsCount} views</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <div className="relative">
                          <button
                            className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100"
                            title="Change status"
                          >
                            <Clock className="h-5 w-5" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-10 hidden group-hover:block">
                            {["draft", "active", "completed", "cancelled"].map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleToggleStatus(
                                      challenge.id,
                                      status as any
                                    )
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleToggleFeatured(
                              challenge.id,
                              challenge.featured
                            )
                          }
                          className={`p-2 rounded-md ${
                            challenge.featured
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-neutral-500 hover:bg-neutral-100"
                          }`}
                          title={challenge.featured ? "Unfeature" : "Feature"}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              challenge.featured ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>
                        <a
                          href={`/challenges/${challenge.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                          title="View challenge"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => handleEditChallenge(challenge)}
                          className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                          title="Edit challenge"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteChallenge(challenge.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          title="Delete challenge"
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
                <Award className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">
                  No challenges found
                </h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating your first photo challenge"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <button
                    onClick={handleCreateChallenge}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Challenge
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

export default AdminChallenges;
