import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cases: [],
  currentCase: null,
  meetings: [],
  currentMeeting: null,
  participants: [],
  outcomes: [],
  loading: false,
  error: null,
};

const mdtSlice = createSlice({
  name: 'mdt',
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
    
    // MDT Case management
    addCase: (state, action) => {
      const mdtCase = {
        ...action.payload,
        id: `MDT${new Date().getFullYear()}${String(state.cases.length + 1).padStart(4, '0')}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      state.cases.push(mdtCase);
    },
    updateCase: (state, action) => {
      const index = state.cases.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.cases[index] = { ...state.cases[index], ...action.payload };
      }
    },
    setCurrentCase: (state, action) => {
      state.currentCase = action.payload;
    },
    
    // MDT Meeting management
    addMeeting: (state, action) => {
      const meeting = {
        ...action.payload,
        id: Date.now(),
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
      state.meetings.push(meeting);
    },
    updateMeeting: (state, action) => {
      const index = state.meetings.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.meetings[index] = { ...state.meetings[index], ...action.payload };
      }
    },
    setCurrentMeeting: (state, action) => {
      state.currentMeeting = action.payload;
    },
    
    // Participant management
    addParticipant: (state, action) => {
      state.participants.push(action.payload);
    },
    updateParticipant: (state, action) => {
      const index = state.participants.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.participants[index] = { ...state.participants[index], ...action.payload };
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(p => p.id !== action.payload);
    },
    
    // MDT Outcomes
    addOutcome: (state, action) => {
      const outcome = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };
      state.outcomes.push(outcome);
    },
    updateOutcome: (state, action) => {
      const index = state.outcomes.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.outcomes[index] = { ...state.outcomes[index], ...action.payload };
      }
    },
    
    // Case presentation
    generatePresentation: (state, action) => {
      const { caseId, template } = action.payload;
      const mdtCase = state.cases.find(c => c.id === caseId);
      if (mdtCase) {
        mdtCase.presentation = {
          template,
          generatedAt: new Date().toISOString(),
          status: 'ready',
        };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addCase,
  updateCase,
  setCurrentCase,
  addMeeting,
  updateMeeting,
  setCurrentMeeting,
  addParticipant,
  updateParticipant,
  removeParticipant,
  addOutcome,
  updateOutcome,
  generatePresentation,
} = mdtSlice.actions;

export default mdtSlice.reducer;

