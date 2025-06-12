import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Camera,
  CheckCircle,
  XCircle,
  Shield,
  RefreshCw,
  Eye,
  Star,
  Award,
  TrendingUp,
  Image,
  Heart,
  Download,
  Mail,
  ExternalLink,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

interface Photographer {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    behance?: string;
    dribbble?: string;
  };
  verified: boolean;
  featured: boolean;
  role: string;
  followersCount: number;
  followingCount: number;
  uploadsCount: number;
  totalViews: number;
  totalLikes: number;
  totalDownloads: number;
  createdAt: string;
  updatedAt: string;
}

const AdminPhotographers: React.FC = () => {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState<
    Photographer[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("followers");
  const [selectedPhotographer, setSelectedPhotographer] =
    useState<Photographer | null>(null);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [featuredReason, setFeaturedReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPhotographers();
  }, []);

  useEffect(() => {
    filterPhotographers();
  }, [photographers, searchQuery, statusFilter, sortBy]);

  const fetchPhotographers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setPhotographers([
        {
          id: "6",
          username: "joelmusiitwa",
          firstName: "Musiitwa",
          lastName: "Joel",
          email: "musiitwajoel@gmail.com",
          role: "admin",
          verified: true,
          featured: true,
          followersCount: 1,
          followingCount: 0,
          uploadsCount: 2,
          totalViews: 95,
          totalLikes: 42,
          totalDownloads: 2,
          bio: "Admin and photographer with a passion for landscape photography",
          location: "Kampala, Uganda",
          website: "https://joelmusiitwa.com",
          socialLinks: {
            instagram: "joelmusiitwa",
            twitter: "joelmusiitwa",
          },
          createdAt: "2025-06-08T16:43:42.000Z",
          updatedAt: "2025-06-11T13:46:33.000Z",
        },
        {
          id: "7",
          username: "managerbollz",
          firstName: "Manager",
          lastName: "Bollz",
          email: "managerbollz@gmail.com",
          avatar:
            "/uploads/avatars/avatar-1749549001086-174615677_processed.jpeg",
          role: "company",
          verified: false,
          featured: false,
          followersCount: 1,
          followingCount: 1,
          uploadsCount: 3,
          totalViews: 119,
          totalLikes: 35,
          totalDownloads: 5,
          bio: "Professional photographer specializing in portrait and event photography",
          location: "Entebbe, Uganda",
          website: "https://managerbollz.com",
          socialLinks: {
            instagram: "managerbollz",
          },
          createdAt: "2025-06-08T21:20:33.000Z",
          updatedAt: "2025-06-11T09:19:33.000Z",
        },
        {
          id: "8",
          username: "Joel_nkumba",
          firstName: "Joel",
          lastName: "Musiitwa",
          email: "jmusiitwa.std@nkumbauniversity.ac.ug",
          role: "company",
          verified: false,
          featured: false,
          followersCount: 1,
          followingCount: 2,
          uploadsCount: 4,
          totalViews: 116,
          totalLikes: 28,
          totalDownloads: 1,
          bio: "Student photographer exploring urban landscapes and architecture",
          location: "Kampala, Uganda",
          website: "https://joelnkumba.com",
          socialLinks: {
            instagram: "joel_nkumba",
            twitter: "joel_nkumba",
          },
          createdAt: "2025-06-09T07:36:26.000Z",
          updatedAt: "2025-06-11T10:57:20.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching photographers:", error);
      toast.error("Failed to load photographers");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPhotographers = () => {
    let result = [...photographers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (photographer) =>
          photographer.username.toLowerCase().includes(query) ||
          photographer.email.toLowerCase().includes(query) ||
          `${photographer.firstName} ${photographer.lastName}`
            .toLowerCase()
            .includes(query) ||
          photographer.location?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        result = result.filter((photographer) => photographer.verified);
      } else if (statusFilter === "unverified") {
        result = result.filter((photographer) => !photographer.verified);
      } else if (statusFilter === "featured") {
        result = result.filter((photographer) => photographer.featured);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "followers":
        result.sort((a, b) => b.followersCount - a.followersCount);
        break;
      case "uploads":
        result.sort((a, b) => b.uploadsCount - a.uploadsCount);
        break;
      case "views":
        result.sort((a, b) => b.totalViews - a.totalViews);
        break;
      case "downloads":
        result.sort((a, b) => b.totalDownloads - a.totalDownloads);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      default:
        result.sort((a, b) => b.followersCount - a.followersCount);
    }

    setFilteredPhotographers(result);
  };

  const handleToggleVerified = async (photographer: Photographer) => {
    try {
      // In a real implementation, you would make an API call to update the photographer's verification status
      // For now, we'll simulate updating the status

      setPhotographers(
        photographers.map((p) =>
          p.id === photographer.id ? { ...p, verified: !p.verified } : p
        )
      );

      toast.success(
        `${photographer.firstName} ${photographer.lastName} is now ${
          !photographer.verified ? "verified" : "unverified"
        }`
      );
    } catch (error) {
      console.error("Error toggling verification status:", error);
      toast.error("Failed to update verification status");
    }
  };

  const handleToggleFeatured = async (photographer: Photographer) => {
    if (photographer.featured) {
      // If already featured, just remove featured status
      try {
        setPhotographers(
          photographers.map((p) =>
            p.id === photographer.id ? { ...p, featured: false } : p
          )
        );

        toast.success(
          `${photographer.firstName} ${photographer.lastName} is no longer featured`
        );
      } catch (error) {
        console.error("Error removing featured status:", error);
        toast.error("Failed to update featured status");
      }
    } else {
      // If not featured, show modal to add featured reason
      setSelectedPhotographer(photographer);
      setShowFeaturedModal(true);
    }
  };

  const handleSubmitFeatured = async () => {
    if (!selectedPhotographer) return;

    setIsProcessing(true);
    try {
      // In a real implementation, you would make an API call to update the photographer's featured status
      // For now, we'll simulate updating the status

      setPhotographers(
        photographers.map((p) =>
          p.id === selectedPhotographer.id ? { ...p, featured: true } : p
        )
      );

      toast.success(
        `${selectedPhotographer.firstName} ${selectedPhotographer.lastName} is now featured`
      );
      setShowFeaturedModal(false);
      setFeaturedReason("");
    } catch (error) {
      console.error("Error setting featured status:", error);
      toast.error("Failed to update featured status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePhotographer = async (photographerId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this photographer? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the photographer
      // For now, we'll simulate deleting the photographer

      setPhotographers(photographers.filter((p) => p.id !== photographerId));
      toast.success("Photographer deleted successfully");
    } catch (error) {
      console.error("Error deleting photographer:", error);
      toast.error("Failed to delete photographer");
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Photographer Management
        </h1>
        <p className="text-neutral-600">
          Manage photographers, verify accounts, and feature top creators
        </p>
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
              placeholder="Search photographers..."
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Photographers</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
            <option value="featured">Featured</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="followers">Most Followers</option>
            <option value="uploads">Most Uploads</option>
            <option value="views">Most Views</option>
            <option value="downloads">Most Downloads</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <button
          onClick={fetchPhotographers}
          className="btn-outline flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Photographers",
            value: photographers.length,
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-100",
          },
          {
            title: "Verified Photographers",
            value: photographers.filter((p) => p.verified).length,
            icon: CheckCircle,
            color: "text-green-500",
            bgColor: "bg-green-100",
          },
          {
            title: "Featured Photographers",
            value: photographers.filter((p) => p.featured).length,
            icon: Star,
            color: "text-amber-500",
            bgColor: "bg-amber-100",
          },
          {
            title: "Total Uploads",
            value: photographers.reduce((sum, p) => sum + p.uploadsCount, 0),
            icon: Image,
            color: "text-purple-500",
            bgColor: "bg-purple-100",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600">{stat.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photographers Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Photographer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Stats
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-neutral-200 animate-pulse"></div>
                        <div className="ml-4">
                          <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
                          <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mt-2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPhotographers.length > 0 ? (
                filteredPhotographers.map((photographer) => (
                  <tr key={photographer.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              photographer.avatar ||
                              `https://ui-avatars.com/api/?name=${photographer.firstName}+${photographer.lastName}&background=2563eb&color=ffffff`
                            }
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {photographer.firstName} {photographer.lastName}
                          </div>
                          <div className="text-sm text-neutral-500">
                            @{photographer.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <Image className="h-4 w-4 mr-1 text-neutral-400" />
                          <span>{photographer.uploadsCount}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-neutral-400" />
                          <span>{photographer.followersCount}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-neutral-400" />
                          <span>{photographer.totalViews}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            photographer.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {photographer.verified ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              Unverified
                            </>
                          )}
                        </span>
                        {photographer.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <Star className="mr-1 h-3 w-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {photographer.location || "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(photographer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleVerified(photographer)}
                          className={`${
                            photographer.verified
                              ? "text-green-600 hover:text-green-900"
                              : "text-yellow-600 hover:text-yellow-900"
                          }`}
                          title={
                            photographer.verified
                              ? "Remove verification"
                              : "Verify photographer"
                          }
                        >
                          {photographer.verified ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(photographer)}
                          className={`${
                            photographer.featured
                              ? "text-amber-600 hover:text-amber-900"
                              : "text-neutral-600 hover:text-neutral-900"
                          }`}
                          title={
                            photographer.featured
                              ? "Remove from featured"
                              : "Feature photographer"
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${
                              photographer.featured ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleSendEmail(photographer.email)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Send email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <a
                          href={`/@${photographer.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900"
                          title="View profile"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() =>
                            handleDeletePhotographer(photographer.id)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Delete photographer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-neutral-500"
                  >
                    No photographers found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Photographer Modal */}
      {showFeaturedModal && selectedPhotographer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowFeaturedModal(false)}
            >
              <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Feature Photographer
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        You're about to feature{" "}
                        <span className="font-medium text-neutral-900">
                          {selectedPhotographer.firstName}{" "}
                          {selectedPhotographer.lastName}
                        </span>
                        . Featured photographers appear on the homepage and
                        receive a badge on their profile.
                      </p>
                      <div className="mt-4">
                        <label
                          htmlFor="featured-reason"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Reason for featuring (optional)
                        </label>
                        <textarea
                          id="featured-reason"
                          value={featuredReason}
                          onChange={(e) => setFeaturedReason(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="e.g., Outstanding landscape photography, Consistent high-quality uploads"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmitFeatured}
                  disabled={isProcessing}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Feature Photographer"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowFeaturedModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPhotographers;
