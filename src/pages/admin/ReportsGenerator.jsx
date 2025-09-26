import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ReportsGenerator = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const reportTypes = [
    {
      id: 'triage-summary',
      name: 'Weekly Triage Summary',
      description: 'New referrals by urgency level',
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      id: 'surgery-wait-times',
      name: 'Surgery Wait Times Report',
      description: 'Average wait times by surgery type',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      id: 'follow-up-compliance',
      name: 'Follow-up Compliance Report',
      description: 'Patient follow-up adherence rates',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      id: 'gp-referral-patterns',
      name: 'GP Referral Patterns',
      description: 'Referral trends by general practitioners',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  const exportFormats = ['PDF', 'Excel', 'CSV'];
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerateReport = () => {
    if (!selectedReport) return;
    
    const report = {
      id: Date.now(),
      type: selectedReport,
      generatedAt: new Date().toISOString(),
      data: generateMockReportData(selectedReport)
    };
    
    setGeneratedReport(report);
  };

  const generateMockReportData = (reportType) => {
    switch (reportType) {
      case 'triage-summary':
        return {
          totalReferrals: 45,
          highUrgency: 12,
          mediumUrgency: 23,
          lowUrgency: 10,
          avgResponseTime: '2.3 days'
        };
      case 'surgery-wait-times':
        return {
          ralp: '4.2 weeks',
          open: '6.1 weeks',
          laparoscopic: '3.8 weeks',
          robotic: '5.5 weeks'
        };
      case 'follow-up-compliance':
        return {
          complianceRate: '94.2%',
          overdueFollowups: 8,
          completedThisMonth: 156,
          scheduledNextMonth: 142
        };
      default:
        return { message: 'Report data generated successfully' };
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting ${selectedReport} as ${format}`);
    alert(`Report exported as ${format} successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports Generator</h1>
          <p className="text-gray-600">Generate comprehensive reports and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Types */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${report.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Actions */}
        <div className="space-y-6">
          {/* Generate Report */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Report</h2>
            <button
              onClick={handleGenerateReport}
              disabled={!selectedReport}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>

          {/* Export Options */}
          {generatedReport && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Report</h2>
              <div className="space-y-3">
                {exportFormats.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as {format}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Report Preview */}
          {generatedReport && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Report Type:</span>
                  <span className="font-medium">
                    {reportTypes.find(r => r.id === generatedReport.type)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Generated:</span>
                  <span className="font-medium">
                    {new Date(generatedReport.generatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Sample Data Display */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Sample Data:</h4>
                <div className="text-sm text-gray-600">
                  {Object.entries(generatedReport.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;

