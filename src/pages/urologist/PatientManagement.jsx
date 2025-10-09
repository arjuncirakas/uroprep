import React, { useState } from 'react';
import AddPatientModal from '../../components/modals/AddPatientModal';
import ScheduleMDTModal from '../../components/modals/ScheduleMDTModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
import { 
  Search, 
  UserPlus, 
  Eye, 
  X,
  Users,
  Calendar
} from 'lucide-react';

const PatientManagement = () => {
  const { openPatientDetails } = usePatientDetails();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [activeTab, setActiveTab] = useState('New Patients');
  const [sortBy, setSortBy] = useState('name');
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Schedule MDT Modal state
  const [showScheduleMDTModal, setShowScheduleMDTModal] = useState(false);
  const [selectedPatientForMDT, setSelectedPatientForMDT] = useState(null);

  // Mock patient data combining all databases
  const allPatients = [
    // DB1 - OPD Queue
    {
      id: 'URP2024001',
      name: 'John Smith',
      age: 65,
      dob: '1959-03-15',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      psa: 25.4,
      status: 'OPD Queue',
      database: 'DB1',
      patientType: 'OPD',
      referralDate: '2024-01-10',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'Elevated PSA with family history',
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-01-22',
      priority: 'High',
      assignedDoctor: 'Dr. Michael Chen'
    },
    {
      id: 'URP002',
      name: 'Mary Johnson',
      age: 58,
      dob: '1966-07-22',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      psa: 18.7,
      status: 'OPD Queue',
      database: 'DB1',
      patientType: 'OPD',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Rapidly rising PSA',
      lastAppointment: '2024-01-16',
      nextAppointment: '2024-01-23',
      priority: 'High',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    // DB2 - Active Surveillance
    {
      id: 'URP003',
      name: 'Robert Brown',
      age: 72,
      dob: '1952-11-08',
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      psa: 4.2,
      status: 'Active Surveillance',
      database: 'DB2',
      patientType: 'OPD',
      referralDate: '2023-06-15',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Low-risk prostate cancer on surveillance',
      lastAppointment: '2023-12-15',
      nextAppointment: '2024-06-15',
      priority: 'Normal',
      gleasonScore: '3+3=6',
      stage: 'T1c',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP2024004',
      name: 'David Wilson',
      age: 68,
      dob: '1956-05-12',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      psa: 3.8,
      status: 'Active Surveillance',
      database: 'DB2',
      patientType: 'OPD',
      referralDate: '2023-08-20',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'Stable PSA on surveillance',
      lastAppointment: '2023-11-20',
      nextAppointment: '2024-05-20',
      priority: 'Normal',
      gleasonScore: '3+3=6',
      stage: 'T1c',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // DB3 - Surgical Pathway
    {
      id: 'URP005',
      name: 'Sarah Davis',
      age: 71,
      dob: '1953-09-30',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      psa: 15.2,
      status: 'Surgery Scheduled',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2023-10-15',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'High-risk prostate cancer',
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-02-15',
      priority: 'High',
      gleasonScore: '4+3=7',
      stage: 'T2b',
      surgeryDate: '2024-02-15',
      surgeryType: 'RALP',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP006',
      name: 'Michael Thompson',
      age: 69,
      dob: '1955-12-03',
      phone: '+61 467 890 123',
      email: 'michael.thompson@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      psa: 12.8,
      status: 'Surgery Scheduled',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2023-11-20',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'Intermediate-risk prostate cancer',
      lastAppointment: '2024-01-12',
      nextAppointment: '2024-02-20',
      priority: 'High',
      gleasonScore: '3+4=7',
      stage: 'T2a',
      surgeryDate: '2024-02-20',
      surgeryType: 'RALP',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // DB4 - Post-Op Follow-Up
    {
      id: 'URP007',
      name: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 0.8,
      status: 'Post-Op Follow-Up',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-05-10',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Post-operative surveillance',
      lastAppointment: '2024-01-08',
      nextAppointment: '2024-04-08',
      priority: 'Normal',
      gleasonScore: '3+4=7',
      stage: 'T2c',
      surgeryDate: '2023-08-15',
      surgeryType: 'RALP',
      histopathology: 'Negative margins, organ-confined',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP008',
      name: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 1.2,
      status: 'Post-Op Follow-Up',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-03-15',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'Post-operative monitoring',
      lastAppointment: '2023-12-15',
      nextAppointment: '2024-03-15',
      priority: 'Normal',
      gleasonScore: '4+3=7',
      stage: 'T3a',
      surgeryDate: '2023-06-20',
      surgeryType: 'Open Prostatectomy',
      histopathology: 'Positive margins, extracapsular extension',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // Additional IPD Patients
    {
      id: 'URP009',
      name: 'Christopher Lee',
      age: 72,
      dob: '1952-08-12',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      psa: 6.8,
      status: 'Inpatient',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Intermediate-risk prostate cancer requiring inpatient care',
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-01-25',
      priority: 'High',
      gleasonScore: '3+4=7',
      stage: 'T2b',
      surgeryDate: '2024-01-25',
      surgeryType: 'RALP',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP010',
      name: 'Thomas Brown',
      age: 68,
      dob: '1956-11-30',
      phone: '+61 501 234 567',
      email: 'thomas.brown@email.com',
      address: '741 Elm St, Newcastle NSW 2300',
      psa: 18.3,
      status: 'Inpatient',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2024-01-15',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'High-risk prostate cancer with complications',
      lastAppointment: '2024-01-18',
      nextAppointment: '2024-01-28',
      priority: 'High',
      gleasonScore: '4+4=8',
      stage: 'T3b',
      surgeryDate: '2024-01-28',
      surgeryType: 'Open Prostatectomy',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // Additional patients from PatientDetailsModal
    {
      id: 'URP2024010',
      name: 'Thomas Miller',
      age: 65,
      dob: '1959-04-22',
      phone: '+61 414 567 890',
      email: 'thomas.miller@email.com',
      address: '789 Pine Street, Melbourne VIC 3002',
      psa: 2.1,
      status: 'Discharged',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-11-15',
      referringGP: 'Dr. Sarah Wilson',
      clinicalNotes: 'PSA levels normalized',
      lastAppointment: '2023-11-15',
      nextAppointment: null,
      priority: 'Normal',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP2024011',
      name: 'Jennifer Taylor',
      age: 57,
      dob: '1967-09-18',
      phone: '+61 415 678 901',
      email: 'jennifer.taylor@email.com',
      address: '321 Elm Drive, Melbourne VIC 3003',
      psa: 1.8,
      status: 'Discharged',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-10-20',
      referringGP: 'Dr. Sarah Wilson',
      clinicalNotes: 'Normal PSA levels',
      lastAppointment: '2023-10-20',
      nextAppointment: null,
      priority: 'Normal',
      assignedDoctor: 'Dr. Michael Chen'
    }
  ];

  // Filter and search logic
  const filteredPatients = allPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const pathwayMatch = selectedPathway === 'all' || patient.status === selectedPathway;
    
    // Tab filtering based on database/pathway
    let tabMatch = false;
    switch (activeTab) {
      case 'New Patients':
        tabMatch = patient.database === 'DB1' || patient.status === 'OPD Queue';
        break;
      case 'Surgical Pathway':
        tabMatch = patient.database === 'DB3' || patient.status === 'Surgery Scheduled' || patient.status === 'Inpatient';
        break;
      case 'Post-op Follow-up':
        tabMatch = patient.database === 'DB4' || patient.status === 'Post-Op Follow-Up' || patient.status === 'Discharged';
        break;
      default:
        tabMatch = true;
    }
    
    return searchMatch && pathwayMatch && tabMatch;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'psa':
        return b.psa - a.psa;
      case 'age':
        return b.age - a.age;
      case 'priority':
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Normal': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Add Patient Modal handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handlePatientAdded = (newPatient) => {
    console.log('New patient added:', newPatient);
    // Here you could update your local state or dispatch to Redux store
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };

  // Patient Details Modal handlers
  const handleViewPatientDetails = (patientId) => {
    openPatientDetails(patientId, 'urologist');
  };

  // Schedule MDT Modal handlers
  const handleScheduleMDT = (patient) => {
    setSelectedPatientForMDT(patient);
    setShowScheduleMDTModal(true);
  };

  const handleMDTScheduled = (mdtData) => {
    console.log('MDT scheduled:', mdtData);
    // Here you could update your local state or dispatch to Redux store
  };

  const handleCloseScheduleMDTModal = () => {
    setShowScheduleMDTModal(false);
    setSelectedPatientForMDT(null);
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-end">
          <button 
            onClick={handleAddPatient}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span className="font-medium">Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
              <p className="text-sm text-gray-600 mt-1">Search, add, and view patient timelines across all databases</p>
            </div>
          </div>
        </div>
        {/* Patient Tab Switcher */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('New Patients')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'New Patients'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              New Patients
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'New Patients'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {allPatients.filter(p => p.database === 'DB1' || p.status === 'OPD Queue').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('Surgical Pathway')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'Surgical Pathway'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Surgical Pathway
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'Surgical Pathway'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {allPatients.filter(p => p.database === 'DB3' || p.status === 'Surgery Scheduled' || p.status === 'Inpatient').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('Post-op Follow-up')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === 'Post-op Follow-up'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Post-op Follow-up
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'Post-op Follow-up'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {allPatients.filter(p => p.database === 'DB4' || p.status === 'Post-Op Follow-Up' || p.status === 'Discharged').length}
              </span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search Input removed - moved to table header */}
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
            </div>
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
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Latest PSA</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Next Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map((patient, index) => {
                return (
                    <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-500">ID: {patient.id}</p>
                            <p className="text-xs text-gray-400">Age: {patient.age} • {patient.referringGP}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <p className="font-medium text-gray-900">{patient.psa} ng/mL</p>
                      </td>
                      <td className="py-5 px-6">
                        <p className="text-sm font-medium text-gray-900">{formatDate(patient.nextAppointment)}</p>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handleViewPatientDetails(patient.id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            <span>View Details</span>
                        </button>
                        {/* Show Schedule MDT button only for Surgical Pathway patients */}
                        {activeTab === 'Surgical Pathway' && (
                          <button
                            onClick={() => handleScheduleMDT(patient)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Schedule MDT</span>
                          </button>
                        )}
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
                No patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No patients match your search criteria. Try adjusting your filters or search terms.' : 'No patients are currently in the system.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('New Patients');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  onClick={handleAddPatient}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={handleCloseAddPatientModal}
        onPatientAdded={handlePatientAdded}
        isUrologist={true}
      />

      {/* Schedule MDT Modal */}
      <ScheduleMDTModal
        isOpen={showScheduleMDTModal}
        onClose={handleCloseScheduleMDTModal}
        onScheduled={handleMDTScheduled}
        selectedPatientData={selectedPatientForMDT}
      />

    </div>
  );
};

export default PatientManagement;
