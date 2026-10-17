// Conversation engine for Ask tab

import { ShopData, formatCurrency, calculateDailyTotals, getPendingUdhaar } from './data';
import { ShopProfile } from '../context/AppContext';
import { Language } from '../i18n/translations';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  feedback?: 'helpful' | 'not_helpful' | null;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  shopProfile: ShopProfile;
}

// Generate suggested questions based on profile and data
export function generateSuggestedQuestions(
  data: ShopData,
  profile: ShopProfile,
  lang: Language
): string[] {
  const questions: string[] = [];
  const dailyTotals = calculateDailyTotals(data);
  const hasData = dailyTotals.length >= 7;
  const pendingUdhaar = getPendingUdhaar(data);

  if (lang === 'hi') {
    // Hindi suggestions
    if (hasData) {
      questions.push('इस हफ्ते मुनाफ़ा क्यों कम था?');
      questions.push('सबसे ज़्यादा उधार किसका बाकी है?');
    }
    
    if (profile.shopType === 'kirana') {
      questions.push('बिजली का बिल कैसे कम करूं?');
    } else if (profile.shopType === 'bakery') {
      questions.push('कच्चे माल का खर्चा कैसे बचाएं?');
    }
    
    if (pendingUdhaar.length > 0) {
      questions.push('उधार कैसे वसूल करें?');
    }
    
    questions.push('नए ग्राहक कैसे लाएं?');
    questions.push('GST क्या है?');
  } else {
    // English suggestions
    if (hasData) {
      questions.push('Why was my profit low this week?');
      questions.push('Which customers owe me the most?');
    }
    
    if (profile.shopType === 'kirana') {
      questions.push('How can I reduce electricity cost?');
    } else if (profile.shopType === 'bakery') {
      questions.push('How to save on raw material costs?');
    }
    
    if (pendingUdhaar.length > 0) {
      questions.push('How to collect udhaar?');
    }
    
    questions.push('How to get new customers?');
    questions.push('What is GST?');
  }

  return questions.slice(0, 4);
}

// Parse question and generate answer
export function generateAnswer(
  question: string,
  conversation: Conversation,
  data: ShopData,
  profile: ShopProfile,
  lang: Language
): string {
  const q = question.toLowerCase();
  
  // Safety checks first
  if (containsIllegalRequest(q)) {
    return lang === 'hi'
      ? 'मैं ग़लत या ग़ैर-क़ानूनी काम में मदद नहीं कर सकता। क्या मैं किसी वैध तरीके से मदद करूं?'
      : 'I cannot help with illegal activities. Can I help you with a legal alternative?';
  }

  if (containsDistressSignals(q)) {
    return lang === 'hi'
      ? 'मैं समझ सकता हूं कि आप परेशान हैं। कृपया किसी भरोसेमंद व्यक्ति या हेल्पलाइन से बात करें। मैं यहां हूं व्यापार के सवालों में मदद करने के लिए।'
      : 'I understand you might be going through a tough time. Please talk to a trusted person or helpline. I\'m here to help with business questions.';
  }

  // Question type detection and answer generation
  if (containsProfitQuestion(q)) {
    return generateProfitAnswer(data, lang);
  }

  if (containsUdhaarQuestion(q)) {
    return generateUdhaarAnswer(data, lang);
  }

  if (containsCostQuestion(q)) {
    return generateCostAnswer(data, profile, lang);
  }

  if (containsGSTQuestion(q)) {
    return generateGSTAnswer(lang);
  }

  if (containsCustomerQuestion(q)) {
    return generateCustomerAnswer(profile, lang);
  }

  // Default response
  return lang === 'hi'
    ? 'मुझे यकीन नहीं है। क्या आप अपने दुकान के बारे में कोई सवाल पूछ सकते हैं? जैसे बिक्री, खर्चे, या उधार के बारे में।'
    : 'I\'m not sure about that. Can you ask me something about your shop? Like sales, expenses, or udhaar?';
}

// Question type detectors
function containsProfitQuestion(q: string): boolean {
  return q.includes('profit') || q.includes('मुनाफ़ा') || q.includes('kamaya') || q.includes('कमाया');
}

function containsUdhaarQuestion(q: string): boolean {
  return q.includes('udhaar') || q.includes('उधार') || q.includes('owe') || q.includes('baaki');
}

function containsCostQuestion(q: string): boolean {
  return q.includes('cost') || q.includes('expense') || q.includes('खर्च') || q.includes('बिजली') || q.includes('electricity');
}

function containsGSTQuestion(q: string): boolean {
  return q.includes('gst') || q.includes('tax') || q.includes('टैक्स');
}

function containsCustomerQuestion(q: string): boolean {
  return q.includes('customer') || q.includes('ग्राहक') || q.includes('new') || q.includes('नए');
}

function containsIllegalRequest(q: string): boolean {
  const illegal = ['cheat', 'fraud', 'evade', 'fake', 'धोखा', 'नकली', 'चोरी'];
  return illegal.some(word => q.includes(word));
}

