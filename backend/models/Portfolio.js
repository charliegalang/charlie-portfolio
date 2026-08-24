import mongoose from 'mongoose';

const ResponsibilitySchema = new mongoose.Schema({
  id: String,
  text: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } }
});

const WorkSchema = new mongoose.Schema({
  id: String,
  title: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  company: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  period: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  type: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  responsibilities: [ResponsibilitySchema],
  bgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } }
});

const EducationItemSchema = new mongoose.Schema({
  id: String,
  degree: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  school: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  period: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  bgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } }
});

const GalleryImageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  version: Number,
  resource_type: { type: String, default: 'image' },
  description: { type: String, default: '' }
});

const GallerySectionSchema = new mongoose.Schema({
  id: String,
  categoryId: String,
  title: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  subtitle: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  images: [GalleryImageSchema],
  isVisible: { type: Boolean, default: true }
});

const VideoItemSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  version: Number,
  resource_type: { type: String, default: 'video' },
  description: { type: String, default: '' }
});

const VideoSectionSchema = new mongoose.Schema({
  id: String,
  categoryId: String,
  title: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  subtitle: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  videos: [VideoItemSchema],
  isVisible: { type: Boolean, default: true }
});

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  heroTitle: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  heroSubtitle: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  bgUrl: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  bgId: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  bgUrlMobile: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  bgIdMobile: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  bgFit: { type: mongoose.Schema.Types.Mixed, default: { light: 'cover', dark: 'cover' } },
  heroBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
  heroVisible: { type: Boolean, default: true },

  aboutName: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  aboutText: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  aboutBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
  aboutButtonText: { type: mongoose.Schema.Types.Mixed, default: { light: "Let's work together", dark: "Let's work together" } },
  aboutButtonBg: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  aboutButtonColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#000000', dark: '#000000' } },
  aboutVisible: { type: Boolean, default: true },
  profileUrl: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  profileId: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  profileBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  stats: [{
    id: String,
    n: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
    l: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } }
  }],

  experienceData: {
    headerTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Professional Experience', dark: 'Professional Experience' } },
    headerIcon: { type: String, default: 'Briefcase' },
    headerIconColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
    professionalSummaryTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Professional Summary', dark: 'Professional Summary' } },
    summary: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
    summaryBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
    workHistoryTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Work History', dark: 'Work History' } },
    workHistoryLineColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
    work: [WorkSchema],
    experienceBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
    headerBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
    educationTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Education', dark: 'Education' } },
    educationList: [EducationItemSchema],
    isLocked: { type: Boolean, default: false }
  },
  experienceVisible: { type: Boolean, default: true },

  videos: [VideoItemSchema],
  videoTitle: { type: String, default: 'Featured Videos' },
  videoSubtitle: { type: String, default: '' },
  videoBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
  videoLineColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  videoSections: [VideoSectionSchema],
  videoVisible: { type: Boolean, default: true },

  gallerySections: [GallerySectionSchema],
  galleryBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
  galleryLineColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  galleryVisible: { type: Boolean, default: true },

  twoThingsTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Two Things', dark: 'Two Things' } },
  twoThingsSubtitle: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  twoThingsBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
  twoThingsLineColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  twoThingsVisible: { type: Boolean, default: true },
  promiseItems: [{
    id: String,
    n: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
    t: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
    d: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } }
  }],

  contactTitle: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  contactTitleColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#000000', dark: '#ffffff' } },
  contactTextColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#000000', dark: '#ffffff' } },
  contactText: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  contactButton: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  contactButtonBg: { type: mongoose.Schema.Types.Mixed, default: { light: '#000000', dark: '#000000' } },
  contactButtonColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#ffffff', dark: '#ffffff' } },
  contactButtonLink: { type: String, default: '' },
  contactBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  contactVisible: { type: Boolean, default: true },

  footerName: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  footerText: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  footerEmail: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
  footerBgColor: { type: mongoose.Schema.Types.Mixed, default: { light: 'transparent', dark: 'transparent' } },
  footerNavTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Navigation', dark: 'Navigation' } },
  navWorkLabel: { type: mongoose.Schema.Types.Mixed, default: { light: 'Work', dark: 'Work' } },
  navAboutLabel: { type: mongoose.Schema.Types.Mixed, default: { light: 'About', dark: 'About' } },
  navContactLabel: { type: mongoose.Schema.Types.Mixed, default: { light: 'Contact', dark: 'Contact' } },
  footerConnectTitle: { type: mongoose.Schema.Types.Mixed, default: { light: 'Connect', dark: 'Connect' } },
  connectItems: [{
    id: String,
    name: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },
    url: String,
    icon: { type: String, default: 'Globe' },
    color: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } }
  }],
  copyright: { type: mongoose.Schema.Types.Mixed, default: { light: '', dark: '' } },

  textPrimaryColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#1E1E1E', dark: '#ffffff' } },
  textSecondaryColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#4A4A4A', dark: '#A0A0A0' } },
  universalLineColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },
  universalIconColor: { type: mongoose.Schema.Types.Mixed, default: { light: '#EAB308', dark: '#EAB308' } },

  navColorTop: { type: mongoose.Schema.Types.Mixed, default: { light: '#ffffff', dark: '#ffffff' } },
  navColorScrolled: { type: mongoose.Schema.Types.Mixed, default: { light: '#1E1E1E', dark: '#ffffff' } },

  lightModeEnabled: { type: Boolean, default: true },
  darkModeEnabled: { type: Boolean, default: true }

}, { timestamps: true, strict: false });

export default mongoose.model('Portfolio', PortfolioSchema);
