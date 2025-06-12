import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  MessageCircle,
  User,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Pin,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
  category: string;
  tags: string[];
  status: "open" | "closed" | "locked" | "hidden";
  isPinned: boolean;
  isAnnouncement: boolean;
  repliesCount: number;
  viewsCount: number;
  likesCount: number;
  lastReplyAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
  };
  isAnswer: boolean;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: string;
  type: "topic" | "reply" | "user";
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  reporter: {
    id: string;
    username: string;
  };
  targetId: string;
  targetTitle?: string;
  createdAt: string;
}

const AdminCommunity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"topics" | "reports">("topics");
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<ForumTopic[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [topicReplies, setTopicReplies] = useState<ForumReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportDetails, setReportDetails] = useState<any>(null);
  const [isLoadingReportDetails, setIsLoadingReportDetails] = useState(false);
  const [moderationNote, setModerationNote] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    if (activeTab === "topics") {
      fetchTopics();
    } else {
      fetchReports();
    }
  }, [activeTab]);

  useEffect(() => {
    filterTopics();
  }, [topics, searchQuery, categoryFilter, statusFilter, sortBy]);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery, statusFilter]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setTopics([
        {
          id: "1",
          title: "Tips for landscape photography in low light",
          content:
            "I've been struggling with capturing good landscape photos during golden hour and blue hour. What settings and techniques do you recommend for low light landscape photography?",
          author: {
            id: "6",
            username: "joelmusiitwa",
            firstName: "Musiitwa",
            lastName: "Joel",
            role: "admin",
          },
          category: "Photography Tips",
          tags: ["landscape", "low light", "golden hour", "techniques"],
          status: "open",
          isPinned: true,
          isAnnouncement: false,
          repliesCount: 12,
          viewsCount: 345,
          likesCount: 28,
          lastReplyAt: "2025-06-10T14:23:00.000Z",
          createdAt: "2025-06-05T09:15:00.000Z",
          updatedAt: "2025-06-10T14:23:00.000Z",
        },
        {
          id: "2",
          title: "Community Guidelines - Please Read Before Posting",
          content:
            "Welcome to the Pixinity Community Forum! This is a place for photographers to connect, share knowledge, and help each other grow. To ensure a positive experience for everyone, please follow these guidelines...",
          author: {
            id: "6",
            username: "joelmusiitwa",
            firstName: "Musiitwa",
            lastName: "Joel",
            role: "admin",
          },
          category: "Announcements",
          tags: ["guidelines", "rules", "community"],
          status: "locked",
          isPinned: true,
          isAnnouncement: true,
          repliesCount: 0,
          viewsCount: 1250,
          likesCount: 156,
          lastReplyAt: "2025-06-01T10:00:00.000Z",
          createdAt: "2025-06-01T10:00:00.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
        {
          id: "3",
          title: "What's your favorite portrait lens?",
          content:
            "I'm looking to invest in a good portrait lens. Currently shooting on a Sony A7IV. What are your recommendations for portrait photography?",
          author: {
            id: "7",
            username: "managerbollz",
            firstName: "Manager",
            lastName: "Bollz",
            avatar:
              "/uploads/avatars/avatar-1749549001086-174615677_processed.jpeg",
            role: "company",
          },
          category: "Gear Discussion",
          tags: ["portrait", "lens", "sony", "equipment"],
          status: "open",
          isPinned: false,
          isAnnouncement: false,
          repliesCount: 24,
          viewsCount: 412,
          likesCount: 18,
          lastReplyAt: "2025-06-11T08:45:00.000Z",
          createdAt: "2025-06-08T16:30:00.000Z",
          updatedAt: "2025-06-11T08:45:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching topics:", error);
      toast.error("Failed to load forum topics");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setReports([
        {
          id: "1",
          type: "topic",
          reason: "Spam content promoting external website",
          status: "pending",
          reporter: {
            id: "8",
            username: "Joel_nkumba",
          },
          targetId: "4",
          targetTitle: "Check out my new photography website!",
          createdAt: "2025-06-10T15:30:00.000Z",
        },
        {
          id: "2",
          type: "reply",
          reason: "Offensive language and personal attacks",
          status: "pending",
          reporter: {
            id: "7",
            username: "managerbollz",
          },
          targetId: "15",
          targetTitle: "Re: Best camera for beginners",
          createdAt: "2025-06-11T09:45:00.000Z",
        },
        {
          id: "3",
          type: "user",
          reason: "Repeatedly posting inappropriate content",
          status: "resolved",
          reporter: {
            id: "6",
            username: "joelmusiitwa",
          },
          targetId: "12",
          targetTitle: "User: spammer123",
          createdAt: "2025-06-09T11:20:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load community reports");
    } finally {
      setIsLoading(false);
    }
  };

  const filterTopics = () => {
    let result = [...topics];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.content.toLowerCase().includes(query) ||
          topic.author.username.toLowerCase().includes(query) ||
          topic.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((topic) => topic.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((topic) => topic.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "most-replies":
        result.sort((a, b) => b.repliesCount - a.repliesCount);
        break;
      case "most-views":
        result.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      case "most-likes":
        result.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case "recently-active":
        result.sort(
          (a, b) =>
            new Date(b.lastReplyAt).getTime() -
            new Date(a.lastReplyAt).getTime()
        );
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    // Always put pinned topics at the top
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    setFilteredTopics(result);
  };

  const filterReports = () => {
    let result = [...reports];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (report) =>
          report.reason.toLowerCase().includes(query) ||
          report.reporter.username.toLowerCase().includes(query) ||
          (report.targetTitle &&
            report.targetTitle.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((report) => report.status === statusFilter);
    }

    // Sort by newest first
    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredReports(result);
  };

  const fetchTopicReplies = async (topicId: string) => {
    setIsLoadingReplies(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setTopicReplies([
        {
          id: "1",
          content:
            "I've found that using a tripod is essential for low light landscape photography. Also, don't be afraid to bump up your ISO a bit - modern cameras handle noise pretty well.",
          author: {
            id: "7",
            username: "managerbollz",
            firstName: "Manager",
            lastName: "Bollz",
            avatar:
              "/uploads/avatars/avatar-1749549001086-174615677_processed.jpeg",
            role: "company",
          },
          isAnswer: true,
          likesCount: 15,
          createdAt: "2025-06-05T10:30:00.000Z",
          updatedAt: "2025-06-05T10:30:00.000Z",
        },
        {
          id: "2",
          content:
            "I agree with @managerbollz about the tripod. Additionally, I recommend shooting in RAW format to give yourself more flexibility in post-processing, especially for recovering shadow details.",
          author: {
            id: "8",
            username: "Joel_nkumba",
            firstName: "Joel",
            lastName: "Musiitwa",
            role: "company",
          },
          isAnswer: false,
          likesCount: 8,
          createdAt: "2025-06-05T11:45:00.000Z",
          updatedAt: "2025-06-05T11:45:00.000Z",
        },
        {
          id: "3",
          content:
            "Thanks for the tips! I've been using a tripod but still struggling with getting sharp images. What aperture do you typically use for landscapes in low light?",
          author: {
            id: "6",
            username: "joelmusiitwa",
            firstName: "Musiitwa",
            lastName: "Joel",
            role: "admin",
          },
          isAnswer: false,
          likesCount: 3,
          createdAt: "2025-06-05T14:20:00.000Z",
          updatedAt: "2025-06-05T14:20:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching topic replies:", error);
      toast.error("Failed to load replies");
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const fetchReportDetails = async (report: Report) => {
    setIsLoadingReportDetails(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      if (report.type === "topic") {
        setReportDetails({
          type: "topic",
          content: {
            id: report.targetId,
            title: "Check out my new photography website!",
            content:
              "Hey everyone! I just launched my new photography website with my portfolio and services. Check it out at www.spammysite.com and use code PIXEL50 for 50% off my presets!",
            author: {
              id: "12",
              username: "spammer123",
              firstName: "John",
              lastName: "Doe",
            },
            createdAt: "2025-06-10T14:30:00.000Z",
          },
        });
      } else if (report.type === "reply") {
        setReportDetails({
          type: "reply",
          content: {
            id: report.targetId,
            content:
              "This is such a stupid question. Only an amateur would ask something so basic. Go read a book before wasting everyone's time here.",
            author: {
              id: "15",
              username: "rudeperson",
              firstName: "Rude",
              lastName: "Person",
            },
            topicId: "8",
            topicTitle: "Best camera for beginners",
            createdAt: "2025-06-11T09:30:00.000Z",
          },
        });
      } else if (report.type === "user") {
        setReportDetails({
          type: "user",
          content: {
            id: report.targetId,
            username: "spammer123",
            firstName: "John",
            lastName: "Doe",
            email: "spammer@example.com",
            joinDate: "2025-06-01T10:00:00.000Z",
            postCount: 15,
            replyCount: 32,
            previousReports: 3,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
      toast.error("Failed to load report details");
    } finally {
      setIsLoadingReportDetails(false);
    }
  };

  const handleViewTopic = (topic: ForumTopic) => {
    setSelectedTopic(topic);
    fetchTopicReplies(topic.id);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    fetchReportDetails(report);
  };

  const handleTogglePinned = async (topicId: string, isPinned: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the topic's pinned status
      // For now, we'll simulate updating the status

      setTopics(
        topics.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                isPinned: !isPinned,
                updatedAt: new Date().toISOString(),
              }
            : topic
        )
      );

      toast.success(`Topic ${!isPinned ? "pinned" : "unpinned"} successfully`);
    } catch (error) {
      console.error("Error toggling pinned status:", error);
      toast.error("Failed to update pinned status");
    }
  };

  const handleToggleStatus = async (
    topicId: string,
    newStatus: "open" | "closed" | "locked" | "hidden"
  ) => {
    try {
      // In a real implementation, you would make an API call to update the topic's status
      // For now, we'll simulate updating the status

      setTopics(
        topics.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : topic
        )
      );

      toast.success(`Topic status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating topic status:", error);
      toast.error("Failed to update topic status");
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this topic? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the topic
      // For now, we'll simulate deleting the topic

      setTopics(topics.filter((topic) => topic.id !== topicId));
      toast.success("Topic deleted successfully");
    } catch (error) {
      console.error("Error deleting topic:", error);
      toast.error("Failed to delete topic");
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this reply? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the reply
      // For now, we'll simulate deleting the reply

      setTopicReplies(topicReplies.filter((reply) => reply.id !== replyId));
      toast.success("Reply deleted successfully");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply");
    }
  };

  const handleMarkAsAnswer = async (replyId: string, isAnswer: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the reply's answer status
      // For now, we'll simulate updating the status

      setTopicReplies(
        topicReplies.map((reply) =>
          reply.id === replyId ? { ...reply, isAnswer: !isAnswer } : reply
        )
      );

      toast.success(
        `Reply ${!isAnswer ? "marked as answer" : "unmarked as answer"}`
      );
    } catch (error) {
      console.error("Error updating answer status:", error);
      toast.error("Failed to update answer status");
    }
  };

  const handleResolveReport = async () => {
    if (!selectedReport) return;

    setIsSubmittingAction(true);
    try {
      // In a real implementation, you would make an API call to resolve the report
      // For now, we'll simulate resolving the report

      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, status: "resolved" }
            : report
        )
      );

      toast.success("Report resolved successfully");
      setSelectedReport(null);
      setReportDetails(null);
      setModerationNote("");
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error("Failed to resolve report");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleDismissReport = async () => {
    if (!selectedReport) return;

    setIsSubmittingAction(true);
    try {
      // In a real implementation, you would make an API call to dismiss the report
      // For now, we'll simulate dismissing the report

      setReports(
        reports.map((report) =>
          report.id === selectedReport.id
            ? { ...report, status: "dismissed" }
            : report
        )
      );

      toast.success("Report dismissed");
      setSelectedReport(null);
      setReportDetails(null);
      setModerationNote("");
    } catch (error) {
      console.error("Error dismissing report:", error);
      toast.error("Failed to dismiss report");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Open
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Closed
          </span>
        );
      case "locked":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Locked
          </span>
        );
      case "hidden":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Hidden
          </span>
        );
      default:
        return null;
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Pending
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Resolved
          </span>
        );
      case "dismissed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "topic":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "reply":
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case "user":
        return <User className="h-5 w-5 text-red-500" />;
      default:
        return <Flag className="h-5 w-5 text-neutral-500" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Community Forum
        </h1>
        <p className="text-neutral-600">
          Manage forum topics, moderate discussions, and handle reports
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6">
        <button
          onClick={() => setActiveTab("topics")}
          className={`px-6 py-3 font-medium text-sm focus:outline-none ${
            activeTab === "topics"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Forum Topics</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-6 py-3 font-medium text-sm focus:outline-none ${
            activeTab === "reports"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Flag className="h-5 w-5" />
            <span>Reports</span>
            {reports.filter((r) => r.status === "pending").length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {reports.filter((r) => r.status === "pending").length}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Topics Tab */}
      {activeTab === "topics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topics List */}
          <div className={`lg:col-span-${selectedTopic ? "1" : "3"}`}>
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
                    placeholder="Search topics..."
                    className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Photography Tips">Photography Tips</option>
                  <option value="Gear Discussion">Gear Discussion</option>
                  <option value="Announcements">Announcements</option>
                  <option value="General Discussion">General Discussion</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="locked">Locked</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-replies">Most Replies</option>
                  <option value="most-views">Most Views</option>
                  <option value="most-likes">Most Likes</option>
                  <option value="recently-active">Recently Active</option>
                </select>

                <button
                  onClick={fetchTopics}
                  className="btn-outline flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Topics List */}
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
              ) : filteredTopics.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`p-6 cursor-pointer hover:bg-neutral-50 transition-colors ${
                        selectedTopic?.id === topic.id ? "bg-primary-50" : ""
                      }`}
                      onClick={() => handleViewTopic(topic)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {topic.isPinned && (
                              <Pin className="h-4 w-4 text-primary-500" />
                            )}
                            {topic.isAnnouncement && (
                              <Shield className="h-4 w-4 text-purple-500" />
                            )}
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {topic.title}
                            </h3>
                            {getStatusBadge(topic.status)}
                          </div>
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {topic.content}
                          </p>
                          <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{topic.author.username}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(topic.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              <span>{topic.repliesCount} replies</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{topic.viewsCount} views</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePinned(topic.id, topic.isPinned);
                            }}
                            className={`p-2 rounded-md ${
                              topic.isPinned
                                ? "text-primary-500 hover:bg-primary-50"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                            title={topic.isPinned ? "Unpin topic" : "Pin topic"}
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                          <div className="relative group">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md"
                              title="Change status"
                            >
                              <Clock className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-10 hidden group-hover:block">
                              {["open", "closed", "locked", "hidden"].map(
                                (status) => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStatus(
                                        topic.id,
                                        status as any
                                      );
                                    }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTopic(topic.id);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete topic"
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
                  <MessageSquare className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    No topics found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery ||
                    categoryFilter !== "all" ||
                    statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "There are no forum topics yet"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Topic Details */}
          {selectedTopic && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {selectedTopic.isPinned && (
                      <Pin className="h-5 w-5 text-primary-500" />
                    )}
                    {selectedTopic.isAnnouncement && (
                      <Shield className="h-5 w-5 text-purple-500" />
                    )}
                    <h2 className="text-xl font-bold text-neutral-900">
                      {selectedTopic.title}
                    </h2>
                    {getStatusBadge(selectedTopic.status)}
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{selectedTopic.author.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(selectedTopic.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-neutral-100 rounded-md">
                    {selectedTopic.category}
                  </div>
                </div>

                <div className="prose max-w-none mb-4">
                  <p>{selectedTopic.content}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedTopic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1 text-neutral-400" />
                      <span className="text-sm text-neutral-500">
                        {selectedTopic.likesCount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1 text-neutral-400" />
                      <span className="text-sm text-neutral-500">
                        {selectedTopic.repliesCount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-neutral-400" />
                      <span className="text-sm text-neutral-500">
                        {selectedTopic.viewsCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleTogglePinned(
                          selectedTopic.id,
                          selectedTopic.isPinned
                        )
                      }
                      className={`p-2 rounded-md ${
                        selectedTopic.isPinned
                          ? "text-primary-500 hover:bg-primary-50"
                          : "text-neutral-500 hover:bg-neutral-100"
                      }`}
                      title={
                        selectedTopic.isPinned ? "Unpin topic" : "Pin topic"
                      }
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <div className="relative group">
                      <button
                        className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-md"
                        title="Change status"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-10 hidden group-hover:block">
                        {["open", "closed", "locked", "hidden"].map(
                          (status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleToggleStatus(
                                  selectedTopic.id,
                                  status as any
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTopic(selectedTopic.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      title="Delete topic"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Replies ({selectedTopic.repliesCount})
                </h3>

                {isLoadingReplies ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-start space-x-4">
                          <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : topicReplies.length > 0 ? (
                  <div className="space-y-6">
                    {topicReplies.map((reply) => (
                      <div
                        key={reply.id}
                        className="border border-neutral-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            <img
                              src={
                                reply.author.avatar ||
                                `https://ui-avatars.com/api/?name=${reply.author.firstName}+${reply.author.lastName}&background=2563eb&color=ffffff`
                              }
                              alt={reply.author.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-neutral-900">
                                  {reply.author.firstName}{" "}
                                  {reply.author.lastName}
                                </span>
                                <span className="text-sm text-neutral-500">
                                  @{reply.author.username}
                                </span>
                                {reply.isAnswer && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Answer
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {new Date(reply.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleMarkAsAnswer(reply.id, reply.isAnswer)
                              }
                              className={`p-1 rounded-md ${
                                reply.isAnswer
                                  ? "text-green-500 hover:bg-green-50"
                                  : "text-neutral-400 hover:bg-neutral-100"
                              }`}
                              title={
                                reply.isAnswer
                                  ? "Unmark as answer"
                                  : "Mark as answer"
                              }
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReply(reply.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                              title="Delete reply"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="prose max-w-none">
                          <p>{reply.content}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-2 border-t border-neutral-100">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1 text-neutral-400" />
                            <span className="text-sm text-neutral-500">
                              {reply.likesCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500">No replies yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className={`lg:col-span-${selectedReport ? "1" : "3"}`}>
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
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <button
                onClick={fetchReports}
                className="btn-outline flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Reports List */}
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
              ) : filteredReports.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-6 cursor-pointer hover:bg-neutral-50 transition-colors ${
                        selectedReport?.id === report.id ? "bg-primary-50" : ""
                      }`}
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getReportTypeIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900 truncate">
                              {report.targetTitle ||
                                `${
                                  report.type.charAt(0).toUpperCase() +
                                  report.type.slice(1)
                                } Report`}
                            </h3>
                            {getReportStatusBadge(report.status)}
                          </div>
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {report.reason}
                          </p>
                          <div className="flex items-center text-sm text-neutral-500 space-x-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>
                                Reported by: {report.reporter.username}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(
                                  report.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Flag className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    No reports found
                  </h3>
                  <p className="text-neutral-500">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "There are no community reports to review"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Report Details */}
          {selectedReport && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getReportTypeIcon(selectedReport.type)}
                    <h2 className="text-xl font-bold text-neutral-900">
                      {selectedReport.type.charAt(0).toUpperCase() +
                        selectedReport.type.slice(1)}{" "}
                      Report
                    </h2>
                    {getReportStatusBadge(selectedReport.status)}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      setReportDetails(null);
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">
                        Report Reason
                      </h3>
                      <p className="text-neutral-700">
                        {selectedReport.reason}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Reported by: {selectedReport.reporter.username}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Reported Content
                </h3>

                {isLoadingReportDetails ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-neutral-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                  </div>
                ) : reportDetails ? (
                  <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                    {reportDetails.type === "topic" && (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-neutral-900">
                            {reportDetails.content.title}
                          </h4>
                          <span className="text-sm text-neutral-500">
                            {new Date(
                              reportDetails.content.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-neutral-700 mb-3">
                          {reportDetails.content.content}
                        </p>
                        <div className="text-sm text-neutral-500">
                          Posted by: {reportDetails.content.author.username}
                        </div>
                      </>
                    )}

                    {reportDetails.type === "reply" && (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-neutral-900">
                            Re: {reportDetails.content.topicTitle}
                          </h4>
                          <span className="text-sm text-neutral-500">
                            {new Date(
                              reportDetails.content.createdAt
                            ).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-neutral-700 mb-3">
                          {reportDetails.content.content}
                        </p>
                        <div className="text-sm text-neutral-500">
                          Posted by: {reportDetails.content.author.username}
                        </div>
                      </>
                    )}

                    {reportDetails.type === "user" && (
                      <>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 bg-neutral-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-900">
                              {reportDetails.content.firstName}{" "}
                              {reportDetails.content.lastName}
                            </h4>
                            <div className="text-sm text-neutral-500">
                              @{reportDetails.content.username}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-neutral-500">Email:</span>{" "}
                            <span className="text-neutral-900">
                              {reportDetails.content.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Joined:</span>{" "}
                            <span className="text-neutral-900">
                              {new Date(
                                reportDetails.content.joinDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Posts:</span>{" "}
                            <span className="text-neutral-900">
                              {reportDetails.content.postCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Replies:</span>{" "}
                            <span className="text-neutral-900">
                              {reportDetails.content.replyCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-500">
                              Previous Reports:
                            </span>{" "}
                            <span className="text-neutral-900">
                              {reportDetails.content.previousReports}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500">
                      Failed to load report details
                    </p>
                  </div>
                )}

                {/* Moderation Actions */}
                {selectedReport.status === "pending" && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Moderation Action
                    </h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Moderation Note (optional)
                      </label>
                      <textarea
                        value={moderationNote}
                        onChange={(e) => setModerationNote(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Add notes about this moderation action..."
                      ></textarea>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleResolveReport}
                        disabled={isSubmittingAction}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        {isSubmittingAction ? (
                          <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Resolve Report
                      </button>
                      <button
                        onClick={handleDismissReport}
                        disabled={isSubmittingAction}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md shadow-sm text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        {isSubmittingAction ? (
                          <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Dismiss Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCommunity;
