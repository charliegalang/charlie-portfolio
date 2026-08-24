import React from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import CrudControls from './CrudControls';

const PromiseItem = ({ item, index, onUpdate, onDelete, onMove, isEditMode, mode = 'light' }) => {
  // Extract values based on current mode
  const nValue = typeof item.n === 'object' ? (item.n[mode] || "") : item.n;
  const tValue = typeof item.t === 'object' ? (item.t[mode] || "") : item.t;
  const dValue = typeof item.d === 'object' ? (item.d[mode] || "") : item.d;
  const bgColorValue = typeof item.bgColor === 'object' ? (item.bgColor[mode] || "transparent") : (item.bgColor || "transparent");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group p-4 sm:p-5 md:p-6 lg:p-8 rounded-[30px] sm:rounded-[35px] md:rounded-[40px] bg-theme-primary border border-theme hover:shadow-xl transition-all duration-500 relative"
      style={{ backgroundColor: bgColorValue !== 'transparent' ? bgColorValue : '' }}
    >
      {isEditMode && (
        <>
          <CrudControls
            onDelete={onDelete}
            onMoveUp={() => onMove('up')}
            onMoveDown={() => onMove('down')}
            className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-theme-secondary/50 backdrop-blur-md p-1.5 rounded-xl border border-theme z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Palette size={12} className="text-theme-primary" />
            <input
              type="color"
              value={bgColorValue === 'transparent' ? (mode === 'dark' ? '#000000' : '#ffffff') : bgColorValue}
              onChange={(e) => onUpdate('bgColor', e.target.value)}
              className="w-4 h-4 rounded cursor-pointer bg-transparent border-none"
            />
            <button onClick={() => onUpdate('bgColor', 'transparent')} className="text-[8px] text-theme-secondary hover:text-theme-primary underline">Reset</button>
          </div>
        </>
      )}
      <RichTextEditor
        value={nValue}
        onSave={(val) => onUpdate('n', val)}
        isEditMode={isEditMode}
        className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 md:mb-5 lg:mb-6"
        style={{ color: 'inherit', opacity: 0.2 }}
        placeholder="00"
      />
      <RichTextEditor
        value={tValue}
        onSave={(val) => onUpdate('t', val)}
        isEditMode={isEditMode}
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-theme-primary"
        placeholder="Title"
      />
      <RichTextEditor
        value={dValue}
        onSave={(val) => onUpdate('d', val)}
        isEditMode={isEditMode}
        className="text-sm sm:text-base md:text-lg text-theme-secondary leading-relaxed"
        placeholder="Description..."
      />
    </motion.div>
  )
}

export default PromiseItem;
