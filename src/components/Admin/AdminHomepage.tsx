import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Edit,
  Save,
  Plus,
  Trash2,
  Image,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layout,
  Layers,
  Type,
  FileText,
  Link as LinkIcon,
  Upload,
  MessageSquare,
  Star,
  Search,
  X,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

interface HomepageSection {
  id: string;
  title: string;
  type: string;
  content: any;
  isVisible: boolean;
  order: number;
}

interface Photo {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  featured: boolean;
  viewsCount: number;
  likesCount: number;
  downloadsCount: number;
}

const AdminHomepage: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(
    null
  );
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionType, setNewSectionType] = useState("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchHomepageSections();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredPhotos(
        photos.filter(
          (photo) =>
            photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredPhotos(photos);
    }
  }, [searchQuery, photos]);

  const fetchHomepageSections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/homepage/sections",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        throw new Error("Failed to fetch homepage sections");
      }
    } catch (error) {
      console.error("Error fetching homepage sections:", error);
      toast.error("Failed to load homepage sections");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPhotos = async () => {
    setIsLoadingPhotos(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/homepage/photos",
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
        setFilteredPhotos(data);
      } else {
        throw new Error("Failed to fetch photos");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Failed to load photos");
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to save the sections
      // For now, we'll just simulate a successful save

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Homepage updated successfully");
    } catch (error) {
      console.error("Error saving homepage sections:", error);
      toast.error("Failed to save homepage sections");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = () => {
    const newSection: HomepageSection = {
      id: `section-${Date.now()}`,
      title: getDefaultTitleForType(newSectionType),
      type: newSectionType,
      isVisible: true,
      order: sections.length + 1,
      content: getDefaultContentForType(newSectionType),
    };

    setSections([...sections, newSection]);
    setShowAddSectionModal(false);
    toast.success("Section added successfully");
  };

  const handleDeleteSection = (sectionId: string) => {
    setSectionToDelete(sectionId);
    setShowConfirmModal(true);
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;

    try {
      // In a real implementation, you would make an API call to delete the section
      setSections(sections.filter((section) => section.id !== sectionToDelete));
      toast.success("Section deleted successfully");
    } catch (error) {
      console.error("Error deleting section:", error);
      toast.error("Failed to delete section");
    } finally {
      setShowConfirmModal(false);
      setSectionToDelete(null);
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isVisible: !section.isVisible }
          : section
      )
    );
  };

  const handleMoveSection = (sectionId: string, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (
      (direction === "up" && sectionIndex === 0) ||
      (direction === "down" && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex =
      direction === "up" ? sectionIndex - 1 : sectionIndex + 1;

    // Swap the sections
    [newSections[sectionIndex], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[sectionIndex],
    ];

    // Update order values
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setSections(newSections);
  };

  const handleEditSection = (section: HomepageSection) => {
    setEditingSection({ ...section });
  };

  const handleSaveEdit = () => {
    if (!editingSection) return;

    setSections(
      sections.map((section) =>
        section.id === editingSection.id ? editingSection : section
      )
    );

    setEditingSection(null);
    toast.success("Section updated successfully");
  };

  const getDefaultTitleForType = (type: string): string => {
    switch (type) {
      case "hero":
        return "Hero Section";
      case "features":
        return "Features Section";
      case "categories":
        return "Categories Section";
      case "testimonials":
        return "Testimonials Section";
      case "cta":
        return "Call to Action Section";
      case "stats":
        return "Statistics Section";
      case "masterpieces":
        return "Handpicked Masterpieces";
      default:
        return "New Section";
    }
  };

  const getDefaultContentForType = (type: string): any => {
    switch (type) {
      case "hero":
        return {
          heading: "Discover Beautiful Photography",
          subheading: "Explore high-quality photos from talented creators",
          ctaText: "Start Exploring",
          ctaLink: "/explore",
          secondaryCtaText: "Join Free",
          secondaryCtaLink: "/signup",
          backgroundImage:
            "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
        };
      case "features":
        return {
          heading: "Why Choose Pixinity",
          features: [
            {
              title: "Feature 1",
              description: "Description for feature 1",
              icon: "image",
            },
            {
              title: "Feature 2",
              description: "Description for feature 2",
              icon: "search",
            },
            {
              title: "Feature 3",
              description: "Description for feature 3",
              icon: "users",
            },
          ],
        };
      case "categories":
        return {
          heading: "Explore Categories",
          categories: [
            {
              name: "Category 1",
              image:
                "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
              link: "/categories/category1",
            },
            {
              name: "Category 2",
              image:
                "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
              link: "/categories/category2",
            },
            {
              name: "Category 3",
              image:
                "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg",
              link: "/categories/category3",
            },
          ],
        };
      case "testimonials":
        return {
          heading: "What Our Users Say",
          testimonials: [
            {
              name: "User 1",
              role: "Photographer",
              content: "Testimonial content 1",
              avatar: "",
            },
            {
              name: "User 2",
              role: "Designer",
              content: "Testimonial content 2",
              avatar: "",
            },
            {
              name: "User 3",
              role: "Marketer",
              content: "Testimonial content 3",
              avatar: "",
            },
          ],
        };
      case "cta":
        return {
          heading: "Ready to Get Started?",
          subheading: "Join our community of photographers and creators",
          ctaText: "Sign Up Now",
          ctaLink: "/signup",
          backgroundImage:
            "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
        };
      case "stats":
        return {
          heading: "Pixinity in Numbers",
          stats: [
            {
              value: "1M+",
              label: "Photographers",
            },
            {
              value: "10M+",
              label: "Photos",
            },
            {
              value: "50M+",
              label: "Downloads",
            },
            {
              value: "100+",
              label: "Countries",
            },
          ],
        };
      case "masterpieces":
        return {
          heading: "Handpicked Masterpieces",
          subheading:
            "Curated selection of exceptional photography from our community",
          photoIds: [],
        };
      default:
        return {};
    }
  };

  const handleTogglePhotoFeature = async (
    photoId: string,
    featured: boolean
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/homepage/photos/${photoId}/featured`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ featured: !featured }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update local state
        setPhotos(
          photos.map((photo) =>
            photo.id === photoId ? { ...photo, featured: !featured } : photo
          )
        );
        setFilteredPhotos(
          filteredPhotos.map((photo) =>
            photo.id === photoId ? { ...photo, featured: !featured } : photo
          )
        );
        toast.success(data.message);
      } else {
        throw new Error("Failed to update photo");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update photo");
    }
  };

  const handleManagePhotos = () => {
    setShowPhotoSelector(true);
    fetchPhotos();
  };

  const renderSectionEditor = () => {
    if (!editingSection) return null;

    switch (editingSection.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Heading
              </label>
              <input
                type="text"
                value={editingSection.content.heading}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      heading: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Subheading
              </label>
              <input
                type="text"
                value={editingSection.content.subheading}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      subheading: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  CTA Text
                </label>
                <input
                  type="text"
                  value={editingSection.content.ctaText}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      content: {
                        ...editingSection.content,
                        ctaText: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={editingSection.content.ctaLink}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      content: {
                        ...editingSection.content,
                        ctaLink: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={editingSection.content.secondaryCtaText}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      content: {
                        ...editingSection.content,
                        secondaryCtaText: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Secondary CTA Link
                </label>
                <input
                  type="text"
                  value={editingSection.content.secondaryCtaLink}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      content: {
                        ...editingSection.content,
                        secondaryCtaLink: e.target.value,
                      },
                    })
                  }
                  className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Background Image URL
              </label>
              <input
                type="text"
                value={editingSection.content.backgroundImage}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      backgroundImage: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {editingSection.content.backgroundImage && (
                <div className="mt-2">
                  <img
                    src={editingSection.content.backgroundImage}
                    alt="Background preview"
                    className="h-32 w-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case "features":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Heading
              </label>
              <input
                type="text"
                value={editingSection.content.heading}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      heading: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Features
              </label>
              {editingSection.content.features.map(
                (feature: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border border-neutral-200 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newFeatures = [
                            ...editingSection.content.features,
                          ];
                          newFeatures.splice(index, 1);
                          setEditingSection({
                            ...editingSection,
                            content: {
                              ...editingSection.content,
                              features: newFeatures,
                            },
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700">
                          Title
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [
                              ...editingSection.content.features,
                            ];
                            newFeatures[index].title = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                features: newFeatures,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700">
                          Description
                        </label>
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [
                              ...editingSection.content.features,
                            ];
                            newFeatures[index].description = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                features: newFeatures,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700">
                          Icon
                        </label>
                        <select
                          value={feature.icon}
                          onChange={(e) => {
                            const newFeatures = [
                              ...editingSection.content.features,
                            ];
                            newFeatures[index].icon = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                features: newFeatures,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="image">Image</option>
                          <option value="search">Search</option>
                          <option value="users">Users</option>
                          <option value="heart">Heart</option>
                          <option value="download">Download</option>
                          <option value="camera">Camera</option>
                          <option value="star">Star</option>
                          <option value="shield">Shield</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )
              )}
              <button
                onClick={() => {
                  const newFeatures = [...editingSection.content.features];
                  newFeatures.push({
                    title: "New Feature",
                    description: "Description for new feature",
                    icon: "image",
                  });
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      features: newFeatures,
                    },
                  });
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </button>
            </div>
          </div>
        );

      case "categories":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Heading
              </label>
              <input
                type="text"
                value={editingSection.content.heading}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      heading: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Categories
              </label>
              {editingSection.content.categories.map(
                (category: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border border-neutral-200 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Category {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newCategories = [
                            ...editingSection.content.categories,
                          ];
                          newCategories.splice(index, 1);
                          setEditingSection({
                            ...editingSection,
                            content: {
                              ...editingSection.content,
                              categories: newCategories,
                            },
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            const newCategories = [
                              ...editingSection.content.categories,
                            ];
                            newCategories[index].name = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                categories: newCategories,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={category.image}
                          onChange={(e) => {
                            const newCategories = [
                              ...editingSection.content.categories,
                            ];
                            newCategories[index].image = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                categories: newCategories,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        {category.image && (
                          <div className="mt-1">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-16 w-full object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700">
                          Link
                        </label>
                        <input
                          type="text"
                          value={category.link}
                          onChange={(e) => {
                            const newCategories = [
                              ...editingSection.content.categories,
                            ];
                            newCategories[index].link = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                categories: newCategories,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
              <button
                onClick={() => {
                  const newCategories = [...editingSection.content.categories];
                  newCategories.push({
                    name: "New Category",
                    image:
                      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
                    link: "/categories/new-category",
                  });
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      categories: newCategories,
                    },
                  });
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        );

      case "masterpieces":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Heading
              </label>
              <input
                type="text"
                value={editingSection.content.heading}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      heading: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Subheading
              </label>
              <input
                type="text"
                value={editingSection.content.subheading}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      subheading: e.target.value,
                    },
                  })
                }
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Featured Photos
                </label>
                <button
                  onClick={handleManagePhotos}
                  className="inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Manage Featured Photos
                </button>
              </div>
              <p className="text-sm text-neutral-500 mb-4">
                Featured photos are managed through the photo selector. Click
                the button above to manage featured photos.
              </p>
            </div>
          </div>
        );

      // Add more section type editors as needed

      default:
        return (
          <div className="p-4 bg-neutral-100 rounded-md">
            <p className="text-neutral-600">
              Editor not available for this section type.
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Homepage Management
          </h1>
          <p className="text-neutral-600">
            Customize the content and layout of your homepage
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="btn-outline flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
          <button
            onClick={handleSaveChanges}
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">
            Homepage Preview
          </h2>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Live
          </a>
        </div>
        <div className="bg-neutral-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <Layout className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-600">Homepage Preview</p>
            <p className="text-sm text-neutral-500">
              (Preview functionality coming soon)
            </p>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">
            Homepage Sections
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-neutral-200 rounded-md"></div>
              ))}
            </div>
          </div>
        ) : sections.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div
                  key={section.id}
                  className={`p-6 ${!section.isVisible ? "bg-neutral-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-lg ${
                          section.isVisible
                            ? "bg-green-100 text-green-600"
                            : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {section.type === "hero" ? (
                          <Home className="h-5 w-5" />
                        ) : section.type === "features" ? (
                          <Layers className="h-5 w-5" />
                        ) : section.type === "categories" ? (
                          <Layout className="h-5 w-5" />
                        ) : section.type === "testimonials" ? (
                          <MessageSquare className="h-5 w-5" />
                        ) : section.type === "cta" ? (
                          <LinkIcon className="h-5 w-5" />
                        ) : section.type === "masterpieces" ? (
                          <Star className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                          {section.title}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          Type:{" "}
                          {section.type.charAt(0).toUpperCase() +
                            section.type.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMoveSection(section.id, "up")}
                        disabled={section.order === 1}
                        className={`p-2 rounded-md ${
                          section.order === 1
                            ? "text-neutral-300 cursor-not-allowed"
                            : "text-neutral-500 hover:bg-neutral-100"
                        }`}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(section.id, "down")}
                        disabled={section.order === sections.length}
                        className={`p-2 rounded-md ${
                          section.order === sections.length
                            ? "text-neutral-300 cursor-not-allowed"
                            : "text-neutral-500 hover:bg-neutral-100"
                        }`}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(section.id)}
                        className={`p-2 rounded-md ${
                          section.isVisible
                            ? "text-green-500 hover:bg-green-50"
                            : "text-neutral-500 hover:bg-neutral-100"
                        }`}
                        title={
                          section.isVisible ? "Hide section" : "Show section"
                        }
                      >
                        {section.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditSection(section)}
                        className="p-2 rounded-md text-primary-500 hover:bg-primary-50"
                        title="Edit section"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-2 rounded-md text-red-500 hover:bg-red-50"
                        title="Delete section"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-neutral-100">
              <Layout className="h-12 w-12 text-neutral-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-neutral-900">
              No sections found
            </h3>
            <p className="mt-1 text-neutral-500">
              Get started by adding a new section to your homepage.
            </p>
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </button>
          </div>
        )}
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowAddSectionModal(false)}
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Plus className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Add New Section
                    </h3>
                    <div className="mt-4">
                      <label
                        htmlFor="section-type"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Section Type
                      </label>
                      <select
                        id="section-type"
                        value={newSectionType}
                        onChange={(e) => setNewSectionType(e.target.value)}
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="hero">Hero Section</option>
                        <option value="features">Features Section</option>
                        <option value="categories">Categories Section</option>
                        <option value="testimonials">
                          Testimonials Section
                        </option>
                        <option value="cta">Call to Action Section</option>
                        <option value="stats">Statistics Section</option>
                        <option value="masterpieces">
                          Handpicked Masterpieces
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Section
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setEditingSection(null)}
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Edit className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Edit {editingSection.title}
                    </h3>
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          htmlFor="section-title"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Section Title
                        </label>
                        <input
                          type="text"
                          id="section-title"
                          value={editingSection.title}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              title: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      {renderSectionEditor()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Selector Modal */}
      {showPhotoSelector && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowPhotoSelector(false)}
            >
              <div className="absolute inset-0 bg-neutral-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Image className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Manage Featured Photos
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        Click the star icon to feature or unfeature photos.
                        Featured photos will appear in the "Handpicked
                        Masterpieces" section on the homepage.
                      </p>
                    </div>

                    {/* Search */}
                    <div className="mt-4 mb-6 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search photos..."
                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Featured Photos Count */}
                    <div className="mb-4 flex justify-between items-center">
                      <div className="text-sm text-neutral-500">
                        {photos.filter((p) => p.featured).length} photos
                        featured
                      </div>
                      <button
                        onClick={fetchPhotos}
                        className="inline-flex items-center px-3 py-1 border border-neutral-300 text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                      </button>
                    </div>

                    {/* Photos Grid */}
                    <div className="mt-4 max-h-96 overflow-y-auto">
                      {isLoadingPhotos ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square bg-neutral-200 rounded-lg animate-pulse"
                            />
                          ))}
                        </div>
                      ) : filteredPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {filteredPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative group rounded-lg overflow-hidden"
                            >
                              <img
                                src={photo.thumbnailUrl || photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover aspect-square"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="text-white text-center p-2">
                                  <h4 className="font-medium text-sm line-clamp-2">
                                    {photo.title}
                                  </h4>
                                  <p className="text-xs text-white/80">
                                    by {photo.photographer.firstName}{" "}
                                    {photo.photographer.lastName}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleTogglePhotoFeature(
                                    photo.id,
                                    photo.featured
                                  )
                                }
                                className={`absolute top-2 right-2 p-1.5 rounded-full ${
                                  photo.featured
                                    ? "bg-yellow-500 text-white"
                                    : "bg-white/70 text-neutral-700 hover:bg-white"
                                } transition-colors`}
                                title={
                                  photo.featured
                                    ? "Unfeature photo"
                                    : "Feature photo"
                                }
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    photo.featured ? "fill-white" : ""
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Image className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                          <p className="text-neutral-500">No photos found</p>
                          {searchQuery && (
                            <p className="text-sm text-neutral-400">
                              Try a different search term
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowPhotoSelector(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Delete Section
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        Are you sure you want to delete this section? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteSection}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSectionToDelete(null);
                  }}
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

export default AdminHomepage;
