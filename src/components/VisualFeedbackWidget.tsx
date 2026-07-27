'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Copy, Trash2, Sliders, Eye, EyeOff, ClipboardCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface ElementNote {
  id: string;
  elementTag: string;
  elementText: string;
  section: string;
  selectorPath: string;
  themeTokens: string;
  note: string;
}

export default function VisualFeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inspectActive, setInspectActive] = useState(false);
  const [notesList, setNotesList] = useState<ElementNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [activeElementInfo, setActiveElementInfo] = useState<{ 
    tag: string; 
    text: string; 
    section: string; 
    selectorPath: string;
    themeTokens: string;
  } | null>(null);
  
  const [grainActive, setGrainActive] = useState(true);
  const [copied, setCopied] = useState(false);

  // Toggle Film Grain Overlay
  const toggleGrain = () => {
    const grainEl = document.querySelector('.film-grain') as HTMLElement;
    if (grainEl) {
      if (grainActive) {
        grainEl.style.opacity = '0';
      } else {
        grainEl.style.opacity = '0.015';
      }
    }
    setGrainActive(!grainActive);
  };

  // Inspector Mode logic
  useEffect(() => {
    if (!inspectActive) return;

    let hoveredEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target !== document.body && target !== document.documentElement) {
        if (target.closest('.feedback-widget-container')) return;

        hoveredEl = target;
        target.style.outline = '2px dashed #00C2FF';
        target.style.outlineOffset = '2px';
        target.style.cursor = 'cell';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target) {
        target.style.outline = '';
        target.style.outlineOffset = '';
        target.style.cursor = '';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target !== document.body && target !== document.documentElement) {
        if (target.closest('.feedback-widget-container')) return;

        e.preventDefault();
        e.stopPropagation();

        // 1. Tag name and classes context
        const tag = target.tagName.toLowerCase();
        const firstClass = target.classList?.item(0) || '';
        const elementTag = `${tag}${target.id ? '#' + target.id : ''}${firstClass ? '.' + firstClass : ''}`;

        // 2. Element text snippet
        let text = target.innerText || target.getAttribute('alt') || target.getAttribute('src') || '';
        if (text.length > 50) text = text.slice(0, 50) + '...';

        // 3. Find parent section context
        let sectionName = 'Global Page Layout';
        const parentSection = target.closest('section');
        if (parentSection) {
          const heading = parentSection.querySelector('h1, h2, h3, h4');
          if (heading) {
            sectionName = heading.textContent?.trim() || 'Showcase Section';
          } else {
            sectionName = parentSection.classList?.[0] || 'Page Section';
          }
        }

        // 4. Extract element selector path
        const parentClasses = target.parentElement 
          ? Array.from(target.parentElement.classList).join('.')
          : '';
        const selectorPath = `${tag} under parent class [${parentClasses}]`;

        const styles = window.getComputedStyle(target);
        const themeTokens = [
          `color: ${styles.color}`,
          `background: ${styles.backgroundColor}`,
          `font: ${styles.fontFamily.split(',')[0].replace(/"/g, '')} ${styles.fontSize}/${styles.fontWeight}`,
          `radius: ${styles.borderRadius}`,
          `border: ${styles.borderTopWidth} ${styles.borderTopStyle} ${styles.borderTopColor}`,
          `padding: ${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`,
        ].join(' | ');

        setActiveElementInfo({ 
          tag: elementTag.toUpperCase(), 
          text: text.trim(),
          section: sectionName,
          selectorPath: selectorPath,
          themeTokens,
        });
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
      if (hoveredEl) {
        hoveredEl.style.outline = '';
        hoveredEl.style.outlineOffset = '';
        hoveredEl.style.cursor = '';
      }
    };
  }, [inspectActive]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote.trim() || !activeElementInfo) return;

    const newNote: ElementNote = {
      id: Math.random().toString(36).substring(2, 9),
      elementTag: activeElementInfo.tag,
      elementText: activeElementInfo.text,
      section: activeElementInfo.section,
      selectorPath: activeElementInfo.selectorPath,
      themeTokens: activeElementInfo.themeTokens,
      note: currentNote.trim()
    };

    setNotesList(prev => [...prev, newNote]);
    setCurrentNote('');
    setActiveElementInfo(null);
    setInspectActive(false); // turn off inspector after clicking
  };

  const deleteNote = (id: string) => {
    setNotesList(prev => prev.filter(n => n.id !== id));
  };

  const copyToClipboard = () => {
    if (notesList.length === 0) return;

    let textBlock = `--- PARTH PRODUCTION DESIGN AUDIT (URL: https://parthproduction.in${pathname}) ---\n\n`;
    notesList.forEach((n, idx) => {
      textBlock += `${idx + 1}. [SECTION: "${n.section}" > ELEMENT: ${n.elementTag} (Value: "${n.elementText}")]\n`;
      textBlock += `   - Selector Path: ${n.selectorPath}\n`;
      textBlock += `   - Theme Tokens: ${n.themeTokens}\n`;
      textBlock += `   - Refinement Request: ${n.note}\n\n`;
    });
    textBlock += `--------------------------------------------`;

    navigator.clipboard.writeText(textBlock).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans feedback-widget-container">
      {/* Floating Sparkles Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white text-black border border-neutral-800 flex items-center justify-center shadow-2xl cursor-pointer hover:bg-neutral-100 transition-colors"
      >
        <Sparkles className="w-5 h-5 text-black" />
      </motion.button>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-secondary border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white max-h-[80vh] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Refinement Agent</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-800 transition-colors cursor-pointer text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Controls */}
            <div className="space-y-3 mb-4 bg-black/40 p-4 rounded-xl border border-gray-800/40 flex-shrink-0">
              <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Visual Modifiers</h4>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Analog Film Grain</span>
                <button
                  onClick={toggleGrain}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 bg-secondary hover:border-gray-700 transition cursor-pointer text-gray-300"
                >
                  {grainActive ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-accent" /> <span className="text-[10px] font-bold">ON</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-gray-500" /> <span className="text-[10px] font-bold text-gray-500">OFF</span>
                    </>
                  )}
                </button>
              </div>

              {/* Inspector Toggle */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-800/40">
                <span className="text-gray-300">Inspect & Click Element</span>
                <button
                  type="button"
                  onClick={() => setInspectActive(!inspectActive)}
                  className={`px-3 py-1.5 rounded-lg border transition cursor-pointer text-[10px] font-bold uppercase ${
                    inspectActive 
                      ? 'bg-accent text-white border-accent' 
                      : 'bg-secondary text-gray-300 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {inspectActive ? 'ACTIVE' : 'START INSPECT'}
                </button>
              </div>
            </div>

            {/* Modal Input for Clicked Element */}
            {activeElementInfo && (
              <form onSubmit={addNote} className="mb-4 bg-accent/5 border border-accent/20 p-4 rounded-xl space-y-3 flex-shrink-0">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent">
                      Section: {activeElementInfo.section}
                    </span>
                    <span className="text-[8px] font-medium text-gray-400 block mt-0.5">
                      Element: {activeElementInfo.tag}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setActiveElementInfo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-300 italic truncate">&quot;{activeElementInfo.text}&quot;</p>
                <p className="text-[9px] text-accent/90 leading-snug break-words">{activeElementInfo.themeTokens}</p>
                
                <input
                  type="text"
                  required
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Explain layout refinements here..."
                  className="w-full bg-black/60 border border-gray-800 rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />

                <button
                  type="submit"
                  className="w-full h-9 bg-accent text-white hover:bg-accent/90 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  Save Note <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            {/* Collected Notes */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1 max-h-[220px] scrollbar-none">
              <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 flex-shrink-0">Collected Notes ({notesList.length})</h4>
              
              {notesList.length === 0 ? (
                <div className="text-center py-6 text-[10px] text-gray-500 italic">
                  Click &apos;START INSPECT&apos; and select any element to add alignment notes.
                </div>
              ) : (
                notesList.map((n) => (
                  <div key={n.id} className="p-3 bg-black/30 border border-gray-800/60 rounded-lg flex items-start justify-between gap-2 text-xs">
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[8px] font-bold text-accent block uppercase">[{n.section} &gt; {n.elementTag}]</span>
                      <p className="text-gray-400 text-[9px] italic truncate">&quot;{n.elementText}&quot;</p>
                      <p className="text-white text-[11px] leading-relaxed break-words">{n.note}</p>
                    </div>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="p-1 text-gray-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Clipboard Action */}
            {notesList.length > 0 && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full h-11 bg-white hover:bg-neutral-100 text-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg flex-shrink-0"
              >
                {copied ? (
                  <>
                    Notes Copied! <ClipboardCheck className="w-4 h-4 text-green-600" />
                  </>
                ) : (
                  <>
                    Copy Audit Notes <Copy className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}

            {/* Footer stamp */}
            <div className="text-center pt-4 border-t border-gray-800/40 mt-4 text-[9px] text-gray-500 uppercase tracking-widest font-mono flex-shrink-0">
              active layout: {pathname}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
