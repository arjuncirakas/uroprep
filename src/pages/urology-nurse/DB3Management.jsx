import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setDb3CurrentPatient, 
  updateDb3Patient, 
  updatePreOpChecklist,
  updateSurgicalPlan 
} from '../../store/slices/databaseSlice';
import { 
  User, 
  Calendar, 
  Stethoscope, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Activity,
  Heart,
  Shield,
  Zap,
  TrendingUp,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
  Filter,
  Bell
} from 'lucide-react';

const DB3Management = () => {
  const dispatch = useDispatch();
  const { db3 } = useSelector(state => state.databases);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [checklistItem, setChecklistItem] = useState('');

  const preOpChecklist = [
    { id: 'anesthetic', label: 'Anesthetic consultation completed', required: true },
    { id: 'cardiology', label: 'Cardiology clearance (if indicated)', required: false },
    { id: 'blood_group', label: 'Blood group and cross-match', required: true },
    { id: 'urinalysis', label: 'Urinalysis and culture', required: true },
    { id: 'bowel_prep', label: 'Bowel preparation instructions given', required: true },
    { id: 'consent', label: 'Informed consent signed and witnessed', required: true },
    { id: 'anticoagulation', label: 'Anti-coagulation management plan', required: true },
    { id: 'post_op_plan', label: 'Post-operative care plan discussed', required: true },
  ];

  const surgicalApproaches = [
    { id: 'ralp', label: 'Robot-assisted Laparoscopic Prostatectomy (RALP)', description: 'Minimally invasive robotic surgery' },
    { id: 'open', label: 'Open Radical Prostatectomy', description: 'Traditional open surgical approach' },
  ];

  // Enhanced dummy data
  const enhancedPatients = [
    {
      id: 'DB3-001',
      firstName: 'James',
      lastName: 'Anderson',
      age: 62,
      surgeryDate: '2024-02-15',
      surgeryType: 'RALP',
      priority: 'High',
      status: 'Pre-operative',
      gleasonScore: '4+3',
      psa: 8.5,
      stage: 'T2c',
      phone: '0412 345 678',
      email: 'james.anderson@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      nextAppointment: '2024-02-10',
      lastVisit: '2024-01-20',
      notes: 'High-risk patient with diabetes. Requires careful monitoring.',
      comorbidities: ['Hypertension', 'Type 2 Diabetes'],
      preOpChecklist: {
        anesthetic: true,
        cardiology: true,
        blood_group: true,
        urinalysis: true,
        bowel_prep: false,
        consent: true,
        anticoagulation: true,
        post_op_plan: false
      },
      surgicalPlan: {
        approach: 'ralp',
        estimatedDuration: '4-6 hours',
        anesthesia: 'General',
        specialConsiderations: 'Diabetic management required'
      },
      lastUpdated: '2024-01-20'
    },
    {
      id: 'DB3-002',
      firstName: 'Robert',
      lastName: 'Thompson',
      age: 58,
      surgeryDate: '2024-02-20',
      surgeryType: 'RALP',
      priority: 'Medium',
      status: 'Pre-operative',
      gleasonScore: '3+4',
      psa: 6.2,
      stage: 'T2a',
      phone: '0412 345 679',
      email: 'robert.thompson@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      nextAppointment: '2024-02-15',
      lastVisit: '2024-01-18',
      notes: 'Standard protocol patient. Good surgical candidate.',
      comorbidities: ['Hyperlipidemia'],
      preOpChecklist: {
        anesthetic: true,
        cardiology: false,
        blood_group: true,
        urinalysis: true,
        bowel_prep: true,
        consent: true,
        anticoagulation: true,
        post_op_plan: true
      },
      surgicalPlan: {
        approach: 'ralp',
        estimatedDuration: '3-4 hours',
        anesthesia: 'General',
        specialConsiderations: 'Standard protocol'
      },
      lastUpdated: '2024-01-18'
    },
    {
      id: 'DB3-003',
      firstName: 'William',
      lastName: 'Davis',
      age: 71,
      surgeryDate: '2024-02-25',
      surgeryType: 'Open',
      priority: 'High',
      status: 'Pre-operative',
      gleasonScore: '4+4',
      psa: 12.8,
      stage: 'T3a',
      phone: '0412 345 680',
      email: 'william.davis@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      nextAppointment: '2024-02-20',
      lastVisit: '2024-01-15',
      notes: 'Complex case with multiple comorbidities. Requires multidisciplinary approach.',
      comorbidities: ['Coronary Artery Disease', 'COPD'],
      preOpChecklist: {
        anesthetic: true,
        cardiology: true,
        blood_group: true,
        urinalysis: false,
        bowel_prep: false,
        consent: false,
        anticoagulation: false,
        post_op_plan: false
      },
      surgicalPlan: {
        approach: 'open',
        estimatedDuration: '5-7 hours',
        anesthesia: 'General',
        specialConsiderations: 'Cardiac monitoring, respiratory support'
      },
      lastUpdated: '2024-01-15'
    },
    {
      id: 'DB3-004',
      firstName: 'Michael',
      lastName: 'Wilson',
      age: 55,
      surgeryDate: '2024-03-01',
      surgeryType: 'RALP',
      priority: 'Low',
      status: 'Pre-operative',
      gleasonScore: '3+3',
      psa: 4.8,
      stage: 'T1c',
      phone: '0412 345 681',
      email: 'michael.wilson@email.com',
      address: '321 Elm Street, Perth WA 6000',
      nextAppointment: '2024-02-25',
      lastVisit: '2024-01-22',
      notes: 'Low-risk patient. Excellent surgical candidate.',
      comorbidities: [],
      preOpChecklist: {
        anesthetic: true,
        cardiology: false,
        blood_group: true,
        urinalysis: true,
        bowel_prep: true,
        consent: true,
        anticoagulation: true,
        post_op_plan: true
      },
      surgicalPlan: {
        approach: 'ralp',
        estimatedDuration: '3-4 hours',
        anesthesia: 'General',
        specialConsiderations: 'Low risk patient'
      },
      lastUpdated: '2024-01-22'
    }
  ];

  // Filter patients based on search and filter criteria
  const filteredPatients = enhancedPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high_priority' && patient.priority === 'High') ||
      (selectedFilter === 'pre_op' && patient.status === 'Pre-operative') ||
      (selectedFilter === 'ralp' && patient.surgeryType === 'RALP') ||
      (selectedFilter === 'open' && patient.surgeryType === 'Open');
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    total: enhancedPatients.length,
    preOp: enhancedPatients.filter(p => p.status === 'Pre-operative').length,
    highPriority: enhancedPatients.filter(p => p.priority === 'High').length,
    ralp: enhancedPatients.filter(p => p.surgeryType === 'RALP').length
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    dispatch(setDb3CurrentPatient(patient));
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const handleChecklistUpdate = (itemId, completed) => {
    if (!selectedPatient) return;

    const updatedPatient = {
      ...selectedPatient,
      preOpChecklist: {
        ...selectedPatient.preOpChecklist,
        [itemId]: completed
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    dispatch(updateDb3Patient(updatedPatient));
    setSelectedPatient(updatedPatient);
  };

  const handleSurgicalPlanUpdate = (plan) => {
    if (!selectedPatient) return;

    const updatedPatient = {
      ...selectedPatient,
      surgicalPlan: plan,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    dispatch(updateDb3Patient(updatedPatient));
    setSelectedPatient(updatedPatient);
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
      case 'Pre-operative': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-purple-100 text-purple-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(patient.priority)}`}>
              {patient.priority} Priority
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.status)}`}>
              {patient.status}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Clinical Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Surgery Date</p>
                <p className="text-lg font-bold text-blue-600">{patient.surgeryDate}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-700 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">PSA Level</p>
                <p className="text-lg font-bold text-green-600">{patient.psa} ng/mL</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Gleason Score</p>
                <p className="text-lg font-bold text-purple-600">{patient.gleasonScore}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-gray-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">Stage</p>
                <p className="text-lg font-bold text-orange-600">{patient.stage}</p>
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
              <span className="text-sm font-semibold text-gray-700">Surgery Schedule</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Next Appointment:</span> {patient.nextAppointment}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Last Visit:</span> {patient.lastVisit}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Surgery Type:</span> {patient.surgeryType}</p>
            </div>
          </div>
        </div>

        {/* Clinical Details */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Comorbidities:</span>
            <div className="mt-2">
              {patient.comorbidities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.comorbidities.map((comorbidity, index) => (
                    <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {comorbidity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No significant comorbidities</p>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Surgical Plan:</span>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600"><span className="font-medium">Approach:</span> {patient.surgicalPlan.approach.toUpperCase()}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Duration:</span> {patient.surgicalPlan.estimatedDuration}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Anesthesia:</span> {patient.surgicalPlan.anesthesia}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Clinical Notes:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.notes || 'No additional notes'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreOpChecklist = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Pre-operative Checklist</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preOpChecklist.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
              <div className="flex items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedPatient?.preOpChecklist?.[item.id] || false}
                    onChange={(e) => handleChecklistUpdate(item.id, e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className={`ml-3 text-sm font-medium ${selectedPatient?.preOpChecklist?.[item.id] ? 'text-green-800' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </div>
                {item.required && (
                  <span className="ml-2 text-xs text-red-600 font-semibold">*</span>
                )}
              </div>
              {selectedPatient?.preOpChecklist?.[item.id] && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-semibold text-blue-900">
              Checklist Progress: {Object.values(selectedPatient?.preOpChecklist || {}).filter(Boolean).length} / {preOpChecklist.length} completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSurgicalPlan = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Surgical Plan</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Surgical Approach</label>
            <div className="space-y-2">
              {surgicalApproaches.map((approach) => (
                <div key={approach.id} className="flex items-center">
                  <input
                    type="radio"
                    id={approach.id}
                    name="surgicalApproach"
                    value={approach.id}
                    checked={selectedPatient?.surgicalPlan?.approach === approach.id}
                    onChange={(e) => handleSurgicalPlanUpdate({
                      ...selectedPatient.surgicalPlan,
                      approach: e.target.value
                    })}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <label htmlFor={approach.id} className="ml-3 text-sm font-medium text-gray-700">
                    {approach.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Duration</label>
              <input
                type="text"
                value={selectedPatient?.surgicalPlan?.estimatedDuration || ''}
                onChange={(e) => handleSurgicalPlanUpdate({
                  ...selectedPatient.surgicalPlan,
                  estimatedDuration: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                placeholder="e.g., 4-6 hours"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Anesthesia Type</label>
              <select
                value={selectedPatient?.surgicalPlan?.anesthesia || ''}
                onChange={(e) => handleSurgicalPlanUpdate({
                  ...selectedPatient.surgicalPlan,
                  anesthesia: e.target.value
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="">Select anesthesia</option>
                <option value="General">General</option>
                <option value="Regional">Regional</option>
                <option value="Local">Local</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Special Considerations</label>
            <textarea
              value={selectedPatient?.surgicalPlan?.specialConsiderations || ''}
              onChange={(e) => handleSurgicalPlanUpdate({
                ...selectedPatient.surgicalPlan,
                specialConsiderations: e.target.value
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              rows="3"
              placeholder="Any special considerations for this patient..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Surgery Management</h1>
        <p className="text-gray-600 mt-1">Pre-operative planning and surgical coordination</p>
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
                <span className="text-sm text-gray-500 ml-1">from last month</span>
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
              <p className="text-sm font-medium text-gray-600">Pre-operative</p>
              <p className="text-3xl font-bold text-gray-900">{stats.preOp}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-blue-600">+1</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
              <Calendar className="h-6 w-6 text-white" />
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
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-700">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">RALP Procedures</p>
              <p className="text-3xl font-bold text-gray-900">{stats.ralp}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">+2</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Patient Management Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Surgical Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor and manage surgical patients and pre-operative planning</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div className="flex items-center space-x-3">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Patients</option>
                <option value="pre_op">Pre-operative</option>
                <option value="high_priority">High Priority</option>
                <option value="ralp">RALP</option>
                <option value="open">Open Surgery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Clinical Info</th>
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
                          {patient.priority === 'High' && (
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
                        <p className="font-medium text-gray-900">Date: {patient.surgeryDate}</p>
                        <p className="text-sm text-gray-500">Type: {patient.surgeryType}</p>
                        <p className="text-sm text-gray-500">Next: {patient.nextAppointment}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">PSA: {patient.psa} ng/mL</p>
                        <p className="text-sm text-gray-500">Gleason: {patient.gleasonScore}</p>
                        <p className="text-sm text-gray-500">Stage: {patient.stage}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
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
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Database className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? `No patients match your search criteria.` : `No patients scheduled for surgery.`}
              </p>
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
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              
              {/* Pre-op Checklist */}
              {renderPreOpChecklist()}
              
              {/* Surgical Plan */}
              {renderSurgicalPlan()}
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
                      // Handle update surgical plan
                      console.log('Update surgical plan for:', selectedPatient.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Update Plan
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

export default DB3Management;