import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Palette, Upload, ArrowRight, Type } from 'lucide-react';
import RichTextEditor from "./RichTextEditor";
import StatItem from "./StatItem";
import CrudControls from "./CrudControls";

const AboutSection = ({
  aboutRef,
  aboutVisible,
  isEditMode,
  aboutBgColor,
  mode,
  darkMode,
  setAboutVisible,
  setAboutBgColor,
  profileBgColor,
  setProfileBgColor,
  optimizedProfileUrl,
  handleStaticUpload,
  aboutName,
  setAboutName,
  aboutText,
  setAboutText,
  stats,
  addStat,
  updateStat,
  deleteStat,
  moveStat,
  scrollToSection,
  contactRef,
  aboutButtonBg,
  setAboutButtonBg,
  aboutButtonColor,
  setAboutButtonColor,
  aboutButtonText,
  setAboutButtonText
}) => {
  if (!aboutVisible && !isEditMode) return null;

  return (
    <section
      ref={aboutRef}
      className={`py-20 sm:py-32 md:py-40 px-6 sm:px-12 md:px-20 lg:px-32 relative overflow-hidden ${!aboutVisible ? 'opacity-50 grayscale' : ''}`}
      style={{ backgroundColor: aboutBgColor[mode] !== "transparent" ? aboutBgColor[mode] : "" }}
    >
      {isEditMode && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-theme-secondary/50 backdrop-blur-md p-2 rounded-xl border border-theme z-30">
          <button
            onClick={() => setAboutVisible(!aboutVisible)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${aboutVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
          >
            {aboutVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="text-[10px] font-bold uppercase">{aboutVisible ? 'Enabled' : 'Disabled'}</span>
          </button>
          <div className="w-[1px] h-4 bg-theme/20 mx-1" />
          <Palette size={14} className="text-theme-primary" />
          <input type="color" value={aboutBgColor[mode] === "transparent" ? (darkMode ? "#000000" : "#ffffff") : aboutBgColor[mode]} onChange={(e) => setAboutBgColor(e.target.value, mode)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
          <button onClick={() => setAboutBgColor("transparent", mode)} className="text-[10px] text-theme-secondary hover:text-theme-primary underline">Reset</button>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-10 order-2 lg:order-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[2px] w-12 bg-theme-line" />
                <span className="text-theme-line font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">About Me</span>
              </div>
              <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.9] text-theme-primary">
                <RichTextEditor value={aboutName[mode]} onSave={(val) => setAboutName(val, mode)} isEditMode={isEditMode} className="inline-block break-words max-w-full" placeholder="Your Name" />
              </h2>
            </div>

            <RichTextEditor
              value={aboutText[mode]}
              onSave={(val) => setAboutText(val, mode)}
              isEditMode={isEditMode}
              className="text-[clamp(1.1rem,2.5vw,1.8rem)] text-theme-secondary leading-relaxed font-medium"
              placeholder="Designing simplicity out of complexity."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 py-4 relative">
              {isEditMode && <CrudControls onAdd={addStat} className="absolute -top-8 right-0" />}
              {stats.map((stat, i) => (
                <StatItem
                  key={stat.id}
                  stat={stat}
                  index={i}
                  onUpdate={(field, value) => updateStat(stat.id, field, value, mode)}
                  onDelete={() => deleteStat(stat.id)}
                  onMove={(dir) => moveStat(stat.id, dir)}
                  isEditMode={isEditMode}
                  mode={mode}
                />
              ))}
            </div>

            <div className="relative inline-flex items-center group/btn">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(contactRef)}
                className="group inline-flex items-center gap-4 px-10 py-5 rounded-full text-base sm:text-lg font-bold shadow-2xl transition-all border-2 border-transparent"
                style={{ backgroundColor: aboutButtonBg[mode] === "#EAB308" ? 'var(--theme-icon)' : aboutButtonBg[mode], color: aboutButtonColor[mode] }}
              >
                <RichTextEditor
                  value={aboutButtonText[mode]}
                  onSave={(val) => setAboutButtonText(val, mode)}
                  isEditMode={isEditMode}
                  className="inline-block"
                  placeholder="Button Text"
                />
                {!isEditMode && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
              </motion.button>
              {isEditMode && (
                <div className="absolute -top-10 left-0 opacity-0 group-hover/btn:opacity-100 transition-opacity flex flex-col gap-1 bg-theme-primary/80 backdrop-blur-md p-1.5 rounded-lg border border-theme shadow-xl z-50">
                  <div className="flex items-center gap-2">
                    <Palette size={12} className="text-theme-primary" />
                    <input type="color" value={aboutButtonBg[mode]} onChange={(e) => setAboutButtonBg(e.target.value, mode)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
                    <button onClick={() => setAboutButtonBg("#EAB308", mode)} className="text-[8px] text-theme-secondary hover:text-theme-primary underline">Reset Bg</button>
                  </div>
                  <div className="flex items-center gap-2 border-t border-theme/20 pt-1">
                    <Type size={12} className="text-theme-primary" />
                    <input type="color" value={aboutButtonColor[mode]} onChange={(e) => setAboutButtonColor(e.target.value, mode)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
                    <button onClick={() => setAboutButtonColor("#000000", mode)} className="text-[8px] text-theme-secondary hover:text-theme-primary underline">Reset Text</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative order-1 lg:order-2"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto">
              <div
                className="absolute -inset-4 rounded-3xl border-2 border-theme-line/30 translate-x-8 translate-y-8 hidden sm:block"
              />
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl z-10 bg-transparent"
              >
                {optimizedProfileUrl && (
                  <img
                    src={optimizedProfileUrl}
                    alt="Profile"
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                )}
              </div>

              {isEditMode && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 w-full">
                  <input type="file" onChange={(e) => handleStaticUpload(e, "profile")} className="hidden" id="profile-upload" />
                  <label htmlFor="profile-upload" className="bg-[#EAB308] text-black px-6 py-3 rounded-full text-sm font-bold cursor-pointer shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"><Upload size={14} /> Update Profile</label>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
