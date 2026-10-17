// Insight models and engine

export interface Insight {
  id: string;
  type: InsightType;
  headline: string;
  explanation: string;
  action: string;
  dataSource: string; // What data it's based on
  isEstimate: boolean; // True if based on general industry data
  priority: number; // Higher = more important (money impact)
  timestamp: number;
  feedback?: 'yes' | 'no' | null;
}

export type InsightType = 
  | 'profit'
  | 'costs'
  | 'udhaar'
  | 'stock'
  | 'season'
  | 'pricing'
  | 'cash-safety'
  | 'win';

export interface AlertPreferences {
  profit: boolean;
  costs: boolean;
  udhaar: boolean;
  stock: boolean;
  season: boolean;
  pricing: boolean;
  cashSafety: boolean;
  wins: boolean;
}

export interface InsightHistory {
  shown: string[]; // Insight IDs shown to user
  feedback: Record<string, 'yes' | 'no'>; // User feedback on insights
  lastGenerated: number; // Timestamp of last insight generation
  dailyCount: number; // How many insights shown today
  lastDate: string; // Date string for daily reset
}

import { ShopData, getToday, calculateDailyTotals, formatCurrency } from './data';
import { ShopProfile } from '../context/AppContext';

// Generate insights based on data and profile
export function generateInsights(
  data: ShopData, 
  profile: ShopProfile, 
  history: InsightHistory,
  preferences: AlertPreferences
): Insight[] {
  const insights: Insight[] = [];
  const today = getToday();
  
  // Reset daily count if new day
  if (history.lastDate !== today) {
    history.dailyCount = 0;
    history.lastDate = today;
  }

  // Max 3 insights per day
  if (history.dailyCount >= 3) return [];

  // Check data sufficiency
  const dailyTotals = calculateDailyTotals(data);
  const hasEnoughData = dailyTotals.length >= 7;

  // Generate each type
  if (preferences.profit) {
    const profitInsight = generateProfitInsight(data, profile, hasEnoughData);
    if (profitInsight) insights.push(profitInsight);
  }

  if (preferences.costs) {
    const costInsight = generateCostInsight(data, profile, hasEnoughData);
    if (costInsight) insights.push(costInsight);
  }

  if (preferences.udhaar) {
    const udhaarInsight = generateUdhaarInsight(data, profile);
    if (udhaarInsight) insights.push(udhaarInsight);
  }

  if (preferences.cashSafety) {
    const cashInsight = generateCashSafetyInsight(data, profile, hasEnoughData);
    if (cashInsight) insights.push(cashInsight);
  }

  if (preferences.wins) {
    const winInsight = generateWinInsight(data, profile, hasEnoughData);
    if (winInsight) insights.push(winInsight);
  }

  if (preferences.season) {
    const seasonInsight = generateSeasonInsight(data, profile);
    if (seasonInsight) insights.push(seasonInsight);
  }

  // Sort by priority (money impact)
  insights.sort((a, b) => b.priority - a.priority);

  // Return only what fits in daily limit
  return insights.slice(0, 3 - history.dailyCount);
}

