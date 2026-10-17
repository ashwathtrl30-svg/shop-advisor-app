// Lessons data and structure

import { Language } from '../i18n/translations';

export interface Lesson {
  id: string;
  topic: LessonTopic;
  title: { en: string; hi: string };
  emoji: string;
  durationMinutes: number;
  content: { en: string[]; hi: string[] }; // Array of slides
  action: string; // Tool ID to link to
  quiz?: Quiz;
  relevantShopTypes: string[]; // 'all' or specific types
}

export type LessonTopic = 
  | 'pricing'
  | 'profit-vs-sales'
  | 'udhaar'
  | 'waste'
  | 'festivals'
  | 'upi'
  | 'records'
  | 'customers'
  | 'gst'
  | 'savings';

export interface Quiz {
  question: { en: string; hi: string };
  options: { en: string[]; hi: string[] };
  correctIndex: number;
}

export interface LessonProgress {
  completed: string[]; // Lesson IDs
  quizScores: Record<string, number>; // lessonId -> score
  lastLessonDate: string;
  streak: number;
}

// All lessons
export const lessons: Lesson[] = [
  {
    id: 'profit-vs-sales',
    topic: 'profit-vs-sales',
    title: {
      en: 'Profit vs Sales: What\'s the difference?',
      hi: 'मुनाफ़ा और बिक्री में क्या फ़र्क है?',
    },
    emoji: '💰',
    durationMinutes: 2,
    content: {
      en: [
        'Sales is the total money customers pay you. Profit is what you keep after expenses.',
        'Example: You sell ₹100 of goods. You paid ₹70 to buy them. Your profit is ₹30.',
        'High sales but low profit means your costs are too high. Check expenses regularly.',
        'Rule of thumb: Most small shops keep 15-25% profit. If yours is lower, look for savings.',
      ],
      hi: [
        'बिक्री वो पैसा है जो ग्राहक देते हैं। मुनाफ़ा वो है जो खर्चे के बाद बचता है।',
        'उदाहरण: ₹100 का सामान बेचा। खरीदने में ₹70 लगे। मुनाफ़ा ₹30।',
        'ज़्यादा बिक्री पर कम मुनाफ़ा = खर्चे ज़्यादा हैं। खर्चे चेक करते रहें।',
        'आम नियम: छोटी दुकानें 15-25% मुनाफ़ा रखती हैं। कम है तो बचत ढूंढें।',
      ],
    },
    action: 'profit-calc',
    relevantShopTypes: ['all'],
    quiz: {
      question: {
        en: 'You sell ₹500 of goods. Cost was ₹400. What is your profit?',
        hi: '₹500 का सामान बेचा। खर्चा ₹400। मुनाफ़ा कितना?',
      },
      options: {
        en: ['₹500', '₹400', '₹100', '₹50'],
        hi: ['₹500', '₹400', '₹100', '₹50'],
      },
      correctIndex: 2,
    },
  },
  {
    id: 'pricing-basics',
    topic: 'pricing',
    title: {
      en: 'How to set the right price',
      hi: 'सही कीमत कैसे तय करें',
    },
    emoji: '🏷️',
    durationMinutes: 2,
    content: {
      en: [
        'Price = Cost + Profit you want. Never price below your cost!',
        'Check what nearby shops charge. Too high = no customers. Too low = no profit.',
        'For fast-selling items, keep small profit but sell more. For rare items, higher profit is okay.',
        'Review prices monthly. If costs go up, prices must go up too.',
      ],
      hi: [
        'कीमत = खर्चा + मुनाफ़ा। कभी भी खर्चे से कम में मत बेचो!',
        'आस-पास की दुकानों की कीमत देखो। बहुत ज़्यादा = ग्राहक नहीं। बहुत कम = मुनाफ़ा नहीं।',
        'ज़्यादा बिकने वाली चीज़ पर कम मुनाफ़ा, ज़्यादा बेचो। कम बिकने वाली पर ज़्यादा मुनाफ़ा।',
        'हर महीने कीमत चेक करो। खर्चा बढ़े तो कीमत भी बढ़ाओ।',
      ],
    },
    action: 'price-setter',
    relevantShopTypes: ['all'],
    quiz: {
      question: {
        en: 'Cost is ₹50. You want 20% profit. What price?',
        hi: 'खर्चा ₹50। 20% मुनाफ़ा चाहिए। कीमत क्या?',
      },
      options: {
        en: ['₹50', '₹55', '₹60', '₹70'],
        hi: ['₹50', '₹55', '₹60', '₹70'],
      },
      correctIndex: 2,
    },
  },
  {
    id: 'udhaar-management',
    topic: 'udhaar',
    title: {
      en: 'Handling udhaar safely',
      hi: 'उधार सुरक्षित कैसे दें',
    },
    emoji: '📒',
    durationMinutes: 2,
    content: {
      en: [
        'Udhaar is money you may never get back. Keep it under 20% of monthly sales.',
        'Write down every udhaar: who, how much, when promised. Use the Udhaar Tracker tool.',
        'Politely remind customers on the promised date. A WhatsApp message works well.',
        'If someone delays repeatedly, stop giving udhaar. It\'s your money, not a favor.',
      ],
      hi: [
        'उधार वो पैसा है जो शायद वापस ना मिले। मंथली बिक्री के 20% से कम रखो।',
        'हर उधार लिखो: कौन, कितना, कब वापसी। Udhaar Tracker टूल यूज़ करो।',
        'वादे की तारीख पर विनम्रता से याद दिलाओ। WhatsApp मैसेज अच्छा काम करता है।',
        'बार-बार देरी हो तो उधार बंद करो। ये तुम्हारा पैसा है, एहसान नहीं।',
      ],
    },
    action: 'udhaar-tracker',
    relevantShopTypes: ['all'],
    quiz: {
      question: {
        en: 'Monthly sales ₹50,000. Safe udhaar limit?',
        hi: 'मंथली बिक्री ₹50,000। सुरक्षित उधार सीमा?',
      },
      options: {
        en: ['₹5,000', '₹10,000', '₹25,000', '₹50,000'],
        hi: ['₹5,000', '₹10,000', '₹25,000', '₹50,000'],
      },
      correctIndex: 1,
    },
  },
  {
    id: 'reducing-waste',
    topic: 'waste',
    title: {
      en: 'Reducing waste and expiry losses',
      hi: 'बर्बादी और एक्सपायरी का नुकसान कम करें',
    },
    emoji: '🗑️',
    durationMinutes: 2,
    content: {
      en: [
        'Track what goes to waste each week. Even ₹100/day = ₹3,000/month lost.',
        'Order smaller quantities more often. Better to reorder than to waste.',
        'For perishables: check expiry dates weekly. Sell older stock first.',
        'Offer discounts on items close to expiry. Better to sell cheap than throw away.',
      ],
      hi: [
        'हर हफ्ते क्या बर्बाद हुआ ट्रैक करो। ₹100/दिन भी = ₹3,000/महीना नुकसान।',
        'कम मात्रा में बार-बार मंगाओ। फिर से मंगाना बेहतर है बर्बाद करने से।',
        'खराब होने वाली चीज़ें: हर हफ्ते एक्सपायरी चेक करो। पुराना पहले बेचो।',
        'एक्सपायरी के करीब सामान पर छूट दो। सस्ते में बेचना फेंकने से बेहतर।',
      ],
    },
    action: 'stock-reorder',
    relevantShopTypes: ['kirana', 'medical', 'bakery', 'sweet', 'vegetable'],
  },
  {
    id: 'festival-planning',
    topic: 'festivals',
    title: {
      en: 'Festival planning for bigger sales',
      hi: 'त्योहारों पर ज़्यादा बिक्री की तैयारी',
    },
    emoji: '🎉',
    durationMinutes: 2,
    content: {
      en: [
        'Festivals = 2-3x normal sales. Plan 1 month before.',
        'Stock popular items: sweets, gifts, decorations based on your shop type.',
        'Keep extra cash for purchases. Customers pay in cash during festivals.',
        'Display festival items at the front. Bright lights and decorations attract buyers.',
      ],
      hi: [
        'त्योहार = 2-3 गुना बिक्री। 1 महीने पहले तैयारी करो।',
        'लोकप्रिय सामान स्टॉक करो: मिठाई, गिफ्ट, सजावट — अपनी दुकान के हिसाब से।',
        'खरीदारी के लिए अतिरिक्त कैश रखो। त्योहार पर ग्राहक नकद देते हैं।',
        'त्योहार का सामान आगे रखो। तेज़ रोशनी और सजावट ग्राहक खींचती है।',
      ],
    },
    action: 'festival-planner',
    relevantShopTypes: ['kirana', 'bakery', 'sweet', 'vegetable'],
  },
  {
    id: 'upi-basics',
    topic: 'upi',
    title: {
      en: 'Using UPI and QR codes',
      hi: 'UPI और QR कोड का उपयोग',
    },
    emoji: '📱',
    durationMinutes: 2,
    content: {
      en: [
        'UPI lets customers pay directly to your bank. No cash needed.',
        'Get a QR code from PhonePe, Paytm, or Google Pay. It\'s free.',
        'Print and stick QR at counter. Customers scan and pay in 5 seconds.',
        'Check payments daily. UPI is safe — money goes directly to your bank.',
      ],
      hi: [
        'UPI से ग्राहक सीधे आपके बैंक में पैसा भेजते हैं। नकद की ज़रूरत नहीं।',
        'PhonePe, Paytm, या Google Pay से QR कोड लो। बिल्कुल फ्री।',
        'QR प्रिंट करके काउंटर पर चिपकाओ। ग्राहक 5 सेकंड में स्कैन करके पेमेंट करते हैं।',
        'रोज़ पेमेंट चेक करो। UPI सुरक्षित है — पैसा सीधे बैंक में आता है।',
      ],
    },
    action: 'digital-payments',
    relevantShopTypes: ['all'],
  },
  {
    id: 'simple-records',
    topic: 'records',
    title: {
      en: 'Simple record-keeping',
      hi: 'आसान हिसाब रखना',
    },
    emoji: '📝',
    durationMinutes: 2,
    content: {
      en: [
        'Write down every sale and expense daily. Takes 2 minutes.',
        'At day end, total sales - total expenses = profit. Simple.',
        'Keep a separate notebook for udhaar: who, how much, when due.',
        'Review weekly: Which day was best? Which item sold most? What wasted?',
      ],
      hi: [
        'रोज़ हर बिक्री और खर्चा लिखो। 2 मिनट लगते हैं।',
        'दिन के अंत में, कुल बिक्री - कुल खर्चा = मुनाफ़ा। बस।',
        'उधार के लिए अलग कॉपी रखो: कौन, कितना, कब वापसी।',
        'हर हफ्ते देखो: कौन सा दिन सबसे अच्छा? कौन सा सामान ज़्यादा बिका? क्या बर्बाद हुआ?',
      ],
    },
    action: 'break-even',
    relevantShopTypes: ['all'],
  },
  {
    id: 'customer-relationships',
    topic: 'customers',
    title: {
      en: 'Building customer relationships',
      hi: 'ग्राहकों से रिश्ता बनाना',
    },
    emoji: '🤝',
    durationMinutes: 2,
    content: {
      en: [
        'Remember regular customers by name. A smile brings them back.',
        'Offer small discounts to loyal customers. 5% off keeps them coming.',
        'Handle complaints calmly. A happy customer tells 10 friends.',
        'Ask what they need. Stock what they ask for. They\'ll become regular.',
      ],
      hi: [
        'नियमित ग्राहकों को नाम से पहचानो। मुस्कान उन्हें वापस लाती है।',
        'वफ़ादार ग्राहकों को छोटी छूट दो। 5% छूट उन्हें वापस लाती है।',
        'शिकायतें शांति से सुनो। खुश ग्राहक 10 दोस्तों को बताता है।',
        'पूछो उन्हें क्या चाहिए। वो जो मांगें वो स्टॉक करो। वो नियमित बन जाएंगे।',
      ],
    },
    action: 'profit-calc',
    relevantShopTypes: ['all'],
  },
  {
    id: 'gst-basics',
    topic: 'gst',
    title: {
      en: 'GST basics for small shops',
      hi: 'छोटी दुकानों के लिए GST की जानकारी',
    },
    emoji: '📋',
    durationMinutes: 2,
    content: {
      en: [
        'GST is a tax on sales. Small shops may not need it yet.',
        'If yearly sales are below ₹40 lakh (₹20 lakh in some states), GST registration is optional.',
        'Even if not registered, keep proper bills. It helps with loans and records.',
        '⚠️ For exact rules, consult a CA or visit gst.gov.in. Rules change.',
      ],
      hi: [
        'GST बिक्री पर टैक्स है। छोटी दुकानों को अभी शायद ज़रूरत नहीं।',
        'सालाना बिक्री ₹40 लाख से कम (कुछ राज्यों में ₹20 लाख) तो GST रजिस्ट्रेशन वैकल्पिक।',
        'रजिस्टर्ड ना हो तो भी बिल रखो। लोन और हिसाब में मदद करता है।',
        '⚠️ सही नियमों के लिए CA से बात करें या gst.gov.in देखें। नियम बदलते हैं।',
      ],
    },
    action: 'monthly-cost',
    relevantShopTypes: ['all'],
  },
  {
    id: 'savings-basics',
    topic: 'savings',
    title: {
      en: 'Saving from a small business',
      hi: 'छोटे व्यवसाय से बचत करना',
    },
    emoji: '🏦',
    durationMinutes: 2,
    content: {
      en: [
        'Pay yourself first. Set aside 10% of profit every month.',
        'Open a separate savings account. Don\'t mix business and personal money.',
        'Small amounts add up. ₹500/month = ₹6,000/year.',
        'For emergencies, keep 3 months of expenses saved. Start small, grow slowly.',
      ],
      hi: [
        'पहले खुद को भुगतान। हर महीने मुनाफ़े का 10% अलग रखो।',
        'अलग बचत खाता खोलो। व्यवसाय और निजी पैसा मिलाओ मत।',
        'छोटी रकम भी जुड़ती है। ₹500/महीना = ₹6,000/साल।',
        'आपातकाल के लिए 3 महीने का खर्चा बचाओ। छोटे से शुरू करो, धीरे-धीरे बढ़ाओ।',
      ],
    },
    action: 'savings-goal',
    relevantShopTypes: ['all'],
  },
];

// Get lesson of the day (rotates daily)
export function getLessonOfDay(
  profile: { shopType?: string },
  completedIds: string[]
): Lesson | null {
  const today = new Date();
  const dayIndex = today.getDate() + today.getMonth() * 31;
  
  // Filter relevant lessons
  const relevant = lessons.filter(l => 
    l.relevantShopTypes.includes('all') || 
    l.relevantShopTypes.includes(profile.shopType || '')
  );
  
  // Remove completed
  const available = relevant.filter(l => !completedIds.includes(l.id));
  const pool = available.length > 0 ? available : relevant;
  
  return pool[dayIndex % pool.length];
}

// Get lessons sorted by relevance to shop type
export function getLessonsForShop(shopType?: string): Lesson[] {
  return [...lessons].sort((a, b) => {
    const aRelevant = a.relevantShopTypes.includes('all') || a.relevantShopTypes.includes(shopType || '');
    const bRelevant = b.relevantShopTypes.includes('all') || b.relevantShopTypes.includes(shopType || '');
    if (aRelevant && !bRelevant) return -1;
    if (!aRelevant && bRelevant) return 1;
    return 0;
  });
}
