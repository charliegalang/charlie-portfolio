import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Upload, Globe, Linkedin, Instagram, Github, Twitter, Facebook, Mail, Briefcase, GraduationCap, Code, Layout, Palette, Database, Server, Smartphone, Monitor, Star, Award, Heart, Zap, Coffee, Music, Camera, MapPin, Send, MessageSquare, Phone, User, Settings, Info, Home, FileText, Check, Layers, Image as ImageIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const POPULAR_ICONS = [
  "Globe", "Linkedin", "Instagram", "Github", "Twitter", "Facebook", "Mail", "Send", "MessageSquare", "Phone",
  "Briefcase", "GraduationCap", "Code", "Layout", "Palette", "Database", "Server", "Smartphone", "Monitor",
  "Star", "Award", "Heart", "Zap", "Coffee", "Music", "Camera", "MapPin", "User", "Settings", "Info", "Home",
  "FileText", "Check", "Layers"
];

const IconPicker = ({ isOpen, onClose, onSelect, currentIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("popular"); // popular, search, custom

  const allIconNames = useMemo(() => {
    return Object.keys(LucideIcons).filter(name =>
      typeof LucideIcons[name] === 'function' ||
      (typeof LucideIcons[name] === 'object' && LucideIcons[name].render)
    );
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return [];
    return allIconNames.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50); // Limit results for performance
  }, [searchTerm, allIconNames]);

  if (!isOpen) return null;

  const renderIcon = (name, size = 20) => {
    const Icon = LucideIcons[name] || LucideIcons.HelpCircle;
    return <Icon size={size} />;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-theme-primary w-full max-w-lg rounded-3xl border border-theme shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-theme flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-theme-primary">Select Icon</h3>
            <p className="text-xs text-theme-secondary opacity-60">Choose a professional icon for your link</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-theme-secondary rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-theme">
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'popular' ? 'text-[#EAB308] border-b-2 border-[#EAB308]' : 'text-theme-secondary'}`}
          >
            Popular
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'search' ? 'text-[#EAB308] border-b-2 border-[#EAB308]' : 'text-theme-secondary'}`}
          >
            Search All
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'custom' ? 'text-[#EAB308] border-b-2 border-[#EAB308]' : 'text-theme-secondary'}`}
          >
            Custom URL
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'popular' && (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-4">
              {POPULAR_ICONS.map(name => (
                <button
                  key={name}
                  onClick={() => { onSelect(name); onClose(); }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:scale-110 ${currentIcon === name ? 'border-[#EAB308] bg-[#EAB308]/10 text-[#EAB308]' : 'border-theme hover:bg-theme-secondary'}`}
                >
                  {renderIcon(name)}
                  <span className="text-[8px] mt-2 opacity-60 truncate w-full text-center">{name}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-secondary" size={16} />
                <input
                  type="text"
                  placeholder="Type to search icons (e.g. 'heart', 'user')..."
                  className="w-full bg-theme-secondary border border-theme rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[#EAB308] transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-4">
                {filteredIcons.map(name => (
                  <button
                    key={name}
                    onClick={() => { onSelect(name); onClose(); }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:scale-110 ${currentIcon === name ? 'border-[#EAB308] bg-[#EAB308]/10 text-[#EAB308]' : 'border-theme hover:bg-theme-secondary'}`}
                  >
                    {renderIcon(name)}
                    <span className="text-[8px] mt-2 opacity-60 truncate w-full text-center">{name}</span>
                  </button>
                ))}
                {searchTerm && filteredIcons.length === 0 && (
                  <div className="col-span-full py-8 text-center text-theme-secondary opacity-60">
                    No icons found matching "{searchTerm}"
                  </div>
                )}
                {!searchTerm && (
                  <div className="col-span-full py-8 text-center text-theme-secondary opacity-60">
                    Start typing to explore thousands of icons
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <p className="text-sm text-theme-secondary">Paste a link to an image or SVG file to use a truly custom icon.</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-secondary" size={16} />
                  <input
                    type="text"
                    placeholder="https://example.com/my-icon.svg"
                    className="w-full bg-theme-secondary border border-theme rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-[#EAB308] transition-colors"
                    value={searchTerm.startsWith('http') ? searchTerm : ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => { if (searchTerm.startsWith('http')) { onSelect(searchTerm); onClose(); } }}
                  className="bg-[#EAB308] text-black px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50"
                  disabled={!searchTerm.startsWith('http')}
                >
                  Use URL
                </button>
              </div>
              {searchTerm.startsWith('http') && (
                <div className="mt-4 p-4 border border-theme rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] text-theme-secondary mb-2 uppercase font-bold">Preview</span>
                  <img src={searchTerm} className="w-12 h-12 object-contain" alt="Preview" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default IconPicker;