function generateProfitInsight(data: ShopData, profile: ShopProfile, hasEnoughData: boolean): Insight | null {
  const dailyTotals = calculateDailyTotals(data);
  
  if (!hasEnoughData) {
    return {
      id: 'profit-insufficient',
      type: 'profit',
      headline: 'Add 7 days of data',
      explanation: `You have ${dailyTotals.length} days of data. Add 7 more days to see profit trends and comparisons.`,
      action: 'Add today\'s sales and expenses',
      dataSource: 'Your sales and expense entries',
      isEstimate: false,
      priority: 5,
      timestamp: Date.now(),
    };
  }

  // Calculate week comparison
  const last7Days = dailyTotals.slice(-7);
  const prev7Days = dailyTotals.slice(-14, -7);
  
  const thisWeekSales = last7Days.reduce((sum, d) => sum + d.totalSales, 0);
  const thisWeekExpenses = last7Days.reduce((sum, d) => sum + d.totalExpenses, 0);
  const thisWeekProfit = thisWeekSales - thisWeekExpenses;
  
  const prevWeekSales = prev7Days.reduce((sum, d) => sum + d.totalSales, 0);
  const prevWeekExpenses = prev7Days.reduce((sum, d) => sum + d.totalExpenses, 0);
  const prevWeekProfit = prevWeekSales - prevWeekExpenses;

  const profitChange = thisWeekProfit - prevWeekProfit;
  const profitPerSale = thisWeekSales > 0 ? (thisWeekProfit / thisWeekSales) * 100 : 0;

  if (profitChange > 0) {
    return {
      id: 'profit-increase',
      type: 'profit',
      headline: 'Your profit grew this week',
      explanation: `You earned ${formatCurrency(thisWeekProfit)} profit this week, which is ${formatCurrency(profitChange)} more than last week. For every ₹100 in sales, you keep ₹${profitPerSale.toFixed(0)} as profit.`,
      action: 'Keep tracking daily to see trends',
      dataSource: 'From your last 14 days of sales and expenses',
      isEstimate: false,
      priority: 8,
      timestamp: Date.now(),
    };
  } else if (profitChange < 0) {
    return {
      id: 'profit-decrease',
      type: 'profit',
      headline: 'Profit dropped this week',
      explanation: `You earned ${formatCurrency(thisWeekProfit)} profit this week, which is ${formatCurrency(Math.abs(profitChange))} less than last week. Check if expenses went up or sales went down.`,
      action: 'Review your expense categories',
      dataSource: 'From your last 14 days of sales and expenses',
      isEstimate: false,
      priority: 9,
      timestamp: Date.now(),
    };
  }

  return null;
}

function generateCostInsight(data: ShopData, profile: ShopProfile, hasEnoughData: boolean): Insight | null {
  if (!hasEnoughData) return null;

  const expenses = data.expenses.filter(e => !e.deleted);
  if (expenses.length === 0) return null;

  // Group by category
  const byCategory: Record<string, number> = {};
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  // Find biggest category
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const [biggestCategory, biggestAmount] = sorted[0];

  const categoryLabels: Record<string, string> = {
    stock: 'stock purchases',
    rent: 'rent',
    electricity: 'electricity',
    salary: 'salaries',
    transport: 'transport',
    other: 'other expenses',
  };

  return {
    id: 'cost-biggest',
    type: 'costs',
    headline: `${categoryLabels[biggestCategory]} is your biggest expense`,
    explanation: `You spent ${formatCurrency(biggestAmount)} on ${categoryLabels[biggestCategory]}. This is ${((biggestAmount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(0)}% of your total expenses.`,
    action: biggestCategory === 'stock' 
      ? 'Check if you can negotiate better rates with suppliers'
      : biggestCategory === 'rent'
      ? 'See if your rent is due soon and plan ahead'
      : 'Look for ways to reduce this category',
    dataSource: 'From your expense entries',
    isEstimate: false,
    priority: 7,
    timestamp: Date.now(),
  };
}

function generateUdhaarInsight(data: ShopData, profile: ShopProfile): Insight | null {
  const pendingUdhaar = data.udhaar.filter(u => !u.deleted && u.status === 'pending');
  
  if (pendingUdhaar.length === 0) return null;

  const totalOwed = pendingUdhaar.reduce((sum, u) => sum + u.amount, 0);
  const today = getToday();
  const overdue = pendingUdhaar.filter(u => u.promisedDate && u.promisedDate < today);
  
  if (overdue.length > 0) {
    return {
      id: 'udhaar-overdue',
      type: 'udhaar',
      headline: `${overdue.length} customers haven't paid on time`,
      explanation: `You're owed ${formatCurrency(overdue.reduce((sum, u) => sum + u.amount, 0))} from ${overdue.length} customers who promised to pay but haven't. Total pending udhaar is ${formatCurrency(totalOwed)}.`,
      action: 'Send gentle reminders today',
      dataSource: 'From your udhaar entries',
      isEstimate: false,
      priority: 10,
      timestamp: Date.now(),
    };
  }

  if (totalOwed > 10000) {
    return {
      id: 'udhaar-high',
      type: 'udhaar',
      headline: 'Your udhaar is growing',
      explanation: `${formatCurrency(totalOwed)} is pending from ${pendingUdhaar.length} customers. This is money that could be used for stock or expenses.`,
      action: 'Consider reducing new udhaar or collecting old amounts',
      dataSource: 'From your udhaar entries',
      isEstimate: false,
      priority: 8,
      timestamp: Date.now(),
    };
  }

  return null;
}

