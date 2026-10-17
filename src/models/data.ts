// Data models for shop entries

export interface SaleEntry {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category?: string;
  paymentType: 'cash' | 'upi' | 'udhaar';
  item?: string;
  timestamp: number;
  deleted?: boolean;
}

export interface ExpenseEntry {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: 'stock' | 'rent' | 'electricity' | 'salary' | 'transport' | 'other';
  description?: string;
  timestamp: number;
  deleted?: boolean;
}

export interface UdhaarEntry {
  id: string;
  customerName: string;
  amount: number;
  date: string; // When given
  promisedDate?: string; // When to collect
  notes?: string;
  status: 'pending' | 'paid' | 'overdue';
  timestamp: number;
  deleted?: boolean;
}

export interface DailyTotal {
  date: string; // YYYY-MM-DD
  totalSales: number;
  totalExpenses: number;
  source: 'calculated' | 'manual'; // calculated from entries or manually entered
}

export interface ShopData {
  sales: SaleEntry[];
  expenses: ExpenseEntry[];
  udhaar: UdhaarEntry[];
  dailyTotals: DailyTotal[];
  streak: number;
  lastEntryDate?: string;
  reminderTime?: string; // HH:MM format
  enableStockTracking: boolean;
}

// Helper functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === getToday()) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
  
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
}

export function calculateDailyTotals(data: ShopData): DailyTotal[] {
  const totals: Record<string, DailyTotal> = {};
  
  // Calculate from sales
  data.sales.forEach(sale => {
    if (sale.deleted) return;
    if (!totals[sale.date]) {
      totals[sale.date] = { date: sale.date, totalSales: 0, totalExpenses: 0, source: 'calculated' };
    }
    totals[sale.date].totalSales += sale.amount;
  });

  // Calculate from expenses
  data.expenses.forEach(expense => {
    if (expense.deleted) return;
    if (!totals[expense.date]) {
      totals[expense.date] = { date: expense.date, totalSales: 0, totalExpenses: 0, source: 'calculated' };
    }
    totals[expense.date].totalExpenses += expense.amount;
  });

  // Merge with manual totals
  data.dailyTotals.forEach(manual => {
    if (manual.source === 'manual') {
      if (!totals[manual.date]) {
        totals[manual.date] = manual;
      } else {
        // Manual overrides calculated
        totals[manual.date] = manual;
      }
    }
  });

  return Object.values(totals).sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodaySummary(data: ShopData): { sales: number; expenses: number; profit: number } {
  const today = getToday();
  const sales = data.sales
    .filter(s => s.date === today && !s.deleted)
    .reduce((sum, s) => sum + s.amount, 0);
  
  const expenses = data.expenses
    .filter(e => e.date === today && !e.deleted)
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    sales,
    expenses,
    profit: sales - expenses,
  };
}

export function getPendingUdhaar(data: ShopData): UdhaarEntry[] {
  return data.udhaar
    .filter(u => !u.deleted && u.status === 'pending')
    .sort((a, b) => {
      // Sort by promised date, overdue first
      if (a.promisedDate && b.promisedDate) {
        return a.promisedDate.localeCompare(b.promisedDate);
      }
      return b.timestamp - a.timestamp;
    });
}

export function getOverdueUdhaar(data: ShopData): UdhaarEntry[] {
  const today = getToday();
  return data.udhaar
    .filter(u => !u.deleted && u.promisedDate && u.promisedDate < today && u.status === 'pending')
    .sort((a, b) => a.promisedDate!.localeCompare(b.promisedDate!));
}
