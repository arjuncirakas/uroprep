import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setDb2CurrentPatient, 
  updateDb2Patient, 
  addProgressionAlert,
  updateSurveillanceProtocol 
} from '../../store/slices/databaseSlice';
import { 
  User, 
  Calendar, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Database,
  BarChart3,
  Bell,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  Zap,
  X,
  Search,
  Filter
} from 'lucide-react';

const DB2Management = () => {
  const dispatch = useDispatch();
  const { db2 } = useSelector(state => state.databases);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newPSAEntry, setNewPSAEntry] = useState({
    value: '',
    date: '',
    laboratory: '',
  });
  const [newDREEntry, setNewDREEntry] = useState({
    findings: 'normal',
    details: '',
    date: '',
  });

  const surveillanceProtocol = {
    psaSchedule: '3-monthly for first 2 years, then 6-monthly',
    clinicalExamination: '6-monthly DRE',
    mriSchedule: 'Annual multiparametric MRI',
    biopsySchedule: '12-monthly if high-risk features',
  };

  const progressionCriteria = {
    psaVelocity: 0.75, // ng/mL/year
    psaDoublingTime: 3, // years
    mriProgression: 'PIRADS score increase or new lesions',
    clinicalProgression: 'Palpable changes on DRE',
  };

  // Enhanced dummy data
  const enhancedPatients = [
    {
      id: 'DB2-001',
      firstName: 'Robert',
      lastName: 'Johnson',
      age: 65,
      lastPSA: 4.2,
      lastPSADate: '2024-01-15',
      psaVelocity: 0.3,
      daysSinceLastPSA: 45,
      surveillanceStartDate: '2023-06-01',
      gleasonScore: '3+3',
      phone: '0412 345 678',
      email: 'robert.johnson@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      nextAppointment: '2024-04-15',
      lastVisit: '2024-01-15',
      notes: 'Stable surveillance patient. No concerning features.',
      status: 'active',
      priority: 'low',
      psaHistory: [
        { id: 1, date: '2023-06-01', value: 3.8, laboratory: 'City Lab', velocity: null },
        { id: 2, date: '2023-09-01', value: 4.0, laboratory: 'City Lab', velocity: 0.8 },
        { id: 3, date: '2023-12-01', value: 3.9, laboratory: 'City Lab', velocity: -0.3 },
        { id: 4, date: '2024-01-15', value: 4.2, laboratory: 'City Lab', velocity: 1.2 }
      ],
      dreHistory: [
        { id: 1, date: '2023-06-01', findings: 'normal', details: 'No palpable abnormalities' },
        { id: 2, date: '2023-12-01', findings: 'normal', details: 'Stable examination' }
      ],
      nextReviewDate: '2024-04-15',
      progressionAlerts: []
    },
    {
      id: 'DB2-002',
      firstName: 'Michael',
      lastName: 'Chen',
      age: 58,
      lastPSA: 5.8,
      lastPSADate: '2024-01-10',
      psaVelocity: 0.8,
      daysSinceLastPSA: 50,
      surveillanceStartDate: '2023-03-15',
      gleasonScore: '3+4',
      phone: '0412 345 679',
      email: 'michael.chen@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      nextAppointment: '2024-03-10',
      lastVisit: '2024-01-10',
      notes: 'High-risk surveillance. Requires close monitoring.',
      status: 'active',
      priority: 'high',
      psaHistory: [
        { id: 1, date: '2023-03-15', value: 4.5, laboratory: 'Metro Lab', velocity: null },
        { id: 2, date: '2023-06-15', value: 5.0, laboratory: 'Metro Lab', velocity: 2.0 },
        { id: 3, date: '2023-09-15', value: 5.2, laboratory: 'Metro Lab', velocity: 0.8 },
        { id: 4, date: '2024-01-10', value: 5.8, laboratory: 'Metro Lab', velocity: 2.4 }
      ],
      dreHistory: [
        { id: 1, date: '2023-03-15', findings: 'normal', details: 'No abnormalities detected' },
        { id: 2, date: '2023-09-15', findings: 'abnormal', details: 'Slight asymmetry noted' }
      ],
      nextReviewDate: '2024-03-10',
      progressionAlerts: [
        { id: 1, type: 'PSA_VELOCITY', message: 'PSA velocity > 0.75 ng/mL/year', severity: 'high', date: '2024-01-10' }
      ]
    },
    {
      id: 'DB2-003',
      firstName: 'David',
      lastName: 'Williams',
      age: 72,
      lastPSA: 3.1,
      lastPSADate: '2024-01-20',
      psaVelocity: 0.2,
      daysSinceLastPSA: 40,
      surveillanceStartDate: '2022-08-01',
      gleasonScore: '3+3',
      phone: '0412 345 680',
      email: 'david.williams@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      nextAppointment: '2024-04-20',
      lastVisit: '2024-01-20',
      notes: 'Long-term surveillance patient. Excellent compliance.',
      status: 'active',
      priority: 'low',
      psaHistory: [
        { id: 1, date: '2022-08-01', value: 2.8, laboratory: 'Regional Lab', velocity: null },
        { id: 2, date: '2022-11-01', value: 2.9, laboratory: 'Regional Lab', velocity: 0.4 },
        { id: 3, date: '2023-02-01', value: 3.0, laboratory: 'Regional Lab', velocity: 0.4 },
        { id: 4, date: '2023-05-01', value: 2.9, laboratory: 'Regional Lab', velocity: -0.4 },
        { id: 5, date: '2023-08-01', value: 3.0, laboratory: 'Regional Lab', velocity: 0.4 },
        { id: 6, date: '2023-11-01', value: 3.1, laboratory: 'Regional Lab', velocity: 0.4 },
        { id: 7, date: '2024-01-20', value: 3.1, laboratory: 'Regional Lab', velocity: 0.0 }
      ],
      dreHistory: [
        { id: 1, date: '2022-08-01', findings: 'normal', details: 'No palpable abnormalities' },
        { id: 2, date: '2023-02-01', findings: 'normal', details: 'Stable examination' },
        { id: 3, date: '2023-08-01', findings: 'normal', details: 'No changes detected' },
        { id: 4, date: '2024-01-20', findings: 'normal', details: 'Consistent with previous exams' }
      ],
      nextReviewDate: '2024-04-20',
      progressionAlerts: []
    }
  ];

  // Filter patients based on search and filter criteria
  const filteredPatients = enhancedPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'high_priority' && patient.priority === 'high') ||
      (selectedFilter === 'alerts' && patient.progressionAlerts && patient.progressionAlerts.length > 0) ||
      (selectedFilter === 'active' && patient.status === 'active');
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    total: enhancedPatients.length,
    active: enhancedPatients.filter(p => p.status === 'active').length,
    highPriority: enhancedPatients.filter(p => p.priority === 'high').length,
    alerts: enhancedPatients.filter(p => p.progressionAlerts && p.progressionAlerts.length > 0).length
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    dispatch(setDb2CurrentPatient(patient));
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const handlePSAEntry = () => {
    if (!selectedPatient || !newPSAEntry.value || !newPSAEntry.date) return;

    const newPSA = {
      id: Date.now(),
      date: newPSAEntry.date,
      value: parseFloat(newPSAEntry.value),
      laboratory: newPSAEntry.laboratory || 'Unknown Lab'
    };

    const updatedPatient = {
      ...selectedPatient,
      psaHistory: [...selectedPatient.psaHistory, newPSA],
      lastPSA: newPSA.value,
      lastPSADate: newPSA.date
    };

    // Calculate PSA velocity if we have at least 2 values
    if (updatedPatient.psaHistory.length >= 2) {
      const sortedPSA = updatedPatient.psaHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
      const latest = sortedPSA[sortedPSA.length - 1];
      const previous = sortedPSA[sortedPSA.length - 2];
      
      const timeDiff = (new Date(latest.date) - new Date(previous.date)) / (365.25 * 24 * 60 * 60 * 1000);
      const psaDiff = latest.value - previous.value;
      const velocity = psaDiff / timeDiff;
      
      updatedPatient.psaVelocity = velocity;
      
      // Check for progression alerts
      if (velocity > progressionCriteria.psaVelocity) {
        const alert = {
          id: Date.now(),
          type: 'PSA_VELOCITY',
          message: `PSA velocity ${velocity.toFixed(2)} ng/mL/year exceeds threshold`,
          severity: 'high',
          date: new Date().toISOString().split('T')[0]
        };
        updatedPatient.progressionAlerts = [...(updatedPatient.progressionAlerts || []), alert];
        dispatch(addProgressionAlert({ patientId: selectedPatient.id, alert }));
      }
    }

    dispatch(updateDb2Patient(updatedPatient));
    setSelectedPatient(updatedPatient);
    setNewPSAEntry({ value: '', date: '', laboratory: '' });
  };

  const handleDREEntry = () => {
    if (!selectedPatient || !newDREEntry.date) return;

    const newDRE = {
      id: Date.now(),
      date: newDREEntry.date,
      findings: newDREEntry.findings,
      details: newDREEntry.details
    };

    const updatedPatient = {
      ...selectedPatient,
      dreHistory: [...(selectedPatient.dreHistory || []), newDRE]
    };

    dispatch(updateDb2Patient(updatedPatient));
    setSelectedPatient(updatedPatient);
    setNewDREEntry({ findings: 'normal', details: '', date: '' });
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
              patient.status === 'active' ? 'text-green-600' : 'text-gray-600'
            }`}>{patient.status}</span></p>
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
                <p className="text-sm font-medium text-blue-900">Last PSA</p>
                <p className="text-lg font-bold text-blue-600">{patient.lastPSA || 'N/A'} ng/mL</p>
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
                <p className="text-lg font-bold text-green-600">{patient.lastPSADate || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">PSA Velocity</p>
                <p className="text-lg font-bold text-purple-600">
                  {patient.psaVelocity ? `${patient.psaVelocity.toFixed(2)}/year` : 'N/A'}
                </p>
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
              <span className="text-sm font-semibold text-gray-700">Surveillance Schedule</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Next Appointment:</span> {patient.nextAppointment}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Last Visit:</span> {patient.lastVisit}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Surveillance Start:</span> {patient.surveillanceStartDate}</p>
            </div>
          </div>
        </div>

        {/* Clinical Details */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Gleason Score:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.gleasonScore}</p>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Clinical Notes:</span>
            <p className="text-sm text-gray-600 mt-1">{patient.notes || 'No additional notes'}</p>
          </div>
          {patient.progressionAlerts && patient.progressionAlerts.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4">
              <span className="text-sm font-semibold text-red-700">Progression Alerts:</span>
              <div className="mt-2 space-y-1">
                {patient.progressionAlerts.map((alert, index) => (
                  <p key={index} className="text-sm text-red-600">• {alert.message}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSurveillanceProtocol = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Surveillance Protocol</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-3">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">PSA Schedule</p>
                  <p className="text-sm text-gray-600">{surveillanceProtocol.psaSchedule}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Clinical Examination</p>
                  <p className="text-sm text-gray-600">{surveillanceProtocol.clinicalExamination}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">MRI Schedule</p>
                  <p className="text-sm text-gray-600">{surveillanceProtocol.mriSchedule}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mr-3">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Biopsy Schedule</p>
                  <p className="text-sm text-gray-600">{surveillanceProtocol.biopsySchedule}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataEntry = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Entry</h3>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {/* PSA Entry */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">PSA Results Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  PSA Value (ng/mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newPSAEntry.value}
                  onChange={(e) => setNewPSAEntry(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="4.2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newPSAEntry.date}
                  onChange={(e) => setNewPSAEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Laboratory
                </label>
                <input
                  type="text"
                  value={newPSAEntry.laboratory}
                  onChange={(e) => setNewPSAEntry(prev => ({ ...prev, laboratory: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="Pathology Lab"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <button
                onClick={handlePSAEntry}
                className="bg-gradient-to-r from-green-800 to-black text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity font-semibold"
              >
                Add PSA Entry
              </button>
            </div>
          </div>

          {/* DRE Entry */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">DRE Findings Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  DRE Findings
                </label>
                <select
                  value={newDREEntry.findings}
                  onChange={(e) => setNewDREEntry(prev => ({ ...prev, findings: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="not_performed">Not Performed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newDREEntry.date}
                  onChange={(e) => setNewDREEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Details
                </label>
                <input
                  type="text"
                  value={newDREEntry.details}
                  onChange={(e) => setNewDREEntry(prev => ({ ...prev, details: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="Describe findings..."
                />
              </div>
            </div>
            
            <div className="mt-3">
              <button
                onClick={handleDREEntry}
                className="bg-gradient-to-r from-green-800 to-black text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity font-semibold"
              >
                Add DRE Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPSAHistory = (patient) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">PSA History</h3>
      </div>
      <div className="p-6">
        {patient.psaHistory && patient.psaHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    PSA Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Laboratory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Velocity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.psaHistory.map((psa, index) => (
                  <tr key={psa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(psa.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {psa.value} ng/mL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {psa.laboratory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {index > 0 ? 'Calculated' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No PSA history available</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Surveillance Management</h1>
        <p className="text-gray-600 mt-1">Long-term monitoring and progression detection</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">+1</span>
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
              <p className="text-sm font-medium text-gray-600">Active Surveillance</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-green-600">+2</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
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
              <p className="text-sm font-medium text-gray-600">Progression Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.alerts}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-yellow-600">+1</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700">
              <Bell className="h-6 w-6 text-white" />
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
              <h2 className="text-xl font-semibold text-gray-900">Surveillance Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor and manage active surveillance patients</p>
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
                <option value="active">Active</option>
                <option value="high_priority">High Priority</option>
                <option value="alerts">With Alerts</option>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA & Velocity</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surveillance Details</th>
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
                          {patient.progressionAlerts && patient.progressionAlerts.length > 0 && (
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white"></div>
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
                        <p className="font-medium text-gray-900">PSA: {patient.lastPSA} ng/mL</p>
                        <p className="text-sm text-gray-500">Date: {patient.lastPSADate}</p>
                        <p className="text-sm text-gray-500">Velocity: {patient.psaVelocity ? `${patient.psaVelocity.toFixed(2)}/year` : 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">Gleason: {patient.gleasonScore}</p>
                        <p className="text-sm text-gray-500">Start: {patient.surveillanceStartDate}</p>
                        <p className="text-sm text-gray-500">Next: {patient.nextReviewDate}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                        patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status}
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
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Database className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? `No patients match your search criteria.` : `No patients in active surveillance.`}
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
              
              {/* Surveillance Protocol */}
              {renderSurveillanceProtocol()}
              
              {/* Data Entry */}
              {renderDataEntry()}
              
              {/* PSA History */}
              {renderPSAHistory(selectedPatient)}
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
                      // Handle update surveillance
                      console.log('Update surveillance for:', selectedPatient.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Update Surveillance
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

export default DB2Management;