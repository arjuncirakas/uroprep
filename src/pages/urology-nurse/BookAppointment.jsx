import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Search,
  ChevronDown
} from 'lucide-react';
import PatientSearchDropdown from '../../components/modals/PatientSearchDropdown';
import AppointmentTypeModal from '../../components/modals/AppointmentTypeModal';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBackPath } = useNavigation();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    phone: '',
    email: '',
    address: '',
    age: '',
    upi: '',
    appointmentType: '',
    priority: 'medium',
    date: '',
    time: '',
    duration: 30,
    doctor: 'dr_sarah_johnson',
    notes: '',
    referringDoctor: '',
    reason: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showAppointmentTypeModal, setShowAppointmentTypeModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);

  // Get appointment type from URL parameters
  useEffect(() => {
    const appointmentType = searchParams.get('type');
    if (appointmentType) {
      const selectedType = appointmentTypes.find(t => t.value === appointmentType);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          appointmentType: appointmentType,
          duration: selectedType.duration
        }));
      }
    }
  }, [searchParams]);

  // Show patient search modal on page load if no patient selected and no appointment type from URL
  useEffect(() => {
    const appointmentType = searchParams.get('type');
    if (!selectedPatient && !appointmentType) {
      setShowPatientSearch(true);
    }
  }, [selectedPatient, searchParams]);

  // Close doctor dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDoctorDropdownOpen && !event.target.closest('.doctor-dropdown-container')) {
        setIsDoctorDropdownOpen(false);
        setDoctorSearchTerm(''); // Clear search when closing dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDoctorDropdownOpen]);

  // Mock appointment data for editing
  const mockAppointment = id ? {
    id: id,
    patientName: 'John Smith',
    patientId: 'PAT001',
    phone: '0412 345 678',
    email: 'john.smith@email.com',
    appointmentType: 'follow_up',
    priority: 'medium',
    date: '2024-01-20',
    time: '10:00',
    duration: 30,
    doctor: 'dr_sarah_johnson',
    notes: 'Routine follow-up visit',
    referringDoctor: 'Dr. Sarah Johnson',
    reason: 'PSA monitoring'
  } : null;

  const appointmentTypes = [
    { value: 'first_consultation', label: 'First Consultation', icon: User, duration: 60, description: 'Initial patient assessment' },
    { value: 'follow_up', label: 'Follow-up', icon: Stethoscope, duration: 30, description: 'Routine follow-up visit' },
    { value: 'pre_op_assessment', label: 'Pre-op Assessment', icon: Heart, duration: 45, description: 'Pre-surgical evaluation' },
    { value: 'psa_review', label: 'PSA Review', icon: Activity, duration: 30, description: 'PSA monitoring appointment' },
    { value: 'surveillance', label: 'Surveillance', icon: TrendingUp, duration: 30, description: 'Active surveillance monitoring' },
    { value: 'consultation', label: 'Consultation', icon: User, duration: 45, description: 'General consultation' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const doctors = [
    { value: 'dr_sarah_johnson', label: 'Dr. Sarah Johnson', specialization: 'Urologist' },
    { value: 'dr_michael_chen', label: 'Dr. Michael Chen', specialization: 'Urologist' },
    { value: 'dr_emma_wilson', label: 'Dr. Emma Wilson', specialization: 'Urologist' },
    { value: 'dr_james_brown', label: 'Dr. James Brown', specialization: 'Urologist' },
    { value: 'dr_lisa_davis', label: 'Dr. Lisa Davis', specialization: 'Urologist' }
  ];

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    const matchesName = doctor.label.toLowerCase().includes(doctorSearchTerm.toLowerCase());
    const matchesSpecialization = doctor.specialization.toLowerCase().includes(doctorSearchTerm.toLowerCase());
    return matchesName || matchesSpecialization;
  });


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      patientName: patient.name,
      patientId: patient.id,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      age: patient.age,
      upi: patient.upi
    }));
    setShowPatientSearch(false);
    
    // Show appointment type modal after patient selection if no appointment type is pre-selected
    const appointmentType = searchParams.get('type');
    if (!appointmentType) {
      setShowAppointmentTypeModal(true);
    }
  };

  const handleAppointmentTypeSelect = (type) => {
    const selectedType = appointmentTypes.find(t => t.value === type.value);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        appointmentType: type.value,
        duration: selectedType.duration
      }));
    }
    setShowAppointmentTypeModal(false);
  };

  const handleDoctorSelect = (doctor) => {
    setFormData(prev => ({
      ...prev,
      doctor: doctor.value
    }));
    setDoctorSearchTerm(''); // Clear search after selection
    setIsDoctorDropdownOpen(false);
  };

  const toggleDoctorDropdown = () => {
    setIsDoctorDropdownOpen(!isDoctorDropdownOpen);
    // Don't clear search term when opening dropdown
  };


  const handleSubmit = () => {
    if (!formData.patientName || !formData.appointmentType || !formData.date || !formData.time || !formData.doctor) {
      alert('Please fill in all required fields');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    // Here you would typically save to backend
    console.log('Booking appointment:', formData);
    
    // Navigate back to appointments page
    navigate('/urology-nurse/appointments');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Appointment' : 'Book New Appointment'}
        </h1>
        <p className="text-gray-600 mt-1">
          {id ? 'Modify existing appointment details' : 'Schedule a new patient appointment'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Patient Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900">Patient Selection</h3>
            <p className="text-sm text-gray-600 mt-1">Select a patient to book an appointment</p>
          </div>
          
          {selectedPatient ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{selectedPatient.name}</h4>
                    <p className="text-sm text-gray-500">ID: {selectedPatient.id} | UPI: {selectedPatient.upi}</p>
                    <p className="text-sm text-gray-500">{selectedPatient.age} years old</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientSearch(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Change Patient
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedPatient.email}</span>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{selectedPatient.address}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Patient Selected</h4>
              <p className="text-gray-600 mb-6">Please select a patient to continue with the appointment booking</p>
              <button
                onClick={() => setShowPatientSearch(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity mx-auto"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Select Patient
              </button>
            </div>
          )}
        </div>

        {/* Appointment Details - Only show if patient is selected */}
        {selectedPatient && (
          <div className="space-y-6">
            {/* Selected Appointment Type Display */}
            {formData.appointmentType && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Selected Appointment Type</h3>
                      <p className="text-sm text-gray-600 mt-1">Review the selected appointment type</p>
                    </div>
                    <button
                      onClick={() => setShowAppointmentTypeModal(true)}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      Change Type
                    </button>
                  </div>
                </div>
                
                {(() => {
                  const selectedType = appointmentTypes.find(t => t.value === formData.appointmentType);
                  if (!selectedType) return null;
                  
                  const Icon = selectedType.icon;
                  return (
                    <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{selectedType.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{selectedType.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Duration: {selectedType.duration} minutes</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Scheduling */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Scheduling</h3>
                <p className="text-sm text-gray-600 mt-1">Select date, time, and location for the appointment</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="15"
                    max="120"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="relative doctor-dropdown-container">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type="text"
                        value={doctors.find(d => d.value === formData.doctor)?.label || ''}
                        readOnly
                        onClick={toggleDoctorDropdown}
                        placeholder="Select a doctor..."
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
                      />
                      <button
                        onClick={toggleDoctorDropdown}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDoctorDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Doctor Dropdown */}
                    {isDoctorDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                        {/* Search Bar Inside Dropdown */}
                        <div className="p-3 border-b border-gray-200">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={doctorSearchTerm}
                              onChange={(e) => setDoctorSearchTerm(e.target.value)}
                              placeholder="Search doctors..."
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Doctor List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                              <div
                                key={doctor.value}
                                onClick={() => handleDoctorSelect(doctor)}
                                className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                  formData.doctor === doctor.value ? 'bg-green-50' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-900">{doctor.label}</h4>
                                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <User className="h-6 w-6 text-gray-400" />
                              </div>
                              <p className="text-sm">
                                {doctorSearchTerm ? `No doctors found matching "${doctorSearchTerm}"` : 'No doctors available'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
                <p className="text-sm text-gray-600 mt-1">Additional notes and appointment details</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Appointment
                  </label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Brief reason for appointment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    placeholder="Additional notes or special requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(getBackPath())}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4 mr-2" />
                {id ? 'Update Appointment' : 'Book Appointment'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {id ? 'Confirm Update' : 'Confirm Booking'}
                </h3>
                <p className="text-sm text-gray-600">
                  {id ? 'Please review the updated appointment details' : 'Please review the appointment details'}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Patient:</span>
                <span className="text-gray-900">{formData.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Type:</span>
                <span className="text-gray-900">
                  {appointmentTypes.find(t => t.value === formData.appointmentType)?.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="text-gray-900">{formatDate(formData.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Time:</span>
                <span className="text-gray-900">{formData.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Duration:</span>
                <span className="text-gray-900">{formData.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Doctor:</span>
                <span className="text-gray-900">
                  {doctors.find(d => d.value === formData.doctor)?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {id ? 'Confirm Update' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Search Modal */}
      <PatientSearchDropdown
        isOpen={showPatientSearch}
        onClose={() => setShowPatientSearch(false)}
        onPatientSelect={handlePatientSelect}
        selectedPatient={selectedPatient}
      />

      {/* Appointment Type Selection Modal */}
      <AppointmentTypeModal
        isOpen={showAppointmentTypeModal}
        onClose={() => setShowAppointmentTypeModal(false)}
        onTypeSelect={handleAppointmentTypeSelect}
      />
    </div>
  );
};

export default BookAppointment;
