import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Eye,
  X,
  UserPlus,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
import AddPatientModal from '../../components/modals/AddPatientModal';

const Patients = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  
  // Mock logged-in nurse (in real app, this would come from auth state)
  const loggedInNurse = 'Nurse Sarah Wilson';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [activeTab, setActiveTab] = useState('All Patients');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAppointmentSuccessModal, setShowAppointmentSuccessModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedProcedureDate, setSelectedProcedureDate] = useState('');
  const [selectedProcedureTime, setSelectedProcedureTime] = useState('');
  const [activeModalTab, setActiveModalTab] = useState('appointment');
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Mock patient data
  const mockPatients = [
    {
      id: 'URP2024001',
      name: 'John Smith',
      upi: 'URP2024001',
      age: 65,
      gender: 'Male',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      status: 'Active',
      pathway: 'OPD Queue',
      type: 'OPD',
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-01-22',
      lastPSA: 8.5,
      lastPSADate: '2024-01-08',
      referringGP: 'Dr. Sarah Johnson',
      notes: 'Elevated PSA, awaiting urologist consultation',
      addedBy: 'Nurse Sarah Wilson'
    },
    {
      id: 'PAT002',
      name: 'Michael Brown',
      upi: 'URP2024002',
      age: 58,
      gender: 'Male',
      phone: '+61 423 456 789',
      email: 'michael.brown@email.com',
      status: 'Active',
      pathway: 'Active Surveillance',
      type: 'OPD',
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-04-10',
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      referringGP: 'Dr. Robert Wilson',
      notes: 'Under active surveillance, stable PSA',
      addedBy: 'Nurse Michael Chen'
    },
    {
      id: 'PAT003',
      name: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      status: 'Active',
      pathway: 'Surgical Pathway',
      type: 'IPD',
      lastAppointment: '2024-01-12',
      nextAppointment: '2024-01-25',
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      referringGP: 'Dr. Emily Davis',
      notes: 'Scheduled for RALP surgery',
      addedBy: 'Nurse Sarah Wilson'
    },
    {
      id: 'URP2024004',
      name: 'David Wilson',
      upi: 'URP2024004',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      status: 'Discharged',
      pathway: 'Post-Op Follow-up',
      type: 'OPD',
      lastAppointment: '2024-01-08',
      nextAppointment: '2024-04-08',
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      referringGP: 'Dr. Jennifer Lee',
      notes: 'Post-RALP, excellent recovery, ready for GP care',
      addedBy: 'Nurse Michael Chen'
    },
    {
      id: 'PAT005',
      name: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      email: 'james.anderson@email.com',
      status: 'Active',
      pathway: 'OPD Queue',
      type: 'OPD',
      lastAppointment: '2024-01-14',
      nextAppointment: '2024-01-21',
      lastPSA: 6.8,
      lastPSADate: '2024-01-12',
      referringGP: 'Dr. Mark Thompson',
      notes: 'Suspicious MRI findings, urgent biopsy required',
      addedBy: 'Nurse Sarah Wilson'
    },
    {
      id: 'PAT006',
      name: 'William Thompson',
      upi: 'URP2024006',
      age: 68,
      gender: 'Male',
      phone: '+61 467 890 123',
      email: 'william.thompson@email.com',
      status: 'Active',
      pathway: 'Active Surveillance',
      type: 'OPD',
      lastAppointment: '2024-01-11',
      nextAppointment: '2024-04-11',
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      referringGP: 'Dr. Lisa Chen',
      notes: 'PSA velocity concern, review surveillance protocol',
      addedBy: 'Nurse Michael Chen'
    },
    // Additional patients from PatientDetailsModal
    {
      id: 'URP2024010',
      name: 'Thomas Miller',
      upi: 'URP2024010',
      age: 65,
      gender: 'Male',
      phone: '+61 414 567 890',
      email: 'thomas.miller@email.com',
      status: 'Discharged',
      pathway: 'Post-Op Follow-up',
      type: 'OPD',
      lastAppointment: '2023-11-15',
      nextAppointment: null,
      lastPSA: 2.1,
      lastPSADate: '2023-11-15',
      referringGP: 'Dr. Sarah Wilson',
      notes: 'PSA levels normalized, returned to GP care',
      addedBy: 'Nurse Sarah Wilson'
    },
    {
      id: 'URP2024011',
      name: 'Jennifer Taylor',
      upi: 'URP2024011',
      age: 57,
      gender: 'Male',
      phone: '+61 415 678 901',
      email: 'jennifer.taylor@email.com',
      status: 'Discharged',
      pathway: 'Post-Op Follow-up',
      type: 'OPD',
      lastAppointment: '2023-10-20',
      nextAppointment: null,
      lastPSA: 1.8,
      lastPSADate: '2023-10-20',
      referringGP: 'Dr. Sarah Wilson',
      notes: 'Normal PSA levels, completed treatment',
      addedBy: 'Nurse Michael Chen'
    }
  ];

  // Available doctors
  const doctors = [
    { id: 'dr_smith', name: 'Dr. John Smith', specialization: 'Urologist', experience: '15 years' },
    { id: 'dr_johnson', name: 'Dr. Sarah Johnson', specialization: 'Urologist', experience: '12 years' },
    { id: 'dr_wilson', name: 'Dr. Michael Wilson', specialization: 'Urologist', experience: '18 years' },
    { id: 'dr_brown', name: 'Dr. Emily Brown', specialization: 'Urologist', experience: '10 years' },
    { id: 'dr_davis', name: 'Dr. Robert Davis', specialization: 'Urologist', experience: '20 years' }
  ];

  // Available procedures
  const procedures = [
    { id: 'mri', name: 'MRI', description: 'Magnetic Resonance Imaging of the prostate', duration: '45 minutes' },
    { id: 'trus_biopsy', name: 'TRUS Biopsy', description: 'Transrectal Ultrasound-guided biopsy', duration: '30 minutes' },
    { id: 'psa_test', name: 'PSA Test', description: 'Prostate-Specific Antigen blood test', duration: '15 minutes' },
    { id: 'cystoscopy', name: 'Cystoscopy', description: 'Examination of the bladder and urethra', duration: '20 minutes' },
    { id: 'urodynamics', name: 'Urodynamics', description: 'Assessment of bladder function', duration: '60 minutes' }
  ];

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getPathwayColor = (pathway) => {
    switch (pathway) {
      case 'OPD Queue': return 'bg-blue-100 text-blue-800';
      case 'Active Surveillance': return 'bg-green-100 text-green-800';
      case 'Surgical Pathway': return 'bg-orange-100 text-orange-800';
      case 'Post-Op Follow-up': return 'bg-purple-100 text-purple-800';
      case 'Discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  const filteredPatients = mockPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.referringGP.toLowerCase().includes(searchTerm.toLowerCase());
    
    const pathwayMatch = selectedPathway === 'all' || patient.pathway === selectedPathway;
    
    // Tab filtering
    const tabMatch = activeTab === 'All Patients' || 
      (activeTab === 'My Patients' && patient.addedBy === loggedInNurse);
    
    return searchMatch && pathwayMatch && tabMatch;
  });

  const handleViewPatientDetails = (patientId) => {
    openPatientDetails(patientId);
  };

  // Appointment booking functions
  const handleBookAppointment = (patient) => {
    setSelectedPatient(patient);
    setShowAppointmentModal(true);
  };

  const confirmAppointmentBooking = () => {
    if (!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor) {
      alert('Please select date, time, and doctor');
      return;
    }
    const doctorName = doctors.find(d => d.id === selectedDoctor)?.name;
    console.log('Booking appointment for patient:', selectedPatient?.name, 'on', selectedAppointmentDate, 'at', selectedAppointmentTime, 'with', doctorName);
    setShowAppointmentModal(false);
    setShowAppointmentSuccessModal(true);
  };

  const confirmProcedureBooking = () => {
    if (!selectedProcedureDate || !selectedProcedureTime || !selectedProcedure) {
      alert('Please select date, time, and procedure');
      return;
    }
    const procedureName = procedures.find(p => p.id === selectedProcedure)?.name;
    console.log('Booking procedure for patient:', selectedPatient?.name, 'on', selectedProcedureDate, 'at', selectedProcedureTime, 'procedure:', procedureName);
    setShowAppointmentModal(false);
    setShowAppointmentSuccessModal(true);
  };

  const cancelAppointmentBooking = () => {
    setShowAppointmentModal(false);
    setSelectedAppointmentDate('');
    setSelectedAppointmentTime('');
    setSelectedDoctor('');
    setSelectedProcedure('');
    setSelectedProcedureDate('');
    setSelectedProcedureTime('');
    setActiveModalTab('appointment');
    setSelectedPatient(null);
  };

  const closeAppointmentSuccessModal = () => {
    setShowAppointmentSuccessModal(false);
    setSelectedAppointmentDate('');
    setSelectedAppointmentTime('');
    setSelectedDoctor('');
    setSelectedProcedure('');
    setSelectedProcedureDate('');
    setSelectedProcedureTime('');
    setActiveModalTab('appointment');
    setSelectedPatient(null);
  };

  // Add Patient Modal handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handlePatientAdded = (newPatient) => {
    console.log('New patient added:', newPatient);
    // Here you could update your local state or dispatch to Redux store
    // For now, we'll just log it
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">Unified searchable list of all patients with current pathway status</p>
          </div>
          <button
            onClick={handleAddPatient}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </button>
        </div>
      </div>


      {/* Patient Tab Switcher */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('All Patients')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'All Patients'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All Patients
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'All Patients'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {mockPatients.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('My Patients')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'My Patients'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              My Patients
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'My Patients'
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {mockPatients.filter(p => p.addedBy === loggedInNurse).length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Patient List</h2>
            <p className="text-sm text-gray-600 mt-1">All patients under urology care</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, UPI, or GP..."
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Pathway</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Latest PSA</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Next Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Book Appointment</th>
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
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPathwayColor(patient.pathway)}`}>
                        {patient.pathway}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <p className="font-medium text-gray-900">{patient.lastPSA} ng/mL</p>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-medium text-gray-900">{patient.nextAppointment}</p>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => handleBookAppointment(patient)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Book Appointment</span>
                      </button>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => handleViewPatientDetails(patient.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span>View Details</span>
                      </button>
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
                No patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('All Patients');
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


      {/* Appointment Booking Modal */}
      {showAppointmentModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[110] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Schedule appointment for {selectedPatient.name}
                    </p>
                  </div>
                  <button
                    onClick={cancelAppointmentBooking}
                    className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </button>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0">
                <div className="flex space-x-2">
                  {[
                    { id: 'appointment', name: 'Doctor Appointment', icon: Calendar },
                    { id: 'procedure', name: 'Schedule Procedure', icon: Stethoscope }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveModalTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                        activeModalTab === tab.id
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.name}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeModalTab === tab.id
                          ? 'bg-green-400 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.id === 'appointment' ? '2' : '5'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  {/* Patient Info Card */}
                  <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">Age: {selectedPatient.age} years</span>
                          <span className="text-sm text-gray-600">PSA: {selectedPatient.lastPSA} ng/mL</span>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedPatient.pathway}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Tab */}
                  {activeModalTab === 'appointment' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Date and Doctor Selection */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">Select Date</label>
                          <input
                            type="date"
                            value={selectedAppointmentDate}
                            onChange={(e) => setSelectedAppointmentDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">Select Doctor</label>
                          <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          >
                            <option value="">Choose a doctor...</option>
                            {doctors.map((doctor) => (
                              <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialization} ({doctor.experience})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Selected Summary */}
                        {selectedAppointmentDate && selectedAppointmentTime && selectedDoctor && (
                          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                            <div className="flex items-center mb-3">
                              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                              <h4 className="text-sm font-semibold text-green-900">Appointment Summary</h4>
                            </div>
                            <div className="text-sm text-green-800 space-y-2">
                              <p><strong>Type:</strong> OPD Consultation</p>
                              <p><strong>Patient:</strong> {selectedPatient.name}</p>
                              <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                              <p><strong>Date:</strong> {new Date(selectedAppointmentDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                              <p><strong>Time:</strong> {selectedAppointmentTime}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Time</label>
                        <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedAppointmentTime(time)}
                              className={`px-3 py-2 text-sm rounded-md border transition-all duration-200 font-medium ${
                                selectedAppointmentTime === time
                                  ? 'bg-green-500 text-white border-green-500 shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click on a time slot to select your preferred appointment time</p>
                      </div>
                    </div>
                  )}

                  {/* Procedure Tab */}
                  {activeModalTab === 'procedure' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Procedure and Date Selection */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">Select Procedure</label>
                          <select
                            value={selectedProcedure}
                            onChange={(e) => setSelectedProcedure(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          >
                            <option value="">Choose a procedure...</option>
                            {procedures.map((procedure) => (
                              <option key={procedure.id} value={procedure.id}>
                                {procedure.name} - {procedure.duration}
                              </option>
                            ))}
                          </select>
                          {selectedProcedure && (
                            <p className="text-xs text-gray-600 mt-2">
                              {procedures.find(p => p.id === selectedProcedure)?.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">Select Date</label>
                          <input
                            type="date"
                            value={selectedProcedureDate}
                            onChange={(e) => setSelectedProcedureDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>

                        {/* Selected Summary */}
                        {selectedProcedureDate && selectedProcedureTime && selectedProcedure && (
                          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                            <div className="flex items-center mb-3">
                              <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                              <h4 className="text-sm font-semibold text-green-900">Procedure Summary</h4>
                            </div>
                            <div className="text-sm text-green-800 space-y-2">
                              <p><strong>Type:</strong> {procedures.find(p => p.id === selectedProcedure)?.name}</p>
                              <p><strong>Patient:</strong> {selectedPatient.name}</p>
                              <p><strong>Duration:</strong> {procedures.find(p => p.id === selectedProcedure)?.duration}</p>
                              <p><strong>Date:</strong> {new Date(selectedProcedureDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                              <p><strong>Time:</strong> {selectedProcedureTime}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Time</label>
                        <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedProcedureTime(time)}
                              className={`px-3 py-2 text-sm rounded-md border transition-all duration-200 font-medium ${
                                selectedProcedureTime === time
                                  ? 'bg-green-500 text-white border-green-500 shadow-sm'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Click on a time slot to select your preferred procedure time</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={activeModalTab === 'appointment' ? confirmAppointmentBooking : confirmProcedureBooking}
                    disabled={
                      activeModalTab === 'appointment' 
                        ? (!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor)
                        : (!selectedProcedureDate || !selectedProcedureTime || !selectedProcedure)
                    }
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {activeModalTab === 'appointment' ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2 inline" />
                        Confirm Appointment
                      </>
                    ) : (
                      <>
                        <Stethoscope className="h-4 w-4 mr-2 inline" />
                        Confirm Procedure
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelAppointmentBooking}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Success Modal */}
      {showAppointmentSuccessModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[120] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeModalTab === 'appointment' ? 'Appointment Booked!' : 'Procedure Scheduled!'}
                </h3>
                <p className="text-green-100 text-sm mt-2">
                  {activeModalTab === 'appointment' ? 'Appointment has been successfully scheduled' : 'Procedure has been successfully scheduled'}
                </p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                    <div className="text-sm text-green-800 space-y-2">
                      {activeModalTab === 'appointment' ? (
                        <>
                          <p><strong>Type:</strong> OPD Consultation</p>
                          <p><strong>Patient:</strong> {selectedPatient.name}</p>
                          <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                          <p><strong>Date:</strong> {new Date(selectedAppointmentDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                          <p><strong>Time:</strong> {selectedAppointmentTime}</p>
                        </>
                      ) : (
                        <>
                          <p><strong>Type:</strong> {procedures.find(p => p.id === selectedProcedure)?.name}</p>
                          <p><strong>Patient:</strong> {selectedPatient.name}</p>
                          <p><strong>Duration:</strong> {procedures.find(p => p.id === selectedProcedure)?.duration}</p>
                          <p><strong>Date:</strong> {new Date(selectedProcedureDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                          <p><strong>Time:</strong> {selectedProcedureTime}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    The patient will be notified about their scheduled {activeModalTab === 'appointment' ? 'appointment' : 'procedure'}.
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 pb-6">
                <button
                  onClick={closeAppointmentSuccessModal}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={handleCloseAddPatientModal}
        onPatientAdded={handlePatientAdded}
      />
    </div>
  );
};

export default Patients;
