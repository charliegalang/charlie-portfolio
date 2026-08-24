import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Check, Replace, LayoutGrid, Search } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { uploadToCloudinary } from '../services/CloudinaryService';

const ImageManagementModal = ({ isOpen, onClose, images, categoryId, onUpdateImages }) => {
  const [editingImages, setEditingImages] = useState([...images]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Non-strict search logic
  const filteredImages = useMemo(() => {
    if (!searchTerm.trim()) return editingImages;
    const term = searchTerm.toLowerCase();
    return editingImages.filter(img => {
      const cleanDesc = (img.description || "").replace(/<[^>]*>/g, "").toLowerCase();
      return cleanDesc.includes(term);
    });
  }, [editingImages, searchTerm]);

  const handleDescriptionChange = (index, value) => {
    const updated = [...editingImages];
    updated[index] = { ...updated[index], description: value };
    setEditingImages(updated);
  };

  const handleRemoveImage = (index) => {
    if (!confirm("Are you sure you want to remove this image?")) return;

    const updated = [...editingImages];
    updated.splice(index, 1);
    setEditingImages(updated);
  };

  const handleReplaceImage = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // Deletion is now deferred to handleGlobalSave in usePortfolioState
      const data = await uploadToCloudinary(file, categoryId, () => {});
      if (data) {
        const updated = [...editingImages];
        updated[index] = {
          ...data,
          description: editingImages[index].description
        };
        setEditingImages(updated);
      }
    } catch (error) {
      alert("Replacement failed: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAll = () => {
    const invalid = editingImages.some(img => !img.description || img.description === '<br>');
    if (invalid) {
      alert("All images must have a description.");
      return;
    }
    onUpdateImages(editingImages);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-theme-primary w-full max-w-6xl max-h-[90vh] rounded-[32px] border border-theme overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-theme flex justify-between items-center bg-theme-secondary/30">
            <div className="flex items-center gap-3">
                <LayoutGrid className="text-[#EAB308]" />
                <div>
                    <h2 className="text-2xl font-bold text-theme-primary">Manage Gallery Images</h2>
                    <p className="text-sm text-theme-secondary">Edit descriptions, replace or remove images</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-theme-secondary rounded-full transition-colors">
              <X size={24} className="text-theme-primary" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-theme bg-theme-secondary/10 flex items-center gap-4">
            <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-secondary" />
                <input
                    type="text"
                    placeholder="Search descriptions (e.g. 'design', 'ux')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-theme-primary border border-theme rounded-full py-2.5 pl-12 pr-4 text-sm text-theme-primary outline-none focus:ring-2 focus:ring-[#EAB308] transition-all"
                />
            </div>
            {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-[#EAB308] font-bold hover:underline"
                >
                  Clear Search
                </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredImages.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="p-4 bg-theme-secondary rounded-full">
                    <Search size={48} className="text-theme-secondary opacity-20" />
                </div>
                <p className="text-theme-secondary">
                    {searchTerm ? `No images found matching "${searchTerm}"` : 'No images in this gallery.'}
                </p>
              </div>
            ) : (
              <div className="min-w-full">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                    <tr className="border-b border-theme text-theme-secondary text-[10px] uppercase tracking-[0.2em]">
                        <th className="pb-4 font-bold w-32 text-center">Image</th>
                        <th className="pb-4 font-bold px-4">Content Details</th>
                        <th className="pb-4 font-bold text-right w-24 pr-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-theme">
                    {filteredImages.map((img, idx) => {
                        const originalIndex = editingImages.findIndex(orig => orig.public_id === img.public_id);

                        return (
                            <tr key={img.public_id || idx} className="group hover:bg-theme-secondary/5 transition-colors">
                            <td className="py-8">
                                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-2xl group/img ring-1 ring-white/10">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                <label className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleReplaceImage(originalIndex, e)}
                                        disabled={isProcessing}
                                    />
                                    <Replace size={20} className="text-[#EAB308]" />
                                </label>
                                </div>
                            </td>
                            <td className="py-8 px-4">
                                <div className="bg-theme-secondary/30 border border-theme rounded-[20px] overflow-hidden focus-within:border-[#EAB308] transition-all">
                                    <RichTextEditor
                                        value={img.description}
                                        onSave={(val) => handleDescriptionChange(originalIndex, val)}
                                        isEditMode={true}
                                        placeholder="Enter image description..."
                                        className="p-4 text-theme-primary min-h-[80px]"
                                    />
                                </div>
                            </td>
                            <td className="py-8 text-right pr-4">
                                <button
                                onClick={() => handleRemoveImage(originalIndex)}
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition-all hover:scale-110 active:scale-90"
                                title="Remove Image"
                                >
                                <Trash2 size={22} />
                                </button>
                            </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-theme bg-theme-secondary/30 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-theme-secondary">
                {editingImages.length} Item{editingImages.length !== 1 ? 's' : ''} total
                </span>
                {searchTerm && (
                    <span className="text-[10px] bg-[#EAB308]/10 text-[#EAB308] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                        {filteredImages.length} Filtered
                    </span>
                )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full text-sm font-bold text-theme-secondary hover:text-theme-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isProcessing}
                className="flex items-center gap-2 px-8 py-2 bg-[#EAB308] text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check size={20} />
                )}
                Save All Updates
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageManagementModal;
