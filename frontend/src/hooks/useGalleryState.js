import { useState } from 'react';
import { generateId } from "../utils/portfolioUtils";

export const useGalleryState = (initialPortfolioRef, sessionUploadsRef, getAllPublicIds) => {
  const [gallerySections, setGallerySections] = useState([]);
  const [galleryBgColor, setGalleryBgColor] = useState({ light: "transparent", dark: "transparent" });
  const [galleryLineColor, setGalleryLineColor] = useState({ light: "#EAB308", dark: "#EAB308" });
  const [galleryVisible, setGalleryVisible] = useState(true);

  const addGallerySection = () => {
    setGallerySections(prev => [...prev, {
      id: generateId(),
      categoryId: generateId(),
      title: { light: "New Gallery Section", dark: "New Gallery Section" },
      subtitle: { light: "Add a description here", dark: "Add a description here" },
      images: [],
      isVisible: true
    }]);
  };

  const deleteGallerySection = (id) => {
    if (confirm("Delete this entire gallery section?")) {
      setGallerySections(prev => prev.filter(s => s.id !== id));
    }
  };

  const moveGallerySection = (id, direction) => {
    setGallerySections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === prev.length - 1)) return prev;
      const next = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  };

  const updateGallerySection = (id, field, value, mode, parseMultiMode) => setGallerySections(prev => prev.map(s =>
    s.id === id ? { ...s, [field]: (field === 'isVisible' ? value : { ...parseMultiMode(s[field]), [mode]: value }) } : s
  ));

  const updateGalleryImages = (id, imagesOrFn) => setGallerySections(prev => prev.map(s => {
    if (s.id === id) {
      let nextImages = typeof imagesOrFn === 'function' ? imagesOrFn(s.images) : imagesOrFn;

      // Deduplicate by public_id to prevent UI duplication bugs
      const seen = new Set();
      nextImages = nextImages.filter(img => {
        if (!img.public_id) return true;
        if (seen.has(img.public_id)) return false;
        seen.add(img.public_id);
        return true;
      });

      nextImages.forEach(img => {
        if (img.public_id && !getAllPublicIds(initialPortfolioRef.current).has(img.public_id)) {
          sessionUploadsRef.current.add(img.public_id);
        }
      });
      return { ...s, images: nextImages };
    }
    return s;
  }));

  return {
    gallerySections, setGallerySections,
    galleryBgColor, setGalleryBgColor,
    galleryLineColor, setGalleryLineColor,
    galleryVisible, setGalleryVisible,
    addGallerySection, deleteGallerySection, moveGallerySection,
    updateGallerySection, updateGalleryImages
  };
};
