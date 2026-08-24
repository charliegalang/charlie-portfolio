import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, X, Menu, LogOut, ToggleLeft, ToggleRight, Settings2, Palette, Type, Layout, Sliders } from 'lucide-react';
import ColorPickerField from './ColorPickerField';

const Navigation = ({
  scrolled,
  handleNameClick,
  optimizedProfileUrl,
  navDisplayName,
  scrollToSection,
  workRef,
  aboutRef,
  contactRef,
  navWorkLabel,
  navAboutLabel,
  navContactLabel,
  mode,
  darkMode,
  setDarkMode,
  isLoggedIn,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  isEditMode,
  textPrimaryColor,
  setTextPrimaryColor,
  textSecondaryColor,
  setTextSecondaryColor,
  universalLineColor,
  setUniversalLineColor,
  universalIconColor,
  setUniversalIconColor,
  lightModeEnabled,
  setLightModeEnabled,
  darkModeEnabled,
  setDarkModeEnabled,
  navColorTop,
  setNavColorTop,
  navColorScrolled,
  setNavColorScrolled
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const showThemeToggle = lightModeEnabled && darkModeEnabled;

  const toggleThemeControl = (type) => {
    if (type === 'light') {
      if (lightModeEnabled && !darkModeEnabled) return;
      setLightModeEnabled(!lightModeEnabled);
    } else {
      if (darkModeEnabled && !lightModeEnabled) return;
      setDarkModeEnabled(!darkModeEnabled);
    }
  };

  const currentNavColor = scrolled ? navColorScrolled[mode] : navColorTop[mode];

  // This CSS variable is used in index.css to force the color on all children (overriding rich text colors)
  const navStyle = {
    '--nav-current-color': currentNavColor,
    color: currentNavColor
  };

  const NavItem = ({ label, targetRef }) => (
    <button
      onClick={() => scrollToSection(targetRef)}
      className="hover:opacity-70 transition-all nav-force-color whitespace-nowrap"
      style={navStyle}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 transition-all ${
        scrolled ? "bg-theme-primary/80 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={handleNameClick}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#EAB308] overflow-hidden">
            {optimizedProfileUrl && <img src={optimizedProfileUrl} alt="Avatar" className="w-full h-full object-cover" />}
          </div>
          <span
            className="font-bold text-sm sm:text-base transition-colors truncate max-w-[120px] sm:max-w-none uppercase tracking-wider nav-force-color"
            style={navStyle}
            dangerouslySetInnerHTML={{ __html: navDisplayName }}
          />
        </div>

        {isEditMode && (
          <div className="relative">
             <button
                onClick={() => setShowEditor(!showEditor)}
                className={`p-2 rounded-xl transition-all shadow-xl flex items-center gap-2 border ${showEditor ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-black/60 text-white border-white/20 hover:bg-black/80'}`}
             >
                <Settings2 size={16} />
                <span className="text-[10px] font-black uppercase hidden lg:inline">Theme & Nav Setup</span>
             </button>

             <AnimatePresence>
                {showEditor && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 bg-zinc-900/95 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] w-[320px] sm:w-[500px] max-h-[80vh] overflow-y-auto no-scrollbar"
                  >
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Palette size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Global & Navigation Styles</h3>
                      </div>
                      <button onClick={() => setShowEditor(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* SECTION 1: NAVIGATION SPECIFIC */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-yellow-500/80">
                          <Type size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Navigation Visibility</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-gray-500 uppercase ml-1">At the Top (Transparent)</span>
                              <ColorPickerField
                                label="Color"
                                value={navColorTop[mode]}
                                onChange={(val) => setNavColorTop(val, mode)}
                                onReset={() => setNavColorTop("#ffffff", mode)}
                              />
                           </div>
                           <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] text-gray-500 uppercase ml-1">When Scrolled (Solid)</span>
                              <ColorPickerField
                                label="Color"
                                value={navColorScrolled[mode]}
                                onChange={(val) => setNavColorScrolled(val, mode)}
                                onReset={() => setNavColorScrolled(mode === 'dark' ? "#ffffff" : "#1E1E1E", mode)}
                              />
                           </div>
                        </div>
                      </div>

                      {/* SECTION 2: GLOBAL THEME COLORS (RESTORED) */}
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-blue-400/80">
                          <Sliders size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Global Theme Colors</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <ColorPickerField
                              label="Text 1"
                              value={textPrimaryColor[mode]}
                              onChange={(val) => setTextPrimaryColor(val, mode)}
                              onReset={() => setTextPrimaryColor(mode === 'dark' ? "#ffffff" : "#1E1E1E", mode)}
                            />
                            <ColorPickerField
                              label="Text 2"
                              value={textSecondaryColor[mode]}
                              onChange={(val) => setTextSecondaryColor(val, mode)}
                              onReset={() => setTextSecondaryColor(mode === 'dark' ? "#A0A0A0" : "#4A4A4A", mode)}
                            />
                            <ColorPickerField
                              label="Line"
                              value={universalLineColor[mode]}
                              onChange={(val) => setUniversalLineColor(val, mode)}
                              onReset={() => setUniversalLineColor("#EAB308", mode)}
                            />
                            <ColorPickerField
                              label="Icon"
                              value={universalIconColor[mode]}
                              onChange={(val) => setUniversalIconColor(val, mode)}
                              onReset={() => setUniversalIconColor("#EAB308", mode)}
                            />
                        </div>
                      </div>

                      {/* SECTION 3: THEME ENABLE/DISABLE */}
                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-indigo-400/80">
                          <Layout size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Mode Availability</span>
                        </div>
                        <div className="flex gap-3">
                           <button
                            onClick={() => toggleThemeControl('light')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${lightModeEnabled ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'bg-white/5 text-gray-600 border-white/5'}`}
                           >
                             {lightModeEnabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                             Light Mode
                           </button>
                           <button
                            onClick={() => toggleThemeControl('dark')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${darkModeEnabled ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-white/5 text-gray-600 border-white/5'}`}
                           >
                             {darkModeEnabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                             Dark Mode
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-8 shrink-0">
        <div className="flex gap-8 text-sm font-medium transition-colors">
          <NavItem label={navWorkLabel[mode]} targetRef={workRef} />
          <NavItem label={navAboutLabel[mode]} targetRef={aboutRef} />
          <NavItem label={navContactLabel[mode]} targetRef={contactRef} />
        </div>
        <div className="flex items-center gap-4">
          {showThemeToggle && (
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full transition-colors bg-white/10">
              {darkMode ? <Sun size={18} style={{ color: currentNavColor }} /> : <Moon size={18} style={{ color: currentNavColor }} />}
            </button>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-500/20 text-white rounded-full text-sm font-medium transition-all group border border-white/10">
              <LogOut size={16} className="group-hover:rotate-12 transition-transform" /> Sign Out
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:hidden shrink-0">
        {showThemeToggle && (
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full transition-colors bg-white/10">
            {darkMode ? <Sun size={18} style={{ color: currentNavColor }} /> : <Moon size={18} style={{ color: currentNavColor }} />}
          </button>
        )}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/10 rounded-full transition-colors">
          {mobileMenuOpen ? <X size={18} style={{ color: currentNavColor }} /> : <Menu size={18} style={{ color: currentNavColor }} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 md:hidden bg-theme-primary rounded-2xl shadow-xl border border-theme p-4"
          >
            <div className="flex flex-col gap-4">
              {isEditMode && (
                <div className="flex flex-col gap-2 p-2 border-b border-theme/20 mb-2">
                   <p className="text-[10px] font-bold uppercase text-gray-500 px-2">Navigation Colors</p>
                    <ColorPickerField
                      label="Top State"
                      value={navColorTop[mode]}
                      onChange={(val) => setNavColorTop(val, mode)}
                      onReset={() => setNavColorTop("#ffffff", mode)}
                    />
                    <ColorPickerField
                      label="Scroll State"
                      value={navColorScrolled[mode]}
                      onChange={(val) => setNavColorScrolled(val, mode)}
                      onReset={() => setNavColorScrolled(mode === 'dark' ? "#ffffff" : "#1E1E1E", mode)}
                    />
                </div>
              )}
              <button
                onClick={() => scrollToSection(workRef)}
                className="text-left px-4 py-3 hover:bg-theme-secondary rounded-xl transition-colors text-theme-primary nav-force-color"
                style={navStyle}
                dangerouslySetInnerHTML={{ __html: navWorkLabel[mode] }}
              />
              <button
                onClick={() => scrollToSection(aboutRef)}
                className="text-left px-4 py-3 hover:bg-theme-secondary rounded-xl transition-colors text-theme-primary nav-force-color"
                style={navStyle}
                dangerouslySetInnerHTML={{ __html: navAboutLabel[mode] }}
              />
              <button
                onClick={() => scrollToSection(contactRef)}
                className="text-left px-4 py-3 hover:bg-theme-secondary rounded-xl transition-colors text-theme-primary nav-force-color"
                style={navStyle}
                dangerouslySetInnerHTML={{ __html: navContactLabel[mode] }}
              />
              {isLoggedIn && (
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold">
                  <LogOut size={18} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
