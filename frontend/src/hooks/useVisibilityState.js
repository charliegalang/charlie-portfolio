import { useState } from 'react';

export const useVisibilityState = () => {
  const [heroVisible, setHeroVisible] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(true);
  const [experienceVisible, setExperienceVisible] = useState(true);
  const [twoThingsVisible, setTwoThingsVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(true);
  const [galleryVisible, setGalleryVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(true);

  return {
    heroVisible, setHeroVisible,
    aboutVisible, setAboutVisible,
    experienceVisible, setExperienceVisible,
    twoThingsVisible, setTwoThingsVisible,
    contactVisible, setContactVisible,
    galleryVisible, setGalleryVisible,
    videoVisible, setVideoVisible,
  };
};
