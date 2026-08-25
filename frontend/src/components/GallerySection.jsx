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

  // Safeguard: Ensure currentIndex is valid if images list changes
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
    const checkCenter = (val) => {
      if (!val || typeof val !== 'string') return false;
      const lower = val.toLowerCase();
      return lower.includes('text-align: center') || lower.includes('text-align:center') || lower.includes('<center');
    };
    const checkRight = (val) => {
      if (!val || typeof val !== 'string') return false;
      const lower = val.toLowerCase();
      return lower.includes('text-align: right') || lower.includes('text-align:right');
    };
    const subStr = getContentString(subtitle);
    const titleStr = getContentString(title);
    const alignmentValue = (subStr && subStr.trim() !== '' && subStr !== '<br>') ? subStr : titleStr;
    if (checkCenter(alignmentValue)) return 'mx-auto';
    if (checkRight(alignmentValue)) return 'ml-auto mr-0';
    return 'mr-auto';
  }

  return (
    <div className={`mb-32 relative group/section ${!isVisible && isEditMode ? 'opacity-50 grayscale' : ''}`}>
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
        <div className="absolute -top-12 right-0 flex items-center gap-2 bg-theme-secondary/80 backdrop-blur-md p-1.5 rounded-full border border-theme z-30 shadow-lg">
          <button
            onClick={onToggleVisibility}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            <span className="text-[10px] font-bold uppercase">{isVisible ? 'Visible' : 'Hidden'}</span>
          </button>
          <div className="w-[1px] h-4 bg-theme/20 mx-1" />
          {showMoveUp && (
            <button onClick={onMoveUp} className="p-2 bg-[#EAB308] text-black rounded-full hover:opacity-80 transition-all"><ChevronUp size={16} /></button>
          )}
          {showMoveDown && (
            <button onClick={onMoveDown} className="p-2 bg-[#EAB308] text-black rounded-full hover:opacity-80 transition-all"><ChevronDown size={16} /></button>
          )}
          <button onClick={onDeleteSection} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><Trash size={16} /></button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="relative w-full text-center">
          <div className="w-full">
            <RichTextEditor
              value={getContentString(title)}
              onSave={(val) => onTitleEdit(val, mode)}
              isEditMode={isEditMode}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-theme-primary w-full"
              placeholder="Section Title"
            />

            {(isEditMode || (getContentString(subtitle).trim() !== '' && getContentString(subtitle) !== '<br>')) && (
              <RichTextEditor
                value={getContentString(subtitle)}
                onSave={(val) => onSubtitleEdit(val, mode)}
                isEditMode={isEditMode}
                className="mt-4 text-theme-secondary text-lg w-full"
                placeholder="Section Subtitle"
              />
            )}
            <div
              className={`h-[2px] w-24 mt-6 transition-all duration-500 bg-theme-line ${getLineAlignmentClasses()}`}
            />
          </div>

          {isEditMode && (
            <div className="flex flex-wrap justify-center items-center gap-6 py-6 relative">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 bg-[#EAB308] text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
              >
                <Upload size={20} /> Upload New Images
              </button>
              <button
                onClick={() => setIsManagementModalOpen(true)}
                className="flex items-center gap-2 px-8 py-4 bg-theme-primary text-[#EAB308] border border-[#EAB308] rounded-full font-bold hover:bg-[#EAB308] hover:text-black transition-all shadow-xl group whitespace-nowrap"
              >
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" /> Manage Gallery
              </button>
            </div>
          )}
        </div>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 bg-theme-secondary/20 rounded-2xl border border-dashed border-theme-line/30 mx-4">
          <p className="text-lg text-theme-primary">No designs available yet.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4" onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[250px] sm:min-h-[400px] lg:min-h-[700px] aspect-video group cursor-pointer flex items-center justify-center overflow-hidden rounded-3xl bg-theme-secondary/10 border border-theme/10"
            onClick={() => onImageClick(currentImage)}
          >
            {!mainImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-theme-line border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.img
                ref={mainImageRef}
                key={currentImage?.public_id || currentImage?.url || currentIndex}
                src={getOptimizedUrl(currentImage?.url, 'image', 1600)}
                alt={cleanTitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`max-w-full max-h-full object-contain drop-shadow-2xl transition-opacity duration-500 image-preserve ${mainImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setMainImageLoaded(true)}
                onError={() => setMainImageLoaded(true)}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 z-10 text-white"><ChevronLeft size={24} className="sm:w-8 sm:h-8" /></button>
                <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-4 bg-black/30 hover:bg-black/60 backdrop-blur-md rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 z-10 text-white"><ChevronRight size={24} className="sm:w-8 sm:h-8" /></button>
              </>
            )}
          </motion.div>

          <div className="flex justify-between items-center mt-6 px-2">
            <div className="flex gap-1.5">
              {images.map((img, index) => (
                <div key={img.public_id || `dot-${index}`} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-theme-line' : 'w-2 bg-theme-secondary opacity-40'}`} />
              ))}
            </div>
            <div className="px-3 py-1 bg-theme-secondary/20 backdrop-blur-sm rounded-full text-theme-primary text-xs font-bold">{currentIndex + 1} / {images.length}</div>
          </div>
          {images.length > 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-3 mt-8">
              {images.map((img, index) => (
                <motion.div key={`thumb-${id}-${img.public_id || index}`} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} className={getThumbnailWidth()}>
                  <div className={`relative w-full pb-[100%] rounded-lg overflow-hidden bg-black cursor-pointer transition-all duration-300 border-2 ${index === currentIndex ? 'border-theme-line shadow-xl scale-110 z-10' : 'border-transparent opacity-50 hover:opacity-100'}`} onClick={() => selectImage(index)}>
                    {!thumbnailsLoaded[index] && (<div className="absolute inset-0 flex items-center justify-center bg-black z-10"><div className="w-6 h-6 border-2 border-theme-line border-t-transparent rounded-full animate-spin" /></div>)}
                    <img
                      src={getOptimizedUrl(img.url, 'image', 400)}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-contain p-1 transition-opacity duration-300 image-preserve ${thumbnailsLoaded[index] ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => handleThumbnailLoad(index)}
                      onError={() => handleThumbnailLoad(index)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"><Maximize2 size={20} className="text-white" /></div>
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
