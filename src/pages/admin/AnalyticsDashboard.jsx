import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateKpis, 
  updateAccessFlowMetrics, 
  updateClinicalQualityMetrics,
  updateSystemPerformanceMetrics,
  generateRegulatoryReport 
} from '../../store/slices/analyticsSlice';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Download,
  Calendar,
  Activity,
  Database,
  Stethoscope
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { kpis, reports, dashboards } = useSelector(state => state.analytics);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedReport, setSelectedReport] = useState('access-flow');

  // NSQHS Standards Compliance Metrics
  const nsqhsComplianceMetrics = [
    {
      standard: 'NSQHS Standard 1: Clinical Governance',
      compliance: '98%',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextReview: '2024-07-15'
    },
    {
      standard: 'NSQHS Standard 2: Partnering with Consumers',
      compliance: '95%',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextReview: '2024-07-15'
    },
    {
      standard: 'NSQHS Standard 3: Preventing and Controlling Infections',
      compliance: '100%',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextReview: '2024-07-15'
    },
    {
      standard: 'NSQHS Standard 4: Medication Safety',
      compliance: '97%',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextReview: '2024-07-15'
    },
    {
      standard: 'NSQHS Standard 6: Clinical Handover',
      compliance: '92%',
      status: 'needs_improvement',
      lastAudit: '2024-01-15',
      nextReview: '2024-04-15'
    },
    {
      standard: 'NSQHS Standard 8: Preventing and Managing Pressure Injuries',
      compliance: '100%',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextReview: '2024-07-15'
    }
  ];

  const accessFlowMetrics = [
    {
      name: 'Average Wait Time',
      value: '14.2 days',
      target: '≤ 14 days',
      status: 'warning',
      trend: '+2.1%',
      icon: Clock,
      color: 'yellow'
    },
    {
      name: 'Consultation to Treatment',
      value: '28.5 days',
      target: '≤ 30 days',
      status: 'good',
      trend: '-5.2%',
      icon: Calendar,
      color: 'green'
    },
    {
      name: 'Surgery Wait Time',
      value: '45.8 days',
      target: '≤ 60 days',
      status: 'good',
      trend: '-8.1%',
      icon: Stethoscope,
      color: 'green'
    },
    {
      name: 'Follow-up Compliance',
      value: '94.2%',
      target: '≥ 95%',
      status: 'warning',
      trend: '+1.3%',
      icon: CheckCircle,
      color: 'yellow'
    }
  ];

  const clinicalQualityMetrics = [
    {
      name: 'Diagnostic Accuracy',
      value: '87.3%',
      target: '≥ 85%',
      status: 'good',
      trend: '+2.1%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Margin Positivity Rate',
      value: '12.4%',
      target: '≤ 15%',
      status: 'good',
      trend: '-1.8%',
      icon: AlertTriangle,
      color: 'green'
    },
    {
      name: 'Complication Rate',
      value: '8.7%',
      target: '≤ 10%',
      status: 'good',
      trend: '-0.9%',
      icon: AlertTriangle,
      color: 'green'
    },
    {
      name: 'Patient Satisfaction',
      value: '4.6/5',
      target: '≥ 4.5/5',
      status: 'good',
      trend: '+0.1',
      icon: Users,
      color: 'green'
    }
  ];

  const systemPerformanceMetrics = [
    {
      name: 'Database Utilization',
      value: 'DB1: 45, DB2: 23, DB3: 12, DB4: 67',
      icon: Database,
      color: 'blue'
    },
    {
      name: 'Completion Rates',
      value: '92.8%',
      target: '≥ 90%',
      status: 'good',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Alert Response Time',
      value: '2.3 hours',
      target: '≤ 4 hours',
      status: 'good',
      icon: Clock,
      color: 'green'
    },
    {
      name: 'Documentation Quality',
      value: '96.1%',
      target: '≥ 95%',
      status: 'good',
      icon: FileText,
      color: 'green'
    }
  ];

  const regulatoryReports = [
    { id: 'nsqhs', name: 'NSQHS Standards Compliance', type: 'compliance' },
    { id: 'cancer-registry', name: 'State Cancer Registry', type: 'notification' },
    { id: 'quality-registry', name: 'Clinical Quality Registry', type: 'outcomes' },
    { id: 'mbs', name: 'Medicare Benefits Schedule', type: 'activity' }
  ];

  const handleGenerateReport = (reportType) => {
    dispatch(generateRegulatoryReport({
      type: reportType,
      data: {
        generatedAt: new Date().toISOString(),
        timeframe: selectedTimeframe,
        kpis: kpis
      }
    }));
  };

  const renderMetricCard = (metric) => {
    const Icon = metric.icon;
    return (
      <div key={metric.name} className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
              <Icon className={`h-6 w-6 text-${metric.color}-600`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
          <div className="text-right">
            {metric.target && (
              <p className="text-sm text-gray-500">Target: {metric.target}</p>
            )}
            {metric.trend && (
              <div className="flex items-center mt-1">
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  metric.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'
                }`} />
                <span className={`text-sm font-medium ${
                  metric.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {metric.trend}
                </span>
              </div>
            )}
          </div>
        </div>
        {metric.status && (
          <div className="mt-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              metric.status === 'good' 
                ? 'bg-green-100 text-green-800'
                : metric.status === 'warning'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {metric.status === 'good' ? 'On Target' : 
               metric.status === 'warning' ? 'Needs Attention' : 'Below Target'}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderRegulatoryReports = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Regulatory Compliance Reports</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regulatoryReports.map((report) => (
          <div key={report.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{report.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{report.type} Report</p>
              </div>
              <button
                onClick={() => handleGenerateReport(report.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomReportBuilder = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter report name..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Sources
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Referrals', 'DB1 (OPD)', 'DB2 (Surveillance)', 'DB3 (Surgery)', 'DB4 (Follow-up)', 'MDT Cases'].map((source) => (
              <label key={source} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">{source}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metrics
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Wait Times', 'Clinical Outcomes', 'Patient Satisfaction', 'System Performance', 'Compliance Rates', 'Financial Metrics'].map((metric) => (
              <label key={metric} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">{metric}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Create Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting Dashboard</h1>
          <p className="text-gray-600">Comprehensive KPIs and Performance Metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Access & Flow Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Access & Flow Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessFlowMetrics.map(renderMetricCard)}
        </div>
      </div>

      {/* Clinical Quality Indicators */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Quality Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clinicalQualityMetrics.map(renderMetricCard)}
        </div>
      </div>

      {/* System Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemPerformanceMetrics.map(renderMetricCard)}
        </div>
      </div>

      {/* NSQHS Standards Compliance */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">NSQHS Standards Compliance</h2>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nsqhsComplianceMetrics.map((metric, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{metric.standard}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      metric.status === 'compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metric.status === 'compliant' ? 'Compliant' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">{metric.compliance}</p>
                    <p className="text-xs text-gray-600">Last Audit: {metric.lastAudit}</p>
                    <p className="text-xs text-gray-600">Next Review: {metric.nextReview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regulatory Reports */}
        {renderRegulatoryReports()}
        
        {/* Custom Report Builder */}
        {renderCustomReportBuilder()}
      </div>

      {/* Benchmarking */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmarking Against National Standards</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <h4 className="font-medium text-green-900">Wait Time Performance</h4>
              <p className="text-sm text-green-700">14.2 days vs National Average: 18.5 days</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">23%</span>
              <p className="text-sm text-green-600">Better than average</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900">Clinical Outcomes</h4>
              <p className="text-sm text-blue-700">Margin positivity: 12.4% vs National: 15.2%</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">18%</span>
              <p className="text-sm text-blue-600">Better than average</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <h4 className="font-medium text-yellow-900">Patient Satisfaction</h4>
              <p className="text-sm text-yellow-700">4.6/5 vs National Average: 4.3/5</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-yellow-600">7%</span>
              <p className="text-sm text-yellow-600">Above average</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

