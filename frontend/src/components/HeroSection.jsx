import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Palette, Monitor, Smartphone, ChevronDown } from 'lucide-react';
import RichTextEditor from "./RichTextEditor";

const HeroSection = ({
  heroRef,
  heroVisible,
  isEditMode,
  heroBgColor,
  mode,
  heroOpacity,
  heroScale,
  currentBgUrl,
  setHeroVisible,
  setHeroBgColor,
  handleStaticUpload,
  heroTitle,
  setHeroTitle,
  heroSubtitle,
  setHeroSubtitle,
  scrollToSection,
  workRef
}) => {
  if (!heroVisible && !isEditMode) return null;

  return (
    <section
      ref={heroRef}
      className={`relative h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${!heroVisible ? 'opacity-50 grayscale' : ''}`}
      style={{ backgroundColor: heroBgColor[mode] !== "transparent" ? heroBgColor[mode] : "black" }}
    >
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity }} className="absolute inset-0">
          {currentBgUrl && <img src={currentBgUrl} alt="Background" className="w-full h-full object-cover opacity-100 transition-all duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/40 transition-colors duration-500" />
        </motion.div>
      </motion.div>

      {isEditMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 w-full max-w-[90vw]">
          <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setHeroVisible(!heroVisible)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md transition-all ${heroVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
              >
                {heroVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className="text-xs font-bold uppercase">{heroVisible ? 'Enabled' : 'Disabled'}</span>
              </button>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <Palette size={14} className="text-white" />
                <input type="color" value={heroBgColor[mode] === "transparent" ? "#000000" : heroBgColor[mode]} onChange={(e) => setHeroBgColor(e.target.value, mode)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
                <button onClick={() => setHeroBgColor("transparent", mode)} className="text-[10px] text-white/50 hover:text-white underline">Reset</button>
              </div>
              <div className="flex items-center gap-2">
                <input type="file" onChange={(e) => handleStaticUpload(e, "bg")} className="hidden" id="bg-upload" />
                <label htmlFor="bg-upload" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full text-[10px] sm:text-sm font-bold cursor-pointer border border-white/20 transition-all flex items-center gap-2 whitespace-nowrap">
                  <Monitor size={14} /> Desktop BG
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input type="file" onChange={(e) => handleStaticUpload(e, "bgMobile")} className="hidden" id="bg-mobile-upload" />
                <label htmlFor="bg-mobile-upload" className="bg-[#EAB308]/20 hover:bg-[#EAB308]/30 backdrop-blur-md text-[#EAB308] px-6 py-3 rounded-full text-[10px] sm:text-sm font-bold cursor-pointer border border-[#EAB308]/30 transition-all flex items-center gap-2 whitespace-nowrap">
                  <Smartphone size={14} /> Mobile BG
                </label>
              </div>
          </div>
        </div>
      )}

      <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="flex flex-col items-center max-w-full">
          <RichTextEditor value={heroTitle[mode]} onSave={(val) => setHeroTitle(val, mode)} isEditMode={isEditMode} className="text-[clamp(2rem,10vw,8rem)] font-bold text-white mb-4 sm:mb-6 tracking-tighter px-2 break-words max-w-full text-center leading-[0.9]" placeholder="Hero Title" />
          <RichTextEditor value={heroSubtitle[mode]} onSave={(val) => setHeroSubtitle(val, mode)} isEditMode={isEditMode} className="text-white/90 text-[clamp(0.6rem,2vw,1.5rem)] tracking-[0.2em] sm:tracking-[0.5em] uppercase px-4 break-words max-w-full text-center" placeholder="Hero Subtitle" />
        </motion.div>
      </div>

      <button onClick={() => scrollToSection(workRef)} className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:text-[#EAB308] transition-colors z-20">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={24} className="text-white/60 hover:text-[#EAB308]" />
        </motion.div>
      </button>
    </section>
  );
};

export default HeroSection;
