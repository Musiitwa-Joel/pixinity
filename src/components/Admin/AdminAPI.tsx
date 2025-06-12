import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Key,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Copy,
  CheckCircle,
  XCircle,
  Users,
  AlertTriangle,
  BarChart2,
  Shield,
  Lock,
  Unlock,
  FileText,
  Terminal,
  Database,
  Server,
  Settings,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

interface APIKey {
  id: string;
  name: string;
  key: string;
  status: "active" | "revoked";
  permissions: string[];
  createdBy: {
    id: string;
    name: string;
  };
  lastUsed?: string;
  requestsCount: number;
  createdAt: string;
  expiresAt?: string;
}

interface APIEndpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  category: string;
  isPublic: boolean;
  isDeprecated: boolean;
  version: string;
  requestsCount: number;
  averageResponseTime: number;
  documentation: {
    parameters?: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    responses?: {
      code: string;
      description: string;
    }[];
    examples?: {
      request: string;
      response: string;
    }[];
  };
}

interface APIUsage {
  totalRequests: number;
  uniqueUsers: number;
  averageResponseTime: number;
  errorRate: number;
  requestsPerDay: {
    date: string;
    count: number;
  }[];
  topEndpoints: {
    path: string;
    count: number;
  }[];
  topUsers: {
    id: string;
    name: string;
    count: number;
  }[];
}

