import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Trash2, X, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, Eye, EyeOff
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import { uploadToCloudinary } from "../services/CloudinaryService";
import { getOptimizedUrl } from "../utils/portfolioUtils";

const VideoCard = ({ video, onDelete, isEditMode, onClick, onUpdateDescription }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (isHovered && videoEl) {
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <div className="flex flex-col gap-4 w-full h-full group/vcard">
      <motion.div
        className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-white/5 w-full shrink-0"
        whileHover={{ y: -4, scale: 1.02 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <video
          ref={videoRef}
          src={getOptimizedUrl(video.url, 'video', 400)}
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100"
          muted
          playsInline
          preload="auto"
          loop
        />
        {isEditMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover/vcard:opacity-100 transition-all shadow-xl z-50 border border-white/20"
            title="Delete Video"
          >
            <Trash2 size={16} />
          </button>
        )}
      </motion.div>
      <div className="px-1 w-full overflow-hidden">
        {isEditMode ? (
          <RichTextEditor
            value={video.description || ""}
            onSave={(val) => onUpdateDescription(val)}
            isEditMode={true}
            className="text-sm text-theme-primary font-medium w-full"
            placeholder="Add video description..."
          />
        ) : (
          video.description && (
            <div
              className="text-sm text-theme-primary font-medium leading-relaxed opacity-90 break-words whitespace-pre-wrap overflow-hidden line-clamp-3"
              dangerouslySetInnerHTML={{ __html: video.description }}
            />
          )
        )}
      </div>
    </div>
  );
};

const VideoItem = ({ video, idx, total, isEditMode, onUpdateDescription, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleActivity = () => {
      setShowDescription(true);
      if (timerRef.current) clearTimeout(timerRef.current);

      if (isPlaying && !isHovering) {
        timerRef.current = setTimeout(() => {
          setShowDescription(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isHovering, isEditMode]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isActive]);

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);

  const isVisible = showDescription || (isEditMode && !isPlaying);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center snap-start relative bg-black overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Subtle top gradient to make text readable */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-[15] pointer-events-none" />

        <video
          ref={videoRef}
          src={getOptimizedUrl(video.url, 'video')}
          className="w-full h-full object-contain z-10 cursor-pointer"
          controls
          playsInline
          loop
          onPlay={onPlay}
          onPause={onPause}
        />

        <AnimatePresence>
          {isVisible && video.description && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`absolute top-10 left-6 sm:left-10 z-[20] pointer-events-none max-w-[70%] sm:max-w-md hide-scrollbar ${!isVisible ? 'overflow-y-hidden' : ''}`}
            >
              <div className="bg-transparent pointer-events-none">
                <div className="text-white text-sm md:text-base font-semibold leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,1)] overflow-y-auto max-h-[25vh] hide-scrollbar pointer-events-none">
                  {isEditMode ? (
                    <div className="pointer-events-auto">
                      <RichTextEditor
                        value={video.description || ""}
                        onSave={(val) => onUpdateDescription(idx, val)}
                        isEditMode={true}
                        className="w-full text-white bg-transparent"
                        placeholder="Write a description..."
                      />
                    </div>
                  ) : (
                    <div
                      className="prose prose-invert max-w-none inline-block"
                      dangerouslySetInnerHTML={{ __html: video.description }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FullScreenVideoModal = ({ videos, initialIndex, onClose, onUpdateDescription, isEditMode }) => {
  const modalRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    // Aggressively hide all possible scrollbars
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('hide-scrollbar');

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('hide-scrollbar');
    };
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      const target = modalRef.current.children[initialIndex];
      if (target) target.scrollIntoView({ behavior: 'auto' });
    }
  }, [initialIndex]);

  const handleScroll = (e) => {
    const scrollPos = e.target.scrollTop;
    const itemHeight = window.innerHeight;
    const newIndex = Math.round(scrollPos / itemHeight);
    if (newIndex !== activeIndex) setActiveIndex(newIndex);
  };

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000000] bg-black flex flex-col items-center justify-center overflow-hidden hide-scrollbar">
      <button onClick={onClose} className="fixed top-8 right-8 z-[2000001] p-4 bg-white/10 hover:bg-red-500 backdrop-blur-xl rounded-full text-white transition-all shadow-2xl border border-white/20 active:scale-90">
        <X size={32} />
      </button>
      <div
        ref={modalRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
          .hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        `}</style>
        {videos.map((video, idx) => (
          <VideoItem key={idx} video={video} idx={idx} total={videos.length} isEditMode={isEditMode} onUpdateDescription={onUpdateDescription} isActive={idx === activeIndex} />
        ))}
      </div>
    </motion.div>,
    document.body
  );
};

const VideoSection = ({
  id,
  categoryId,
  videos = [],
  title,
  subtitle,
  isVisible = true,
  lineColor,
  isEditMode,
  onUpload,
  onDelete,
  onTitleEdit,
  onSubtitleEdit,
  onToggleVisibility,
  onUpdateDescription,
  onMoveUp,
  onMoveDown,
  onDeleteSection,
  showMoveUp,
  showMoveDown,
  sectionBgColor,
  setGlobalUploadProgress,
  mode = 'light'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showFullVideo, setShowFullVideo] = useState(false);
  const [initialVideoIndex, setInitialVideoIndex] = useState(0);
  const [scrollIndex, setScrollIndex] = useState(0);
  const fileInputRef = useRef(null);
  const [visibleVideosCount, setVisibleVideosCount] = useState(4);

  // Helper to safely get string content for alignment checks
  const getContentString = (val) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val[mode] || "";
  };

  const currentTitle = getContentString(title);
  const currentSubtitle = getContentString(subtitle);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setVisibleVideosCount(1.2);
      else if (window.innerWidth < 1024) setVisibleVideosCount(2.5);
      else setVisibleVideosCount(4);
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const taskId = `video_${Date.now()}`;
    setIsUploading(true);
    setGlobalUploadProgress(taskId, { percent: 0, phase: 'starting' });
    try {
      const data = await uploadToCloudinary(file, categoryId, (progress) =>
        setGlobalUploadProgress(taskId, progress)
      );
      if (data) {
        onUpload({ ...data, description: "" });
        setGlobalUploadProgress(taskId, { percent: 100, phase: 'success' });
        setTimeout(() => setGlobalUploadProgress(taskId, null), 3000);
      }
    } catch (error) {
      alert("Video upload failed: " + error.message);
      setGlobalUploadProgress(taskId, null);
    } finally {
      setIsUploading(false);
    }
  };

  const maxScroll = Math.max(0, videos.length - Math.floor(visibleVideosCount));

  const nextSlide = () => setScrollIndex(prev => Math.min(prev + 1, maxScroll));
  const prevSlide = () => setScrollIndex(prev => Math.max(prev - 1, 0));

  const getLineAlignmentClasses = () => {
    const checkCenter = (val) => val && typeof val === 'string' && (val.toLowerCase().includes('text-align: center') || val.toLowerCase().includes('<center'));
    const checkRight = (val) => val && typeof val === 'string' && (val.toLowerCase().includes('text-align: right') || val.toLowerCase().includes('text-align:right'));
    const alignmentValue = (currentSubtitle && currentSubtitle.trim() !== '' && currentSubtitle !== '<br>') ? currentSubtitle : currentTitle;
    if (checkCenter(alignmentValue)) return 'mx-auto';
    if (checkRight(alignmentValue)) return 'ml-auto mr-0';
    return 'mr-auto';
  };

  const gap = 24;
  const cardWidth = `calc((100% - ${gap * (Math.ceil(visibleVideosCount) - 1)}px) / ${visibleVideosCount})`;

  return (
    <section className={`relative transition-colors duration-300 pb-20 pt-10 ${!isVisible && isEditMode ? 'opacity-50 grayscale' : ''}`} style={{ backgroundColor: sectionBgColor }}>
      <div className="max-w-7xl mx-auto px-4 relative overflow-visible">
        {/* Section Controls - Floating inside padding */}
        {isEditMode && (
          <div className="absolute top-0 right-4 flex items-center gap-2 z-50">
            <button
              onClick={onToggleVisibility}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
              title={isVisible ? "Disable Section" : "Enable Section"}
            >
              {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className="text-[10px] font-bold uppercase">{isVisible ? 'Visible' : 'Hidden'}</span>
            </button>
            <div className="w-[1px] h-4 bg-theme/20 mx-1" />
            {showMoveUp && (
              <button onClick={onMoveUp} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all shadow-lg">
                <ChevronUp size={14} />
              </button>
            )}
            {showMoveDown && (
              <button onClick={onMoveDown} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all shadow-lg">
                <ChevronDown size={14} />
              </button>
            )}
            <button onClick={onDeleteSection} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg">
              <Trash2 size={14} />
            </button>
          </div>
        )}

        <div className="mb-8 relative">
          <div className="relative w-full">
            {isEditMode && (
              <div className="flex justify-center py-6">
                <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="video/*" />
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center gap-2 px-8 py-4 bg-[#EAB308] text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap">
                  <Upload size={20} /> Add Video
                </button>
              </div>
            )}

            <div className="w-full text-center">
              <RichTextEditor
                value={currentTitle}
                onSave={(val) => onTitleEdit(val, mode)}
                isEditMode={isEditMode}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-theme-primary w-full"
                placeholder="Video Category"
              />
              {(isEditMode || (currentSubtitle && currentSubtitle.trim() !== '' && currentSubtitle !== '<br>')) && (
                <RichTextEditor
                  value={currentSubtitle}
                  onSave={(val) => onSubtitleEdit(val, mode)}
                  isEditMode={isEditMode}
                  className="mt-6 text-theme-secondary text-xl w-full opacity-60"
                  placeholder="Add a description..."
                />
              )}
              <div
                className={`h-[2px] w-24 mt-6 transition-all duration-500 bg-theme-line ${getLineAlignmentClasses()}`}
              />
            </div>
          </div>
        </div>

        <div className="relative group/slider px-2">
          {videos.length > visibleVideosCount && scrollIndex > 0 && (
            <button onClick={prevSlide} className="absolute left-[-20px] top-[40%] -translate-y-1/2 z-40 p-4 bg-theme-primary/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl text-theme-primary hover:bg-[#EAB308] hover:text-black transition-all opacity-0 group-hover/slider:opacity-100"><ChevronLeft size={24} /></button>
          )}
          <div className="overflow-hidden">
            <motion.div className="flex" style={{ gap: `${gap}px` }} animate={{ x: `calc(-${scrollIndex} * (${cardWidth} + ${gap}px))` }} transition={{ type: "spring", damping: 30, stiffness: 150 }}>
              {videos.map((video, idx) => (
                <div key={video.public_id || idx} style={{ width: cardWidth }} className="shrink-0">
                  <VideoCard video={video} isEditMode={isEditMode} onDelete={() => onDelete(idx)} onUpdateDescription={(val) => onUpdateDescription(idx, val)} onClick={() => { setInitialVideoIndex(idx); setShowFullVideo(true); }} />
                </div>
              ))}
            </motion.div>
          </div>
          {videos.length > visibleVideosCount && scrollIndex < maxScroll && (
            <button onClick={nextSlide} className="absolute right-[-20px] top-[40%] -translate-y-1/2 z-40 p-4 bg-theme-primary/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl text-theme-primary hover:bg-[#EAB308] hover:text-black transition-all opacity-0 group-hover/slider:opacity-100"><ChevronRight size={24} /></button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFullVideo && <FullScreenVideoModal videos={videos} initialIndex={initialVideoIndex} onClose={() => setShowFullVideo(false)} onUpdateDescription={onUpdateDescription} isEditMode={isEditMode} />}
      </AnimatePresence>
    </section>
  );
};

export default VideoSection;
