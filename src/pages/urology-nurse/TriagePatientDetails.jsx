import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  Target,
  Zap,
  Bell,
  Share,
  Send,
  Heart,
  Stethoscope,
  Pill,
  Edit,
  Plus,
  Eye,
  X,
  Save,
  ChevronRight,
  Shield,
  ArrowRight,
  TestTube,
  Database,
  Download,
  Upload
} from 'lucide-react';

const TriagePatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [triageStatus, setTriageStatus] = useState('');
  const [triageNotes, setTriageNotes] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [manualAssignment, setManualAssignment] = useState({
    pathway: '',
    priority: '',
    notes: ''
  });

  // Database options for manual assignment
  const databaseOptions = [
    { id: 'db1', name: 'DB1 - Initial Assessment', description: 'New patient initial assessment queue' },
    { id: 'db2', name: 'DB2 - Active Surveillance', description: 'Active surveillance monitoring queue' },
    { id: 'db3', name: 'DB3 - Pre-Surgical', description: 'Pre-surgical assessment and preparation' },
    { id: 'db4', name: 'DB4 - Post-Surgical', description: 'Post-surgical follow-up and monitoring' },
    { id: 'mdt', name: 'MDT - Multi-Disciplinary Team', description: 'Complex cases requiring MDT review' },
    { id: 'opd', name: 'OPD - Outpatient Department', description: 'General outpatient consultation' }
  ];

  // Pathway options
  const pathwayOptions = [
    'MDT Review',
    'OPD Queue',
    'Active Surveillance',
    'Surgical Pathway',
    'Discharge to GP',
    'Urgent Assessment'
  ];

  // Mock referral data - in real app, fetch by ID
  const mockReferral = {
    id: 'REF001',
    patientName: 'John Smith',
    age: 65,
    gender: 'Male',
    dob: '1959-03-15',
    medicareNumber: '1234567890',
    referralDate: '2024-01-10',
    receivedDate: '2024-01-12',
    status: 'pending',
    urgency: 'high',
    priority: 'urgent',
    referralType: 'cpc',
    cpcCriteria: 'PSA > 4.0 ng/mL',
    clinicalOverrideReason: '',
    referringGP: 'Dr. Sarah Johnson',
    practice: 'City Medical Centre',
    practiceAddress: '123 Medical Street, City, State 12345',
    practicePhone: '(555) 123-4567',
    providerNumber: '1234567A',
    reason: 'Elevated PSA (8.5 ng/mL) with abnormal DRE',
    clinicalDetails: 'PSA rising from 4.2 to 8.5 over 6 months. DRE reveals firm, irregular prostate.',
    comorbidities: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Metformin', 'Lisinopril'],
    lastPSA: 8.5,
    lastPSADate: '2024-01-08',
    familyHistory: 'Father had prostate cancer at age 70',
    familyHistoryBoolean: true,
    dreFinding: 'abnormal',
    triagedBy: null,
    triagedAt: null,
    notes: 'Urgent review required due to rapid PSA rise',
    psaSuggestion: 'MDT/Urology OPD (urgent)',
    psaCriteria: 'PSA >10 ng/mL',
    suggestedPathway: 'MDT Review',
    suggestedDatabase: 'MDT - Multi-Disciplinary Team',
    databaseReason: 'PSA level of 8.5 ng/mL exceeds the threshold of 4.0 ng/mL with rapid rise over 6 months, combined with abnormal DRE findings, indicating high risk requiring immediate MDT review for potential prostate cancer diagnosis and treatment planning.',
    contactInfo: {
      phone: '(555) 987-6543',
      email: 'john.smith@email.com',
      address: '456 Patient Lane, City, State 12345'
    },
    attachments: {
      labReport: 'PSA_Report_John_Smith_2024-01-08.pdf',
      imaging: null,
      idProof: 'Drivers_License_John_Smith.pdf',
      insuranceInfo: 'Medicare_Card_John_Smith.pdf'
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'triaged': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'ready_for_discharge': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPSASuggestionColor = (suggestion) => {
    switch (suggestion) {
      case 'MDT/Urology OPD (urgent)': return 'bg-red-100 text-red-800 border-red-200';
      case 'OPD Consultation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Active Surveillance': return 'bg-green-100 text-green-800 border-green-200';
      case 'Discharge to GP': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTriageAction = (action) => {
    if (action === 'accept') {
      // Accept system suggestion
      setTriageStatus('accepted');
      setSelectedPathway(mockReferral.suggestedPathway);
      // Map the suggested database to the correct database ID
      const databaseMapping = {
        'MDT - Multi-Disciplinary Team': 'mdt',
        'OPD - Outpatient Department': 'opd',
        'DB1 - Initial Assessment': 'db1',
        'DB2 - Active Surveillance': 'db2',
        'DB3 - Pre-Surgical': 'db3',
        'DB4 - Post-Surgical': 'db4'
      };
      setSelectedDatabase(databaseMapping[mockReferral.suggestedDatabase] || 'mdt');
    } else if (action === 'manual') {
      // Manual assignment
      setTriageStatus('manual');
    }
  };

  const handleManualAssignmentChange = (field, value) => {
    setManualAssignment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveTriage = () => {
    const triageData = {
      referralId: mockReferral.id,
      triageStatus,
      triageNotes,
      selectedPathway: triageStatus === 'accepted' ? selectedPathway : manualAssignment.pathway,
      selectedDatabase: triageStatus === 'accepted' ? selectedDatabase : null,
      manualAssignment: triageStatus === 'manual' ? manualAssignment : null,
      triagedBy: 'Current User', // This would come from auth state
      triagedAt: new Date().toISOString()
    };
    
    console.log('Saving triage:', triageData);
    // Navigate back to triage list
    navigate('/urology-nurse/triage');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'psa', name: 'PSA Data', icon: TrendingUp },
    { id: 'suggestions', name: 'System Suggestions', icon: Target },
    { id: 'triage', name: 'Triage Actions', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/urology-nurse/triage')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Triage
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColor(mockReferral.urgency)}`}>
            {mockReferral.urgency.toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(mockReferral.priority)}`}>
            {mockReferral.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {mockReferral.patientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{mockReferral.patientName}</h1>
                <p className="text-sm text-gray-600">Referral ID: {mockReferral.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(mockReferral.status)}`}>
                    {mockReferral.status.replace('_', ' ')}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-green-100 text-green-800">
                    Age: {mockReferral.age} years
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Latest PSA</p>
              <p className="text-lg font-semibold text-gray-900">{mockReferral.lastPSA} ng/mL</p>
              <p className="text-sm text-gray-500">{mockReferral.lastPSADate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Patient Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-900">{mockReferral.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Referral ID:</span>
                      <span className="text-gray-900">{mockReferral.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">DOB:</span>
                      <span className="text-gray-900">{mockReferral.dob}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Age:</span>
                      <span className="text-gray-900">{mockReferral.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Gender:</span>
                      <span className="text-gray-900">{mockReferral.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Medicare:</span>
                      <span className="text-gray-900">{mockReferral.medicareNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Contact Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-900">{mockReferral.contactInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-900">{mockReferral.contactInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Address:</span>
                      <span className="text-gray-900 text-right">{mockReferral.contactInfo.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Referring GP</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">GP Name:</span>
                      <span className="text-gray-900">{mockReferral.referringGP}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Provider Number:</span>
                      <span className="text-gray-900">{mockReferral.providerNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Practice:</span>
                      <span className="text-gray-900">{mockReferral.practice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Practice Phone:</span>
                      <span className="text-gray-900">{mockReferral.practicePhone}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Referral Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="text-gray-900">{mockReferral.referralType.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Criteria:</span>
                      <span className="text-gray-900">{mockReferral.cpcCriteria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Referral Date:</span>
                      <span className="text-gray-900">{mockReferral.referralDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Received:</span>
                      <span className="text-gray-900">{mockReferral.receivedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PSA Data Tab */}
          {activeTab === 'psa' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">PSA Data & Criteria</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-900">{mockReferral.lastPSA}</div>
                    <div className="text-sm text-blue-700">ng/mL</div>
                    <div className="text-xs text-blue-600 mt-1">Latest PSA</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-lg font-semibold text-green-900">{mockReferral.psaCriteria}</div>
                    <div className="text-sm text-green-700">PSA Criteria</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-lg font-semibold text-purple-900">{mockReferral.lastPSADate}</div>
                    <div className="text-sm text-purple-700">Test Date</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Clinical Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{mockReferral.clinicalDetails}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Comorbidities</h3>
                    <div className="space-y-2">
                      {mockReferral.comorbidities.map((comorbidity, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {comorbidity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Current Medications</h3>
                    <div className="space-y-2">
                      {mockReferral.medications.map((medication, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Family History</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{mockReferral.familyHistory}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">System Suggestions</h2>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">PSA-Based Database Suggestion</h3>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getPSASuggestionColor(mockReferral.psaSuggestion)}`}>
                        {mockReferral.suggestedDatabase}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Based on PSA level of {mockReferral.lastPSA} ng/mL and criteria: {mockReferral.psaCriteria}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-blue-900 mb-2">Reasoning:</h4>
                      <p className="text-sm text-blue-800">{mockReferral.databaseReason}</p>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">Suggested Pathway</h3>
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {mockReferral.suggestedPathway}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Recommended clinical pathway based on current assessment</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <h3 className="text-sm font-medium text-yellow-900">Clinical Notes</h3>
                    </div>
                    <p className="text-sm text-yellow-800">{mockReferral.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Triage Actions Tab */}
          {activeTab === 'triage' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Triage Actions</h2>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <button
                      onClick={() => handleTriageAction('accept')}
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept System Suggestion
                    </button>
                    <button
                      onClick={() => handleTriageAction('manual')}
                      className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Manual Assignment
                    </button>
                  </div>
                  
                  {triageStatus && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Triage Decision</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            triageStatus === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {triageStatus === 'accepted' ? 'Accepted Suggestion' : 'Manual Assignment'}
                          </span>
                        </div>
                        
                        {triageStatus === 'accepted' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Pathway</label>
                              <span className="text-sm text-gray-900">{mockReferral.suggestedPathway}</span>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Database Assignment</label>
                              <span className="text-sm text-gray-900">{mockReferral.suggestedDatabase}</span>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">System Reasoning</label>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">{mockReferral.databaseReason}</p>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {triageStatus === 'manual' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Select Pathway</label>
                              <select
                                value={manualAssignment.pathway}
                                onChange={(e) => handleManualAssignmentChange('pathway', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                              >
                                <option value="">Choose pathway...</option>
                                {pathwayOptions.map((pathway) => (
                                  <option key={pathway} value={pathway}>
                                    {pathway}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                              <select
                                value={manualAssignment.priority}
                                onChange={(e) => handleManualAssignmentChange('priority', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                              >
                                <option value="">Select priority...</option>
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Manual Assignment Notes</label>
                              <textarea
                                value={manualAssignment.notes}
                                onChange={(e) => handleManualAssignmentChange('notes', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                                placeholder="Reason for manual assignment..."
                              />
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">General Triage Notes</label>
                          <textarea
                            value={triageNotes}
                            onChange={(e) => setTriageNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                            placeholder="Add triage notes..."
                          />
                        </div>
                        
                        <button
                          onClick={handleSaveTriage}
                          disabled={triageStatus === 'manual' && !manualAssignment.pathway}
                          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Triage Decision
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriagePatientDetails;