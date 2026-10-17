// Exact-Numbers Calculation Engine
// All calculations work only from saved entries and shop numbers
// Returns "not enough data" instead of guessing

import { ShopData, SaleEntry, ExpenseEntry, UdhaarEntry } from './data';
import { ShopProfile } from '../context/AppContext';

export interface CalculationResult<T> {
  value: T | null;
  hasEnoughData: boolean;
  reason?: string;
  dataQuality?: {
    totalDays: number;
    daysWithData: number;
    percentage: number;
  };
}

export interface PeriodStats {
  totalSales: number;
  totalExpenses: number;
  profit: number;
  entryCount: number;
  daysWithData: number;
}

export interface ComparisonResult {
  currentPeriod: PeriodStats;
  previousPeriod: PeriodStats;
  difference: number;
  percentageChange: number;
  hasEnoughData: boolean;
}

// Date parsing utilities
export function parseDateInput(input: string, lang: 'en' | 'hi'): Date | null {
  const normalized = input.toLowerCase().trim();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // English patterns
  if (lang === 'en') {
    if (normalized === 'today') return today;
    if (normalized === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
    if (normalized === 'this week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return startOfWeek;
    }
    if (normalized === 'last week') {
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
      return startOfLastWeek;
    }
    if (normalized === 'this month') {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }
    if (normalized === 'last month') {
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    }
  }

  // Hindi patterns
  if (lang === 'hi') {
    if (normalized === 'आज' || normalized === 'aaj') return today;
    if (normalized === 'कल' || normalized === 'kal') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    }
    if (normalized === 'पिछले हफ्ते' || normalized === 'pichhle hafte') {
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
      return startOfLastWeek;
    }
    if (normalized === 'इस हफ्ते' || normalized === 'is hafte') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return startOfWeek;
    }
    if (normalized === 'इस महीने' || normalized === 'is mahine') {
      return new Date(today.getFullYear(), today.getMonth(), 1);
    }
    if (normalized === 'पिछले महीने' || normalized === 'pichhle mahine') {
      return new Date(today.getFullYear(), today.getMonth() - 1, 1);
    }
  }

  // Try parsing as date
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    parsed.setHours(0, 0, 0, 0);
    return parsed;
  }

  return null;
}

// Get date range for a period
export function getDateRange(
  period: 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): { start: Date; end: Date } {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  switch (period) {
    case 'today':
      return { start: startOfToday, end: today };
    
    case 'yesterday':
      const yesterday = new Date(startOfToday);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);
      return { start: yesterday, end: yesterdayEnd };
    
    case 'this-week':
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      return { start: startOfWeek, end: today };
    
    case 'last-week':
      const startOfLastWeek = new Date(startOfToday);
      startOfLastWeek.setDate(startOfToday.getDate() - startOfToday.getDay() - 7);
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
      endOfLastWeek.setHours(23, 59, 59, 999);
      return { start: startOfLastWeek, end: endOfLastWeek };
    
    case 'this-month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return { start: startOfMonth, end: today };
    
    case 'last-month':
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      endOfLastMonth.setHours(23, 59, 59, 999);
      return { start: startOfLastMonth, end: endOfLastMonth };
    
    case 'last-3-months':
      const startOf3MonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      return { start: startOf3MonthsAgo, end: today };
    
    case 'this-year':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      return { start: startOfYear, end: today };
    
    case 'custom':
      if (startDate && endDate) {
        return { start: startDate, end: endDate };
      }
      return { start: startOfToday, end: today };
    
    default:
      return { start: startOfToday, end: today };
  }
}

// Filter entries by date range
function filterByDateRange<T extends { date: string }>(
  entries: T[],
  start: Date,
  end: Date
): T[] {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    return entryDate >= start && entryDate <= end;
  });
}

// Count unique days in entries
function countUniqueDays<T extends { date: string }>(entries: T[]): number {
  const uniqueDays = new Set(entries.map(e => e.date));
  return uniqueDays.size;
}

