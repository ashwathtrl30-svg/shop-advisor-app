import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Language } from '../i18n/translations';
import { ShopData, SaleEntry, ExpenseEntry, UdhaarEntry, DailyTotal, generateId, getToday } from '../models/data';
import { AlertPreferences, InsightHistory } from '../models/insights';
import { LessonProgress, DailyLessonSelection } from '../models/lessons';
import { saveState, loadState, clearState, StorageError } from '../services/storage';
import { DailyInsights } from '../services/dailyInsights';

// Shop profile data
export interface ShopProfile {
  shopType?: string;
  shopName?: string;
  city?: string;
  duration?: string;
  ownership?: string;
  workers?: string;
  monthlySales?: string;
  credit?: string;
  accounts?: string;
  worries?: string[];
  // Phase A: Additional shop numbers
  mainItems?: string[]; // 3-5 main items sold
  busiestDays?: string[]; // Busiest days of week
  busiestHours?: string; // Busiest hours
  monthlyRent?: number; // Monthly rent (0 if owned)
  monthlySalaries?: number; // Total monthly salaries
  monthlyFixedCosts?: number; // Electricity + other fixed costs
  monthlyLoanInstallment?: number; // Monthly loan EMI (if any)
  openingCash?: number; // Cash at start of day
  existingUdhaar?: number; // Udhaar pending before app
  profitTarget?: number; // Monthly profit target
  appGoal?: string; // What user wants from app
}

// Onboarding steps
export type OnboardingStep =
  | 'language'
  | 'welcome'
  | 'phone'
  | 'otp'
  | 'interview'
  | 'profile-summary'
  | 'tour'
  | 'complete';

// App state
export interface AppState {
  language: Language | null;
  onboardingStep: OnboardingStep;
  currentQuestion: number;
  phoneNumber: string;
  shopProfile: ShopProfile;
  tourStep: number;
  darkMode: boolean;
  isOffline: boolean;
  activeTab: string;
  shopData: ShopData;
  lastAction: { type: string; id: string; timestamp: number } | null;
  insightHistory: InsightHistory;
  alertPreferences: AlertPreferences;
  lessonProgress: LessonProgress;
  alertsEnabled: {
    insights: boolean;
    udhaar: boolean;
    festivals: boolean;
    dailyReminder: boolean;
  };
  showScreen: 'main' | 'alerts' | 'privacy' | 'help' | 'profile' | 'report';
  isLoading: boolean;
  storageError: StorageError | null;
  dailyInsights: DailyInsights[];
}

// Actions
type Action =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_STEP'; payload: OnboardingStep }
  | { type: 'SET_QUESTION'; payload: number }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<ShopProfile> }
  | { type: 'SET_TOUR_STEP'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_OFFLINE'; payload: boolean }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'ADD_SALE'; payload: SaleEntry }
  | { type: 'ADD_EXPENSE'; payload: ExpenseEntry }
  | { type: 'ADD_UDHAAR'; payload: UdhaarEntry }
  | { type: 'UPDATE_UDHAAR'; payload: { id: string; updates: Partial<UdhaarEntry> } }
  | { type: 'DELETE_ENTRY'; payload: { type: 'sale' | 'expense' | 'udhaar'; id: string } }
  | { type: 'UNDO_DELETE'; payload: { type: 'sale' | 'expense' | 'udhaar'; id: string } }
  | { type: 'SET_DAILY_TOTAL'; payload: DailyTotal }
  | { type: 'SET_REMINDER_TIME'; payload: string }
  | { type: 'TOGGLE_STOCK_TRACKING' }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'SET_LAST_ACTION'; payload: { type: string; id: string; timestamp: number } | null }
  | { type: 'ADD_INSIGHT'; payload: string }
  | { type: 'SET_INSIGHT_FEEDBACK'; payload: { id: string; feedback: 'yes' | 'no' } }
  | { type: 'UPDATE_INSIGHT_HISTORY'; payload: Partial<InsightHistory> }
  | { type: 'UPDATE_ALERT_PREFERENCES'; payload: Partial<AlertPreferences> }
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'SET_QUIZ_SCORE'; payload: { lessonId: string; score: number } }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: LessonProgress }
  | { type: 'TOGGLE_ALERT'; payload: keyof AppState['alertsEnabled'] }
  | { type: 'SET_SCREEN'; payload: 'main' | 'alerts' | 'privacy' | 'help' | 'profile' | 'report' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STORAGE_ERROR'; payload: StorageError | null }
  | { type: 'SET_DAILY_INSIGHTS'; payload: DailyInsights[] }
  | { type: 'RECORD_INSIGHT_FEEDBACK'; payload: { insightId: string; feedback: 'yes' | 'no' } }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'CLEAR_ALL_DATA' };

