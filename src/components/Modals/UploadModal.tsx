import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Tag, 
  MapPin, 
  Camera,
  Plus,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface UploadForm {
  title: string;
  description: string;
  tags: string;
  category: string;
  license: 'free' | 'cc0' | 'attribution';
}

const UploadModal: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal } = useApp();
  const { isAuthenticated } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UploadForm>();

  const categories = [
    'Nature', 'Architecture', 'Travel', 'Street', 'Portrait', 
    'Abstract', 'Food', 'Fashion', 'Sports', 'Technology'
  ];

  const licenses = [
    { value: 'free', label: 'Free to use', description: 'Can be used for any purpose' },
    { value: 'cc0', label: 'CC0 Public Domain', description: 'No rights reserved' },
    { value: 'attribution', label: 'Attribution Required', description: 'Credit must be given' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (data: UploadForm) => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast.success(`Successfully uploaded ${files.length} photo${files.length > 1 ? 's' : ''}!`);
      
      // Reset form and close modal
      reset();
      setFiles([]);
      closeUploadModal();
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      closeUploadModal();
      setFiles([]);
      reset();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AnimatePresence>
      {isUploadModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Upload Photos</h2>
                <p className="text-neutral-600">Share your amazing photography with the world</p>
              </div>
              <button
                onClick={handleClose}
                disabled={uploading}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
              {/* Upload Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {files.length === 0 ? (
                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                      dragActive 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-300 hover:border-primary-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-primary-100 rounded-full">
                        <Upload className="h-8 w-8 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                          Drop your images here
                        </h3>
                        <p className="text-neutral-600 mb-4">
                          or click to browse from your device
                        </p>
                        <label className="btn-primary cursor-pointer">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Choose Files
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-neutral-500">
                        Supports: JPG, PNG, WebP (Max 10MB each)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Selected Images ({files.length})
                      </h3>
                      <label className="btn-outline cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        Add More
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded truncate">
                              {file.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              {files.length > 0 && (
                <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-neutral-200 p-6 overflow-y-auto">
                  <form onSubmit={handleSubmit(handleUpload)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Title *
                      </label>
                      <input
                        {...register('title', { required: 'Title is required' })}
                        type="text"
                        className="input"
                        placeholder="Give your photo a title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="input resize-none"
                        placeholder="Tell the story behind your photo..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Tags
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                        <input
                          {...register('tags')}
                          type="text"
                          className="input pl-10"
                          placeholder="nature, landscape, sunset"
                        />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Separate tags with commas
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category *
                      </label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="input"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-error-600">{errors.category.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        License *
                      </label>
                      <div className="space-y-3">
                        {licenses.map(license => (
                          <label key={license.value} className="flex items-start space-x-3">
                            <input
                              {...register('license', { required: 'License is required' })}
                              type="radio"
                              value={license.value}
                              className="mt-1 text-primary-600 focus:ring-primary-500"
                            />
                            <div>
                              <div className="font-medium text-neutral-900">{license.label}</div>
                              <div className="text-sm text-neutral-600">{license.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.license && (
                        <p className="mt-1 text-sm text-error-600">{errors.license.message}</p>
                      )}
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-600">Uploading...</span>
                          <span className="text-neutral-900 font-medium">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={uploading}
                      className="btn-primary w-full"
                    >
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload {files.length} Photo{files.length > 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;