import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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

const SurgicalPathway = () => {
  const navigate = useNavigate();
  const { db3 } = useSelector(state => state.databases);
  const { openPatientDetails } = usePatientDetails();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSurgeryModal, setShowSurgeryModal] = useState(false);
  const [showPSAChartModal, setShowPSAChartModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('surgeryDate');
  const [psaChartFilter, setPsaChartFilter] = useState('6months');

  // Mock surgical pathway data
  const surgicalPatients = [
    {
      id: 'SURG001',
      patientName: 'Michael Miller',
      age: 69,
      dob: '1955-03-20',
      phone: '+61 467 890 123',
      email: 'michael.miller@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      psa: 15.2,
      status: 'Awaiting Surgery',
      priority: 'High',
      type: 'IPD',
      surgeryDate: '2024-02-15',
      surgeryType: 'Radical Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      preOpAssessment: 'Complete',
      preOpNotes: 'Patient cleared for surgery. All pre-operative tests normal.',
      operativeNotes: '',
      complications: '',
      bloodLoss: '',
      surgeryDuration: '',
      postOpStatus: 'Pending',
      histopathology: '',
      marginStatus: '',
      gleasonScore: '4+4=8',
      stage: 'T3a',
      followUpDate: '2024-03-15',
      lastPSA: 15.2,
      comorbidities: 'Hypertension',
      familyHistory: false,
      clinicalNotes: 'High-risk prostate cancer. MRI shows extracapsular extension.',
      imaging: 'MRI completed - T3a disease with extracapsular extension',
      waitTime: 7,
      riskLevel: 'High',
      approved: false,
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    },
    {
      id: 'SURG002',
      patientName: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 8.7,
      status: 'Surgery Scheduled',
      priority: 'Medium',
      type: 'OPD',
      surgeryDate: '2024-02-20',
      surgeryType: 'Robotic Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      preOpAssessment: 'Complete',
      preOpNotes: 'Patient cleared for surgery. All pre-operative tests normal.',
      operativeNotes: '',
      complications: '',
      bloodLoss: '',
      surgeryDuration: '',
      postOpStatus: 'Pending',
      histopathology: '',
      marginStatus: '',
      gleasonScore: '3+4=7',
      stage: 'T2c',
      followUpDate: '2024-03-20',
      lastPSA: 8.7,
      comorbidities: 'None',
      familyHistory: true,
      clinicalNotes: 'Intermediate-risk prostate cancer. CT shows no lymph node involvement.',
      imaging: 'CT completed - T2c disease, no lymph node involvement',
      waitTime: 5,
      riskLevel: 'Medium',
      approved: true,
      psaHistory: [5.2, 6.8, 7.9, 8.7],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-10']
    },
    {
      id: 'SURG003',
      patientName: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 22.5,
      status: 'Post-Op',
      priority: 'High',
      type: 'IPD',
      surgeryDate: '2024-01-30',
      surgeryType: 'Radical Prostatectomy',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      preOpAssessment: 'Complete',
      preOpNotes: 'Patient cleared for surgery. All pre-operative tests normal.',
      operativeNotes: 'Surgery completed successfully. No intraoperative complications.',
      complications: 'None',
      bloodLoss: '200ml',
      surgeryDuration: '3.5 hours',
      postOpStatus: 'Stable',
      histopathology: 'Adenocarcinoma, Gleason 4+5=9',
      marginStatus: 'Positive margins',
      gleasonScore: '4+5=9',
      stage: 'T4 N1 M1',
      followUpDate: '2024-03-30',
      lastPSA: 22.5,
      comorbidities: 'Diabetes',
      familyHistory: false,
      clinicalNotes: 'High-risk prostate cancer with bone pain. Bone scan shows multiple lesions.',
      imaging: 'Bone scan and PSMA PET completed - multiple bone metastases',
      waitTime: 10,
      riskLevel: 'High',
      approved: true,
      psaHistory: [12.5, 18.3, 20.1, 22.5],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-05']
    }
  ];

  // Filter and search logic
  const filteredPatients = surgicalPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'awaiting' && patient.status === 'Awaiting Surgery') ||
      (activeFilter === 'scheduled' && patient.status === 'Surgery Scheduled') ||
      (activeFilter === 'postop' && patient.status === 'Post-Op') ||
      (activeFilter === 'approved' && patient.approved) ||
      (activeFilter === 'pending' && !patient.approved);
    
    return matchesSearch && matchesFilter;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'surgeryDate':
        return new Date(a.surgeryDate) - new Date(b.surgeryDate);
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'waitTime':
        return b.waitTime - a.waitTime;
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const handleSurgeryApproval = (patient) => {
    setSelectedPatient(patient);
    setShowSurgeryModal(true);
  };

  const handlePSAChart = (patient) => {
    setSelectedPatient(patient);
    setShowPSAChartModal(true);
  };

  const closeSurgeryModal = () => {
    setShowSurgeryModal(false);
    setSelectedPatient(null);
  };

  const closePSAChartModal = () => {
    setShowPSAChartModal(false);
    setSelectedPatient(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Awaiting Surgery': return 'bg-blue-100 text-blue-800';
      case 'Surgery Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Post-Op': return 'bg-green-100 text-green-800';
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculatePSAVelocity = (psaHistory, psaDates) => {
    if (psaHistory.length < 2) return 0;
    const latest = psaHistory[psaHistory.length - 1];
    const previous = psaHistory[psaHistory.length - 2];
    const timeDiff = (new Date(psaDates[psaDates.length - 1]) - new Date(psaDates[psaDates.length - 2])) / (1000 * 60 * 60 * 24 * 365);
    return ((latest - previous) / timeDiff).toFixed(2);
  };

  // PSA Chart Configuration
  const getPSAChartData = (patient, filter) => {
    if (!patient || !patient.psaHistory || !patient.psaDates) return { labels: [], psaValues: [] };
    
    const psaData = patient.psaHistory.map((value, index) => ({
      value: value,
      date: patient.psaDates[index]
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

      {/* Surgical Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Surgical Pathway Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients in the surgical pathway</p>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Risk Level</th>
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
                          {patient.priority === 'High' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.surgeon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.surgeryType}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center justify-center text-center px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(patient.riskLevel)}`}>
                          {patient.riskLevel} Risk
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            sessionStorage.setItem('lastVisitedPage', 'surgical-pathway');
                            openPatientDetails(patient.id);
                          }}
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
                      {!patient.approved && patient.status === 'Awaiting Surgery' && (
                        <button
                          onClick={() => handleSurgeryApproval(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <CheckSquare className="h-3 w-3 mr-1" />
                            <span>Approve</span>
                        </button>
                      )}
                    </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Stethoscope className="h-12 w-12 text-gray-400" />
            </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No surgical patients found
                    </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your filters or search terms.' : 'No patients are currently in the surgical pathway.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                {searchTerm && (
                <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                </button>
                )}
                    </div>
                  </div>
                )}
              </div>
            </div>


      {/* Surgery Approval Modal */}
      {showSurgeryModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Approve Surgery - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Review and approve surgical scheduling</p>
                  </div>
                </div>
                <button
                  onClick={closeSurgeryModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Surgery Details */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Surgery Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Surgery Type:</strong> {selectedPatient.surgeryType}</div>
                    <div><strong>Surgery Date:</strong> {formatDate(selectedPatient.surgeryDate)}</div>
                    <div><strong>Surgeon:</strong> {selectedPatient.surgeon}</div>
                    <div><strong>Anesthetist:</strong> {selectedPatient.anesthetist}</div>
                    <div><strong>Pre-op Assessment:</strong> {selectedPatient.preOpAssessment}</div>
                    <div><strong>Priority:</strong> {selectedPatient.priority}</div>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Age:</strong> {selectedPatient.age} years</div>
                    <div><strong>PSA:</strong> {selectedPatient.psa} ng/mL</div>
                    <div><strong>Gleason Score:</strong> {selectedPatient.gleasonScore}</div>
                    <div><strong>Stage:</strong> {selectedPatient.stage}</div>
                    <div><strong>Comorbidities:</strong> {selectedPatient.comorbidities}</div>
                    <div><strong>Wait Time:</strong> {selectedPatient.waitTime} days</div>
                  </div>
                </div>

                {/* Approval Checklist */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Approval Checklist</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Pre-operative assessment complete</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Patient cleared for surgery</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Surgical team confirmed</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Operating room availability confirmed</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">Post-operative care plan in place</span>
                    </label>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h4>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter any additional notes or considerations..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeSurgeryModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Approve surgery for:', selectedPatient.id);
                    closeSurgeryModal();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-black text-white rounded hover:from-green-700 hover:to-gray-900 transition-all text-sm font-medium"
                >
                  Approve Surgery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      {calculatePSAVelocity(selectedPatient.psaHistory, selectedPatient.psaDates)}
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
                      {new Date(selectedPatient.psaDates[selectedPatient.psaDates.length - 1]).toLocaleDateString('en-AU', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedPatient.psaDates[selectedPatient.psaDates.length - 1]).getFullYear()}
                    </p>
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
                        const date = selectedPatient.psaDates[index];
                        const previousValue = index > 0 ? selectedPatient.psaHistory[index - 1] : null;
                        const change = previousValue ? (value - previousValue).toFixed(2) : 'N/A';
                        const changeDirection = change !== 'N/A' && parseFloat(change) > 0 ? '↗' : change !== 'N/A' && parseFloat(change) < 0 ? '↘' : '→';
                        const isIncreasing = change !== 'N/A' && parseFloat(change) > 0;
                        const isDecreasing = change !== 'N/A' && parseFloat(change) < 0;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(date).toLocaleDateString('en-AU')}
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

export default SurgicalPathway;
