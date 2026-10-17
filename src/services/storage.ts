// Centralized storage service for DukaanDost
// All data persistence happens through this module

import { AppState } from '../context/AppContext';

const STORAGE_KEY = 'dukaandost-app-state';
const STORAGE_VERSION = 1;

export interface StorageError {
  type: 'quota' | 'blocked' | 'unknown';
  message: string;
}

export interface StoredData {
  version: number;
  timestamp: number;
  state: Partial<AppState>;
}

// Check if localStorage is available
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Save state to localStorage
export function saveState(state: AppState): StorageError | null {
  if (!isStorageAvailable()) {
    return {
      type: 'blocked',
      message: 'Storage is blocked on this device. Your data may not be saved.',
    };
  }

  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      state: {
        // Save everything except transient UI state
        language: state.language,
        onboardingStep: state.onboardingStep,
        currentQuestion: state.currentQuestion,
        phoneNumber: state.phoneNumber,
        shopProfile: state.shopProfile,
        tourStep: state.tourStep,
        darkMode: state.darkMode,
        activeTab: state.activeTab,
        shopData: state.shopData,
        insightHistory: state.insightHistory,
        alertPreferences: state.alertPreferences,
        lessonProgress: state.lessonProgress,
        alertsEnabled: state.alertsEnabled,
        showScreen: state.showScreen,
        // Don't save: isOffline, lastAction (transient)
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return null;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      return {
        type: 'quota',
        message: 'Storage is full. Your data may not be saved.',
      };
    }
    return {
      type: 'unknown',
      message: 'Could not save data. Your changes may be lost.',
    };
  }
}

// Load state from localStorage
export function loadState(): { state: Partial<AppState> | null; error: StorageError | null } {
  if (!isStorageAvailable()) {
    return {
      state: null,
      error: {
        type: 'blocked',
        message: 'Storage is blocked on this device.',
      },
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: null, error: null };
    }

    const data: StoredData = JSON.parse(raw);

    // Version migration (future-proofing)
    if (data.version !== STORAGE_VERSION) {
      // Migrate old data format to new format
      return {
        state: migrateData(data),
        error: null,
      };
    }

    return { state: data.state, error: null };
  } catch (e) {
    return {
      state: null,
      error: {
        type: 'unknown',
        message: 'Could not load saved data.',
      },
    };
  }
}

// Clear all saved data
export function clearState(): StorageError | null {
  if (!isStorageAvailable()) {
    return {
      type: 'blocked',
      message: 'Storage is blocked on this device.',
    };
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (e) {
    return {
      type: 'unknown',
      message: 'Could not clear data.',
    };
  }
}

// Export data as JSON
export function exportData(state: AppState): string {
  const data: StoredData = {
    version: STORAGE_VERSION,
    timestamp: Date.now(),
    state: {
      language: state.language,
      onboardingStep: state.onboardingStep,
      currentQuestion: state.currentQuestion,
      phoneNumber: state.phoneNumber,
      shopProfile: state.shopProfile,
      tourStep: state.tourStep,
      darkMode: state.darkMode,
      activeTab: state.activeTab,
      shopData: state.shopData,
      insightHistory: state.insightHistory,
      alertPreferences: state.alertPreferences,
      lessonProgress: state.lessonProgress,
      alertsEnabled: state.alertsEnabled,
      showScreen: state.showScreen,
    },
  };

  return JSON.stringify(data, null, 2);
}

// Import data from JSON
export function importData(json: string): { state: Partial<AppState> | null; error: string | null } {
  try {
    const data: StoredData = JSON.parse(json);

    // Validate structure
    if (!data.version || !data.state) {
      return { state: null, error: 'Invalid data format' };
    }

    // Migrate if needed
    if (data.version !== STORAGE_VERSION) {
      return { state: migrateData(data), error: null };
    }

    return { state: data.state, error: null };
  } catch (e) {
    return { state: null, error: 'Could not parse data file' };
  }
}

// Migrate old data format to current format
function migrateData(data: StoredData): Partial<AppState> {
  // Future migration logic goes here
  // For now, just return the state as-is
  return data.state;
}

// Get storage usage info
export function getStorageInfo(): { used: number; available: number } | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const used = raw ? new Blob([raw]).size : 0;
    
    // Estimate available (typically 5-10MB for localStorage)
    const available = 5 * 1024 * 1024; // 5MB estimate
    
    return { used, available };
  } catch (e) {
    return null;
  }
}
