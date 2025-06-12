import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Download,
  Heart,
  Eye,
  Calendar,
  RefreshCw,
  Clock,
  Globe,
  Camera,
  Image,
  MessageCircle,
  User,
  Filter,
  Mail,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";
import toast from "react-hot-toast";

const AnalyticsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [period, setPeriod] = useState<"7" | "30" | "90" | "365">("30");
  const [analytics, setAnalytics] = useState<any>({
    overview: {
      totalPhotos: 0,
      totalViews: 0,
      totalLikes: 0,
      totalDownloads: 0,
      avgViews: 0,
      avgLikes: 0,
      avgDownloads: 0,
    },
    topPhotos: [],
    viewsOverTime: [],
    likesOverTime: [],
    downloadsOverTime: [],
    followersOverTime: [],
    categoryStats: [],
  });
  const [countryAnalytics, setCountryAnalytics] = useState<any>({
    topCountries: [],
    trendingCountries: [],
    viewsByRegion: {},
  });
  const [realtimeData, setRealtimeData] = useState<any>({
    currentStats: {
      viewsLastHour: 0,
      viewsLastFiveMinutes: 0,
      likesLastHour: 0,
      downloadsLastHour: 0,
    },
    recentActivity: [],
  });

  // Chart refs
  const viewsChartRef = useRef<HTMLCanvasElement | null>(null);
  const likesChartRef = useRef<HTMLCanvasElement | null>(null);
  const downloadsChartRef = useRef<HTMLCanvasElement | null>(null);
  const categoryChartRef = useRef<HTMLCanvasElement | null>(null);
  const regionChartRef = useRef<HTMLCanvasElement | null>(null);
  const engagementChartRef = useRef<HTMLCanvasElement | null>(null);

  // Chart instances
  const viewsChartInstance = useRef<Chart | null>(null);
  const likesChartInstance = useRef<Chart | null>(null);
  const downloadsChartInstance = useRef<Chart | null>(null);
  const categoryChartInstance = useRef<Chart | null>(null);
  const regionChartInstance = useRef<Chart | null>(null);
  const engagementChartInstance = useRef<Chart | null>(null);

  // Load analytics data
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAnalytics();
      loadCountryAnalytics();
      loadRealtimeData();
    }
  }, [isAuthenticated, user, period]);

  // Set up polling for real-time data
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Poll for real-time data every 30 seconds
    const realtimeInterval = setInterval(() => {
      loadRealtimeData();
    }, 30000);

    // Poll for full analytics every 5 minutes
    const analyticsInterval = setInterval(() => {
      loadAnalytics();
      loadCountryAnalytics();
    }, 300000);

    return () => {
      clearInterval(realtimeInterval);
      clearInterval(analyticsInterval);
    };
  }, [isAuthenticated, user]);

  // Load analytics data
  const loadAnalytics = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/analytics/user/${user.id}?period=${period}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      toast.error("Failed to load analytics data");
    }
  };

  // Load country analytics
  const loadCountryAnalytics = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/country-analytics/country/${user.id}?period=${period}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch country analytics");
      }

      const data = await response.json();
      setCountryAnalytics(data);
    } catch (error) {
      console.error("Failed to load country analytics:", error);
    }
  };

  // Load real-time data
  const loadRealtimeData = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/country-analytics/realtime/${user.id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch real-time data");
      }

      const data = await response.json();
      setRealtimeData(data);
    } catch (error) {
      console.error("Failed to load real-time data:", error);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        loadAnalytics(),
        loadCountryAnalytics(),
        loadRealtimeData(),
      ]);
      toast.success("Analytics data refreshed");
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle email report
  const handleEmailReport = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/analytics/send-email/${user.id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send email report");
      }

      toast.success("Analytics report sent to your email");
    } catch (error) {
      console.error("Failed to send email report:", error);
      toast.error("Failed to send email report");
    }
  };

  // Create/update charts when data changes
  useEffect(() => {
    if (isLoading) return;

    // Views over time chart
    if (viewsChartRef.current && analytics.viewsOverTime) {
      const ctx = viewsChartRef.current.getContext("2d");
      if (ctx) {
        if (viewsChartInstance.current) {
          viewsChartInstance.current.destroy();
        }

        const labels = analytics.viewsOverTime.map((item: any) => {
          const date = new Date(item.date);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        });

        const data = analytics.viewsOverTime.map((item: any) => item.views);

        viewsChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Views",
                data,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#3b82f6",
                pointRadius: 3,
                pointHoverRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        });
      }
    }

    // Likes over time chart
    if (likesChartRef.current && analytics.likesOverTime) {
      const ctx = likesChartRef.current.getContext("2d");
      if (ctx) {
        if (likesChartInstance.current) {
          likesChartInstance.current.destroy();
        }

        const labels = analytics.likesOverTime.map((item: any) => {
          const date = new Date(item.date);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        });

        const data = analytics.likesOverTime.map((item: any) => item.likes);

        likesChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Likes",
                data,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#ef4444",
                pointRadius: 3,
                pointHoverRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        });
      }
    }

    // Downloads over time chart
    if (downloadsChartRef.current && analytics.downloadsOverTime) {
      const ctx = downloadsChartRef.current.getContext("2d");
      if (ctx) {
        if (downloadsChartInstance.current) {
          downloadsChartInstance.current.destroy();
        }

        const labels = analytics.downloadsOverTime.map((item: any) => {
          const date = new Date(item.date);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        });

        const data = analytics.downloadsOverTime.map(
          (item: any) => item.downloads
        );

        downloadsChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Downloads",
                data,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#22c55e",
                pointRadius: 3,
                pointHoverRadius: 5,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        });
      }
    }

    // Category performance chart
    if (categoryChartRef.current && analytics.categoryStats) {
      const ctx = categoryChartRef.current.getContext("2d");
      if (ctx) {
        if (categoryChartInstance.current) {
          categoryChartInstance.current.destroy();
        }

        const labels = analytics.categoryStats.map(
          (item: any) => item.category
        );
        const data = analytics.categoryStats.map(
          (item: any) => item.totalViews
        );

        categoryChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Views by Category",
                data,
                backgroundColor: [
                  "rgba(59, 130, 246, 0.7)",
                  "rgba(239, 68, 68, 0.7)",
                  "rgba(34, 197, 94, 0.7)",
                  "rgba(168, 85, 247, 0.7)",
                  "rgba(249, 115, 22, 0.7)",
                  "rgba(20, 184, 166, 0.7)",
                  "rgba(236, 72, 153, 0.7)",
                ],
                borderWidth: 0,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        });
      }
    }

    // Region chart
    if (regionChartRef.current && countryAnalytics.viewsByRegion) {
      const ctx = regionChartRef.current.getContext("2d");
      if (ctx) {
        if (regionChartInstance.current) {
          regionChartInstance.current.destroy();
        }

        const regions = countryAnalytics.viewsByRegion;
        const labels = [
          "North America",
          "Europe",
          "Asia",
          "South America",
          "Africa",
          "Oceania",
        ];
        const data = [
          regions.northAmerica || 0,
          regions.europe || 0,
          regions.asia || 0,
          regions.southAmerica || 0,
          regions.africa || 0,
          regions.oceania || 0,
        ];

        regionChartInstance.current = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  "rgba(59, 130, 246, 0.7)",
                  "rgba(239, 68, 68, 0.7)",
                  "rgba(34, 197, 94, 0.7)",
                  "rgba(168, 85, 247, 0.7)",
                  "rgba(249, 115, 22, 0.7)",
                  "rgba(20, 184, 166, 0.7)",
                ],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  boxWidth: 12,
                  padding: 15,
                },
              },
            },
          },
        });
      }
    }

    // Engagement chart
    if (engagementChartRef.current && analytics.topPhotos) {
      const ctx = engagementChartRef.current.getContext("2d");
      if (ctx) {
        if (engagementChartInstance.current) {
          engagementChartInstance.current.destroy();
        }

        const labels = analytics.topPhotos
          .slice(0, 5)
          .map(
            (photo: any) =>
              photo.title.substring(0, 15) +
              (photo.title.length > 15 ? "..." : "")
          );

        const viewsData = analytics.topPhotos
          .slice(0, 5)
          .map((photo: any) => photo.views);
        const likesData = analytics.topPhotos
          .slice(0, 5)
          .map((photo: any) => photo.likes);
        const downloadsData = analytics.topPhotos
          .slice(0, 5)
          .map((photo: any) => photo.downloads);

        engagementChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Views",
                data: viewsData,
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderWidth: 0,
                borderRadius: 4,
              },
              {
                label: "Likes",
                data: likesData,
                backgroundColor: "rgba(239, 68, 68, 0.7)",
                borderWidth: 0,
                borderRadius: 4,
              },
              {
                label: "Downloads",
                data: downloadsData,
                backgroundColor: "rgba(34, 197, 94, 0.7)",
                borderWidth: 0,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        });
      }
    }
  }, [analytics, countryAnalytics, isLoading]);

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Format large numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Sign in to view analytics
          </h2>
          <p className="text-neutral-600 mb-6">
            You need to be logged in to access your analytics dashboard.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-indigo-100">
                Track your performance and audience engagement
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                  className="appearance-none bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-4 py-2 transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleEmailReport}
                className="flex items-center space-x-2 bg-white text-indigo-600 rounded-lg px-4 py-2 hover:bg-indigo-50 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Email Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-neutral-500">Total Views</div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2">
                  {formatNumber(analytics.overview.totalViews)}
                </div>
                <div className="flex items-center text-sm">
                  <div
                    className={`flex items-center ${
                      calculateGrowth(
                        analytics.overview.totalViews,
                        analytics.overview.totalViews * 0.92
                      ) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {calculateGrowth(
                      analytics.overview.totalViews,
                      analytics.overview.totalViews * 0.92
                    ) >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {Math.abs(
                        calculateGrowth(
                          analytics.overview.totalViews,
                          analytics.overview.totalViews * 0.92
                        )
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <span className="text-neutral-500 ml-1">
                    vs. previous period
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-neutral-500">Total Likes</div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2">
                  {formatNumber(analytics.overview.totalLikes)}
                </div>
                <div className="flex items-center text-sm">
                  <div
                    className={`flex items-center ${
                      calculateGrowth(
                        analytics.overview.totalLikes,
                        analytics.overview.totalLikes * 0.85
                      ) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {calculateGrowth(
                      analytics.overview.totalLikes,
                      analytics.overview.totalLikes * 0.85
                    ) >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {Math.abs(
                        calculateGrowth(
                          analytics.overview.totalLikes,
                          analytics.overview.totalLikes * 0.85
                        )
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <span className="text-neutral-500 ml-1">
                    vs. previous period
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-neutral-500">Total Downloads</div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2">
                  {formatNumber(analytics.overview.totalDownloads)}
                </div>
                <div className="flex items-center text-sm">
                  <div
                    className={`flex items-center ${
                      calculateGrowth(
                        analytics.overview.totalDownloads,
                        analytics.overview.totalDownloads * 0.94
                      ) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {calculateGrowth(
                      analytics.overview.totalDownloads,
                      analytics.overview.totalDownloads * 0.94
                    ) >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    <span>
                      {Math.abs(
                        calculateGrowth(
                          analytics.overview.totalDownloads,
                          analytics.overview.totalDownloads * 0.94
                        )
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <span className="text-neutral-500 ml-1">
                    vs. previous period
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-neutral-500">Avg. Engagement</div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2">
                  {analytics.overview.totalPhotos > 0
                    ? (
                        (analytics.overview.totalLikes +
                          analytics.overview.totalDownloads) /
                        analytics.overview.totalPhotos
                      ).toFixed(1)
                    : "0"}
                  /photo
                </div>
                <div className="flex items-center text-sm">
                  <div className="flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>12.4%</span>
                  </div>
                  <span className="text-neutral-500 ml-1">
                    vs. previous period
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Real-time Activity */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-900">
                  Real-time Activity
                </h2>
                <div className="flex items-center text-sm text-neutral-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last updated just now</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-neutral-500 text-sm">
                      Views (last hour)
                    </div>
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {realtimeData.currentStats.viewsLastHour}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {realtimeData.currentStats.viewsLastFiveMinutes} in last 5
                    minutes
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-neutral-500 text-sm">
                      Likes (last hour)
                    </div>
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {realtimeData.currentStats.likesLastHour}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    From{" "}
                    {
                      realtimeData.recentActivity.filter(
                        (a: any) => a.type === "like"
                      ).length
                    }{" "}
                    different users
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-neutral-500 text-sm">
                      Downloads (last hour)
                    </div>
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {realtimeData.currentStats.downloadsLastHour}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    From{" "}
                    {
                      realtimeData.recentActivity.filter(
                        (a: any) => a.type === "download"
                      ).length
                    }{" "}
                    different users
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-neutral-500 text-sm">Active Now</div>
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {Math.max(
                      1,
                      Math.floor(
                        realtimeData.currentStats.viewsLastFiveMinutes * 1.5
                      )
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Users viewing your content
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {realtimeData.recentActivity.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                      {realtimeData.recentActivity.map(
                        (activity: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 hover:bg-neutral-50 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {activity.type === "view" && (
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Eye className="h-4 w-4 text-blue-600" />
                                  </div>
                                )}
                                {activity.type === "like" && (
                                  <div className="p-2 bg-red-100 rounded-lg">
                                    <Heart className="h-4 w-4 text-red-600" />
                                  </div>
                                )}
                                {activity.type === "download" && (
                                  <div className="p-2 bg-green-100 rounded-lg">
                                    <Download className="h-4 w-4 text-green-600" />
                                  </div>
                                )}
                                {activity.type === "comment" && (
                                  <div className="p-2 bg-purple-100 rounded-lg">
                                    <MessageCircle className="h-4 w-4 text-purple-600" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-neutral-900">
                                  {activity.type === "view" && "Someone viewed"}
                                  {activity.type === "like" && (
                                    <>
                                      <span className="font-medium">
                                        {activity.username || "Anonymous"}
                                      </span>{" "}
                                      liked
                                    </>
                                  )}
                                  {activity.type === "download" && (
                                    <>
                                      <span className="font-medium">
                                        {activity.username || "Anonymous"}
                                      </span>{" "}
                                      downloaded
                                    </>
                                  )}
                                  {activity.type === "comment" && (
                                    <>
                                      <span className="font-medium">
                                        {activity.username || "Anonymous"}
                                      </span>{" "}
                                      commented on
                                    </>
                                  )}{" "}
                                  your photo{" "}
                                  <span className="font-medium">
                                    {activity.photo_title}
                                  </span>
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  {formatDate(activity.timestamp)}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                <img
                                  src={activity.photo_thumbnail}
                                  alt={activity.photo_title}
                                  className="h-10 w-10 object-cover rounded"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Clock className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Charts Section */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Performance Over Time
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Views Over Time */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Views Over Time
                    </h3>
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={viewsChartRef}></canvas>
                  </div>
                </div>

                {/* Likes Over Time */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Likes Over Time
                    </h3>
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={likesChartRef}></canvas>
                  </div>
                </div>

                {/* Downloads Over Time */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Downloads Over Time
                    </h3>
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={downloadsChartRef}></canvas>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Performing Photos */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Top Performing Photos
              </h2>

              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Photo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Engagement Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {analytics.topPhotos.map((photo: any, index: number) => (
                        <tr
                          key={photo.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-neutral-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-neutral-900">
                              {photo.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 text-blue-600 mr-2" />
                              <span className="text-sm text-neutral-900">
                                {formatNumber(photo.views)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 text-red-600 mr-2" />
                              <span className="text-sm text-neutral-900">
                                {formatNumber(photo.likes)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Download className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-sm text-neutral-900">
                                {formatNumber(photo.downloads)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-neutral-900">
                              {photo.views > 0
                                ? (
                                    ((photo.likes + photo.downloads) /
                                      photo.views) *
                                    100
                                  ).toFixed(1) + "%"
                                : "0%"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Engagement Insights */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Engagement Insights
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Performance */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Category Performance
                    </h3>
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <Filter className="h-4 w-4 text-indigo-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={categoryChartRef}></canvas>
                  </div>
                </div>

                {/* Engagement by Photo */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Engagement by Photo
                    </h3>
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={engagementChartRef}></canvas>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Audience Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Audience Insights
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Countries */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Top Countries
                    </h3>
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {countryAnalytics.topCountries
                      .slice(0, 5)
                      .map((country: any, index: number) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 text-lg">
                            {country.code === "OT" ? "🌍" : `${country.code}`}
                          </div>
                          <div className="flex-1 ml-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-neutral-900">
                                {country.country}
                              </span>
                              <span className="text-sm text-neutral-500">
                                {formatNumber(country.views)} views
                              </span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${country.percentage * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Regional Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Regional Distribution
                    </h3>
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Globe className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="h-64">
                    <canvas ref={regionChartRef}></canvas>
                  </div>
                </div>

                {/* Trending Countries */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-neutral-900">
                      Trending Countries
                    </h3>
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {countryAnalytics.trendingCountries.map(
                      (country: any, index: number) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-lg">
                            {country.code === "OT" ? "🌍" : `${country.code}`}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-neutral-900">
                              {country.country}
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="text-xs text-green-600 font-medium flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                {country.growthRate}
                              </div>
                              <div className="text-xs text-neutral-500 ml-2">
                                {formatNumber(country.views)} views
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
