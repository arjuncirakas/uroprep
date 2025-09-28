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
    transitionPatient: (state, action) => {
      const { patientId, fromDb, toDb, reason, clinicalData, assignedTo } = action.payload;
      
      // Find patient in source database
      let patient = null;
      if (fromDb === 'db1') {
        const index = state.db1.patients.findIndex(p => p.id === patientId);
        if (index !== -1) {
          patient = state.db1.patients[index];
          state.db1.patients.splice(index, 1);
        }
      } else if (fromDb === 'db2') {
        const index = state.db2.patients.findIndex(p => p.id === patientId);
        if (index !== -1) {
          patient = state.db2.patients[index];
          state.db2.patients.splice(index, 1);
        }
      } else if (fromDb === 'db3') {
        const index = state.db3.patients.findIndex(p => p.id === patientId);
        if (index !== -1) {
          patient = state.db3.patients[index];
          state.db3.patients.splice(index, 1);
        }
      } else if (fromDb === 'db4') {
        const index = state.db4.patients.findIndex(p => p.id === patientId);
        if (index !== -1) {
          patient = state.db4.patients[index];
          state.db4.patients.splice(index, 1);
        }
      }
      
      if (patient) {
        // Update patient with transition data
        patient = {
          ...patient,
          currentDatabase: toDb,
          transitionReason: reason,
          clinicalData: { ...patient.clinicalData, ...clinicalData },
          assignedTo: assignedTo || patient.assignedTo,
          lastTransition: new Date().toISOString(),
        };
        
        // Add to target database
        if (toDb === 'db1') {
          state.db1.patients.push(patient);
        } else if (toDb === 'db2') {
          state.db2.patients.push(patient);
        } else if (toDb === 'db3') {
          state.db3.patients.push(patient);
        } else if (toDb === 'db4') {
          state.db4.patients.push(patient);
        }
        
        // Log transition
        state.transitions.push({
          id: Date.now(),
          patientId,
          fromDb,
          toDb,
          reason,
          clinicalData,
          timestamp: new Date().toISOString(),
        });
        
        // Add to audit trail
        state.auditTrail.push({
          id: Date.now(),
          type: 'patient_transition',
          patientId,
          fromDb,
          toDb,
          reason,
          timestamp: new Date().toISOString(),
        });
      }
    },
    updatePatientStatus: (state, action) => {
      const { patientId, database, status, data, assignedTo } = action.payload;
      
      let targetDb = null;
      if (database === 'db1') targetDb = state.db1;
      else if (database === 'db2') targetDb = state.db2;
      else if (database === 'db3') targetDb = state.db3;
      else if (database === 'db4') targetDb = state.db4;
      
      if (targetDb) {
        const index = targetDb.patients.findIndex(p => p.id === patientId);
        if (index !== -1) {
          targetDb.patients[index] = {
            ...targetDb.patients[index],
            status,
            ...data,
            assignedTo: assignedTo || targetDb.patients[index].assignedTo,
            lastUpdated: new Date().toISOString(),
          };
          
          // Add to audit trail
          state.auditTrail.push({
            id: Date.now(),
            type: 'patient_status_update',
            patientId,
            database,
            status,
            data,
            timestamp: new Date().toISOString(),
          });
        }
      }
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
  transitionPatient,
  updatePatientStatus,
  addAuditEntry,
} = databaseSlice.actions;

export default databaseSlice.reducer;

