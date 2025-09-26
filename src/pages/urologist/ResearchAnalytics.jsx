import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart3, 
  Users, 
  FileText,
  Download
} from 'lucide-react';

const ResearchAnalytics = () => {
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const [timeRange, setTimeRange] = useState('12months');

  // Basic reporting data only
  const basicReports = {
    totalPatients: db1.patients.length + db2.patients.length + db3.patients.length + db4.patients.length,
    dischargedToGP: referrals.filter(r => r.outcome === 'discharged_gp').length,
    referredToMDT: referrals.filter(r => r.outcome === 'mdt_referral').length,
    activeSurveillance: db2.patients.length
  };

  const ReportCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${
          color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
          color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
          color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-orange-500 to-orange-700'
        }`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const exportToCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Patients', basicReports.totalPatients],
      ['Discharged to GP', basicReports.dischargedToGP],
      ['Referred to MDT', basicReports.referredToMDT],
      ['Active Surveillance', basicReports.activeSurveillance]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urology_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Basic Excel export functionality
    alert('Excel export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
            <p className="text-sm text-gray-600 mt-1">Basic reporting and data export</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="24months">Last 24 Months</option>
            </select>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">Basic Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Analytics</h3>
                <p className="text-sm text-gray-600 mt-1">Key performance metrics and patient statistics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard
              title="Total Patients"
              value={basicReports.totalPatients}
              icon={Users}
              color="blue"
            />
            <ReportCard
              title="Discharged to GP"
              value={basicReports.dischargedToGP}
              icon={FileText}
              color="green"
            />
            <ReportCard
              title="Referred to MDT"
              value={basicReports.referredToMDT}
              icon={Users}
              color="purple"
            />
            <ReportCard
              title="Active Surveillance"
              value={basicReports.activeSurveillance}
              icon={BarChart3}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Export Tools */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Data Export</h3>
                <p className="text-sm text-gray-600 mt-1">Export analytics data for external analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Export to CSV</h4>
              <p className="text-sm text-gray-600 mb-4">Export basic analytics data to CSV format</p>
              <button 
                onClick={exportToCSV}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl px-4 py-2 hover:opacity-90 transition-opacity"
              >
                Export CSV
              </button>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Export to Excel</h4>
              <p className="text-sm text-gray-600 mb-4">Export data to Excel format for further analysis</p>
              <button 
                onClick={exportToExcel}
                className="bg-gradient-to-r from-green-800 to-black text-white rounded-xl px-4 py-2 hover:opacity-90 transition-opacity"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAnalytics;