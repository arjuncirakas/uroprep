import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  referrals: [],
  currentReferral: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    dateRange: null,
  },
  cpcCriteria: {
    psaValue: null,
    psaDate: null,
    age: null,
    familyHistory: false,
    aboriginalTorresStrait: false,
    dreFindings: null,
    clinicalSymptoms: [],
  },
};

const referralSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    // Referral management
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    
    // CPC Criteria validation
    updateCpcCriteria: (state, action) => {
      state.cpcCriteria = { ...state.cpcCriteria, ...action.payload };
    },
    validateCpcCriteria: (state) => {
      const { psaValue, age, familyHistory, aboriginalTorresStrait } = state.cpcCriteria;
      
      // Auto-flag CPC compliant criteria
      let isCpcCompliant = false;
      let triagePriority = 'routine';
      
      if (psaValue >= 4.0 && age >= 50 && age <= 69) {
        isCpcCompliant = true;
      } else if (psaValue >= 2.0 && (familyHistory || aboriginalTorresStrait)) {
        isCpcCompliant = true;
      }
      
      // Auto-flag urgent cases
      if (psaValue > 100) {
        triagePriority = 'urgent';
      }
      
      state.cpcCriteria.isCpcCompliant = isCpcCompliant;
      state.cpcCriteria.triagePriority = triagePriority;
    },
    
    // Referral CRUD operations
    addReferral: (state, action) => {
      const referral = {
        ...action.payload,
        id: `URP${new Date().getFullYear()}${String(state.referrals.length + 1).padStart(4, '0')}`,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      state.referrals.push(referral);
    },
    updateReferral: (state, action) => {
      const index = state.referrals.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.referrals[index] = { ...state.referrals[index], ...action.payload };
      }
    },
    setCurrentReferral: (state, action) => {
      state.currentReferral = action.payload;
    },
    
    // Filtering and search
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: 'all',
        priority: 'all',
        dateRange: null,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  updateCpcCriteria,
  validateCpcCriteria,
  addReferral,
  updateReferral,
  setCurrentReferral,
  setFilters,
  clearFilters,
} = referralSlice.actions;

export default referralSlice.reducer;

