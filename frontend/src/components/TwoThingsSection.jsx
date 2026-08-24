import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import SectionTitle from "./SectionTitle";
import PromiseItem from "./PromiseItem";
import CrudControls from "./CrudControls";
import ColorPickerField from "./ColorPickerField";

const TwoThingsSection = ({
  twoThingsVisible,
  isEditMode,
  twoThingsBgColor,
  mode,
  darkMode,
  setTwoThingsVisible,
  setTwoThingsBgColor,
  twoThingsLineColor,
  addPromiseItem,
  twoThingsSubtitle,
  setTwoThingsTitle,
  setTwoThingsSubtitle,
  twoThingsTitle,
  promiseItems,
  updatePromiseItem,
  deletePromiseItem,
  movePromiseItem
}) => {
  if (!twoThingsVisible && !isEditMode) return null;

  return (
    <section
      className={`py-12 sm:py-24 px-4 sm:px-8 bg-theme-secondary transition-colors duration-500 relative ${!twoThingsVisible ? 'opacity-50 grayscale' : ''}`}
      style={{ backgroundColor: twoThingsBgColor[mode] !== "transparent" ? twoThingsBgColor[mode] : "" }}
    >
      {isEditMode && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-30">
          <button
            onClick={() => setTwoThingsVisible(!twoThingsVisible)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all ${twoThingsVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
          >
            {twoThingsVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="text-[10px] font-bold uppercase">{twoThingsVisible ? 'Enabled' : 'Disabled'}</span>
          </button>
          <ColorPickerField
            label="Bg"
            value={twoThingsBgColor[mode] === "transparent" ? (darkMode ? "#0a0a0a" : "#F5F5F5") : twoThingsBgColor[mode]}
            onChange={(val) => setTwoThingsBgColor(val, mode)}
            onReset={() => setTwoThingsBgColor("transparent", mode)}
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto relative">
        {isEditMode && <CrudControls onAdd={addPromiseItem} className="absolute -top-12 right-0" />}
        <SectionTitle
          align="center"
          subtitle={twoThingsSubtitle[mode]}
          lineColor={twoThingsLineColor}
          isEditMode={isEditMode}
          onTitleEdit={(val) => setTwoThingsTitle(val, mode)}
          onSubtitleEdit={(val) => setTwoThingsSubtitle(val, mode)}
          mode={mode}
        >
          {twoThingsTitle[mode]}
        </SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-16">
          {promiseItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <PromiseItem
                item={item}
                index={i}
                onUpdate={(f, v) => updatePromiseItem(item.id, f, v, mode)}
                onDelete={() => deletePromiseItem(item.id)}
                onMove={(dir) => movePromiseItem(item.id, dir)}
                isEditMode={isEditMode}
                mode={mode}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TwoThingsSection;
