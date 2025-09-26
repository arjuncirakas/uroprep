import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

const MDTReports = () => {
  const { cases, meetings, outcomes } = useSelector(state => state.mdt);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedReport, setSelectedReport] = useState('performance');

  const reportTypes = [
    { id: 'performance', name: 'MDT Performance Report', description: 'Meeting efficiency and case resolution metrics' },
    { id: 'case_analysis', name: 'Case Analysis Report', description: 'Detailed analysis of case types and outcomes' },
    { id: 'participant_attendance', name: 'Participant Attendance', description: 'Attendance rates and participation metrics' },
    { id: 'outcome_tracking', name: 'Outcome Tracking', description: 'Clinical outcomes and decision implementation' },
    { id: 'nsqhs_accreditation', name: 'NSQHS Accreditation', description: 'Compliance reporting for NSQHS Standards' },
    { id: 'quality_improvement', name: 'Quality Improvement', description: 'QI metrics and audit trail reports' },
  ];

  const performanceMetrics = [
    {
      name: 'Average Meeting Duration',
      value: '67 minutes',
      target: '≤ 60 minutes',
      status: 'warning',
      trend: '+5%',
      icon: Clock,
      color: 'yellow'
    },
    {
      name: 'Case Resolution Rate',
      value: '94%',
      target: '≥ 90%',
      status: 'good',
      trend: '+2%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Average Cases per Meeting',
      value: '8.2',
      target: '6-10 cases',
      status: 'good',
      trend: '+0.3',
      icon: FileText,
      color: 'blue'
    },
    {
      name: 'Participant Attendance',
      value: '87%',
      target: '≥ 85%',
      status: 'good',
      trend: '+3%',
      icon: Users,
      color: 'purple'
    }
  ];

  const caseTypeDistribution = [
    { type: 'Complex Cases', count: 45, percentage: 35 },
    { type: 'Borderline Findings', count: 32, percentage: 25 },
    { type: 'Patient Preference', count: 28, percentage: 22 },
    { type: 'Disease Progression', count: 23, percentage: 18 },
  ];

  const outcomeSummary = [
    { outcome: 'Surgery Recommended', count: 52, percentage: 41 },
    { outcome: 'Active Surveillance', count: 38, percentage: 30 },
    { outcome: 'Radiotherapy', count: 18, percentage: 14 },
    { outcome: 'Medical Oncology', count: 12, percentage: 9 },
    { outcome: 'Further Investigation', count: 8, percentage: 6 },
  ];

  const recentMeetings = meetings.slice(0, 5);

  // NSQHS Accreditation Metrics
  const nsqhsMetrics = [
    {
      standard: 'NSQHS Standard 1: Clinical Governance',
      compliance: '98%',
      status: 'compliant',
      lastAudit: '2024-01-15'
    },
    {
      standard: 'NSQHS Standard 2: Partnering with Consumers',
      compliance: '95%',
      status: 'compliant',
      lastAudit: '2024-01-15'
    },
    {
      standard: 'NSQHS Standard 6: Clinical Handover',
      compliance: '92%',
      status: 'needs_improvement',
      lastAudit: '2024-01-15'
    },
    {
      standard: 'NSQHS Standard 8: Preventing and Managing Pressure Injuries',
      compliance: '100%',
      status: 'compliant',
      lastAudit: '2024-01-15'
    }
  ];

  // Quality Improvement Metrics
  const qiMetrics = [
    {
      metric: 'Average Time to MDT Decision',
      current: '5.2 days',
      target: '≤3 days',
      trend: 'improving',
      lastMonth: '6.1 days'
    },
    {
      metric: 'MDT Case Resolution Rate',
      current: '94%',
      target: '≥90%',
      trend: 'stable',
      lastMonth: '93%'
    },
    {
      metric: 'Cross-Database Case Transitions',
      current: '87%',
      target: '≥85%',
      trend: 'improving',
      lastMonth: '82%'
    },
    {
      metric: 'Audit Trail Completeness',
      current: '96%',
      target: '100%',
      trend: 'improving',
      lastMonth: '89%'
    }
  ];

  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType);
    // This would dispatch an action to generate the report
  };

  const handleExportData = () => {
    console.log('Exporting data');
    // This would handle data export
  };

  const renderPerformanceMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {performanceMetrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.name} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                <Icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Target: {metric.target}</span>
                <span className={`text-sm font-medium ${
                  metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend}
                </span>
              </div>
              <div className="mt-2">
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
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCaseAnalysis = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Case Type Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Type Distribution</h3>
        <div className="space-y-4">
          {caseTypeDistribution.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-900">{item.type}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
                <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Outcome Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Outcome Summary</h3>
        <div className="space-y-4">
          {outcomeSummary.map((item) => (
            <div key={item.outcome} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm font-medium text-gray-900">{item.outcome}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{item.count}</span>
                <span className="text-sm text-gray-500 ml-2">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecentMeetings = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Recent MDT Meetings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cases
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentMeetings.map((meeting) => (
              <tr key={meeting.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(meeting.scheduledDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {meeting.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {meeting.caseCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {meeting.duration} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    meeting.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : meeting.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {meeting.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MDT Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive reporting and performance analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Report Types */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{report.name}</h4>
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <button
                onClick={() => handleGenerateReport(report.id)}
                className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        {renderPerformanceMetrics()}
      </div>

      {/* Case Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Analysis</h2>
        {renderCaseAnalysis()}
      </div>

      {/* Recent Meetings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Meetings</h2>
        {renderRecentMeetings()}
      </div>

      {/* NSQHS Accreditation */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">NSQHS Accreditation Compliance</h2>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="space-y-4">
              {nsqhsMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{metric.standard}</h4>
                    <p className="text-sm text-gray-600">Last Audit: {metric.lastAudit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{metric.compliance}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      metric.status === 'compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metric.status === 'compliant' ? 'Compliant' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quality Improvement Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quality Improvement Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qiMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  metric.trend === 'improving' ? 'bg-green-100 text-green-800' :
                  metric.trend === 'stable' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.trend}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current:</span>
                  <span className="text-sm font-medium text-gray-900">{metric.current}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target:</span>
                  <span className="text-sm font-medium text-gray-900">{metric.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Month:</span>
                  <span className="text-sm font-medium text-gray-900">{metric.lastMonth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Meetings Held</p>
              <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Cases Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {cases.filter(c => c.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Cases/Meeting</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.length > 0 ? (cases.length / meetings.length).toFixed(1) : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDTReports;
