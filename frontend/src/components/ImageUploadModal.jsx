import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Check } from 'lucide-react';
import { uploadToCloudinary } from '../services/CloudinaryService';
import RichTextEditor from './RichTextEditor';

const ImageUploadModal = ({ isOpen, onClose, onUploadComplete, categoryId, setGlobalUploadProgress }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      description: ''
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDescriptionChange = (index, value) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      updated[index].description = value;
      return updated;
    });
  };

  const handleSave = async () => {
    const invalid = selectedFiles.some(item => !item.description.trim() || item.description === '<br>');
    if (invalid) {
      alert("Please add a description for all images.");
      return;
    }

    setIsUploading(true);
    const uploadedImages = [];
    const filesToUpload = [...selectedFiles];

    // Clear local state and close modal immediately for "non-blocking" feel
    setSelectedFiles([]);
    onClose();

    // Start uploads in parallel or sequence, but report progress individually
    for (let i = 0; i < filesToUpload.length; i++) {
      const item = filesToUpload[i];
      const taskId = `img_${Date.now()}_${i}`; // Unique ID for each file task

      // Don't await the whole loop if you want them truly independent,
      // but here we sequence them to avoid hitting Cloudinary rate limits too hard,
      // while still reporting individual progress.
      try {
        const data = await uploadToCloudinary(item.file, categoryId, (progress) => {
            setGlobalUploadProgress(taskId, {
                percent: progress.percent,
                phase: 'uploading'
            });
        });

        if (data) {
          uploadedImages.push({
            ...data,
            description: item.description
          });
          // Show success for this specific file
          setGlobalUploadProgress(taskId, { percent: 100, phase: 'success' });
          setTimeout(() => setGlobalUploadProgress(taskId, null), 3000);
        }
      } catch (error) {
        console.error("File upload failed", error);
        setGlobalUploadProgress(taskId, null);
      }
    }

    onUploadComplete(uploadedImages);
    filesToUpload.forEach(item => URL.revokeObjectURL(item.preview));
    setIsUploading(false);
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
          className="bg-theme-primary w-full max-w-5xl max-h-[90vh] rounded-[32px] border border-theme overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-theme flex justify-between items-center bg-theme-secondary/30">
            <div>
              <h2 className="text-2xl font-bold text-theme-primary">Add New Images</h2>
              <p className="text-sm text-theme-secondary">Upload images and add mandatory descriptions</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X size={24} className="text-theme-primary" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedFiles.length === 0 ? (
              <div
                onClick={() => fileInputRef.current.click()}
                className="h-64 border-2 border-dashed border-theme rounded-2xl flex flex-col items-center justify-center gap-4 transition-all group cursor-pointer hover:bg-theme-secondary/20"
              >
                <div className="p-4 bg-theme-secondary rounded-full group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-[#EAB308]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-theme-primary">Click to select images</p>
                  <p className="text-sm text-theme-secondary">Support JPG, PNG, SVG</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-theme">
                        <th className="pb-4 font-bold text-theme-primary w-32">Image</th>
                        <th className="pb-4 font-bold text-theme-primary">Description (Required)</th>
                        <th className="pb-4 text-right w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-theme">
                      {selectedFiles.map((item, idx) => (
                        <tr key={idx} className="group">
                          <td className="py-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-black/10">
                              <img src={item.preview} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="bg-theme-secondary border border-theme rounded-xl min-h-[100px]">
                                <RichTextEditor
                                    value={item.description}
                                    onSave={(val) => handleDescriptionChange(idx, val)}
                                    isEditMode={true}
                                    placeholder="Describe this image..."
                                    className="p-3 text-sm text-theme-primary min-h-[100px]"
                                />
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleRemoveFile(idx)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-2 px-6 py-3 border border-theme rounded-full text-sm font-bold text-theme-primary hover:bg-theme-secondary transition-all"
                >
                  <Upload size={18} /> Add More
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-theme bg-theme-secondary/30 flex justify-between items-center">
            <span className="text-sm text-theme-secondary">
              {selectedFiles.length} image{selectedFiles.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-full text-sm font-bold text-theme-secondary hover:text-theme-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedFiles.length === 0}
                className="flex items-center gap-2 px-8 py-2 bg-[#EAB308] text-black rounded-full font-bold hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
              >
                <Check size={18} />
                <span>Save Images</span>
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            accept="image/*"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageUploadModal;