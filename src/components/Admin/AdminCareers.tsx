import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  MapPin,
  Clock,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Save,
  ArrowLeft,
  Building,
  DollarSign,
  Users,
  Star,
  FileText,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  locationType: "remote" | "hybrid" | "onsite";
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  salaryRange?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationUrl: string;
  isActive: boolean;
  featured: boolean;
  applicantsCount: number;
  viewsCount: number;
  postedAt: string;
  expiresAt?: string;
  updatedAt: string;
}

const AdminCareers: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobPosting | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing jobs
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    locationType: "remote",
    employmentType: "full-time",
    salaryRange: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    applicationUrl: "",
    isActive: true,
    featured: false,
    expiresAt: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [
    jobs,
    searchQuery,
    departmentFilter,
    locationTypeFilter,
    statusFilter,
    sortBy,
  ]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      setJobs([
        {
          id: "1",
          title: "Senior Frontend Developer",
          department: "Engineering",
          location: "San Francisco, CA",
          locationType: "hybrid",
          employmentType: "full-time",
          salaryRange: "$120,000 - $150,000",
          description:
            "We're looking for a Senior Frontend Developer to join our engineering team. You'll be responsible for building and maintaining our web applications, with a focus on user experience and performance.",
          responsibilities: [
            "Develop and maintain our web applications using React, TypeScript, and modern frontend tools",
            "Collaborate with designers to implement responsive, accessible, and visually appealing user interfaces",
            "Write clean, maintainable, and well-tested code",
            "Participate in code reviews and mentor junior developers",
            "Contribute to technical architecture decisions and best practices",
          ],
          requirements: [
            "5+ years of experience in frontend development",
            "Strong proficiency in React, TypeScript, and modern JavaScript",
            "Experience with state management solutions (Redux, Context API, etc.)",
            "Knowledge of responsive design, accessibility, and cross-browser compatibility",
            "Familiarity with testing frameworks (Jest, React Testing Library, etc.)",
            "Bachelor's degree in Computer Science or equivalent experience",
          ],
          benefits: [
            "Competitive salary and equity package",
            "Comprehensive health, dental, and vision insurance",
            "Flexible work arrangements",
            "Professional development budget",
            "Generous paid time off",
            "401(k) matching",
          ],
          applicationUrl:
            "https://careers.pixinity.com/apply/senior-frontend-developer",
          isActive: true,
          featured: true,
          applicantsCount: 24,
          viewsCount: 456,
          postedAt: "2025-06-01T10:00:00.000Z",
          expiresAt: "2025-07-01T23:59:59.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
        {
          id: "2",
          title: "Product Designer",
          department: "Design",
          location: "Remote",
          locationType: "remote",
          employmentType: "full-time",
          salaryRange: "$90,000 - $120,000",
          description:
            "We're seeking a talented Product Designer to help shape the future of our photography platform. You'll work closely with product managers, engineers, and other designers to create intuitive and delightful user experiences.",
          responsibilities: [
            "Create wireframes, prototypes, and high-fidelity designs for web and mobile applications",
            "Conduct user research and usability testing to inform design decisions",
            "Develop and maintain our design system",
            "Collaborate with cross-functional teams to define and implement new features",
            "Advocate for user-centered design throughout the product development process",
          ],
          requirements: [
            "3+ years of experience in product design",
            "Strong portfolio demonstrating your design process and outcomes",
            "Proficiency in design tools such as Figma, Sketch, or Adobe XD",
            "Experience with responsive web design and mobile app design",
            "Understanding of accessibility standards and best practices",
            "Excellent communication and collaboration skills",
          ],
          benefits: [
            "Competitive salary and equity package",
            "Comprehensive health, dental, and vision insurance",
            "Flexible work arrangements",
            "Professional development budget",
            "Generous paid time off",
            "Home office stipend",
          ],
          applicationUrl: "https://careers.pixinity.com/apply/product-designer",
          isActive: true,
          featured: true,
          applicantsCount: 18,
          viewsCount: 325,
          postedAt: "2025-06-05T14:30:00.000Z",
          expiresAt: "2025-07-05T23:59:59.000Z",
          updatedAt: "2025-06-05T14:30:00.000Z",
        },
        {
          id: "3",
          title: "Community Manager",
          department: "Marketing",
          location: "New York, NY",
          locationType: "onsite",
          employmentType: "full-time",
          salaryRange: "$70,000 - $90,000",
          description:
            "We're looking for a Community Manager to build and nurture our growing community of photographers. You'll be responsible for engaging with our users, creating content, and organizing events to foster a vibrant and supportive community.",
          responsibilities: [
            "Develop and implement community engagement strategies",
            "Create and curate content for our social media channels",
            "Organize and host virtual and in-person events",
            "Gather feedback from the community and share insights with the product team",
            "Identify and highlight outstanding work from our community members",
            "Monitor community health and address issues as they arise",
          ],
          requirements: [
            "2+ years of experience in community management or social media management",
            "Strong written and verbal communication skills",
            "Experience with social media platforms and community management tools",
            "Understanding of photography and visual arts",
            "Ability to work independently and prioritize multiple tasks",
            "Bachelor's degree in Marketing, Communications, or related field",
          ],
          benefits: [
            "Competitive salary",
            "Comprehensive health, dental, and vision insurance",
            "Flexible work arrangements",
            "Professional development budget",
            "Generous paid time off",
            "Company-sponsored photography trips",
          ],
          applicationUrl:
            "https://careers.pixinity.com/apply/community-manager",
          isActive: false,
          featured: false,
          applicantsCount: 42,
          viewsCount: 612,
          postedAt: "2025-05-15T09:00:00.000Z",
          expiresAt: "2025-06-15T23:59:59.000Z",
          updatedAt: "2025-06-16T10:30:00.000Z",
        },
      ]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job postings");
    } finally {
      setIsLoading(false);
    }
  };

  const filterJobs = () => {
    let result = [...jobs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter((job) => job.department === departmentFilter);
    }

    // Apply location type filter
    if (locationTypeFilter !== "all") {
      result = result.filter((job) => job.locationType === locationTypeFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        result = result.filter((job) => job.isActive);
      } else if (statusFilter === "inactive") {
        result = result.filter((job) => !job.isActive);
      } else if (statusFilter === "featured") {
        result = result.filter((job) => job.featured);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()
        );
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "applicants":
        result.sort((a, b) => b.applicantsCount - a.applicantsCount);
        break;
      case "views":
        result.sort((a, b) => b.viewsCount - a.viewsCount);
        break;
      default: // newest
        result.sort(
          (a, b) =>
            new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        );
    }

    // Always put featured jobs at the top
    result.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    setFilteredJobs(result);
  };

  const handleCreateJob = () => {
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: "New Job Position",
      department: "Department",
      location: "Location",
      locationType: "remote",
      employmentType: "full-time",
      salaryRange: "",
      description: "Write a description for this job position...",
      responsibilities: [
        "Responsibility 1",
        "Responsibility 2",
        "Responsibility 3",
      ],
      requirements: ["Requirement 1", "Requirement 2", "Requirement 3"],
      benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],
      applicationUrl: "https://careers.pixinity.com/apply",
      isActive: false,
      featured: false,
      applicantsCount: 0,
      viewsCount: 0,
      postedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJobs([newJob, ...jobs]);
    setCurrentJob(newJob);
    setFormData({
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      locationType: newJob.locationType,
      employmentType: newJob.employmentType,
      salaryRange: newJob.salaryRange || "",
      description: newJob.description,
      responsibilities: newJob.responsibilities.join("\n"),
      requirements: newJob.requirements.join("\n"),
      benefits: newJob.benefits.join("\n"),
      applicationUrl: newJob.applicationUrl,
      isActive: newJob.isActive,
      featured: newJob.featured,
      expiresAt: newJob.expiresAt
        ? new Date(newJob.expiresAt).toISOString().split("T")[0]
        : "",
    });
    setIsEditing(true);
  };

  const handleEditJob = (job: JobPosting) => {
    setCurrentJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      locationType: job.locationType,
      employmentType: job.employmentType,
      salaryRange: job.salaryRange || "",
      description: job.description,
      responsibilities: job.responsibilities.join("\n"),
      requirements: job.requirements.join("\n"),
      benefits: job.benefits.join("\n"),
      applicationUrl: job.applicationUrl,
      isActive: job.isActive,
      featured: job.featured,
      expiresAt: job.expiresAt
        ? new Date(job.expiresAt).toISOString().split("T")[0]
        : "",
    });
    setIsEditing(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this job posting? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // In a real implementation, you would make an API call to delete the job
      // For now, we'll simulate deleting the job

      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job posting deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job posting");
    }
  };

  const handleToggleActive = async (jobId: string, isActive: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the job's active status
      // For now, we'll simulate updating the status

      setJobs(
        jobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                isActive: !isActive,
                updatedAt: new Date().toISOString(),
              }
            : job
        )
      );

      toast.success(
        `Job posting ${!isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleToggleFeatured = async (jobId: string, isFeatured: boolean) => {
    try {
      // In a real implementation, you would make an API call to update the job's featured status
      // For now, we'll simulate updating the status

      setJobs(
        jobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                featured: !isFeatured,
                updatedAt: new Date().toISOString(),
              }
            : job
        )
      );

      toast.success(
        `Job posting ${!isFeatured ? "featured" : "unfeatured"} successfully`
      );
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const handleSaveJob = async () => {
    if (!currentJob) return;

    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to update the job
      // For now, we'll simulate updating the job

      const updatedJob: JobPosting = {
        ...currentJob,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        locationType: formData.locationType as any,
        employmentType: formData.employmentType as any,
        salaryRange: formData.salaryRange,
        description: formData.description,
        responsibilities: formData.responsibilities
          .split("\n")
          .filter((r) => r.trim()),
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
        benefits: formData.benefits.split("\n").filter((r) => r.trim()),
        applicationUrl: formData.applicationUrl,
        isActive: formData.isActive,
        featured: formData.featured,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : undefined,
        updatedAt: new Date().toISOString(),
      };

      setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
      toast.success("Job posting saved successfully");
      setIsEditing(false);
      setCurrentJob(null);
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job posting");
    } finally {
      setIsSaving(false);
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
                {currentJob?.id.includes("job-")
                  ? "Create New Job"
                  : "Edit Job"}
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
                onClick={handleSaveJob}
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
                    <span>Save Job</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Location Type
                </label>
                <select
                  value={formData.locationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      locationType: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentType: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Salary Range (optional)
                </label>
                <input
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryRange: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., $80,000 - $100,000"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Job Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Write a description of the job position..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Responsibilities (one per line)
              </label>
              <textarea
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List the job responsibilities, one per line..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Requirements (one per line)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List the job requirements, one per line..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Benefits (one per line)
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) =>
                  setFormData({ ...formData, benefits: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="List the job benefits, one per line..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Application URL
              </label>
              <input
                type="text"
                value={formData.applicationUrl}
                onChange={(e) =>
                  setFormData({ ...formData, applicationUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., https://careers.pixinity.com/apply/job-title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-neutral-900"
                >
                  Active (visible to applicants)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-neutral-900"
                >
                  Featured (highlighted on careers page)
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Careers Management
              </h1>
              <p className="text-neutral-600">
                Create and manage job postings for your careers page
              </p>
            </div>
            <button
              onClick={handleCreateJob}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Job Posting</span>
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
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                />
              </div>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Customer Support">Customer Support</option>
              </select>

              {/* Location Type Filter */}
              <select
                value={locationTypeFilter}
                onChange={(e) => setLocationTypeFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
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
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="applicants">Most Applicants</option>
                <option value="views">Most Views</option>
              </select>

              <button
                onClick={fetchJobs}
                className="btn-outline flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Jobs List */}
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
            ) : filteredJobs.length > 0 ? (
              <div className="divide-y divide-neutral-200">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {job.title}
                          </h3>
                          {job.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              job.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {job.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-3">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>
                              {job.employmentType
                                .split("-")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join("-")}
                            </span>
                          </div>
                          {job.salaryRange && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>{job.salaryRange}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-neutral-600 mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex flex-wrap items-center text-sm text-neutral-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Posted:{" "}
                              {new Date(job.postedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {job.expiresAt && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                Expires:{" "}
                                {new Date(job.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{job.applicantsCount} applicants</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{job.viewsCount} views</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() =>
                            handleToggleActive(job.id, job.isActive)
                          }
                          className={`p-2 rounded-md ${
                            job.isActive
                              ? "text-green-500 hover:bg-green-50"
                              : "text-red-500 hover:bg-red-50"
                          }`}
                          title={job.isActive ? "Deactivate" : "Activate"}
                        >
                          {job.isActive ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <XCircle className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleToggleFeatured(job.id, job.featured)
                          }
                          className={`p-2 rounded-md ${
                            job.featured
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-neutral-500 hover:bg-neutral-100"
                          }`}
                          title={job.featured ? "Unfeature" : "Feature"}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              job.featured ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>
                        <a
                          href={job.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                          title="View job posting"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => handleEditJob(job)}
                          className="p-2 text-primary-500 hover:bg-primary-50 rounded-md"
                          title="Edit job posting"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                          title="Delete job posting"
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
                <Briefcase className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">
                  No job postings found
                </h3>
                <p className="text-neutral-500 mb-4">
                  {searchQuery ||
                  departmentFilter !== "all" ||
                  locationTypeFilter !== "all" ||
                  statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating your first job posting"}
                </p>
                {!searchQuery &&
                  departmentFilter === "all" &&
                  locationTypeFilter === "all" &&
                  statusFilter === "all" && (
                    <button
                      onClick={handleCreateJob}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Job Posting
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

export default AdminCareers;
