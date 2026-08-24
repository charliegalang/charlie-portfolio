import { useState } from 'react';
import { generateId } from "../utils/portfolioUtils";

export const useVideoState = (initialPortfolioRef, sessionUploadsRef, getAllPublicIds) => {
  const [videoSections, setVideoSections] = useState([]);
  const [videoBgColor, setVideoBgColor] = useState({ light: "transparent", dark: "transparent" });
  const [videoLineColor, setVideoLineColor] = useState({ light: "#EAB308", dark: "#EAB308" });
  const [videoVisible, setVideoVisible] = useState(true);

  const addVideoSection = () => {
    setVideoSections(prev => [...prev, {
      id: generateId(),
      categoryId: generateId(),
      title: { light: "New Video Section", dark: "New Video Section" },
      subtitle: { light: "Add a description here", dark: "Add a description here" },
      videos: [],
      isVisible: true
    }]);
  };

  const deleteVideoSection = (id) => {
    if (confirm("Delete this entire video section?")) {
      setVideoSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const moveVideoSection = (id, direction) => {
    setVideoSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === prev.length - 1)) return prev;
      const next = [...prev];
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  };

  const updateVideoSection = (id, field, value, mode, parseMultiMode) => setVideoSections(prev => prev.map(s =>
    s.id === id ? { ...s, [field]: (field === 'isVisible' ? value : { ...parseMultiMode(s[field]), [mode]: value }) } : s
  ));

  const updateVideoItems = (id, videosOrFn) => setVideoSections(prev => prev.map(s => {
    if (s.id === id) {
      const newVideos = typeof videosOrFn === 'function' ? videosOrFn(s.videos) : videosOrFn;
      newVideos.forEach(vid => {
        if (vid.public_id && !getAllPublicIds(initialPortfolioRef.current).has(vid.public_id)) {
          sessionUploadsRef.current.add(vid.public_id);
        }
      });
      return { ...s, videos: newVideos };
    }
    return s;
  }));

  const updateVideoDescription = (id, vIdx, desc) => setVideoSections(prev => prev.map(s => s.id === id ? { ...s, videos: s.videos.map((v, i) => i === vIdx ? { ...v, description: desc } : v) } : s));

  return {
    videoSections, setVideoSections,
    videoBgColor, setVideoBgColor,
    videoLineColor, setVideoLineColor,
    videoVisible, setVideoVisible,
    addVideoSection, deleteVideoSection, moveVideoSection,
    updateVideoSection, updateVideoItems, updateVideoDescription
  };
};
