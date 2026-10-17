// Language system - extensible for future languages
export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Language Screen
    languageTitle: 'Choose Your Language',
    english: 'English',
    hindi: 'हिंदी',
    
    // Welcome Screen
    welcomeTitle: 'Your Shop\'s Smart Helper',
    welcomeSubtitle: 'Tell me about your shop in 2 minutes. Ask me anything. I\'ll help you earn more and spend less.',
    startButton: 'Start',
    
    // Phone Login
    phoneTitle: 'Enter Your Phone Number',
    phoneSubtitle: 'We need your number to save your shop data safely. No spam, no calls.',
    phonePlaceholder: '10-digit mobile number',
    sendOTP: 'Send Code',
    otpTitle: 'Enter the Code',
    otpSubtitle: 'We sent a 6-digit code to',
    otpPlaceholder: '6-digit code',
    verifyOTP: 'Verify',
    resendOTP: 'Resend Code',
    changeNumber: 'Change Number',
    
    // Progress
    of: 'of',
    back: 'Back',
    skip: 'Skip',
    next: 'Next',
    
    // Interview Questions
    q1Title: 'What kind of shop do you have?',
    q2Title: 'What is your shop\'s name?',
    q2Subtitle: 'Optional — you can skip this',
    q2Placeholder: 'Shop name',
    q3Title: 'Which city or town?',
    q3Subtitle: 'We detected your location',
    q3Confirm: 'Yes, this is correct',
    q3Change: 'Change location',
    q3Placeholder: 'City or town name',
    q4Title: 'How long have you been running this shop?',
    q5Title: 'Do you own or rent the shop?',
    q6Title: 'How many people work here, including you?',
    q7Title: 'Roughly how much does the shop sell in a normal month?',
    q8Title: 'Do you give things on credit (udhaar)?',
    q9Title: 'How do you keep accounts now?',
    q10Title: 'What worries you most?',
    q10Subtitle: 'Select all that apply',
    
    // Shop Types
    shopKirana: 'Kirana / General Store',
    shopMedical: 'Medical Store',
    shopBakery: 'Bakery',
    shopSweet: 'Sweet Shop',
    shopVegetable: 'Vegetable & Fruit',
    shopTea: 'Tea Stall',
    shopRestaurant: 'Small Restaurant',
    shopSalon: 'Salon / Barber',
    shopTailor: 'Tailor',
    shopHardware: 'Hardware',
    shopMobile: 'Mobile Shop',
    shopOther: 'Other',
    
    // Duration Options
    durUnder1: 'Less than 1 year',
    dur1to5: '1 to 5 years',
    dur5to10: '5 to 10 years',
    durOver10: 'More than 10 years',
    
    // Ownership Options
    ownOwn: 'I own it',
    ownRent: 'I rent it',
    
    // People Count
    people1: 'Just me',
    people2to3: '2 to 3 people',
    people4to5: '4 to 5 people',
    people6plus: '6 or more',
    
    // Monthly Sales
    salesUnder50k: 'Less than ₹50,000',
    sales50kTo1L: '₹50,000 to ₹1,00,000',
    sales1LTo3L: '₹1,00,000 to ₹3,00,000',
    sales3LTo5L: '₹3,00,000 to ₹5,00,000',
    salesOver5L: 'More than ₹5,00,000',
    
    // Credit Options
    creditNever: 'Never',
    creditSometimes: 'Sometimes',
    creditOften: 'Often',
    
    // Accounts Options
    accMemory: 'I remember everything',
    accNotebook: 'Notebook or register',
    accApp: 'Another app',
    accNothing: 'Nothing',
    
    // Worries
    worryLowProfit: 'Low profit',
    worryTooMuchStock: 'Too much stock',
    worryNotPaying: 'Customers not paying',
    worryRisingCosts: 'Rising costs',
    worryCompetition: 'Competition',
    worryNoTime: 'No time',
    worryDontKnow: 'Don\'t know',
    
    // Profile Summary
    profileTitle: 'Your Shop Profile',
    profileSubtitle: 'You can change any answer by tapping it',
    profileEdit: 'Tap to change',
    profileDone: 'Looks Good',
    
    // Welcome Tour
    tour1Title: 'Track Your Day',
    tour1Desc: 'Add today\'s sales and expenses in 10 seconds. I\'ll show you how your shop is doing.',
    tour2Title: 'Ask Anything',
    tour2Desc: 'Ask me questions in your own words. I\'ll give simple answers based on your shop\'s data.',
    tour3Title: 'Learn & Grow',
    tour3Desc: 'Short lessons to help your shop grow. 2 minutes each. No jargon.',
    tourSkip: 'Skip Tour',
    tourNext: 'Next',
    tourFinish: 'Let\'s Go!',
    
    // Home
    homeGreeting: 'Namaste',
    homeTodaySales: 'Today\'s Sales',
    homeExpenses: 'Expenses',
    homeProfit: 'Profit',
    homeSmartTip: 'Smart Tip',
    homeAddNumbers: 'Add Today\'s Numbers',
    homeVoice: 'Or tell me by voice',
    homeMoreThanYesterday: 'more than yesterday',
    
    // Bottom Nav
    navHome: 'Home',
    navInsights: 'Insights',
    navAsk: 'Ask',
    navTools: 'Tools',
    navLearn: 'Learn',
    
    // Common
    or: 'or',
    voiceInput: 'Voice input',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try again',
    offline: 'No internet — you can still use the app offline',
    
    // Phase 3 - Data Entry
    addSale: 'Add Sale',
    addExpense: 'Add Expense',
    addUdhaar: 'Add Udhaar',
    amount: 'Amount',
    howPaid: 'How was payment?',
    cash: 'Cash',
    upi: 'UPI',
    udhaar: 'Udhaar',
    whatSold: 'What was sold?',
    optional: 'optional',
    save: 'Save',
    enterByVoice: 'Enter by voice',
    tellByVoice: 'Tell me by voice',
    sayExample: 'Say: "aaj 4500 ka maal bika" or "5000 ki bikri"',
    listening: 'Listening...',
    iHeard: 'I heard:',
    thisIsCorrect: 'This is correct',
    typeInstead: 'Type instead',
    whatFor: 'What was it for?',
    stockPurchase: 'Stock Purchase',
    rent: 'Rent',
    electricity: 'Electricity',
    salary: 'Salary',
    transport: 'Transport',
    other: 'Other',
    description: 'Description',
    whoTook: 'Who took udhaar?',
    customerName: 'Customer name',
    whenPay: 'When will they pay?',
    optionalLater: 'Optional — you can add this later',
    saved: 'Saved',
    undo: 'Undo',
    last7Days: 'Last 7 Days',
    earnedMore: 'Earned more this week',
    lastWeekBetter: 'Last week was better',
    bothEqual: 'Both weeks are equal',
    noDataLastWeek: 'No data from last week',
    addDataThisWeek: 'Add data this week',
    todayAdvice: 'Today\'s Advice',
    learnMore: 'Learn more',
    remindUdhaar: 'Remind about udhaar',
    overdueRemind: 'udhaar is overdue. Remind them today.',
    view: 'View',
    daysInRow: 'days in a row!',
    amazing: 'Amazing consistency!',
    sale: 'Sale',
    expense: 'Expense',
    todaySales: 'Today\'s Sales',
    addTodaySales: 'Add today\'s sales',
    takes10Seconds: 'Takes 10 seconds. I\'ll show you how your shop is doing.',
  },
  
  hi: {
    // Language Screen
    languageTitle: 'अपनी भाषा चुनें',
    english: 'English',
    hindi: 'हिंदी',
    
    // Welcome Screen
    welcomeTitle: 'आपकी दुकान का स्मार्ट साथी',
    welcomeSubtitle: '2 मिनट में अपनी दुकान के बारे में बताएं। कुछ भी पूछें। मैं आपको ज़्यादा कमाने और कम खर्च करने में मदद करूंगा।',
    startButton: 'शुरू करें',
    
    // Phone Login
    phoneTitle: 'अपना फ़ोन नंबर डालें',
    phoneSubtitle: 'आपकी दुकान का डेटा सुरक्षित रखने के लिए नंबर चाहिए। कोई स्पैम या कॉल नहीं।',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर',
    sendOTP: 'कोड भेजें',
    otpTitle: 'कोड डालें',
    otpSubtitle: 'हमने कोड भेजा है',
    otpPlaceholder: '6 अंकों का कोड',
    verifyOTP: 'सत्यापित करें',
    resendOTP: 'कोड फिर से भेजें',
    changeNumber: 'नंबर बदलें',
    
    // Progress
    of: 'में से',
    back: 'पीछे',
    skip: 'छोड़ें',
    next: 'आगे',
    
    // Interview Questions
    q1Title: 'आपकी दुकान कैसी है?',
    q2Title: 'आपकी दुकान का नाम क्या है?',
    q2Subtitle: 'वैकल्पिक — आप इसे छोड़ सकते हैं',
    q2Placeholder: 'दुकान का नाम',
    q3Title: 'कौन सा शहर या कस्बा?',
    q3Subtitle: 'हमने आपका स्थान पहचाना',
    q3Confirm: 'हाँ, यह सही है',
    q3Change: 'स्थान बदलें',
    q3Placeholder: 'शहर या कस्बे का नाम',
    q4Title: 'आप यह दुकान कब से चला रहे हैं?',
    q5Title: 'दुकान अपनी है या किराए पर?',
    q6Title: 'यहाँ कितने लोग काम करते हैं, आप सहित?',
    q7Title: 'आम महीने में दुकान की बिक्री लगभग कितनी होती है?',
    q8Title: 'क्या आप उधार देते हैं?',
    q9Title: 'अभी आप हिसाब कैसे रखते हैं?',
    q10Title: 'आपको सबसे ज़्यादा क्या चिंता है?',
    q10Subtitle: 'सभी चुनें जो लागू हों',
    
    // Shop Types
    shopKirana: 'किराना / जनरल स्टोर',
    shopMedical: 'मेडिकल स्टोर',
    shopBakery: 'बेकरी',
    shopSweet: 'मिठाई की दुकान',
    shopVegetable: 'सब्ज़ी और फल',
    shopTea: 'चाय की दुकान',
    shopRestaurant: 'छोटा रेस्तरां',
    shopSalon: 'सैलून / नाई',
    shopTailor: 'दर्ज़ी',
    shopHardware: 'हार्डवेयर',
    shopMobile: 'मोबाइल शॉप',
    shopOther: 'अन्य',
    
    // Duration Options
    durUnder1: '1 साल से कम',
    dur1to5: '1 से 5 साल',
    dur5to10: '5 से 10 साल',
    durOver10: '10 साल से ज़्यादा',
    
    // Ownership Options
    ownOwn: 'अपनी है',
    ownRent: 'किराए पर है',
    
    // People Count
    people1: 'सिर्फ मैं',
    people2to3: '2 से 3 लोग',
    people4to5: '4 से 5 लोग',
    people6plus: '6 या ज़्यादा',
    
    // Monthly Sales
    salesUnder50k: '₹50,000 से कम',
    sales50kTo1L: '₹50,000 से ₹1,00,000',
    sales1LTo3L: '₹1,00,000 से ₹3,00,000',
    sales3LTo5L: '₹3,00,000 से ₹5,00,000',
    salesOver5L: '₹5,00,000 से ज़्यादा',
    
    // Credit Options
    creditNever: 'कभी नहीं',
    creditSometimes: 'कभी-कभी',
    creditOften: 'अक्सर',
    
    // Accounts Options
    accMemory: 'सब याद रखता हूं',
    accNotebook: 'रजिस्टर या कॉपी',
    accApp: 'दूसरा ऐप',
    accNothing: 'कुछ नहीं',
    
    // Worries
    worryLowProfit: 'कम मुनाफ़ा',
    worryTooMuchStock: 'बहुत ज़्यादा सामान',
    worryNotPaying: 'ग्राहक पैसे नहीं देते',
    worryRisingCosts: 'बढ़ते खर्चे',
    worryCompetition: 'प्रतिस्पर्धा',
    worryNoTime: 'समय नहीं',
    worryDontKnow: 'पता नहीं',
    
    // Profile Summary
    profileTitle: 'आपकी दुकान की जानकारी',
    profileSubtitle: 'किसी भी जवाब पर टैप करके बदल सकते हैं',
    profileEdit: 'बदलने के लिए टैप करें',
    profileDone: 'सही है',
    
    // Welcome Tour
    tour1Title: 'अपना दिन ट्रैक करें',
    tour1Desc: '10 सेकंड में आज की बिक्री और खर्चे डालें। मैं दिखाऊंगा आपकी दुकान कैसी चल रही है।',
    tour2Title: 'कुछ भी पूछें',
    tour2Desc: 'अपने शब्दों में सवाल पूछें। मैं आपकी दुकान के डेटा के आधार पर सरल जवाब दूंगा।',
    tour3Title: 'सीखें और बढ़ें',
    tour3Desc: 'आपकी दुकान बढ़ाने के लिए छोटे पाठ। हर एक 2 मिनट। कोई कठिन शब्द नहीं।',
    tourSkip: 'टूर छोड़ें',
    tourNext: 'आगे',
    tourFinish: 'चलो शुरू करें!',
    
    // Home
    homeGreeting: 'नमस्ते',
    homeTodaySales: 'आज की बिक्री',
    homeExpenses: 'खर्चे',
    homeProfit: 'मुनाफ़ा',
    homeSmartTip: 'स्मार्ट टिप',
    homeAddNumbers: 'आज के नंबर डालें',
    homeVoice: 'या आवाज़ से बताएं',
    homeMoreThanYesterday: 'कल से ज़्यादा',
    
    // Bottom Nav
    navHome: 'होम',
    navInsights: 'सलाह',
    navAsk: 'पूछें',
    navTools: 'टूल्स',
    navLearn: 'सीखें',
    
    // Common
    or: 'या',
    voiceInput: 'आवाज़ से',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गड़बड़ हो गई',
    retry: 'फिर कोशिश करें',
    offline: 'इंटरनेट नहीं — ऐप ऑफ़लाइन भी चलेगा',
    
    // Phase 3 - Data Entry
    addSale: 'बिक्री डालें',
    addExpense: 'खर्चा डालें',
    addUdhaar: 'उधार डालें',
    amount: 'रकम',
    howPaid: 'पेमेंट कैसे मिला?',
    cash: 'नकद',
    upi: 'UPI',
    udhaar: 'उधार',
    whatSold: 'क्या बिका?',
    optional: 'वैकल्पिक',
    save: 'सेव करें',
    enterByVoice: 'आवाज़ से डालें',
    tellByVoice: 'बोलकर बताएं',
    sayExample: 'बोलें: "आज 4500 का माल बिका" या "5000 की बिक्री"',
    listening: 'सुन रहा हूँ...',
    iHeard: 'मैंने सुना:',
    thisIsCorrect: 'यह सही है',
    typeInstead: 'टाइप करके डालें',
    whatFor: 'किस पर खर्चा?',
    stockPurchase: 'सामान खरीदा',
    rent: 'किराया',
    electricity: 'बिजली',
    salary: 'तनख़्वाह',
    transport: 'ट्रांसपोर्ट',
    other: 'अन्य',
    description: 'विवरण',
    whoTook: 'किसका उधार?',
    customerName: 'ग्राहक का नाम',
    whenPay: 'कब तक वापस मिलेगा?',
    optionalLater: 'वैकल्पिक — आप बाद में भी बता सकते हैं',
    saved: 'सेव हो गया',
    undo: 'Undo',
    last7Days: 'पिछले 7 दिन',
    earnedMore: 'इस हफ्ते ज़्यादा कमाया',
    lastWeekBetter: 'पिछले हफ्ते ज़्यादा था',
    bothEqual: 'दोनों हफ्ते बराबर',
    noDataLastWeek: 'पिछले हफ्ते का डेटा नहीं है',
    addDataThisWeek: 'इस हफ्ते डेटा डालें',
    todayAdvice: 'आज की सलाह',
    learnMore: 'और जानें',
    remindUdhaar: 'उधार याद दिलाएं',
    overdueRemind: 'उधार समय बीत गया। आज याद दिलाएं।',
    view: 'देखें',
    daysInRow: 'दिन लगातार!',
    amazing: 'बहुत बढ़िया!',
    sale: 'बिक्री',
    expense: 'खर्चा',
    todaySales: 'आज की बिक्री',
    addTodaySales: 'आज की बिक्री डालें',
    takes10Seconds: '10 सेकंड में डालें। मैं बताऊंगा आपकी दुकान कैसी चल रही है।',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || translations.en[key] || key;
}
