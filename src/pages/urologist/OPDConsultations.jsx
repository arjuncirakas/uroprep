import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClinicalFindingsModal from '../../components/modals/ClinicalFindingsModal';
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
  UserPlus,
  ClipboardList,
  Users,
  Send,
  Download,
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

const OPDConsultations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { db1 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const { openPatientDetails } = usePatientDetails();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showClinicalDecisionModal, setShowClinicalDecisionModal] = useState(false);
  const [showClinicalFindingsModal, setShowClinicalFindingsModal] = useState(false);
  const [showPSAChartModal, setShowPSAChartModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [psaChartFilter, setPsaChartFilter] = useState('6months');
  const [selectedDecision, setSelectedDecision] = useState(null);

  // Mock OPD patients data
  const opdPatients = [
    {
      id: 'URP001',
      patientName: 'John Smith',
      upi: 'URP2024001',
      age: 65,
      gender: 'Male',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      latestPSA: 25.4,
      status: 'Waiting for Scheduling',
      priority: 'High',
      referralDate: '2024-01-10',
      referralSource: 'GP',
      assignedUrologist: 'Dr. Sarah Johnson',
      appointmentDate: '2024-01-15',
      appointmentTime: '9:00 AM',
      waitTime: '15 minutes',
      reason: 'Elevated PSA with family history of prostate cancer',
      notes: 'DRE reveals firm nodule in left lobe',
      clinicalNotes: 'Elevated PSA with family history of prostate cancer. DRE reveals firm nodule in left lobe.',
      imaging: 'MRI scheduled for next week',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary frequency', 'nocturia'],
      lastPSA: 25.4,
      psaHistory: [4.2, 8.5, 15.3, 25.4],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-10']
    },
    {
      id: 'URP002',
      patientName: 'Mary Johnson',
      upi: 'URP2024002',
      age: 58,
      gender: 'Female',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      latestPSA: 18.7,
      status: 'Scheduled Doctor Appointment',
      priority: 'High',
      referralDate: '2024-01-12',
      referralSource: 'GP',
      assignedUrologist: 'Dr. Michael Chen',
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30 AM',
      waitTime: '0 minutes',
      reason: 'Rapidly rising PSA over 6 months',
      notes: 'Patient reports urinary symptoms and weight loss',
      clinicalNotes: 'Rapidly rising PSA over 6 months. Patient reports urinary symptoms and weight loss.',
      imaging: 'CT scan completed - no distant metastases',
      comorbidities: 'Obesity',
      familyHistory: false,
      dre: 'normal',
      clinicalSymptoms: ['weight loss', 'fatigue'],
      lastPSA: 18.7,
      psaHistory: [3.2, 5.8, 12.4, 18.7],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-12']
    },
    {
      id: 'URP003',
      patientName: 'Robert Brown',
      upi: 'URP2024003',
      age: 72,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      latestPSA: 12.3,
      status: 'Waiting for Secondary Appointment',
      priority: 'Medium',
      referralDate: '2024-01-14',
      referralSource: 'GP',
      assignedUrologist: 'Dr. David Wilson',
      appointmentDate: '2024-01-15',
      appointmentTime: '11:00 AM',
      waitTime: '0 minutes',
      reason: 'Stable PSA over 2 years',
      notes: 'Patient asymptomatic. Routine surveillance referral',
      clinicalNotes: 'Stable PSA over 2 years. Patient asymptomatic. Routine surveillance referral.',
      imaging: 'PSMA PET scan negative',
      comorbidities: 'None',
      familyHistory: false,
      dre: 'normal',
      clinicalSymptoms: [],
      lastPSA: 12.3,
      psaHistory: [11.8, 12.1, 12.0, 12.3],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-14']
    },
    {
      id: 'URP004',
      patientName: 'David Wilson',
      upi: 'URP2024004',
      age: 68,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      latestPSA: 8.5,
      status: 'Scheduled for Procedure',
      priority: 'Medium',
      referralDate: '2024-01-15',
      referralSource: 'GP',
      assignedUrologist: 'Dr. Jennifer Lee',
      appointmentDate: '2024-01-15',
      appointmentTime: '2:00 PM',
      waitTime: '0 minutes',
      reason: 'Patient with elevated PSA',
      notes: 'DRE reveals suspicious nodule. Family history of prostate cancer',
      clinicalNotes: 'Patient with elevated PSA. DRE reveals suspicious nodule. Family history of prostate cancer.',
      imaging: 'MRI scheduled',
      comorbidities: 'None',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary hesitancy'],
      lastPSA: 8.5,
      psaHistory: [4.2, 6.8, 7.9, 8.5],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-15']
    },
    {
      id: 'URP005',
      patientName: 'Sarah Davis',
      upi: 'URP2024005',
      age: 71,
      gender: 'Female',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      latestPSA: 15.2,
      status: 'Awaiting Results',
      priority: 'High',
      referralDate: '2024-01-08',
      referralSource: 'GP',
      assignedUrologist: 'Dr. Michael Chen',
      appointmentDate: '2024-01-15',
      appointmentTime: '3:30 PM',
      waitTime: '0 minutes',
      reason: 'High-risk prostate cancer',
      notes: 'All staging investigations complete. Awaiting MDT discussion',
      clinicalNotes: 'High-risk prostate cancer. All staging investigations complete. Awaiting MDT discussion.',
      imaging: 'CT and bone scan completed',
      comorbidities: 'Hypertension',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['bone pain'],
      lastPSA: 15.2,
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    },
    {
      id: 'URP006',
      patientName: 'Michael Chen',
      upi: 'URP2024006',
      age: 69,
      gender: 'Male',
      phone: '+61 467 890 123',
      email: 'michael.chen@email.com',
      address: '987 Cedar Ln, Melbourne VIC 3000',
      latestPSA: 6.8,
      status: 'Waiting for Scheduling',
      priority: 'Low',
      referralDate: '2024-01-05',
      referralSource: 'GP',
      assignedUrologist: 'Dr. Sarah Johnson',
      appointmentDate: '2024-01-15',
      appointmentTime: '4:30 PM',
      waitTime: '10 minutes',
      reason: 'Low-risk prostate cancer',
      notes: 'Patient on active surveillance protocol',
      clinicalNotes: 'Low-risk prostate cancer. Patient on active surveillance protocol.',
      imaging: 'MRI completed - no progression',
      comorbidities: 'None',
      familyHistory: false,
      dre: 'normal',
      clinicalSymptoms: [],
      lastPSA: 6.8,
      psaHistory: [6.2, 6.5, 6.8],
      psaDates: ['2023-06-15', '2023-12-15', '2024-01-05']
    },
  ];


  // Filter and search logic
  const filteredPatients = opdPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedUrologist.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });


  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'waitTime':
        return b.waitTime - a.waitTime;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });


  const handleClinicalDecision = (patient) => {
    setSelectedPatient(patient);
    setShowClinicalDecisionModal(true);
  };

  const handleClinicalFindings = (patient) => {
    setSelectedPatient(patient);
    setShowClinicalFindingsModal(true);
  };

  const handlePSAChart = (patient) => {
    setSelectedPatient(patient);
    setShowPSAChartModal(true);
  };

  const closeClinicalDecisionModal = () => {
    setShowClinicalDecisionModal(false);
    setSelectedPatient(null);
    setSelectedDecision(null);
  };

  const closeClinicalFindingsModal = () => {
    setShowClinicalFindingsModal(false);
    setSelectedPatient(null);
  };

  const closePSAChartModal = () => {
    setShowPSAChartModal(false);
    setSelectedPatient(null);
  };

  const handleClinicalFindingsSave = () => {
    // Clinical findings are handled by the modal component
    console.log('Clinical findings saved for patient:', selectedPatient?.id);
  };

  const handleViewPatientDetails = (patient) => {
    openPatientDetails(patient.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting for Scheduling': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled Doctor Appointment': return 'bg-blue-100 text-blue-800';
      case 'Scheduled for Procedure': return 'bg-purple-100 text-purple-800';
      case 'Waiting for Secondary Appointment': return 'bg-orange-100 text-orange-800';
      case 'Awaiting Results': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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


      {/* OPD Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">OPD Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients waiting for urologist consultation</p>
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
              placeholder="Search by patient name, UPI, or urologist..."
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedPatients.map((patient, index) => {
                const psaVelocity = calculatePSAVelocity(patient.psaHistory, patient.psaDates);
                return (
                    <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {patient.patientName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patient.patientName}</p>
                            <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                            <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{patient.appointmentTime}</p>
                          <p className="text-sm text-gray-500">{patient.appointmentDate}</p>
                          <p className="text-xs text-gray-400">Source: {patient.referralSource}</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center justify-center text-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewPatientDetails(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleClinicalDecision(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Decision</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients in OPD queue
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients in the OPD queue.
              </p>
              <div className="flex items-center justify-center space-x-4">
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
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


      {/* Clinical Decision Modal */}
      {showClinicalDecisionModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Clinical Decision - {selectedPatient.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Review findings and select treatment pathway</p>
                  </div>
                </div>
                <button
                  onClick={closeClinicalDecisionModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {/* Clinical Findings */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <Stethoscope className="h-3 w-3 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Clinical Findings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DRE Findings</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="normal">Normal</option>
                        <option value="abnormal">Abnormal</option>
                        <option value="suspicious">Suspicious</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comorbidities</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter comorbidities"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imaging Results</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Enter imaging findings (MRI/TRUS)"
                      />
                    </div>
                  </div>
                </div>

                {/* Clinical Decision */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                      <Target className="h-3 w-3 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Treatment Decision</h4>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setSelectedDecision('no-cancer')}
                      className={`w-full p-4 text-left border rounded transition-colors group ${
                        selectedDecision === 'no-cancer' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedDecision === 'no-cancer' 
                            ? 'bg-green-200' 
                            : 'bg-green-100 group-hover:bg-green-200'
                        }`}>
                          <CheckCircle className="h-4 w-4 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">No Cancer Detected</p>
                          <p className="text-sm text-gray-600">Auto-generate GP discharge summary and close case</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-colors ${
                          selectedDecision === 'no-cancer' 
                            ? 'text-green-600' 
                            : 'text-gray-400 group-hover:text-blue-600'
                        }`} />
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedDecision('mdt')}
                      className={`w-full p-4 text-left border rounded transition-colors group ${
                        selectedDecision === 'mdt' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedDecision === 'mdt' 
                            ? 'bg-blue-200' 
                            : 'bg-blue-100 group-hover:bg-blue-200'
                        }`}>
                          <Users className="h-4 w-4 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Refer to Multidisciplinary Team (MDT)</p>
                          <p className="text-sm text-gray-600">Triggers MDT scheduling and summary sent to nurse panel</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-colors ${
                          selectedDecision === 'mdt' 
                            ? 'text-blue-600' 
                            : 'text-gray-400 group-hover:text-blue-600'
                        }`} />
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedDecision('surgical')}
                      className={`w-full p-4 text-left border rounded transition-colors group ${
                        selectedDecision === 'surgical' 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedDecision === 'surgical' 
                            ? 'bg-purple-200' 
                            : 'bg-purple-100 group-hover:bg-purple-200'
                        }`}>
                          <Stethoscope className="h-4 w-4 text-purple-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Proceed to Surgical Pathway</p>
                          <p className="text-sm text-gray-600">Pushes record to Surgical Pathway (DB3) and notifies nurse</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-colors ${
                          selectedDecision === 'surgical' 
                            ? 'text-purple-600' 
                            : 'text-gray-400 group-hover:text-blue-600'
                        }`} />
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setSelectedDecision('surveillance')}
                      className={`w-full p-4 text-left border rounded transition-colors group ${
                        selectedDecision === 'surveillance' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedDecision === 'surveillance' 
                            ? 'bg-orange-200' 
                            : 'bg-orange-100 group-hover:bg-orange-200'
                        }`}>
                          <Activity className="h-4 w-4 text-orange-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Active Surveillance</p>
                          <p className="text-sm text-gray-600">Pushes to DB2 with 6-month follow-up auto-created</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-colors ${
                          selectedDecision === 'surveillance' 
                            ? 'text-orange-600' 
                            : 'text-gray-400 group-hover:text-blue-600'
                        }`} />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Clinical Notes */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                      <FileText className="h-3 w-3 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Clinical Notes & Rationale</h4>
                  </div>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter clinical notes and rationale for decision..."
                  />
                </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeClinicalDecisionModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (selectedDecision) {
                      console.log('Save clinical decision for:', selectedPatient.id, 'Decision:', selectedDecision);
                      closeClinicalDecisionModal();
                    }
                  }}
                  disabled={!selectedDecision}
                  className={`px-6 py-2 text-white rounded transition-colors text-sm font-medium ${
                    selectedDecision 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Save Clinical Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Findings Modal */}
      <ClinicalFindingsModal
        patient={selectedPatient}
        onSave={handleClinicalFindingsSave}
        onClose={closeClinicalFindingsModal}
        isOpen={showClinicalFindingsModal}
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
                      PSA Chart - {selectedPatient.name}
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

export default OPDConsultations;
