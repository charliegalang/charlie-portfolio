import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Palette, Link as LinkIcon, Type } from 'lucide-react';
import RichTextEditor from "./RichTextEditor";
import { ensureAbsoluteUrl } from '../utils/portfolioUtils';

const ContactSection = ({
  contactRef,
  contactVisible,
  isEditMode,
  contactBgColor,
  mode,
  darkMode,
  setContactVisible,
  setContactBgColor,
  contactTitle,
  setContactTitle,
  contactTitleColor,
  setContactTitleColor,
  contactText,
  setContactText,
  contactTextColor,
  setContactTextColor,
  contactButton,
  setContactButton,
  contactButtonBg,
  setContactButtonBg,
  contactButtonColor,
  setContactButtonColor,
  contactButtonLink,
  setContactButtonLink
}) => {
  if (!contactVisible && !isEditMode) return null;

  return (
    <section
      ref={contactRef}
      className={`py-16 sm:py-32 px-4 sm:px-8 text-center transition-all duration-500 relative group overflow-hidden ${!contactVisible ? 'opacity-50 grayscale' : ''}`}
      style={{ backgroundColor: contactBgColor[mode] }}
    >
      {isEditMode && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/20 backdrop-blur-md p-2 rounded-xl border border-white/20 z-30">
          <button
            onClick={() => setContactVisible(!contactVisible)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${contactVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
          >
            {contactVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="text-[10px] font-bold uppercase">{contactVisible ? 'Enabled' : 'Disabled'}</span>
          </button>
          <div className="w-[1px] h-4 bg-white/20 mx-1" />
          <Palette size={16} className="text-white" />
          <input type="color" value={contactBgColor[mode]} onChange={(e) => setContactBgColor(e.target.value, mode)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
          <button onClick={() => setContactBgColor("#EAB308", mode)} className="text-[10px] text-white/50 hover:text-white underline">Reset</button>
        </div>
      )}
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-7xl mx-auto">
        <div className="relative group/contactTitle w-full">
          <RichTextEditor value={contactTitle[mode]} onSave={(val) => setContactTitle(val, mode)} isEditMode={isEditMode} className="text-3xl sm:text-6xl lg:text-7xl font-bold mb-6 px-2 break-words w-full" style={{ color: contactTitleColor[mode] }} placeholder="Contact Title" />
          {isEditMode && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/contactTitle:opacity-100 transition-opacity flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 z-40">
              <Palette size={12} className="text-white" />
              <input type="color" value={contactTitleColor[mode]} onChange={(e) => setContactTitleColor(e.target.value, mode)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
              <button onClick={() => setContactTitleColor(darkMode ? "#ffffff" : "#000000", mode)} className="text-[10px] text-white/50 hover:text-white underline whitespace-nowrap">Reset</button>
            </div>
          )}
        </div>
        <div className="relative group/contactText w-full">
          <RichTextEditor value={contactText[mode]} onSave={(val) => setContactText(val, mode)} isEditMode={isEditMode} className="text-base sm:text-xl mb-10 w-full px-4" style={{ color: contactTextColor[mode] }} placeholder="Contact description..." />
          {isEditMode && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/contactText:opacity-100 transition-opacity flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 z-40">
              <Palette size={12} className="text-white" />
              <input type="color" value={contactTextColor[mode]} onChange={(e) => setContactTextColor(e.target.value, mode)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
              <button onClick={() => setContactTextColor(darkMode ? "#ffffff" : "#000000", mode)} className="text-[10px] text-white/50 hover:text-white underline whitespace-nowrap">Reset</button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-4">
          {isEditMode ? (
            <div className="space-y-4 w-full max-w-md">
              <div className="relative group/contactBtn">
                <div className="rounded-full overflow-hidden border border-black/10" style={{ backgroundColor: contactButtonBg[mode], color: contactButtonColor[mode] }}>
                  <RichTextEditor value={contactButton[mode]} onSave={(val) => setContactButton(val, mode)} isEditMode={isEditMode} className="w-full text-center px-6 sm:px-10 py-4 sm:py-5 text-sm sm:text-lg font-medium" style={{ color: 'inherit' }} placeholder="Button text" />
                </div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/contactBtn:opacity-100 transition-opacity flex flex-col gap-1 bg-black/40 backdrop-blur-md p-1.5 rounded-lg border border-white/10 z-40">
                  <div className="flex items-center gap-2">
                    <Palette size={12} className="text-white" />
                    <input type="color" value={contactButtonBg[mode]} onChange={(e) => setContactButtonBg(e.target.value, mode)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
                    <button onClick={() => setContactButtonBg("#000000", mode)} className="text-[10px] text-white/50 hover:text-white underline whitespace-nowrap">Reset Bg</button>
                  </div>
                  <div className="flex items-center gap-2 border-t border-theme/20 pt-1">
                    <Type size={12} className="text-white" />
                    <input type="color" value={contactButtonColor[mode]} onChange={(e) => setContactButtonColor(e.target.value, mode)} className="w-4 h-4 rounded cursor-pointer bg-transparent border-none" />
                    <button onClick={() => setContactButtonColor("#ffffff", mode)} className="text-[10px] text-white/50 hover:text-white underline whitespace-nowrap">Reset Text</button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/10 p-3 rounded-2xl border border-black/5">
                <LinkIcon size={16} className="text-black/50" />
                <input type="text" value={contactButtonLink} onChange={(e) => setContactButtonLink(e.target.value)} className="bg-transparent border-none outline-none text-sm text-black font-medium w-full" placeholder="Link or email..." />
              </div>
            </div>
          ) : (
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={ensureAbsoluteUrl(contactButtonLink)}
              target={ensureAbsoluteUrl(contactButtonLink).startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-lg font-medium hover:opacity-90 transition-all shadow-xl"
              style={{ backgroundColor: contactButtonBg[mode], color: contactButtonColor[mode] }}
            >
              <span dangerouslySetInnerHTML={{ __html: contactButton[mode] || "Button Text" }} />
            </motion.a>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
