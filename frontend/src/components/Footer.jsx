import React from 'react';
import { Palette, Plus, Trash2, Edit2 } from 'lucide-react';
import RichTextEditor from "./RichTextEditor";
import { ensureAbsoluteUrl, getIconByName } from '../utils/portfolioUtils';

const IconComponent = ({ name, size = 18, className = "", style = {} }) => {
  if (name && (name.startsWith('http') || name.startsWith('/'))) {
    return <img src={name} alt="icon" style={{ width: size, height: size, ...style }} className={`object-contain ${className}`} />;
  }
  const Icon = getIconByName(name);
  return Icon ? <Icon size={size} className={className} style={style} /> : <div style={{ width: size, height: size }} />;
};

const Footer = ({
  isEditMode,
  footerBgColor,
  mode,
  darkMode,
  setFooterBgColor,
  footerName,
  setFooterName,
  footerText,
  setFooterText,
  footerNavTitle,
  setFooterNavTitle,
  scrollToSection,
  workRef,
  aboutRef,
  contactRef,
  navWorkLabel,
  setNavWorkLabel,
  navAboutLabel,
  setNavAboutLabel,
  navContactLabel,
  setNavContactLabel,
  footerConnectTitle,
  setFooterConnectTitle,
  addConnectItem,
  footerEmail,
  setFooterEmail,
  connectItems,
  openIconPicker,
  updateConnectItem,
  deleteConnectItem,
  copyright,
  setCopyright
}) => {
  return (
    <footer className="py-12 sm:py-24 px-4 sm:px-8 bg-theme-primary border-t border-theme relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: footerBgColor[mode] !== "transparent" ? footerBgColor[mode] : "" }}>
      {isEditMode && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-theme-secondary/50 backdrop-blur-md p-2 rounded-xl border border-theme z-30">
          <Palette size={14} className="text-theme-primary" />
          <input type="color" value={footerBgColor[mode] === "transparent" ? (darkMode ? "#000000" : "#ffffff") : footerBgColor[mode]} onChange={(e) => setFooterBgColor(e.target.value, mode)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-none" />
          <button onClick={() => setFooterBgColor("transparent", mode)} className="text-[10px] text-theme-secondary hover:text-theme-primary underline">Reset</button>
        </div>
      )}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-left">
          <div>
            <RichTextEditor value={footerName[mode]} onSave={(val) => setFooterName(val, mode)} isEditMode={isEditMode} className="text-xl sm:text-2xl font-bold mb-6 text-theme-icon" placeholder="Your Name" />
            <RichTextEditor value={footerText[mode]} onSave={(val) => setFooterText(val, mode)} isEditMode={isEditMode} className="text-sm sm:text-base text-theme-secondary opacity-60" placeholder="Footer text" />
          </div>
          <div className="hidden sm:block">
            <RichTextEditor value={footerNavTitle[mode]} onSave={(val) => setFooterNavTitle(val, mode)} isEditMode={isEditMode} className="text-lg font-medium mb-6" placeholder="Navigation" />
            <ul className="space-y-3 opacity-60 text-sm sm:text-base">
              <li><button onClick={() => scrollToSection(workRef)} className="hover:text-theme-icon transition-colors"><RichTextEditor value={navWorkLabel[mode]} onSave={(val) => setNavWorkLabel(val, mode)} isEditMode={isEditMode} className="inline-block" placeholder="Work" /></button></li>
              <li><button onClick={() => scrollToSection(aboutRef)} className="hover:text-theme-icon transition-colors"><RichTextEditor value={navAboutLabel[mode]} onSave={(val) => setNavAboutLabel(val, mode)} isEditMode={isEditMode} className="inline-block" placeholder="About" /></button></li>
              <li><button onClick={() => scrollToSection(contactRef)} className="hover:text-theme-icon transition-colors"><RichTextEditor value={navContactLabel[mode]} onSave={(val) => setNavContactLabel(val, mode)} isEditMode={isEditMode} className="inline-block" placeholder="Contact" /></button></li>
            </ul>
          </div>
          <div>
            <div className="flex items-center justify-between mb-6">
              <RichTextEditor value={footerConnectTitle[mode]} onSave={(val) => setFooterConnectTitle(val, mode)} isEditMode={isEditMode} className="text-lg font-medium" placeholder="Connect" />
              {isEditMode && <button onClick={addConnectItem} className="p-1.5 bg-[#EAB308] text-black rounded-full hover:scale-110 transition-transform"><Plus size={14} /></button>}
            </div>
            <ul className="space-y-4 opacity-80 text-sm sm:text-base">
              <li>{isEditMode ? <RichTextEditor value={footerEmail[mode]} onSave={(val) => setFooterEmail(val, mode)} isEditMode={isEditMode} className="hover:text-theme-icon" placeholder="email@example.com" /> : <a href={`mailto:${footerEmail[mode].replace(/<[^>]*>/g, "").trim()}`} className="hover:text-theme-icon break-all"><span dangerouslySetInnerHTML={{ __html: footerEmail[mode] }} /></a>}</li>
              {connectItems.map((item) => (
                <li key={item.id} className="group/item relative flex flex-col gap-1 border-b border-theme/20 pb-2">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 mr-8">
                          <button
                            onClick={() => openIconPicker(item.id, item.icon)}
                            className="group/iconBtn relative p-1.5 bg-theme-primary rounded border border-theme hover:bg-theme-secondary transition-colors text-theme-icon"
                          >
                            <IconComponent name={item.icon} size={14} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded opacity-0 group-hover/iconBtn:opacity-100 transition-opacity">
                              <Edit2 size={8} className="text-white" />
                            </div>
                          </button>
                          <RichTextEditor value={item.name} onSave={(val) => updateConnectItem(item.id, "name", val)} isEditMode={isEditMode} className="text-xs font-bold w-full text-theme-icon" placeholder="Title" />
                        </div>
                        <button onClick={() => deleteConnectItem(item.id)} className="p-1 text-red-500"><Trash2 size={14} /></button>
                      </div>
                      <input type="text" value={item.url} onChange={(e) => updateConnectItem(item.id, "url", e.target.value)} className="bg-theme-secondary border border-theme rounded px-2 py-1 text-[10px] w-full" placeholder="URL or email..." />
                    </div>
                  ) : (
                    <a href={ensureAbsoluteUrl(item.url)} target={ensureAbsoluteUrl(item.url).startsWith("mailto:") ? "_self" : "_blank"} rel="noopener noreferrer" className="hover:text-theme-icon transition-colors flex items-center gap-2 text-theme-icon"><IconComponent name={item.icon} size={14} /><span dangerouslySetInnerHTML={{ __html: item.name }} /></a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <RichTextEditor value={copyright[mode]} onSave={(val) => setCopyright(val, mode)} isEditMode={isEditMode} className="mt-16 text-center opacity-40 text-sm" placeholder="Copyright text" />
      </div>
    </footer>
  );
};

export default Footer;
