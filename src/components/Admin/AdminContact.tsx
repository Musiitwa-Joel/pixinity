import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  Reply,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

const AdminContact: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery, statusFilter, sortBy]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setMessages([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          subject: "Question about photo licensing",
          message:
            "Hello, I'm interested in using some photos for my commercial project. Could you please explain the licensing options available?",
          status: "new",
          createdAt: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 days ago
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          subject: "Technical support needed",
          message:
            "I'm having trouble uploading my photos. The upload process keeps failing after 50%. Can you help me resolve this issue?",
          status: "read",
          createdAt: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString(), // 5 days ago
        },
        {
          id: "3",
          name: "Michael Johnson",
          email: "michael@example.com",
          subject: "Partnership opportunity",
          message:
            "Our company would like to discuss a potential partnership with Pixinity. We have a large collection of professional photos that we'd like to share on your platform.",
          status: "replied",
          createdAt: new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString(), // 10 days ago
        },
      ]);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("Failed to load contact messages");
    } finally {
      setIsLoading(false);
    }
  };

  const filterMessages = () => {
    let result = [...messages];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (message) =>
          message.name.toLowerCase().includes(query) ||
          message.email.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((message) => message.status === statusFilter);
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
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    setFilteredMessages(result);
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      // In a real implementation, you would make an API call to mark the message as read
      // For now, we'll simulate updating the message status

      setMessages(
        messages.map((message) =>
          message.id === messageId ? { ...message, status: "read" } : message
        )
      );

      toast.success("Message marked as read");
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error("Failed to mark message as read");
    }
  };

  const handleArchiveMessage = async (messageId: string) => {
    try {
      // In a real implementation, you would make an API call to archive the message
      // For now, we'll simulate updating the message status

      setMessages(
        messages.map((message) =>
          message.id === messageId
            ? { ...message, status: "archived" }
            : message
        )
      );

      toast.success("Message archived");
    } catch (error) {
      console.error("Error archiving message:", error);
      toast.error("Failed to archive message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the message
      // For now, we'll simulate deleting the message

      setMessages(messages.filter((message) => message.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }

      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsSending(true);
    try {
      // In a real implementation, you would make an API call to send the reply
      // For now, we'll simulate sending the reply

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessages(
        messages.map((message) =>
          message.id === selectedMessage.id
            ? { ...message, status: "replied" }
            : message
        )
      );

      toast.success("Reply sent successfully");
      setReplyText("");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            New
          </span>
        );
      case "read":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Read
          </span>
        );
      case "replied":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Replied
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Contact Messages
        </h1>
        <p className="text-neutral-600">
          Manage and respond to messages from your contact form
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
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="a-z">A-Z by Name</option>
            <option value="z-a">Z-A by Name</option>
          </select>
        </div>

        <button
          onClick={fetchMessages}
          className="btn-outline flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">
              Messages ({filteredMessages.length})
            </h2>
          </div>

          <div className="overflow-y-auto max-h-[600px]">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (message.status === "new") {
                        handleMarkAsRead(message.id);
                      }
                    }}
                    className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                      selectedMessage?.id === message.id
                        ? "bg-primary-50 border-l-4 border-primary-500"
                        : ""
                    } ${message.status === "new" ? "font-semibold" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-neutral-900 truncate">
                        {message.subject}
                      </h3>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="text-sm text-neutral-600 truncate mb-1">
                      From: {message.name} ({message.email})
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(message.createdAt).toLocaleDateString()} at{" "}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">
                  No messages found
                </h3>
                <p className="text-neutral-500">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You don't have any contact messages yet"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-neutral-900">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleArchiveMessage(selectedMessage.id)}
                      className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
                      title="Archive message"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                      title="Delete message"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-neutral-500">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">
                    {selectedMessage.name} ({selectedMessage.email})
                  </span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(selectedMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow">
                <div className="prose max-w-none">
                  <p>{selectedMessage.message}</p>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  Reply to this message
                </h3>
                <div className="mb-4">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Type your reply here..."
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    disabled={isSending || !replyText.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Reply className="h-4 w-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">
                  No message selected
                </h3>
                <p className="text-neutral-500">
                  Select a message from the list to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
