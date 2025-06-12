import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Info,
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
  User,
  Users,
  Clock,
  UserPlus,
  Award,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Mail,
  Phone,
  Globe,
  ArrowLeft,
  Target,
  Heart,
  BarChart2,
} from "lucide-react";
import toast from "react-hot-toast";

interface AboutSection {
  id: string;
  title: string;
  type: string;
  content: any;
  isVisible: boolean;
  order: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

const AdminAbout: React.FC = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<AboutSection | null>(
    null
  );
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSectionType, setNewSectionType] = useState("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(
    null
  );
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(
    null
  );
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);

  useEffect(() => {
    fetchAboutSections();
  }, []);

  const fetchAboutSections = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setSections([
        {
          id: "hero-section",
          title: "Hero Section",
          type: "hero",
          isVisible: true,
          order: 1,
          content: {
            heading: "About Pixinity",
            subheading:
              "Our mission is to empower photographers and visual storytellers around the world",
            backgroundImage:
              "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
          },
        },
        {
          id: "mission-section",
          title: "Mission Section",
          type: "mission",
          isVisible: true,
          order: 2,
          content: {
            heading: "Our Mission",
            description:
              "Pixinity was founded with a simple but powerful mission: to create a platform where photographers of all levels can share their work, connect with like-minded creators, and grow their skills. We believe that photography has the power to inspire, educate, and bring people together across cultures and boundaries.",
            values: [
              "Democratizing photography for everyone",
              "Supporting creators with fair compensation",
              "Building an inclusive global community",
            ],
          },
        },
        {
          id: "team-section",
          title: "Team Section",
          type: "team",
          isVisible: true,
          order: 3,
          content: {
            heading: "Our Team",
            subheading: "Meet the passionate people behind Pixinity",
          },
        },
        {
          id: "timeline-section",
          title: "Timeline Section",
          type: "timeline",
          isVisible: true,
          order: 4,
          content: {
            heading: "Our Journey",
            subheading: "The story of how Pixinity has evolved over the years",
          },
        },
      ]);

      setTeamMembers([
        {
          id: "1",
          name: "Sarah Chen",
          role: "Founder & CEO",
          bio: "Sarah founded Pixinity in 2019 with a vision to create a platform that truly supports photographers. With a background in both photography and tech, she brings a unique perspective to the company.",
          avatar:
            "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          socialLinks: {
            linkedin: "sarahchen",
            twitter: "sarahchen",
            instagram: "sarahchen.photo",
            website: "sarahchen.com",
          },
        },
        {
          id: "2",
          name: "Alex Rodriguez",
          role: "CTO",
          bio: "Alex leads our engineering team, ensuring Pixinity stays at the cutting edge of technology. He's passionate about creating tools that help photographers showcase their work effectively.",
          avatar:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          socialLinks: {
            linkedin: "alexrodriguez",
            twitter: "alexrtech",
            website: "alexr.dev",
          },
        },
        {
          id: "3",
          name: "Maya Patel",
          role: "Head of Community",
          bio: "Maya oversees all community initiatives at Pixinity. With a background in community building and a passion for photography, she works to create meaningful connections between photographers worldwide.",
          avatar:
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          socialLinks: {
            linkedin: "mayapatel",
            instagram: "maya.community",
          },
        },
        {
          id: "4",
          name: "David Kim",
          role: "Creative Director",
          bio: "David brings his extensive experience as a professional photographer to shape the creative direction of Pixinity. He's dedicated to creating a platform that truly understands photographers' needs.",
          avatar:
            "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          socialLinks: {
            instagram: "davidkim.photo",
            website: "davidkim.photography",
          },
        },
      ]);

      setMilestones([
        {
          id: "1",
          year: "2019",
          title: "The Beginning",
          description:
            "Pixinity was founded with a mission to create a platform that truly supports photographers and visual creators.",
        },
        {
          id: "2",
          year: "2020",
          title: "Community Growth",
          description:
            "Reached our first 100,000 users and launched the collections feature to help photographers organize their work.",
        },
        {
          id: "3",
          year: "2021",
          title: "Global Expansion",
          description:
            "Expanded to support photographers in over 50 countries and added support for 10 languages.",
        },
        {
          id: "4",
          year: "2022",
          title: "Photographer Support Program",
          description:
            "Launched our photographer support program, providing resources, education, and financial support to emerging talent.",
        },
        {
          id: "5",
          year: "2023",
          title: "AI-Powered Features",
          description:
            "Introduced AI-powered search and editing tools to help photographers work more efficiently.",
        },
        {
          id: "6",
          year: "2024",
          title: "Sustainability Initiative",
          description:
            "Committed to carbon-neutral operations and launched programs to support environmental photography.",
        },
      ]);
    } catch (error) {
      console.error("Error fetching about sections:", error);
      toast.error("Failed to load about page sections");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to save the sections
      // For now, we'll just simulate a successful save

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("About page updated successfully");
    } catch (error) {
      console.error("Error saving about sections:", error);
      toast.error("Failed to save about page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSection = () => {
    const newSection: AboutSection = {
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
    if (!confirm("Are you sure you want to delete this section?")) {
      return;
    }

    setSections(sections.filter((section) => section.id !== sectionId));
    toast.success("Section deleted successfully");
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

  const handleEditSection = (section: AboutSection) => {
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

  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: "New Team Member",
      role: "Position Title",
      bio: "Write a short bio for this team member...",
      avatar:
        "https://ui-avatars.com/api/?name=New+Member&background=2563eb&color=ffffff",
      socialLinks: {
        linkedin: "",
        twitter: "",
        instagram: "",
        website: "",
      },
    };

    setTeamMembers([...teamMembers, newMember]);
    setEditingTeamMember(newMember);
    setShowAddTeamMemberModal(false);
    toast.success("Team member added");
  };

  const handleSaveTeamMember = () => {
    if (!editingTeamMember) return;

    setTeamMembers(
      teamMembers.map((member) =>
        member.id === editingTeamMember.id ? editingTeamMember : member
      )
    );

    setEditingTeamMember(null);
    toast.success("Team member updated");
  };

  const handleDeleteTeamMember = (memberId: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    setTeamMembers(teamMembers.filter((member) => member.id !== memberId));
    toast.success("Team member deleted");
  };

  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: "New Milestone",
      description: "Describe this milestone...",
    };

    setMilestones([...milestones, newMilestone]);
    setEditingMilestone(newMilestone);
    setShowAddMilestoneModal(false);
    toast.success("Milestone added");
  };

  const handleSaveMilestone = () => {
    if (!editingMilestone) return;

    setMilestones(
      milestones.map((milestone) =>
        milestone.id === editingMilestone.id ? editingMilestone : milestone
      )
    );

    setEditingMilestone(null);
    toast.success("Milestone updated");
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) {
      return;
    }

    setMilestones(
      milestones.filter((milestone) => milestone.id !== milestoneId)
    );
    toast.success("Milestone deleted");
  };

  const getDefaultTitleForType = (type: string): string => {
    switch (type) {
      case "hero":
        return "Hero Section";
      case "mission":
        return "Mission Section";
      case "team":
        return "Team Section";
      case "timeline":
        return "Timeline Section";
      case "values":
        return "Values Section";
      case "stats":
        return "Statistics Section";
      case "cta":
        return "Call to Action Section";
      default:
        return "New Section";
    }
  };

  const getDefaultContentForType = (type: string): any => {
    switch (type) {
      case "hero":
        return {
          heading: "About Pixinity",
          subheading:
            "Our mission is to empower photographers and visual storytellers",
          backgroundImage:
            "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
        };
      case "mission":
        return {
          heading: "Our Mission",
          description: "Describe your company's mission and vision here...",
          values: ["Value 1", "Value 2", "Value 3"],
        };
      case "team":
        return {
          heading: "Our Team",
          subheading: "Meet the people behind Pixinity",
        };
      case "timeline":
        return {
          heading: "Our Journey",
          subheading: "The story of how we've evolved over the years",
        };
      case "values":
        return {
          heading: "Our Values",
          values: [
            {
              title: "Value 1",
              description: "Description for value 1",
              icon: "heart",
            },
            {
              title: "Value 2",
              description: "Description for value 2",
              icon: "users",
            },
            {
              title: "Value 3",
              description: "Description for value 3",
              icon: "star",
            },
          ],
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
      case "cta":
        return {
          heading: "Join Our Community",
          subheading: "Become part of our growing network of photographers",
          ctaText: "Sign Up Now",
          ctaLink: "/signup",
          backgroundImage:
            "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
        };
      default:
        return {};
    }
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

      case "mission":
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
                Description
              </label>
              <textarea
                value={editingSection.content.description}
                onChange={(e) =>
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      description: e.target.value,
                    },
                  })
                }
                rows={4}
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Values (one per line)
              </label>
              <textarea
                value={(editingSection.content.values || []).join("\n")}
                onChange={(e) => {
                  const values = e.target.value
                    .split("\n")
                    .filter((v) => v.trim());
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      values,
                    },
                  });
                }}
                rows={3}
                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );

      case "team":
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

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-900">
                  Team Members
                </h3>
                <button
                  onClick={() => setShowAddTeamMemberModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-neutral-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {member.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingTeamMember(member)}
                        className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "timeline":
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

            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-neutral-900">
                  Milestones
                </h3>
                <button
                  onClick={() => setShowAddMilestoneModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start justify-between p-4 border border-neutral-200 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <div className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
                          {milestone.year}
                        </div>
                        <div className="font-medium text-neutral-900">
                          {milestone.title}
                        </div>
                      </div>
                      <div className="text-sm text-neutral-600 ml-12">
                        {milestone.description}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMilestone(milestone)}
                        className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "values":
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
                Values
              </label>
              {editingSection.content.values.map(
                (value: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border border-neutral-200 rounded-md"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Value {index + 1}</h4>
                      <button
                        onClick={() => {
                          const newValues = [...editingSection.content.values];
                          newValues.splice(index, 1);
                          setEditingSection({
                            ...editingSection,
                            content: {
                              ...editingSection.content,
                              values: newValues,
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
                          value={value.title}
                          onChange={(e) => {
                            const newValues = [
                              ...editingSection.content.values,
                            ];
                            newValues[index].title = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                values: newValues,
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
                          value={value.description}
                          onChange={(e) => {
                            const newValues = [
                              ...editingSection.content.values,
                            ];
                            newValues[index].description = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                values: newValues,
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
                          value={value.icon}
                          onChange={(e) => {
                            const newValues = [
                              ...editingSection.content.values,
                            ];
                            newValues[index].icon = e.target.value;
                            setEditingSection({
                              ...editingSection,
                              content: {
                                ...editingSection.content,
                                values: newValues,
                              },
                            });
                          }}
                          className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="heart">Heart</option>
                          <option value="users">Users</option>
                          <option value="star">Star</option>
                          <option value="shield">Shield</option>
                          <option value="globe">Globe</option>
                          <option value="camera">Camera</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )
              )}
              <button
                onClick={() => {
                  const newValues = [...editingSection.content.values];
                  newValues.push({
                    title: "New Value",
                    description: "Description for new value",
                    icon: "star",
                  });
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      values: newValues,
                    },
                  });
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Value
              </button>
            </div>
          </div>
        );

      case "stats":
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
                Statistics
              </label>
              {editingSection.content.stats.map((stat: any, index: number) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-neutral-200 rounded-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Stat {index + 1}</h4>
                    <button
                      onClick={() => {
                        const newStats = [...editingSection.content.stats];
                        newStats.splice(index, 1);
                        setEditingSection({
                          ...editingSection,
                          content: {
                            ...editingSection.content,
                            stats: newStats,
                          },
                        });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700">
                        Value
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...editingSection.content.stats];
                          newStats[index].value = e.target.value;
                          setEditingSection({
                            ...editingSection,
                            content: {
                              ...editingSection.content,
                              stats: newStats,
                            },
                          });
                        }}
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700">
                        Label
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...editingSection.content.stats];
                          newStats[index].label = e.target.value;
                          setEditingSection({
                            ...editingSection,
                            content: {
                              ...editingSection.content,
                              stats: newStats,
                            },
                          });
                        }}
                        className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newStats = [...editingSection.content.stats];
                  newStats.push({
                    value: "0",
                    label: "Label",
                  });
                  setEditingSection({
                    ...editingSection,
                    content: {
                      ...editingSection.content,
                      stats: newStats,
                    },
                  });
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-neutral-300 shadow-sm text-sm leading-4 font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </button>
            </div>
          </div>
        );

      case "cta":
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
      {editingSection ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setEditingSection(null)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-700" />
              </button>
              <h1 className="text-3xl font-bold text-neutral-900">
                Edit {editingSection.title}
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setEditingSection(null)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
            {renderSectionEditor()}
          </div>
        </div>
      ) : editingTeamMember ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setEditingTeamMember(null)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-700" />
              </button>
              <h1 className="text-3xl font-bold text-neutral-900">
                Edit Team Member
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setEditingTeamMember(null)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeamMember}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Member</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingTeamMember.name}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={editingTeamMember.role}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Bio
              </label>
              <textarea
                value={editingTeamMember.bio}
                onChange={(e) =>
                  setEditingTeamMember({
                    ...editingTeamMember,
                    bio: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                value={editingTeamMember.avatar}
                onChange={(e) =>
                  setEditingTeamMember({
                    ...editingTeamMember,
                    avatar: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {editingTeamMember.avatar && (
                <div className="mt-2 flex items-center space-x-4">
                  <img
                    src={editingTeamMember.avatar}
                    alt={editingTeamMember.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="text-sm text-neutral-500">
                    Preview of the team member's avatar
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">
                Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    LinkedIn Username
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 text-sm">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      value={editingTeamMember.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        setEditingTeamMember({
                          ...editingTeamMember,
                          socialLinks: {
                            ...editingTeamMember.socialLinks,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Twitter Username
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 text-sm">
                      twitter.com/
                    </span>
                    <input
                      type="text"
                      value={editingTeamMember.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        setEditingTeamMember({
                          ...editingTeamMember,
                          socialLinks: {
                            ...editingTeamMember.socialLinks,
                            twitter: e.target.value,
                          },
                        })
                      }
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Instagram Username
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 text-sm">
                      instagram.com/
                    </span>
                    <input
                      type="text"
                      value={editingTeamMember.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        setEditingTeamMember({
                          ...editingTeamMember,
                          socialLinks: {
                            ...editingTeamMember.socialLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Website
                  </label>
                  <input
                    type="text"
                    value={editingTeamMember.socialLinks?.website || ""}
                    onChange={(e) =>
                      setEditingTeamMember({
                        ...editingTeamMember,
                        socialLinks: {
                          ...editingTeamMember.socialLinks,
                          website: e.target.value,
                        },
                      })
                    }
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : editingMilestone ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setEditingMilestone(null)}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-neutral-700" />
              </button>
              <h1 className="text-3xl font-bold text-neutral-900">
                Edit Milestone
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setEditingMilestone(null)}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMilestone}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Milestone</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={editingMilestone.year}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      year: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editingMilestone.title}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={editingMilestone.description}
                onChange={(e) =>
                  setEditingMilestone({
                    ...editingMilestone,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                About Page Management
              </h1>
              <p className="text-neutral-600">
                Customize the content and layout of your about page
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
                About Page Preview
              </h2>
              <a
                href="/about"
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
                <p className="text-neutral-600">About Page Preview</p>
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
                About Page Sections
              </h2>
            </div>

            {isLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-neutral-200 rounded-md"
                    ></div>
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
                      className={`p-6 ${
                        !section.isVisible ? "bg-neutral-50" : ""
                      }`}
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
                              <Layout className="h-5 w-5" />
                            ) : section.type === "mission" ? (
                              <Target className="h-5 w-5" />
                            ) : section.type === "team" ? (
                              <Users className="h-5 w-5" />
                            ) : section.type === "timeline" ? (
                              <Clock className="h-5 w-5" />
                            ) : section.type === "values" ? (
                              <Heart className="h-5 w-5" />
                            ) : section.type === "stats" ? (
                              <BarChart2 className="h-5 w-5" />
                            ) : section.type === "cta" ? (
                              <LinkIcon className="h-5 w-5" />
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
                            onClick={() =>
                              handleMoveSection(section.id, "down")
                            }
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
                              section.isVisible
                                ? "Hide section"
                                : "Show section"
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
                  Get started by adding a new section to your about page.
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
        </div>
      )}

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
                        <option value="mission">Mission Section</option>
                        <option value="team">Team Section</option>
                        <option value="timeline">Timeline Section</option>
                        <option value="values">Values Section</option>
                        <option value="stats">Statistics Section</option>
                        <option value="cta">Call to Action Section</option>
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

      {/* Add Team Member Modal */}
      {showAddTeamMemberModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowAddTeamMemberModal(false)}
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
                    <UserPlus className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Add New Team Member
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        Add a new member to your team section. You'll be able to
                        edit their details after adding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddTeamMember}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Team Member
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTeamMemberModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowAddMilestoneModal(false)}
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
                    <Clock className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-neutral-900"
                      id="modal-title"
                    >
                      Add New Milestone
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-neutral-500">
                        Add a new milestone to your timeline. You'll be able to
                        edit the details after adding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Milestone
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
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

export default AdminAbout;
