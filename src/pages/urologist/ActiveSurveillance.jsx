import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PSAEntryModal from '../../components/modals/PSAEntryModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
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
  RefreshCw
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActiveSurveillance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { db2 } = useSelector(state => state.databases);
  const { openPatientDetails } = usePatientDetails();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showPSAModal, setShowPSAModal] = useState(false);
  const [showPSAEntryModal, setShowPSAEntryModal] = useState(false);
  const [showPSAChartModal, setShowPSAChartModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [psaChartFilter, setPsaChartFilter] = useState('6months');

  // Mock active surveillance data
  const surveillancePatients = [
    {
      id: 'SURV001',
      patientName: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 8.7,
      status: 'Active Surveillance',
      priority: 'Medium',
      type: 'OPD',
      surveillanceStartDate: '2023-11-01',
      nextVisit: '2024-05-01',
      lastPSA: 8.7,
      psaHistory: [
        { date: '2023-03-01', psa: 3.1 },
        { date: '2023-09-01', psa: 3.3 },
        { date: '2023-11-01', psa: 8.7 }
      ],
      psaVelocity: 0.2,
      gleasonScore: '3+4=7',
      stage: 'T2c',
      mriHistory: [
        { date: '2023-09-01', result: 'No significant lesions', pirads: 2 },
        { date: '2023-11-01', result: 'Stable appearance', pirads: 2 }
      ],
      biopsyHistory: [
        { date: '2023-09-15', result: 'Negative', cores: 12, positiveCores: 0 }
      ],
      comorbidities: 'None',
      familyHistory: true,
      clinicalNotes: 'Intermediate-risk prostate cancer. Patient prefers active surveillance.',
      imaging: 'CT completed - T2c disease, no lymph node involvement',
      waitTime: 5,
      riskLevel: 'Low',
      nextSteps: 'Continue surveillance',
      dischargeEligible: false,
      psaAlert: false,
      mriAlert: false,
      biopsyAlert: false,
      followUpScheduled: true,
      compliance: 'Good'
    },
    {
      id: 'SURV002',
      patientName: 'Christopher Lee',
      age: 72,
      dob: '1952-08-12',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      psa: 6.8,
      status: 'Active Surveillance',
      priority: 'Medium',
      type: 'IPD',
      surveillanceStartDate: '2023-10-15',
      nextVisit: '2024-04-15',
      lastPSA: 6.8,
      psaHistory: [
        { date: '2023-06-01', psa: 5.2 },
        { date: '2023-10-15', psa: 6.8 }
      ],
      psaVelocity: 1.6,
      gleasonScore: '3+4=7',
      stage: 'T2b',
      mriHistory: [
        { date: '2023-10-15', result: 'Organ-confined disease', pirads: 3 }
      ],
      biopsyHistory: [
        { date: '2023-10-20', result: 'Positive', cores: 12, positiveCores: 2 }
      ],
      comorbidities: 'Hypertension, Diabetes, COPD',
      familyHistory: false,
      clinicalNotes: 'Intermediate-risk prostate cancer. Patient has multiple comorbidities.',
      imaging: 'MRI completed - T2b disease, organ-confined',
      waitTime: 3,
      riskLevel: 'Medium',
      nextSteps: 'Continue surveillance',
      dischargeEligible: false,
      psaAlert: true,
      mriAlert: false,
      biopsyAlert: false,
      followUpScheduled: true,
      compliance: 'Good'
    },
    {
      id: 'SURV003',
      patientName: 'Thomas Brown',
      age: 68,
      dob: '1956-11-30',
      phone: '+61 501 234 567',
      email: 'thomas.brown@email.com',
      address: '741 Elm St, Newcastle NSW 2300',
      psa: 18.3,
      status: 'Active Surveillance',
      priority: 'High',
      type: 'OPD',
      surveillanceStartDate: '2023-12-01',
      nextVisit: '2024-06-01',
      lastPSA: 18.3,
      psaHistory: [
        { date: '2023-08-01', psa: 12.1 },
        { date: '2023-12-01', psa: 18.3 }
      ],
      psaVelocity: 6.2,
      gleasonScore: '4+4=8',
      stage: 'T3b',
      mriHistory: [
        { date: '2023-12-01', result: 'Seminal vesicle involvement', pirads: 4 }
      ],
      biopsyHistory: [
        { date: '2023-12-05', result: 'Positive', cores: 12, positiveCores: 6 }
      ],
      comorbidities: 'None',
      familyHistory: true,
      clinicalNotes: 'High-risk prostate cancer. MRI shows seminal vesicle involvement.',
      imaging: 'MRI and PSMA PET completed - T3b disease with seminal vesicle involvement',
      waitTime: 0,
      riskLevel: 'High',
      nextSteps: 'Refer back to MDT/Surgery',
      dischargeEligible: false,
      psaAlert: true,
      mriAlert: true,
      biopsyAlert: true,
      followUpScheduled: true,
      compliance: 'Good'
    }
  ];

  // Filter and search logic
  const filteredPatients = surveillancePatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Sort patients by next visit date
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    return new Date(a.nextVisit) - new Date(b.nextVisit);
  });


  const handlePSAReview = (patient) => {
    setSelectedPatient(patient);
    setShowPSAModal(true);
  };

  const handlePSAEntry = (patient) => {
    setSelectedPatient(patient);
    setShowPSAEntryModal(true);
  };

  const closePSAModal = () => {
    setShowPSAModal(false);
    setSelectedPatient(null);
  };

  const closePSAEntryModal = () => {
    setShowPSAEntryModal(false);
    setSelectedPatient(null);
  };

  const handlePSAChart = (patient) => {
    setSelectedPatient(patient);
    setShowPSAChartModal(true);
  };

  const closePSAChartModal = () => {
    setShowPSAChartModal(false);
    setSelectedPatient(null);
  };

  const handlePSAEntrySave = () => {
    // PSA entry is handled by the modal component
    // Refresh the patient data here if needed
    console.log('PSA entry saved for patient:', selectedPatient?.id);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (compliance) => {
    switch (compliance) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Fair': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'OPD': return 'bg-green-100 text-green-800';
      case 'IPD': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculatePSAVelocity = (psaHistory) => {
    if (psaHistory.length < 2) return 0;
    const latest = psaHistory[psaHistory.length - 1];
    const previous = psaHistory[psaHistory.length - 2];
    const timeDiff = (new Date(latest.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24 * 365);
    return ((latest.psa - previous.psa) / timeDiff).toFixed(2);
  };

  // PSA Chart Configuration
  const getPSAChartData = (patient, filter) => {
    if (!patient || !patient.psaHistory) return { labels: [], psaValues: [] };
    
    const psaData = patient.psaHistory.map(item => ({
      value: item.psa,
      date: item.date
    }));
    
    let filteredData = psaData;
    
    switch (filter) {
      case '3months':
        filteredData = psaData.slice(-3);
        break;
      case '6months':
        filteredData = psaData.slice(-6);
        break;
      case '1year':
        filteredData = psaData.slice(-8);
        break;
      case 'all':
      default:
        filteredData = psaData;
        break;
    }

    return {
      labels: filteredData.map(item => new Date(item.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })),
      psaValues: filteredData.map(item => item.value)
    };
  };

  const getPSAChartConfig = (patient, filter) => {
    const chartData = getPSAChartData(patient, filter);
    
    return {
      lineChart: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'PSA Level',
            data: chartData.psaValues,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ],
      },
      barChart: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'PSA Level',
            data: chartData.psaValues,
            backgroundColor: chartData.psaValues.map(value => 
              value > 10 ? 'rgba(239, 68, 68, 0.8)' : 
              value > 4 ? 'rgba(245, 158, 11, 0.8)' : 
              'rgba(34, 197, 94, 0.8)'
            ),
            borderColor: chartData.psaValues.map(value => 
              value > 10 ? 'rgb(239, 68, 68)' : 
              value > 4 ? 'rgb(245, 158, 11)' : 
              'rgb(34, 197, 94)'
            ),
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
          }
        ],
      }
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `PSA Test - ${context[0].label}`;
          },
          label: function(context) {
            return `PSA Level: ${context.parsed.y} ng/mL`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: false,
        min: selectedPatient ? Math.min(...getPSAChartData(selectedPatient, psaChartFilter).psaValues) - 0.5 : 0,
        max: selectedPatient ? Math.max(...getPSAChartData(selectedPatient, psaChartFilter).psaValues) + 0.5 : 20,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value) {
            return value.toFixed(1) + ' ng/mL';
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="space-y-6">


      {/* Surveillance Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Active Surveillance Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients on active surveillance protocol</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="font-medium">Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {sortedPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Latest PSA</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Risk Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPatients.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {(patient.psaAlert || patient.mriAlert || patient.biopsyAlert) && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.compliance} Compliance</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.psa} ng/mL</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(patient.riskLevel)}`}>
                        {patient.riskLevel} Risk
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => openPatientDetails(patient.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => handlePSAChart(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Activity className="h-3 w-3 mr-1" />
                          <span>Chart</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No surveillance patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your search terms.' : 'No patients are currently on active surveillance.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* PSA Review Modal */}
      {showPSAModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                    <LineChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      PSA Review - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Review PSA trends and assess progression</p>
                  </div>
                </div>
                <button
                  onClick={closePSAModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* PSA Trends */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">PSA Trends</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Current PSA</p>
                        <p className="text-2xl font-bold text-green-600">{selectedPatient.psa} ng/mL</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">PSA Velocity</p>
                        <p className="text-2xl font-bold text-green-600">{selectedPatient.psaVelocity} ng/mL/year</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">PSA History</p>
                      <div className="space-y-2 mt-2">
                        {selectedPatient.psaHistory.map((psa, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm text-gray-700">{formatDate(psa.date)}</span>
                            <span className="text-sm font-medium text-gray-900">{psa.psa} ng/mL</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Risk Assessment</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">PSA Velocity Threshold</p>
                      <p className="text-sm text-gray-600">Alert if 0.75 ng/mL/year</p>
                      <div className="mt-2">
                        {selectedPatient.psaVelocity > 0.75 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Alert: {selectedPatient.psaVelocity} ng/mL/year
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Normal: {selectedPatient.psaVelocity} ng/mL/year
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Risk Level</p>
                      <p className="text-sm text-gray-600">{selectedPatient.riskLevel} risk based on PSA trends</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Recommendations</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next Steps</p>
                      <p className="text-sm text-gray-600">{selectedPatient.nextSteps}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Follow-Up Schedule</p>
                      <p className="text-sm text-gray-600">Next visit: {formatDate(selectedPatient.nextVisit)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closePSAModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center space-x-3">
                  {selectedPatient.psaVelocity > 0.75 ? (
                    <button
                      onClick={() => {
                        console.log('Refer to MDT for:', selectedPatient.id);
                        closePSAModal();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Refer to MDT
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        console.log('Continue surveillance for:', selectedPatient.id);
                        closePSAModal();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                      Continue Surveillance
                    </button>
                  )}
                  <button
                    onClick={() => {
                      console.log('Save PSA review for:', selectedPatient.id);
                      closePSAModal();
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Save Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PSA Entry Modal */}
      <PSAEntryModal
        patient={selectedPatient}
        onSave={handlePSAEntrySave}
        onClose={closePSAEntryModal}
        isOpen={showPSAEntryModal}
      />

      {/* PSA Chart Modal */}
      {showPSAChartModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-6xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      PSA Chart - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">PSA Level Trends and Analysis</p>
                  </div>
                </div>
                <button
                  onClick={closePSAChartModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current PSA</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{selectedPatient.psa}</p>
                    <p className="text-sm text-gray-600">ng/mL</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      selectedPatient.psa > 10 ? 'bg-red-50 text-red-700 border border-red-200' :
                      selectedPatient.psa > 4 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {selectedPatient.psa > 10 ? 'High Risk' : selectedPatient.psa > 4 ? 'Elevated' : 'Normal'}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">PSA Velocity</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {calculatePSAVelocity(selectedPatient.psaHistory)}
                    </p>
                    <p className="text-sm text-gray-600">ng/mL/year</p>
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Rising
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Database className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Tests</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{selectedPatient.psaHistory.length}</p>
                    <p className="text-sm text-gray-600">Measurements</p>
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Historical
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Latest Test</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {formatDate(selectedPatient.psaHistory[selectedPatient.psaHistory.length - 1]?.date || '')}
                    </p>
                    <p className="text-sm text-gray-600">Recent</p>
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Recent
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="bg-white border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">Time Period:</label>
                    </div>
                    <select
                      value={psaChartFilter}
                      onChange={(e) => setPsaChartFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                      <option value="3months">Last 3 Tests</option>
                      <option value="6months">Last 6 Tests</option>
                      <option value="1year">Last 8 Tests</option>
                      <option value="all">All Tests</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Normal (&lt;4)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Elevated (4-10)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">High (&gt;10)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <h4 className="text-lg font-semibold text-gray-900">PSA Trend</h4>
                    </div>
                  </div>
                  <div className="h-64">
                    <Line data={getPSAChartConfig(selectedPatient, psaChartFilter).lineChart} options={chartOptions} />
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-green-600" />
                      <h4 className="text-lg font-semibold text-gray-900">PSA Levels</h4>
                    </div>
                  </div>
                  <div className="h-64">
                    <Bar data={getPSAChartConfig(selectedPatient, psaChartFilter).barChart} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* PSA History Table */}
              <div className="bg-white border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">PSA Test History</h4>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">PSA Level</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Change</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getPSAChartData(selectedPatient, psaChartFilter).psaValues.map((value, index) => {
                        const date = selectedPatient.psaHistory[index]?.date;
                        const previousValue = index > 0 ? selectedPatient.psaHistory[index - 1]?.psa : null;
                        const change = previousValue ? (value - previousValue).toFixed(2) : 'N/A';
                        const changeDirection = change !== 'N/A' && parseFloat(change) > 0 ? '↗' : change !== 'N/A' && parseFloat(change) < 0 ? '↘' : '→';
                        const isIncreasing = change !== 'N/A' && parseFloat(change) > 0;
                        const isDecreasing = change !== 'N/A' && parseFloat(change) < 0;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-gray-900">
                                {date ? formatDate(date) : 'N/A'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-semibold text-gray-900">{value} ng/mL</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                                value > 10 ? 'bg-red-50 text-red-700 border border-red-200' :
                                value > 4 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                'bg-green-50 text-green-700 border border-green-200'
                              }`}>
                                {value > 10 ? 'High Risk' : value > 4 ? 'Elevated' : 'Normal'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {change !== 'N/A' ? (
                                <span className={`text-sm font-medium ${
                                  isIncreasing ? 'text-red-600' : isDecreasing ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  {changeDirection} {Math.abs(parseFloat(change)).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-500">Baseline</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-1">
                                {isIncreasing && <TrendingUp className="h-3 w-3 text-red-500" />}
                                {isDecreasing && <TrendingDown className="h-3 w-3 text-green-500" />}
                                {!isIncreasing && !isDecreasing && <Minus className="h-3 w-3 text-gray-400" />}
                                <span className={`text-xs font-medium ${
                                  isIncreasing ? 'text-red-600' : isDecreasing ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {isIncreasing ? 'Rising' : isDecreasing ? 'Falling' : 'Stable'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-end">
                <button
                  onClick={closePSAChartModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSurveillance;
