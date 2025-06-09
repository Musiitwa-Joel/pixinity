import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Collection } from "../../types";
import { collectionsService } from "../../../server/services/collectionsService";
import toast from "react-hot-toast";

interface DeleteCollectionModalProps {
  isOpen: boolean;
  collection: Collection | null;
  onClose: () => void;
  onCollectionDeleted: (collectionId: string) => void;
}

const DeleteCollectionModal: React.FC<DeleteCollectionModalProps> = ({
  isOpen,
  collection,
  onClose,
  onCollectionDeleted,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!collection || confirmText !== collection.title) {
      toast.error("Please type the collection title to confirm");
      return;
    }

    setIsDeleting(true);

    try {
      console.log("Deleting collection:", collection.id);
      await collectionsService.deleteCollection(collection.id);

      onCollectionDeleted(collection.id);
      toast.success("Collection deleted successfully");
      handleClose();
    } catch (error: any) {
      console.error("Delete collection error:", error);
      toast.error(error.message || "Failed to delete collection");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    console.log("Closing delete modal");
    setConfirmText("");
    onClose();
  };

  if (!collection) {
    console.log("No collection provided to delete modal");
    return null;
  }

  const isConfirmValid = confirmText === collection.title;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Delete Collection
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <p className="text-neutral-700 mb-4">
                  Are you sure you want to delete{" "}
                  <strong>"{collection.title}"</strong>? This action cannot be
                  undone.
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-red-800 mb-2">
                    This will permanently:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Delete the collection and all its metadata</li>
                    <li>
                      • Remove {collection.photosCount} photos from this
                      collection
                    </li>
                    <li>• Remove all collaborator access</li>
                    <li>• Delete any shared links</li>
                  </ul>
                </div>

                <p className="text-sm text-neutral-600 mb-4">
                  <strong>Note:</strong> The individual photos will not be
                  deleted from your account.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Type <strong>{collection.title}</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder={collection.title}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 focus:ring-neutral-500 backdrop-blur-sm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!isConfirmValid || isDeleting}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Collection
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteCollectionModal;
