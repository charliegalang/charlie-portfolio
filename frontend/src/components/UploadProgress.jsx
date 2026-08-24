import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const UploadProgress = ({ uploads }) => {
  return (
    <div className="fixed bottom-0 left-0 z-[999999] pointer-events-none p-2 flex flex-col gap-2">
      <AnimatePresence>
        {Object.values(uploads).map((upload) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -20 }}
            className="pointer-events-auto"
          >
            <div className={`bg-black/90 backdrop-blur-xl rounded-2xl border border-[#EAB308]/30 shadow-2xl p-2 flex items-center justify-center transition-all duration-500 ${upload.phase === 'success' ? 'w-14 h-14 scale-110' : 'w-11 h-11'}`}>
              {upload.phase === 'success' ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.2 }}
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                >
                  <Check size={24} className="text-white" strokeWidth={4} />
                </motion.div>
              ) : (
                <div className="relative w-9 h-9">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                    <motion.circle
                      cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="3" fill="transparent"
                      strokeDasharray="100.5"
                      initial={{ strokeDashoffset: 100.5 }}
                      animate={{ strokeDashoffset: 100.5 - (100.5 * (upload.percent || 0)) / 100 }}
                      transition={{ type: "spring", damping: 30 }}
                      className="text-[#EAB308]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white">
                    {Math.round(upload.percent)}%
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UploadProgress;