function containsDistressSignals(q: string): boolean {
  const distress = ['suicide', 'kill myself', 'depressed', 'आत्महत्या', 'उदास', 'परेशान'];
  return distress.some(word => q.includes(word));
}

// Answer generators
function generateProfitAnswer(data: ShopData, lang: Language): string {
  const dailyTotals = calculateDailyTotals(data);
  
  if (dailyTotals.length < 7) {
    return lang === 'hi'
      ? `मुझे अभी **${dailyTotals.length} दिन** का डेटा है। मुनाफ़ा समझने के लिए कम से कम **7 दिन** की बिक्री और खर्चे डालें।\n\n[आज की बिक्री डालें]`
      : `I have data for only **${dailyTotals.length} days**. To understand profit, add sales and expenses for at least **7 days**.\n\n[Add today's sales]`;
  }

  const last7Days = dailyTotals.slice(-7);
  const totalSales = last7Days.reduce((sum, d) => sum + d.totalSales, 0);
  const totalExpenses = last7Days.reduce((sum, d) => sum + d.totalExpenses, 0);
  const profit = totalSales - totalExpenses;

  if (profit < 0) {
    return lang === 'hi'
      ? `पिछले 7 दिनों में आपका मुनाफ़ा **-₹${Math.abs(profit).toLocaleString('en-IN')}** है। आपकी बिक्री **₹${totalSales.toLocaleString('en-IN')}** थी और खर्चे **₹${totalExpenses.toLocaleString('en-IN')}**।\n\n**सुझाव:** खर्चों में कमी करें। सबसे बड़ा खर्चा देखें और सोचें क्या कम हो सकता है।`
      : `Your profit for the last 7 days is **-₹${Math.abs(profit).toLocaleString('en-IN')}**. Your sales were **₹${totalSales.toLocaleString('en-IN')}** and expenses were **₹${totalExpenses.toLocaleString('en-IN')}**.\n\n**Recommendation:** Reduce expenses. Check your biggest expense and think what can be cut.`;
  }

  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

  return lang === 'hi'
    ? `पिछले 7 दिनों में आपका मुनाफ़ा **₹${profit.toLocaleString('en-IN')}** है। हर ₹100 की बिक्री पर आप **₹${profitMargin.toFixed(0)}** कमाते हैं।\n\n**सुझाव:** मुनाफ़ा बढ़ाने के लिए या तो बिक्री बढ़ाएं या खर्चे कम करें।`
    : `Your profit for the last 7 days is **₹${profit.toLocaleString('en-IN')}**. For every ₹100 in sales, you earn **₹${profitMargin.toFixed(0)}**.\n\n**Recommendation:** To increase profit, either increase sales or reduce expenses.`;
}

function generateUdhaarAnswer(data: ShopData, lang: Language): string {
  const pendingUdhaar = getPendingUdhaar(data);
  
  if (pendingUdhaar.length === 0) {
    return lang === 'hi'
      ? 'आपका कोई उधार बाकी नहीं है। बहुत अच्छा!'
      : 'You have no pending udhaar. That\'s great!';
  }

  const totalOwed = pendingUdhaar.reduce((sum, u) => sum + u.amount, 0);
  const topDebtors = pendingUdhaar
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const debtorList = topDebtors.map(u => `- ${u.customerName}: ₹${u.amount.toLocaleString('en-IN')}`).join('\n');

  return lang === 'hi'
    ? `आपका कुल **₹${totalOwed.toLocaleString('en-IN')}** उधार बाकी है **${pendingUdhaar.length} ग्राहकों** से।\n\nसबसे ज़्यादा:\n${debtorList}\n\n**सुझाव:** आज इन तीनों को याद दिलाएं। विनम्र तरीके से WhatsApp मैसेज भेजें।`
    : `You have **₹${totalOwed.toLocaleString('en-IN')}** pending from **${pendingUdhaar.length} customers**.\n\nTop debtors:\n${debtorList}\n\n**Recommendation:** Remind these three today. Send a polite WhatsApp message.`;
}

