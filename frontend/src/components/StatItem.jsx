import React from 'react';
import RichTextEditor from './RichTextEditor';
import CrudControls from './CrudControls';

const StatItem = ({ stat, index, onUpdate, onDelete, onMove, isEditMode, mode = 'light' }) => {
  // Ensure we extract the string from the mode-object if it is one
  const nValue = typeof stat.n === 'object' ? stat.n[mode] : stat.n;
  const lValue = typeof stat.l === 'object' ? stat.l[mode] : stat.l;

  return (
    <div className="relative group/stat flex flex-col items-center md:items-start min-w-[60px]">
      {isEditMode && (
        <div className="absolute -top-8 left-0 right-0 flex justify-center opacity-0 group-hover/stat:opacity-100 transition-opacity z-20">
          <CrudControls
            onDelete={onDelete}
            onMoveUp={() => onMove('up')}
            onMoveDown={() => onMove('down')}
          />
        </div>
      )}
      <RichTextEditor
        value={nValue}
        onSave={(val) => onUpdate('n', val)}
        isEditMode={isEditMode}
        className="text-xl sm:text-2xl md:text-3xl font-bold text-theme-primary"
        style={{ color: 'inherit' }}
        placeholder="0"
      />
      <RichTextEditor
        value={lValue}
        onSave={(val) => onUpdate('l', val)}
        isEditMode={isEditMode}
        className="text-xs sm:text-sm text-theme-secondary"
        style={{ color: 'inherit' }}
        placeholder="Label"
      />
    </div>
  )
}

export default StatItem;
