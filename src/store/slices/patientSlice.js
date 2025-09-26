import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  currentPatient: null,
  referrals: [],
  db1Patients: [], // New referrals
  db2Patients: [], // Active surveillance
  db3Patients: [], // Surgery pipeline
  db4Patients: [], // Post-surgery follow-up
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPatients: (state, action) => {
      state.patients = action.payload;
    },
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
    },
    setReferrals: (state, action) => {
      state.referrals = action.payload;
    },
    setDb1Patients: (state, action) => {
      state.db1Patients = action.payload;
    },
    setDb2Patients: (state, action) => {
      state.db2Patients = action.payload;
    },
    setDb3Patients: (state, action) => {
      state.db3Patients = action.payload;
    },
    setDb4Patients: (state, action) => {
      state.db4Patients = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
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
  setPatients,
  setCurrentPatient,
  setReferrals,
  setDb1Patients,
  setDb2Patients,
  setDb3Patients,
  setDb4Patients,
  addPatient,
  updatePatient,
  setError,
  clearError,
} = patientSlice.actions;

export default patientSlice.reducer;

