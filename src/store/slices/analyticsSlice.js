import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  kpis: {
    accessFlow: {
      averageWaitTime: 0,
      consultationToTreatmentTime: 0,
      surgeryWaitTime: 0,
      followUpCompliance: 0,
    },
    clinicalQuality: {
      diagnosticAccuracy: 0,
      surgicalOutcomes: {
        marginPositivityRate: 0,
        complicationRate: 0,
      },
      functionalOutcomes: {
        continenceRate: 0,
        erectileFunctionRate: 0,
      },
      patientSatisfaction: 0,
    },
    systemPerformance: {
      databaseUtilization: {},
      completionRates: {},
      alertResponseTimes: {},
      documentationQuality: 0,
    },
  },
  reports: [],
  customReports: [],
  dashboards: {
    departmentHead: null,
    qualityImprovement: null,
    research: null,
  },
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
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
    
    // KPI updates
    updateKpis: (state, action) => {
      state.kpis = { ...state.kpis, ...action.payload };
    },
    updateAccessFlowMetrics: (state, action) => {
      state.kpis.accessFlow = { ...state.kpis.accessFlow, ...action.payload };
    },
    updateClinicalQualityMetrics: (state, action) => {
      state.kpis.clinicalQuality = { ...state.kpis.clinicalQuality, ...action.payload };
    },
    updateSystemPerformanceMetrics: (state, action) => {
      state.kpis.systemPerformance = { ...state.kpis.systemPerformance, ...action.payload };
    },
    
    // Report management
    addReport: (state, action) => {
      const report = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.reports.push(report);
    },
    updateReport: (state, action) => {
      const index = state.reports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...action.payload };
      }
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(r => r.id !== action.payload);
    },
    
    // Custom report builder
    addCustomReport: (state, action) => {
      const customReport = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.customReports.push(customReport);
    },
    updateCustomReport: (state, action) => {
      const index = state.customReports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.customReports[index] = { ...state.customReports[index], ...action.payload };
      }
    },
    deleteCustomReport: (state, action) => {
      state.customReports = state.customReports.filter(r => r.id !== action.payload);
    },
    
    // Dashboard management
    updateDepartmentHeadDashboard: (state, action) => {
      state.dashboards.departmentHead = action.payload;
    },
    updateQualityImprovementDashboard: (state, action) => {
      state.dashboards.qualityImprovement = action.payload;
    },
    updateResearchDashboard: (state, action) => {
      state.dashboards.research = action.payload;
    },
    
    // Automated reporting
    generateRegulatoryReport: (state, action) => {
      const { type, data } = action.payload;
      const report = {
        id: Date.now(),
        type,
        data,
        generatedAt: new Date().toISOString(),
        status: 'generated',
      };
      state.reports.push(report);
    },
    
    // Benchmarking
    updateBenchmarkingData: (state, action) => {
      const { metric, value, benchmark } = action.payload;
      if (!state.kpis.benchmarking) {
        state.kpis.benchmarking = {};
      }
      state.kpis.benchmarking[metric] = {
        current: value,
        benchmark,
        performance: value >= benchmark ? 'above' : 'below',
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  updateKpis,
  updateAccessFlowMetrics,
  updateClinicalQualityMetrics,
  updateSystemPerformanceMetrics,
  addReport,
  updateReport,
  deleteReport,
  addCustomReport,
  updateCustomReport,
  deleteCustomReport,
  updateDepartmentHeadDashboard,
  updateQualityImprovementDashboard,
  updateResearchDashboard,
  generateRegulatoryReport,
  updateBenchmarkingData,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

