import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer,
  Activity,
  TrendingUp,
  Calendar,
  User,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const PSAChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState('line');

  // Mock patient data - in real app, fetch by ID
  const mockPatient = {
    id: 'URP001',
    name: 'John Smith',
    age: 65,
    dob: '1959-03-15',
    psaHistory: [
      { value: 2.8, date: '2022-06-15', velocity: null },
      { value: 3.2, date: '2022-12-15', velocity: 0.8 },
      { value: 4.2, date: '2023-01-15', velocity: 2.0 },
      { value: 6.8, date: '2023-04-15', velocity: 8.0 },
      { value: 8.5, date: '2023-06-15', velocity: 8.6 },
      { value: 12.1, date: '2023-09-15', velocity: 14.4 },
      { value: 15.3, date: '2023-12-15', velocity: 13.6 },
      { value: 20.8, date: '2024-01-05', velocity: 22.0 },
      { value: 25.4, date: '2024-01-10', velocity: 20.2 }
    ],
    clinicalNotes: 'Elevated PSA with family history of prostate cancer. DRE reveals firm nodule in left lobe.',
    referringGP: 'Dr. Sarah Johnson',
    referralDate: '2024-01-10'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculatePSAVelocity = (psaHistory) => {
    if (psaHistory.length < 2) return 0;
    const latest = psaHistory[psaHistory.length - 1];
    const previous = psaHistory[psaHistory.length - 2];
    const timeDiff = (new Date(latest.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24 * 365);
    return ((latest.value - previous.value) / timeDiff).toFixed(2);
  };

  const getPSACategory = (psa) => {
    if (psa < 4) return { category: 'Normal', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (psa < 10) return { category: 'Borderline', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (psa < 20) return { category: 'Elevated', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { category: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const maxPSA = Math.max(...mockPatient.psaHistory.map(p => p.value));
  const minPSA = Math.min(...mockPatient.psaHistory.map(p => p.value));
  const psaRange = maxPSA - minPSA;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PSA Chart Analysis</h1>
            <p className="text-sm text-gray-600 mt-1">Prostate-specific antigen trend analysis and clinical summary</p>
          </div>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
              <p className="text-sm text-gray-600 mt-1">Current PSA status and clinical overview</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-lg">
                    {mockPatient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{mockPatient.name}</h3>
                <p className="text-sm text-gray-500">ID: {mockPatient.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                    Age: {mockPatient.age} years
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    PSA Analysis
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Latest PSA</p>
              <p className="text-2xl font-bold text-gray-900">{mockPatient.psaHistory[mockPatient.psaHistory.length - 1].value} ng/mL</p>
              <p className="text-sm text-gray-500">{formatDate(mockPatient.psaHistory[mockPatient.psaHistory.length - 1].date)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* PSA Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">PSA Trend Analysis</h2>
              <p className="text-sm text-gray-600 mt-1">Prostate-specific antigen levels over time</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Chart</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  chartType === 'line' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  chartType === 'bar' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <div className="relative h-80">
              {/* Chart Grid */}
              <div className="absolute inset-0">
                {/* Horizontal grid lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-gray-200"
                    style={{ top: `${(i / 5) * 100}%` }}
                  >
                    <span className="absolute -left-12 -top-2 text-xs text-gray-500">
                      {Math.round(maxPSA - (i / 5) * psaRange)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart Content */}
              <div className="relative h-full">
                {chartType === 'line' ? (
                  // Line Chart
                  <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="psaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Area under curve */}
                    <path
                      d={`M 50 ${250 - ((mockPatient.psaHistory[0].value - minPSA) / psaRange) * 200} ${mockPatient.psaHistory.map((psa, index) => 
                        `L ${50 + (index / (mockPatient.psaHistory.length - 1)) * 700} ${250 - ((psa.value - minPSA) / psaRange) * 200}`
                      ).join(' ')} L ${50 + 700} 250 L 50 250 Z`}
                      fill="url(#psaGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d={`M 50 ${250 - ((mockPatient.psaHistory[0].value - minPSA) / psaRange) * 200} ${mockPatient.psaHistory.map((psa, index) => 
                        `L ${50 + (index / (mockPatient.psaHistory.length - 1)) * 700} ${250 - ((psa.value - minPSA) / psaRange) * 200}`
                      ).join(' ')}`}
                      stroke="#3B82F6"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {mockPatient.psaHistory.map((psa, index) => (
                      <g key={index}>
                        <circle
                          cx={50 + (index / (mockPatient.psaHistory.length - 1)) * 700}
                          cy={250 - ((psa.value - minPSA) / psaRange) * 200}
                          r="8"
                          fill="white"
                          stroke="#3B82F6"
                          strokeWidth="3"
                        />
                        <circle
                          cx={50 + (index / (mockPatient.psaHistory.length - 1)) * 700}
                          cy={250 - ((psa.value - minPSA) / psaRange) * 200}
                          r="4"
                          fill="#3B82F6"
                        />
                      </g>
                    ))}
                  </svg>
                ) : (
                  // Bar Chart
                  <div className="flex items-end justify-between h-full px-4 space-x-1">
                    {mockPatient.psaHistory.map((psa, index) => {
                      const height = ((psa.value - minPSA) / psaRange) * 80; // 80% of container height
                      const category = getPSACategory(psa.value);
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                          <div
                            className={`w-full ${category.bgColor} rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer relative`}
                            style={{ height: `${height}%`, minHeight: '20px' }}
                            title={`${psa.value} ng/mL - ${formatDate(psa.date)}`}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                {psa.value} ng/mL
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <p className="text-xs font-medium text-gray-900">{psa.value}</p>
                            <p className="text-xs text-gray-500">{formatDate(psa.date).split('/')[0]}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Normal</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">&lt; 4.0 ng/mL</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Borderline</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">4.0 - 10.0 ng/mL</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Elevated</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">10.0 - 20.0 ng/mL</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">High Risk</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">&gt; 20.0 ng/mL</p>
          </div>
        </div>
      </div>

      {/* PSA Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">PSA History Data</h2>
              <p className="text-sm text-gray-600 mt-1">Detailed PSA measurements and trends</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Level</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Velocity</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockPatient.psaHistory.map((psa, index) => {
                const category = getPSACategory(psa.value);
                const previousPSA = index > 0 ? mockPatient.psaHistory[index - 1].value : null;
                const change = previousPSA ? ((psa.value - previousPSA) / previousPSA * 100).toFixed(1) : null;
                
                return (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatDate(psa.date)}</td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-900">{psa.value} ng/mL</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${category.bgColor} ${category.color}`}>
                        {category.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {psa.velocity ? `${psa.velocity} ng/mL/year` : '-'}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {change ? (
                        <span className={`font-medium ${parseFloat(change) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {parseFloat(change) > 0 ? '+' : ''}{change}%
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Clinical Summary</h2>
              <p className="text-sm text-gray-600 mt-1">PSA analysis and clinical insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Analysis Complete</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">PSA Velocity</h4>
                <p className="text-2xl font-bold text-blue-600">{calculatePSAVelocity(mockPatient.psaHistory)} ng/mL/year</p>
                <p className="text-sm text-gray-600 mt-1">
                  {parseFloat(calculatePSAVelocity(mockPatient.psaHistory)) > 2 ? 
                    'High velocity - concerning for aggressive disease' : 
                    'Within normal range'
                  }
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Trend Analysis</h4>
                <p className="text-sm text-gray-600">
                  PSA levels show a consistent upward trend over the past year, 
                  indicating potential disease progression requiring further investigation.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                <p className="text-sm text-gray-600">{mockPatient.clinicalNotes}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Referral Information</h4>
                <p className="text-sm text-gray-600">
                  Referred by {mockPatient.referringGP} on {formatDate(mockPatient.referralDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSAChart;
