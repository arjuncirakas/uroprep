import React, { useState } from 'react';
import { 
  Calendar,
  X,
  Search,
  User,
  Stethoscope,
  Clock
} from 'lucide-react';

const BookAppointmentModal = ({ isOpen, onClose, onAppointmentBooked }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('appointment');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedProcedureDate, setSelectedProcedureDate] = useState('');
  const [selectedProcedureTime, setSelectedProcedureTime] = useState('');

  // Mock patient data
  const mockPatients = [
    {
      id: 'PAT001',
      name: 'John Smith',
      upi: 'URP2024001',
      age: 65,
      gender: 'Male',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      status: 'Active',
      pathway: 'OPD Queue',
      lastPSA: 8.5,
      lastPSADate: '2024-01-08',
      referringGP: 'Dr. Sarah Johnson',
      notes: 'Elevated PSA, awaiting urologist consultation'
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
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      referringGP: 'Dr. Robert Wilson',
      notes: 'Under active surveillance, stable PSA'
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
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      referringGP: 'Dr. Emily Davis',
      notes: 'Scheduled for RALP surgery'
    },
    {
      id: 'PAT004',
      name: 'Robert Davis',
      upi: 'URP2024004',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      status: 'Discharged',
      pathway: 'Post-Op Follow-up',
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      referringGP: 'Dr. Jennifer Lee',
      notes: 'Post-RALP, excellent recovery, ready for GP care'
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
      lastPSA: 6.8,
      lastPSADate: '2024-01-12',
      referringGP: 'Dr. Mark Thompson',
      notes: 'Suspicious MRI findings, urgent biopsy required'
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
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      referringGP: 'Dr. Lisa Chen',
      notes: 'PSA velocity concern, review surveillance protocol'
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

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    patient.upi.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    patient.referringGP.toLowerCase().includes(patientSearchTerm.toLowerCase())
  );

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient.id);
    setSelectedPatientData(patient);
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
  };

  const handlePatientSearchChange = (e) => {
    setPatientSearchTerm(e.target.value);
  };

  const handleDropdownToggle = () => {
    setShowPatientDropdown(!showPatientDropdown);
    if (!showPatientDropdown) {
      setPatientSearchTerm('');
    }
  };

  const handleClearSelection = () => {
    setSelectedPatient('');
    setSelectedPatientData(null);
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedPatientData) {
      alert('Please select a patient');
      return;
    }

    if (activeModalTab === 'appointment') {
      if (!selectedDate || !selectedTime || !selectedDoctor) {
        alert('Please fill in all required fields for appointment');
        return;
      }

      const doctor = doctors.find(d => d.id === selectedDoctor);

      const appointmentData = {
        patient: selectedPatientData,
        doctor: doctor,
        date: selectedDate,
        time: selectedTime,
        type: 'OPD Consultation'
      };

      console.log('Booking appointment:', appointmentData);
      
      if (onAppointmentBooked) {
        onAppointmentBooked(appointmentData);
      }
    } else {
      if (!selectedProcedureDate || !selectedProcedureTime || !selectedProcedure) {
        alert('Please fill in all required fields for procedure');
        return;
      }

      const procedure = procedures.find(p => p.id === selectedProcedure);

      const appointmentData = {
        patient: selectedPatientData,
        procedure: procedure,
        date: selectedProcedureDate,
        time: selectedProcedureTime,
        type: 'Procedure'
      };

      console.log('Booking procedure:', appointmentData);
      
      if (onAppointmentBooked) {
        onAppointmentBooked(appointmentData);
      }
    }

    // Reset form
    setSelectedPatient('');
    setSelectedPatientData(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setSelectedProcedure('');
    setSelectedProcedureDate('');
    setSelectedProcedureTime('');
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
    setActiveModalTab('appointment');
    onClose();
  };

  const handleCancel = () => {
    setSelectedPatient('');
    setSelectedPatientData(null);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setSelectedProcedure('');
    setSelectedProcedureDate('');
    setSelectedProcedureTime('');
    setPatientSearchTerm('');
    setShowPatientDropdown(false);
    setActiveModalTab('appointment');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[110] flex items-center justify-center p-4">
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Book Appointment</h3>
                <p className="text-sm text-gray-600 mt-1">Schedule OPD consultation for a patient</p>
              </div>
              <button
                onClick={handleCancel}
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
              {/* Patient Selection */}
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Select Patient</h4>
                    <p className="text-sm text-gray-600">Choose a patient for the appointment</p>
                  </div>
                </div>
              </div>

              {/* Appointment Tab */}
              {activeModalTab === 'appointment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patient and Doctor Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Select Patient *</label>
                    <div className="relative">
                      {/* Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={handleDropdownToggle}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-left bg-white flex items-center justify-between"
                      >
                        {selectedPatientData ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xs">
                                {selectedPatientData.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{selectedPatientData.name}</p>
                              <p className="text-sm text-gray-500">UPI: {selectedPatientData.upi} • Age: {selectedPatientData.age}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Choose a patient...</span>
                        )}
                        <div className="flex items-center space-x-2">
                          {selectedPatientData && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClearSelection();
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <svg className={`h-4 w-4 text-gray-400 transition-transform ${showPatientDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Patient Dropdown */}
                      {showPatientDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                          {/* Search Field Inside Dropdown */}
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                value={patientSearchTerm}
                                onChange={handlePatientSearchChange}
                                placeholder="Search by name, UPI, or GP..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          {/* Patient List */}
                          <div className="max-h-60 overflow-y-auto">
                            {filteredPatients.length > 0 ? (
                              filteredPatients.map((patient) => (
                                <div
                                  key={patient.id}
                                  onClick={() => handlePatientSelect(patient)}
                                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                                      <span className="text-white font-semibold text-xs">
                                        {patient.name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{patient.name}</p>
                                      <p className="text-sm text-gray-500">UPI: {patient.upi} • Age: {patient.age} • PSA: {patient.lastPSA} ng/mL</p>
                                      <p className="text-xs text-gray-400">GP: {patient.referringGP}</p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-gray-500">
                                No patients found
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

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
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                    {/* Selected Summary */}
                    {selectedPatientData && selectedDate && selectedTime && selectedDoctor && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                        <div className="flex items-center mb-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                          <h4 className="text-sm font-semibold text-green-900">Appointment Summary</h4>
                        </div>
                        <div className="text-sm text-green-800 space-y-2">
                          <p><strong>Type:</strong> OPD Consultation</p>
                          <p><strong>Patient:</strong> {selectedPatientData.name}</p>
                          <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                          <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                          <p><strong>Time:</strong> {selectedTime}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Select Time *</label>
                    <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 text-sm rounded-md border transition-all duration-200 font-medium ${
                            selectedTime === time
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
                  {/* Patient and Procedure Selection */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Select Patient *</label>
                      <div className="relative">
                        {/* Dropdown Trigger */}
                        <button
                          type="button"
                          onClick={handleDropdownToggle}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-left bg-white flex items-center justify-between"
                        >
                          {selectedPatientData ? (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                  {selectedPatientData.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{selectedPatientData.name}</p>
                                <p className="text-sm text-gray-500">UPI: {selectedPatientData.upi} • Age: {selectedPatientData.age}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">Choose a patient...</span>
                          )}
                          <div className="flex items-center space-x-2">
                            {selectedPatientData && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearSelection();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            <svg className={`h-4 w-4 text-gray-400 transition-transform ${showPatientDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        
                        {/* Patient Dropdown */}
                        {showPatientDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                            {/* Search Field Inside Dropdown */}
                            <div className="p-3 border-b border-gray-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={patientSearchTerm}
                                  onChange={handlePatientSearchChange}
                                  placeholder="Search by name, UPI, or GP..."
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                  autoFocus
                                />
                              </div>
                            </div>
                            
                            {/* Patient List */}
                            <div className="max-h-60 overflow-y-auto">
                              {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                  <div
                                    key={patient.id}
                                    onClick={() => handlePatientSelect(patient)}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-xs">
                                          {patient.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{patient.name}</p>
                                        <p className="text-sm text-gray-500">UPI: {patient.upi} • Age: {patient.age} • PSA: {patient.lastPSA} ng/mL</p>
                                        <p className="text-xs text-gray-400">GP: {patient.referringGP}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 text-center text-gray-500">
                                  No patients found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Select Procedure *</label>
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
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Select Date *</label>
                      <input
                        type="date"
                        value={selectedProcedureDate}
                        onChange={(e) => setSelectedProcedureDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Selected Summary */}
                    {selectedPatientData && selectedProcedureDate && selectedProcedureTime && selectedProcedure && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                        <div className="flex items-center mb-3">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                          <h4 className="text-sm font-semibold text-green-900">Procedure Summary</h4>
                        </div>
                        <div className="text-sm text-green-800 space-y-2">
                          <p><strong>Type:</strong> {procedures.find(p => p.id === selectedProcedure)?.name}</p>
                          <p><strong>Patient:</strong> {selectedPatientData.name}</p>
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
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Select Time *</label>
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
                onClick={handleSubmit}
                disabled={
                  !selectedPatientData || 
                  (activeModalTab === 'appointment' && (!selectedDate || !selectedTime || !selectedDoctor)) ||
                  (activeModalTab === 'procedure' && (!selectedProcedureDate || !selectedProcedureTime || !selectedProcedure))
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
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