function generateCashSafetyInsight(data: ShopData, profile: ShopProfile, hasEnoughData: boolean): Insight | null {
  if (!hasEnoughData) return null;

  const last7Days = calculateDailyTotals(data).slice(-7);
  const totalSales = last7Days.reduce((sum, d) => sum + d.totalSales, 0);
  const totalExpenses = last7Days.reduce((sum, d) => sum + d.totalExpenses, 0);

  if (totalExpenses > totalSales * 0.9 && totalSales > 0) {
    return {
      id: 'cash-warning',
      type: 'cash-safety',
      headline: 'Expenses are close to sales',
      explanation: `This week you spent ${formatCurrency(totalExpenses)} out of ${formatCurrency(totalSales)} in sales. That's ${((totalExpenses / totalSales) * 100).toFixed(0)}% — very close to breaking even.`,
      action: 'Check which expenses can be reduced this week',
      dataSource: 'From your last 7 days of sales and expenses',
      isEstimate: false,
      priority: 9,
      timestamp: Date.now(),
    };
  }

  return null;
}

function generateWinInsight(data: ShopData, profile: ShopProfile, hasEnoughData: boolean): Insight | null {
  if (!hasEnoughData) return null;

  const last7Days = calculateDailyTotals(data).slice(-7);
  const bestDay = last7Days.reduce((best, day) => 
    day.totalSales > best.totalSales ? day : best
  , last7Days[0]);

  if (bestDay.totalSales > 0) {
    return {
      id: 'win-best-day',
      type: 'win',
      headline: 'Great sales day!',
      explanation: `Your best day this week was ${new Date(bestDay.date).toLocaleDateString('en-IN', { weekday: 'long' })} with ${formatCurrency(bestDay.totalSales)} in sales. That's ${formatCurrency(bestDay.totalSales - bestDay.totalExpenses)} profit.`,
      action: 'Think about what made that day special and repeat it',
      dataSource: 'From your last 7 days of sales',
      isEstimate: false,
      priority: 6,
      timestamp: Date.now(),
    };
  }

  return null;
}

function generateSeasonInsight(data: ShopData, profile: ShopProfile): Insight | null {
  const now = new Date();
  const month = now.getMonth();
  const shopType = profile.shopType;

  // Festival/season logic
  if (month === 9 || month === 10) { // Oct-Nov: Diwali season
    if (shopType === 'kirana' || shopType === 'sweet') {
      return {
        id: 'season-diwali',
        type: 'season',
        headline: 'Diwali season is coming',
        explanation: 'People buy more sweets, dry fruits, and gifts. Stock up on popular items 2 weeks before Diwali.',
        action: 'Check your stock of sweets and gift items',
        dataSource: 'Based on typical festival patterns',
        isEstimate: true,
        priority: 7,
        timestamp: Date.now(),
      };
    }
  }

  if (month === 5 || month === 6) { // Jun-Jul: Monsoon
    if (shopType === 'vegetable') {
      return {
        id: 'season-monsoon',
        type: 'season',
        headline: 'Monsoon is here',
        explanation: 'Vegetables spoil faster in humidity. Order smaller quantities more frequently.',
        action: 'Reduce daily stock orders by 20%',
        dataSource: 'Based on seasonal patterns',
        isEstimate: true,
        priority: 6,
        timestamp: Date.now(),
      };
    }
  }

  return null;
}
