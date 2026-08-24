import { useState } from 'react';

export const useBasicSectionsState = (parseMultiMode) => {
  // Hero
  const [heroTitle, setHeroTitle] = useState({ light: "", dark: "" });
  const [heroSubtitle, setHeroSubtitle] = useState({ light: "", dark: "" });
  const [heroBgColor, setHeroBgColor] = useState({ light: "transparent", dark: "transparent" });

  // About
  const [aboutName, setAboutName] = useState({ light: "", dark: "" });
  const [aboutText, setAboutText] = useState({ light: "", dark: "" });
  const [aboutButtonText, setAboutButtonText] = useState({ light: "Let's work together", dark: "Let's work together" });
  const [aboutButtonBg, setAboutButtonBg] = useState({ light: "#EAB308", dark: "#EAB308" });
  const [aboutButtonColor, setAboutButtonColor] = useState({ light: "#000000", dark: "#000000" });
  const [aboutBgColor, setAboutBgColor] = useState({ light: "transparent", dark: "transparent" });

  // Contact
  const [contactTitle, setContactTitle] = useState({ light: "", dark: "" });
  const [contactText, setContactText] = useState({ light: "", dark: "" });
  const [contactButton, setContactButton] = useState({ light: "", dark: "" });
  const [contactButtonBg, setContactButtonBg] = useState({ light: "#000000", dark: "#000000" });
  const [contactButtonColor, setContactButtonColor] = useState({ light: "#ffffff", dark: "#ffffff" });
  const [contactButtonLink, setContactButtonLink] = useState("");
  const [contactBgColor, setContactBgColor] = useState({ light: "#EAB308", dark: "#EAB308" });
  const [contactTitleColor, setContactTitleColor] = useState({ light: "#000000", dark: "#ffffff" });
  const [contactTextColor, setContactTextColor] = useState({ light: "#000000", dark: "#ffffff" });

  // Footer
  const [footerName, setFooterName] = useState({ light: "", dark: "" });
  const [footerText, setFooterText] = useState({ light: "", dark: "" });
  const [footerEmail, setFooterEmail] = useState({ light: "", dark: "" });
  const [footerNavTitle, setFooterNavTitle] = useState({ light: "Navigation", dark: "Navigation" });
  const [navWorkLabel, setNavWorkLabel] = useState({ light: "Work", dark: "Work" });
  const [navAboutLabel, setNavAboutLabel] = useState({ light: "About", dark: "About" });
  const [navContactLabel, setNavContactLabel] = useState({ light: "Contact", dark: "Contact" });
  const [footerConnectTitle, setFooterConnectTitle] = useState({ light: "Connect", dark: "Connect" });
  const [footerBgColor, setFooterBgColor] = useState({ light: "transparent", dark: "transparent" });
  const [copyright, setCopyright] = useState({ light: "", dark: "" });

  // Global Theme Colors
  const [textPrimaryColor, setTextPrimaryColor] = useState({ light: "#1E1E1E", dark: "#ffffff" });
  const [textSecondaryColor, setTextSecondaryColor] = useState({ light: "#4A4A4A", dark: "#A0A0A0" });
  const [universalLineColor, setUniversalLineColor] = useState({ light: "#EAB308", dark: "#EAB308" });
  const [universalIconColor, setUniversalIconColor] = useState({ light: "#EAB308", dark: "#EAB308" });

  // Navigation Colors
  const [navColorTop, setNavColorTop] = useState({ light: "#ffffff", dark: "#ffffff" });
  const [navColorScrolled, setNavColorScrolled] = useState({ light: "#1E1E1E", dark: "#ffffff" });

  // Common Theme helpers
  const updateMultiMode = (setter) => (newVal, mode) => {
    setter(prev => ({ ...prev, [mode]: newVal }));
  };

  return {
    heroTitle, setHeroTitle, heroSubtitle, setHeroSubtitle, heroBgColor, setHeroBgColor,
    aboutName, setAboutName, aboutText, setAboutText, aboutButtonText, setAboutButtonText, aboutButtonBg, setAboutButtonBg, aboutButtonColor, setAboutButtonColor, aboutBgColor, setAboutBgColor,
    contactTitle, setContactTitle, contactText, setContactText, contactButton, setContactButton, contactButtonBg, setContactButtonBg, contactButtonColor, setContactButtonColor, contactButtonLink, setContactButtonLink, contactBgColor, setContactBgColor, contactTitleColor, setContactTitleColor, contactTextColor, setContactTextColor,
    footerName, setFooterName, footerText, setFooterText, footerEmail, setFooterEmail, footerNavTitle, setFooterNavTitle, navWorkLabel, setNavWorkLabel, navAboutLabel, setNavAboutLabel, navContactLabel, setNavContactLabel, footerConnectTitle, setFooterConnectTitle, footerBgColor, setFooterBgColor, copyright, setCopyright,
    textPrimaryColor, setTextPrimaryColor, textSecondaryColor, setTextSecondaryColor, universalLineColor, setUniversalLineColor, universalIconColor, setUniversalIconColor,
    navColorTop, setNavColorTop, navColorScrolled, setNavColorScrolled,
    updateMultiMode
  };
};
