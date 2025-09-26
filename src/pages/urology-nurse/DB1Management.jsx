import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  Calendar, 
  FileText, 
  Stethoscope, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  ArrowRight,
  Database,
  Search,
  Filter,
  Eye,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Heart,
  TrendingUp,
  Shield,
  Zap,
  Bell
} from 'lucide-react';

const DB1Management = () => {
  const dispatch = useDispatch();
  const { db1 } = useSelector(state => state.databases);
  const { patients } = useSelector(state => state.patients);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [clinicalDecision, setClinicalDecisionState] = useState({
    outcome: '',
    rationale: '',
    patientCounseling: '',
    supportingEvidence: '',
  });

  // Mock data for DB1 patients
  const mockDb1Patients = [
    {
      id: 'PAT001',
      firstName: 'John',
      lastName: 'Smith',
      age: 65,
      currentPSA: 6.2,
      psaDate: '2024-01-15',
      dreFindings: 'normal',
      clinicalIndication: 'Elevated PSA, family history of prostate cancer',
      currentMedications: 'Metformin, Lisinopril',
      comorbidities: 'Type 2 Diabetes, Hypertension',
      status: 'pending',
      priority: 'medium',
      triageDate: '2024-01-16',
      referringGP: 'Dr. Sarah Johnson',
      phone: '0412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      nextAppointment: '2024-01-20',
      lastVisit: '2024-01-10',
      notes: 'Patient concerned about family history. Requires detailed counseling.'
    },
    {
      id: 'PAT002',
      firstName: 'Michael',
      lastName: 'Brown',
      age: 58,
      currentPSA: 8.5,
      psaDate: '2024-01-14',
      dreFindings: 'abnormal',
      clinicalIndication: 'Abnormal DRE, elevated PSA',
      currentMedications: 'None',
      comorbidities: 'None',
      status: 'in_progress',
      priority: 'high',
      triageDate: '2024-01-15',
      referringGP: 'Dr. Robert Wilson',
      phone: '0412 345 679',
      email: 'michael.brown@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      nextAppointment: '2024-01-18',
      lastVisit: '2024-01-12',
      notes: 'Urgent case - abnormal DRE findings require immediate attention.'
    },
    {
      id: 'PAT003',
      firstName: 'David',
      lastName: 'Wilson',
      age: 71,
      currentPSA: 12.3,
      psaDate: '2024-01-13',
      dreFindings: 'abnormal',
      clinicalIndication: 'High PSA, abnormal DRE, age >70',
      currentMedications: 'Warfarin, Atorvastatin',
      comorbidities: 'Atrial Fibrillation, Hyperlipidemia',
      status: 'pending',
      priority: 'high',
      triageDate: '2024-01-14',
      referringGP: 'Dr. Emily Davis',
      phone: '0412 345 680',
      email: 'david.wilson@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      nextAppointment: '2024-01-22',
      lastVisit: '2024-01-08',
      notes: 'High-risk patient with multiple comorbidities. Requires comprehensive assessment.'
    },
    {
      id: 'PAT004',
      firstName: 'Robert',
      lastName: 'Davis',
      age: 62,
      currentPSA: 4.8,
      psaDate: '2024-01-12',
      dreFindings: 'normal',
      clinicalIndication: 'PSA >4.0 ng/mL, routine screening',
      currentMedications: 'Amlodipine',
      comorbidities: 'Hypertension',
      status: 'completed',
      priority: 'low',
      triageDate: '2024-01-13',
      referringGP: 'Dr. Lisa Anderson',
      phone: '0412 345 681',
      email: 'robert.davis@email.com',
      address: '321 Elm Street, Perth WA 6000',
      nextAppointment: '2024-02-15',
      lastVisit: '2024-01-15',
      notes: 'Routine follow-up. Patient responding well to current treatment plan.'
    }
  ];

  // Use mock data if Redux state is empty
  const db1Patients = db1?.patients?.length > 0 ? db1.patients : mockDb1Patients;

  // Filter patients based on search and filter criteria
  const filteredPatients = db1Patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.referringGP.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    total: db1Patients.length,
    pending: db1Patients.filter(p => p.status === 'pending').length,
    completed: db1Patients.filter(p => p.status === 'completed').length,
    highPriority: db1Patients.filter(p => p.priority === 'high').length
  };

  const clinicalOutcomes = [
    { 
      id: 'no_cancer', 
      label: 'No Cancer - Watchful Waiting', 
      description: 'PSA <4.0 ng/mL, normal DRE, no clinical concern',
      color: 'green',
      nextAction: 'Discharge to GP with PSA monitoring schedule',
      triggers: ['PSA <4.0 ng/mL', 'Normal DRE', 'No clinical concern'],
      autoActions: [
        'Generate GP discharge summary',
        'Create follow-up plan (annual PSA for low risk)',
        'Send automated letter to GP',
        'Patient exits urology database'
      ]
    },
    { 
      id: 'mdt_referral', 
      label: 'Refer to MDT', 
      description: 'Complex cases, borderline findings, patient preference',
      color: 'blue',
      nextAction: 'Create MDT case packet and schedule meeting',
      triggers: ['Complex cases', 'Borderline findings', 'Patient preference'],
      autoActions: [
        'Create MDT case packet with DB1 data',
        'Schedule next available MDT slot',
        'Generate MDT presentation template',
        'Notify MDT coordinator'
      ]
    },
    { 
      id: 'surgery', 
      label: 'Proceed to Surgery', 
      description: 'Clear surgical indication, patient consent obtained',
      color: 'purple',
      nextAction: 'Push to DB3 (Surgical Database)'
    },
    { 
      id: 'surveillance', 
      label: 'Active Surveillance', 
      description: 'Low-risk disease criteria met, patient suitable for monitoring',
      color: 'yellow',
      nextAction: 'Push to DB2 (Surveillance Database)'
    },
    { 
      id: 'external_referral', 
      label: 'External Referral', 
      description: 'Radiotherapy or Medical Oncology referral required',
      color: 'orange',
      nextAction: 'Generate referral letter and discharge from urology'
    }
  ];

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    // Reset clinical decision when selecting new patient
    setClinicalDecisionState({
      outcome: '',
      rationale: '',
      patientCounseling: '',
      supportingEvidence: '',
    });
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  // Clinical validation functions
  const validatePSAThresholds = (psaValue, age) => {
    const alerts = [];
    if (psaValue > 100) {
      alerts.push({ type: 'critical', message: 'PSA >100 ng/mL - URGENT notification required' });
    }
    if (psaValue > 20) {
      alerts.push({ type: 'warning', message: 'PSA >20 ng/mL - Bone scan recommended' });
    }
    if (age > 75) {
      alerts.push({ type: 'info', message: 'Age >75 with comorbidities - Geriatric assessment recommended' });
    }
    return alerts;
  };

  const validateCPCCriteria = (patientData) => {
    const { psa, age, dre, familyHistory, ethnicity } = patientData;
    const criteria = [];
    
    // PSA criteria
    if (age >= 50 && age <= 69 && psa >= 4.0) {
      criteria.push('PSA ≥4.0 ng/mL for men aged 50-69');
    }
    if ((familyHistory || ethnicity === 'Aboriginal/Torres Strait Islander') && psa >= 2.0) {
      criteria.push('PSA ≥2.0 ng/mL for high-risk men');
    }
    
    // Clinical criteria
    if (dre === 'abnormal') {
      criteria.push('Abnormal DRE findings');
    }
    
    return {
      isCompliant: criteria.length > 0,
      criteria,
      requiresOverride: criteria.length === 0
    };
  };

  const handleClinicalDecision = (outcome) => {
    setClinicalDecisionState(prev => ({
      ...prev,
      outcome
    }));
  };

  const handleSubmitDecision = () => {
    if (!clinicalDecision.outcome || !clinicalDecision.rationale) {
      alert('Please provide both outcome and clinical rationale');
      return;
    }

    const decision = {
      ...clinicalDecision,
      patientId: selectedPatient.id,
      timestamp: new Date().toISOString(),
      clinician: 'Current User', // This would come from auth state
    };

    // Simulate successful submission
    console.log('Clinical Decision Submitted:', decision);
    console.log('Next Database:', getNextDatabase(clinicalDecision.outcome));
    
    // Show success message
    alert(`Clinical decision submitted successfully!\n\nPatient: ${selectedPatient.firstName} ${selectedPatient.lastName}\nOutcome: ${clinicalOutcomes.find(o => o.id === clinicalDecision.outcome)?.label}\nNext Action: ${getNextDatabase(clinicalDecision.outcome)}`);

    // Reset form
    setClinicalDecisionState({
      outcome: '',
      rationale: '',
      patientCounseling: '',
      supportingEvidence: '',
    });
    setSelectedPatient(null);
  };

  const getNextDatabase = (outcome) => {
    switch (outcome) {
      case 'surgery': return 'DB3';
      case 'surveillance': return 'DB2';
      case 'mdt_referral': return 'MDT';
      case 'no_cancer': return 'DISCHARGE';
      case 'external_referral': return 'DISCHARGE';
      default: return 'DISCHARGE';
    }
  };

  const getOutcomeColor = (outcome) => {
    const outcomeObj = clinicalOutcomes.find(o => o.id === outcome);
    return outcomeObj ? outcomeObj.color : 'gray';
  };

  const getOutcomeBorderColor = (color) => {
    switch (color) {
      case 'green': return 'border-green-500 bg-gradient-to-r from-green-50 to-gray-50';
      case 'blue': return 'border-blue-500 bg-gradient-to-r from-blue-50 to-gray-50';
      case 'purple': return 'border-purple-500 bg-gradient-to-r from-purple-50 to-gray-50';
      case 'yellow': return 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-gray-50';
      case 'orange': return 'border-orange-500 bg-gradient-to-r from-orange-50 to-gray-50';
      default: return 'border-gray-500 bg-gradient-to-r from-gray-50 to-gray-50';
    }
  };

  const renderPatientSummary = (patient) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-600">UPI: {patient.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Age: {patient.age}</p>
            <p className="text-sm text-gray-600">Status: <span className={`capitalize font-medium ${
              patient.status === 'pending' ? 'text-yellow-600' :
              patient.status === 'in_progress' ? 'text-blue-600' :
              'text-green-600'
            }`}>{patient.status.replace('_', ' ')}</span></p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Clinical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Current PSA</p>
                <p className="text-lg font-bold text-blue-600">{patient.currentPSA} ng/mL</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-700 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">PSA Date</p>
                <p className="text-lg font-bold text-green-600">{patient.psaDate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mr-3">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">DRE</p>
                <p className="text-lg font-bold text-purple-600 capitalize">{patient.dreFindings}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-gray-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg mr-3">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">Priority</p>
                <p className="text-lg font-bold text-orange-600 capitalize">{patient.priority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-semibold text-gray-700">Contact Information</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {patient.phone}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {patient.email}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Address:</span> {patient.address}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-semibold text-gray-700">Appointment Schedule</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Next Appointment:</span> {patient.nextAppointment}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Last Visit:</span> {patient.lastVisit}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Triage Date:</span> {patient.triageDate}</p>
            </div>
          </div>
        </div>

        {/* Clinical Details */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Clinical Indication:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.clinicalIndication}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Referring GP:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.referringGP}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Current Medications:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.currentMedications || 'None documented'}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Comorbidities:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.comorbidities || 'None documented'}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Clinical Notes:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.notes || 'No additional notes'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClinicalDecisionInterface = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Clinical Decision Engine</h3>
            <p className="text-sm text-gray-600 mt-1">Evidence-based clinical decision support</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-4">Select Clinical Outcome:</h4>
          <div className="grid grid-cols-1 gap-4">
            {clinicalOutcomes.map((outcome) => (
              <div
                key={outcome.id}
                className={`group p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  clinicalDecision.outcome === outcome.id
                    ? getOutcomeBorderColor(outcome.color)
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => handleClinicalDecision(outcome.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-gray-900">{outcome.label}</h5>
                    <p className="text-sm text-gray-600 mt-1">{outcome.description}</p>
                  </div>
                  {clinicalDecision.outcome === outcome.id && (
                    <div className="p-2 bg-gradient-to-br from-green-500 to-green-700 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {clinicalDecision.outcome && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
              <h5 className="font-semibold text-blue-900 mb-2">Next Action:</h5>
              <p className="text-sm text-blue-700">
                {clinicalOutcomes.find(o => o.id === clinicalDecision.outcome)?.nextAction}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Clinical Rationale *
              </label>
              <textarea
                value={clinicalDecision.rationale}
                onChange={(e) => setClinicalDecisionState(prev => ({
                  ...prev,
                  rationale: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                rows="3"
                placeholder="Provide clinical reasoning for this decision..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Supporting Evidence
              </label>
              <textarea
                value={clinicalDecision.supportingEvidence}
                onChange={(e) => setClinicalDecisionState(prev => ({
                  ...prev,
                  supportingEvidence: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                rows="2"
                placeholder="Laboratory results, imaging findings, pathology reports..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Counseling Notes
              </label>
              <textarea
                value={clinicalDecision.patientCounseling}
                onChange={(e) => setClinicalDecisionState(prev => ({
                  ...prev,
                  patientCounseling: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                rows="2"
                placeholder="Document patient counseling and informed consent..."
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmitDecision}
                className="bg-gradient-to-r from-green-800 to-black text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity font-semibold"
              >
                Submit Clinical Decision
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OPD Management</h1>
            <p className="text-sm text-gray-600 mt-1">Initial Assessment & Clinical Decision Point</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">+2</span>
                <span className="text-sm text-gray-500 ml-1">from yesterday</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Database className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-yellow-600">+1</span>
                <span className="text-sm text-gray-500 ml-1">from yesterday</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">+3</span>
                <span className="text-sm text-gray-500 ml-1">from yesterday</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-3xl font-bold text-gray-900">{stats.highPriority}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-red-600">+1</span>
                <span className="text-sm text-gray-500 ml-1">from yesterday</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-700">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Patient List */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Patient Queue</h3>
                  <p className="text-sm text-gray-600 mt-1">Patients awaiting initial assessment</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No patients found</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-sm text-green-600 hover:text-green-800"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA & DRE</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Clinical Details</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPatients.map((patient, index) => (
                      <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="py-5 px-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white font-semibold text-sm">
                                  {patient.firstName[0]}{patient.lastName[0]}
                                </span>
                              </div>
                              {patient.priority === 'high' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{patient.firstName} {patient.lastName}</p>
                              <p className="text-sm text-gray-500">UPI: {patient.id}</p>
                              <p className="text-sm text-gray-500">Age: {patient.age}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">PSA: {patient.currentPSA} ng/mL</p>
                            <p className="text-sm text-gray-500">Date: {patient.psaDate}</p>
                            <p className="text-sm text-gray-500">DRE: <span className="capitalize">{patient.dreFindings}</span></p>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900 font-medium">GP: {patient.referringGP}</p>
                            <p className="text-sm text-gray-500">Triage: {patient.triageDate}</p>
                            <p className="text-sm text-gray-500">Phone: {patient.phone}</p>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            patient.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            patient.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {patient.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            patient.priority === 'high' ? 'bg-red-100 text-red-800' :
                            patient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {patient.priority}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handlePatientSelect(patient)}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              <span>View Details</span>
                            </button>
                            <button 
                              onClick={() => {
                                // Handle edit functionality
                                console.log('Edit patient:', patient.id);
                              }}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">UPI: {selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  onClick={closePatientModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Patient Summary */}
              {renderPatientSummary(selectedPatient)}
              
              {/* Clinical Decision Interface */}
              {renderClinicalDecisionInterface()}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      // Handle schedule appointment
                      console.log('Schedule appointment for:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </button>
                  <button
                    onClick={() => {
                      // Handle send reminder
                      console.log('Send reminder to:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Reminder
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closePatientModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      // Handle start assessment
                      console.log('Starting assessment for:', selectedPatient.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DB1Management;
