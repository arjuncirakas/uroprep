import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // Notification management
    addNotification: (state, action) => {
      const notification = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotification: (state, action) => {
      const notificationId = action.payload;
      const index = state.notifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadCount -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    // Notification types
    addReferralStatusNotification: (state, action) => {
      const { referralId, status, message } = action.payload;
      const notification = {
        id: Date.now(),
        type: 'referral_status_update',
        title: 'Referral Status Update',
        message: message || `Referral ${referralId} status updated to ${status}`,
        referralId,
        status,
        timestamp: new Date().toISOString(),
        read: false,
        priority: status === 'urgent' ? 'high' : 'normal',
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    addPatientTransitionNotification: (state, action) => {
      const { patientId, fromDb, toDb, reason } = action.payload;
      const notification = {
        id: Date.now(),
        type: 'patient_transition',
        title: 'Patient Database Transition',
        message: `Patient ${patientId} moved from ${fromDb} to ${toDb}. Reason: ${reason}`,
        patientId,
        fromDb,
        toDb,
        reason,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'normal',
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    addAppointmentNotification: (state, action) => {
      const { appointmentId, type, message } = action.payload;
      const notification = {
        id: Date.now(),
        type: 'appointment',
        title: 'Appointment Update',
        message,
        appointmentId,
        timestamp: new Date().toISOString(),
        read: false,
        priority: type === 'cancelled' ? 'high' : 'normal',
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    addClinicalAlertNotification: (state, action) => {
      const { patientId, alertType, message } = action.payload;
      const notification = {
        id: Date.now(),
        type: 'clinical_alert',
        title: 'Clinical Alert',
        message,
        patientId,
        alertType,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high',
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotification,
  clearAllNotifications,
  addReferralStatusNotification,
  addPatientTransitionNotification,
  addAppointmentNotification,
  addClinicalAlertNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
