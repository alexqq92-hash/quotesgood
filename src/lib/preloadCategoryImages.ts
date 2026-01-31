import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import { ImageSourcePropType } from 'react-native';
import { AffirmationCategory } from '@/data/affirmations';
import { backgroundImages } from './background-store';

// Map of category images - same as in categories.tsx
export const CATEGORY_IMAGES: Record<AffirmationCategory, ImageSourcePropType | null> = {
  'self-love': require('../../public/gemini-generated-image-ygaa1xygaa1xygaa.png'),
  'good-vibes': require('../../public/gemini-generated-image-x7ydk6x7ydk6x7yd.png'),
  'abundance': require('../../public/gemini-generated-image-696ebh696ebh696e.png'),
  'law-of-attraction': require('../../public/gemini-generated-image-1erxli1erxli1erx.png'),
  'gratitude': require('../../public/gemini-generated-image-oohu5hoohu5hoohu.png'),
  'glow-up': require('../../public/gemini-generated-image-j4g55lj4g55lj4g5.png'),
  'blessings': null,
  'spirituality': require('../../public/gemini-generated-image-y6ln24y6ln24y6ln.png'),
  'healing': require('../../public/gemini-generated-image-ackkzgackkzgackk.png'),
  'feminine-energy': require('../../public/gemini-generated-image-a521cpa521cpa521.png'),
  'masculine-energy': require('../../public/gemini-generated-image-auynjhauynjhauyn.png'),
  'love-and-family': require('../../public/gemini-generated-image-esvn43esvn43esvn.png'),
  'stress-and-anxiety': require('../../public/gemini-generated-image-cv8tkycv8tkycv8t-1.png'),
  'general': require('../../public/whatsapp-image-2026-01-27-at-22-2.jpeg'),
  'friendship': require('../../public/gemini-generated-image-7g60i77g60i77g60-1.png'),
  'business': require('../../public/gemini-generated-image-bnzc49bnzc49bnzc.png'),
  'motherhood': require('../../public/gemini-generated-image-ur82rxur82rxur82.png'),
  'heartbreak': null,
  'fatherhood': null,
  'students': null,
};

// Get category image assets
function getCategoryImageAssets(): number[] {
  const assets: number[] = [];
  for (const key of Object.keys(CATEGORY_IMAGES) as AffirmationCategory[]) {
    const image = CATEGORY_IMAGES[key];
    if (image !== null && typeof image === 'number') {
      assets.push(image);
    }
  }
  return assets;
}

// Get background image assets from background-store
function getBackgroundImageAssets(): number[] {
  const assets: number[] = [];
  for (const bg of backgroundImages) {
    if (typeof bg.image === 'number') {
      assets.push(bg.image);
    }
  }
  return assets;
}

// Preload assets using expo-image's prefetch for instant display
async function prefetchImages(assets: number[]): Promise<void> {
  // First resolve assets to get URIs
  const uris: string[] = [];

  for (const asset of assets) {
    const resolved = Asset.fromModule(asset);
    await resolved.downloadAsync();
    if (resolved.localUri) {
      uris.push(resolved.localUri);
    } else if (resolved.uri) {
      uris.push(resolved.uri);
    }
  }

  // Prefetch all URIs into expo-image cache
  if (uris.length > 0) {
    await Image.prefetch(uris);
  }
}

// Preload all images (backgrounds first for priority, then categories)
export async function preloadCategoryImages(): Promise<void> {
  try {
    // Load background images first (used on main screen)
    const backgroundAssets = getBackgroundImageAssets();
    await prefetchImages(backgroundAssets);

    // Then load category images
    const categoryAssets = getCategoryImageAssets();
    await prefetchImages(categoryAssets);
  } catch (error) {
    console.warn('Error preloading images:', error);
  }
}
