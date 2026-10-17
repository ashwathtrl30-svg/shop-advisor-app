// Phase C: Daily Insights Engine
// Generates 8-10 insights per day from exact-numbers engine

import { ShopProfile } from '../context/AppContext';
import { ShopData } from '../models/data';
import * as calc from '../models/calculations';

export interface DailyInsight {
  id: string;
  type: InsightType;
  headline: string;
  figure: string;
  action: string;
  period: string;
  moneyImpact: number; // For ranking (higher = more important)
  isPositive: boolean;
  isGeneralTip: boolean;
  requiresMoreData?: string;
  date: string; // YYYY-MM-DD
}

export type InsightType = 
  | 'profit'
  | 'sales-trend'
  | 'biggest-cost'
  | 'cost-increased'
  | 'udhaar-collect'
  | 'best-selling'
  | 'slow-item'
  | 'cash-safety'
  | 'target-progress'
  | 'win'
  | 'weekday-pattern'
  | 'festival'
  | 'break-even';

export interface DailyInsights {
  date: string;
  insights: DailyInsight[];
  feedback: Record<string, 'yes' | 'no'>;
}

// Generate unique ID for insight
function generateInsightId(type: InsightType, date: string): string {
  return `${type}-${date}`;
}

// Get today's date in YYYY-MM-DD format
function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// Format currency
function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// Generate all possible insights for today
export function generateDailyInsights(
  data: ShopData,
  profile: ShopProfile,
  lang: 'en' | 'hi'
): DailyInsight[] {
  const today = getToday();
  const insights: DailyInsight[] = [];
  
  // 1. Profit insight (this week vs last week)
  const thisWeek = calc.calculatePeriodStats(data, 'this-week');
  const lastWeek = calc.calculatePeriodStats(data, 'last-week');
  
  if (thisWeek.value && lastWeek.value && thisWeek.hasEnoughData && lastWeek.hasEnoughData) {
    const profitDiff = thisWeek.value.profit - lastWeek.value.profit;
    const isPositive = profitDiff > 0;
    
    insights.push({
      id: generateInsightId('profit', today),
      type: 'profit',
      headline: lang === 'hi' 
        ? (isPositive ? 'मुनाफ़ा बढ़ रहा है' : 'मुनाफ़ा कम हो रहा है')
        : (isPositive ? 'Profit is growing' : 'Profit is declining'),
      figure: `${isPositive ? '+' : ''}${formatCurrency(profitDiff)} ${lang === 'hi' ? 'इस हफ्ते' : 'this week'}`,
      action: lang === 'hi'
        ? (isPositive ? 'इसी तरह जारी रखें' : 'खर्चों पर नज़र रखें')
        : (isPositive ? 'Keep up the good work' : 'Watch your expenses closely'),
      period: lang === 'hi' ? 'इस हफ्ते vs पिछला हफ्ता' : 'This week vs last week',
      moneyImpact: Math.abs(profitDiff),
      isPositive,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 2. Sales trend insight
  const trend = calc.calculateTrend(data);
  if (trend.value && trend.hasEnoughData) {
    const direction = trend.value.direction;
    const isPositive = direction === 'up';
    
    insights.push({
      id: generateInsightId('sales-trend', today),
      type: 'sales-trend',
      headline: lang === 'hi'
        ? (direction === 'up' ? 'बिक्री बढ़ रही है' : direction === 'down' ? 'बिक्री घट रही है' : 'बिक्री स्थिर है')
        : (direction === 'up' ? 'Sales are going up' : direction === 'down' ? 'Sales are going down' : 'Sales are stable'),
      figure: `${trend.value.percentageChange > 0 ? '+' : ''}${trend.value.percentageChange}%`,
      action: lang === 'hi'
        ? (isPositive ? 'अच्छा चल रहा है!' : 'क्या कारण पता करें')
        : (isPositive ? 'Great momentum!' : 'Find out the reason'),
      period: lang === 'hi' ? 'पिछले 4 हफ्ते' : 'Last 4 weeks',
      moneyImpact: Math.abs(trend.value.percentageChange) * 1000, // Estimate impact
      isPositive,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 3. Biggest cost insight
  const expenses = calc.calculateExpensesByCategory(data, 'this-month');
  if (expenses.value && expenses.value.length > 0 && expenses.hasEnoughData) {
    const biggest = expenses.value[0];
    
    insights.push({
      id: generateInsightId('biggest-cost', today),
      type: 'biggest-cost',
      headline: lang === 'hi' ? 'सबसे बड़ा खर्चा' : 'Biggest expense',
      figure: `${getCategoryName(biggest.category, lang)}: ${formatCurrency(biggest.amount)}`,
      action: lang === 'hi' ? 'क्या कम हो सकता है?' : 'Can this be reduced?',
      period: lang === 'hi' ? 'इस महीने' : 'This month',
      moneyImpact: biggest.amount,
      isPositive: false,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 4. Cost increased insight (compare this month vs last month)
  const thisMonthExp = calc.calculateExpensesByCategory(data, 'this-month');
  const lastMonthExp = calc.calculateExpensesByCategory(data, 'last-month');
  
  if (thisMonthExp.value && lastMonthExp.value && thisMonthExp.hasEnoughData && lastMonthExp.hasEnoughData) {
    // Find category with biggest increase
    let maxIncrease = 0;
    let increasedCategory = '';
    
    thisMonthExp.value.forEach(cat => {
      const lastMonth = lastMonthExp.value!.find(lm => lm.category === cat.category);
      const lastAmount = lastMonth?.amount || 0;
      const increase = cat.amount - lastAmount;
      
      if (increase > maxIncrease) {
        maxIncrease = increase;
        increasedCategory = cat.category;
      }
    });
    
    if (maxIncrease > 0) {
      insights.push({
        id: generateInsightId('cost-increased', today),
        type: 'cost-increased',
        headline: lang === 'hi' ? 'खर्चा बढ़ा' : 'Cost increased',
        figure: `${getCategoryName(increasedCategory, lang)}: +${formatCurrency(maxIncrease)}`,
        action: lang === 'hi' ? 'कारण पता करें' : 'Find out why',
        period: lang === 'hi' ? 'पिछले महीने से' : 'Compared to last month',
        moneyImpact: maxIncrease,
        isPositive: false,
        isGeneralTip: false,
        date: today,
      });
    }
  }
  
  // 5. Udhaar to collect insight
  const udhaarStats = calc.calculateUdhaarStats(data);
  if (udhaarStats.totalPending > 0) {
    const overdueCount = udhaarStats.overdue.length;
    
    insights.push({
      id: generateInsightId('udhaar-collect', today),
      type: 'udhaar-collect',
      headline: lang === 'hi' ? 'उधार वसूलें' : 'Collect udhaar',
      figure: `${formatCurrency(udhaarStats.totalPending)} ${lang === 'hi' ? 'बाकी' : 'pending'}`,
      action: lang === 'hi'
        ? (overdueCount > 0 ? `${overdueCount} overdue - आज याद दिलाएं` : 'विनम्र रिमाइंडर भेजें')
        : (overdueCount > 0 ? `${overdueCount} overdue - remind today` : 'Send gentle reminder'),
      period: lang === 'hi' ? 'कुल बाकी' : 'Total pending',
      moneyImpact: udhaarStats.totalPending,
      isPositive: false,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 6. Best-selling item insight (if items tracked)
  if (data.sales.length > 0) {
    const salesByItem: Record<string, number> = {};
    data.sales.filter(s => !s.deleted && s.item).forEach(s => {
      salesByItem[s.item!] = (salesByItem[s.item!] || 0) + s.amount;
    });
    
    const items = Object.entries(salesByItem).sort((a, b) => b[1] - a[1]);
    if (items.length > 0) {
      const [bestItem, bestAmount] = items[0];
      
      insights.push({
        id: generateInsightId('best-selling', today),
        type: 'best-selling',
        headline: lang === 'hi' ? 'सबसे ज़्यादा बिका' : 'Best seller',
        figure: `${bestItem}: ${formatCurrency(bestAmount)}`,
        action: lang === 'hi' ? 'स्टॉक में रखें' : 'Keep it in stock',
        period: lang === 'hi' ? 'इस महीने' : 'This month',
        moneyImpact: bestAmount,
        isPositive: true,
        isGeneralTip: false,
        date: today,
      });
    }
  }
  
  // 7. Cash safety insight
  const cash = calc.estimateCashInHand(data, profile);
  const breakEven = calc.calculateBreakEven(profile);
  
  if (cash.value !== null && breakEven.value !== null) {
    const daysOfCash = cash.value / (breakEven.value || 1);
    const isSafe = daysOfCash >= 7;
    
    insights.push({
      id: generateInsightId('cash-safety', today),
      type: 'cash-safety',
      headline: lang === 'hi' ? 'नकद स्थिति' : 'Cash position',
      figure: `${formatCurrency(cash.value)} (${Math.round(daysOfCash)} ${lang === 'hi' ? 'दिन' : 'days'})`,
      action: lang === 'hi'
        ? (isSafe ? 'अच्छी स्थिति' : 'नकद बढ़ाएं')
        : (isSafe ? 'Good position' : 'Build up cash'),
      period: lang === 'hi' ? 'आज' : 'Today',
      moneyImpact: cash.value,
      isPositive: isSafe,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 8. Target progress insight
  if (profile.profitTarget && profile.profitTarget > 0) {
    const thisMonth = calc.calculatePeriodStats(data, 'this-month');
    if (thisMonth.value && thisMonth.hasEnoughData) {
      const progress = (thisMonth.value.profit / profile.profitTarget) * 100;
      const isOnTrack = progress >= 50; // At least 50% by mid-month
      
      insights.push({
        id: generateInsightId('target-progress', today),
        type: 'target-progress',
        headline: lang === 'hi' ? 'लक्ष्य की प्रगति' : 'Target progress',
        figure: `${Math.round(progress)}% ${lang === 'hi' ? 'पूरा' : 'complete'}`,
        action: lang === 'hi'
          ? (isOnTrack ? 'बढ़िया चल रहा है!' : 'और मेहनत करें')
          : (isOnTrack ? 'Great progress!' : 'Push harder'),
        period: lang === 'hi' ? `लक्ष्य: ${formatCurrency(profile.profitTarget)}` : `Target: ${formatCurrency(profile.profitTarget)}`,
        moneyImpact: Math.abs(profile.profitTarget - thisMonth.value.profit),
        isPositive: isOnTrack,
        isGeneralTip: false,
        date: today,
      });
    }
  }
  
  // 9. Win/celebration insight (always include at least one positive)
  const bestDay = calc.findHighestSellingDay(data);
  if (bestDay.value && bestDay.hasEnoughData) {
    insights.push({
      id: generateInsightId('win', today),
      type: 'win',
      headline: lang === 'hi' ? 'सबसे अच्छा दिन' : 'Best day ever',
      figure: formatCurrency(bestDay.value.sales),
      action: lang === 'hi' ? 'क्या विशेष था? दोहराएं!' : 'What was special? Repeat it!',
      period: bestDay.value.date,
      moneyImpact: bestDay.value.sales,
      isPositive: true,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 10. Weekday pattern insight
  const busiest = calc.findBusiestWeekday(data, 'this-month');
  if (busiest.value && busiest.hasEnoughData) {
    insights.push({
      id: generateInsightId('weekday-pattern', today),
      type: 'weekday-pattern',
      headline: lang === 'hi' ? 'सबसे व्यस्त दिन' : 'Busiest day',
      figure: `${busiest.value.day}: ${formatCurrency(busiest.value.sales)}`,
      action: lang === 'hi' ? 'उस दिन तैयार रहें' : 'Be ready on that day',
      period: lang === 'hi' ? 'इस महीने' : 'This month',
      moneyImpact: busiest.value.sales,
      isPositive: true,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // 11. Break-even insight
  if (breakEven.value !== null && breakEven.hasEnoughData) {
    const thisMonth = calc.calculatePeriodStats(data, 'this-month');
    const avgDaily = thisMonth.value ? thisMonth.value.totalSales / 30 : 0;
    const isAboveBreakEven = avgDaily > breakEven.value;
    
    insights.push({
      id: generateInsightId('break-even', today),
      type: 'break-even',
      headline: lang === 'hi' ? 'ब्रेक-ईवन' : 'Break-even',
      figure: `${formatCurrency(breakEven.value)} ${lang === 'hi' ? 'प्रति दिन' : 'per day'}`,
      action: lang === 'hi'
        ? (isAboveBreakEven ? 'अच्छा! आप ऊपर हैं' : 'बिक्री बढ़ाएं')
        : (isAboveBreakEven ? 'Good! You are above' : 'Increase sales'),
      period: lang === 'hi' ? 'ज़रूरी बिक्री' : 'Required sales',
      moneyImpact: Math.abs(avgDaily - breakEven.value) * 30,
      isPositive: isAboveBreakEven,
      isGeneralTip: false,
      date: today,
    });
  }
  
  // If we have less than 8 real insights, add general tips
  if (insights.length < 8) {
    const shopType = profile.shopType || 'general';
    const generalTips = getGeneralTips(shopType, lang);
    
    generalTips.forEach((tip, index) => {
      if (insights.length < 8) {
        insights.push({
          id: `general-tip-${index}-${today}`,
          type: 'win', // Use 'win' type for general tips
          headline: tip.headline,
          figure: '',
          action: tip.action,
          period: lang === 'hi' ? 'सामान्य सलाह' : 'General tip',
          moneyImpact: 0,
          isPositive: true,
          isGeneralTip: true,
          requiresMoreData: tip.requiresMoreData,
          date: today,
        });
      }
    });
  }
  
  // Sort by money impact (descending)
  insights.sort((a, b) => b.moneyImpact - a.moneyImpact);
  
  // Return top 10
  return insights.slice(0, 10);
}

// Get general tips based on shop type
function getGeneralTips(shopType: string, lang: 'en' | 'hi'): Array<{headline: string; action: string; requiresMoreData: string}> {
  const tips: Record<string, Array<{headline: string; action: string; requiresMoreData: string}>> = {
    'kirana': [
      {
        headline: lang === 'hi' ? 'Fast-moving items स्टॉक में रखें' : 'Keep fast-moving items in stock',
        action: lang === 'hi' ? 'रोज़ चेक करें' : 'Check daily',
        requiresMoreData: lang === 'hi' ? '5 दिन और बिक्री डालें' : 'Add 5 more days of sales',
      },
      {
        headline: lang === 'hi' ? 'UPI payment स्वीकार करें' : 'Accept UPI payments',
        action: lang === 'hi' ? 'QR कोड लगाएं' : 'Put up QR code',
        requiresMoreData: lang === 'hi' ? '3 दिन और डेटा डालें' : 'Add 3 more days of data',
      },
    ],
    'medical': [
      {
        headline: lang === 'hi' ? 'Expiry dates चेक करें' : 'Check expiry dates',
        action: lang === 'hi' ? 'हर हफ्ते देखें' : 'Check every week',
        requiresMoreData: lang === 'hi' ? 'स्टॉक डेटा डालें' : 'Add stock data',
      },
    ],
    'bakery': [
      {
        headline: lang === 'hi' ? 'Fresh items रोज़ बनाएं' : 'Make fresh items daily',
        action: lang === 'hi' ? 'सुबह जल्दी शुरू करें' : 'Start early morning',
        requiresMoreData: lang === 'hi' ? 'बिक्री डेटा डालें' : 'Add sales data',
      },
    ],
    'default': [
      {
        headline: lang === 'hi' ? 'ग्राहक सेवा पर ध्यान दें' : 'Focus on customer service',
        action: lang === 'hi' ? 'मुस्कुराकर बात करें' : 'Talk with a smile',
        requiresMoreData: lang === 'hi' ? 'और डेटा डालें' : 'Add more data',
      },
      {
        headline: lang === 'hi' ? 'Digital payments स्वीकार करें' : 'Accept digital payments',
        action: lang === 'hi' ? 'UPI QR लगाएं' : 'Put up UPI QR',
        requiresMoreData: lang === 'hi' ? '3 दिन और डेटा डालें' : 'Add 3 more days of data',
      },
    ],
  };
  
  return tips[shopType] || tips['default'];
}

// Get category name in user's language
function getCategoryName(category: string, lang: 'en' | 'hi'): string {
  const names: Record<string, {en: string; hi: string}> = {
    'stock': { en: 'Stock', hi: 'सामान' },
    'rent': { en: 'Rent', hi: 'किराया' },
    'electricity': { en: 'Electricity', hi: 'बिजली' },
    'salary': { en: 'Salary', hi: 'तनख्वाह' },
    'transport': { en: 'Transport', hi: 'ट्रांसपोर्ट' },
    'other': { en: 'Other', hi: 'अन्य' },
  };
  
  return names[category]?.[lang] || category;
}

// Check if insight was shown in last 7 days
export function wasInsightShownRecently(
  insightType: InsightType,
  history: DailyInsights[],
  days: number = 7
): boolean {
  const today = new Date();
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - days);
  
  return history.some(day => {
    const dayDate = new Date(day.date);
    if (dayDate < cutoffDate) return false;
    
    return day.insights.some(i => i.type === insightType);
  });
}

// Get insights for a specific date
export function getInsightsForDate(
  date: string,
  history: DailyInsights[]
): DailyInsights | null {
  return history.find(d => d.date === date) || null;
}

// Save daily insights
export function saveDailyInsights(
  insights: DailyInsight[],
  history: DailyInsights[]
): DailyInsights[] {
  const today = getToday();
  const existing = history.findIndex(d => d.date === today);
  
  const dailyInsights: DailyInsights = {
    date: today,
    insights,
    feedback: existing >= 0 ? history[existing].feedback : {},
  };
  
  if (existing >= 0) {
    history[existing] = dailyInsights;
  } else {
    history.push(dailyInsights);
  }
  
  return history;
}

// Record feedback for an insight
export function recordInsightFeedback(
  insightId: string,
  feedback: 'yes' | 'no',
  history: DailyInsights[]
): DailyInsights[] {
  const today = getToday();
  const dayIndex = history.findIndex(d => d.date === today);
  
  if (dayIndex >= 0) {
    history[dayIndex].feedback[insightId] = feedback;
  }
  
  return history;
}

// Get insights user marked as not useful (to show fewer of that type)
export function getUnhelpfulInsightTypes(history: DailyInsights[]): InsightType[] {
  const unhelpful: Record<InsightType, number> = {} as any;
  
  history.forEach(day => {
    day.insights.forEach(insight => {
      if (day.feedback[insight.id] === 'no') {
        unhelpful[insight.type] = (unhelpful[insight.type] || 0) + 1;
      }
    });
  });
  
  // Return types marked as unhelpful 2+ times
  return Object.entries(unhelpful)
    .filter(([_, count]) => count >= 2)
    .map(([type, _]) => type as InsightType);
}
