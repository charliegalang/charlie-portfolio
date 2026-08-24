import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import GallerySection from "./GallerySection";
import ColorPickerField from "./ColorPickerField";

const GalleryArea = ({
  workRef,
  hasVisibleGallery,
  isEditMode,
  galleryBgColor,
  mode,
  darkMode,
  setGalleryBgColor,
  galleryLineColor,
  addGallerySection,
  gallerySections,
  setSelectedImage,
  updateGalleryImages,
  updateGallerySection,
  moveGallerySection,
  deleteGallerySection,
  updateUpload
}) => {
  if (!hasVisibleGallery && !isEditMode) return null;

  return (
    <div
      ref={workRef}
      className="bg-theme-secondary transition-colors duration-500 relative py-12 sm:py-24"
      style={{ backgroundColor: galleryBgColor[mode] !== "transparent" ? galleryBgColor[mode] : "" }}
    >
      {isEditMode && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-30">
          <ColorPickerField
            label="Bg"
            value={galleryBgColor[mode] === "transparent" ? (darkMode ? "#0a0a0a" : "#F5F5F5") : galleryBgColor[mode]}
            onChange={(val) => setGalleryBgColor(val, mode)}
            onReset={() => setGalleryBgColor("transparent", mode)}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {isEditMode && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={addGallerySection}
              className="flex items-center gap-2 px-8 py-4 bg-[#EAB308] text-black rounded-full font-bold hover:opacity-80 transition-all hover:scale-105 shadow-lg"
            >
              <Plus size={20} /> Add New Gallery Section
            </button>
          </div>
        )}
        {gallerySections.map((section, idx) => (section.isVisible || isEditMode) && (
          <motion.div key={section.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className={!section.isVisible ? 'opacity-50 grayscale' : ''}>
            <GallerySection
              id={section.id}
              categoryId={section.categoryId}
              images={section.images}
              title={section.title}
              subtitle={section.subtitle}
              isVisible={section.isVisible}
              lineColor={galleryLineColor}
              onImageClick={setSelectedImage}
              isEditMode={isEditMode}
              onUpload={(data, replace = false) => {
                if (replace) {
                  updateGalleryImages(section.id, data);
                } else {
                  const newItems = Array.isArray(data) ? data : [data];
                  updateGalleryImages(section.id, (prev) => [...prev, ...newItems]);
                }
              }}
              onDelete={(imgIdx) => updateGalleryImages(section.id, (prev) => prev.filter((_, i) => i !== imgIdx))}
              onTitleEdit={(val) => updateGallerySection(section.id, "title", val, mode)}
              onSubtitleEdit={(val) => updateGallerySection(section.id, "subtitle", val, mode)}
              onToggleVisibility={() => updateGallerySection(section.id, "isVisible", !section.isVisible, mode)}
              onMoveUp={idx > 0 ? () => moveGallerySection(section.id, "up") : null}
              onMoveDown={idx < gallerySections.length - 1 ? () => moveGallerySection(section.id, "down") : null}
              onDeleteSection={() => deleteGallerySection(section.id)}
              showMoveUp={idx > 0}
              showMoveDown={idx < gallerySections.length - 1}
              setGlobalUploadProgress={updateUpload}
              mode={mode}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryArea;
