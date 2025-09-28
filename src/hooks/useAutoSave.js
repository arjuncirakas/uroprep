import { useEffect, useRef, useCallback } from 'react';
import { useDataPersistence } from './useDataPersistence';

const useAutoSave = (formData, formId, interval = 30000, enabled = true) => {
  const { saveFormDraft, loadFormDraft, clearFormDraft } = useDataPersistence();
  const intervalRef = useRef(null);
  const lastSavedRef = useRef(null);
  const hasUnsavedChangesRef = useRef(false);

  // Load draft on mount
  useEffect(() => {
    if (formId && enabled) {
      const draft = loadFormDraft(formId);
      if (draft) {
        // Restore form data from draft
        Object.keys(draft).forEach(key => {
          if (formData[key] !== undefined) {
            formData[key] = draft[key];
          }
        });
      }
    }
  }, [formId, enabled, loadFormDraft]);

  // Auto-save function
  const saveDraft = useCallback(() => {
    if (formId && enabled && formData) {
      // Only save if there are actual changes
      const currentData = JSON.stringify(formData);
      if (currentData !== lastSavedRef.current) {
        saveFormDraft(formId, formData);
        lastSavedRef.current = currentData;
        hasUnsavedChangesRef.current = false;
        console.log(`Auto-saved draft for form: ${formId}`);
      }
    }
  }, [formId, enabled, formData, saveFormDraft]);

  // Set up auto-save interval
  useEffect(() => {
    if (enabled && formId && interval > 0) {
      intervalRef.current = setInterval(saveDraft, interval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [enabled, formId, interval, saveDraft]);

  // Save on form data changes
  useEffect(() => {
    if (enabled && formId && formData) {
      hasUnsavedChangesRef.current = true;
      
      // Debounced save - save after 2 seconds of no changes
      const timeoutId = setTimeout(() => {
        if (hasUnsavedChangesRef.current) {
          saveDraft();
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [formData, enabled, formId, saveDraft]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChangesRef.current) {
        saveDraft();
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    if (enabled && formId) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [enabled, formId, saveDraft]);

  // Manual save function
  const manualSave = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  // Clear draft function
  const clearDraft = useCallback(() => {
    if (formId) {
      clearFormDraft(formId);
      lastSavedRef.current = null;
      hasUnsavedChangesRef.current = false;
    }
  }, [formId, clearFormDraft]);

  // Check if there are unsaved changes
  const hasUnsavedChanges = useCallback(() => {
    return hasUnsavedChangesRef.current;
  }, []);

  // Get last saved time
  const getLastSavedTime = useCallback(() => {
    if (lastSavedRef.current) {
      return new Date().toISOString();
    }
    return null;
  }, []);

  return {
    manualSave,
    clearDraft,
    hasUnsavedChanges,
    getLastSavedTime
  };
};

export default useAutoSave;
