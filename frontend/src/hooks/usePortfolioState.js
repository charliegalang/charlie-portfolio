import { useState, useEffect, useRef } from 'react';
import { fetchPortfolio, savePortfolio } from "../services/PortfolioService";
import { deleteFromCloudinary } from "../services/CloudinaryService";

// Sub-hooks
import { useAssetUploads } from './useAssetUploads';
import { useGalleryState } from './useGalleryState';
import { useVideoState } from './useVideoState';
import { useAboutStatsState } from './useAboutStatsState';
import { useVisibilityState } from './useVisibilityState';
import { useBasicSectionsState } from './useBasicSectionsState';
import { useProfileState } from './useProfileState';
import { useTwoThingsState } from './useTwoThingsState';

export const usePortfolioState = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [experienceData, setExperienceData] = useState(null);
  const [lightModeEnabled, setLightModeEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const initialPortfolioRef = useRef(null);
  const sessionUploadsRef = useRef(new Set());

  const parseMultiMode = (val, defaultVal = "") => {
    if (typeof val === 'string') return { light: val, dark: val };
    if (val && (val.light !== undefined || val.dark !== undefined)) return { light: val.light ?? defaultVal, dark: val.dark ?? defaultVal };
    return { light: defaultVal, dark: defaultVal };
  };

  const getAllPublicIds = (portfolio) => {
    const ids = new Set();
    if (!portfolio) return ids;
    if (portfolio.profileId) ids.add(portfolio.profileId);
    if (portfolio.bgId) ids.add(portfolio.bgId);
    if (portfolio.bgIdMobile) ids.add(portfolio.bgIdMobile);

    (portfolio.gallerySections || []).forEach(section => {
      (section.images || []).forEach(img => {
        if (img.public_id) ids.add(img.public_id);
      });
    });

    (portfolio.videoSections || []).forEach(section => {
      (section.videos || []).forEach(vid => {
        if (vid.public_id) ids.add(vid.public_id);
      });
    });

    return ids;
  };

  // Compose sub-hooks
  const profile = useProfileState(parseMultiMode);
  const uploads = useAssetUploads(sessionUploadsRef);
  const gallery = useGalleryState(initialPortfolioRef, sessionUploadsRef, getAllPublicIds);
  const video = useVideoState(initialPortfolioRef, sessionUploadsRef, getAllPublicIds);
  const aboutStats = useAboutStatsState(parseMultiMode);
  const visibility = useVisibilityState();
  const basic = useBasicSectionsState(parseMultiMode);
  const twoThings = useTwoThingsState();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPortfolio();
      if (data) {
        initialPortfolioRef.current = JSON.parse(JSON.stringify(data));

        setLightModeEnabled(data.lightModeEnabled !== undefined ? data.lightModeEnabled : true);
        setDarkModeEnabled(data.darkModeEnabled !== undefined ? data.darkModeEnabled : true);

        gallery.setGallerySections((data.gallerySections || []).map(s => ({
          ...s,
          title: parseMultiMode(s.title),
          subtitle: parseMultiMode(s.subtitle),
          isVisible: s.isVisible !== undefined ? s.isVisible : true
        })));

        video.setVideoSections((data.videoSections || []).map(s => ({
          ...s,
          title: parseMultiMode(s.title),
          subtitle: parseMultiMode(s.subtitle),
          isVisible: s.isVisible !== undefined ? s.isVisible : true
        })));

        profile.setProfileUrl(data.profileUrl || "");
        profile.setProfileId(data.profileId || "");
        profile.setProfileBgColor(parseMultiMode(data.profileBgColor, "#EAB308"));
        profile.setBgUrl(data.bgUrl || "");
        profile.setBgId(data.bgId || "");
        profile.setBgUrlMobile(data.bgUrlMobile || "");
        profile.setBgIdMobile(data.bgIdMobile || "");
        profile.setBgFit(parseMultiMode(data.bgFit, "cover"));

        basic.setHeroBgColor(parseMultiMode(data.heroBgColor));
        basic.setAboutBgColor(parseMultiMode(data.aboutBgColor));
        gallery.setGalleryBgColor(parseMultiMode(data.galleryBgColor));
        gallery.setGalleryLineColor(parseMultiMode(data.galleryLineColor, "#EAB308"));
        video.setVideoBgColor(parseMultiMode(data.videoBgColor));
        video.setVideoLineColor(parseMultiMode(data.videoLineColor, "#EAB308"));
        twoThings.setTwoThingsBgColor(parseMultiMode(data.twoThingsBgColor));
        twoThings.setTwoThingsLineColor(parseMultiMode(data.twoThingsLineColor, "#EAB308"));
        basic.setContactBgColor(parseMultiMode(data.contactBgColor, "#EAB308"));
        basic.setContactTitleColor(parseMultiMode(data.contactTitleColor, "#000000"));
        basic.setContactTextColor(parseMultiMode(data.contactTextColor, "#000000"));
        basic.setFooterBgColor(parseMultiMode(data.footerBgColor));

        basic.setHeroTitle(parseMultiMode(data.heroTitle, ""));
        basic.setHeroSubtitle(parseMultiMode(data.heroSubtitle, ""));
        basic.setAboutName(parseMultiMode(data.aboutName, ""));
        basic.setAboutText(parseMultiMode(data.aboutText, ""));
        basic.setAboutButtonText(parseMultiMode(data.aboutButtonText, "Let's work together"));
        basic.setAboutButtonBg(parseMultiMode(data.aboutButtonBg, "#EAB308"));
        basic.setAboutButtonColor(parseMultiMode(data.aboutButtonColor, "#000000"));

        aboutStats.setStats((data.stats || []).map(s => ({
          ...s,
          n: parseMultiMode(s.n, "0"),
          l: parseMultiMode(s.l, "Label")
        })));

        aboutStats.setPromiseItems((data.promiseItems || []).map(p => ({
          ...p,
          t: parseMultiMode(p.t, ""),
          d: parseMultiMode(p.d, "")
        })));

        twoThings.setTwoThingsTitle(parseMultiMode(data.twoThingsTitle, "Two Things"));
        twoThings.setTwoThingsSubtitle(parseMultiMode(data.twoThingsSubtitle, ""));
        basic.setContactTitle(parseMultiMode(data.contactTitle, ""));
        basic.setContactText(parseMultiMode(data.contactText, ""));
        basic.setContactButton(parseMultiMode(data.contactButton, ""));
        basic.setContactButtonBg(parseMultiMode(data.contactButtonBg, "#000000"));
        basic.setContactButtonColor(parseMultiMode(data.contactButtonColor, "#ffffff"));
        basic.setContactButtonLink(data.contactButtonLink || "");
        basic.setFooterName(parseMultiMode(data.footerName, ""));
        basic.setFooterText(parseMultiMode(data.footerText, ""));
        basic.setFooterEmail(parseMultiMode(data.footerEmail, ""));
        basic.setFooterNavTitle(parseMultiMode(data.footerNavTitle, "Navigation"));
        basic.setNavWorkLabel(parseMultiMode(data.navWorkLabel, "Work"));
        basic.setNavAboutLabel(parseMultiMode(data.navAboutLabel, "About"));
        basic.setNavContactLabel(parseMultiMode(data.navContactLabel, "Contact"));
        basic.setFooterConnectTitle(parseMultiMode(data.footerConnectTitle, "Connect"));
        aboutStats.setConnectItems((data.connectItems || []).map(item => ({
          ...item,
          color: item.color || "#EAB308"
        })));
        basic.setCopyright(parseMultiMode(data.copyright, ""));
        setExperienceData(data.experienceData || null);

        visibility.setHeroVisible(data.heroVisible !== undefined ? data.heroVisible : true);
        visibility.setAboutVisible(data.aboutVisible !== undefined ? data.aboutVisible : true);
        visibility.setExperienceVisible(data.experienceVisible !== undefined ? data.experienceVisible : true);
        visibility.setTwoThingsVisible(data.twoThingsVisible !== undefined ? data.twoThingsVisible : true);
        visibility.setContactVisible(data.contactVisible !== undefined ? data.contactVisible : true);
        visibility.setGalleryVisible(data.galleryVisible !== undefined ? data.galleryVisible : true);
        visibility.setVideoVisible(data.videoVisible !== undefined ? data.videoVisible : true);

        // Load Global Theme Colors
        basic.setTextPrimaryColor(parseMultiMode(data.textPrimaryColor, data.mode === 'dark' ? "#ffffff" : "#1E1E1E"));
        basic.setTextSecondaryColor(parseMultiMode(data.textSecondaryColor, data.mode === 'dark' ? "#A0A0A0" : "#4A4A4A"));
        basic.setUniversalLineColor(parseMultiMode(data.universalLineColor, "#EAB308"));
        basic.setUniversalIconColor(parseMultiMode(data.universalIconColor, "#EAB308"));

        // Navigation Colors
        basic.setNavColorTop(parseMultiMode(data.navColorTop, "#ffffff"));
        basic.setNavColorScrolled(parseMultiMode(data.navColorScrolled, data.mode === 'dark' ? "#ffffff" : "#1E1E1E"));
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        gallerySections: gallery.gallerySections,
        videoSections: video.videoSections,
        profileUrl: profile.profileUrl,
        profileId: profile.profileId,
        profileBgColor: profile.profileBgColor,
        bgUrl: profile.bgUrl,
        bgId: profile.bgId,
        bgUrlMobile: profile.bgUrlMobile,
        bgIdMobile: profile.bgIdMobile,
        bgFit: profile.bgFit,
        heroBgColor: basic.heroBgColor,
        aboutBgColor: basic.aboutBgColor,
        galleryBgColor: gallery.galleryBgColor,
        galleryLineColor: gallery.galleryLineColor,
        videoBgColor: video.videoBgColor,
        videoLineColor: video.videoLineColor,
        twoThingsBgColor: twoThings.twoThingsBgColor,
        twoThingsLineColor: twoThings.twoThingsLineColor,
        contactBgColor: basic.contactBgColor,
        contactTitleColor: basic.contactTitleColor,
        contactTextColor: basic.contactTextColor,
        footerBgColor: basic.footerBgColor,
        heroTitle: basic.heroTitle,
        heroSubtitle: basic.heroSubtitle,
        aboutName: basic.aboutName,
        aboutText: basic.aboutText,
        aboutButtonText: basic.aboutButtonText,
        aboutButtonBg: basic.aboutButtonBg,
        aboutButtonColor: basic.aboutButtonColor,
        stats: aboutStats.stats,
        promiseItems: aboutStats.promiseItems,
        twoThingsTitle: twoThings.twoThingsTitle,
        twoThingsSubtitle: twoThings.twoThingsSubtitle,
        contactTitle: basic.contactTitle,
        contactText: basic.contactText,
        contactButton: basic.contactButton,
        contactButtonBg: basic.contactButtonBg,
        contactButtonColor: basic.contactButtonColor,
        contactButtonLink: basic.contactButtonLink,
        footerName: basic.footerName,
        footerText: basic.footerText,
        footerEmail: basic.footerEmail,
        footerNavTitle: basic.footerNavTitle,
        navWorkLabel: basic.navWorkLabel,
        navAboutLabel: basic.navAboutLabel,
        navContactLabel: basic.navContactLabel,
        footerConnectTitle: basic.footerConnectTitle,
        connectItems: aboutStats.connectItems,
        copyright: basic.copyright,
        experienceData,
        heroVisible: visibility.heroVisible,
        aboutVisible: visibility.aboutVisible,
        experienceVisible: visibility.experienceVisible,
        twoThingsVisible: visibility.twoThingsVisible,
        contactVisible: visibility.contactVisible,
        galleryVisible: visibility.galleryVisible,
        videoVisible: visibility.videoVisible,
        textPrimaryColor: basic.textPrimaryColor,
        textSecondaryColor: basic.textSecondaryColor,
        universalLineColor: basic.universalLineColor,
        universalIconColor: basic.universalIconColor,
        navColorTop: basic.navColorTop,
        navColorScrolled: basic.navColorScrolled,
        lightModeEnabled,
        darkModeEnabled
      };

      const initialIds = getAllPublicIds(initialPortfolioRef.current);
      const currentIds = getAllPublicIds(payload);
      const candidateIds = new Set([...initialIds, ...sessionUploadsRef.current]);
      const idsToDelete = [...candidateIds].filter(id => !currentIds.has(id));

      await savePortfolio(payload);

      for (const id of idsToDelete) {
        try {
          const isVideo = (initialPortfolioRef.current?.videoSections || [])
            .some(s => (s.videos || []).some(v => v.public_id === id)) ||
            video.videoSections.some(s => (s.videos || []).some(v => v.public_id === id));
          await deleteFromCloudinary(id, isVideo ? "video" : "image");
        } catch (err) {
          console.error(`Cleanup failed for ${id}:`, err);
        }
      }

      initialPortfolioRef.current = JSON.parse(JSON.stringify(payload));
      sessionUploadsRef.current.clear();
      alert("Portfolio saved successfully!");
    } catch (error) {
      alert("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateUniversalLineColor = (color, mode) => {
    basic.setUniversalLineColor(prev => ({ ...prev, [mode]: color }));
    gallery.setGalleryLineColor(prev => ({ ...prev, [mode]: color }));
    video.setVideoLineColor(prev => ({ ...prev, [mode]: color }));
    twoThings.setTwoThingsLineColor(prev => ({ ...prev, [mode]: color }));

    setExperienceData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        workHistoryLineColor: { ...parseMultiMode(prev.workHistoryLineColor), [mode]: color }
      };
    });
  };

  const updateUniversalIconColor = (color, mode) => {
    basic.setUniversalIconColor(prev => ({ ...prev, [mode]: color }));
    setExperienceData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        headerIconColor: { ...parseMultiMode(prev.headerIconColor), [mode]: color }
      };
    });
  };

  return {
    loading, isSaving,
    uploads: uploads.uploads,
    updateUpload: uploads.updateUpload,
    handleStaticUpload: (e, type) => uploads.handleStaticUpload(e, type, {
      setProfileUrl: profile.setProfileUrl,
      setProfileId: profile.setProfileId,
      setBgUrl: profile.setBgUrl,
      setBgId: profile.setBgId,
      setBgUrlMobile: profile.setBgUrlMobile,
      setBgIdMobile: profile.setBgIdMobile
    }),

    // Theme Control
    lightModeEnabled,
    setLightModeEnabled,
    darkModeEnabled,
    setDarkModeEnabled,

    // Gallery
    gallerySections: gallery.gallerySections,
    galleryBgColor: gallery.galleryBgColor,
    galleryLineColor: gallery.galleryLineColor,
    galleryVisible: gallery.galleryVisible,
    setGalleryVisible: visibility.setGalleryVisible,
    setGalleryBgColor: basic.updateMultiMode(gallery.setGalleryBgColor),
    addGallerySection: gallery.addGallerySection,
    deleteGallerySection: gallery.deleteGallerySection,
    moveGallerySection: gallery.moveGallerySection,
    updateGallerySection: (id, f, v, m) => gallery.updateGallerySection(id, f, v, m, parseMultiMode),
    updateGalleryImages: gallery.updateGalleryImages,

    // Video
    videoSections: video.videoSections,
    videoBgColor: video.videoBgColor,
    videoLineColor: video.videoLineColor,
    videoVisible: video.videoVisible,
    setVideoVisible: visibility.setVideoVisible,
    setVideoBgColor: basic.updateMultiMode(video.setVideoBgColor),
    addVideoSection: video.addVideoSection,
    deleteVideoSection: video.deleteVideoSection,
    moveVideoSection: video.moveVideoSection,
    updateVideoSection: (id, f, v, m) => video.updateVideoSection(id, f, v, m, parseMultiMode),
    updateVideoItems: video.updateVideoItems,
    updateVideoDescription: video.updateVideoDescription,

    // Profile
    profileUrl: profile.profileUrl,
    profileId: profile.profileId,
    profileBgColor: profile.profileBgColor,
    bgUrl: profile.bgUrl,
    bgId: profile.bgId,
    bgUrlMobile: profile.bgUrlMobile,
    bgIdMobile: profile.bgIdMobile,
    bgFit: profile.bgFit,
    setProfileBgColor: basic.updateMultiMode(profile.setProfileBgColor),
    setBgFit: basic.updateMultiMode(profile.setBgFit),

    // Hero
    heroTitle: basic.heroTitle,
    heroSubtitle: basic.heroSubtitle,
    heroBgColor: basic.heroBgColor,
    heroVisible: visibility.heroVisible,
    setHeroVisible: visibility.setHeroVisible,
    setHeroTitle: basic.updateMultiMode(basic.setHeroTitle),
    setHeroSubtitle: basic.updateMultiMode(basic.setHeroSubtitle),
    setHeroBgColor: basic.updateMultiMode(basic.setHeroBgColor),

    // About
    aboutName: basic.aboutName,
    aboutText: basic.aboutText,
    aboutButtonText: basic.aboutButtonText,
    aboutButtonBg: basic.aboutButtonBg,
    aboutButtonColor: basic.aboutButtonColor,
    aboutBgColor: basic.aboutBgColor,
    aboutVisible: visibility.aboutVisible,
    setAboutVisible: visibility.setAboutVisible,
    setAboutName: basic.updateMultiMode(basic.setAboutName),
    setAboutText: basic.updateMultiMode(basic.setAboutText),
    setAboutButtonText: basic.updateMultiMode(basic.setAboutButtonText),
    setAboutButtonBg: basic.updateMultiMode(basic.setAboutButtonBg),
    setAboutButtonColor: basic.updateMultiMode(basic.setAboutButtonColor),
    setAboutBgColor: basic.updateMultiMode(basic.setAboutBgColor),

    // Stats
    stats: aboutStats.stats,
    addStat: aboutStats.addStat,
    updateStat: aboutStats.updateStat,
    deleteStat: aboutStats.deleteStat,
    moveStat: aboutStats.moveStat,

    // Promise
    promiseItems: aboutStats.promiseItems,
    addPromiseItem: aboutStats.addPromiseItem,
    updatePromiseItem: aboutStats.updatePromiseItem,
    deletePromiseItem: aboutStats.deletePromiseItem,
    movePromiseItem: aboutStats.movePromiseItem,

    // Two Things
    twoThingsTitle: twoThings.twoThingsTitle,
    twoThingsSubtitle: twoThings.twoThingsSubtitle,
    twoThingsBgColor: twoThings.twoThingsBgColor,
    twoThingsLineColor: twoThings.twoThingsLineColor,
    twoThingsVisible: visibility.twoThingsVisible,
    setTwoThingsVisible: visibility.setTwoThingsVisible,
    setTwoThingsTitle: basic.updateMultiMode(twoThings.setTwoThingsTitle),
    setTwoThingsSubtitle: basic.updateMultiMode(twoThings.setTwoThingsSubtitle),
    setTwoThingsBgColor: basic.updateMultiMode(twoThings.setTwoThingsBgColor),

    // Contact
    contactTitle: basic.contactTitle,
    contactText: basic.contactText,
    contactButton: basic.contactButton,
    contactButtonBg: basic.contactButtonBg,
    contactButtonColor: basic.contactButtonColor,
    contactButtonLink: basic.contactButtonLink,
    contactBgColor: basic.contactBgColor,
    contactTitleColor: basic.contactTitleColor,
    contactTextColor: basic.contactTextColor,
    contactVisible: visibility.contactVisible,
    setContactVisible: visibility.setContactVisible,
    setContactTitle: basic.updateMultiMode(basic.setContactTitle),
    setContactText: basic.updateMultiMode(basic.setContactText),
    setContactButton: basic.updateMultiMode(basic.setContactButton),
    setContactButtonBg: basic.updateMultiMode(basic.setContactButtonBg),
    setContactButtonColor: basic.updateMultiMode(basic.setContactButtonColor),
    setContactButtonLink: basic.setContactButtonLink,
    setContactTitleColor: basic.updateMultiMode(basic.setContactTitleColor),
    setContactTextColor: basic.updateMultiMode(basic.setContactTextColor),
    setContactBgColor: basic.updateMultiMode(basic.setContactBgColor),

    // Experience
    experienceVisible: visibility.experienceVisible,
    setExperienceVisible: visibility.setExperienceVisible,
    experienceData,
    setExperienceData,

    // Footer
    footerName: basic.footerName,
    footerText: basic.footerText,
    footerEmail: basic.footerEmail,
    footerNavTitle: basic.footerNavTitle,
    navWorkLabel: basic.navWorkLabel,
    navAboutLabel: basic.navAboutLabel,
    navContactLabel: basic.navContactLabel,
    footerConnectTitle: basic.footerConnectTitle,
    footerBgColor: basic.footerBgColor,
    copyright: basic.copyright,
    setFooterName: basic.updateMultiMode(basic.setFooterName),
    setFooterText: basic.updateMultiMode(basic.setFooterText),
    setFooterEmail: basic.updateMultiMode(basic.setFooterEmail),
    setFooterNavTitle: basic.updateMultiMode(basic.setFooterNavTitle),
    setNavWorkLabel: basic.updateMultiMode(basic.setNavWorkLabel),
    setNavAboutLabel: basic.updateMultiMode(basic.setNavAboutLabel),
    setNavContactLabel: basic.updateMultiMode(basic.setNavContactLabel),
    setFooterConnectTitle: basic.updateMultiMode(basic.setFooterConnectTitle),
    setFooterBgColor: basic.updateMultiMode(basic.setFooterBgColor),
    setCopyright: basic.updateMultiMode(basic.setCopyright),

    // Global Theme Colors
    textPrimaryColor: basic.textPrimaryColor,
    textSecondaryColor: basic.textSecondaryColor,
    universalLineColor: basic.universalLineColor,
    universalIconColor: basic.universalIconColor,
    navColorTop: basic.navColorTop,
    navColorScrolled: basic.navColorScrolled,
    setTextPrimaryColor: basic.updateMultiMode(basic.setTextPrimaryColor),
    setTextSecondaryColor: basic.updateMultiMode(basic.setTextSecondaryColor),
    setUniversalLineColor: updateUniversalLineColor,
    setUniversalIconColor: updateUniversalIconColor,
    setNavColorTop: basic.updateMultiMode(basic.setNavColorTop),
    setNavColorScrolled: basic.updateMultiMode(basic.setNavColorScrolled),

    // Connect Items
    connectItems: aboutStats.connectItems,
    addConnectItem: aboutStats.addConnectItem,
    updateConnectItem: aboutStats.updateConnectItem,
    deleteConnectItem: aboutStats.deleteConnectItem,

    // Global
    handleGlobalSave
  };
};