// Calculate period statistics
export function calculatePeriodStats(
  data: ShopData,
  period: 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<PeriodStats> {
  const { start, end } = getDateRange(period, startDate, endDate);
  
  const sales = filterByDateRange(data.sales, start, end).filter(s => !s.deleted);
  const expenses = filterByDateRange(data.expenses, start, end).filter(e => !e.deleted);
  
  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalSales - totalExpenses;
  const entryCount = sales.length + expenses.length;
  const daysWithData = countUniqueDays([...sales, ...expenses]);
  
  // Calculate total days in period
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const hasEnoughData = daysWithData >= Math.min(7, totalDays);
  
  return {
    value: {
      totalSales,
      totalExpenses,
      profit,
      entryCount,
      daysWithData,
    },
    hasEnoughData,
    reason: hasEnoughData ? undefined : `Only ${daysWithData} of ${totalDays} days have entries`,
    dataQuality: {
      totalDays,
      daysWithData,
      percentage: Math.round((daysWithData / totalDays) * 100),
    },
  };
}

// Calculate profit margin
export function calculateProfitMargin(
  data: ShopData,
  period: 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<number> {
  const stats = calculatePeriodStats(data, period, startDate, endDate);
  
  if (!stats.value || stats.value.totalSales === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  const margin = (stats.value.profit / stats.value.totalSales) * 100;
  
  return {
    value: Math.round(margin),
    hasEnoughData: stats.hasEnoughData,
    reason: stats.reason,
    dataQuality: stats.dataQuality,
  };
}

// Calculate average daily sales
export function calculateAverageDailySales(
  data: ShopData,
  period: 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<number> {
  const stats = calculatePeriodStats(data, period, startDate, endDate);
  
  if (!stats.value || stats.value.daysWithData === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No data available',
    };
  }
  
  const average = stats.value.totalSales / stats.value.daysWithData;
  
  return {
    value: Math.round(average),
    hasEnoughData: stats.hasEnoughData,
    reason: stats.reason,
    dataQuality: stats.dataQuality,
  };
}

// Find best and worst days
export function findBestAndWorstDays(
  data: ShopData,
  period: 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<{ best: { date: string; sales: number }; worst: { date: string; sales: number } }> {
  const { start, end } = getDateRange(period, startDate, endDate);
  const sales = filterByDateRange(data.sales, start, end).filter(s => !s.deleted);
  
  if (sales.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  // Group sales by date
  const salesByDate: Record<string, number> = {};
  sales.forEach(sale => {
    salesByDate[sale.date] = (salesByDate[sale.date] || 0) + sale.amount;
  });
  
  const dates = Object.entries(salesByDate);
  if (dates.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  const sorted = dates.sort((a, b) => b[1] - a[1]);
  const best = { date: sorted[0][0], sales: sorted[0][1] };
  const worst = { date: sorted[sorted.length - 1][0], sales: sorted[sorted.length - 1][1] };
  
  return {
    value: { best, worst },
    hasEnoughData: dates.length >= 3,
    reason: dates.length < 3 ? `Only ${dates.length} days with data` : undefined,
  };
}

// Find busiest weekday
export function findBusiestWeekday(
  data: ShopData,
  period: 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<{ day: string; sales: number }> {
  const { start, end } = getDateRange(period, startDate, endDate);
  const sales = filterByDateRange(data.sales, start, end).filter(s => !s.deleted);
  
  if (sales.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  // Group sales by weekday
  const salesByWeekday: Record<number, number> = {};
  sales.forEach(sale => {
    const date = new Date(sale.date);
    const weekday = date.getDay();
    salesByWeekday[weekday] = (salesByWeekday[weekday] || 0) + sale.amount;
  });
  
  const weekdays = Object.entries(salesByWeekday);
  if (weekdays.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  const sorted = weekdays.sort((a, b) => b[1] - a[1]);
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const busiest = { day: weekdayNames[parseInt(sorted[0][0])], sales: sorted[0][1] };
  
  return {
    value: busiest,
    hasEnoughData: Object.keys(salesByWeekday).length >= 5,
    reason: Object.keys(salesByWeekday).length < 5 ? 'Not enough weekdays with data' : undefined,
  };
}

// Find highest-selling day ever
export function findHighestSellingDay(data: ShopData): CalculationResult<{ date: string; sales: number }> {
  if (data.sales.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  // Group sales by date
  const salesByDate: Record<string, number> = {};
  data.sales.filter(s => !s.deleted).forEach(sale => {
    salesByDate[sale.date] = (salesByDate[sale.date] || 0) + sale.amount;
  });
  
  const dates = Object.entries(salesByDate);
  if (dates.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  const sorted = dates.sort((a, b) => b[1] - a[1]);
  
  return {
    value: { date: sorted[0][0], sales: sorted[0][1] },
    hasEnoughData: true,
  };
}

// Calculate expenses by category
export function calculateExpensesByCategory(
  data: ShopData,
  period: 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<{ category: string; amount: number; percentage: number }[]> {
  const { start, end } = getDateRange(period, startDate, endDate);
  const expenses = filterByDateRange(data.expenses, start, end).filter(e => !e.deleted);
  
  if (expenses.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No expense data available',
    };
  }
  
  // Group by category
  const byCategory: Record<string, number> = {};
  expenses.forEach(expense => {
    byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
  });
  
  const totalExpenses = Object.values(byCategory).reduce((sum, amount) => sum + amount, 0);
  
  const result = Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalExpenses) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
  
  return {
    value: result,
    hasEnoughData: true,
  };
}

// Calculate sales by payment type
export function calculateSalesByPaymentType(
  data: ShopData,
  period: 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): CalculationResult<{ type: string; amount: number; percentage: number }[]> {
  const { start, end } = getDateRange(period, startDate, endDate);
  const sales = filterByDateRange(data.sales, start, end).filter(s => !s.deleted);
  
  if (sales.length === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No sales data available',
    };
  }
  
  // Group by payment type
  const byType: Record<string, number> = {};
  sales.forEach(sale => {
    byType[sale.paymentType] = (byType[sale.paymentType] || 0) + sale.amount;
  });
  
  const totalSales = Object.values(byType).reduce((sum, amount) => sum + amount, 0);
  
  const result = Object.entries(byType)
    .map(([type, amount]) => ({
      type,
      amount,
      percentage: Math.round((amount / totalSales) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
  
  return {
    value: result,
    hasEnoughData: true,
  };
}

// Calculate udhaar statistics
export function calculateUdhaarStats(data: ShopData): {
  totalPending: number;
  perCustomer: { name: string; amount: number }[];
  oldestPending: { name: string; amount: number; date: string } | null;
  overdue: { name: string; amount: number; date: string }[];
  collectedThisMonth: number;
} {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const pendingUdhaar = data.udhaar.filter(u => !u.deleted && u.status === 'pending');
  const paidThisMonth = data.udhaar.filter(u => 
    !u.deleted && 
    u.status === 'paid' && 
    new Date(u.date) >= startOfMonth
  );
  
  const totalPending = pendingUdhaar.reduce((sum, u) => sum + u.amount, 0);
  
  // Per customer
  const perCustomerMap: Record<string, number> = {};
  pendingUdhaar.forEach(u => {
    perCustomerMap[u.customerName] = (perCustomerMap[u.customerName] || 0) + u.amount;
  });
  const perCustomer = Object.entries(perCustomerMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
  
  // Oldest pending
  const sorted = [...pendingUdhaar].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const oldestPending = sorted.length > 0 
    ? { name: sorted[0].customerName, amount: sorted[0].amount, date: sorted[0].date }
    : null;
  
  // Overdue
  const overdue = pendingUdhaar
    .filter(u => u.promisedDate && new Date(u.promisedDate) < today)
    .map(u => ({ name: u.customerName, amount: u.amount, date: u.promisedDate! }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Collected this month
  const collectedThisMonth = paidThisMonth.reduce((sum, u) => sum + u.amount, 0);
  
  return {
    totalPending,
    perCustomer,
    oldestPending,
    overdue,
    collectedThisMonth,
  };
}

// Compare two periods
export function comparePeriods(
  data: ShopData,
  currentPeriod: 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months',
  previousPeriod: 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'last-3-months'
): CalculationResult<ComparisonResult> {
  const current = calculatePeriodStats(data, currentPeriod);
  const previous = calculatePeriodStats(data, previousPeriod);
  
  if (!current.value || !previous.value) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'Not enough data for comparison',
    };
  }
  
  const difference = current.value.totalSales - previous.value.totalSales;
  const percentageChange = previous.value.totalSales > 0
    ? Math.round((difference / previous.value.totalSales) * 100)
    : 0;
  
  return {
    value: {
      currentPeriod: current.value,
      previousPeriod: previous.value,
      difference,
      percentageChange,
      hasEnoughData: current.hasEnoughData && previous.hasEnoughData,
    },
    hasEnoughData: current.hasEnoughData && previous.hasEnoughData,
    reason: !current.hasEnoughData || !previous.hasEnoughData
      ? 'Not enough data in one or both periods'
      : undefined,
  };
}

// Calculate break-even sales per day
export function calculateBreakEven(profile: ShopProfile): CalculationResult<number> {
  const rent = profile.monthlyRent || 0;
  const salaries = profile.monthlySalaries || 0;
  const fixedCosts = profile.monthlyFixedCosts || 0;
  const loan = profile.monthlyLoanInstallment || 0;
  
  const totalFixedCosts = rent + salaries + fixedCosts + loan;
  
  if (totalFixedCosts === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'No fixed costs entered',
    };
  }
  
  // Assume 20% profit margin if not specified
  const profitMargin = 0.20;
  const breakEvenMonthly = totalFixedCosts / profitMargin;
  const breakEvenDaily = breakEvenMonthly / 30;
  
  return {
    value: Math.round(breakEvenDaily),
    hasEnoughData: true,
  };
}

// Estimate cash in hand
export function estimateCashInHand(data: ShopData, profile: ShopProfile): CalculationResult<number> {
  const openingCash = profile.openingCash;
  
  if (openingCash === undefined || openingCash === null) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'Opening cash not set',
    };
  }
  
  const today = new Date().toISOString().split('T')[0];
  const todaySales = data.sales.filter(s => s.date === today && !s.deleted && s.paymentType === 'cash');
  const todayExpenses = data.expenses.filter(e => e.date === today && !e.deleted);
  
  const cashSales = todaySales.reduce((sum, s) => sum + s.amount, 0);
  const cashExpenses = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const cashInHand = openingCash + cashSales - cashExpenses;
  
  return {
    value: cashInHand,
    hasEnoughData: true,
  };
}

// Calculate trend over last 4 weeks
export function calculateTrend(data: ShopData): CalculationResult<{
  direction: 'up' | 'down' | 'flat';
  weeklySales: number[];
  percentageChange: number;
}> {
  const weeks: { start: Date; end: Date }[] = [];
  const today = new Date();
  
  // Get last 4 weeks
  for (let i = 3; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(today.getDate() - (i * 7));
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    weeks.push({ start, end });
  }
  
  const weeklySales = weeks.map(week => {
    const sales = filterByDateRange(data.sales, week.start, week.end).filter(s => !s.deleted);
    return sales.reduce((sum, s) => sum + s.amount, 0);
  });
  
  if (weeklySales.filter(s => s > 0).length < 2) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'Not enough weekly data',
    };
  }
  
  // Compare last week to previous week
  const lastWeek = weeklySales[3];
  const previousWeek = weeklySales[2];
  
  if (previousWeek === 0) {
    return {
      value: null,
      hasEnoughData: false,
      reason: 'Previous week has no data',
    };
  }
  
  const percentageChange = Math.round(((lastWeek - previousWeek) / previousWeek) * 100);
  
  let direction: 'up' | 'down' | 'flat';
  if (percentageChange > 5) {
    direction = 'up';
  } else if (percentageChange < -5) {
    direction = 'down';
  } else {
    direction = 'flat';
  }
  
  return {
    value: {
      direction,
      weeklySales,
      percentageChange,
    },
    hasEnoughData: true,
  };
}

// Data quality check
export function checkDataQuality(
  data: ShopData,
  period: 'this-month' | 'last-month' | 'last-3-months' | 'this-year' | 'custom',
  startDate?: Date,
  endDate?: Date
): {
  totalDays: number;
  daysWithData: number;
  percentage: number;
  isReliable: boolean;
  message: string;
} {
  const { start, end } = getDateRange(period, startDate, endDate);
  const sales = filterByDateRange(data.sales, start, end).filter(s => !s.deleted);
  const expenses = filterByDateRange(data.expenses, start, end).filter(e => !e.deleted);
  
  const allEntries = [...sales, ...expenses];
  const daysWithData = countUniqueDays(allEntries);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const percentage = Math.round((daysWithData / totalDays) * 100);
  
  const isReliable = percentage >= 70;
  
  let message = '';
  if (percentage >= 90) {
    message = 'Excellent data coverage';
  } else if (percentage >= 70) {
    message = 'Good data coverage';
  } else if (percentage >= 50) {
    message = 'Moderate data coverage';
  } else {
    message = 'Low data coverage - results may not be reliable';
  }
  
  return {
    totalDays,
    daysWithData,
    percentage,
    isReliable,
    message,
  };
}
