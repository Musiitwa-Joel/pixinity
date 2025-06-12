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
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  ArrowLeft,
  Upload,
  Image,
  Globe,
  Award,
  Star,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";

interface PressRelease {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  publishDate: string;
  source?: string;
  sourceUrl?: string;
  featured: boolean;
  isVisible: boolean;
  viewsCount: number;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaMention {
  id: string;
  title: string;
  publication: string;
  publicationLogo?: string;
  date: string;
  url: string;
  excerpt: string;
  featured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PressKit {
  id: string;
  title: string;
  description: string;
  files: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: string;
  }[];
  isVisible: boolean;
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}

const AdminPress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"releases" | "mentions" | "kits">(
    "releases"
  );
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [filteredReleases, setFilteredReleases] = useState<PressRelease[]>([]);
  const [mediaMentions, setMediaMentions] = useState<MediaMention[]>([]);
  const [filteredMentions, setFilteredMentions] = useState<MediaMention[]>([]);
  const [pressKits, setPressKits] = useState<PressKit[]>([]);
  const [filteredKits, setFilteredKits] = useState<PressKit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (activeTab === "releases") {
      fetchPressReleases();
    } else if (activeTab === "mentions") {
      fetchMediaMentions();
    } else if (activeTab === "kits") {
      fetchPressKits();
    }
  }, [activeTab]);

  useEffect(() => {
    filterItems();
  }, [
    pressReleases,
    mediaMentions,
    pressKits,
    searchQuery,
    statusFilter,
    sortBy,
    activeTab,
  ]);

  const fetchPressReleases = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setPressReleases([
        {
          id: "1",
          title: "Pixinity Launches New AI-Powered Search Feature",
          slug: "pixinity-launches-ai-search",
          summary:
            "Pixinity introduces advanced AI-powered search capabilities to help photographers find the perfect reference images.",
          content:
            'Pixinity, the leading platform for photographers and visual creators, today announced the launch of its new AI-powered search feature. This innovative technology allows users to find images based on complex descriptions, visual similarity, and even emotional tone.\n\nThe new search capabilities leverage state-of-the-art machine learning algorithms to understand the content and context of images, making it easier than ever for photographers to find inspiration and reference material.\n\n"We\'re excited to bring this advanced technology to our community," said Sarah Chen, CEO of Pixinity. "Our mission has always been to empower photographers, and this new search feature will help them find exactly what they\'re looking for, even when they don\'t have the perfect keywords in mind."\n\nThe feature is now available to all Pixinity users at no additional cost.',
          coverImage:
            "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
          publishDate: "2025-06-01T10:00:00.000Z",
          featured: true,
          isVisible: true,
          viewsCount: 1245,
          downloadsCount: 78,
          createdAt: "2025-05-25T14:30:00.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
        {
          id: "2",
          title: "Pixinity Reaches 10 Million User Milestone",
          slug: "pixinity-reaches-10-million-users",
          summary:
            "Photography platform Pixinity celebrates reaching 10 million registered users worldwide.",
          content:
            'Pixinity, the fast-growing photography platform, announced today that it has surpassed 10 million registered users worldwide. This milestone represents a significant achievement for the company, which launched just three years ago.\n\nThe platform has seen rapid growth, particularly in the last year, with a 150% increase in new user registrations. Photographers from over 190 countries now use Pixinity to share their work, connect with peers, and find opportunities.\n\n"Reaching 10 million users is a testament to the incredible community we\'ve built together," said Alex Rodriguez, CTO of Pixinity. "We\'re grateful to every photographer who has chosen our platform to showcase their creativity."\n\nTo celebrate this milestone, Pixinity is launching a special photography contest with prizes valued at over $50,000, including professional camera equipment and exclusive mentorship opportunities.',
          coverImage:
            "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
          publishDate: "2025-05-15T09:00:00.000Z",
          source: "PR Newswire",
          sourceUrl:
            "https://www.prnewswire.com/news-releases/pixinity-reaches-10-million-users",
          featured: false,
          isVisible: true,
          viewsCount: 2356,
          downloadsCount: 134,
          createdAt: "2025-05-10T11:45:00.000Z",
          updatedAt: "2025-05-15T09:00:00.000Z",
        },
        {
          id: "3",
          title: "Pixinity Announces Strategic Partnership with Adobe",
          slug: "pixinity-adobe-partnership",
          summary:
            "Pixinity and Adobe announce strategic partnership to integrate services and enhance creative workflows.",
          content:
            'Pixinity and Adobe today announced a strategic partnership that will bring integrated services to photographers and creative professionals worldwide. The collaboration will allow seamless workflows between Pixinity\'s vast photo library and Adobe\'s industry-leading creative applications.\n\nUnder the partnership, Pixinity users will gain access to specialized Adobe Creative Cloud features directly within the Pixinity platform. Additionally, Adobe users will be able to search and import Pixinity images without leaving their Creative Cloud applications.\n\n"This partnership represents a significant step forward in our mission to provide photographers with the best tools and opportunities," said Maya Patel, Head of Community at Pixinity. "By joining forces with Adobe, we\'re creating a more connected creative ecosystem that benefits our entire community."\n\nThe integrated features will begin rolling out next month, with full implementation expected by the end of the year.',
          coverImage:
            "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg",
          publishDate: "2025-04-20T13:15:00.000Z",
          featured: true,
          isVisible: true,
          viewsCount: 3421,
          downloadsCount: 256,
          createdAt: "2025-04-15T09:30:00.000Z",
          updatedAt: "2025-04-20T13:15:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching press releases:", error);
      toast.error("Failed to load press releases");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMediaMentions = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setMediaMentions([
        {
          id: "1",
          title: "How Pixinity is Revolutionizing the Photography Industry",
          publication: "TechCrunch",
          publicationLogo:
            "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
          date: "2025-06-05T00:00:00.000Z",
          url: "https://techcrunch.com/2025/06/05/how-pixinity-is-revolutionizing-photography/",
          excerpt:
            "Pixinity's innovative approach to connecting photographers with opportunities is changing how visual creators monetize their work...",
          featured: true,
          isVisible: true,
          createdAt: "2025-06-05T14:30:00.000Z",
          updatedAt: "2025-06-05T14:30:00.000Z",
        },
        {
          id: "2",
          title: "The 10 Best Photography Platforms in 2025",
          publication: "Forbes",
          publicationLogo:
            "https://i.forbesimg.com/media/assets/forbes_logo_og_1200x1200.jpg",
          date: "2025-05-20T00:00:00.000Z",
          url: "https://www.forbes.com/2025/05/20/best-photography-platforms/",
          excerpt:
            "Pixinity ranks #2 in our annual list of the best photography platforms, praised for its user-friendly interface and fair compensation model...",
          featured: true,
          isVisible: true,
          createdAt: "2025-05-20T10:15:00.000Z",
          updatedAt: "2025-05-20T10:15:00.000Z",
        },
        {
          id: "3",
          title: "Interview with Pixinity CEO Sarah Chen",
          publication: "Photography Today",
          publicationLogo: "https://example.com/photography-today-logo.png",
          date: "2025-04-15T00:00:00.000Z",
          url: "https://www.photographytoday.com/interviews/sarah-chen-pixinity",
          excerpt:
            "In an exclusive interview, Pixinity CEO Sarah Chen discusses the company's vision, challenges, and plans for the future...",
          featured: false,
          isVisible: true,
          createdAt: "2025-04-15T09:45:00.000Z",
          updatedAt: "2025-04-15T09:45:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching media mentions:", error);
      toast.error("Failed to load media mentions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPressKits = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setPressKits([
        {
          id: "1",
          title: "Pixinity Brand Assets",
          description:
            "Official logos, color palette, typography guidelines, and brand usage examples for Pixinity.",
          files: [
            {
              id: "1",
              name: "Pixinity Logo Pack",
              type: "zip",
              url: "/press-kits/pixinity-logo-pack.zip",
              size: "12.5 MB",
            },
            {
              id: "2",
              name: "Pixinity Brand Guidelines",
              type: "pdf",
              url: "/press-kits/pixinity-brand-guidelines.pdf",
              size: "4.2 MB",
            },
            {
              id: "3",
              name: "Pixinity Color Palette",
              type: "pdf",
              url: "/press-kits/pixinity-color-palette.pdf",
              size: "1.8 MB",
            },
          ],
          isVisible: true,
          downloadsCount: 342,
          createdAt: "2025-01-15T10:00:00.000Z",
          updatedAt: "2025-01-15T10:00:00.000Z",
        },
        {
          id: "2",
          title: "Pixinity Company Information",
          description:
            "Company background, executive bios, mission statement, and key statistics about Pixinity.",
          files: [
            {
              id: "4",
              name: "Pixinity Company Fact Sheet",
              type: "pdf",
              url: "/press-kits/pixinity-fact-sheet.pdf",
              size: "2.1 MB",
            },
            {
              id: "5",
              name: "Executive Team Bios",
              type: "pdf",
              url: "/press-kits/pixinity-executive-bios.pdf",
              size: "3.5 MB",
            },
            {
              id: "6",
              name: "Pixinity Growth Metrics",
              type: "pdf",
              url: "/press-kits/pixinity-growth-metrics.pdf",
              size: "1.2 MB",
            },
          ],
          isVisible: true,
          downloadsCount: 215,
          createdAt: "2025-01-15T11:30:00.000Z",
          updatedAt: "2025-01-15T11:30:00.000Z",
        },
        {
          id: "3",
          title: "Pixinity Product Screenshots",
          description:
            "High-resolution screenshots of the Pixinity platform, mobile app, and key features.",
          files: [
            {
              id: "7",
              name: "Pixinity Platform Screenshots",
              type: "zip",
              url: "/press-kits/pixinity-platform-screenshots.zip",
              size: "45.8 MB",
            },
            {
              id: "8",
              name: "Pixinity Mobile App Screenshots",
              type: "zip",
              url: "/press-kits/pixinity-mobile-screenshots.zip",
              size: "32.4 MB",
            },
          ],
          isVisible: true,
          downloadsCount: 178,
          createdAt: "2025-01-15T13:45:00.000Z",
          updatedAt: "2025-01-15T13:45:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching press kits:", error);
      toast.error("Failed to load press kits");
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    if (activeTab === "releases") {
      let result = [...pressReleases];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (release) =>
            release.title.toLowerCase().includes(query) ||
            release.summary.toLowerCase().includes(query) ||
            release.content.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        if (statusFilter === "visible") {
          result = result.filter((release) => release.isVisible);
        } else if (statusFilter === "hidden") {
          result = result.filter((release) => !release.isVisible);
        } else if (statusFilter === "featured") {
          result = result.filter((release) => release.featured);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "oldest":
          result.sort(
            (a, b) =>
              new Date(a.publishDate).getTime() -
              new Date(b.publishDate).getTime()
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
        default: // newest
          result.sort(
            (a, b) =>
              new Date(b.publishDate).getTime() -
              new Date(a.publishDate).getTime()
          );
      }

      setFilteredReleases(result);
    } else if (activeTab === "mentions") {
      let result = [...mediaMentions];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (mention) =>
            mention.title.toLowerCase().includes(query) ||
            mention.publication.toLowerCase().includes(query) ||
            mention.excerpt.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        if (statusFilter === "visible") {
          result = result.filter((mention) => mention.isVisible);
        } else if (statusFilter === "hidden") {
          result = result.filter((mention) => !mention.isVisible);
        } else if (statusFilter === "featured") {
          result = result.filter((mention) => mention.featured);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case "oldest":
          result.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          break;
        case "title-asc":
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title-desc":
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "publication":
          result.sort((a, b) => a.publication.localeCompare(b.publication));
          break;
        default: // newest
          result.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      }

      setFilteredMentions(result);
    } else if (activeTab === "kits") {
      let result = [...pressKits];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (kit) =>
            kit.title.toLowerCase().includes(query) ||
            kit.description.toLowerCase().includes(query) ||
            kit.files.some((file) => file.name.toLowerCase().includes(query))
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        if (statusFilter === "visible") {
          result = result.filter((kit) => kit.isVisible);
        } else if (statusFilter === "hidden") {
          result = result.filter((kit) => !kit.isVisible);
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
        case "downloads":
          result.sort((a, b) => b.downloadsCount - a.downloadsCount);
          break;
        default: // newest
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }

      setFilteredKits(result);
    }
  };

  const handleCreatePressRelease = () => {
    const newRelease: PressRelease = {
      id: `release-${Date.now()}`,
      title: "New Press Release",
      slug: "new-press-release",
      summary: "Write a short summary of the press release here.",
      content: "Write the full content of the press release here.",
      coverImage:
        "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
      publishDate: new Date().toISOString(),
      featured: false,
      isVisible: false,
      viewsCount: 0,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPressReleases([newRelease, ...pressReleases]);
    setCurrentItem(newRelease);
    setFormData({
      title: newRelease.title,
      slug: newRelease.slug,
      summary: newRelease.summary,
      content: newRelease.content,
      coverImage: newRelease.coverImage,
      publishDate: new Date(newRelease.publishDate).toISOString().split("T")[0],
      source: newRelease.source || "",
      sourceUrl: newRelease.sourceUrl || "",
      featured: newRelease.featured,
      isVisible: newRelease.isVisible,
    });
    setIsEditing(true);
  };

  const handleCreateMediaMention = () => {
    const newMention: MediaMention = {
      id: `mention-${Date.now()}`,
      title: "New Media Mention",
      publication: "Publication Name",
      date: new Date().toISOString(),
      url: "https://example.com/article",
      excerpt: "Write a short excerpt from the article here.",
      featured: false,
      isVisible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMediaMentions([newMention, ...mediaMentions]);
    setCurrentItem(newMention);
    setFormData({
      title: newMention.title,
      publication: newMention.publication,
      publicationLogo: newMention.publicationLogo || "",
      date: new Date(newMention.date).toISOString().split("T")[0],
      url: newMention.url,
      excerpt: newMention.excerpt,
      featured: newMention.featured,
      isVisible: newMention.isVisible,
    });
    setIsEditing(true);
  };

  const handleCreatePressKit = () => {
    const newKit: PressKit = {
      id: `kit-${Date.now()}`,
      title: "New Press Kit",
      description: "Write a description of the press kit here.",
      files: [],
      isVisible: false,
      downloadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPressKits([newKit, ...pressKits]);
    setCurrentItem(newKit);
    setFormData({
      title: newKit.title,
      description: newKit.description,
      files: newKit.files,
      isVisible: newKit.isVisible,
    });
    setIsEditing(true);
  };

  const handleEditItem = (item: any) => {
    setCurrentItem(item);

    if (activeTab === "releases") {
      setFormData({
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        content: item.content,
        coverImage: item.coverImage,
        publishDate: new Date(item.publishDate).toISOString().split("T")[0],
        source: item.source || "",
        sourceUrl: item.sourceUrl || "",
        featured: item.featured,
        isVisible: item.isVisible,
      });
    } else if (activeTab === "mentions") {
      setFormData({
        title: item.title,
        publication: item.publication,
        publicationLogo: item.publicationLogo || "",
        date: new Date(item.date).toISOString().split("T")[0],
        url: item.url,
        excerpt: item.excerpt,
        featured: item.featured,
        isVisible: item.isVisible,
      });
    } else if (activeTab === "kits") {
      setFormData({
        title: item.title,
        description: item.description,
        files: item.files,
        isVisible: item.isVisible,
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

      if (activeTab === "releases") {
        setPressReleases(
          pressReleases.filter((release) => release.id !== itemId)
        );
      } else if (activeTab === "mentions") {
        setMediaMentions(
          mediaMentions.filter((mention) => mention.id !== itemId)
        );
      } else if (activeTab === "kits") {
        setPressKits(pressKits.filter((kit) => kit.id !== itemId));
      }

      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleToggleVisibility = async (itemId: string, isVisible: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the item's visibility
      // For now, we'll simulate updating the visibility

      if (activeTab === "releases") {
        setPressReleases(
          pressReleases.map((release) =>
            release.id === itemId
              ? {
                  ...release,
                  isVisible: !isVisible,
                  updatedAt: new Date().toISOString(),
                }
              : release
          )
        );
      } else if (activeTab === "mentions") {
        setMediaMentions(
          mediaMentions.map((mention) =>
            mention.id === itemId
              ? {
                  ...mention,
                  isVisible: !isVisible,
                  updatedAt: new Date().toISOString(),
                }
              : mention
          )
        );
      } else if (activeTab === "kits") {
        setPressKits(
          pressKits.map((kit) =>
            kit.id === itemId
              ? {
                  ...kit,
                  isVisible: !isVisible,
                  updatedAt: new Date().toISOString(),
                }
              : kit
          )
        );
      }

      toast.success(`Item ${!isVisible ? "published" : "hidden"} successfully`);
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const handleToggleFeatured = async (itemId: string, isFeatured: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the item's featured status
      // For now, we'll simulate updating the featured status

      if (activeTab === "releases") {
        setPressReleases(
          pressReleases.map((release) =>
            release.id === itemId
              ? {
                  ...release,
                  featured: !isFeatured,
                  updatedAt: new Date().toISOString(),
                }
              : release
          )
        );
      } else if (activeTab === "mentions") {
        setMediaMentions(
          mediaMentions.map((mention) =>
            mention.id === itemId
              ? {
                  ...mention,
                  featured: !isFeatured,
                  updatedAt: new Date().toISOString(),
                }
              : mention
          )
        );
      }

      toast.success(
        `Item ${!isFeatured ? "featured" : "unfeatured"} successfully`
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleSaveItem = async () => {
    if (!currentItem) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the item
      // For now, we'll simulate updating the item

      if (activeTab === "releases") {
        const updatedRelease: PressRelease = {
          ...currentItem,
          title: formData.title,
          slug: formData.slug,
          summary: formData.summary,
          content: formData.content,
          coverImage: formData.coverImage,
          publishDate: new Date(formData.publishDate).toISOString(),
          source: formData.source,
          sourceUrl: formData.sourceUrl,
          featured: formData.featured,
          isVisible: formData.isVisible,
          updatedAt: new Date().toISOString(),
        };

        setPressReleases(
          pressReleases.map((release) =>
            release.id === updatedRelease.id ? updatedRelease : release
          )
        );
      } else if (activeTab === "mentions") {
        const updatedMention: MediaMention = {
          ...currentItem,
          title: formData.title,
          publication: formData.publication,
          publicationLogo: formData.publicationLogo,
          date: new Date(formData.date).toISOString(),
          url: formData.url,
          excerpt: formData.excerpt,
          featured: formData.featured,
          isVisible: formData.isVisible,
          updatedAt: new Date().toISOString(),
        };

        setMediaMentions(
          mediaMentions.map((mention) =>
            mention.id === updatedMention.id ? updatedMention : mention
          )
        );
      } else if (activeTab === "kits") {
        const updatedKit: PressKit = {
          ...currentItem,
          title: formData.title,
          description: formData.description,
          files: formData.files,
          isVisible: formData.isVisible,
          updatedAt: new Date().toISOString(),
        };

        setPressKits(
          pressKits.map((kit) => (kit.id === updatedKit.id ? updatedKit : kit))
        );
      }

      toast.success("Item saved successfully");
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFile = () => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: "New File",
      type: "pdf",
      url: "",
      size: "0 KB",
    };

    setFormData({
      ...formData,
      files: [...formData.files, newFile],
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setFormData({
      ...formData,
      files: formData.files.filter((file: any) => file.id !== fileId),
    });
  };

  const handleUpdateFile = (fileId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      files: formData.files.map((file: any) =>
        file.id === fileId ? { ...file, [field]: value } : file
      ),
    });
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
                onClick={() => setIsEditing(false)}
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
            {/* Press Release Form */}
            {activeTab === "releases" && (
              <div className="space-y-6">
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Summary
                  </label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) =>
                      setFormData({ ...formData, summary: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Source (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., PR Newswire"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Source URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.sourceUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, sourceUrl: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com/press-release"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-900">
                      Featured (highlighted on press page)
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isVisible: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-900">
                      Visible (published on website)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Media Mention Form */}
            {activeTab === "mentions" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Publication Name
                    </label>
                    <input
                      type="text"
                      value={formData.publication}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publication: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., TechCrunch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Publication Logo URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.publicationLogo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publicationLogo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Publication Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Article URL
                    </label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com/article"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="A short excerpt from the article..."
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-900">
                      Featured (highlighted on press page)
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isVisible: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-900">
                      Visible (published on website)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Press Kit Form */}
            {activeTab === "kits" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Press Kit Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
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
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-700">
                      Files
                    </label>
                    <button
                      onClick={handleAddFile}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add File
                    </button>
                  </div>

                  {formData.files && formData.files.length > 0 ? (
                    <div className="space-y-4">
                      {formData.files.map((file: any) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                        >
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                File Name
                              </label>
                              <input
                                type="text"
                                value={file.name}
                                onChange={(e) =>
                                  handleUpdateFile(
                                    file.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                File Type
                              </label>
                              <select
                                value={file.type}
                                onChange={(e) =>
                                  handleUpdateFile(
                                    file.id,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="pdf">PDF</option>
                                <option value="zip">ZIP</option>
                                <option value="png">PNG</option>
                                <option value="jpg">JPG</option>
                                <option value="ai">AI</option>
                                <option value="psd">PSD</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                File URL
                              </label>
                              <input
                                type="text"
                                value={file.url}
                                onChange={(e) =>
                                  handleUpdateFile(
                                    file.id,
                                    "url",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-700 mb-1">
                                File Size
                              </label>
                              <input
                                type="text"
                                value={file.size}
                                onChange={(e) =>
                                  handleUpdateFile(
                                    file.id,
                                    "size",
                                    e.target.value
                                  )
                                }
                                className="w-full px-2 py-1 text-sm border border-neutral-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., 2.5 MB"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(file.id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-neutral-300 rounded-lg">
                      <Download className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-neutral-500">No files added yet</p>
                      <button
                        onClick={handleAddFile}
                        className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add First File
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isVisible: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm text-neutral-900">
                      Visible (published on website)
                    </span>
                  </label>
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
                Press Management
              </h1>
              <p className="text-neutral-600">
                Manage press releases, media mentions, and press kits
              </p>
            </div>
            <button
              onClick={() => {
                if (activeTab === "releases") {
                  handleCreatePressRelease();
                } else if (activeTab === "mentions") {
                  handleCreateMediaMention();
                } else if (activeTab === "kits") {
                  handleCreatePressKit();
                }
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>
                Create{" "}
                {activeTab === "releases"
                  ? "Press Release"
                  : activeTab === "mentions"
                  ? "Media Mention"
                  : "Press Kit"}
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-200 mb-6">
            <button
              onClick={() => setActiveTab("releases")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "releases"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Press Releases</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("mentions")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "mentions"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Media Mentions</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("kits")}
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "kits"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Press Kits</span>
              </div>
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
                  placeholder={`Search ${activeTab}...`}
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
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
                {activeTab !== "kits" && (
                  <option value="featured">Featured</option>
                )}
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
                {activeTab === "releases" && (
                  <option value="views">Most Views</option>
                )}
                {activeTab === "mentions" && (
                  <option value="publication">By Publication</option>
                )}
                {activeTab === "kits" && (
                  <option value="downloads">Most Downloads</option>
                )}
              </select>
            </div>

            <button
              onClick={() => {
                if (activeTab === "releases") {
                  fetchPressReleases();
                } else if (activeTab === "mentions") {
                  fetchMediaMentions();
                } else if (activeTab === "kits") {
                  fetchPressKits();
                }
              }}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Press Releases List */}
          {activeTab === "releases" && (
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
              ) : filteredReleases.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredReleases.map((release) => (
                    <div key={release.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {release.title}
                            </h3>
                            {release.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                release.isVisible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {release.isVisible ? "Published" : "Draft"}
                            </span>
                          </div>
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {release.summary}
                          </p>
                          <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(
                                  release.publishDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {release.source && (
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-1" />
                                <span>{release.source}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{release.viewsCount} views</span>
                            </div>
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              <span>{release.downloadsCount} downloads</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() =>
                              handleToggleVisibility(
                                release.id,
                                release.isVisible
                              )
                            }
                            className={`p-2 rounded-md ${
                              release.isVisible
                                ? "text-green-500 hover:bg-green-50"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                            title={release.isVisible ? "Hide" : "Publish"}
                          >
                            {release.isVisible ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleToggleFeatured(release.id, release.featured)
                            }
                            className={`p-2 rounded-md ${
                              release.featured
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                            title={release.featured ? "Unfeature" : "Feature"}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                release.featured ? "fill-amber-500" : ""
                              }`}
                            />
                          </button>
                          <a
                            href={`/press/${release.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="View press release"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleEditItem(release)}
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="Edit press release"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(release.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete press release"
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
                    No press releases found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by creating your first press release"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <button
                      onClick={handleCreatePressRelease}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Press Release
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Media Mentions List */}
          {activeTab === "mentions" && (
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
              ) : filteredMentions.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredMentions.map((mention) => (
                    <div key={mention.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {mention.title}
                            </h3>
                            {mention.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                mention.isVisible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {mention.isVisible ? "Published" : "Hidden"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mb-3">
                            {mention.publicationLogo && (
                              <img
                                src={mention.publicationLogo}
                                alt={mention.publication}
                                className="h-6 w-6 object-contain"
                              />
                            )}
                            <span className="font-medium text-neutral-700">
                              {mention.publication}
                            </span>
                            <span className="text-sm text-neutral-500">
                              {new Date(mention.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-neutral-600 mb-3 line-clamp-2">
                            {mention.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() =>
                              handleToggleVisibility(
                                mention.id,
                                mention.isVisible
                              )
                            }
                            className={`p-2 rounded-md ${
                              mention.isVisible
                                ? "text-green-500 hover:bg-green-50"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                            title={mention.isVisible ? "Hide" : "Publish"}
                          >
                            {mention.isVisible ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleToggleFeatured(mention.id, mention.featured)
                            }
                            className={`p-2 rounded-md ${
                              mention.featured
                                ? "text-amber-500 hover:bg-amber-50"
                                : "text-neutral-500 hover:bg-neutral-100"
                            }`}
                            title={mention.featured ? "Unfeature" : "Feature"}
                          >
                            <Star
                              className={`h-5 w-5 ${
                                mention.featured ? "fill-amber-500" : ""
                              }`}
                            />
                          </button>
                          <a
                            href={mention.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="View article"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleEditItem(mention)}
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="Edit media mention"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(mention.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete media mention"
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
                  <Globe className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    No media mentions found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by adding your first media mention"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <button
                      onClick={handleCreateMediaMention}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Media Mention
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Press Kits List */}
          {activeTab === "kits" && (
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
              ) : filteredKits.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredKits.map((kit) => (
                    <div key={kit.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-neutral-900">
                              {kit.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                kit.isVisible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {kit.isVisible ? "Published" : "Hidden"}
                            </span>
                          </div>
                          <p className="text-neutral-600 mb-3">
                            {kit.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {kit.files.map((file) => (
                              <div
                                key={file.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-700"
                              >
                                {file.type === "pdf" ? (
                                  <FileText className="h-3 w-3 mr-1" />
                                ) : file.type === "zip" ? (
                                  <Download className="h-3 w-3 mr-1" />
                                ) : (
                                  <Image className="h-3 w-3 mr-1" />
                                )}
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-neutral-500 space-x-4">
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              <span>{kit.downloadsCount} downloads</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                Updated:{" "}
                                {new Date(kit.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() =>
                              handleToggleVisibility(kit.id, kit.isVisible)
                            }
                            className={`p-2 rounded-md ${
                              kit.isVisible
                                ? "text-green-500 hover:bg-green-50"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                            title={kit.isVisible ? "Hide" : "Publish"}
                          >
                            {kit.isVisible ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditItem(kit)}
                            className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                            title="Edit press kit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(kit.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete press kit"
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
                  <Download className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">
                    No press kits found
                  </h3>
                  <p className="text-neutral-500 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Get started by creating your first press kit"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <button
                      onClick={handleCreatePressKit}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Press Kit
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

export default AdminPress;
