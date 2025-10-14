import React, { useState } from 'react';
import AddPatientModal from '../../components/modals/AddPatientModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
import { 
  Search, 
  UserPlus, 
  Eye, 
  X,
  Users,
  Activity,
  Stethoscope
} from 'lucide-react';

const PatientManagement = () => {
  const { openPatientDetails } = usePatientDetails();
  
  const [newPatientsSearch, setNewPatientsSearch] = useState('');
  const [surgicalPathwaySearch, setSurgicalPathwaySearch] = useState('');
  const [postOpFollowUpSearch, setPostOpFollowUpSearch] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);


  
  // Initialize form with current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  

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

  // Filter and search logic for each category
  const filterPatients = (patients, category, searchTerm) => {
    return patients.filter(patient => {
      const searchMatch = searchTerm === '' || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const pathwayMatch = selectedPathway === 'all' || patient.status === selectedPathway;
      
      let categoryMatch = false;
      switch (category) {
        case 'newPatients':
          categoryMatch = patient.database === 'DB1' || patient.status === 'OPD Queue';
          break;
        case 'surgicalPathway':
          categoryMatch = patient.database === 'DB3' || patient.status === 'Surgery Scheduled' || patient.status === 'Inpatient';
          break;
        case 'postOpFollowUp':
          categoryMatch = patient.database === 'DB4' || patient.status === 'Post-Op Follow-Up' || patient.status === 'Discharged';
          break;
        default:
          categoryMatch = true;
      }
      
      return searchMatch && pathwayMatch && categoryMatch;
    });
  };

  // Sort patients helper function
  const sortPatients = (patients) => {
    return [...patients].sort((a, b) => {
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
  };

  // Get filtered and sorted patients for each category
  const newPatients = sortPatients(filterPatients(allPatients, 'newPatients', newPatientsSearch));
  const surgicalPathwayPatients = sortPatients(filterPatients(allPatients, 'surgicalPathway', surgicalPathwaySearch));
  const postOpFollowUpPatients = sortPatients(filterPatients(allPatients, 'postOpFollowUp', postOpFollowUpSearch));


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
  const handleViewPatientDetails = (patientId, context) => {
    openPatientDetails(patientId, 'urologist', null, context);
  };




  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
            <p className="text-gray-600">Search, add, and view patient timelines across all databases</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddPatient}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="font-medium">Add New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Three Tables Side by Side */}
      <div className="grid grid-cols-3 gap-6">
        {/* New Patients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New Patients</h3>
                <p className="text-gray-600 text-sm">Fresh referrals & consultations</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search new patients..."
                value={newPatientsSearch}
                onChange={(e) => setNewPatientsSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
              />
              {newPatientsSearch && (
                <button
                  onClick={() => setNewPatientsSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            {newPatients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-0"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {patient.psa}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewPatientDetails(patient.id, 'newPatients')}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-500 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No new patients found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Surgical Pathway Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Stethoscope className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Surgical Pathway</h3>
                <p className="text-gray-600 text-sm">Pre & post-operative care</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search surgical patients..."
                value={surgicalPathwaySearch}
                onChange={(e) => setSurgicalPathwaySearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-500"
              />
              {surgicalPathwaySearch && (
                <button
                  onClick={() => setSurgicalPathwaySearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            {surgicalPathwayPatients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {surgicalPathwayPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-orange-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-0"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {patient.psa}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewPatientDetails(patient.id, 'surgicalPathway')}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-500 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No surgical patients found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Post-op Follow-up Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Post-op Follow-up</h3>
                <p className="text-gray-600 text-sm">Recovery & monitoring</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search follow-up patients..."
                value={postOpFollowUpSearch}
                onChange={(e) => setPostOpFollowUpSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-500"
              />
              {postOpFollowUpSearch && (
                <button
                  onClick={() => setPostOpFollowUpSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            {postOpFollowUpPatients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {postOpFollowUpPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-green-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-0"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {patient.psa}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewPatientDetails(patient.id, 'postOpFollowUp')}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 border border-green-500 rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No follow-up patients found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={handleCloseAddPatientModal}
        onPatientAdded={handlePatientAdded}
        isUrologist={true}
      />



    </div>
  );
};

export default PatientManagement;
