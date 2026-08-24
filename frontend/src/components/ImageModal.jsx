import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOptimizedUrl } from '../utils/portfolioUtils';

const ImageModal = ({ src, isOpen, onClose, onPrev, onNext }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        onClose()
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: true }, '')
    } else {
      if (window.history.state?.modal) {
        window.history.back()
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    if (isOpen) setImageLoaded(false)
  }, [isOpen, src])

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      onNext()
    } else if (isRightSwipe) {
      onPrev()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors z-[101]"
          >
            <X size={28} className="text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="hidden md:block absolute left-2 md:left-8 p-2 md:p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full transition-all group z-[101]"
          >
            <ChevronLeft size={32} className="text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="hidden md:block absolute right-2 md:right-8 p-2 md:p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full transition-all group z-[101]"
          >
            <ChevronRight size={32} className="text-white group-hover:scale-110 transition-transform" />
          </button>

          <div className="absolute top-20 left-1/2 -translate-x-1/2 md:hidden text-white/50 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            ← swipe to navigate →
          </div>

          <motion.div
            key={src?.url}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-[95vw] max-h-[90vh] flex flex-col items-center justify-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={getOptimizedUrl(src?.url, 'image', 1600)}
              alt="Project View"
              className={`max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />

            {imageLoaded && src?.description && src?.description !== '<br>' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-center px-4 overflow-y-auto"
              >
                <div className="h-[2px] w-12 bg-[#EAB308] mx-auto mb-4" />
                <div className="text-white/90 text-lg md:text-xl font-medium leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: src.description }} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageModal;
