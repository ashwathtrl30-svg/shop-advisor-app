// Community-lite: Anonymous aggregated benchmarks
// All data is hypothetical/illustrative. Clearly marked as estimates.

import { Language } from '../i18n/translations';

export interface Benchmark {
  id: string;
  title: { en: string; hi: string };
  value: string;
  description: { en: string; hi: string };
  emoji: string;
  shopTypes: string[];
  minDataPoints: number; // Minimum data needed to show
}

// These are illustrative estimates based on typical Indian small shop patterns
// In a real app, these would come from aggregated user data
export const benchmarks: Benchmark[] = [
  {
    id: 'electricity-cost',
    title: {
      en: 'Electricity cost',
      hi: 'बिजली का खर्चा',
    },
    value: '8-12%',
    description: {
      en: 'Shops like yours in your city usually spend 8-12% of sales on electricity.',
      hi: 'आपके शहर में आपकी जैसी दुकानें आमतौर पर बिक्री का 8-12% बिजली पर खर्च करती हैं।',
    },
    emoji: '💡',
    shopTypes: ['kirana', 'medical', 'bakery', 'restaurant'],
    minDataPoints: 50,
  },
  {
    id: 'profit-margin',
    title: {
      en: 'Typical profit margin',
      hi: 'आम मुनाफ़ा',
    },
    value: '15-25%',
    description: {
      en: 'Similar shops usually keep 15-25% profit on sales.',
      hi: 'ऐसी दुकानें आमतौर पर बिक्री पर 15-25% मुनाफ़ा रखती हैं।',
    },
    emoji: '💰',
    shopTypes: ['all'],
    minDataPoints: 100,
  },
  {
    id: 'udhaar-ratio',
    title: {
      en: 'Udhaar levels',
      hi: 'उधार का स्तर',
    },
    value: '10-20%',
    description: {
      en: 'Most shops keep udhaar at 10-20% of monthly sales.',
      hi: 'ज़्यादातर दुकानें उधार मंथली बिक्री के 10-20% तक रखती हैं।',
    },
    emoji: '📒',
    shopTypes: ['all'],
    minDataPoints: 75,
  },
  {
    id: 'daily-sales',
    title: {
      en: 'Daily sales range',
      hi: 'रोज़ की बिक्री',
    },
    value: '₹3,000-₹8,000',
    description: {
      en: 'Shops of your size in your area usually sell ₹3,000-₹8,000 daily.',
      hi: 'आपके क्षेत्र में आपकी आकार की दुकानें आमतौर पर रोज़ ₹3,000-₹8,000 बेचती हैं।',
    },
    emoji: '📊',
    shopTypes: ['kirana', 'vegetable', 'medical'],
    minDataPoints: 60,
  },
  {
    id: 'stock-turnover',
    title: {
      en: 'Stock turnover',
      hi: 'सामान बिकने का समय',
    },
    value: '2-3 weeks',
    description: {
      en: 'Similar shops usually sell their stock in 2-3 weeks.',
      hi: 'ऐसी दुकानें आमतौर पर अपना सामान 2-3 हफ्ते में बेच देती हैं।',
    },
    emoji: '📦',
    shopTypes: ['kirana', 'medical', 'bakery'],
    minDataPoints: 40,
  },
  {
    id: 'wastage',
    title: {
      en: 'Wastage levels',
      hi: 'बर्बादी का स्तर',
    },
    value: '2-5%',
    description: {
      en: 'Well-run shops waste only 2-5% of stock.',
      hi: 'अच्छी चलने वाली दुकानें सिर्फ 2-5% सामान बर्बाद करती हैं।',
    },
    emoji: '🗑️',
    shopTypes: ['kirana', 'vegetable', 'bakery', 'sweet'],
    minDataPoints: 30,
  },
];

// Check if we have enough data to show benchmarks
export function canShowBenchmarks(dataPoints: number): boolean {
  // In a real app, this would check actual aggregated data
  // For demo, we show them after user has some data
  return dataPoints >= 7; // 7 days of data
}

// Get benchmarks relevant to shop type
export function getBenchmarksForShop(shopType?: string): Benchmark[] {
  return benchmarks.filter(b => 
    b.shopTypes.includes('all') || b.shopTypes.includes(shopType || '')
  );
}
