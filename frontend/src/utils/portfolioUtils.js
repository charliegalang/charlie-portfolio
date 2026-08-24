import * as LucideIcons from 'lucide-react';

export const ensureAbsoluteUrl = (url) => {
  if (!url || url === "#") return "#";
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:|#)/i.test(trimmed)) return trimmed;
  if (trimmed.includes("@") && !trimmed.includes("/"))
    return `mailto:${trimmed}`;
  return `https://${trimmed}`;
};

/**
 * Cloudinary Optimization Helper
 * f_auto: best format (WebP/AVIF)
 * q_auto: best quality balance
 */
export const getOptimizedUrl = (url, type = 'image', width = null) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  let transformations = 'f_auto,q_auto';
  if (width) transformations += `,w_${width},c_limit`;

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

export const getIconByName = (name) => {
  if (!name) return LucideIcons.Globe;
  return LucideIcons[name] || null;
};

export const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
