import { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export const useScrollEffects = (heroRef) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // Trigger the 'scrolled' state ONLY when the Hero section (background picture)
        // is completely scrolled out of view.
        // This ensures the "Top State" navigation colors stay as long as the background is visible.
        setScrolled(rect.bottom <= 0);
      } else {
        setScrolled(window.scrollY > window.innerHeight * 0.9);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [heroRef]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.8]);

  return { scrolled, heroOpacity, heroScale };
};
