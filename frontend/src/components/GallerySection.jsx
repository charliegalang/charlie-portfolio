import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Trash, Eye, EyeOff, Settings, Maximize2
} from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploadModal from './ImageUploadModal';
import ImageManagementModal from './ImageManagementModal';
import { getOptimizedUrl } from '../utils/portfolioUtils';

const GallerySection = ({
  id,
  categoryId,
  images = [],
  title,
  subtitle,
  isVisible = true,
  onImageClick,
  isEditMode,
  onUpload,
  onDelete,
  onTitleEdit,
  onSubtitleEdit,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onDeleteSection,
  showMoveUp,
  showMoveDown,
  setGlobalUploadProgress,
  mode = 'light'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mainImageLoaded, setMainImageLoaded] = useState(false)
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState({})
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false)
  const autoPlayRef = useRef(null)
  const mainImageRef = useRef(null)

  const getContentString = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val[mode] || "";
  };

  const cleanTitle = useMemo(() => {
    const t = getContentString(title);
    if (!t) return "Gallery Image";
    try {
      const doc = new DOMParser().parseFromString(t, 'text/html');
      return doc.body.textContent.trim() || "Gallery Image";
    } catch (e) {
      return t.replace(/<[^>]*>/g, '').trim() || "Gallery Image";
    }
  }, [title, mode]);

  useEffect(() => {
    if (images.length <= 1 || !isAutoPlaying) return
    autoPlayRef.current = setInterval(() => {
      setMainImageLoaded(false);
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [images.length, isAutoPlaying])

  useEffect(() => {
    if (mainImageRef.current && mainImageRef.current.complete) {
      setMainImageLoaded(true);
    }
  }, [currentIndex, images]);

  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(Math.max(0, images.length - 1));
    }
  }, [images.length]);

  const handleUploadComplete = (newImages) => onUpload(newImages);
  const handleUpdateImages = (updatedImages) => onUpload(updatedImages, true);

  const selectImage = (index) => {
    if (index === currentIndex) return;
    setMainImageLoaded(false);
    setCurrentIndex(index);
  }

  const nextImage = () => {
    if (images.length === 0) return;
    setMainImageLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }

  const prevImage = () => {
    if (images.length === 0) return;
    setMainImageLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  const handleThumbnailLoad = (index) => {
    setThumbnailsLoaded(prev => ({ ...prev, [index]: true }))
  }

  const getThumbnailWidth = () => {
    const count = images.length
    if (count === 1) return 'w-full max-w-[200px]'
    if (count === 2) return 'w-[calc(50%-6px)] max-w-[150px]'
    if (count === 3) return 'w-[calc(33.333%-8px)] max-w-[120px]'
    if (count === 4) return 'w-[calc(50%-6px)] sm:w-[calc(25%-9px)] max-w-[120px]'
    return 'w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(20%-10px)] max-w-[120px]'
  }

  const currentImage = images[currentIndex];

  const getLineAlignmentClasses = () => {
    const subStr = getContentString(subtitle);
    const titleStr = getContentString(title);
    const val = (subStr && subStr.trim() !== '' && subStr !== '<br>') ? subStr : titleStr;
    if (!val || typeof val !== 'string') return 'mr-auto';
    const lower = val.toLowerCase();
    if (lower.includes('text-align: center') || lower.includes('text-align:center') || lower.includes('<center')) return 'mx-auto';
    if (lower.includes('text-align: right') || lower.includes('text-align:right')) return 'ml-auto mr-0';
    return 'mr-auto';
  }

  return (
    <div className={`mb-16 sm:mb-32 relative group/section ${!isVisible && isEditMode ? 'opacity-50 grayscale' : ''}`}>
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        categoryId={categoryId}
        setGlobalUploadProgress={setGlobalUploadProgress}
      />

      <ImageManagementModal
        isOpen={isManagementModalOpen}
        onClose={() => setIsManagementModalOpen(false)}
        images={images}
        categoryId={categoryId}
        onUpdateImages={handleUpdateImages}
      />

      {isEditMode && (
        <div className="absolute -top-12 right-0 flex items-center gap-2 bg-theme-secondary/80 backdrop-blur-md p-1.5 rounded-full border border-theme z-30 shadow-lg scale-90 sm:scale-100">
          <button
            onClick={onToggleVisibility}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
          >
            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="text-[9px] font-bold uppercase">{isVisible ? 'Visible' : 'Hidden'}</span>
          </button>
          <div className="w-[1px] h-4 bg-theme/20 mx-1" />
          {showMoveUp && (
            <button onClick={onMoveUp} className="p-1.5 bg-[#EAB308] text-black rounded-full hover:opacity-80 transition-all"><ChevronUp size={14} /></button>
          )}
          {showMoveDown && (
            <button onClick={onMoveDown} className="p-1.5 bg-[#EAB308] text-black rounded-full hover:opacity-80 transition-all"><ChevronDown size={14} /></button>
          )}
          <button onClick={onDeleteSection} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><Trash size={14} /></button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-8">
        <div className="relative w-full text-center">
          <div className="w-full">
            <RichTextEditor
              value={getContentString(title)}
              onSave={(val) => onTitleEdit(val, mode)}
              isEditMode={isEditMode}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-theme-primary w-full"
              placeholder="Section Title"
            />

            {(isEditMode || (getContentString(subtitle).trim() !== '' && getContentString(subtitle) !== '<br>')) && (
              <RichTextEditor
                value={getContentString(subtitle)}
                onSave={(val) => onSubtitleEdit(val, mode)}
                isEditMode={isEditMode}
                className="mt-3 sm:mt-4 text-theme-secondary text-base sm:text-lg w-full"
                placeholder="Section Subtitle"
              />
            )}
            <div className={`h-[2px] w-16 sm:w-24 mt-4 sm:mt-6 transition-all duration-500 bg-theme-line ${getLineAlignmentClasses()}`} />
          </div>

          {isEditMode && (
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 py-4 sm:py-6 relative">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-[#EAB308] text-black rounded-full font-bold text-xs sm:text-base hover:scale-105 transition-all shadow-xl"
              >
                <Upload size={18} /> Upload
              </button>
              <button
                onClick={() => setIsManagementModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-theme-primary text-[#EAB308] border border-[#EAB308] rounded-full font-bold text-xs sm:text-base hover:bg-[#EAB308] hover:text-black transition-all shadow-xl group"
              >
                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" /> Manage
              </button>
            </div>
          )}
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-10 sm:py-12 bg-theme-secondary/20 rounded-2xl border border-dashed border-theme-line/30 mx-4">
          <p className="text-sm sm:text-lg text-theme-primary opacity-60">No designs available yet.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] sm:aspect-video min-h-[300px] sm:min-h-[400px] lg:min-h-[700px] group cursor-pointer flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl bg-theme-secondary/10 border border-theme/10"
            onClick={() => onImageClick(currentImage)}
          >
            {!mainImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-10 h-10 border-4 border-theme-line border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.img
                ref={mainImageRef}
                key={currentImage?.public_id || currentIndex}
                src={getOptimizedUrl(currentImage?.url, 'image', 1600)}
                alt={cleanTitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setMainImageLoaded(true)}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-black/40 sm:bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-full transition-all text-white"><ChevronLeft size={24} className="sm:w-8 sm:h-8" /></button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-black/40 sm:bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-full transition-all text-white"><ChevronRight size={24} className="sm:w-8 sm:h-8" /></button>
              </>
            )}
          </motion.div>

          <div className="flex justify-between items-center mt-4 sm:mt-6 px-1">
            <div className="flex gap-1">
              {images.map((img, index) => (
                <div key={`dot-${img.public_id || index}`} className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 sm:w-8 bg-theme-line' : 'w-1.5 sm:w-2 bg-theme-secondary opacity-40'}`} />
              ))}
            </div>
            <div className="px-2 py-1 bg-theme-secondary/20 rounded-full text-theme-primary text-[10px] font-black">{currentIndex + 1} / {images.length}</div>
          </div>

          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {images.map((img, index) => (
                <motion.div
                  key={`thumb-${img.public_id || index}`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={getThumbnailWidth()}
                >
                  <div
                    className={`relative w-full pb-[100%] rounded-lg overflow-hidden bg-black/5 cursor-pointer transition-all duration-300 border-2 ${index === currentIndex ? 'border-theme-line shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    onClick={() => selectImage(index)}
                  >
                    {!thumbnailsLoaded[index] && (<div className="absolute inset-0 flex items-center justify-center"><div className="w-4 h-4 border-2 border-theme-line border-t-transparent rounded-full animate-spin" /></div>)}
                    <img
                      src={getOptimizedUrl(img.url, 'image', 300)}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${thumbnailsLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => handleThumbnailLoad(index)}
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default GallerySection;