function generateCostAnswer(data: ShopData, profile: ShopProfile, lang: Language): string {
  const expenses = data.expenses.filter(e => !e.deleted);
  
  if (expenses.length === 0) {
    return lang === 'hi'
      ? 'आपने अभी तक खर्चे नहीं डाले। खर्चे डालें ताकि मैं बता सकूं कहां बचा सकते हैं।\n\n[खर्चा डालें]'
      : 'You haven\'t added expenses yet. Add expenses so I can show where you can save.\n\n[Add expense]';
  }

  const byCategory: Record<string, number> = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const [biggestCategory, biggestAmount] = sorted[0];
  const totalExpenses = expenses.reduce((sum: number, e) => sum + e.amount, 0);
  const percentage = (biggestAmount / totalExpenses) * 100;

  const categoryNames: Record<string, string> = {
    stock: lang === 'hi' ? 'सामान' : 'stock',
    rent: lang === 'hi' ? 'किराया' : 'rent',
    electricity: lang === 'hi' ? 'बिजली' : 'electricity',
    salary: lang === 'hi' ? 'तनख़्वाह' : 'salary',
    transport: lang === 'hi' ? 'ट्रांसपोर्ट' : 'transport',
    other: lang === 'hi' ? 'अन्य' : 'other',
  };

  let tip = '';
  if (biggestCategory === 'electricity') {
    tip = lang === 'hi'
      ? '**सुझाव:** LED बल्ब लगाएं, AC तापमान 24°C रखें, और बिजली बिल समय पर भरें ताकि पेनल्टी न लगे।'
      : '**Tip:** Use LED bulbs, keep AC at 24°C, and pay electricity bill on time to avoid penalties.';
  } else if (biggestCategory === 'stock') {
    tip = lang === 'hi'
      ? '**सुझाव:** थोक में खरीदें, सप्लायर से मोलभाव करें, और सिर्फ उतना ही मंगाएं जितना 2 हफ्ते में बिक जाए।'
      : '**Tip:** Buy in bulk, negotiate with suppliers, and order only what sells in 2 weeks.';
  } else {
    tip = lang === 'hi'
      ? `**सुझाव:** ${categoryNames[biggestCategory]} में कमी देखें। क्या यह ज़रूरी है?`
      : `**Tip:** Look for savings in ${categoryNames[biggestCategory]}. Is it essential?`;
  }

  return lang === 'hi'
    ? `आपका सबसे बड़ा खर्चा **${categoryNames[biggestCategory]}** है: **₹${biggestAmount.toLocaleString('en-IN')}** (कुल खर्चे का **${percentage.toFixed(0)}%**).\n\n${tip}`
    : `Your biggest expense is **${categoryNames[biggestCategory]}**: **₹${biggestAmount.toLocaleString('en-IN')}** (**${percentage.toFixed(0)}%** of total expenses).\n\n${tip}`;
}

function generateGSTAnswer(lang: Language): string {
  return lang === 'hi'
    ? 'GST एक टैक्स है जो 1 जुलाई 2017 से लागू है। अगर आपकी सालाना बिक्री **₹40 लाख** से ज़्यादा है (कुछ राज्यों में ₹20 लाख), तो GST रजिस्ट्रेशन ज़रूरी है।\n\n**ज़रूरी बात:** यह सामान्य जानकारी है। अपने CA या आधिकारिक स्रोत (gst.gov.in) से पुष्टि करें क्योंकि नियम बदल सकते हैं।'
    : 'GST is a tax implemented from July 1, 2017. If your annual sales exceed **₹40 lakhs** (₹20 lakhs in some states), GST registration is mandatory.\n\n**Important:** This is general information. Confirm with your CA or official source (gst.gov.in) as rules may change.';
}

function generateCustomerAnswer(profile: ShopProfile, lang: Language): string {
  const shopType = profile.shopType;
  
  let tips = '';
  if (shopType === 'kirana') {
    tips = lang === 'hi'
      ? '1. **होम डिलीवरी** शुरू करें (500 मीटर के दायरे में)\n2. **WhatsApp ग्रुप** बनाएं नियमित ग्राहकों का\n3. **फेस्टिवल ऑफर** दें (दिवाली, होली पर 5% छूट)\n4. **लॉयल्टी कार्ड** - 10 खरीदारी पर 1 मुफ्त'
      : '1. Start **home delivery** (within 500m radius)\n2. Create **WhatsApp group** for regular customers\n3. Give **festival offers** (5% discount on Diwali, Holi)\n4. **Loyalty card** - 1 free after 10 purchases';
  } else if (shopType === 'bakery') {
    tips = lang === 'hi'
      ? '1. **Instagram** पर फोटो डालें (केक, पेस्ट्री की)\n2. **बर्थडे ऑफर** - फ्री छोटा केक ₹500+ ऑर्डर पर\n3. **कॉर्पोरेट ऑर्डर** - ऑफिस में सैंपल भेजें\n4. **WhatsApp स्टेटस** रोज़ अपडेट करें'
      : '1. Post photos on **Instagram** (cakes, pastries)\n2. **Birthday offer** - free small cake on ₹500+ order\n3. **Corporate orders** - send samples to offices\n4. Update **WhatsApp status** daily';
  } else {
    tips = lang === 'hi'
      ? '1. **Google My Business** पर रजिस्टर करें (मुफ्त)\n2. **WhatsApp** पर कैटलॉग भेजें\n3. **रेफरल ऑफर** - पुराने ग्राहक नया लाएं तो 10% छूट\n4. **सोशल मीडिया** पर रोज़ पोस्ट करें'
      : '1. Register on **Google My Business** (free)\n2. Send catalog on **WhatsApp**\n3. **Referral offer** - 10% discount if old customer brings new\n4. Post daily on **social media**';
  }

  return lang === 'hi'
    ? `नए ग्राहक लाने के लिए:\n\n${tips}\n\n**सबसे ज़रूरी:** पहले 3 काम करें, फिर बाकी। एक साथ सब मत करें।`
    : `To get new customers:\n\n${tips}\n\n**Most important:** Do the first 3 first, then the rest. Don't do everything at once.`;
}

// Text-to-speech
export function speakText(text: string, lang: Language): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
