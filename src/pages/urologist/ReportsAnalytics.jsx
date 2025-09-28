import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  Database,
  Activity,
  Stethoscope,
  Heart,
  ArrowRight,
  X,
  Filter,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  Shield,
  Users,
  Send,
  Download,
  ClipboardList,
  MessageSquare,
  FileCheck,
  Upload,
  CheckSquare,
  Square,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Microscope,
  TestTube,
  FileBarChart,
  Zap,
  LineChart,
  BarChart3,
  PieChart,
  Mail as MailIcon,
  FileX,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  BarChart,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Target as TargetIcon,
  Activity as ActivityIcon
} from 'lucide-react';

const ReportsAnalytics = () => {
  const navigate = useNavigate();
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('6months');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalPatients: 156,
      activeSurveillance: 45,
      surgicalPatients: 32,
      postOpPatients: 28,
      mdtCases: 18,
      newReferrals: 23,
      avgWaitTime: 12,
      mdtReferralRate: 23.5
    },
    outcomes: {
      surgicalOutcomes: {
        totalSurgeries: 32,
        positiveMargins: 8,
        negativeMargins: 24,
        complications: 3,
        readmissions: 2
      },
      surveillanceOutcomes: {
        totalSurveillance: 45,
        stable: 38,
        progressed: 7,
        discharged: 12,
        compliance: 89.2
      },
      mdtOutcomes: {
        totalMDTCases: 18,
        surgeryRecommended: 8,
        surveillanceRecommended: 6,
        oncologyReferred: 4
      }
    },
    trends: {
      psaTrends: [
        { month: 'Jan', avgPSA: 8.2, patients: 12 },
        { month: 'Feb', avgPSA: 7.8, patients: 15 },
        { month: 'Mar', avgPSA: 9.1, patients: 18 },
        { month: 'Apr', avgPSA: 8.5, patients: 14 },
        { month: 'May', avgPSA: 7.9, patients: 16 },
        { month: 'Jun', avgPSA: 8.3, patients: 13 }
      ],
      referralTrends: [
        { month: 'Jan', referrals: 8, mdt: 2 },
        { month: 'Feb', referrals: 12, mdt: 3 },
        { month: 'Mar', referrals: 15, mdt: 4 },
        { month: 'Apr', referrals: 10, mdt: 2 },
        { month: 'May', referrals: 14, mdt: 3 },
        { month: 'Jun', referrals: 11, mdt: 3 }
      ]
    },
    performance: {
      waitTimes: {
        opd: 8,
        mdt: 15,
        surgery: 28,
        followUp: 6
      },
      compliance: {
        surveillance: 89.2,
        followUp: 94.5,
        mdt: 96.8,
        surgery: 98.1
      },
      quality: {
        patientSatisfaction: 4.6,
        clinicalOutcomes: 4.8,
        communication: 4.5,
        timeliness: 4.3
      }
    }
  };

  const getTabColor = (tab) => {
    return activeTab === tab ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Urologist performance metrics and patient outcomes</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <button
              onClick={() => {
                console.log('Export report');
              }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart },
              { id: 'outcomes', name: 'Outcomes', icon: Target },
              { id: 'trends', name: 'Trends', icon: TrendingUp },
              { id: 'performance', name: 'Performance', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium rounded-t-lg transition-colors ${getTabColor(tab.id)}`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-4">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalPatients}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-4">
                  <ActivityIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">Active Surveillance</p>
                  <p className="text-2xl font-bold text-green-600">{analyticsData.overview.activeSurveillance}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center mr-4">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-900">Surgical Patients</p>
                  <p className="text-2xl font-bold text-red-600">{analyticsData.overview.surgicalPatients}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-900">MDT Cases</p>
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.overview.mdtCases}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">{analyticsData.overview.activeSurveillance}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Active Surveillance</p>
                <p className="text-xs text-gray-600">DB2</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">{analyticsData.overview.surgicalPatients}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Surgical Pathway</p>
                <p className="text-xs text-gray-600">DB3</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">{analyticsData.overview.postOpPatients}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">Post-Op Follow-Up</p>
                <p className="text-xs text-gray-600">DB4</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xl">{analyticsData.overview.mdtCases}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">MDT Cases</p>
                <p className="text-xs text-gray-600">MDT</p>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Average Wait Time</p>
                    <p className="text-2xl font-bold text-yellow-600">{analyticsData.overview.avgWaitTime} days</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">MDT Referral Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.mdtReferralRate}%</p>
                  </div>
                  <TargetIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-900">New Referrals</p>
                    <p className="text-2xl font-bold text-green-600">{analyticsData.overview.newReferrals}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outcomes Tab */}
      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          {/* Surgical Outcomes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Surgical Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.outcomes.surgicalOutcomes.totalSurgeries}</p>
                  <p className="text-sm text-blue-900">Total Surgeries</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analyticsData.outcomes.surgicalOutcomes.negativeMargins}</p>
                  <p className="text-sm text-green-900">Negative Margins</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{analyticsData.outcomes.surgicalOutcomes.positiveMargins}</p>
                  <p className="text-sm text-red-900">Positive Margins</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{analyticsData.outcomes.surgicalOutcomes.complications}</p>
                  <p className="text-sm text-yellow-900">Complications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Surveillance Outcomes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Surveillance Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.outcomes.surveillanceOutcomes.totalSurveillance}</p>
                  <p className="text-sm text-blue-900">Total Surveillance</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analyticsData.outcomes.surveillanceOutcomes.stable}</p>
                  <p className="text-sm text-green-900">Stable</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{analyticsData.outcomes.surveillanceOutcomes.progressed}</p>
                  <p className="text-sm text-red-900">Progressed</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.outcomes.surveillanceOutcomes.compliance}%</p>
                  <p className="text-sm text-purple-900">Compliance</p>
                </div>
              </div>
            </div>
          </div>

          {/* MDT Outcomes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MDT Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.outcomes.mdtOutcomes.totalMDTCases}</p>
                  <p className="text-sm text-blue-900">Total MDT Cases</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{analyticsData.outcomes.mdtOutcomes.surgeryRecommended}</p>
                  <p className="text-sm text-red-900">Surgery Recommended</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analyticsData.outcomes.mdtOutcomes.surveillanceRecommended}</p>
                  <p className="text-sm text-green-900">Surveillance Recommended</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.outcomes.mdtOutcomes.oncologyReferred}</p>
                  <p className="text-sm text-purple-900">Oncology Referred</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* PSA Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">PSA Trends</h3>
            <div className="space-y-4">
              {analyticsData.trends.psaTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{trend.month}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Average PSA: {trend.avgPSA} ng/mL</p>
                      <p className="text-xs text-gray-600">{trend.patients} patients</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Trend</p>
                    <div className="flex items-center">
                      {trend.avgPSA > 8.0 ? (
                        <TrendingUp className="h-4 w-4 text-red-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Trends */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Trends</h3>
            <div className="space-y-4">
              {analyticsData.trends.referralTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{trend.month}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Referrals: {trend.referrals}</p>
                      <p className="text-xs text-gray-600">MDT Referrals: {trend.mdt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">MDT Rate</p>
                    <p className="text-sm font-medium text-gray-900">{((trend.mdt / trend.referrals) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Wait Times */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Wait Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.performance.waitTimes.opd} days</p>
                  <p className="text-sm text-blue-900">OPD Consultation</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.performance.waitTimes.mdt} days</p>
                  <p className="text-sm text-purple-900">MDT Discussion</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{analyticsData.performance.waitTimes.surgery} days</p>
                  <p className="text-sm text-red-900">Surgery</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analyticsData.performance.waitTimes.followUp} days</p>
                  <p className="text-sm text-green-900">Follow-Up</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Rates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Rates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analyticsData.performance.compliance.surveillance}%</p>
                  <p className="text-sm text-green-900">Surveillance</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.performance.compliance.followUp}%</p>
                  <p className="text-sm text-blue-900">Follow-Up</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.performance.compliance.mdt}%</p>
                  <p className="text-sm text-purple-900">MDT</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{analyticsData.performance.compliance.surgery}%</p>
                  <p className="text-sm text-red-900">Surgery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{analyticsData.performance.quality.patientSatisfaction}/5</p>
                  <p className="text-sm text-yellow-900">Patient Satisfaction</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{analyticsData.performance.quality.clinicalOutcomes}/5</p>
                  <p className="text-sm text-green-900">Clinical Outcomes</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{analyticsData.performance.quality.communication}/5</p>
                  <p className="text-sm text-blue-900">Communication</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{analyticsData.performance.quality.timeliness}/5</p>
                  <p className="text-sm text-purple-900">Timeliness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              console.log('Export PDF report');
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => {
              console.log('Export Excel report');
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Export Excel
          </button>
          <button
            onClick={() => {
              console.log('Export CSV report');
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => {
              console.log('Schedule report');
            }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
