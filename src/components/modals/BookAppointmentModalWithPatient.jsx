import React, { useState } from 'react';
import { 
  Calendar,
  X,
  User,
  Stethoscope,
  Clock
} from 'lucide-react';

const BookAppointmentModalWithPatient = ({ isOpen, onClose, onAppointmentBooked, selectedPatientData }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [activeModalTab, setActiveModalTab] = useState('appointment');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [selectedProcedureDate, setSelectedProcedureDate] = useState('');
  const [selectedProcedureTime, setSelectedProcedureTime] = useState('');

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

  const handleSubmit = () => {
    if (!selectedPatientData) {
      alert('Patient data is missing');
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
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setSelectedProcedure('');
    setSelectedProcedureDate('');
    setSelectedProcedureTime('');
    setActiveModalTab('appointment');
    onClose();
  };

  const handleCancel = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setSelectedProcedure('');
    setSelectedProcedureDate('');
    setSelectedProcedureTime('');
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
                <p className="text-sm text-gray-600 mt-1">Schedule OPD consultation for {selectedPatientData?.patientName}</p>
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
              {/* Patient Information Display */}
              {selectedPatientData && (
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedPatientData.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {selectedPatientData.priority === 'Urgent' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{selectedPatientData.patientName}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                        <span>UPI: {selectedPatientData.upi}</span>
                        <span>Age: {selectedPatientData.age}</span>
                        <span>Gender: {selectedPatientData.gender}</span>
                        <span>PSA: {selectedPatientData.latestPSA} ng/mL</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Reason: {selectedPatientData.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointment Tab */}
              {activeModalTab === 'appointment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Doctor and Date Selection */}
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
                          <p><strong>Patient:</strong> {selectedPatientData.patientName}</p>
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
                  {/* Procedure Selection */}
                  <div className="space-y-4">
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
                          <p><strong>Patient:</strong> {selectedPatientData.patientName}</p>
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

export default BookAppointmentModalWithPatient;








