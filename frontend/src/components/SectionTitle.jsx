import React from 'react';
import { motion } from 'framer-motion';
import RichTextEditor from './RichTextEditor';

const SectionTitle = ({
  children,
  align: initialAlign = "left",
  subtitle,
  isEditMode,
  onTitleEdit,
  onSubtitleEdit,
  mode = 'light'
}) => {
  // Logic to detect alignment from the RichTextEditor content
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
    const checkLeft = (val) => {
      if (!val || typeof val !== 'string') return false;
      const lower = val.toLowerCase();
      return lower.includes('text-align: left') || lower.includes('text-align:left');
    };

    // Check title and subtitle for alignment
    const hasCenter = checkCenter(children) || checkCenter(subtitle);
    const hasRight = checkRight(children) || checkRight(subtitle);
    const hasLeft = checkLeft(children) || checkLeft(subtitle);

    if (hasCenter) return 'mx-auto';
    if (hasRight) return 'ml-auto mr-0';
    if (hasLeft) return 'mr-auto ml-0';

    // Fallback to initialAlign if no specific alignment found in HTML
    if (initialAlign === 'center') return 'mx-auto';
    if (initialAlign === 'right') return 'ml-auto mr-0';
    return 'mr-auto ml-0';
  };

  const lineClasses = getLineAlignmentClasses();
  const isCentered = lineClasses === 'mx-auto';
  const isRight = lineClasses === 'ml-auto mr-0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 flex flex-col w-full ${isCentered ? 'items-center text-center' : isRight ? 'items-end text-right' : 'items-start text-left'}`}
    >
      <div className="w-full">
        <RichTextEditor
          value={children}
          onSave={onTitleEdit}
          isEditMode={isEditMode}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-theme-primary w-full"
          placeholder="Section Title"
        />
      </div>
      {subtitle && (
        <div className="w-full">
          <RichTextEditor
            value={subtitle}
            onSave={onSubtitleEdit}
            isEditMode={isEditMode}
            className={`mt-4 text-theme-secondary text-lg w-full ${isCentered ? 'mx-auto' : isRight ? 'ml-auto' : 'mr-auto'}`}
            placeholder="Section Subtitle"
          />
        </div>
      )}
      <div className="w-full flex flex-col">
        <div
          className={`h-[2px] w-24 mt-6 transition-all duration-500 bg-theme-line ${lineClasses}`}
        />
      </div>
    </motion.div>
  );
};

export default SectionTitle;
