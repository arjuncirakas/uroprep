import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  Eye,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';

const ActiveSurveillance = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Status');
  const [isPSAModalOpen, setIsPSAModalOpen] = useState(false);
  const [selectedPatientForPSA, setSelectedPatientForPSA] = useState(null);
  const [psaForm, setPsaForm] = useState({
    date: '',
    value: '',
    type: 'routine'
  });
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);

  // Available doctors list
  const availableDoctors = [
    'Dr. Michael Chen',
    'Dr. Sarah Wilson',
    'Dr. Emma Wilson',
    'Dr. James Brown',
    'Dr. Lisa Davis'
  ];

  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (isPSAModalOpen || isBookAppointmentModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPSAModalOpen, isBookAppointmentModalOpen]);

  // Mock active surveillance data
  const mockSurveillancePatients = [
    {
      id: 'SURV001',
      patientName: 'Michael Brown',
      upi: 'URP2024002',
      age: 58,
      gender: 'Male',
      phone: '+61 423 456 789',
      email: 'michael.brown@email.com',
      status: 'Active',
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      psaVelocity: 0.3,
      nextReview: '2024-04-05',
      appointmentScheduled: true,
      scheduledDate: '2024-04-05',
      scheduledTime: '10:30',
      assignedDoctor: 'Dr. Michael Chen',
      lastMRI: '2023-10-15',
      lastBiopsy: '2023-08-20',
      gleasonScore: '3+3',
      riskCategory: 'Low',
      notes: 'Stable PSA, continue surveillance',
      psaHistory: [
        { date: '2023-01-15', value: 4.8 },
        { date: '2023-04-15', value: 4.9 },
        { date: '2023-07-15', value: 5.0 },
        { date: '2023-10-15', value: 5.1 },
        { date: '2024-01-05', value: 5.2 }
      ]
    },
    {
      id: 'SURV002',
      patientName: 'William Thompson',
      upi: 'URP2024006',
      age: 68,
      gender: 'Male',
      phone: '+61 467 890 123',
      email: 'william.thompson@email.com',
      status: 'Active',
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      psaVelocity: 0.8,
      nextReview: '2024-04-09',
      appointmentScheduled: true,
      scheduledDate: '2024-04-09',
      scheduledTime: '14:15',
      assignedDoctor: 'Dr. Sarah Wilson',
      lastMRI: '2023-11-20',
      lastBiopsy: '2023-09-10',
      gleasonScore: '3+4',
      riskCategory: 'High',
      notes: 'PSA velocity concern, review protocol',
      psaHistory: [
        { date: '2023-01-09', value: 3.8 },
        { date: '2023-04-09', value: 4.0 },
        { date: '2023-07-09', value: 4.2 },
        { date: '2023-10-09', value: 4.3 },
        { date: '2024-01-09', value: 4.5 }
      ]
    },
    {
      id: 'SURV003',
      patientName: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      status: 'Escalated',
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      psaVelocity: 1.2,
      nextReview: '2024-02-03',
      appointmentScheduled: false,
      lastMRI: '2023-12-15',
      lastBiopsy: '2023-10-05',
      gleasonScore: '3+4',
      riskCategory: 'High',
      notes: 'PSA velocity >0.75 ng/mL/year - MDT review required',
      psaHistory: [
        { date: '2023-01-03', value: 3.2 },
        { date: '2023-04-03', value: 3.6 },
        { date: '2023-07-03', value: 4.0 },
        { date: '2023-10-03', value: 4.4 },
        { date: '2024-01-03', value: 4.8 }
      ]
    },
    {
      id: 'SURV004',
      patientName: 'Robert Davis',
      upi: 'URP2024010',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      status: 'Active',
      lastPSA: 3.8,
      lastPSADate: '2023-12-20',
      psaVelocity: 0.2,
      nextReview: '2024-03-20',
      appointmentScheduled: false,
      lastMRI: '2023-09-10',
      lastBiopsy: '2023-07-15',
      gleasonScore: '3+3',
      riskCategory: 'Low',
      notes: 'Excellent compliance, stable parameters',
      psaHistory: [
        { date: '2023-03-20', value: 3.6 },
        { date: '2023-06-20', value: 3.7 },
        { date: '2023-09-20', value: 3.8 },
        { date: '2023-12-20', value: 3.8 }
      ]
    }
  ];


  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const filteredPatients = mockSurveillancePatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (activeFilter === 'All Status') ||
      (activeFilter === 'Escalated' && patient.status === 'Escalated');
    
    return searchMatch && statusMatch;
  });


  const handlePSAEntry = (patientId) => {
    const patient = mockSurveillancePatients.find(p => p.id === patientId);
    setSelectedPatientForPSA(patient);
    setIsPSAModalOpen(true);
  };

  const handlePSAFormChange = (e) => {
    const { name, value } = e.target;
    setPsaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPSA = (e) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Adding PSA value for patient:', selectedPatientForPSA?.id, psaForm);
    
    // Reset form and close modal
    setPsaForm({
      date: '',
      value: '',
      type: 'routine'
    });
    setSelectedPatientForPSA(null);
    setIsPSAModalOpen(false);
  };

  const closePSAModal = () => {
    setIsPSAModalOpen(false);
    setSelectedPatientForPSA(null);
    setPsaForm({
      date: '',
      value: '',
      type: 'routine'
    });
  };




  const handleViewPatientDetails = (patientId) => {
    openPatientDetails(patientId);
  };

  const handleBookAppointment = (patient) => {
    setSelectedPatientForAppointment(patient);
    setIsBookAppointmentModalOpen(true);
  };

  const handleAppointmentBooked = (appointmentData) => {
    console.log('Appointment booked:', appointmentData);
    // Here you would typically update the patient's status in your state management
    // For now, we'll just close the modal and show a success message
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
    alert('Appointment booked successfully!');
  };

  const handleCloseAppointmentModal = () => {
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
  };

  return (
    <div className="space-y-6">

      {/* Surveillance Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Active Surveillance Patients</h2>
            <p className="text-sm text-gray-600 mt-1">Monitor PSA trends and compliance</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or UPI..."
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">View</th>
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
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900">{patient.patientName}</p>
                            {patient.appointmentScheduled && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Calendar className="h-3 w-3 mr-1" />
                                Scheduled
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                          {patient.appointmentScheduled && (
                            <p className="text-xs text-blue-600 mt-1">
                              Next: {patient.scheduledDate} at {patient.scheduledTime} with {patient.assignedDoctor}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.lastPSA} ng/mL</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => handleViewPatientDetails(patient.id)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span>View</span>
                      </button>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handlePSAEntry(patient.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          <span>Add PSA</span>
                        </button>
                        
                        {!patient.appointmentScheduled ? (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 border border-purple-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Book Review</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Update Review</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No active surveillance patients
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('All Status');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/triage')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient to Surveillance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Add PSA Value Modal */}
      {isPSAModalOpen && selectedPatientForPSA && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add PSA Value</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {selectedPatientForPSA.patientName}</p>
              </div>
              <button
                onClick={closePSAModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddPSA} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={psaForm.date}
                  onChange={handlePSAFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PSA Value (ng/mL) *
                </label>
                <input
                  type="number"
                  name="value"
                  value={psaForm.value}
                  onChange={handlePSAFormChange}
                  required
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 6.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type *
                </label>
                <select
                  name="type"
                  value={psaForm.type}
                  onChange={handlePSAFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="routine">Routine Test</option>
                  <option value="follow-up">Follow-up Test</option>
                  <option value="baseline">Baseline Test</option>
                  <option value="urgent">Urgent Test</option>
                </select>
              </div>

              {/* PSA Status Preview */}
              {psaForm.value && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">PSA Status Preview:</h4>
                  <div className="flex items-center space-x-2">
                    {parseFloat(psaForm.value) <= 6.0 ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800">Normal (≤6.0 ng/mL)</span>
                      </>
                    ) : parseFloat(psaForm.value) <= 6.5 ? (
                      <>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">Elevated (6.1-6.5 ng/mL)</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">High (&gt;6.5 ng/mL)</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closePSAModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add PSA Value
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Book Appointment Modal */}
      <BookAppointmentModalWithPatient
        isOpen={isBookAppointmentModalOpen}
        onClose={handleCloseAppointmentModal}
        onAppointmentBooked={handleAppointmentBooked}
        selectedPatientData={selectedPatientForAppointment}
      />
    </div>
  );
};

export default ActiveSurveillance;