const initialShopData: ShopData = {
  sales: [],
  expenses: [],
  udhaar: [],
  dailyTotals: [],
  streak: 0,
  enableStockTracking: false,
};

const initialInsightHistory: InsightHistory = {
  shown: [],
  feedback: {},
  lastGenerated: 0,
  dailyCount: 0,
  lastDate: '',
};

const initialAlertPreferences: AlertPreferences = {
  profit: true,
  costs: true,
  udhaar: true,
  stock: true,
  season: true,
  pricing: true,
  cashSafety: true,
  wins: true,
};

const initialLessonProgress: LessonProgress = {
  totalLessons: 50, // Will be updated when library is complete
  lessonsShown: [],
  lessonsCompleted: [],
  dailySelections: [],
  currentStreak: 0,
  longestStreak: 0,
};

const initialAlertsEnabled = {
  insights: true,
  udhaar: true,
  festivals: true,
  dailyReminder: true,
};

const initialState: AppState = {
  language: null,
  onboardingStep: 'language',
  currentQuestion: 0,
  phoneNumber: '',
  shopProfile: {},
  tourStep: 0,
  darkMode: false,
  isOffline: false,
  activeTab: 'home',
  shopData: initialShopData,
  lastAction: null,
  insightHistory: initialInsightHistory,
  alertPreferences: initialAlertPreferences,
  lessonProgress: initialLessonProgress,
  alertsEnabled: initialAlertsEnabled,
  showScreen: 'main',
  isLoading: true,
  storageError: null,
  dailyInsights: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_STEP':
      return { ...state, onboardingStep: action.payload };
    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'SET_PHONE':
      return { ...state, phoneNumber: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, shopProfile: { ...state.shopProfile, ...action.payload } };
    case 'SET_TOUR_STEP':
      return { ...state, tourStep: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    
    // Data management
    case 'ADD_SALE':
      return {
        ...state,
        shopData: {
          ...state.shopData,
          sales: [...state.shopData.sales, action.payload],
          lastEntryDate: getToday(),
        },
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        shopData: {
          ...state.shopData,
          expenses: [...state.shopData.expenses, action.payload],
          lastEntryDate: getToday(),
        },
      };
    case 'ADD_UDHAAR':
      return {
        ...state,
        shopData: {
          ...state.shopData,
          udhaar: [...state.shopData.udhaar, action.payload],
        },
      };
    case 'UPDATE_UDHAAR':
      return {
        ...state,
        shopData: {
          ...state.shopData,
          udhaar: state.shopData.udhaar.map(u =>
            u.id === action.payload.id ? { ...u, ...action.payload.updates } : u
          ),
        },
      };
    case 'DELETE_ENTRY':
      const { type: entryType, id } = action.payload;
      if (entryType === 'sale') {
        return {
          ...state,
          shopData: {
            ...state.shopData,
            sales: state.shopData.sales.map(s =>
              s.id === id ? { ...s, deleted: true } : s
            ),
          },
        };
      } else if (entryType === 'expense') {
        return {
          ...state,
          shopData: {
            ...state.shopData,
            expenses: state.shopData.expenses.map(e =>
              e.id === id ? { ...e, deleted: true } : e
            ),
          },
        };
      } else if (entryType === 'udhaar') {
        return {
          ...state,
          shopData: {
            ...state.shopData,
            udhaar: state.shopData.udhaar.map(u =>
              u.id === id ? { ...u, deleted: true } : u
            ),
          },
        };
      }
      return state;
    case 'UNDO_DELETE':
      const { type: undoType, id: undoId } = action.payload;
      if (undoType === 'sale') {
        return {
          ...state,
          shopData: {
            ...state.shopData,
            sales: state.shopData.sales.map(s =>
              s.id === undoId ? { ...s, deleted: false } : s
            ),
          },
        };
      } else if (undoType === 'expense') {
        return {
          ...state,
          shopData: {
            ...state.shopData,
            expenses: state.shopData.expenses.map(e =>
              e.id === undoId ? { ...e, deleted: false } : e
            ),
          },
        };
      } else if (undoType === 'udhaar') {
        return {
          ...state,
          shopData: {
            ...state.shopData,
            udhaar: state.shopData.udhaar.map(u =>
              u.id === undoId ? { ...u, deleted: false } : u
            ),
          },
        };
      }
      return state;
    case 'SET_DAILY_TOTAL':
      return {
        ...state,
        shopData: {
          ...state.shopData,
          dailyTotals: [
            ...state.shopData.dailyTotals.filter(d => d.date !== action.payload.date),
            action.payload,
          ],
        },
      };
    case 'SET_REMINDER_TIME':
      return { ...state, shopData: { ...state.shopData, reminderTime: action.payload } };
    case 'TOGGLE_STOCK_TRACKING':
      return { ...state, shopData: { ...state.shopData, enableStockTracking: !state.shopData.enableStockTracking } };
    case 'UPDATE_STREAK':
      return { ...state, shopData: { ...state.shopData, streak: action.payload } };
    case 'SET_LAST_ACTION':
      return { ...state, lastAction: action.payload };
    case 'ADD_INSIGHT':
      return {
        ...state,
        insightHistory: {
          ...state.insightHistory,
          shown: [...state.insightHistory.shown, action.payload],
          dailyCount: state.insightHistory.dailyCount + 1,
          lastGenerated: Date.now(),
          lastDate: getToday(),
        },
      };
    case 'SET_INSIGHT_FEEDBACK':
      return {
        ...state,
        insightHistory: {
          ...state.insightHistory,
          feedback: {
            ...state.insightHistory.feedback,
            [action.payload.id]: action.payload.feedback,
          },
        },
      };
    case 'UPDATE_INSIGHT_HISTORY':
      return {
        ...state,
        insightHistory: { ...state.insightHistory, ...action.payload },
      };
    case 'UPDATE_ALERT_PREFERENCES':
      return {
        ...state,
        alertPreferences: { ...state.alertPreferences, ...action.payload },
      };
    case 'COMPLETE_LESSON':
      // This is now handled by UPDATE_LESSON_PROGRESS
      return state;
    case 'SET_QUIZ_SCORE':
      // Quizzes removed in Phase D
      return state;
    case 'UPDATE_LESSON_PROGRESS':
      return {
        ...state,
        lessonProgress: action.payload,
      };
    case 'TOGGLE_ALERT':
      return {
        ...state,
        alertsEnabled: {
          ...state.alertsEnabled,
          [action.payload]: !state.alertsEnabled[action.payload],
        },
      };
    case 'SET_SCREEN':
      return { ...state, showScreen: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STORAGE_ERROR':
      return { ...state, storageError: action.payload };
    case 'SET_DAILY_INSIGHTS':
      return { ...state, dailyInsights: action.payload };
    case 'RECORD_INSIGHT_FEEDBACK': {
      const today = new Date().toISOString().split('T')[0];
      const updatedInsights = state.dailyInsights.map(day => {
        if (day.date === today) {
          return {
            ...day,
            feedback: {
              ...day.feedback,
              [action.payload.insightId]: action.payload.feedback,
            },
          };
        }
        return day;
      });
      return { ...state, dailyInsights: updatedInsights };
    }
    case 'CLEAR_ALL_DATA':
      return {
        ...initialState,
        isLoading: false,
        storageError: null,
      };
    case 'LOAD_STATE':
      return { 
        ...state, 
        ...action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load state from storage on mount
  useEffect(() => {
    const { state: savedState, error } = loadState();
    
    if (error) {
      dispatch({ type: 'SET_STORAGE_ERROR', payload: error });
    }
    
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: savedState });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save state to storage on every change (except loading state changes)
  useEffect(() => {
    if (state.isLoading) return; // Don't save during initial load
    
    const error = saveState(state);
    if (error) {
      dispatch({ type: 'SET_STORAGE_ERROR', payload: error });
    } else if (state.storageError) {
      // Clear error if save succeeded
      dispatch({ type: 'SET_STORAGE_ERROR', payload: null });
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
