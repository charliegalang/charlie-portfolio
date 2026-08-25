import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import GalleryArea from "../components/GalleryArea";
import VideoArea from "../components/VideoArea";
import TwoThingsSection from "../components/TwoThingsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import UploadProgress from "../components/UploadProgress";
import ImageModal from "../components/ImageModal";
import IconPicker from "../components/IconPicker";

// Hooks
import { usePortfolioState } from '../hooks/usePortfolioState';
import { useEditMode } from '../hooks/useEditMode';
import { useDarkMode } from '../hooks/useDarkMode';
import { useScrollEffects } from '../hooks/useScrollEffects';
import useAuthStore from '../store/authStore';

// Utils
import { getOptimizedUrl } from '../utils/portfolioUtils';

function Portfolio() {
  const isEditMode = useEditMode();
  const [darkMode, setDarkMode] = useDarkMode();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();

  const {
    loading, isSaving, uploads, updateUpload,
    gallerySections, videoSections, profileUrl, profileBgColor, bgUrl, bgUrlMobile,
    heroBgColor, aboutBgColor, galleryBgColor, galleryLineColor, videoBgColor, videoLineColor, twoThingsBgColor, twoThingsLineColor, contactBgColor, contactTitleColor, contactTextColor, footerBgColor,
    heroTitle, heroSubtitle, aboutName, aboutText, aboutButtonText, aboutButtonBg, aboutButtonColor, stats, promiseItems, twoThingsTitle, twoThingsSubtitle,
    contactTitle, contactText, contactButton, contactButtonBg, contactButtonColor, contactButtonLink, footerName, footerText, footerEmail,
    footerNavTitle, navWorkLabel, navAboutLabel, navContactLabel, footerConnectTitle,
    connectItems, copyright, experienceData,
    heroVisible, aboutVisible, experienceVisible, twoThingsVisible, contactVisible,
    setHeroVisible, setAboutVisible, setExperienceVisible, setTwoThingsVisible, setContactVisible,
    setHeroTitle, setHeroSubtitle, setAboutName, setAboutText, setAboutButtonText, setAboutButtonBg, setAboutButtonColor, setTwoThingsTitle, setTwoThingsSubtitle,
    setContactTitle, setContactText, setContactButton, setContactButtonBg, setContactButtonColor, setContactButtonLink,
    setContactTitleColor, setContactTextColor,
    setFooterName, setFooterText, setFooterEmail,
    setFooterNavTitle, setNavWorkLabel, setNavAboutLabel, setNavContactLabel, setFooterConnectTitle,
    setCopyright, setExperienceData, setProfileBgColor, setHeroBgColor, setAboutBgColor, setGalleryBgColor, setVideoBgColor,
    setTwoThingsBgColor, setContactBgColor, setFooterBgColor,
    textPrimaryColor, setTextPrimaryColor, textSecondaryColor, setTextSecondaryColor,
    universalLineColor, setUniversalLineColor, universalIconColor, setUniversalIconColor,
    navColorTop, setNavColorTop, navColorScrolled, setNavColorScrolled,
    handleGlobalSave, handleStaticUpload,
    addGallerySection, deleteGallerySection, moveGallerySection, updateGallerySection, updateGalleryImages,
    addVideoSection, deleteVideoSection, moveVideoSection, updateVideoSection, updateVideoItems, updateVideoDescription,
    addStat, updateStat, deleteStat, moveStat,
    addPromiseItem, updatePromiseItem, deletePromiseItem, movePromiseItem,
    addConnectItem, updateConnectItem, deleteConnectItem,
    lightModeEnabled, setLightModeEnabled, darkModeEnabled, setDarkModeEnabled
  } = usePortfolioState();

  // Enforce mode constraints
  useEffect(() => {
    if (!loading) {
      if (!lightModeEnabled && !darkMode) {
        setDarkMode(true);
      } else if (!darkModeEnabled && darkMode) {
        setDarkMode(false);
      }
    }
  }, [lightModeEnabled, darkModeEnabled, loading, darkMode, setDarkMode]);

  const mode = darkMode ? 'dark' : 'light';
  const [isMobile, setIsMobile] = useState(false);
  const [iconPickerConfig, setIconPickerConfig] = useState({ isOpen: false, itemId: null, currentIcon: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nameClickCount, setNameClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);

  const heroRef = useRef(null);
  const workRef = useRef(null);
  const videoRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const { scrolled, heroOpacity, heroScale } = useScrollEffects(heroRef);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentBgUrl = useMemo(() => {
    const rawUrl = (isMobile && bgUrlMobile) ? bgUrlMobile : bgUrl;
    return getOptimizedUrl(rawUrl, 'image', isMobile ? 800 : 1920);
  }, [isMobile, bgUrl, bgUrlMobile]);

  const optimizedProfileUrl = useMemo(() => getOptimizedUrl(profileUrl, 'image', 600), [profileUrl]);

  const navDisplayName = useMemo(() => {
    const currentName = footerName[mode];
    if (!currentName) return "CHARLIE GALANG";
    const clean = currentName.replace(/<[^>]*>/g, '').trim();
    return clean || "CHARLIE GALANG";
  }, [footerName, mode]);

  const allAssets = useMemo(() => gallerySections.flatMap((section) => section.images), [gallerySections]);

  const handleNameClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNameClickCount(prev => {
        const newCount = prev + 1;
        if (newCount === 3) {
            navigate('/login');
            return 0;
        }
        return newCount;
    });
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => setNameClickCount(0), 1000);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const openIconPicker = (itemId, currentIcon) => setIconPickerConfig({ isOpen: true, itemId, currentIcon });
  const handleIconSelect = (newIcon) => iconPickerConfig.itemId && updateConnectItem(iconPickerConfig.itemId, "icon", newIcon);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasVisibleGallery = gallerySections.some(s => s.isVisible);
  const hasVisibleVideo = videoSections.some(s => s.isVisible);

  // Dynamic Styles for Global Theme
  const dynamicStyles = {
    '--text-primary': textPrimaryColor[mode],
    '--text-secondary': textSecondaryColor[mode],
    '--theme-line': universalLineColor[mode],
    '--theme-icon': universalIconColor[mode],
    '--theme-highlight': universalIconColor[mode] // Legacy support
  };

  return (
    <div
      className="bg-theme-primary text-theme-primary transition-colors duration-500 overflow-x-hidden min-h-screen relative"
      style={dynamicStyles}
    >
      <IconPicker
        isOpen={iconPickerConfig.isOpen}
        onClose={() => setIconPickerConfig({ ...iconPickerConfig, isOpen: false })}
        onSelect={handleIconSelect}
        currentIcon={iconPickerConfig.currentIcon}
      />

      <UploadProgress uploads={uploads} />

      {isEditMode && (
        <div className="fixed bottom-8 right-8 z-[60]">
          <button onClick={handleGlobalSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-4 bg-green-500 text-white rounded-full font-bold shadow-2xl hover:bg-green-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
            {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      )}

      <Navigation
        scrolled={scrolled}
        handleNameClick={handleNameClick}
        optimizedProfileUrl={optimizedProfileUrl}
        navDisplayName={navDisplayName}
        scrollToSection={scrollToSection}
        workRef={workRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
        navWorkLabel={navWorkLabel}
        navAboutLabel={navAboutLabel}
        navContactLabel={navContactLabel}
        mode={mode}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isEditMode={isEditMode}
        textPrimaryColor={textPrimaryColor}
        setTextPrimaryColor={setTextPrimaryColor}
        textSecondaryColor={textSecondaryColor}
        setTextSecondaryColor={setTextSecondaryColor}
        universalLineColor={universalLineColor}
        setUniversalLineColor={setUniversalLineColor}
        universalIconColor={universalIconColor}
        setUniversalIconColor={setUniversalIconColor}
        lightModeEnabled={lightModeEnabled}
        setLightModeEnabled={setLightModeEnabled}
        darkModeEnabled={darkModeEnabled}
        setDarkModeEnabled={setDarkModeEnabled}
        navColorTop={navColorTop}
        setNavColorTop={setNavColorTop}
        navColorScrolled={navColorScrolled}
        setNavColorScrolled={setNavColorScrolled}
      />

      <HeroSection
        heroRef={heroRef}
        heroVisible={heroVisible}
        isEditMode={isEditMode}
        heroBgColor={heroBgColor}
        mode={mode}
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        currentBgUrl={currentBgUrl}
        setHeroVisible={setHeroVisible}
        setHeroBgColor={setHeroBgColor}
        handleStaticUpload={handleStaticUpload}
        heroTitle={heroTitle}
        setHeroTitle={setHeroTitle}
        heroSubtitle={heroSubtitle}
        setHeroSubtitle={setHeroSubtitle}
        scrollToSection={scrollToSection}
        workRef={workRef}
      />

      <main className="relative z-20 bg-theme-primary transition-colors duration-500">
        <AboutSection
          aboutRef={aboutRef}
          aboutVisible={aboutVisible}
          isEditMode={isEditMode}
          aboutBgColor={aboutBgColor}
          mode={mode}
          darkMode={darkMode}
          setAboutVisible={setAboutVisible}
          setAboutBgColor={setAboutBgColor}
          profileBgColor={profileBgColor}
          setProfileBgColor={setProfileBgColor}
          optimizedProfileUrl={optimizedProfileUrl}
          handleStaticUpload={handleStaticUpload}
          aboutName={aboutName}
          setAboutName={setAboutName}
          aboutText={aboutText}
          setAboutText={setAboutText}
          stats={stats}
          addStat={addStat}
          updateStat={updateStat}
          deleteStat={deleteStat}
          moveStat={moveStat}
          scrollToSection={scrollToSection}
          contactRef={contactRef}
          aboutButtonBg={aboutButtonBg}
          setAboutButtonBg={setAboutButtonBg}
          aboutButtonColor={aboutButtonColor}
          setAboutButtonColor={setAboutButtonColor}
          aboutButtonText={aboutButtonText}
          setAboutButtonText={setAboutButtonText}
        />

        {(experienceVisible || isEditMode) && (
          <div className="relative">
            {isEditMode && (
              <div className="absolute top-4 right-4 z-30">
                <button
                  onClick={() => setExperienceVisible(!experienceVisible)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border backdrop-blur-md transition-all ${experienceVisible ? 'bg-green-500/20 border-green-500/50 text-green-500' : 'bg-red-500/20 border-red-500/50 text-red-500'}`}
                >
                  <span className="text-[10px] font-bold uppercase">{experienceVisible ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            )}
            <div className={!experienceVisible ? 'opacity-50 grayscale' : ''}>
              <ExperienceSection
                isEditMode={isEditMode}
                data={experienceData}
                onChange={setExperienceData}
                mode={mode}
              />
            </div>
          </div>
        )}

        <GalleryArea
          workRef={workRef}
          hasVisibleGallery={hasVisibleGallery}
          isEditMode={isEditMode}
          galleryBgColor={galleryBgColor}
          mode={mode}
          darkMode={darkMode}
          setGalleryBgColor={setGalleryBgColor}
          galleryLineColor={galleryLineColor}
          addGallerySection={addGallerySection}
          gallerySections={gallerySections}
          setSelectedImage={setSelectedImage}
          updateGalleryImages={updateGalleryImages}
          updateGallerySection={updateGallerySection}
          moveGallerySection={moveGallerySection}
          deleteGallerySection={deleteGallerySection}
          updateUpload={updateUpload}
        />

        <VideoArea
          videoRef={videoRef}
          hasVisibleVideo={hasVisibleVideo}
          isEditMode={isEditMode}
          videoBgColor={videoBgColor}
          mode={mode}
          darkMode={darkMode}
          setVideoBgColor={setVideoBgColor}
          videoLineColor={videoLineColor}
          addVideoSection={addVideoSection}
          videoSections={videoSections}
          updateVideoItems={updateVideoItems}
          updateVideoSection={updateVideoSection}
          updateVideoDescription={updateVideoDescription}
          moveVideoSection={moveVideoSection}
          deleteVideoSection={deleteVideoSection}
          updateUpload={updateUpload}
        />

        <TwoThingsSection
          twoThingsVisible={twoThingsVisible}
          isEditMode={isEditMode}
          twoThingsBgColor={twoThingsBgColor}
          mode={mode}
          darkMode={darkMode}
          setTwoThingsVisible={setTwoThingsVisible}
          setTwoThingsBgColor={setTwoThingsBgColor}
          twoThingsLineColor={twoThingsLineColor}
          addPromiseItem={addPromiseItem}
          twoThingsSubtitle={twoThingsSubtitle}
          setTwoThingsTitle={setTwoThingsTitle}
          setTwoThingsSubtitle={setTwoThingsSubtitle}
          twoThingsTitle={twoThingsTitle}
          promiseItems={promiseItems}
          updatePromiseItem={updatePromiseItem}
          deletePromiseItem={deletePromiseItem}
          movePromiseItem={movePromiseItem}
        />

        <ContactSection
          contactRef={contactRef}
          contactVisible={contactVisible}
          isEditMode={isEditMode}
          contactBgColor={contactBgColor}
          mode={mode}
          darkMode={darkMode}
          setContactVisible={setContactVisible}
          setContactBgColor={setContactBgColor}
          contactTitle={contactTitle}
          setContactTitle={setContactTitle}
          contactTitleColor={contactTitleColor}
          setContactTitleColor={setContactTitleColor}
          contactText={contactText}
          setContactText={setContactText}
          contactTextColor={contactTextColor}
          setContactTextColor={setContactTextColor}
          contactButton={contactButton}
          setContactButton={setContactButton}
          contactButtonBg={contactButtonBg}
          setContactButtonBg={setContactButtonBg}
          contactButtonColor={contactButtonColor}
          setContactButtonColor={setContactButtonColor}
          contactButtonLink={contactButtonLink}
          setContactButtonLink={setContactButtonLink}
        />
      </main>

      <Footer
        isEditMode={isEditMode}
        footerBgColor={footerBgColor}
        mode={mode}
        darkMode={darkMode}
        setFooterBgColor={setFooterBgColor}
        footerName={footerName}
        setFooterName={setFooterName}
        footerText={footerText}
        setFooterText={setFooterText}
        copied={copied}
        setCopied={setCopied}
        footerNavTitle={footerNavTitle}
        setFooterNavTitle={setFooterNavTitle}
        scrollToSection={scrollToSection}
        workRef={workRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
        navWorkLabel={navWorkLabel}
        setNavWorkLabel={setNavWorkLabel}
        navAboutLabel={navAboutLabel}
        setNavAboutLabel={setNavAboutLabel}
        navContactLabel={navContactLabel}
        setNavContactLabel={setNavContactLabel}
        footerConnectTitle={footerConnectTitle}
        setFooterConnectTitle={setFooterConnectTitle}
        addConnectItem={addConnectItem}
        footerEmail={footerEmail}
        setFooterEmail={setFooterEmail}
        connectItems={connectItems}
        openIconPicker={openIconPicker}
        updateConnectItem={updateConnectItem}
        deleteConnectItem={deleteConnectItem}
        copyright={copyright}
        setCopyright={setCopyright}
      />

      <ImageModal
        src={selectedImage}
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        onNext={() => setSelectedImage(allAssets[(allAssets.indexOf(selectedImage) + 1) % allAssets.length])}
        onPrev={() => setSelectedImage(allAssets[(allAssets.indexOf(selectedImage) - 1 + allAssets.length) % allAssets.length])}
      />
    </div>
  );
}

export default Portfolio;
