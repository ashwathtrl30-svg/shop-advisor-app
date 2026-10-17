import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Language } from '../i18n/translations';
import { ShopData, SaleEntry, ExpenseEntry, UdhaarEntry, DailyTotal, generateId, getToday } from '../models/data';

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
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const initialShopData: ShopData = {
  sales: [],
  expenses: [],
  udhaar: [],
  dailyTotals: [],
  streak: 0,
  enableStockTracking: false,
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
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
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

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dukaandost-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    try {
      const toSave = {
        language: state.language,
        onboardingStep: state.onboardingStep,
        currentQuestion: state.currentQuestion,
        phoneNumber: state.phoneNumber,
        shopProfile: state.shopProfile,
        tourStep: state.tourStep,
        darkMode: state.darkMode,
        shopData: state.shopData,
      };
      localStorage.setItem('dukaandost-state', JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state:', e);
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