const AdminAPI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"keys" | "endpoints" | "usage">(
    "keys"
  );
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<APIKey[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [filteredEndpoints, setFilteredEndpoints] = useState<APIEndpoint[]>([]);
  const [apiUsage, setApiUsage] = useState<APIUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");

  // Form state for editing
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (activeTab === "keys") {
      fetchAPIKeys();
    } else if (activeTab === "endpoints") {
      fetchAPIEndpoints();
    } else if (activeTab === "usage") {
      fetchAPIUsage();
    }
  }, [activeTab]);

  useEffect(() => {
    filterItems();
  }, [
    apiKeys,
    apiEndpoints,
    searchQuery,
    statusFilter,
    categoryFilter,
    sortBy,
    activeTab,
  ]);

  const fetchAPIKeys = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setApiKeys([
        {
          id: "1",
          name: "Production API Key",
          key: "pxn_prod_a1b2c3d4e5f6g7h8i9j0",
          status: "active",
          permissions: [
            "read:photos",
            "write:photos",
            "read:collections",
            "write:collections",
          ],
          createdBy: {
            id: "6",
            name: "Musiitwa Joel",
          },
          lastUsed: "2025-06-10T15:30:00.000Z",
          requestsCount: 12458,
          createdAt: "2025-01-15T10:00:00.000Z",
          expiresAt: "2026-01-15T10:00:00.000Z",
        },
        {
          id: "2",
          name: "Development API Key",
          key: "pxn_dev_z9y8x7w6v5u4t3s2r1q0",
          status: "active",
          permissions: ["read:photos", "write:photos", "read:collections"],
          createdBy: {
            id: "6",
            name: "Musiitwa Joel",
          },
          lastUsed: "2025-06-11T09:45:00.000Z",
          requestsCount: 3567,
          createdAt: "2025-02-20T14:30:00.000Z",
        },
        {
          id: "3",
          name: "Analytics API Key",
          key: "pxn_analytics_m1n2o3p4q5r6s7t8u9",
          status: "revoked",
          permissions: ["read:analytics"],
          createdBy: {
            id: "7",
            name: "Manager Bollz",
          },
          lastUsed: "2025-05-15T11:20:00.000Z",
          requestsCount: 856,
          createdAt: "2025-03-10T09:15:00.000Z",
          expiresAt: "2025-09-10T09:15:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAPIEndpoints = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setApiEndpoints([
        {
          id: "1",
          path: "/api/v1/photos",
          method: "GET",
          description: "Get a list of photos with optional filtering",
          category: "Photos",
          isPublic: true,
          isDeprecated: false,
          version: "v1",
          requestsCount: 45678,
          averageResponseTime: 120,
          documentation: {
            parameters: [
              {
                name: "page",
                type: "integer",
                required: false,
                description: "Page number for pagination",
              },
              {
                name: "limit",
                type: "integer",
                required: false,
                description: "Number of items per page",
              },
              {
                name: "category",
                type: "string",
                required: false,
                description: "Filter by category",
              },
            ],
            responses: [
              {
                code: "200",
                description: "Success - Returns list of photos",
              },
              {
                code: "400",
                description: "Bad Request - Invalid parameters",
              },
            ],
            examples: [
              {
                request: "GET /api/v1/photos?page=1&limit=10&category=nature",
                response:
                  '{\n  "photos": [...],\n  "pagination": {\n    "page": 1,\n    "limit": 10,\n    "total": 256\n  }\n}',
              },
            ],
          },
        },
        {
          id: "2",
          path: "/api/v1/photos/{id}",
          method: "GET",
          description: "Get a specific photo by ID",
          category: "Photos",
          isPublic: true,
          isDeprecated: false,
          version: "v1",
          requestsCount: 32145,
          averageResponseTime: 85,
          documentation: {
            parameters: [
              {
                name: "id",
                type: "string",
                required: true,
                description: "Photo ID",
              },
            ],
            responses: [
              {
                code: "200",
                description: "Success - Returns photo details",
              },
              {
                code: "404",
                description: "Not Found - Photo not found",
              },
            ],
            examples: [
              {
                request: "GET /api/v1/photos/abc123",
                response:
                  '{\n  "id": "abc123",\n  "title": "Mountain Landscape",\n  "url": "https://pixinity.com/photos/abc123.jpg",\n  ...\n}',
              },
            ],
          },
        },
        {
          id: "3",
          path: "/api/v1/collections",
          method: "GET",
          description: "Get a list of collections",
          category: "Collections",
          isPublic: true,
          isDeprecated: false,
          version: "v1",
          requestsCount: 18765,
          averageResponseTime: 150,
          documentation: {
            parameters: [
              {
                name: "page",
                type: "integer",
                required: false,
                description: "Page number for pagination",
              },
              {
                name: "limit",
                type: "integer",
                required: false,
                description: "Number of items per page",
              },
              {
                name: "user_id",
                type: "string",
                required: false,
                description: "Filter by user ID",
              },
            ],
            responses: [
              {
                code: "200",
                description: "Success - Returns list of collections",
              },
              {
                code: "400",
                description: "Bad Request - Invalid parameters",
              },
            ],
            examples: [
              {
                request: "GET /api/v1/collections?page=1&limit=10",
                response:
                  '{\n  "collections": [...],\n  "pagination": {\n    "page": 1,\n    "limit": 10,\n    "total": 128\n  }\n}',
              },
            ],
          },
        },
        {
          id: "4",
          path: "/api/v1/analytics/user/{id}",
          method: "GET",
          description: "Get analytics for a specific user",
          category: "Analytics",
          isPublic: false,
          isDeprecated: false,
          version: "v1",
          requestsCount: 5432,
          averageResponseTime: 200,
          documentation: {
            parameters: [
              {
                name: "id",
                type: "string",
                required: true,
                description: "User ID",
              },
              {
                name: "period",
                type: "string",
                required: false,
                description: "Time period (day, week, month, year)",
              },
            ],
            responses: [
              {
                code: "200",
                description: "Success - Returns user analytics",
              },
              {
                code: "403",
                description: "Forbidden - Insufficient permissions",
              },
              {
                code: "404",
                description: "Not Found - User not found",
              },
            ],
            examples: [
              {
                request: "GET /api/v1/analytics/user/123?period=month",
                response:
                  '{\n  "views": 1234,\n  "downloads": 56,\n  "likes": 78,\n  "topPhotos": [...]\n}',
              },
            ],
          },
        },
        {
          id: "5",
          path: "/api/v0/search",
          method: "GET",
          description: "Legacy search endpoint",
          category: "Search",
          isPublic: true,
          isDeprecated: true,
          version: "v0",
          requestsCount: 1234,
          averageResponseTime: 180,
          documentation: {
            parameters: [
              {
                name: "q",
                type: "string",
                required: true,
                description: "Search query",
              },
            ],
            responses: [
              {
                code: "200",
                description: "Success - Returns search results",
              },
            ],
            examples: [
              {
                request: "GET /api/v0/search?q=mountains",
                response: '{\n  "results": [...],\n  "count": 42\n}',
              },
            ],
          },
        },
      ]);
    } catch (error) {
      console.error("Error fetching API endpoints:", error);
      toast.error("Failed to load API endpoints");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAPIUsage = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setApiUsage({
        totalRequests: 1245678,
        uniqueUsers: 3456,
        averageResponseTime: 135,
        errorRate: 1.2,
        requestsPerDay: [
          { date: "2025-06-05", count: 41234 },
          { date: "2025-06-06", count: 42567 },
          { date: "2025-06-07", count: 39876 },
          { date: "2025-06-08", count: 38765 },
          { date: "2025-06-09", count: 43210 },
          { date: "2025-06-10", count: 45678 },
          { date: "2025-06-11", count: 44321 },
        ],
        topEndpoints: [
          { path: "/api/v1/photos", count: 456789 },
          { path: "/api/v1/photos/{id}", count: 321456 },
          { path: "/api/v1/collections", count: 187654 },
          { path: "/api/v1/search", count: 123456 },
          { path: "/api/v1/users/{id}", count: 98765 },
        ],
        topUsers: [
          { id: "1", name: "Example App 1", count: 123456 },
          { id: "2", name: "Example App 2", count: 98765 },
          { id: "3", name: "Example App 3", count: 87654 },
          { id: "4", name: "Example App 4", count: 76543 },
          { id: "5", name: "Example App 5", count: 65432 },
        ],
      });
    } catch (error) {
      console.error("Error fetching API usage:", error);
      toast.error("Failed to load API usage data");
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (activeTab === "keys") {
      let result = [...apiKeys];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (key) =>
            key.name.toLowerCase().includes(query) ||
            key.key.toLowerCase().includes(query) ||
            key.createdBy.name.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        result = result.filter((key) => key.status === statusFilter);
      }

      // Apply sorting
      switch (sortBy) {
        case "oldest":
          result.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "name-asc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "usage":
          result.sort((a, b) => b.requestsCount - a.requestsCount);
          break;
        default: // newest
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }

      setFilteredKeys(result);
    } else if (activeTab === "endpoints") {
      let result = [...apiEndpoints];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (endpoint) =>
            endpoint.path.toLowerCase().includes(query) ||
            endpoint.description.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (categoryFilter !== "all") {
        result = result.filter(
          (endpoint) => endpoint.category === categoryFilter
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        if (statusFilter === "public") {
          result = result.filter((endpoint) => endpoint.isPublic);
        } else if (statusFilter === "private") {
          result = result.filter((endpoint) => !endpoint.isPublic);
        } else if (statusFilter === "deprecated") {
          result = result.filter((endpoint) => endpoint.isDeprecated);
        } else if (statusFilter === "active") {
          result = result.filter((endpoint) => !endpoint.isDeprecated);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "path-asc":
          result.sort((a, b) => a.path.localeCompare(b.path));
          break;
        case "path-desc":
          result.sort((a, b) => b.path.localeCompare(a.path));
          break;
        case "usage":
          result.sort((a, b) => b.requestsCount - a.requestsCount);
          break;
        case "response-time":
          result.sort((a, b) => a.averageResponseTime - b.averageResponseTime);
          break;
        default: // category
          result.sort((a, b) => a.category.localeCompare(b.category));
      }

      setFilteredEndpoints(result);
    }
  };

  const handleCreateAPIKey = () => {
    // Generate a random API key
    const randomKey = `pxn_${Math.random()
      .toString(36)
      .substring(2, 10)}_${Math.random().toString(36).substring(2, 10)}`;
    setGeneratedKey(randomKey);

    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name: "New API Key",
      key: randomKey,
      status: "active",
      permissions: ["read:photos"],
      createdBy: {
        id: "6",
        name: "Musiitwa Joel",
      },
      requestsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setCurrentItem(newKey);
    setFormData({
      name: newKey.name,
      permissions: newKey.permissions,
      expiresAt: "",
    });
    setIsEditing(true);
    setShowGeneratedKey(true);
  };

  const handleCreateAPIEndpoint = () => {
    const newEndpoint: APIEndpoint = {
      id: `endpoint-${Date.now()}`,
      path: "/api/v1/new-endpoint",
      method: "GET",
      description: "Description of the new endpoint",
      category: "Other",
      isPublic: false,
      isDeprecated: false,
      version: "v1",
      requestsCount: 0,
      averageResponseTime: 0,
      documentation: {
        parameters: [],
        responses: [
          {
            code: "200",
            description: "Success",
          },
        ],
        examples: [],
      },
    };

    setApiEndpoints([newEndpoint, ...apiEndpoints]);
    setCurrentItem(newEndpoint);
    setFormData({
      path: newEndpoint.path,
      method: newEndpoint.method,
      description: newEndpoint.description,
      category: newEndpoint.category,
      isPublic: newEndpoint.isPublic,
      isDeprecated: newEndpoint.isDeprecated,
      version: newEndpoint.version,
      parameters: [],
      responses: [{ code: "200", description: "Success" }],
      examples: [],
    });
    setIsEditing(true);
  };

  const handleEditItem = (item: any) => {
    setCurrentItem(item);

    if (activeTab === "keys") {
      setFormData({
        name: item.name,
        permissions: item.permissions,
        expiresAt: item.expiresAt
          ? new Date(item.expiresAt).toISOString().split("T")[0]
          : "",
      });
    } else if (activeTab === "endpoints") {
      setFormData({
        path: item.path,
        method: item.method,
        description: item.description,
        category: item.category,
        isPublic: item.isPublic,
        isDeprecated: item.isDeprecated,
        version: item.version,
        parameters: item.documentation.parameters || [],
        responses: item.documentation.responses || [],
        examples: item.documentation.examples || [],
      });
    }

    setIsEditing(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the item
      // For now, we'll simulate deleting the item

      if (activeTab === "keys") {
        setApiKeys(apiKeys.filter((key) => key.id !== itemId));
      } else if (activeTab === "endpoints") {
        setApiEndpoints(
          apiEndpoints.filter((endpoint) => endpoint.id !== itemId)
        );
      }

      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (
      !confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to revoke the key
      // For now, we'll simulate revoking the key

      setApiKeys(
        apiKeys.map((key) =>
          key.id === keyId
            ? {
                ...key,
                status: "revoked" as const,
                updatedAt: new Date().toISOString(),
              }
            : key
        )
      );

      toast.success("API key revoked successfully");
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast.error("Failed to revoke API key");
    }
  };

  const handleToggleEndpointStatus = async (
    endpointId: string,
    field: "isPublic" | "isDeprecated"
  ) => {
    try {
      // In a real implementation, you would make an API call to update the endpoint
      // For now, we'll simulate updating the endpoint

      let updatedEndpoint: APIEndpoint | undefined;
      setApiEndpoints(
        apiEndpoints.map((endpoint) => {
          if (endpoint.id === endpointId) {
            updatedEndpoint = {
              ...endpoint,
              [field]: !endpoint[field],
            };
            return updatedEndpoint;
          }
          return endpoint;
        })
      );

      if (updatedEndpoint) {
        toast.success(
          `Endpoint ${
            field === "isPublic"
              ? updatedEndpoint.isPublic
                ? "made public"
                : "made private"
              : updatedEndpoint.isDeprecated
              ? "marked as deprecated"
              : "marked as active"
          }`
        );
      }
    } catch (error) {
      console.error(`Error toggling endpoint ${field}:`, error);
      toast.error(`Failed to update endpoint ${field}`);
    }
  };

  const handleSaveItem = async () => {
    if (!currentItem) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the item
      // For now, we'll simulate updating the item

      if (activeTab === "keys") {
        const updatedKey: APIKey = {
          ...currentItem,
          name: formData.name,
          permissions: formData.permissions,
          expiresAt: formData.expiresAt
            ? new Date(formData.expiresAt).toISOString()
            : undefined,
        };

        setApiKeys(
          apiKeys.map((key) => (key.id === updatedKey.id ? updatedKey : key))
        );
      } else if (activeTab === "endpoints") {
        const updatedEndpoint: APIEndpoint = {
          ...currentItem,
          path: formData.path,
          method: formData.method as any,
          description: formData.description,
          category: formData.category,
          isPublic: formData.isPublic,
          isDeprecated: formData.isDeprecated,
          version: formData.version,
          documentation: {
            parameters: formData.parameters,
            responses: formData.responses,
            examples: formData.examples,
          },
        };

        setApiEndpoints(
          apiEndpoints.map((endpoint) =>
            endpoint.id === updatedEndpoint.id ? updatedEndpoint : endpoint
          )
        );
      }

      toast.success("Item saved successfully");
      setIsEditing(false);
      setCurrentItem(null);
      setShowGeneratedKey(false);
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddParameter = () => {
    setFormData({
      ...formData,
      parameters: [
        ...formData.parameters,
        {
          name: "",
          type: "string",
          required: false,
          description: "",
        },
      ],
    });
  };

  const handleRemoveParameter = (index: number) => {
    const newParameters = [...formData.parameters];
    newParameters.splice(index, 1);
    setFormData({
      ...formData,
      parameters: newParameters,
    });
  };

  const handleUpdateParameter = (index: number, field: string, value: any) => {
    const newParameters = [...formData.parameters];
    newParameters[index] = {
      ...newParameters[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      parameters: newParameters,
    });
  };

  const handleAddResponse = () => {
    setFormData({
      ...formData,
      responses: [
        ...formData.responses,
        {
          code: "200",
          description: "Success",
        },
      ],
    });
  };

  const handleRemoveResponse = (index: number) => {
    const newResponses = [...formData.responses];
    newResponses.splice(index, 1);
    setFormData({
      ...formData,
      responses: newResponses,
    });
  };

  const handleUpdateResponse = (
    index: number,
    field: string,
    value: string
  ) => {
    const newResponses = [...formData.responses];
    newResponses[index] = {
      ...newResponses[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      responses: newResponses,
    });
  };

  const handleAddExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        {
          request: "",
          response: "",
        },
      ],
    });
  };

  const handleRemoveExample = (index: number) => {
    const newExamples = [...formData.examples];
    newExamples.splice(index, 1);
    setFormData({
      ...formData,
      examples: newExamples,
    });
  };

  const handleUpdateExample = (index: number, field: string, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = {
      ...newExamples[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      examples: newExamples,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowGeneratedKey(false);
                }}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-700" />
              </button>
              <h1 className="text-3xl font-bold text-neutral-900">
                {currentItem?.id.includes(`${activeTab.slice(0, -1)}-`)
                  ? `Create New ${
                      activeTab.slice(0, -1).charAt(0).toUpperCase() +
                      activeTab.slice(0, -1).slice(1)
                    }`
                  : `Edit ${
                      activeTab.slice(0, -1).charAt(0).toUpperCase() +
                      activeTab.slice(0, -1).slice(1)
                    }`}
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowGeneratedKey(false);
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
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
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
            {/* API Key Form */}
            {activeTab === "keys" && (
              <div className="space-y-6">
                {showGeneratedKey && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Key className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-800 mb-1">
                          New API Key Generated
                        </h3>
                        <p className="text-sm text-green-700 mb-3">
                          This is your API key. Make sure to copy it now as you
                          won't be able to see it again.
                        </p>
                        <div className="flex items-center space-x-2 bg-white p-3 rounded border border-green-300">
                          <code className="text-sm font-mono text-green-800 flex-1 overflow-x-auto">
                            {generatedKey}
                          </code>
                          <button
                            onClick={() => copyToClipboard(generatedKey)}
                            className="p-1 text-green-700 hover:text-green-900 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Production API Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "read:photos", label: "Read Photos" },
                      { value: "write:photos", label: "Write Photos" },
                      { value: "read:collections", label: "Read Collections" },
                      {
                        value: "write:collections",
                        label: "Write Collections",
                      },
                      { value: "read:users", label: "Read Users" },
                      { value: "read:analytics", label: "Read Analytics" },
                    ].map((permission) => (
                      <label
                        key={permission.value}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(
                            permission.value
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [
                                  ...formData.permissions,
                                  permission.value,
                                ],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(
                                  (p: string) => p !== permission.value
                                ),
                              });
                            }
                          }}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <span className="ml-2 text-sm text-neutral-900">
                          {permission.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Expiration Date (optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <p className="mt-1 text-sm text-neutral-500">
                    Leave blank for a non-expiring key
                  </p>
                </div>
              </div>
            )}

            {/* API Endpoint Form */}
            {activeTab === "endpoints" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Endpoint Path
                    </label>
                    <input
                      type="text"
                      value={formData.path}
                      onChange={(e) =>
                        setFormData({ ...formData, path: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="/api/v1/endpoint"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      HTTP Method
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) =>
                        setFormData({ ...formData, method: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe what this endpoint does..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Photos">Photos</option>
                      <option value="Collections">Collections</option>
                      <option value="Users">Users</option>
                      <option value="Search">Search</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Version
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) =>
                        setFormData({ ...formData, version: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="v1"
                    />
                  </div>
                  <div className="flex items-end space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPublic: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-900">
                        Public
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDeprecated}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isDeprecated: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-900">
                        Deprecated
                      </span>
                    </label>
                  </div>
                </div>

                {/* Parameters */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-700">
                      Parameters
                    </label>
                    <button
                      onClick={handleAddParameter}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Parameter
                    </button>
                  </div>

                  {formData.parameters && formData.parameters.length > 0 ? (
                    <div className="space-y-4">
                      {formData.parameters.map((param: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-start justify-between p-4 border border-neutral-200 rounded-lg"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Name
                              </label>
                              <input
                                type="text"
                                value={param.name}
                                onChange={(e) =>
                                  handleUpdateParameter(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Type
                              </label>
                              <select
                                value={param.type}
                                onChange={(e) =>
                                  handleUpdateParameter(
                                    index,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="string">String</option>
                                <option value="integer">Integer</option>
                                <option value="boolean">Boolean</option>
                                <option value="array">Array</option>
                                <option value="object">Object</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Required
                              </label>
                              <select
                                value={param.required.toString()}
                                onChange={(e) =>
                                  handleUpdateParameter(
                                    index,
                                    "required",
                                    e.target.value === "true"
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={param.description}
                                onChange={(e) =>
                                  handleUpdateParameter(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveParameter(index)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-neutral-300 rounded-lg">
                      <p className="text-neutral-500">No parameters defined</p>
                      <button
                        onClick={handleAddParameter}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Parameter
                      </button>
                    </div>
                  )}
                </div>

                {/* Responses */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-700">
                      Responses
                    </label>
                    <button
                      onClick={handleAddResponse}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Response
                    </button>
                  </div>

                  {formData.responses && formData.responses.length > 0 ? (
                    <div className="space-y-4">
                      {formData.responses.map(
                        (response: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-start justify-between p-4 border border-neutral-200 rounded-lg"
                          >
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">
                                  Status Code
                                </label>
                                <input
                                  type="text"
                                  value={response.code}
                                  onChange={(e) =>
                                    handleUpdateResponse(
                                      index,
                                      "code",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-neutral-700 mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={response.description}
                                  onChange={(e) =>
                                    handleUpdateResponse(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveResponse(index)}
                              className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-neutral-300 rounded-lg">
                      <p className="text-neutral-500">No responses defined</p>
                      <button
                        onClick={handleAddResponse}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Response
                      </button>
                    </div>
                  )}
                </div>

                {/* Examples */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-700">
                      Examples
                    </label>
                    <button
                      onClick={handleAddExample}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Example
                    </button>
                  </div>

                  {formData.examples && formData.examples.length > 0 ? (
                    <div className="space-y-4">
                      {formData.examples.map((example: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 border border-neutral-200 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Example {index + 1}</h4>
                            <button
                              onClick={() => handleRemoveExample(index)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Request
                              </label>
                              <textarea
                                value={example.request}
                                onChange={(e) =>
                                  handleUpdateExample(
                                    index,
                                    "request",
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                Response
                              </label>
                              <textarea
                                value={example.response}
                                onChange={(e) =>
                                  handleUpdateExample(
                                    index,
                                    "response",
                                    e.target.value
                                  )
                                }
                                rows={4}
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-neutral-300 rounded-lg">
                      <p className="text-neutral-500">No examples defined</p>
                      <button
                        onClick={handleAddExample}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Example
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                API Management
              </h1>
              <p className="text-neutral-600">
                Manage API keys, endpoints, and monitor usage
              </p>
            </div>
            <button
              onClick={() => {
                if (activeTab === "keys") {
                  handleCreateAPIKey();
                } else if (activeTab === "endpoints") {
                  handleCreateAPIEndpoint();
                }
              }}
              className={`btn-primary flex items-center space-x-2 ${
                activeTab === "usage" ? "hidden" : ""
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>
                Create {activeTab === "keys" ? "API Key" : "Endpoint"}
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-200 mb-6">
            <button
              onClick={() => setActiveTab("keys")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "keys"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>API Keys</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("endpoints")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "endpoints"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Endpoints</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "usage"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart2 className="h-5 w-5" />
                <span>Usage</span>
              </div>
            </button>
          </div>

          {/* API Keys */}
          {activeTab === "keys" && (
            <>
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
                      placeholder="Search API keys..."
                      className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="revoked">Revoked</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="usage">Most Used</option>
                  </select>
                </div>

                <button
                  onClick={fetchAPIKeys}
                  className="btn-outline flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* API Keys List */}
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
                ) : filteredKeys.length > 0 ? (
                  <div className="divide-y divide-neutral-200">
                    {filteredKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {apiKey.name}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  apiKey.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {apiKey.status === "active"
                                  ? "Active"
                                  : "Revoked"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                              <code className="text-sm font-mono bg-neutral-100 px-2 py-1 rounded">
                                {apiKey.key.substring(0, 8)}...
                                {apiKey.key.substring(apiKey.key.length - 4)}
                              </code>
                              <button
                                onClick={() => copyToClipboard(apiKey.key)}
                                className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
                                title="Copy full key"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {apiKey.permissions.map((permission) => (
                                <span
                                  key={permission}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {permission}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                <span>Created by: {apiKey.createdBy.name}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  Created:{" "}
                                  {new Date(
                                    apiKey.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              {apiKey.expiresAt && (
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>
                                    Expires:{" "}
                                    {new Date(
                                      apiKey.expiresAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <BarChart2 className="h-4 w-4 mr-1" />
                                <span>
                                  {apiKey.requestsCount.toLocaleString()}{" "}
                                  requests
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {apiKey.status === "active" && (
                              <button
                                onClick={() => handleRevokeKey(apiKey.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                title="Revoke key"
                              >
                                <Lock className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditItem(apiKey)}
                              className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                              title="Edit key"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(apiKey.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                              title="Delete key"
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
                    <Key className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">
                      No API keys found
                    </h3>
                    <p className="text-neutral-500 mb-4">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Get started by creating your first API key"}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                      <button
                        onClick={handleCreateAPIKey}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First API Key
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* API Endpoints */}
          {activeTab === "endpoints" && (
            <>
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
                      placeholder="Search endpoints..."
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
                    <option value="Photos">Photos</option>
                    <option value="Collections">Collections</option>
                    <option value="Users">Users</option>
                    <option value="Search">Search</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="deprecated">Deprecated</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="category">By Category</option>
                    <option value="path-asc">Path A-Z</option>
                    <option value="path-desc">Path Z-A</option>
                    <option value="usage">Most Used</option>
                    <option value="response-time">Fastest Response</option>
                  </select>

                  <button
                    onClick={fetchAPIEndpoints}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* API Endpoints List */}
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
                ) : filteredEndpoints.length > 0 ? (
                  <div className="divide-y divide-neutral-200">
                    {filteredEndpoints.map((endpoint) => (
                      <div key={endpoint.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  endpoint.method === "GET"
                                    ? "bg-green-100 text-green-800"
                                    : endpoint.method === "POST"
                                    ? "bg-blue-100 text-blue-800"
                                    : endpoint.method === "PUT"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {endpoint.method}
                              </span>
                              <h3 className="text-lg font-semibold text-neutral-900 font-mono">
                                {endpoint.path}
                              </h3>
                              {endpoint.isDeprecated && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Deprecated
                                </span>
                              )}
                              {!endpoint.isPublic && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                  Private
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-600 mb-3">
                              {endpoint.description}
                            </p>
                            <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                              <div className="flex items-center">
                                <Code className="h-4 w-4 mr-1" />
                                <span>{endpoint.category}</span>
                              </div>
                              <div className="flex items-center">
                                <Terminal className="h-4 w-4 mr-1" />
                                <span>{endpoint.version}</span>
                              </div>
                              <div className="flex items-center">
                                <BarChart2 className="h-4 w-4 mr-1" />
                                <span>
                                  {endpoint.requestsCount.toLocaleString()}{" "}
                                  requests
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>
                                  {endpoint.averageResponseTime}ms avg response
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() =>
                                handleToggleEndpointStatus(
                                  endpoint.id,
                                  "isPublic"
                                )
                              }
                              className={`p-2 rounded-md ${
                                endpoint.isPublic
                                  ? "text-green-500 hover:bg-green-50"
                                  : "text-neutral-500 hover:bg-neutral-100"
                              }`}
                              title={
                                endpoint.isPublic
                                  ? "Make private"
                                  : "Make public"
                              }
                            >
                              {endpoint.isPublic ? (
                                <Unlock className="h-5 w-5" />
                              ) : (
                                <Lock className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleToggleEndpointStatus(
                                  endpoint.id,
                                  "isDeprecated"
                                )
                              }
                              className={`p-2 rounded-md ${
                                endpoint.isDeprecated
                                  ? "text-red-500 hover:bg-red-50"
                                  : "text-neutral-500 hover:bg-neutral-100"
                              }`}
                              title={
                                endpoint.isDeprecated
                                  ? "Mark as active"
                                  : "Mark as deprecated"
                              }
                            >
                              {endpoint.isDeprecated ? (
                                <AlertTriangle className="h-5 w-5" />
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditItem(endpoint)}
                              className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                              title="Edit endpoint"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(endpoint.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                              title="Delete endpoint"
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
                    <Code className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-900 mb-1">
                      No API endpoints found
                    </h3>
                    <p className="text-neutral-500 mb-4">
                      {searchQuery ||
                      categoryFilter !== "all" ||
                      statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "Get started by creating your first API endpoint"}
                    </p>
                    {!searchQuery &&
                      categoryFilter === "all" &&
                      statusFilter === "all" && (
                        <button
                          onClick={handleCreateAPIEndpoint}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First API Endpoint
                        </button>
                      )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* API Usage */}
          {activeTab === "usage" && (
            <>
              {isLoading ? (
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                  <div className="animate-pulse space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-24 bg-neutral-200 rounded-lg"
                        ></div>
                      ))}
                    </div>
                    <div className="h-64 bg-neutral-200 rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-48 bg-neutral-200 rounded-lg"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : apiUsage ? (
                <div className="space-y-8">
                  {/* Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        title: "Total Requests",
                        value: apiUsage.totalRequests.toLocaleString(),
                        icon: BarChart2,
                        color: "text-blue-500",
                        bgColor: "bg-blue-100",
                      },
                      {
                        title: "Unique Users",
                        value: apiUsage.uniqueUsers.toLocaleString(),
                        icon: Users,
                        color: "text-green-500",
                        bgColor: "bg-green-100",
                      },
                      {
                        title: "Avg Response Time",
                        value: `${apiUsage.averageResponseTime}ms`,
                        icon: Clock,
                        color: "text-amber-500",
                        bgColor: "bg-amber-100",
                      },
                      {
                        title: "Error Rate",
                        value: `${apiUsage.errorRate}%`,
                        icon: AlertTriangle,
                        color: "text-red-500",
                        bgColor: "bg-red-100",
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
                            <div className="text-sm text-neutral-600">
                              {stat.title}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Requests Over Time Chart */}
                  <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                      Requests Over Time
                    </h2>
                    <div className="h-64 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                      <p className="text-neutral-500">
                        Chart visualization would go here
                      </p>
                    </div>
                  </div>

                  {/* Top Endpoints and Users */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Top Endpoints */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Top Endpoints
                      </h2>
                      <div className="space-y-4">
                        {apiUsage.topEndpoints.map((endpoint, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <Terminal className="h-4 w-4 text-primary-600" />
                              </div>
                              <div className="font-mono text-sm text-neutral-800">
                                {endpoint.path}
                              </div>
                            </div>
                            <div className="text-sm font-medium text-neutral-700">
                              {endpoint.count.toLocaleString()} requests
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Users */}
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
                      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                        Top API Users
                      </h2>
                      <div className="space-y-4">
                        {apiUsage.topUsers.map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="text-sm font-medium text-neutral-800">
                                {user.name}
                              </div>
                            </div>
                            <div className="text-sm font-medium text-neutral-700">
                              {user.count.toLocaleString()} requests
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
                  <BarChart2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    No API usage data available
                  </h3>
                  <p className="text-neutral-500">
                    There is no API usage data to display at this time
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAPI;
