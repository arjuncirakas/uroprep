import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setDb4CurrentPatient, 
  updateDb4Patient, 
  updateFollowUpSchedule,
  updateOutcomes 
} from '../../store/slices/databaseSlice';
import { 
  User, 
  Calendar, 
  Heart, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Activity,
  TrendingUp,
  Stethoscope,
  Shield,
  Zap,
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

const DB4Management = () => {
  const dispatch = useDispatch();
  const { db4 } = useSelector(state => state.databases);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newPSAEntry, setNewPSAEntry] = useState({
    value: '',
    date: '',
    laboratory: '',
  });
  const [newOutcomeEntry, setNewOutcomeEntry] = useState({
    type: 'psa',
    value: '',
    date: '',
    notes: '',
  });

  const followUpSchedule = {
    '3_months': 'First post-operative PSA, continence assessment',
    '6_months': 'PSA, erectile function assessment, patient satisfaction',
    '9_months': 'PSA, functional outcomes review',
    '12_months': 'Annual assessment, consider discharge or continued follow-up',
    'annually': 'If stable, consider GP discharge'
  };

  const outcomeTypes = [
    { id: 'psa', label: 'PSA Result', unit: 'ng/mL' },
    { id: 'continence', label: 'Continence Assessment', unit: 'pads/day' },
    { id: 'erectile', label: 'Erectile Function', unit: 'score' },
    { id: 'quality', label: 'Quality of Life', unit: 'score' },
    { id: 'complications', label: 'Complications', unit: 'type' }
  ];

  // Enhanced dummy data
  const enhancedPatients = [
    {
      id: 'DB4-001',
      firstName: 'John',
      lastName: 'Smith',
      age: 65,
      surgeryDate: '2023-08-15',
      surgeryType: 'RALP',
      followUpStatus: 'Active',
      lastFollowUp: '2024-01-15',
      nextFollowUp: '2024-04-15',
      phone: '0412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      notes: 'Excellent recovery. Patient very satisfied with outcomes.',
      psaHistory: [
        { id: 1, date: '2023-11-15', value: 0.1, laboratory: 'City Lab' },
        { id: 2, date: '2024-01-15', value: 0.05, laboratory: 'City Lab' }
      ],
      outcomes: [
        { id: 1, type: 'continence', value: '0', date: '2023-11-15', notes: 'Excellent continence recovery' },
        { id: 2, type: 'erectile', value: '6', date: '2023-11-15', notes: 'Good erectile function with medication' },
        { id: 3, type: 'quality', value: '8', date: '2024-01-15', notes: 'High quality of life reported' }
      ],
      complications: [],
      dischargeEligible: false,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'DB4-002',
      firstName: 'Robert',
      lastName: 'Johnson',
      age: 58,
      surgeryDate: '2023-06-20',
      surgeryType: 'RALP',
      followUpStatus: 'Active',
      lastFollowUp: '2024-01-10',
      nextFollowUp: '2024-04-10',
      phone: '0412 345 679',
      email: 'robert.johnson@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      notes: 'Good recovery with minor complications resolved.',
      psaHistory: [
        { id: 1, date: '2023-09-20', value: 0.2, laboratory: 'Metro Lab' },
        { id: 2, date: '2023-12-20', value: 0.15, laboratory: 'Metro Lab' },
        { id: 3, date: '2024-01-10', value: 0.18, laboratory: 'Metro Lab' }
      ],
      outcomes: [
        { id: 1, type: 'continence', value: '1', date: '2023-09-20', notes: 'Mild stress incontinence' },
        { id: 2, type: 'continence', value: '0', date: '2023-12-20', notes: 'Continence fully recovered' },
        { id: 3, type: 'erectile', value: '4', date: '2023-12-20', notes: 'Moderate erectile function' },
        { id: 4, type: 'quality', value: '7', date: '2024-01-10', notes: 'Good quality of life' }
      ],
      complications: [
        { id: 1, type: 'UTI', date: '2023-07-05', resolved: true, notes: 'Post-operative UTI, resolved with antibiotics' }
      ],
      dischargeEligible: false,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'DB4-003',
      firstName: 'Michael',
      lastName: 'Williams',
      age: 72,
      surgeryDate: '2023-03-10',
      surgeryType: 'Open',
      followUpStatus: 'Active',
      lastFollowUp: '2024-01-05',
      nextFollowUp: '2024-04-05',
      phone: '0412 345 680',
      email: 'michael.williams@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      notes: 'Complex case with multiple complications. Now stable and discharge eligible.',
      psaHistory: [
        { id: 1, date: '2023-06-10', value: 0.3, laboratory: 'Regional Lab' },
        { id: 2, date: '2023-09-10', value: 0.25, laboratory: 'Regional Lab' },
        { id: 3, date: '2023-12-10', value: 0.2, laboratory: 'Regional Lab' },
        { id: 4, date: '2024-01-05', value: 0.22, laboratory: 'Regional Lab' }
      ],
      outcomes: [
        { id: 1, type: 'continence', value: '2', date: '2023-06-10', notes: 'Moderate incontinence initially' },
        { id: 2, type: 'continence', value: '1', date: '2023-09-10', notes: 'Improving continence' },
        { id: 3, type: 'continence', value: '0', date: '2023-12-10', notes: 'Continence recovered' },
        { id: 4, type: 'erectile', value: '3', date: '2023-12-10', notes: 'Limited erectile function' },
        { id: 5, type: 'quality', value: '6', date: '2024-01-05', notes: 'Satisfactory quality of life' }
      ],
      complications: [
        { id: 1, type: 'Wound Infection', date: '2023-03-20', resolved: true, notes: 'Superficial wound infection, resolved' },
        { id: 2, type: 'Bleeding', date: '2023-03-12', resolved: true, notes: 'Minor post-operative bleeding' }
      ],
      dischargeEligible: true,
      lastUpdated: '2024-01-05'
    },
    {
      id: 'DB4-004',
      firstName: 'David',
      lastName: 'Brown',
      age: 61,
      surgeryDate: '2023-10-05',
      surgeryType: 'RALP',
      followUpStatus: 'Active',
      lastFollowUp: '2024-01-20',
      nextFollowUp: '2024-04-20',
      phone: '0412 345 681',
      email: 'david.brown@email.com',
      address: '321 Elm Street, Perth WA 6000',
      notes: 'Outstanding recovery. No complications. Excellent functional outcomes.',
      psaHistory: [
        { id: 1, date: '2024-01-20', value: 0.08, laboratory: 'City Lab' }
      ],
      outcomes: [
        { id: 1, type: 'continence', value: '0', date: '2024-01-20', notes: 'Excellent continence from start' },
        { id: 2, type: 'erectile', value: '7', date: '2024-01-20', notes: 'Very good erectile function' },
        { id: 3, type: 'quality', value: '9', date: '2024-01-20', notes: 'Excellent quality of life' }
      ],
      complications: [],
      dischargeEligible: false,
      lastUpdated: '2024-01-20'
    }
  ];

  // Filter patients based on search and filter criteria
  const filteredPatients = enhancedPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'active' && patient.followUpStatus === 'Active') ||
      (selectedFilter === 'discharge_eligible' && patient.dischargeEligible) ||
      (selectedFilter === 'ralp' && patient.surgeryType === 'RALP') ||
      (selectedFilter === 'open' && patient.surgeryType === 'Open');
    
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    total: enhancedPatients.length,
    active: enhancedPatients.filter(p => p.followUpStatus === 'Active').length,
    dischargeEligible: enhancedPatients.filter(p => p.dischargeEligible).length,
    ralp: enhancedPatients.filter(p => p.surgeryType === 'RALP').length
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    dispatch(setDb4CurrentPatient(patient));
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
      lastFollowUp: newPSAEntry.date,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    dispatch(updateDb4Patient(updatedPatient));
    setSelectedPatient(updatedPatient);
    setNewPSAEntry({ value: '', date: '', laboratory: '' });
  };

  const handleOutcomeEntry = () => {
    if (!selectedPatient || !newOutcomeEntry.value || !newOutcomeEntry.date) return;

    const newOutcome = {
      id: Date.now(),
      type: newOutcomeEntry.type,
      value: newOutcomeEntry.value,
      date: newOutcomeEntry.date,
      notes: newOutcomeEntry.notes
    };

    const updatedPatient = {
      ...selectedPatient,
      outcomes: [...selectedPatient.outcomes, newOutcome],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    dispatch(updateDb4Patient(updatedPatient));
    setSelectedPatient(updatedPatient);
    setNewOutcomeEntry({ type: 'psa', value: '', date: '', notes: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Discharged': return 'bg-blue-100 text-blue-800';
      case 'Lost to Follow-up': return 'bg-red-100 text-red-800';
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
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(patient.followUpStatus)}`}>
              {patient.followUpStatus}
            </span>
            {patient.dischargeEligible && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Discharge Eligible
              </span>
            )}
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
                <p className="text-sm font-medium text-green-900">Last PSA</p>
                <p className="text-lg font-bold text-green-600">
                  {patient.psaHistory.length > 0 ? patient.psaHistory[patient.psaHistory.length - 1].value : 'N/A'} ng/mL
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-900">Last Follow-up</p>
                <p className="text-lg font-bold text-purple-600">{patient.lastFollowUp}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-gray-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-900">Next Follow-up</p>
                <p className="text-lg font-bold text-orange-600">{patient.nextFollowUp}</p>
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
              <span className="text-sm font-semibold text-gray-700">Follow-up Schedule</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Last Visit:</span> {patient.lastFollowUp}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Next Visit:</span> {patient.nextFollowUp}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Surgery Type:</span> {patient.surgeryType}</p>
            </div>
          </div>
        </div>

        {/* Clinical Details */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Recent Outcomes:</span>
            <div className="mt-2">
              {patient.outcomes.length > 0 ? (
                <div className="space-y-2">
                  {patient.outcomes.slice(-3).map((outcome) => (
                    <div key={outcome.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{outcomeTypes.find(t => t.id === outcome.type)?.label}</span>
                        <span className="text-sm text-gray-500 ml-2">{outcome.value} {outcomeTypes.find(t => t.id === outcome.type)?.unit}</span>
                      </div>
                      <span className="text-xs text-gray-500">{outcome.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No outcomes recorded</p>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
            <span className="text-sm font-semibold text-gray-700">Complications:</span>
            <div className="mt-2">
              {patient.complications.length > 0 ? (
                <div className="space-y-2">
                  {patient.complications.map((complication) => (
                    <div key={complication.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{complication.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ml-2 ${complication.resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {complication.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{complication.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No complications recorded</p>
              )}
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

  const renderFollowUpSchedule = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Follow-up Schedule</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {Object.entries(followUpSchedule).map(([period, description]) => (
            <div key={period} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 capitalize">{period.replace('_', ' ')}</h4>
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Scheduled</span>
                </div>
              </div>
            </div>
          ))}
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
                  step="0.01"
                  value={newPSAEntry.value}
                  onChange={(e) => setNewPSAEntry(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="0.05"
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
                  placeholder="Laboratory name"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <button
                onClick={handlePSAEntry}
                className="bg-gradient-to-r from-green-800 to-black text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity font-semibold"
              >
                Add PSA Result
              </button>
            </div>
          </div>

          {/* Outcome Entry */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-3">Outcome Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Outcome Type
                </label>
                <select
                  value={newOutcomeEntry.type}
                  onChange={(e) => setNewOutcomeEntry(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                >
                  {outcomeTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  value={newOutcomeEntry.value}
                  onChange={(e) => setNewOutcomeEntry(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="Enter value"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newOutcomeEntry.date}
                  onChange={(e) => setNewOutcomeEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={newOutcomeEntry.notes}
                  onChange={(e) => setNewOutcomeEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="Additional notes"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <button
                onClick={handleOutcomeEntry}
                className="bg-gradient-to-r from-green-800 to-black text-white rounded-xl px-6 py-3 hover:opacity-90 transition-opacity font-semibold"
              >
                Add Outcome Assessment
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patient.psaHistory.map((psa) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        psa.value < 0.1 ? 'bg-green-100 text-green-800' : 
                        psa.value < 0.5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {psa.value < 0.1 ? 'Excellent' : psa.value < 0.5 ? 'Good' : 'Monitor'}
                      </span>
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
        <h1 className="text-2xl font-bold text-gray-900">Follow-up Management</h1>
        <p className="text-gray-600 mt-1">Post-operative monitoring and outcome tracking</p>
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
              <p className="text-sm font-medium text-gray-600">Active Follow-up</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-blue-600">+1</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Discharge Eligible</p>
              <p className="text-3xl font-bold text-gray-900">{stats.dischargeEligible}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-purple-600">+1</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700">
              <CheckCircle className="h-6 w-6 text-white" />
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
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700">
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
              <h2 className="text-xl font-semibold text-gray-900">Follow-up Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Monitor and manage post-operative patients and outcome tracking</p>
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
                <option value="active">Active Follow-up</option>
                <option value="discharge_eligible">Discharge Eligible</option>
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA & Outcomes</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Follow-up</th>
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
                          {patient.dischargeEligible && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
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
                        <p className="text-sm text-gray-500">Last: {patient.lastFollowUp}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">
                          PSA: {patient.psaHistory.length > 0 ? patient.psaHistory[patient.psaHistory.length - 1].value : 'N/A'} ng/mL
                        </p>
                        <p className="text-sm text-gray-500">
                          Outcomes: {patient.outcomes.length} recorded
                        </p>
                        <p className="text-sm text-gray-500">
                          Complications: {patient.complications.length}
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.followUpStatus)}`}>
                        {patient.followUpStatus}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900 font-medium">Next: {patient.nextFollowUp}</p>
                        {patient.dischargeEligible && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Discharge Eligible
                          </span>
                        )}
                      </div>
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
                {searchTerm ? `No patients match your search criteria.` : `No patients in follow-up.`}
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
              
              {/* Follow-up Schedule */}
              {renderFollowUpSchedule()}
              
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
                      // Handle schedule follow-up
                      console.log('Schedule follow-up for:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
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
                      // Handle discharge patient
                      console.log('Discharge patient:', selectedPatient.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Discharge Patient
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

export default DB4Management;