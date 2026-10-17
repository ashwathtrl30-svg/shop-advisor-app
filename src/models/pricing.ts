// Pricing structure - ready for future paid plans
// Currently all features are free

export interface PricingPlan {
  id: string;
  name: { en: string; hi: string };
  price: number; // Monthly price in INR, 0 = free
  features: { en: string[]; hi: string[] };
  isActive: boolean;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: {
      en: 'Free Plan',
      hi: 'फ्री प्लान'
    },
    price: 0,
    features: {
      en: [
        'Track sales, expenses, and udhaar',
        'Get smart insights and tips',
        '12 business tools',
        '10 lessons in Hindi and English',
        'Offline support',
        'Data export and backup',
        'No ads, ever'
      ],
      hi: [
        'बिक्री, खर्चा, उधार ट्रैक करें',
        'स्मार्ट सलाह और टिप्स पाएं',
        '12 बिज़नेस टूल्स',
        '10 पाठ हिंदी और अंग्रेज़ी में',
        'ऑफ़लाइन सपोर्ट',
        'डेटा एक्सपोर्ट और बैकअप',
        'कोई विज्ञापन नहीं, कभी नहीं'
      ]
    },
    isActive: true
  },
  // Future paid plans can be added here
  // {
  //   id: 'pro',
  //   name: {
  //     en: 'Pro Plan',
  //     hi: 'प्रो प्लान'
  //   },
  //   price: 199,
  //   features: {
  //     en: [
  //       'Everything in Free',
  //       'Advanced analytics',
  //       'Multi-device sync',
  //       'Priority support',
  //       'Custom reports'
  //     ],
  //     hi: [
  //       'फ्री की सब कुछ',
  //       'एडवांस्ड एनालिटिक्स',
  //       'मल्टी-डिवाइस सिंक',
  //       'प्रायोरिटी सपोर्ट',
  //       'कस्टम रिपोर्ट्स'
  //     ]
  //   },
  //   isActive: false
  // }
];

export function getCurrentPlan(): PricingPlan {
  // Currently always returns free plan
  // In future, this would check user's subscription status
  return pricingPlans.find(p => p.id === 'free')!;
}

export function isFeatureAvailable(featureId: string): boolean {
  const currentPlan = getCurrentPlan();
  
  // All features are available in free plan for now
  // In future, check if feature is included in current plan
  const freeFeatures = [
    'sales-tracking',
    'expense-tracking',
    'udhaar-tracking',
    'insights',
    'tools',
    'lessons',
    'voice-input',
    'offline-support',
    'data-export',
    'no-ads'
  ];
  
  return freeFeatures.includes(featureId);
}
