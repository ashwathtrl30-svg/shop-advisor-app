// Phase B: Intelligent Ask Engine
// Uses exact-numbers calculations, never does arithmetic itself

import { ShopData } from '../models/data';
import { ShopProfile } from '../context/AppContext';
import * as calc from '../models/calculations';
import { detectSensitiveData } from '../utils/sensitiveData';

export interface AskContext {
  data: ShopData;
  profile: ShopProfile;
  lang: 'en' | 'hi';
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AskAnswer {
  answer: string;
  hasEnoughData: boolean;
  missingData?: string;
  calculation?: {
    period?: string;
    entries?: number;
    formula?: string;
  };
  isGeneralAdvice?: boolean;
  suggestedFollowUps?: string[];
}

// Question types
type QuestionType = 
  | 'total-sales'
  | 'profit'
  | 'loss'
  | 'expenses'
  | 'best-day'
  | 'worst-day'
  | 'busiest-weekday'
  | 'udhaar-total'
  | 'udhaar-who'
  | 'cash-in-hand'
  | 'break-even'
  | 'comparison'
  | 'trend'
  | 'profit-margin'
  | 'health-check'
  | 'advice'
  | 'unclear';

// Parse question to determine type and period
function parseQuestion(question: string, lang: 'en' | 'hi', context: AskContext): {
  type: QuestionType;
  period?: 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year';
  comparison?: boolean;
} {
  const q = question.toLowerCase().trim();
  
  // Check for sensitive data first
  const sensitiveCheck = detectSensitiveData(question);
  if (sensitiveCheck.isSensitive) {
    return { type: 'unclear' }; // Will show warning
  }
  
  // Detect period
  let period: any = 'this-month'; // default
  
  if (lang === 'en') {
    if (q.includes('today') || q.includes('aaj')) period = 'today';
    else if (q.includes('yesterday') || q.includes('kal')) period = 'yesterday';
    else if (q.includes('this week') || q.includes('is hafte')) period = 'this-week';
    else if (q.includes('last week') || q.includes('pichhle hafte')) period = 'last-week';
    else if (q.includes('this month') || q.includes('is mahine')) period = 'this-month';
    else if (q.includes('last month') || q.includes('pichhle mahine')) period = 'last-month';
    else if (q.includes('3 month') || q.includes('teen mahine')) period = 'last-3-months';
    else if (q.includes('year') || q.includes('saal')) period = 'this-year';
  } else {
    if (q.includes('आज') || q.includes('aaj')) period = 'today';
    else if (q.includes('कल') || q.includes('kal')) period = 'yesterday';
    else if (q.includes('इस हफ्ते') || q.includes('is hafte')) period = 'this-week';
    else if (q.includes('पिछले हफ्ते') || q.includes('pichhle hafte')) period = 'last-week';
    else if (q.includes('इस महीने') || q.includes('is mahine')) period = 'this-month';
    else if (q.includes('पिछले महीने') || q.includes('pichhle mahine')) period = 'last-month';
    else if (q.includes('3 महीने') || q.includes('teen mahine')) period = 'last-3-months';
    else if (q.includes('साल') || q.includes('saal')) period = 'this-year';
  }
  
  // Detect question type
  if (q.includes('total sales') || q.includes('कुल बिक्री') || q.includes('kul bikri')) {
    return { type: 'total-sales', period };
  }
  
  if (q.includes('profit') || q.includes('मुनाफ़ा') || q.includes('munafa')) {
    if (q.includes('low') || q.includes('कम') || q.includes('why')) {
      return { type: 'advice', period };
    }
    return { type: 'profit', period };
  }
  
  if (q.includes('loss') || q.includes('नुकसान') || q.includes('nuksan')) {
    return { type: 'loss', period };
  }
  
  if (q.includes('expense') || q.includes('खर्च') || q.includes('kharch')) {
    if (q.includes('biggest') || q.includes('सबसे बड़ा') || q.includes('sabse bada')) {
      return { type: 'expenses', period };
    }
    return { type: 'expenses', period };
  }
  
  if (q.includes('best day') || q.includes('सबसे अच्छा दिन') || q.includes('sabse achha din')) {
    return { type: 'best-day', period };
  }
  
  if (q.includes('worst day') || q.includes('सबसे खराब दिन') || q.includes('sabse kharab din')) {
    return { type: 'worst-day', period };
  }
  
  if (q.includes('busiest') || q.includes('व्यस्त') || q.includes('vyast')) {
    return { type: 'busiest-weekday', period: 'this-month' };
  }
  
  if (q.includes('udhaar') || q.includes('उधार')) {
    if (q.includes('who') || q.includes('कौन') || q.includes('kaun')) {
      return { type: 'udhaar-who' };
    }
    return { type: 'udhaar-total' };
  }
  
  if (q.includes('cash') || q.includes('नकद') || q.includes('nakad')) {
    return { type: 'cash-in-hand' };
  }
  
  if (q.includes('break even') || q.includes('ब्रेक ईवन')) {
    return { type: 'break-even' };
  }
  
  if (q.includes('compare') || q.includes('तुलना') || q.includes('tulna') || q.includes('more than') || q.includes('ज़्यादा') || q.includes('zyada')) {
    return { type: 'comparison', period, comparison: true };
  }
  
  if (q.includes('trend') || q.includes('going') || q.includes('कैसा चल रहा') || q.includes('kaisa chal raha')) {
    return { type: 'trend' };
  }
  
  if (q.includes('margin') || q.includes('मार्जिन')) {
    return { type: 'profit-margin', period };
  }
  
  if (q.includes('how is') || q.includes('कैसा है') || q.includes('kaisa hai') || q.includes('doing')) {
    return { type: 'health-check' };
  }
  
  if (q.includes('advice') || q.includes('suggest') || q.includes('should') || q.includes('सलाह') || q.includes('salah') || q.includes('क्या करूं') || q.includes('kya karun')) {
    return { type: 'advice', period };
  }
  
  return { type: 'unclear' };
}

// Format number in Indian format
function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// Generate answer based on question type
export function generateAnswer(question: string, context: AskContext): AskAnswer {
  const { type, period, comparison } = parseQuestion(question, context.lang, context);
  const { data, profile, lang } = context;
  
  // Check for sensitive data
  const sensitiveCheck = detectSensitiveData(question);
  if (sensitiveCheck.isSensitive) {
    return {
      answer: lang === 'hi' 
        ? '⚠️ कृपया बैंक या व्यक्तिगत विवरण दर्ज न करें। इस ऐप को उनकी आवश्यकता नहीं है।'
        : '⚠️ Please do not enter bank or personal details. This app does not need them.',
      hasEnoughData: false,
      isGeneralAdvice: false,
    };
  }
  
  switch (type) {
    case 'total-sales': {
      const stats = calc.calculatePeriodStats(data, period!);
      if (!stats.value || !stats.hasEnoughData) {
        return {
          answer: lang === 'hi'
            ? `पर्याप्त डेटा नहीं है। ${stats.reason}`
            : `Not enough data. ${stats.reason}`,
          hasEnoughData: false,
          missingData: stats.reason,
        };
      }
      
      const periodName = lang === 'hi' ? getPeriodNameHi(period!) : getPeriodNameEn(period!);
      return {
        answer: lang === 'hi'
          ? `${periodName} आपकी कुल बिक्री **${formatCurrency(stats.value.totalSales)}** थी।\n\nइसका मतलब: ${stats.value.daysWithData} दिनों में इतनी बिक्री हुई।\n\n${getAdvice(lang, 'sales', stats.value.totalSales, profile)}`
          : `Your total sales for ${periodName} were **${formatCurrency(stats.value.totalSales)}**.\n\nThis means: Sales across ${stats.value.daysWithData} days.\n\n${getAdvice(lang, 'sales', stats.value.totalSales, profile)}`,
        hasEnoughData: true,
        calculation: {
          period: periodName,
          entries: stats.value.entryCount,
          formula: 'Sum of all sale entries',
        },
      };
    }
    
    case 'profit': {
      const stats = calc.calculatePeriodStats(data, period!);
      if (!stats.value || !stats.hasEnoughData) {
        return {
          answer: lang === 'hi'
            ? `पर्याप्त डेटा नहीं है। ${stats.reason}`
            : `Not enough data. ${stats.reason}`,
          hasEnoughData: false,
          missingData: stats.reason,
        };
      }
      
      const periodName = lang === 'hi' ? getPeriodNameHi(period!) : getPeriodNameEn(period!);
      const profitText = stats.value.profit >= 0 
        ? (lang === 'hi' ? 'मुनाफ़ा' : 'profit')
        : (lang === 'hi' ? 'नुकसान' : 'loss');
      
      return {
        answer: lang === 'hi'
          ? `${periodName} आपका ${profitText} **${formatCurrency(Math.abs(stats.value.profit))}** था।\n\nबिक्री: ${formatCurrency(stats.value.totalSales)}, खर्चे: ${formatCurrency(stats.value.totalExpenses)}\n\n${getAdvice(lang, 'profit', stats.value.profit, profile)}`
          : `Your ${profitText} for ${periodName} was **${formatCurrency(Math.abs(stats.value.profit))}**.\n\nSales: ${formatCurrency(stats.value.totalSales)}, Expenses: ${formatCurrency(stats.value.totalExpenses)}\n\n${getAdvice(lang, 'profit', stats.value.profit, profile)}`,
        hasEnoughData: true,
        calculation: {
          period: periodName,
          entries: stats.value.entryCount,
          formula: 'Sales - Expenses',
        },
      };
    }
    
    case 'loss': {
      const stats = calc.calculatePeriodStats(data, period!);
      if (!stats.value) {
        return {
          answer: lang === 'hi' ? 'डेटा उपलब्ध नहीं है।' : 'No data available.',
          hasEnoughData: false,
        };
      }
      
      if (stats.value.profit >= 0) {
        return {
          answer: lang === 'hi'
            ? `अच्छी खबर! ${getPeriodNameHi(period!)} आपका **${formatCurrency(stats.value.profit)}** मुनाफ़ा हुआ। कोई नुकसान नहीं।`
            : `Good news! You made **${formatCurrency(stats.value.profit)}** profit in ${getPeriodNameEn(period!)}. No loss.`,
          hasEnoughData: true,
        };
      }
      
      return {
        answer: lang === 'hi'
          ? `हाँ, ${getPeriodNameHi(period!)} आपका **${formatCurrency(Math.abs(stats.value.profit))}** का नुकसान हुआ।\n\nखर्चे बिक्री से ज़्यादा हैं।\n\n${getAdvice(lang, 'loss', stats.value.profit, profile)}`
          : `Yes, you had a loss of **${formatCurrency(Math.abs(stats.value.profit))}** in ${getPeriodNameEn(period!)}.\n\nExpenses exceeded sales.\n\n${getAdvice(lang, 'loss', stats.value.profit, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'expenses': {
      const byCategory = calc.calculateExpensesByCategory(data, period!);
      if (!byCategory.value || byCategory.value.length === 0) {
        return {
          answer: lang === 'hi' ? 'इस अवधि के लिए कोई खर्चा डेटा नहीं है।' : 'No expense data for this period.',
          hasEnoughData: false,
        };
      }
      
      const biggest = byCategory.value[0];
      const periodName = lang === 'hi' ? getPeriodNameHi(period!) : getPeriodNameEn(period!);
      
      return {
        answer: lang === 'hi'
          ? `${periodName} आपका सबसे बड़ा खर्चा **${getCategoryNameHi(biggest.category)}** पर **${formatCurrency(biggest.amount)}** था (कुल खर्चे का ${biggest.percentage}%).\n\n${getAdvice(lang, 'expenses', biggest.amount, profile)}`
          : `Your biggest expense in ${periodName} was **${getCategoryNameEn(biggest.category)}** at **${formatCurrency(biggest.amount)}** (${biggest.percentage}% of total expenses).\n\n${getAdvice(lang, 'expenses', biggest.amount, profile)}`,
        hasEnoughData: true,
        calculation: {
          period: periodName,
          entries: byCategory.value.length,
          formula: 'Sum of expenses by category',
        },
      };
    }
    
    case 'best-day': {
      const bestWorst = calc.findBestAndWorstDays(data, period!);
      if (!bestWorst.value) {
        return {
          answer: lang === 'hi' ? 'पर्याप्त बिक्री डेटा नहीं है।' : 'Not enough sales data.',
          hasEnoughData: false,
        };
      }
      
      return {
        answer: lang === 'hi'
          ? `आपका सबसे अच्छा दिन **${formatDate(bestWorst.value.best.date)}** था जब बिक्री **${formatCurrency(bestWorst.value.best.sales)}** हुई।\n\nसबसे खराब दिन: ${formatDate(bestWorst.value.worst.date)} (${formatCurrency(bestWorst.value.worst.sales)})`
          : `Your best day was **${formatDate(bestWorst.value.best.date)}** with sales of **${formatCurrency(bestWorst.value.best.sales)}**.\n\nWorst day: ${formatDate(bestWorst.value.worst.date)} (${formatCurrency(bestWorst.value.worst.sales)})`,
        hasEnoughData: true,
      };
    }
    
    case 'worst-day': {
      const bestWorst = calc.findBestAndWorstDays(data, period!);
      if (!bestWorst.value) {
        return {
          answer: lang === 'hi' ? 'पर्याप्त बिक्री डेटा नहीं है।' : 'Not enough sales data.',
          hasEnoughData: false,
        };
      }
      
      return {
        answer: lang === 'hi'
          ? `आपका सबसे खराब दिन **${formatDate(bestWorst.value.worst.date)}** था जब बिक्री सिर्फ **${formatCurrency(bestWorst.value.worst.sales)}** हुई।\n\n${getAdvice(lang, 'worst-day', bestWorst.value.worst.sales, profile)}`
          : `Your worst day was **${formatDate(bestWorst.value.worst.date)}** with only **${formatCurrency(bestWorst.value.worst.sales)}** in sales.\n\n${getAdvice(lang, 'worst-day', bestWorst.value.worst.sales, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'busiest-weekday': {
      const busiest = calc.findBusiestWeekday(data, 'this-month');
      if (!busiest.value) {
        return {
          answer: lang === 'hi' ? 'पर्याप्त डेटा नहीं है।' : 'Not enough data.',
          hasEnoughData: false,
        };
      }
      
      return {
        answer: lang === 'hi'
          ? `आपका सबसे व्यस्त दिन **${getDayNameHi(busiest.value.day)}** है जब बिक्री **${formatCurrency(busiest.value.sales)}** होती है।\n\n${getAdvice(lang, 'busiest-day', busiest.value.sales, profile)}`
          : `Your busiest day is **${busiest.value.day}** with **${formatCurrency(busiest.value.sales)}** in sales.\n\n${getAdvice(lang, 'busiest-day', busiest.value.sales, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'udhaar-total': {
      const udhaarStats = calc.calculateUdhaarStats(data);
      
      return {
        answer: lang === 'hi'
          ? `कुल उधार बाकी: **${formatCurrency(udhaarStats.totalPending)}**\n\n${udhaarStats.overdue.length > 0 ? `${udhaarStats.overdue.length} ग्राहकों का उधार समय से overdue है।` : 'कोई overdue उधार नहीं।'}\n\n${getAdvice(lang, 'udhaar', udhaarStats.totalPending, profile)}`
          : `Total udhaar pending: **${formatCurrency(udhaarStats.totalPending)}**\n\n${udhaarStats.overdue.length > 0 ? `${udhaarStats.overdue.length} customers have overdue udhaar.` : 'No overdue udhaar.'}\n\n${getAdvice(lang, 'udhaar', udhaarStats.totalPending, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'udhaar-who': {
      const udhaarStats = calc.calculateUdhaarStats(data);
      
      if (udhaarStats.perCustomer.length === 0) {
        return {
          answer: lang === 'hi' ? 'कोई उधार बाकी नहीं है।' : 'No udhaar pending.',
          hasEnoughData: true,
        };
      }
      
      const top3 = udhaarStats.perCustomer.slice(0, 3);
      const list = top3.map(c => `${c.name}: ${formatCurrency(c.amount)}`).join('\n');
      
      return {
        answer: lang === 'hi'
          ? `सबसे ज़्यादा उधार:\n\n${list}\n\n${getAdvice(lang, 'udhaar-who', udhaarStats.totalPending, profile)}`
          : `Top udhaar customers:\n\n${list}\n\n${getAdvice(lang, 'udhaar-who', udhaarStats.totalPending, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'cash-in-hand': {
      const cash = calc.estimateCashInHand(data, profile);
      
      if (!cash.value && cash.value !== 0) {
        return {
          answer: lang === 'hi'
            ? 'आज का opening cash सेट नहीं है। Profile में जाकर सेट करें।'
            : 'Opening cash for today is not set. Set it in Profile.',
          hasEnoughData: false,
          missingData: 'Opening cash',
        };
      }
      
      return {
        answer: lang === 'hi'
          ? `आज आपके पास अनुमानित नकद: **${formatCurrency(cash.value)}**\n\n(Opening cash + नकद बिक्री - नकद खर्चे)`
          : `Estimated cash in hand today: **${formatCurrency(cash.value)}**\n\n(Opening cash + cash sales - cash expenses)`,
        hasEnoughData: true,
        calculation: {
          formula: 'Opening cash + Cash sales - Cash expenses',
        },
      };
    }
    
    case 'break-even': {
      const breakEven = calc.calculateBreakEven(profile);
      
      if (!breakEven.value) {
        return {
          answer: lang === 'hi'
            ? 'Fixed costs सेट नहीं हैं। Profile में rent, salaries, और other costs डालें।'
            : 'Fixed costs are not set. Add rent, salaries, and other costs in Profile.',
          hasEnoughData: false,
          missingData: 'Fixed costs',
        };
      }
      
      return {
        answer: lang === 'hi'
          ? `हर दिन कम से कम **${formatCurrency(breakEven.value)}** की बिक्री करें ताकि सारे खर्चे निकल जाएं।\n\n(यह 20% profit margin मानकर है)`
          : `You need to sell at least **${formatCurrency(breakEven.value)}** per day to cover all costs.\n\n(Assuming 20% profit margin)`,
        hasEnoughData: true,
        calculation: {
          formula: 'Fixed costs / 0.20 / 30 days',
        },
      };
    }
    
    case 'comparison': {
      const currentPeriod = period || 'this-month';
      const previousPeriod = getPreviousPeriod(currentPeriod);
      
      const comparison = calc.comparePeriods(data, currentPeriod, previousPeriod);
      
      if (!comparison.value || !comparison.hasEnoughData) {
        return {
          answer: lang === 'hi'
            ? 'तुलना के लिए पर्याप्त डेटा नहीं है।'
            : 'Not enough data for comparison.',
          hasEnoughData: false,
        };
      }
      
      const { difference, percentageChange } = comparison.value;
      const isBetter = difference > 0;
      
      return {
        answer: lang === 'hi'
          ? `${getPeriodNameHi(currentPeriod)} की बिक्री ${getPeriodNameHi(previousPeriod)} से **${isBetter ? 'ज़्यादा' : 'कम'}** है:\n\n**${formatCurrency(Math.abs(difference))}** (${Math.abs(percentageChange)}% ${isBetter ? 'बढ़ी' : 'घटी'})\n\n${getAdvice(lang, 'comparison', difference, profile)}`
          : `Sales in ${getPeriodNameEn(currentPeriod)} are **${isBetter ? 'higher' : 'lower'}** than ${getPeriodNameEn(previousPeriod)}:\n\n**${formatCurrency(Math.abs(difference))}** (${Math.abs(percentageChange)}% ${isBetter ? 'increase' : 'decrease'})\n\n${getAdvice(lang, 'comparison', difference, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'trend': {
      const trend = calc.calculateTrend(data);
      
      if (!trend.value) {
        return {
          answer: lang === 'hi' ? 'ट्रेंड देखने के लिए पर्याप्त डेटा नहीं है।' : 'Not enough data to see trend.',
          hasEnoughData: false,
        };
      }
      
      const direction = trend.value.direction;
      const directionText = lang === 'hi'
        ? (direction === 'up' ? 'बढ़ रहा है' : direction === 'down' ? 'घट रहा है' : 'स्थिर है')
        : (direction === 'up' ? 'going up' : direction === 'down' ? 'going down' : 'stable');
      
      return {
        answer: lang === 'hi'
          ? `आपकी बिक्री **${directionText}** (पिछले हफ्ते से ${trend.value.percentageChange > 0 ? '+' : ''}${trend.value.percentageChange}%)\n\n${getAdvice(lang, 'trend', trend.value.percentageChange, profile)}`
          : `Your sales are **${directionText}** (${trend.value.percentageChange > 0 ? '+' : ''}${trend.value.percentageChange}% from last week)\n\n${getAdvice(lang, 'trend', trend.value.percentageChange, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'profit-margin': {
      const margin = calc.calculateProfitMargin(data, period!);
      
      if (!margin.value && margin.value !== 0) {
        return {
          answer: lang === 'hi' ? 'पर्याप्त डेटा नहीं है।' : 'Not enough data.',
          hasEnoughData: false,
        };
      }
      
      const periodName = lang === 'hi' ? getPeriodNameHi(period!) : getPeriodNameEn(period!);
      const isGood = margin.value >= 20;
      
      return {
        answer: lang === 'hi'
          ? `${periodName} आपका profit margin **${margin.value}%** है।\n\n${isGood ? '✅ यह अच्छा है।' : '⚠️ यह कम है।'}\n\n${getAdvice(lang, 'margin', margin.value, profile)}`
          : `Your profit margin for ${periodName} is **${margin.value}%**.\n\n${isGood ? '✅ This is good.' : '⚠️ This is low.'}\n\n${getAdvice(lang, 'margin', margin.value, profile)}`,
        hasEnoughData: true,
      };
    }
    
    case 'health-check': {
      const thisMonth = calc.calculatePeriodStats(data, 'this-month');
      const trend = calc.calculateTrend(data);
      const udhaarStats = calc.calculateUdhaarStats(data);
      const expenses = calc.calculateExpensesByCategory(data, 'this-month');
      
      if (!thisMonth.value) {
        return {
          answer: lang === 'hi' ? 'पर्याप्त डेटा नहीं है।' : 'Not enough data.',
          hasEnoughData: false,
        };
      }
      
      const trendDirection = trend.value?.direction || 'unknown';
      const biggestExpense = expenses.value?.[0];
      
      let healthSummary = lang === 'hi'
        ? `**इस महीने की स्थिति:**\n\n`
        : `**This month's health:**\n\n`;
      
      healthSummary += lang === 'hi'
        ? `• बिक्री: ${formatCurrency(thisMonth.value.totalSales)}\n`
        : `• Sales: ${formatCurrency(thisMonth.value.totalSales)}\n`;
      
      healthSummary += lang === 'hi'
        ? `• मुनाफ़ा: ${formatCurrency(thisMonth.value.profit)}\n`
        : `• Profit: ${formatCurrency(thisMonth.value.profit)}\n`;
      
      if (biggestExpense) {
        healthSummary += lang === 'hi'
          ? `• सबसे बड़ा खर्चा: ${getCategoryNameHi(biggestExpense.category)} (${formatCurrency(biggestExpense.amount)})\n`
          : `• Biggest expense: ${getCategoryNameEn(biggestExpense.category)} (${formatCurrency(biggestExpense.amount)})\n`;
      }
      
      healthSummary += lang === 'hi'
        ? `• उधार बाकी: ${formatCurrency(udhaarStats.totalPending)}\n`
        : `• Udhaar pending: ${formatCurrency(udhaarStats.totalPending)}\n`;
      
      healthSummary += lang === 'hi'
        ? `• ट्रेंड: ${trendDirection === 'up' ? 'बढ़ रहा है 📈' : trendDirection === 'down' ? 'घट रहा है 📉' : 'स्थिर ➡️'}\n\n`
        : `• Trend: ${trendDirection === 'up' ? 'Going up 📈' : trendDirection === 'down' ? 'Going down 📉' : 'Stable ➡️'}\n\n`;
      
      // One thing to fix
      let toFix = '';
      if (thisMonth.value.profit < 0) {
        toFix = lang === 'hi' ? '🔴 खर्चे कम करें।' : '🔴 Reduce expenses.';
      } else if (udhaarStats.totalPending > thisMonth.value.totalSales * 0.2) {
        toFix = lang === 'hi' ? '🔴 उधार वसूलें।' : '🔴 Collect udhaar.';
      } else if (biggestExpense && biggestExpense.percentage > 40) {
        toFix = lang === 'hi' ? `🔴 ${getCategoryNameHi(biggestExpense.category)} खर्चा कम करें।` : `🔴 Reduce ${getCategoryNameEn(biggestExpense.category)} expenses.`;
      } else {
        toFix = lang === 'hi' ? '✅ सब अच्छा चल रहा है!' : '✅ Everything looks good!';
      }
      
      healthSummary += toFix;
      
      return {
        answer: healthSummary,
        hasEnoughData: true,
      };
    }
    
    case 'advice': {
      // General advice based on profile and data
      return {
        answer: lang === 'hi'
          ? `**सामान्य सलाह:**\n\n${getGeneralAdvice(lang, profile)}\n\n_यह आपके डेटा पर आधारित नहीं है, सामान्य सलाह है।_`
          : `**General advice:**\n\n${getGeneralAdvice(lang, profile)}\n\n_This is general advice, not based on your data._`,
        hasEnoughData: true,
        isGeneralAdvice: true,
      };
    }
    
    default: {
      // Unclear question
      return {
        answer: lang === 'hi'
          ? 'मैं समझ नहीं पाया। क्या आप पूछना चाहते हैं:\n\n• इस महीने की बिक्री?\n• मुनाफ़ा कितना हुआ?\n• सबसे बड़ा खर्चा क्या है?\n• उधार कितना बाकी है?'
          : 'I didn\'t understand. Did you want to ask:\n\n• Sales this month?\n• How much profit?\n• What\'s the biggest expense?\n• How much udhaar is pending?',
        hasEnoughData: false,
        suggestedFollowUps: lang === 'hi'
          ? ['इस महीने की बिक्री', 'मुनाफ़ा कितना हुआ?', 'सबसे बड़ा खर्चा', 'उधार कितना बाकी है?']
          : ['Sales this month', 'How much profit?', 'Biggest expense', 'Udhaar pending'],
      };
    }
  }
}

// Helper functions
function getPeriodNameEn(period: string): string {
  const names: Record<string, string> = {
    'today': 'today',
    'yesterday': 'yesterday',
    'this-week': 'this week',
    'last-week': 'last week',
    'this-month': 'this month',
    'last-month': 'last month',
    'last-3-months': 'last 3 months',
    'this-year': 'this year',
  };
  return names[period] || period;
}

function getPeriodNameHi(period: string): string {
  const names: Record<string, string> = {
    'today': 'आज',
    'yesterday': 'कल',
    'this-week': 'इस हफ्ते',
    'last-week': 'पिछले हफ्ते',
    'this-month': 'इस महीने',
    'last-month': 'पिछले महीने',
    'last-3-months': 'पिछले 3 महीने',
    'this-year': 'इस साल',
  };
  return names[period] || period;
}

function getPreviousPeriod(period: string): any {
  const map: Record<string, string> = {
    'today': 'yesterday',
    'this-week': 'last-week',
    'this-month': 'last-month',
    'last-month': 'this-month',
    'last-3-months': 'last-month',
  };
  return map[period] || 'last-month';
}

function getCategoryNameEn(category: string): string {
  const names: Record<string, string> = {
    'stock': 'Stock purchase',
    'rent': 'Rent',
    'electricity': 'Electricity',
    'salary': 'Salary',
    'transport': 'Transport',
    'other': 'Other',
  };
  return names[category] || category;
}

function getCategoryNameHi(category: string): string {
  const names: Record<string, string> = {
    'stock': 'सामान खरीद',
    'rent': 'किराया',
    'electricity': 'बिजली',
    'salary': 'तनख्वाह',
    'transport': 'ट्रांसपोर्ट',
    'other': 'अन्य',
  };
  return names[category] || category;
}

function getDayNameHi(day: string): string {
  const names: Record<string, string> = {
    'Monday': 'सोमवार',
    'Tuesday': 'मंगलवार',
    'Wednesday': 'बुधवार',
    'Thursday': 'गुरुवार',
    'Friday': 'शुक्रवार',
    'Saturday': 'शनिवार',
    'Sunday': 'रविवार',
  };
  return names[day] || day;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getAdvice(lang: 'en' | 'hi', type: string, value: number, profile: ShopProfile): string {
  // Context-aware advice based on shop type and numbers
  const shopType = profile.shopType || 'general';
  
  if (type === 'sales') {
    if (lang === 'hi') {
      return value > 100000 ? '✅ अच्छी बिक्री है!' : 'बिक्री बढ़ाने की कोशिश करें।';
    }
    return value > 100000 ? '✅ Good sales!' : 'Try to increase sales.';
  }
  
  if (type === 'profit') {
    if (value < 0) {
      return lang === 'hi' ? 'खर्चे कम करने पर ध्यान दें।' : 'Focus on reducing expenses.';
    }
    return lang === 'hi' ? 'मुनाफ़ा बढ़ाने के लिए बिक्री बढ़ाएं या खर्चे कम करें।' : 'Increase sales or reduce expenses to grow profit.';
  }
  
  if (type === 'loss') {
    return lang === 'hi' ? 'तुरंत खर्चे कम करें और बिक्री बढ़ाएं।' : 'Reduce expenses and increase sales immediately.';
  }
  
  if (type === 'expenses') {
    return lang === 'hi' ? 'इस खर्चे को कम करने के तरीके खोजें।' : 'Find ways to reduce this expense.';
  }
  
  if (type === 'udhaar' || type === 'udhaar-who') {
    if (value > 50000) {
      return lang === 'hi' ? 'उधार कम करें, नकद बिक्री बढ़ाएं।' : 'Reduce udhaar, increase cash sales.';
    }
    return lang === 'hi' ? 'उधार वसूलने की कोशिश करें।' : 'Try to collect udhaar.';
  }
  
  if (type === 'comparison') {
    if (value > 0) {
      return lang === 'hi' ? '✅ बढ़िया प्रगति!' : '✅ Great progress!';
    }
    return lang === 'hi' ? 'कमियों पर ध्यान दें।' : 'Focus on areas of improvement.';
  }
  
  if (type === 'trend') {
    if (value > 10) {
      return lang === 'hi' ? '✅ अच्छा ट्रेंड!' : '✅ Good trend!';
    } else if (value < -10) {
      return lang === 'hi' ? 'सुधार की ज़रूरत है।' : 'Needs improvement.';
    }
    return lang === 'hi' ? 'स्थिर प्रदर्शन।' : 'Stable performance.';
  }
  
  if (type === 'margin') {
    if (value < 15) {
      return lang === 'hi' ? 'मार्जिन बहुत कम है। कीमतें बढ़ाएं या खर्चे कम करें।' : 'Margin is very low. Increase prices or reduce costs.';
    }
    return lang === 'hi' ? 'मार्जिन ठीक है।' : 'Margin is acceptable.';
  }
  
  return '';
}

function getGeneralAdvice(lang: 'en' | 'hi', profile: ShopProfile): string {
  const shopType = profile.shopType || 'general';
  
  if (lang === 'hi') {
    const advice: Record<string, string> = {
      'kirana': '• नियमित ग्राहकों को पहचानें\n• Fast-moving items हमेशा स्टॉक में रखें\n• UPI payment स्वीकार करें',
      'medical': '• Expiry dates नियमित चेक करें\n• Generic medicines भी रखें\n• Doctor referrals बढ़ाएं',
      'bakery': '• Fresh items रोज़ बनाएं\n• Festival specials तैयार करें\n• Custom orders स्वीकार करें',
      'default': '• ग्राहक सेवा पर ध्यान दें\n• Digital payments स्वीकार करें\n• Regular stock check करें',
    };
    return advice[shopType] || advice['default'];
  }
  
  const advice: Record<string, string> = {
    'kirana': '• Recognize regular customers\n• Keep fast-moving items in stock\n• Accept UPI payments',
    'medical': '• Check expiry dates regularly\n• Stock generic medicines\n• Increase doctor referrals',
    'bakery': '• Make fresh items daily\n• Prepare festival specials\n• Accept custom orders',
    'default': '• Focus on customer service\n• Accept digital payments\n• Do regular stock checks',
  };
  
  return advice[shopType] || advice['default'];
}

// Generate suggested questions based on actual data
export function generateSuggestedQuestions(data: ShopData, profile: ShopProfile, lang: 'en' | 'hi'): string[] {
  const questions: string[] = [];
  
  // Check if there's data for various questions
  const thisMonth = calc.calculatePeriodStats(data, 'this-month');
  const lastMonth = calc.calculatePeriodStats(data, 'last-month');
  const udhaarStats = calc.calculateUdhaarStats(data);
  
  if (lang === 'hi') {
    questions.push('इस महीने की बिक्री कितनी हुई?');
    
    if (thisMonth.value && thisMonth.value.profit < 0) {
      questions.push('इस महीने नुकसान क्यों हुआ?');
    } else {
      questions.push('इस महीने मुनाफ़ा कितना हुआ?');
    }
    
    if (udhaarStats.totalPending > 0) {
      questions.push('कितना उधार बाकी है?');
    }
    
    if (thisMonth.value && lastMonth.value) {
      questions.push('पिछले महीने से तुलना करें');
    }
    
    questions.push('मेरी दुकान कैसी चल रही है?');
  } else {
    questions.push('How much sales this month?');
    
    if (thisMonth.value && thisMonth.value.profit < 0) {
      questions.push('Why did I have a loss this month?');
    } else {
      questions.push('How much profit this month?');
    }
    
    if (udhaarStats.totalPending > 0) {
      questions.push('How much udhaar is pending?');
    }
    
    if (thisMonth.value && lastMonth.value) {
      questions.push('Compare with last month');
    }
    
    questions.push('How is my shop doing?');
  }
  
  return questions.slice(0, 4);
}
