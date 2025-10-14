import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Users, 
  Search, 
  Eye,
  X,
  UserPlus,
  Calendar
} from 'lucide-react';
import AddPatientModal from '../../components/modals/AddPatientModal';
import NursePatientDetailsModal from '../../components/modals/NursePatientDetailsModal';

const Patients = () => {
  const navigate = useNavigate();
  const [isNursePatientDetailsModalOpen, setIsNursePatientDetailsModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  
  // Mock logged-in nurse (in real app, this would come from auth state)
  const loggedInNurse = 'Nurse Sarah Wilson';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showAppointmentSuccessModal, setShowAppointmentSuccessModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointmentDate, setSelectedAppointmentDate] = useState('');
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // PSA tooltip states
  const [hoveredPSA, setHoveredPSA] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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
      lastAppointment: '2025-10-10',
      nextAppointment: '2025-10-20',
      lastPSA: 8.5,
      lastPSADate: '2025-10-08',
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
      lastAppointment: '2025-10-08',
      nextAppointment: '2026-01-08',
      lastPSA: 5.2,
      lastPSADate: '2025-10-05',
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
      lastAppointment: '2025-10-09',
      nextAppointment: '2025-10-22',
      lastPSA: 4.8,
      lastPSADate: '2025-10-03',
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
      lastAppointment: '2025-10-05',
      nextAppointment: '2026-01-05',
      lastPSA: 0.02,
      lastPSADate: '2025-10-07',
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
      lastAppointment: '2025-10-11',
      nextAppointment: '2025-10-18',
      lastPSA: 6.8,
      lastPSADate: '2025-10-09',
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
      lastAppointment: '2025-10-08',
      nextAppointment: '2026-01-08',
      lastPSA: 4.5,
      lastPSADate: '2025-10-06',
      referringGP: 'Dr. Lisa Chen',
      notes: 'PSA velocity concern, review surveillance protocol',
      addedBy: 'Nurse Michael Chen'
    },
  ];

  // Available doctors
  const doctors = [
    { id: 'dr_smith', name: 'Dr. John Smith', specialization: 'Urologist', experience: '15 years' },
    { id: 'dr_johnson', name: 'Dr. Sarah Johnson', specialization: 'Urologist', experience: '12 years' },
    { id: 'dr_wilson', name: 'Dr. Michael Wilson', specialization: 'Urologist', experience: '18 years' },
    { id: 'dr_brown', name: 'Dr. Emily Brown', specialization: 'Urologist', experience: '10 years' },
    { id: 'dr_davis', name: 'Dr. Robert Davis', specialization: 'Urologist', experience: '20 years' }
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

  // PSA reference values based on age and gender
  const getPSABaselineInfo = (gender, age) => {
    if (gender === 'Male') {
      if (age >= 70) {
        return {
          normal: '0-6.5 ng/mL',
          borderline: '6.5-15.0 ng/mL', 
          elevated: '>15.0 ng/mL',
          description: 'Male PSA Reference Ranges (70+ years):'
        };
      } else if (age >= 60) {
        return {
          normal: '0-4.5 ng/mL',
          borderline: '4.5-10.0 ng/mL', 
          elevated: '>10.0 ng/mL',
          description: 'Male PSA Reference Ranges (60-69 years):'
        };
      } else if (age >= 50) {
        return {
          normal: '0-3.5 ng/mL',
          borderline: '3.5-7.0 ng/mL', 
          elevated: '>7.0 ng/mL',
          description: 'Male PSA Reference Ranges (50-59 years):'
        };
      } else {
        return {
          normal: '0-2.5 ng/mL',
          borderline: '2.5-4.0 ng/mL', 
          elevated: '>4.0 ng/mL',
          description: 'Male PSA Reference Ranges (<50 years):'
        };
      }
    } else if (gender === 'Female') {
      if (age >= 70) {
        return {
          normal: '0-1.2 ng/mL',
          borderline: '1.2-2.0 ng/mL', 
          elevated: '>2.0 ng/mL',
          description: 'Female PSA Reference Ranges (70+ years):'
        };
      } else if (age >= 60) {
        return {
          normal: '0-0.8 ng/mL',
          borderline: '0.8-1.5 ng/mL', 
          elevated: '>1.5 ng/mL',
          description: 'Female PSA Reference Ranges (60-69 years):'
        };
      } else if (age >= 50) {
        return {
          normal: '0-0.6 ng/mL',
          borderline: '0.6-1.0 ng/mL', 
          elevated: '>1.0 ng/mL',
          description: 'Female PSA Reference Ranges (50-59 years):'
        };
      } else {
        return {
          normal: '0-0.5 ng/mL',
          borderline: '0.5-0.8 ng/mL', 
          elevated: '>0.8 ng/mL',
          description: 'Female PSA Reference Ranges (<50 years):'
        };
      }
    }
    return null;
  };

  // Handle PSA hover for tooltip positioning
  const handlePSAHover = (event, patient) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredPSA(patient);
  };

  const handlePSALeave = () => {
    setHoveredPSA(null);
  };



  const filteredPatients = mockPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.referringGP.toLowerCase().includes(searchTerm.toLowerCase());
    
    const pathwayMatch = selectedPathway === 'all' || patient.pathway === selectedPathway;
    
    return searchMatch && pathwayMatch;
  });

  const handleViewPatientDetails = (patientId) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatientForDetails(patient);
      setIsNursePatientDetailsModalOpen(true);
    }
  };

  const handleCloseNursePatientDetailsModal = () => {
    setIsNursePatientDetailsModalOpen(false);
    setSelectedPatientForDetails(null);
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
    console.log('Booking appointment for patient:', selectedPatient?.name, 'on', selectedAppointmentDate, 'at', selectedAppointmentTime, 'with', doctorName, 'Notes:', appointmentNotes);
    setShowAppointmentModal(false);
    setShowAppointmentSuccessModal(true);
  };


  const cancelAppointmentBooking = () => {
    setShowAppointmentModal(false);
    setSelectedAppointmentDate('');
    setSelectedAppointmentTime('');
    setSelectedDoctor('');
    setAppointmentNotes('');
    setSelectedPatient(null);
  };

  const closeAppointmentSuccessModal = () => {
    setShowAppointmentSuccessModal(false);
    setSelectedAppointmentDate('');
    setSelectedAppointmentTime('');
    setSelectedDoctor('');
    setAppointmentNotes('');
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
      {/* Add Patient Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddPatient}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
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
                      <p 
                        className={`font-medium cursor-help ${
                          patient.lastPSA > 10 ? 'text-red-600' : 
                          patient.lastPSA > 4 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}
                        onMouseEnter={(e) => handlePSAHover(e, patient)}
                        onMouseLeave={handlePSALeave}
                      >
                        {patient.lastPSA} ng/mL
                      </p>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-medium text-gray-900">{patient.nextAppointment}</p>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => handleBookAppointment(patient)}
                        className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                          (patient.pathway === 'Active Surveillance' || patient.pathway === 'Post-Op Follow-up')
                            ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500'
                            : patient.nextAppointment && patient.nextAppointment !== null
                              ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500'
                              : 'bg-gradient-to-r from-green-600 to-green-800 border border-green-600 text-white hover:from-green-700 hover:to-green-900 focus:ring-green-500'
                        }`}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {(patient.pathway === 'Active Surveillance' || patient.pathway === 'Post-Op Follow-up')
                            ? 'Update Appointment'
                            : patient.nextAppointment && patient.nextAppointment !== null 
                              ? 'Update Appointment' 
                              : 'Book Appointment'
                          }
                        </span>
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
                    <h3 className="text-2xl font-bold text-gray-900">
                      {(selectedPatient.pathway === 'Active Surveillance' || selectedPatient.pathway === 'Post-Op Follow-up')
                        ? 'Update Appointment'
                        : selectedPatient.nextAppointment && selectedPatient.nextAppointment !== null 
                          ? 'Update Appointment' 
                          : 'Book Appointment'
                      }
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {(selectedPatient.pathway === 'Active Surveillance' || selectedPatient.pathway === 'Post-Op Follow-up')
                        ? `Modify scheduled appointment for ${selectedPatient.name}`
                        : selectedPatient.nextAppointment && selectedPatient.nextAppointment !== null 
                          ? `Modify appointment for ${selectedPatient.name}`
                          : `Schedule appointment for ${selectedPatient.name}`
                      }
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

                  {/* Doctor Appointment Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Doctor, Date and Notes Selection */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Doctor *</label>
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

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Select Date *</label>
                        <input
                          type="date"
                          value={selectedAppointmentDate}
                          onChange={(e) => setSelectedAppointmentDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Notes</label>
                        <textarea
                          value={appointmentNotes}
                          onChange={(e) => setAppointmentNotes(e.target.value)}
                          rows={3}
                          placeholder="Add any notes or special instructions for this appointment..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Add any relevant notes, symptoms, or instructions</p>
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
                            {appointmentNotes && (
                              <div className="mt-3 pt-2 border-t border-green-200">
                                <p><strong>Notes:</strong> {appointmentNotes}</p>
                              </div>
                            )}
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

                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={confirmAppointmentBooking}
                    disabled={!selectedAppointmentDate || !selectedAppointmentTime || !selectedDoctor}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2 inline" />
                    {(selectedPatient.pathway === 'Active Surveillance' || selectedPatient.pathway === 'Post-Op Follow-up')
                      ? 'Update Appointment'
                      : selectedPatient.nextAppointment && selectedPatient.nextAppointment !== null 
                        ? 'Update Appointment' 
                        : 'Confirm Appointment'
                    }
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
                  {(selectedPatient.pathway === 'Active Surveillance' || selectedPatient.pathway === 'Post-Op Follow-up')
                    ? 'Appointment Updated!'
                    : 'Appointment Booked!'
                  }
                </h3>
                <p className="text-green-100 text-sm mt-2">
                  {(selectedPatient.pathway === 'Active Surveillance' || selectedPatient.pathway === 'Post-Op Follow-up')
                    ? 'Appointment has been successfully updated'
                    : 'Appointment has been successfully scheduled'
                  }
                </p>
              </div>
              
              {/* Content */}
              <div className="px-6 py-6">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
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
                      {appointmentNotes && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <p><strong>Notes:</strong></p>
                          <p className="text-xs text-green-700 mt-1 italic">"{appointmentNotes}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    The patient will be notified about their scheduled appointment.
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

      {/* Nurse Patient Details Modal */}
      <NursePatientDetailsModal
        isOpen={isNursePatientDetailsModalOpen}
        onClose={handleCloseNursePatientDetailsModal}
        patientId={selectedPatientForDetails?.id}
        patientData={selectedPatientForDetails}
        userRole="urology-nurse"
        source="patients"
      />

      {/* PSA Tooltip Portal - Rendered outside table overflow */}
      {hoveredPSA && createPortal(
        <div 
          className="fixed px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            minWidth: '250px'
          }}
        >
          <div className="text-center">
            <div className="font-semibold mb-2 text-white">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.description}</div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Normal:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.normal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Borderline:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.borderline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Elevated:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender, hoveredPSA.age)?.elevated}</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                Patient: {hoveredPSA.name} ({hoveredPSA.age} years, {hoveredPSA.gender})
              </div>
              <div className="text-xs text-gray-400">
                Current PSA: {hoveredPSA.lastPSA} ng/mL
              </div>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"
            style={{ marginTop: '-1px' }}
          ></div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Patients;
