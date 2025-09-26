import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  surgeries: [],
  todayAppointments: [],
  upcomingSurgeries: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setSurgeries: (state, action) => {
      state.surgeries = action.payload;
    },
    setTodayAppointments: (state, action) => {
      state.todayAppointments = action.payload;
    },
    setUpcomingSurgeries: (state, action) => {
      state.upcomingSurgeries = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    addSurgery: (state, action) => {
      state.surgeries.push(action.payload);
    },
    updateSurgery: (state, action) => {
      const index = state.surgeries.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.surgeries[index] = action.payload;
      }
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
  setAppointments,
  setSurgeries,
  setTodayAppointments,
  setUpcomingSurgeries,
  addAppointment,
  updateAppointment,
  addSurgery,
  updateSurgery,
  setError,
  clearError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;

