import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  db1: {
    patients: [],
    currentPatient: null,
    clinicalDecision: null,
    loading: false,
  },
  db2: {
    patients: [],
    currentPatient: null,
    surveillanceProtocol: null,
    progressionAlerts: [],
    loading: false,
  },
  db3: {
    patients: [],
    currentPatient: null,
    surgicalPlan: null,
    preOpChecklist: [],
    postOpTracking: null,
    loading: false,
  },
  db4: {
    patients: [],
    currentPatient: null,
    followUpSchedule: null,
    outcomes: null,
    loading: false,
  },
  transitions: [],
  auditTrail: [],
};

const databaseSlice = createSlice({
  name: 'databases',
  initialState,
  reducers: {
    // Database 1 (OPD) actions
    setDb1Loading: (state, action) => {
      state.db1.loading = action.payload;
    },
    addDb1Patient: (state, action) => {
      state.db1.patients.push(action.payload);
    },
    updateDb1Patient: (state, action) => {
      const index = state.db1.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.db1.patients[index] = { ...state.db1.patients[index], ...action.payload };
      }
    },
    setDb1CurrentPatient: (state, action) => {
      state.db1.currentPatient = action.payload;
    },
    setClinicalDecision: (state, action) => {
      state.db1.clinicalDecision = action.payload;
    },
    
    // Database 2 (Active Surveillance) actions
    setDb2Loading: (state, action) => {
      state.db2.loading = action.payload;
    },
    addDb2Patient: (state, action) => {
      state.db2.patients.push(action.payload);
    },
    updateDb2Patient: (state, action) => {
      const index = state.db2.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.db2.patients[index] = { ...state.db2.patients[index], ...action.payload };
      }
    },
    setDb2CurrentPatient: (state, action) => {
      state.db2.currentPatient = action.payload;
    },
    addProgressionAlert: (state, action) => {
      state.db2.progressionAlerts.push({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'active',
      });
    },
    updateSurveillanceProtocol: (state, action) => {
      state.db2.surveillanceProtocol = action.payload;
    },
    
    // Database 3 (Surgery) actions
    setDb3Loading: (state, action) => {
      state.db3.loading = action.payload;
    },
    addDb3Patient: (state, action) => {
      state.db3.patients.push(action.payload);
    },
    updateDb3Patient: (state, action) => {
      const index = state.db3.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.db3.patients[index] = { ...state.db3.patients[index], ...action.payload };
      }
    },
    setDb3CurrentPatient: (state, action) => {
      state.db3.currentPatient = action.payload;
    },
    updateSurgicalPlan: (state, action) => {
      state.db3.surgicalPlan = action.payload;
    },
    updatePreOpChecklist: (state, action) => {
      state.db3.preOpChecklist = action.payload;
    },
    updatePostOpTracking: (state, action) => {
      state.db3.postOpTracking = action.payload;
    },
    
    // Database 4 (Follow-up) actions
    setDb4Loading: (state, action) => {
      state.db4.loading = action.payload;
    },
    addDb4Patient: (state, action) => {
      state.db4.patients.push(action.payload);
    },
    updateDb4Patient: (state, action) => {
      const index = state.db4.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.db4.patients[index] = { ...state.db4.patients[index], ...action.payload };
      }
    },
    setDb4CurrentPatient: (state, action) => {
      state.db4.currentPatient = action.payload;
    },
    updateFollowUpSchedule: (state, action) => {
      state.db4.followUpSchedule = action.payload;
    },
    updateOutcomes: (state, action) => {
      state.db4.outcomes = action.payload;
    },
    
    // Database transitions
    addTransition: (state, action) => {
      const transition = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      state.transitions.push(transition);
      
      // Add to audit trail
      state.auditTrail.push({
        ...transition,
        type: 'database_transition',
      });
    },
    
    // Audit trail
    addAuditEntry: (state, action) => {
      state.auditTrail.push({
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      });
    },
  },
});

export const {
  setDb1Loading,
  addDb1Patient,
  updateDb1Patient,
  setDb1CurrentPatient,
  setClinicalDecision,
  setDb2Loading,
  addDb2Patient,
  updateDb2Patient,
  setDb2CurrentPatient,
  addProgressionAlert,
  updateSurveillanceProtocol,
  setDb3Loading,
  addDb3Patient,
  updateDb3Patient,
  setDb3CurrentPatient,
  updateSurgicalPlan,
  updatePreOpChecklist,
  updatePostOpTracking,
  setDb4Loading,
  addDb4Patient,
  updateDb4Patient,
  setDb4CurrentPatient,
  updateFollowUpSchedule,
  updateOutcomes,
  addTransition,
  addAuditEntry,
} = databaseSlice.actions;

export default databaseSlice.reducer;

