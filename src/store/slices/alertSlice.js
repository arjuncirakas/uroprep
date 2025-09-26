import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  alerts: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAlerts: (state, action) => {
      state.alerts = action.payload;
      state.unreadCount = action.payload.filter(alert => !alert.read).length;
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert && !alert.read) {
        alert.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.alerts.forEach(alert => {
        alert.read = true;
      });
      state.unreadCount = 0;
    },
    removeAlert: (state, action) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert && !alert.read) {
        state.unreadCount -= 1;
      }
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setAlerts,
  addAlert,
  markAsRead,
  markAllAsRead,
  removeAlert,
  setError,
  clearError,
} = alertSlice.actions;

export default alertSlice.reducer;

