import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Search, 
  Eye,
  Calendar,
  AlertTriangle,
  X,
  Phone,
  Mail,
  FileText,
  Heart,
  Activity,
  ArrowRight,
  Plus,
  ClipboardList,
  Shield,
  Clock
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';

const SurgicalPathway = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Scheduled');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedPatientForSchedule, setSelectedPatientForSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    type: 'surgery',
    doctor: '',
    notes: ''
  });
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);

  // Mock surgical pathway data
  const mockSurgicalPatients = [
    {
      id: 'SURG001',
      patientName: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      surgeryDate: '2024-01-25',
      surgeryTime: '8:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Michael Chen',
      status: 'Scheduled',
      appointmentScheduled: true,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 4.8,
      riskCategory: 'Normal',
      notes: 'Pre-operative assessment completed',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: true,
        imaging: false,
        consent: true,
        preOpVisit: false
      },
      postOpTasks: {
        histopathology: 'Pending',
        marginStatus: 'Pending',
        gleasonScore: 'Pending',
        complications: 'None',
        dischargePlanning: 'Pending'
      }
    },
    {
      id: 'SURG002',
      patientName: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      email: 'james.anderson@email.com',
      surgeryDate: '2024-01-28',
      surgeryTime: '10:30 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Sarah Wilson',
      status: 'Pre-Op',
      appointmentScheduled: true,
      preOpStatus: 'Complete',
      postOpStatus: 'Pending',
      lastPSA: 6.8,
      riskCategory: 'High Risk',
      notes: 'Ready for surgery, all pre-op requirements met',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: true,
        imaging: true,
        consent: true,
        preOpVisit: true
      },
      postOpTasks: {
        histopathology: 'Pending',
        marginStatus: 'Pending',
        gleasonScore: 'Pending',
        complications: 'None',
        dischargePlanning: 'Pending'
      }
    },
    {
      id: 'SURG003',
      patientName: 'Michael Thompson',
      upi: 'URP2024009',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'michael.thompson@email.com',
      surgeryDate: '2024-01-30',
      surgeryTime: '2:00 PM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Michael Chen',
      status: 'Pre-Op',
      appointmentScheduled: false,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 7.2,
      riskCategory: 'High Risk',
      notes: 'Awaiting final imaging results',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: true,
        imaging: false,
        consent: false,
        preOpVisit: false
      },
      postOpTasks: {
        histopathology: 'Pending',
        marginStatus: 'Pending',
        gleasonScore: 'Pending',
        complications: 'None',
        dischargePlanning: 'Pending'
      }
    },
    {
      id: 'SURG004',
      patientName: 'Robert Davis',
      upi: 'URP2024004',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      surgeryDate: '2024-01-20',
      surgeryTime: '9:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Sarah Wilson',
      status: 'Post-Op',
      appointmentScheduled: false,
      preOpStatus: 'Complete',
      postOpStatus: 'In Progress',
      lastPSA: 0.02,
      riskCategory: 'Normal',
      notes: 'Post-operative recovery progressing well',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: true,
        imaging: true,
        consent: true,
        preOpVisit: true
      },
      postOpTasks: {
        histopathology: 'Complete',
        marginStatus: 'Negative',
        gleasonScore: '3+4',
        complications: 'None',
        dischargePlanning: 'In Progress'
      }
    },
    {
      id: 'SURG005',
      patientName: 'Christopher Lee',
      upi: 'URP2024012',
      age: 59,
      gender: 'Male',
      phone: '+61 416 789 012',
      email: 'christopher.lee@email.com',
      surgeryDate: '2024-02-05',
      surgeryTime: '11:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Emma Wilson',
      status: 'Scheduled',
      appointmentScheduled: true,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 8.1,
      riskCategory: 'High Risk',
      notes: 'Pre-operative assessment in progress',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: false,
        bloodWork: true,
        imaging: true,
        consent: false,
        preOpVisit: false
      },
      postOpTasks: {
        histopathology: 'Pending',
        marginStatus: 'Pending',
        gleasonScore: 'Pending',
        complications: 'None',
        dischargePlanning: 'Pending'
      }
    },
    {
      id: 'SURG006',
      patientName: 'Mark Johnson',
      upi: 'URP2024013',
      age: 67,
      gender: 'Male',
      phone: '+61 427 890 123',
      email: 'mark.johnson@email.com',
      surgeryDate: '2024-02-08',
      surgeryTime: '7:30 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. James Brown',
      status: 'Pre-Op',
      appointmentScheduled: true,
      preOpStatus: 'Complete',
      postOpStatus: 'Pending',
      lastPSA: 9.2,
      riskCategory: 'High Risk',
      notes: 'All pre-operative requirements completed, ready for surgery',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: true,
        imaging: true,
        consent: true,
        preOpVisit: true
      },
      postOpTasks: {
        histopathology: 'Pending',
        marginStatus: 'Pending',
        gleasonScore: 'Pending',
        complications: 'None',
        dischargePlanning: 'Pending'
      }
    },
    {
      id: 'SURG007',
      patientName: 'Steven Garcia',
      upi: 'URP2024014',
      age: 54,
      gender: 'Male',
      phone: '+61 438 901 234',
      email: 'steven.garcia@email.com',
      surgeryDate: '2024-01-18',
      surgeryTime: '1:00 PM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Lisa Davis',
      status: 'Post-Op',
      appointmentScheduled: false,
      preOpStatus: 'Complete',
      postOpStatus: 'Complete',
      lastPSA: 0.05,
      riskCategory: 'Normal',
      notes: 'Surgery completed successfully, patient ready for discharge',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: true,
        imaging: true,
        consent: true,
        preOpVisit: true
      },
      postOpTasks: {
        histopathology: 'Complete',
        marginStatus: 'Negative',
        gleasonScore: '3+4',
        complications: 'None',
        dischargePlanning: 'Complete'
      }
    },
    {
      id: 'SURG008',
      patientName: 'Anthony Martinez',
      upi: 'URP2024015',
      age: 61,
      gender: 'Male',
      phone: '+61 449 012 345',
      email: 'anthony.martinez@email.com',
      surgeryDate: '2024-02-12',
      surgeryTime: '10:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Michael Chen',
      status: 'Scheduled',
      appointmentScheduled: true,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 7.8,
      riskCategory: 'High Risk',
      notes: 'Awaiting final pre-operative clearance',
      preOpChecklist: {
        ecg: true,
        anesthesiaClearance: true,
        bloodWork: false,
        imaging: true,
        consent: true,
        preOpVisit: false
      },
      postOpTasks: {
        histopathology: 'Pending',
        marginStatus: 'Pending',
        gleasonScore: 'Pending',
        complications: 'None',
        dischargePlanning: 'Pending'
      }
    }
  ];


  // Prevent background scrolling when modals are open
  useEffect(() => {
    if (showScheduleModal || showRescheduleModal || isBookAppointmentModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showScheduleModal, showRescheduleModal, isBookAppointmentModalOpen]);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pre-Op': return 'bg-yellow-100 text-yellow-800';
      case 'In Surgery': return 'bg-purple-100 text-purple-800';
      case 'Post-Op': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low Risk': return 'bg-green-100 text-green-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = mockSurgicalPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedSurgeon.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (activeFilter === 'Scheduled' && patient.status === 'Scheduled') ||
      (activeFilter === 'Pre-Op' && patient.status === 'Pre-Op') ||
      (activeFilter === 'In Surgery' && patient.status === 'In Surgery') ||
      (activeFilter === 'Post-Op' && patient.status === 'Post-Op');
    
    return searchMatch && statusMatch;
  });



  const handleStatusUpdate = (patientId, newStatus) => {
    console.log(`Updating patient ${patientId} status to ${newStatus}`);
  };


  const handleScheduleSurgery = (patientId) => {
    const patient = mockSurgicalPatients.find(p => p.id === patientId);
    setSelectedPatientForSchedule(patient);
    setShowScheduleModal(true);
  };

  const handleReschedule = (patientId) => {
    const patient = mockSurgicalPatients.find(p => p.id === patientId);
    setSelectedPatientForSchedule(patient);
    
    // Pre-populate form with existing appointment details
    if (patient.appointmentScheduled) {
      setScheduleForm({
        date: patient.surgeryDate || '',
        time: patient.surgeryTime || '',
        type: 'surgery',
        doctor: patient.assignedSurgeon || '',
        notes: ''
      });
    }
    
    setShowRescheduleModal(true);
  };

  const handleScheduleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    console.log('Scheduling surgery for patient:', selectedPatientForSchedule?.id, scheduleForm);
    
    // Reset form and close modal
    setScheduleForm({
      date: '',
      time: '',
      type: 'surgery',
      doctor: '',
      notes: ''
    });
    setSelectedPatientForSchedule(null);
    setShowScheduleModal(false);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would update the existing appointment
    console.log('Rescheduling surgery for patient:', selectedPatientForSchedule?.id, scheduleForm);
    
    // Reset form and close modal
    setScheduleForm({
      date: '',
      time: '',
      type: 'surgery',
      doctor: '',
      notes: ''
    });
    setSelectedPatientForSchedule(null);
    setShowRescheduleModal(false);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedPatientForSchedule(null);
    setScheduleForm({
      date: '',
      time: '',
      type: 'surgery',
      doctor: '',
      notes: ''
    });
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedPatientForSchedule(null);
    setScheduleForm({
      date: '',
      time: '',
      type: 'surgery',
      doctor: '',
      notes: ''
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

      {/* Surgical Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Surgical Pathway</h2>
              <p className="text-sm text-gray-600 mt-1">Manage pre-operative, surgical, and post-operative phases</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UPI, or surgeon..."
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Risk Category</th>
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
                          <p className="font-semibold text-gray-900">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.surgeryType}</p>
                        <p className="text-sm text-gray-500">{patient.surgeryDate} at {patient.surgeryTime}</p>
                        <p className="text-xs text-gray-400">Surgeon: {patient.assignedSurgeon}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(patient.riskCategory)}`}>
                        {patient.riskCategory}
                      </span>
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
                      <div className="flex flex-col space-y-1">
                        {!patient.appointmentScheduled ? (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center justify-center w-40 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Book Surgery</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center justify-center w-40 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Update Surgery</span>
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
                <Stethoscope className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No surgical patients
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('Scheduled');
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
                  Add Patient to Surgery
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Schedule Surgery Modal */}
      {showScheduleModal && selectedPatientForSchedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Schedule Surgery</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {selectedPatientForSchedule.patientName}</p>
              </div>
              <button
                onClick={closeScheduleModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surgery Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleFormChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surgery Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={scheduleForm.time}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surgery Type *
                </label>
                <select
                  name="type"
                  value={scheduleForm.type}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="surgery">RALP (Robotic Assisted Laparoscopic Prostatectomy)</option>
                  <option value="open_surgery">Open Radical Prostatectomy</option>
                  <option value="laparoscopic">Laparoscopic Prostatectomy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Surgeon *
                </label>
                <input
                  type="text"
                  name="doctor"
                  value={scheduleForm.doctor}
                  onChange={handleScheduleFormChange}
                  required
                  placeholder="Enter surgeon name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={scheduleForm.notes}
                  onChange={handleScheduleFormChange}
                  rows={3}
                  placeholder="Additional notes for the surgery..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Surgery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Surgery Modal */}
      {showRescheduleModal && selectedPatientForSchedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Reschedule Surgery</h2>
                <p className="text-sm text-gray-600 mt-1">Patient: {selectedPatientForSchedule.patientName}</p>
              </div>
              <button
                onClick={closeRescheduleModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Surgery Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleFormChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Surgery Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={scheduleForm.time}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Surgeon *
                </label>
                <input
                  type="text"
                  name="doctor"
                  value={scheduleForm.doctor}
                  onChange={handleScheduleFormChange}
                  required
                  placeholder="Enter surgeon name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Reschedule
                </label>
                <textarea
                  name="notes"
                  value={scheduleForm.notes}
                  onChange={handleScheduleFormChange}
                  rows={3}
                  placeholder="Please provide reason for rescheduling..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeRescheduleModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule Surgery
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

export default SurgicalPathway;
