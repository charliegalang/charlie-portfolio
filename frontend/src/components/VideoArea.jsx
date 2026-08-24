import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import VideoSection from "./VideoSection";
import ColorPickerField from "./ColorPickerField";

const VideoArea = ({
  videoRef,
  hasVisibleVideo,
  isEditMode,
  videoBgColor,
  mode,
  darkMode,
  setVideoBgColor,
  videoLineColor,
  addVideoSection,
  videoSections,
  updateVideoItems,
  updateVideoSection,
  updateVideoDescription,
  moveVideoSection,
  deleteVideoSection,
  updateUpload
}) => {
  if (!hasVisibleVideo && !isEditMode) return null;

  return (
    <div
      ref={videoRef}
      className="relative transition-colors duration-500 pb-20"
      style={{ backgroundColor: videoBgColor[mode] !== "transparent" ? videoBgColor[mode] : "var(--theme-primary)" }}
    >
      {isEditMode && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-30">
           <ColorPickerField
             label="Bg"
             value={videoBgColor[mode] === "transparent" ? (darkMode ? "#000000" : "#ffffff") : videoBgColor[mode]}
             onChange={(val) => setVideoBgColor(val, mode)}
             onReset={() => setVideoBgColor("transparent", mode)}
           />
        </div>
      )}
      {isEditMode && (
        <div className="flex justify-center items-center gap-6 py-12 relative">
           <button
            onClick={addVideoSection}
            className="flex items-center gap-2 px-8 py-4 bg-[#EAB308] text-black rounded-full font-bold hover:opacity-80 transition-all hover:scale-105 shadow-xl"
           >
             <Plus size={20} /> Add New Video Collection
           </button>
        </div>
      )}
      {videoSections.map((section, idx) => (section.isVisible || isEditMode) && (
        <motion.div key={section.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className={!section.isVisible ? 'opacity-50 grayscale' : ''}>
          <VideoSection
            id={section.id}
            categoryId={section.categoryId}
            videos={section.videos}
            title={section.title}
            subtitle={section.subtitle}
            isVisible={section.isVisible}
            lineColor={videoLineColor}
            isEditMode={isEditMode}
            sectionBgColor="transparent"
            onUpload={(data) => updateVideoItems(section.id, (prev) => [...prev, data])}
            onDelete={(vIdx) => confirm("Delete this video?") && updateVideoItems(section.id, (prev) => prev.filter((_, i) => i !== vIdx))}
            onTitleEdit={(val) => updateVideoSection(section.id, 'title', val, mode)}
            onSubtitleEdit={(val) => updateVideoSection(section.id, 'subtitle', val, mode)}
            onToggleVisibility={() => updateVideoSection(section.id, "isVisible", !section.isVisible, mode)}
            onUpdateDescription={(vIdx, desc) => updateVideoDescription(section.id, vIdx, desc)}
            onMoveUp={idx > 0 ? () => moveVideoSection(section.id, "up") : null}
            onMoveDown={idx < videoSections.length - 1 ? () => moveVideoSection(section.id, "down") : null}
            onDeleteSection={() => deleteVideoSection(section.id)}
            showMoveUp={idx > 0}
            showMoveDown={idx < videoSections.length - 1}
            setGlobalUploadProgress={updateUpload}
            mode={mode}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default VideoArea;
