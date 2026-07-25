'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, CheckCircle, Sliders, Eye, EyeOff } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function VisualFeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [grainActive, setGrainActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: pathname,
          notes: notes,
          rating: rating
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setNotes('');
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.error('Failed to submit refinement feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Sparkles Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white text-black border border-neutral-800 flex items-center justify-center shadow-2xl cursor-pointer hover:bg-neutral-100 transition-colors"
      >
        <Sparkles className="w-5 h-5 text-black" />
      </motion.button>

      {/* Sidebar Panel overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-secondary border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
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

            {/* Quick Layout Controls */}
            <div className="space-y-3 mb-6 bg-black/40 p-4 rounded-xl border border-gray-800/40">
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
            </div>

            {/* Feedback / Refinement Form */}
            {submitted ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-accent" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Refinements Logged</h4>
                <p className="text-[10px] text-gray-400 max-w-[200px] leading-relaxed">
                  Your layout review has been written to the workspace. The AI Agent will process these refinements.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">
                    Rate Current Screen Design
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setRating(val)}
                        className={`text-lg p-1 transition cursor-pointer ${
                          rating >= val ? 'text-accent' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block">
                    Describe Layout Refinements
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter alignment notes, text corrections, or design polish requirements..."
                    className="w-full bg-black/50 border border-gray-800 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !notes.trim()}
                  className="w-full h-11 bg-white hover:bg-neutral-100 text-black disabled:bg-neutral-800 disabled:text-neutral-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
                >
                  {submitting ? 'Logging...' : (
                    <>
                      Send to AI Agent <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer stamp */}
            <div className="text-center pt-4 border-t border-gray-800/40 mt-4 text-[9px] text-gray-500 uppercase tracking-widest font-mono">
              active layout: {pathname}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
