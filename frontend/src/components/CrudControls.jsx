import React from 'react';
import { Plus, ChevronUp, ChevronDown, Trash } from 'lucide-react';
import { useEditMode } from '../hooks/useEditMode';

const CrudControls = ({ onAdd, onDelete, onMoveUp, onMoveDown, showMove = true, className = "" }) => {
  const isEditMode = useEditMode();

  if (!isEditMode) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {onAdd && (
        <button
          onClick={onAdd}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          title="Add new"
        >
          <Plus size={16} />
        </button>
      )}
      {onMoveUp && showMove && (
        <button
          onClick={onMoveUp}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          title="Move up"
        >
          <ChevronUp size={16} />
        </button>
      )}
      {onMoveDown && showMove && (
        <button
          onClick={onMoveDown}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          title="Move down"
        >
          <ChevronDown size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Delete"
        >
          <Trash size={16} />
        </button>
      )}
    </div>
  )
}

export default CrudControls;
