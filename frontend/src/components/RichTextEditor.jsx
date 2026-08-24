import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold, Italic, Underline, Palette, Search, Save, ChevronDown,
  AlignLeft, AlignCenter, AlignRight, List, X, Pen, Undo, Redo, Sun, Moon, RotateCcw, Type
} from 'lucide-react';
import { HexColorPicker } from "react-colorful";
import { motion, AnimatePresence } from 'framer-motion';
import { colors as presetColors, allFonts } from './RichTextEditorData';

const RichTextEditor = ({ value, onSave, className = "", isEditMode, placeholder = "Click to edit...", style = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef(null);
  const [currentFontSize, setCurrentFontSize] = useState('16');
  const [currentLineHeight, setCurrentLineHeight] = useState('1.6');
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCustomWheel, setShowCustomWheel] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const [fontList, setFontList] = useState(allFonts);
  const [newFontInput, setNewFontInput] = useState('');
  const [colorSearch, setColorSearch] = useState('');
  const [customSearch, setCustomSearch] = useState('');
  const [customColor, setCustomColor] = useState('#000000');
  const [savedRange, setSavedRange] = useState(null);
  const [initialContent, setInitialContent] = useState('');
  const [editorBg, setEditorBg] = useState('dark');
  const isLoaded = useRef(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const editorClassName = useMemo(() => {
    return className
      .split(' ')
      .filter(c => !/^(?:[a-z]{2}:)?(?:p[rltb]?-|m[rltb]?-|max-w-|w-|h-|absolute|relative|fixed|top-|right-|bottom-|left-)/.test(c))
      .join(' ');
  }, [className]);

  const displayClassName = useMemo(() => {
    if (!value) return className;
    const isAligned = /text-align:\s*(center|right)/i.test(value) ||
                     /<center/i.test(value) ||
                     /align="\s*(center|right)"/i.test(value);
    if (isAligned) {
      return className.split(' ').filter(c => !/^(?:[a-z]{2}:)?p[rl]-/.test(c)).join(' ');
    }
    return className;
  }, [className, value]);

  useEffect(() => {
    if (isEditing && editorRef.current && !isLoaded.current) {
      const startValue = value || '';
      editorRef.current.innerHTML = startValue;
      setInitialContent(startValue);
      isLoaded.current = true;
      editorRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      if (editorRef.current.childNodes.length > 0) {
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      try { document.execCommand('styleWithCSS', false, true); } catch (e) {}
    }
    if (!isEditing) {
      isLoaded.current = false;
      setShowCustomWheel(false);
      setSavedRange(null);
      setShowExitConfirm(false);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isEditing]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0));
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      if (savedRange) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRange);
      }
    }
  }, [savedRange]);

  const handleSave = () => {
    if (editorRef.current) {
      let content = editorRef.current.innerHTML;
      if (content === '<br>' || content === '<div><br></div>') content = '';
      onSave(content);
      setInitialContent(content);
    }
  };

  const handleExit = () => {
    if (editorRef.current) {
      let currentContent = editorRef.current.innerHTML;
      if (currentContent === '<br>' || currentContent === '<div><br></div>') currentContent = '';
      const cleanInitial = (initialContent === '<br>' || initialContent === '<div><br></div>') ? '' : initialContent;
      if (currentContent !== cleanInitial) {
        setShowExitConfirm(true);
      } else {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const preventFocus = (e) => {
    e.preventDefault();
    saveSelection();
  };

  const execCommand = (command, val = null) => {
    restoreSelection();
    try { document.execCommand('styleWithCSS', false, true); } catch (e) {}
    document.execCommand(command, false, val);
    saveSelection();
  };

  const applyThemeColor = (cssVar) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel.isCollapsed) {
      const html = `<span style="color: var(${cssVar})">${sel.toString()}</span>`;
      document.execCommand('insertHTML', false, html);
    }
    setShowColorPicker(false);
    saveSelection();
  };

  const resetToThemeColor = () => {
    restoreSelection();
    // Use removeFormat and then try to strip manual color spans
    document.execCommand('removeFormat', false, null);

    const selection = window.getSelection();
    if (!selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const content = range.cloneContents();
        const div = document.createElement('div');
        div.appendChild(content);

        // Remove all inline color styles
        div.querySelectorAll('*').forEach(el => {
          el.style.color = '';
          if (el.getAttribute('style') === '') el.removeAttribute('style');
        });

        range.deleteContents();
        range.insertNode(div.firstChild || document.createTextNode(''));
    }

    setShowColorPicker(false);
    saveSelection();
  };

  const handleFontSize = (px) => {
    restoreSelection();
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('fontSize', false, '7');
    const fontSpans = editorRef.current.querySelectorAll('font[size="7"]');
    fontSpans.forEach(span => {
      span.removeAttribute('size');
      span.style.fontSize = `${px}px`;
      const children = span.querySelectorAll('*');
      children.forEach(child => {
        if (child.style.fontSize) child.style.fontSize = '';
        if (child.tagName === 'FONT' && child.hasAttribute('size')) child.removeAttribute('size');
      });
    });
    document.execCommand('styleWithCSS', false, true);
    setCurrentFontSize(px.toString());
    saveSelection();
  };

  const handleLineHeight = (val) => {
    if (val === 'custom') {
      const custom = prompt("Enter custom line spacing (e.g., 1.8 or 24px):", currentLineHeight);
      if (custom) val = custom;
      else return;
    }
    restoreSelection();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        editorRef.current.style.lineHeight = val;
        if (editorRef.current.childNodes.length > 0 && editorRef.current.firstChild.nodeName !== 'DIV') {
           const content = editorRef.current.innerHTML;
           editorRef.current.innerHTML = `<div style="line-height: ${val}">${content}</div>`;
        } else if (editorRef.current.firstChild && editorRef.current.firstChild.nodeName === 'DIV') {
           editorRef.current.firstChild.style.lineHeight = val;
        }
      } else {
        const span = document.createElement('div');
        span.style.lineHeight = val;
        try {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        } catch (e) {
          console.error("Spacing error:", e);
        }
      }
    }
    setCurrentLineHeight(val);
    saveSelection();
  };

  const filteredFonts = useMemo(() => {
    const s = fontSearch.toLowerCase();
    return s ? fontList.filter(f => f.toLowerCase().includes(s)) : fontList;
  }, [fontSearch, fontList]);

  const addFont = () => {
    const name = newFontInput.trim();
    if (!name) return;
    if (!fontList.some(f => f.toLowerCase() === name.toLowerCase())) {
      setFontList(prev => [...prev, name]);
    }
    setNewFontInput('');
  };

  const isHexColor = (text) => /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(text.trim());

  const filteredColors = useMemo(() => {
    const s = colorSearch.toLowerCase().trim();
    if (!s) return presetColors;
    return presetColors.filter(c => c.name.toLowerCase().includes(s) || c.value.toLowerCase().includes(s));
  }, [colorSearch]);

  const toHex = (input) => {
    const t = input.trim().toLowerCase().replace(/[^0-9a-f]/g, '');
    if (t.length === 3) return `#${t}`;
    if (t.length === 6) return `#${t}`;
    if (t.length === 8) return `#${t.slice(0, 6)}`;
    return null;
  };

  const hexToRgb = (hex) => {
    if (!isHexColor(hex)) return null;
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return { r, g, b };
  };

  const colorDistance = (a, b) => Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);

  const customSearchResults = useMemo(() => {
    const s = customSearch.toLowerCase().trim();
    if (!s) return presetColors.slice(0, 20);
    const hexFromText = toHex(s);
    const typedHex = hexFromText && isHexColor(hexFromText) ? hexFromText : null;
    const exactMatches = presetColors.filter(c => c.name.toLowerCase().includes(s) || c.value.toLowerCase().includes(s));
    if (exactMatches.length > 0) return exactMatches.slice(0, 20);
    if (typedHex) {
      const rgb = hexToRgb(typedHex);
      if (rgb) {
        const sortedByDistance = [...presetColors]
          .map(c => ({
            ...c,
            distance: colorDistance(rgb, hexToRgb(c.value))
          }))
          .sort((a, b) => a.distance - b.distance);
        return sortedByDistance.slice(0, 20);
      }
    }
    return presetColors.slice(0, 20);
  }, [customSearch]);

  const applyColorFromHex = (text) => {
    const hexCandidate = toHex(text);
    if (hexCandidate && isHexColor(hexCandidate)) {
      execCommand('foreColor', hexCandidate);
      setCustomColor(hexCandidate);
      return true;
    }
    return false;
  };

  const handleEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        restoreSelection();
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          setCustomColor(result.sRGBHex);
          execCommand('foreColor', result.sRGBHex);
        }
      } catch (e) {
        console.error('EyeDropper canceled or failed', e);
      }
    } else {
      alert('EyeDropper is not supported in this browser. Use manual hex entry.');
    }
  };

  const renderModal = () => {
    return createPortal(
      <AnimatePresence>
        {isEditing && isEditMode && (
          <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto"
              onClick={handleExit}
            />

            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl mx-4 mb-10 border-2 border-[#EAB308] rounded-lg bg-[#1a1a1a] shadow-2xl flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {showExitConfirm && (
                <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center p-6 rounded-lg">
                  <div className="bg-[#2a2a2a] border border-[#EAB308] p-6 rounded-lg shadow-2xl max-sm w-full text-center">
                    <h3 className="text-white font-bold text-lg mb-2">Unsaved Changes</h3>
                    <p className="text-white/70 text-sm mb-6">Do you want to save your changes before exiting?</p>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { handleSave(); setIsEditing(false); }} className="w-full py-2 bg-[#EAB308] text-black font-bold rounded hover:bg-[#EAB308]/90 transition-colors">Save and Exit</button>
                      <button onClick={() => setIsEditing(false)} className="w-full py-2 bg-white/10 text-white font-bold rounded hover:bg-white/20 transition-colors">Discard Changes</button>
                      <button onClick={() => setShowExitConfirm(false)} className="w-full py-2 text-white/50 text-xs hover:text-white transition-colors">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#2a2a2a] p-3 flex justify-between items-center border-b border-white/10 rounded-t-lg">
                 <div className="flex items-center gap-4">
                   <span className="text-xs font-bold uppercase tracking-widest text-white/50 px-2">Editor Mode</span>
                   <button
                     onClick={() => setEditorBg(prev => prev === 'dark' ? 'light' : 'dark')}
                     className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-white/70 transition-colors flex items-center gap-2 text-[10px] font-bold"
                     title="Toggle Editor Background"
                   >
                     {editorBg === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                     {editorBg === 'dark' ? 'LIGHT BACKGROUND' : 'DARK BACKGROUND'}
                   </button>
                 </div>
                 <button onClick={handleExit} className="p-1 text-white/50 hover:bg-red-500 hover:text-white rounded transition-colors"><X size={20} /></button>
              </div>

              <div className="bg-[#2a2a2a] border-b border-white/10 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
                <div className="relative">
                  <button onMouseDown={preventFocus} onClick={() => { setShowFontPicker(!showFontPicker); setShowColorPicker(false); }} className="h-8 px-3 text-sm bg-[#1a1a1a] border border-white/10 rounded text-white min-w-[140px] flex items-center justify-between gap-2 hover:bg-[#EAB308]/10">
                    <span className="truncate">Font Family</span>
                    <ChevronDown size={14} />
                  </button>
                  {showFontPicker && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-20 max-h-96 overflow-hidden flex flex-col" onMouseDown={(e) => e.stopPropagation()}>
                      <div className="p-2 border-b border-white/10 space-y-2">
                        <div className="relative">
                          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/30" />
                          <input type="text" value={fontSearch} onChange={(e) => setFontSearch(e.target.value)} onKeyDown={(e) => e.stopPropagation()} placeholder="Search fonts..." className="w-full pl-8 pr-3 py-2 text-sm bg-[#2a2a2a] border border-white/10 rounded text-white" autoFocus />
                        </div>
                        <div className="flex gap-1">
                          <input value={newFontInput} onChange={(e) => setNewFontInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addFont(); }} placeholder="Add font name (e.g. Inter)" className="w-full px-2 py-1 text-xs bg-[#1a1a1a] border border-white/10 rounded text-white" />
                          <button onClick={addFont} className="px-2 py-1 text-[10px] bg-[#EAB308] rounded text-black">Add</button>
                        </div>
                      </div>
                      <div className="overflow-y-auto flex-1 p-1">
                        {filteredFonts.slice(0, 50).map(f => (
                          <button key={f} onMouseDown={preventFocus} onClick={() => { execCommand('fontName', f); setShowFontPicker(false); }} className="w-full px-3 py-2 text-left hover:bg-[#EAB308]/10 rounded text-sm text-white" style={{ fontFamily: f }}>{f}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <select onClick={saveSelection} onChange={(e) => handleFontSize(e.target.value)} value={currentFontSize} className="h-8 px-2 text-sm bg-[#1a1a1a] border border-white/10 rounded text-white w-24 outline-none cursor-pointer">
                  {[8,9,10,11,12,14,16,18,20,22,24,28,32,36,48,64,72,96].map(px => <option key={px} value={px}>{px}px</option>)}
                </select>

                <div className="relative flex items-center px-1">
                  <select onClick={saveSelection} onChange={(e) => handleLineHeight(e.target.value)} value={currentLineHeight} className="h-8 px-2 text-sm bg-[#1a1a1a] border border-white/10 rounded text-white w-20 outline-none cursor-pointer" title="Line Spacing">
                    {[1.0, 1.15, 1.2, 1.5, 1.6, 2.0, 2.5, 3.0].map(v => <option key={v} value={v}>{v}</option>)}
                    <option value="custom">Custom...</option>
                  </select>
                </div>

                <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                <button onMouseDown={preventFocus} onClick={() => execCommand('undo')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Undo"><Undo size={18} /></button>
                <button onMouseDown={preventFocus} onClick={() => execCommand('redo')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Redo"><Redo size={18} /></button>

                <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                <button onMouseDown={preventFocus} onClick={() => execCommand('bold')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Bold"><Bold size={18} /></button>
                <button onMouseDown={preventFocus} onClick={() => execCommand('italic')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Italic"><Italic size={18} /></button>
                <button onMouseDown={preventFocus} onClick={() => execCommand('underline')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Underline"><Underline size={18} /></button>

                <div className="relative flex items-center gap-1">
                  <button onMouseDown={preventFocus} onClick={() => { setShowColorPicker(!showColorPicker); setShowFontPicker(false); }} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Text Color"><Palette size={18} /></button>
                  <button onMouseDown={preventFocus} onClick={handleEyeDropper} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Pick color from screen"><Pen size={18} /></button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 w-[360px] bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-20 max-h-[560px] overflow-y-auto flex flex-col" onMouseDown={(e) => e.stopPropagation()}>
                      <div className="p-2 border-b border-white/10 relative">
                        <Search size={14} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30" />
                        <input type="text" value={colorSearch} onChange={(e) => setColorSearch(e.target.value)} onKeyDown={(e) => {
                          e.stopPropagation();
                          if (e.key === 'Enter') { if (applyColorFromHex(colorSearch)) { setShowColorPicker(false); } }
                        }} placeholder="Search colors by name or hex (#7c3b3b)..." className="w-full pl-8 pr-3 py-2 text-sm bg-[#2a2a2a] border border-white/10 rounded text-white" />
                      </div>
                      <div className="p-3">
                        <div className="flex flex-col gap-1 mb-4">
                           <button onMouseDown={preventFocus} onClick={resetToThemeColor} className="w-full py-2 bg-white/5 hover:bg-red-500/20 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 border border-white/10"><RotateCcw size={14} /> REMOVE MANUAL COLOR</button>
                           <div className="grid grid-cols-2 gap-1">
                              <button onMouseDown={preventFocus} onClick={() => applyThemeColor('--text-primary')} className="py-2 bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 border border-white/10"><Type size={12} /> LINK TO PRIMARY</button>
                              <button onMouseDown={preventFocus} onClick={() => applyThemeColor('--text-secondary')} className="py-2 bg-white/10 hover:bg-white/20 text-white text-[9px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 border border-white/10"><Type size={12} /> LINK TO SECONDARY</button>
                           </div>
                        </div>

                        <button onMouseDown={preventFocus} onClick={() => setShowCustomWheel(!showCustomWheel)} className="w-full py-2 mb-2 bg-[#EAB308] text-black text-xs font-bold rounded-lg hover:scale-[1.02] transition-transform">{showCustomWheel ? "Back to Swatches" : "Open Custom Color Wheel"}</button>
                        {showCustomWheel ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input type="text" value={customSearch} onChange={(e) => setCustomSearch(e.target.value)} placeholder="Search custom palette or hex..." className="flex-1 text-sm bg-[#2a2a2a] border border-white/10 rounded px-2 py-1 text-white" />
                              <button onMouseDown={preventFocus} onClick={() => applyColorFromHex(customSearch)} className="px-2 rounded bg-[#EAB308] text-black text-xs">Apply</button>
                            </div>
                            <div className="p-2 bg-[#2a2a2a] border border-white/10 rounded">
                              <div className="mb-1 text-[11px] uppercase tracking-wide text-white/30">Color match suggestions</div>
                              <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">{customSearchResults.map((c, i) => (
                                <button key={i} onMouseDown={preventFocus} onClick={() => { execCommand('foreColor', c.value); setCustomColor(c.value); }} className="w-6 h-6 rounded-sm border border-white/10" style={{ backgroundColor: c.value }} title={`${c.name} ${c.value}`} />
                              ))}</div>
                            </div>
                            <div className="p-2 border border-white/10 rounded">
                              <HexColorPicker color={customColor} onChange={(c) => { setCustomColor(c); execCommand('foreColor', c); }} />
                              <div className="mt-1 text-[10px] font-mono uppercase text-white">{customColor}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-8 gap-1">
                            {filteredColors.map((c, i) => <button key={i} onMouseDown={preventFocus} onClick={() => { execCommand('foreColor', c.value); setShowColorPicker(false); }} className="w-6 h-6 rounded-sm border border-white/10 hover:scale-110 transition-transform" style={{ backgroundColor: c.value }} title={`${c.name} ${c.value}`} />)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                <button onMouseDown={preventFocus} onClick={() => execCommand('justifyLeft')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Align Left"><AlignLeft size={18} /></button>
                <button onMouseDown={preventFocus} onClick={() => execCommand('justifyCenter')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Align Center"><AlignCenter size={18} /></button>
                <button onMouseDown={preventFocus} onClick={() => execCommand('justifyRight')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Align Right"><AlignRight size={18} /></button>
                <button onMouseDown={preventFocus} onClick={() => execCommand('insertUnorderedList')} className="p-1.5 rounded hover:bg-[#EAB308]/20 text-white" title="Unordered List"><List size={18} /></button>
                <div className="flex-1" />
                <button onMouseDown={preventFocus} onClick={handleSave} className="px-4 py-1.5 bg-[#EAB308] text-black rounded hover:bg-[#EAB308]/90 text-sm font-bold flex items-center gap-1"><Save size={16} /> Save</button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className={`RichTextEditor-content p-10 min-h-[400px] max-h-[65vh] overflow-y-auto outline-none ${editorClassName}`}
                style={{
                    fontFamily: 'inherit',
                    backgroundColor: editorBg === 'dark' ? '#1a1a1a' : '#ffffff',
                    color: editorBg === 'dark' ? '#eeeeee' : '#1a1a1a',
                    ...style
                }}
                onMouseUp={saveSelection}
                onKeyUp={saveSelection}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); handleSave(); }
                  if (e.key === 'Escape') { e.preventDefault(); handleExit(); }
                }}
              />
              <div className="p-2 border-t border-white/10 text-right text-[10px] uppercase tracking-widest text-white/20 bg-[#2a2a2a] rounded-b-lg">Ctrl+Enter to save • Escape to cancel exit</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <div className={`relative group min-w-[2em] min-h-[1.5em] w-full ${!value && !isEditMode ? 'hidden' : ''}`}>
        <div
          className={`${displayClassName} ${isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-[#EAB308]/30 rounded-lg transition-all' : ''}`}
          style={style}
          onClick={() => isEditMode && setIsEditing(true)}
        >
          {value && value.trim() !== '' && value !== '<br>' ? (
            <div className="w-full" style={{ textAlign: 'inherit' }} dangerouslySetInnerHTML={{ __html: value }} />
          ) : isEditMode ? (
            <div className="text-theme-secondary opacity-50 italic border border-dashed border-[#EAB308]/30 px-2 py-1 rounded inline-block min-w-[4em]">{placeholder}</div>
          ) : null}
        </div>
      </div>
      {renderModal()}
    </>
  );
};

export default RichTextEditor;
