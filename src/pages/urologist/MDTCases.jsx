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
  RefreshCw,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus
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

const MDTCases = () => {
  const navigate = useNavigate();
  const { referrals } = useSelector(state => state.referrals);
  const { openPatientDetails } = usePatientDetails();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showMDTNotesModal, setShowMDTNotesModal] = useState(false);
  const [showPSAChartModal, setShowPSAChartModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [psaChartFilter, setPsaChartFilter] = useState('6months');
  
  // MDT Notes state management
  const [mdtNotes, setMdtNotes] = useState([]);
  const [mdtForm, setMdtForm] = useState({
    mdtDate: '',
    time: '',
    caseType: '',
    priority: 'Medium',
    status: 'Pending Review',
    teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
    discussionNotes: '',
    outcome: '',
    recommendations: '',
    followUpActions: [''],
    documents: []
  });

  const [isDragOver, setIsDragOver] = useState(false);

  // Available team members for dropdown
  const availableTeamMembers = [
    'Dr. Sarah Wilson (Urologist)',
    'Dr. Michael Chen (Oncologist)',
    'Dr. Jennifer Lee (Radiologist)',
    'Dr. David Wilson (Pathologist)',
    'Dr. Emily Brown (Medical Oncologist)',
    'Dr. James Taylor (Radiation Oncologist)',
    'Dr. Lisa Anderson (Nurse Practitioner)',
    'Dr. Robert Garcia (Clinical Psychologist)',
    'Dr. Maria Rodriguez (Social Worker)',
    'Dr. Thomas Lee (Anesthesiologist)',
    'Dr. Amanda White (Physiotherapist)',
    'Dr. Kevin Park (Nutritionist)'
  ];

  // Mock MDT cases data
  const mdtCases = [
    {
      id: 'MDT001',
      patientName: 'Michael Miller',
      age: 69,
      dob: '1955-03-20',
      phone: '+61 467 890 123',
      email: 'michael.miller@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      psa: 15.2,
      status: 'Pending Review',
      priority: 'High',
      type: 'OPD',
      referralDate: '2024-01-08',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'High-risk prostate cancer. MRI shows extracapsular extension. PSMA PET scan shows no distant metastases.',
      imaging: 'MRI completed - T3a disease with extracapsular extension',
      comorbidities: 'Hypertension',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary frequency'],
      waitTime: 7,
      lastPSA: 15.2,
      gleasonScore: '4+4=8',
      stage: 'T3a',
      mdtDate: '2024-01-20',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: '',
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    },
    {
      id: 'MDT002',
      patientName: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 8.7,
      status: 'Pending Review',
      priority: 'Medium',
      type: 'OPD',
      referralDate: '2024-01-10',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Intermediate-risk prostate cancer. CT shows no lymph node involvement. Patient prefers active surveillance.',
      imaging: 'CT completed - T2c disease, no lymph node involvement',
      comorbidities: 'None',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: [],
      waitTime: 5,
      lastPSA: 8.7,
      gleasonScore: '3+4=7',
      stage: 'T2c',
      mdtDate: '2024-01-22',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: '',
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    },
    {
      id: 'MDT003',
      patientName: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 22.5,
      status: 'Pending Review',
      priority: 'High',
      type: 'IPD',
      referralDate: '2024-01-05',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'High-risk prostate cancer with bone pain. Bone scan shows multiple lesions. PSMA PET scan confirms metastatic disease.',
      imaging: 'Bone scan and PSMA PET completed - multiple bone metastases',
      comorbidities: 'Diabetes',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['bone pain', 'weight loss'],
      waitTime: 10,
      lastPSA: 22.5,
      gleasonScore: '4+5=9',
      stage: 'T4 N1 M1',
      mdtDate: '2024-01-18',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: '',
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    },
    {
      id: 'MDT004',
      patientName: 'Christopher Lee',
      age: 72,
      dob: '1952-08-12',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      psa: 6.8,
      status: 'Pending Review',
      priority: 'Medium',
      type: 'OPD',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Intermediate-risk prostate cancer. MRI shows T2b disease. Patient has multiple comorbidities.',
      imaging: 'MRI completed - T2b disease, organ-confined',
      comorbidities: 'Hypertension, Diabetes, COPD',
      familyHistory: false,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary hesitancy'],
      waitTime: 3,
      lastPSA: 6.8,
      gleasonScore: '3+4=7',
      stage: 'T2b',
      mdtDate: '2024-01-25',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: '',
      psaHistory: [8.5, 12.3, 14.1, 15.2],
      psaDates: ['2023-01-15', '2023-06-15', '2023-12-15', '2024-01-08']
    },
    {
      id: 'MDT005',
      patientName: 'Thomas Brown',
      age: 68,
      dob: '1956-11-30',
      phone: '+61 501 234 567',
      email: 'thomas.brown@email.com',
      address: '741 Elm St, Newcastle NSW 2300',
      psa: 18.3,
      status: 'Pending Review',
      priority: 'High',
      type: 'IPD',
      referralDate: '2024-01-15',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'High-risk prostate cancer. MRI shows seminal vesicle involvement. PSMA PET scan shows no distant metastases.',
      imaging: 'MRI and PSMA PET completed - T3b disease with seminal vesicle involvement',
      comorbidities: 'None',
      familyHistory: true,
      dre: 'abnormal',
      clinicalSymptoms: ['urinary frequency', 'nocturia'],
      waitTime: 0,
      lastPSA: 18.3,
      gleasonScore: '4+4=8',
      stage: 'T3b',
      mdtDate: '2024-01-28',
      teamMembers: ['Dr. Sarah Johnson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      mdtNotes: '',
      mdtOutcome: '',
      mdtRecommendations: ''
    }
  ];

  // Filter and search logic
  const filteredCases = mdtCases.filter(case_ => {
    const matchesSearch = searchTerm === '' || 
      case_.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.referringGP.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Sort cases
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'psa':
        return b.psa - a.psa;
      case 'waitTime':
        return b.waitTime - a.waitTime;
      case 'mdtDate':
        return new Date(a.mdtDate) - new Date(b.mdtDate);
      case 'name':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const handleMDTNotes = (case_) => {
    setSelectedCase(case_);
    setShowMDTNotesModal(true);
  };

  const handlePSAChart = (case_) => {
    setSelectedCase(case_);
    setShowPSAChartModal(true);
  };

  const closeMDTNotesModal = () => {
    setShowMDTNotesModal(false);
    setSelectedCase(null);
  };

  const closePSAChartModal = () => {
    setShowPSAChartModal(false);
    setSelectedCase(null);
  };

  // MDT Notes helper functions
  const handleMDTFormChange = (field, value) => {
    setMdtForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFollowUpAction = () => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: [...prev.followUpActions, '']
    }));
  };

  const removeFollowUpAction = (index) => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.filter((_, i) => i !== index)
    }));
  };

  const updateFollowUpAction = (index, value) => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.map((action, i) => i === index ? value : action)
    }));
  };

  const addTeamMember = (selectedMember) => {
    if (selectedMember && !mdtForm.teamMembers.includes(selectedMember)) {
      setMdtForm(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, selectedMember]
      }));
    }
  };

  const removeTeamMember = (index) => {
    setMdtForm(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index, value) => {
    setMdtForm(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }));
  };

  const addDocument = (file) => {
    if (file) {
      const documentName = file.name;
      setMdtForm(prev => ({
        ...prev,
        documents: [...prev.documents, documentName]
      }));
    }
  };

  const removeDocument = (index) => {
    setMdtForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        addDocument(file);
      } else {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      }
    });
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          addDocument(file);
        } else {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
      });
      e.target.value = ''; // Reset file input
    }
  };

  const saveMDTNote = () => {
    const newMDTNote = {
      id: `MDT${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: mdtForm.mdtDate,
      time: mdtForm.time,
      mdtDate: mdtForm.mdtDate,
      teamMembers: mdtForm.teamMembers.filter(member => member.trim() !== ''),
      caseType: mdtForm.caseType,
      priority: mdtForm.priority,
      status: mdtForm.status,
      discussionNotes: mdtForm.discussionNotes,
      outcome: mdtForm.outcome,
      recommendations: mdtForm.recommendations,
      followUpActions: mdtForm.followUpActions.filter(action => action.trim() !== ''),
      documents: mdtForm.documents
    };

    setMdtNotes(prev => [newMDTNote, ...prev]);
    
    // Reset form
    setMdtForm({
      mdtDate: '',
      time: '',
      caseType: '',
      priority: 'Medium',
      status: 'Pending Review',
      teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      discussionNotes: '',
      outcome: '',
      recommendations: '',
      followUpActions: [''],
      documents: []
    });

    closeMDTNotesModal();
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
      case 'Pending Review': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Review Complete': return 'bg-green-100 text-green-800';
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
  const getPSAChartData = (case_, filter) => {
    if (!case_ || !case_.psaHistory || !case_.psaDates) return { labels: [], psaValues: [] };
    
    const psaData = case_.psaHistory.map((value, index) => ({
      value: value,
      date: case_.psaDates[index]
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

  const getPSAChartConfig = (case_, filter) => {
    const chartData = getPSAChartData(case_, filter);
    
    return {
      lineChart: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'PSA Level',
            data: chartData.psaValues,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
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
            borderWidth: 1,
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
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
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
        cornerRadius: 6,
        displayColors: false,
        padding: 8,
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          size: 11,
          weight: '500'
        },
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
            size: 11,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: false,
        min: selectedCase ? Math.min(...getPSAChartData(selectedCase, psaChartFilter).psaValues) - 0.5 : 0,
        max: selectedCase ? Math.max(...getPSAChartData(selectedCase, psaChartFilter).psaValues) + 0.5 : 20,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
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


      {/* MDT Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MDT Cases Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Cases awaiting multidisciplinary team discussion</p>
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
              placeholder="Search by patient name, ID, or referring GP..."
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
          {sortedCases.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Level</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">MDT Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedCases.map((case_, index) => (
                  <tr key={case_.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {case_.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {case_.priority === 'High' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{case_.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {case_.id}</p>
                          <p className="text-xs text-gray-400">Age: {case_.age} • {case_.referringGP}</p>
                          </div>
                        </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{case_.psa} ng/mL</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-medium text-gray-900">{formatDate(case_.mdtDate)}</p>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(case_.priority)}`}>
                        {case_.priority}
                            </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                      <button
                          onClick={() => {
                            sessionStorage.setItem('lastVisitedPage', 'mdt-cases');
                            openPatientDetails(case_.id);
                          }}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                      </button>
                      <button
                          onClick={() => handlePSAChart(case_)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                          <Activity className="h-3 w-3 mr-1" />
                          <span>Chart</span>
                      </button>
                      <button
                          onClick={() => handleMDTNotes(case_)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>MDT Notes</span>
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
                <Users className="h-12 w-12 text-gray-400" />
            </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No MDT cases found
                    </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No cases match your search criteria. Try adjusting your search terms.' : 'No cases are currently in the MDT queue.'}
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

      {/* Local MDT Notes Display */}
      {mdtNotes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent MDT Notes</h2>
                <p className="text-sm text-gray-600 mt-1">Locally added MDT discussion notes and outcomes</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">{mdtNotes.length} Notes</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {mdtNotes.map((mdtNote, index) => {
                const getPriorityColor = (priority) => {
                  switch (priority) {
                    case 'High': return 'bg-red-100 text-red-800 border-red-200';
                    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                    case 'Low': return 'bg-green-100 text-green-800 border-green-200';
                    default: return 'bg-gray-100 text-gray-800 border-gray-200';
                  }
                };

                const getStatusColor = (status) => {
                  switch (status) {
                    case 'Review Complete': return 'bg-green-100 text-green-800';
                    case 'Under Review': return 'bg-yellow-100 text-yellow-800';
                    case 'Pending Review': return 'bg-blue-100 text-blue-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                const getOutcomeColor = (outcome) => {
                  switch (outcome) {
                    case 'Proceed to Surgery': return 'bg-red-100 text-red-800';
                    case 'Continue Active Surveillance': return 'bg-green-100 text-green-800';
                    case 'Radiation Therapy': return 'bg-purple-100 text-purple-800';
                    default: return 'bg-gray-100 text-gray-800';
                  }
                };

                return (
                  <div key={mdtNote.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">MDT Discussion</h4>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(mdtNote.priority)}`}>
                            {mdtNote.priority} Priority
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mdtNote.status)}`}>
                            {mdtNote.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(mdtNote.mdtDate)} at {mdtNote.time}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="font-medium text-gray-700">{mdtNote.caseType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Team Members</h5>
                      <div className="flex flex-wrap gap-2">
                        {mdtNote.teamMembers.map((member, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Discussion Notes */}
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Discussion Notes</h5>
                      <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {mdtNote.discussionNotes}
                      </p>
                    </div>

                    {/* Outcome */}
                    {mdtNote.outcome && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">MDT Outcome</h5>
                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getOutcomeColor(mdtNote.outcome)}`}>
                          {mdtNote.outcome}
                        </span>
                      </div>
                    )}

                    {/* Recommendations */}
                    {mdtNote.recommendations && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h5>
                        <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">
                          {mdtNote.recommendations}
                        </p>
                      </div>
                    )}

                    {/* Follow-up Actions */}
                    {mdtNote.followUpActions && mdtNote.followUpActions.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Follow-up Actions</h5>
                        <ul className="space-y-1">
                          {mdtNote.followUpActions.map((action, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-700">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Documents */}
                    {mdtNote.documents && mdtNote.documents.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Documents</h5>
                        <div className="flex flex-wrap gap-2">
                          {mdtNote.documents.map((doc, idx) => (
                            <button
                              key={idx}
                              onClick={() => console.log('Download:', doc)}
                              className="flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {doc}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MDT Notes Modal */}
      {showMDTNotesModal && selectedCase && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      MDT Notes - {selectedCase.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">Add comprehensive MDT discussion notes and outcomes</p>
                  </div>
                </div>
                <button
                  onClick={closeMDTNotesModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Meeting Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">MDT Date *</label>
                      <input
                        type="date"
                        value={mdtForm.mdtDate}
                        onChange={(e) => handleMDTFormChange('mdtDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                      <input
                        type="time"
                        value={mdtForm.time}
                        onChange={(e) => handleMDTFormChange('time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Case Type *</label>
                      <input
                        type="text"
                        value={mdtForm.caseType}
                        onChange={(e) => handleMDTFormChange('caseType', e.target.value)}
                        placeholder="e.g., High-risk prostate cancer"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                      <select
                        value={mdtForm.priority}
                        onChange={(e) => handleMDTFormChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                      <select
                        value={mdtForm.status}
                        onChange={(e) => handleMDTFormChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Review Complete">Review Complete</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Team Members</h4>
                    <div className="flex items-center space-x-3">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            addTeamMember(e.target.value);
                            e.target.value = ''; // Reset dropdown
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        defaultValue=""
                      >
                        <option value="" disabled>Select team member to add</option>
                        {availableTeamMembers
                          .filter(member => !mdtForm.teamMembers.includes(member))
                          .map((member, index) => (
                            <option key={index} value={member}>
                              {member}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mdtForm.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                          {member}
                        </div>
                        {mdtForm.teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Remove team member"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discussion Notes */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Discussion Notes</h4>
                  <textarea
                    value={mdtForm.discussionNotes}
                    onChange={(e) => handleMDTFormChange('discussionNotes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="6"
                    placeholder="Enter detailed MDT discussion notes, findings, and clinical reasoning..."
                  />
                </div>

                {/* MDT Outcome */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Outcome</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleMDTFormChange('outcome', 'Continue Active Surveillance')}
                      className={`w-full p-4 text-left border rounded transition-colors ${
                        mdtForm.outcome === 'Continue Active Surveillance' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Continue Active Surveillance</p>
                          <p className="text-sm text-gray-600">Patient remains on surveillance protocol</p>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleMDTFormChange('outcome', 'Proceed to Surgery')}
                      className={`w-full p-4 text-left border rounded transition-colors ${
                        mdtForm.outcome === 'Proceed to Surgery' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Proceed to Surgery</p>
                          <p className="text-sm text-gray-600">Schedule surgical intervention</p>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleMDTFormChange('outcome', 'Radiation Therapy')}
                      className={`w-full p-4 text-left border rounded transition-colors ${
                        mdtForm.outcome === 'Radiation Therapy' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Radiation Therapy</p>
                          <p className="text-sm text-gray-600">Refer for radiation oncology</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Recommendations</h4>
                  <textarea
                    value={mdtForm.recommendations}
                    onChange={(e) => handleMDTFormChange('recommendations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter specific recommendations and next steps..."
                  />
                </div>

                {/* Follow-up Actions */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Follow-up Actions</h4>
                    <button
                      type="button"
                      onClick={addFollowUpAction}
                      className="flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Action
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mdtForm.followUpActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={action}
                          onChange={(e) => updateFollowUpAction(index, e.target.value)}
                          placeholder="e.g., Schedule pre-operative cardiology assessment"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {mdtForm.followUpActions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFollowUpAction(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Documents</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{mdtForm.documents.length} files</span>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded p-6 transition-all duration-200 ${
                      isDragOver
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <div className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                        isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <FileText className={`h-6 w-6 transition-colors ${
                          isDragOver ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                      
                      <h5 className={`text-base font-medium mb-2 transition-colors ${
                        isDragOver ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {isDragOver ? 'Drop files here' : 'Upload Documents'}
                      </h5>
                      
                      <p className="text-sm text-gray-500 mb-3">
                        Drag and drop files here, or{' '}
                        <label
                          htmlFor="document-upload"
                          className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium underline"
                        >
                          browse to choose files
                        </label>
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                        <span>PDF, DOC, DOCX</span>
                        <span>JPG, PNG</span>
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {mdtForm.documents.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h5>
                      <div className="space-y-2">
                        {mdtForm.documents.map((document, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="p-2 bg-blue-100 rounded">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{document}</p>
                                <p className="text-xs text-gray-500">Ready to attach</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => console.log('Download:', document)}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Download document"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Remove document"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeMDTNotesModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMDTNote}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Save MDT Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PSA Chart Modal */}
      {showPSAChartModal && selectedCase && (
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
                      PSA Chart - {selectedCase.patientName}
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
                    <p className="text-2xl font-bold text-gray-900">{selectedCase.psa}</p>
                    <p className="text-sm text-gray-600">ng/mL</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      selectedCase.psa > 10 ? 'bg-red-50 text-red-700 border border-red-200' :
                      selectedCase.psa > 4 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                      'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      {selectedCase.psa > 10 ? 'High Risk' : selectedCase.psa > 4 ? 'Elevated' : 'Normal'}
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
                      {calculatePSAVelocity(selectedCase.psaHistory, selectedCase.psaDates)}
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
                    <p className="text-2xl font-bold text-gray-900">{selectedCase.psaHistory.length}</p>
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
                      {new Date(selectedCase.psaDates[selectedCase.psaDates.length - 1]).toLocaleDateString('en-AU', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedCase.psaDates[selectedCase.psaDates.length - 1]).getFullYear()}
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
                    <Line data={getPSAChartConfig(selectedCase, psaChartFilter).lineChart} options={chartOptions} />
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
                    <Bar data={getPSAChartConfig(selectedCase, psaChartFilter).barChart} options={chartOptions} />
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
                      {getPSAChartData(selectedCase, psaChartFilter).psaValues.map((value, index) => {
                        const date = selectedCase.psaDates[index];
                        const previousValue = index > 0 ? selectedCase.psaHistory[index - 1] : null;
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

export default MDTCases;
