import React, { useState } from 'react';
import { X, Activity, TrendingUp, Calendar, Download, Eye, Plus } from 'lucide-react';

const PSAModal = ({ isOpen, onClose, patientData }) => {
  const [activeTab, setActiveTab] = useState('chart');

  if (!isOpen || !patientData) return null;

  // Mock PSA data - in real app this would come from props or API
  const mockPSAData = {
    currentPSA: 6.2,
    lastTestDate: '2024-01-10',
    history: [
      { date: '2023-01-15', value: 4.2, lab: 'Melbourne Pathology' },
      { date: '2023-04-20', value: 4.8, lab: 'Melbourne Pathology' },
      { date: '2023-07-18', value: 5.1, lab: 'Melbourne Pathology' },
      { date: '2023-10-12', value: 5.6, lab: 'Melbourne Pathology' },
      { date: '2024-01-10', value: 6.2, lab: 'Melbourne Pathology' }
    ],
    trends: {
      velocity: 2.0, // ng/mL per year
      doublingTime: 36, // months
      trend: 'increasing'
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PSA Information</h2>
                <p className="text-green-100 text-sm">{patientData?.name || 'Patient'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ height: 'calc(90vh - 120px)' }}>
          <div className="p-6">
            {/* Current PSA Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {mockPSAData.currentPSA} ng/mL
                  </div>
                  <div className="text-sm text-gray-600">Latest PSA</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(mockPSAData.lastTestDate)}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${getTrendColor(mockPSAData.trends.trend)}`}>
                    {getTrendIcon(mockPSAData.trends.trend)}
                  </div>
                  <div className="text-sm text-gray-600">Trend</div>
                  <div className={`text-xs font-medium capitalize ${getTrendColor(mockPSAData.trends.trend)}`}>
                    {mockPSAData.trends.trend}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {mockPSAData.trends.velocity} ng/mL/year
                  </div>
                  <div className="text-sm text-gray-600">Velocity</div>
                  <div className="text-xs text-gray-500">
                    Doubling: {mockPSAData.trends.doublingTime} months
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('chart')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'chart'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                PSA Chart
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'trends'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trends
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'chart' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">PSA Trend Chart</h3>
                  <button className="flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                    <Plus className="h-4 w-4 mr-1" />
                    Add PSA Entry
                  </button>
                </div>
                
                {/* Placeholder for chart - in real app would use Chart.js or similar */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">PSA Trend Chart</p>
                    <p className="text-sm text-gray-400">Chart visualization would be implemented here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">PSA History</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {mockPSAData.history.map((entry, index) => (
                    <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Activity className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {entry.value} ng/mL
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(entry.date)} • {entry.lab}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors" title="Download report">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors" title="View details">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">PSA Velocity Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {mockPSAData.trends.velocity} ng/mL/year
                      </div>
                      <div className="text-sm text-gray-600">PSA Velocity</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rate of change over time
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {mockPSAData.trends.doublingTime} months
                      </div>
                      <div className="text-sm text-gray-600">Doubling Time</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Time for PSA to double
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Interpretation</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-yellow-800 mb-1">Elevated PSA Velocity</div>
                        <div className="text-sm text-yellow-700">
                          PSA velocity of {mockPSAData.trends.velocity} ng/mL/year indicates rapid progression. 
                          Consider repeat PSA testing in 3 months and discuss with patient regarding further evaluation.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(mockPSAData.lastTestDate)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                Add New PSA Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSAModal;
