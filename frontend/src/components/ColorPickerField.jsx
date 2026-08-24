import React from 'react';

const ColorPickerField = ({ label, value, onChange, onReset }) => {
  return (
    <div className="flex items-center gap-2 bg-theme-primary/40 backdrop-blur-md p-2 rounded-xl border border-theme shadow-sm">
      <span className="text-[10px] font-bold text-gray-400 uppercase">{label}:</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer bg-transparent border-none"
      />
      <button
        onClick={onReset}
        className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors underline"
      >
        Reset
      </button>
    </div>
  );
};

export default ColorPickerField;
