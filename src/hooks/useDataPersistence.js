import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const useDataPersistence = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  // Save state to localStorage
  const saveToLocalStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  // Load state from localStorage
  const loadFromLocalStorage = useCallback((key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }, []);

  // Remove item from localStorage
  const removeFromLocalStorage = useCallback((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, []);

  // Auto-save state to localStorage
  useEffect(() => {
    const saveState = () => {
      // Save specific parts of state that should persist
      const stateToSave = {
        auth: state.auth,
        patients: state.patients,
        appointments: state.appointments,
        referrals: state.referrals,
        databases: state.databases,
        notifications: state.notifications,
        lastSaved: new Date().toISOString()
      };
      
      saveToLocalStorage('app_state', stateToSave);
    };

    // Save state every 30 seconds
    const interval = setInterval(saveState, 30000);
    
    // Save state when component unmounts
    return () => {
      clearInterval(interval);
      saveState();
    };
  }, [state, saveToLocalStorage]);

  // Load state from localStorage on app start
  useEffect(() => {
    const loadState = () => {
      const savedState = loadFromLocalStorage('app_state');
      if (savedState && savedState.lastSaved) {
        const lastSaved = new Date(savedState.lastSaved);
        const now = new Date();
        const hoursDiff = (now - lastSaved) / (1000 * 60 * 60);
        
        // Only restore state if it's less than 24 hours old
        if (hoursDiff < 24) {
          // Restore state to Redux
          Object.keys(savedState).forEach(key => {
            if (key !== 'lastSaved' && state[key]) {
              dispatch({
                type: `${key}/restoreState`,
                payload: savedState[key]
              });
            }
          });
        }
      }
    };

    loadState();
  }, [dispatch, loadFromLocalStorage, state]);

  // Save form drafts
  const saveFormDraft = useCallback((formId, formData) => {
    const draft = {
      data: formData,
      timestamp: new Date().toISOString(),
      formId
    };
    saveToLocalStorage(`draft_${formId}`, draft);
  }, [saveToLocalStorage]);

  // Load form draft
  const loadFormDraft = useCallback((formId) => {
    const draft = loadFromLocalStorage(`draft_${formId}`);
    if (draft && draft.timestamp) {
      const draftTime = new Date(draft.timestamp);
      const now = new Date();
      const hoursDiff = (now - draftTime) / (1000 * 60 * 60);
      
      // Only return draft if it's less than 7 days old
      if (hoursDiff < 168) {
        return draft.data;
      } else {
        // Remove old draft
        removeFromLocalStorage(`draft_${formId}`);
      }
    }
    return null;
  }, [loadFromLocalStorage, removeFromLocalStorage]);

  // Clear form draft
  const clearFormDraft = useCallback((formId) => {
    removeFromLocalStorage(`draft_${formId}`);
  }, [removeFromLocalStorage]);

  // Save user preferences
  const saveUserPreferences = useCallback((preferences) => {
    saveToLocalStorage('user_preferences', preferences);
  }, [saveToLocalStorage]);

  // Load user preferences
  const loadUserPreferences = useCallback(() => {
    return loadFromLocalStorage('user_preferences', {});
  }, [loadFromLocalStorage]);

  // Save search history
  const saveSearchHistory = useCallback((searchType, searchTerm) => {
    const history = loadFromLocalStorage('search_history', {});
    if (!history[searchType]) {
      history[searchType] = [];
    }
    
    // Add new search term if not already present
    if (!history[searchType].includes(searchTerm)) {
      history[searchType].unshift(searchTerm);
      // Keep only last 10 searches
      history[searchType] = history[searchType].slice(0, 10);
    }
    
    saveToLocalStorage('search_history', history);
  }, [loadFromLocalStorage, saveToLocalStorage]);

  // Load search history
  const loadSearchHistory = useCallback((searchType) => {
    const history = loadFromLocalStorage('search_history', {});
    return history[searchType] || [];
  }, [loadFromLocalStorage]);

  // Clear search history
  const clearSearchHistory = useCallback((searchType = null) => {
    if (searchType) {
      const history = loadFromLocalStorage('search_history', {});
      delete history[searchType];
      saveToLocalStorage('search_history', history);
    } else {
      removeFromLocalStorage('search_history');
    }
  }, [loadFromLocalStorage, saveToLocalStorage, removeFromLocalStorage]);

  // Export data
  const exportData = useCallback((dataType = 'all') => {
    let dataToExport = {};
    
    if (dataType === 'all') {
      dataToExport = state;
    } else if (state[dataType]) {
      dataToExport = { [dataType]: state[dataType] };
    }
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `uro-prep-${dataType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state]);

  // Import data
  const importData = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (typeof data === 'object' && data !== null) {
            // Restore data to Redux
            Object.keys(data).forEach(key => {
              if (state[key]) {
                dispatch({
                  type: `${key}/restoreState`,
                  payload: data[key]
                });
              }
            });
            
            resolve(data);
          } else {
            reject(new Error('Invalid data format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }, [dispatch, state]);

  // Clear all data
  const clearAllData = useCallback(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Reset Redux state to initial values
    dispatch({ type: 'RESET_ALL_STATE' });
  }, [dispatch]);

  // Get storage usage
  const getStorageUsage = useCallback(() => {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }
    return {
      totalSize,
      totalSizeKB: Math.round(totalSize / 1024),
      totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
    };
  }, []);

  return {
    // State persistence
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage,
    
    // Form drafts
    saveFormDraft,
    loadFormDraft,
    clearFormDraft,
    
    // User preferences
    saveUserPreferences,
    loadUserPreferences,
    
    // Search history
    saveSearchHistory,
    loadSearchHistory,
    clearSearchHistory,
    
    // Data export/import
    exportData,
    importData,
    
    // Data management
    clearAllData,
    getStorageUsage
  };
};

export default useDataPersistence;
