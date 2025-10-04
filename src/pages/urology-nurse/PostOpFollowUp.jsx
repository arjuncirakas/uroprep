import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  Eye,
  Calendar,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Activity,
  ArrowRight,
  Plus,
  RefreshCw,
  UserCheck,
  ClipboardList,
  Shield,
  TrendingUp,
  Download,
  Clock,
  AlertCircle
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';

const PostOpFollowUp = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Recovery');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedPatientForSchedule, setSelectedPatientForSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    type: 'followup',
    doctor: '',
    notes: ''
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

  // Mock post-op follow-up data
  const mockPostOpPatients = [
    {
      id: 'POSTOP001',
      patientName: 'Robert Davis',
      upi: 'URP2024004',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      surgeryDate: '2024-01-20',
      surgeryType: 'RALP',
      surgeon: 'Dr. Sarah Wilson',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      nextFollowUp: '2024-02-20',
      appointmentScheduled: true,
      scheduledDate: '2024-02-20',
      scheduledTime: '10:00',
      assignedDoctor: 'Dr. Sarah Wilson',
      histopathology: {
        gleasonScore: '3+4',
        marginStatus: 'Negative',
        stage: 'pT2c',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'Mild ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-25',
        continence: 'Good',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'Low Risk',
      notes: 'Excellent recovery, PSA undetectable',
      dischargeReady: false
    },
    {
      id: 'POSTOP002',
      patientName: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      surgeryDate: '2024-01-15',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      status: 'Follow-up',
      followUpStatus: 'Complete',
      dischargeStatus: 'Ready',
      lastPSA: 0.05,
      lastPSADate: '2024-01-12',
      nextFollowUp: '2024-04-15',
      appointmentScheduled: true,
      scheduledDate: '2024-04-15',
      scheduledTime: '14:30',
      assignedDoctor: 'Dr. Michael Chen',
      histopathology: {
        gleasonScore: '3+3',
        marginStatus: 'Negative',
        stage: 'pT2a',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'None',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-20',
        continence: 'Excellent',
        painLevel: 'None',
        mobility: 'Excellent'
      },
      riskAssessment: 'Low Risk',
      notes: 'Ready for discharge to GP care',
      dischargeReady: true
    },
    {
      id: 'POSTOP003',
      patientName: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      email: 'james.anderson@email.com',
      surgeryDate: '2024-01-10',
      surgeryType: 'RALP',
      surgeon: 'Dr. Sarah Wilson',
      status: 'High Risk',
      followUpStatus: 'In Progress',
      dischargeStatus: 'MDT Review',
      lastPSA: 0.3,
      lastPSADate: '2024-01-14',
      nextFollowUp: '2024-02-10',
      appointmentScheduled: false,
      histopathology: {
        gleasonScore: '4+3',
        marginStatus: 'Positive',
        stage: 'pT3a',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'Mild incontinence',
        sexual: 'Moderate ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-18',
        continence: 'Improving',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'High Risk',
      notes: 'Positive margins, possible biochemical recurrence',
      dischargeReady: false
    },
    {
      id: 'POSTOP004',
      patientName: 'Michael Thompson',
      upi: 'URP2024009',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'michael.thompson@email.com',
      surgeryDate: '2024-01-05',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.08,
      lastPSADate: '2024-01-08',
      nextFollowUp: '2024-02-05',
      appointmentScheduled: false,
      histopathology: {
        gleasonScore: '3+4',
        marginStatus: 'Negative',
        stage: 'pT2b',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'Mild ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-12',
        continence: 'Good',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'Intermediate Risk',
      notes: 'Good recovery, monitoring PSA levels',
      dischargeReady: false
    },
    {
      id: 'POSTOP005',
      patientName: 'Christopher Lee',
      upi: 'URP2024012',
      age: 59,
      gender: 'Male',
      phone: '+61 416 789 012',
      email: 'christopher.lee@email.com',
      surgeryDate: '2024-01-28',
      surgeryType: 'RALP',
      surgeon: 'Dr. Emma Wilson',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.12,
      lastPSADate: '2024-02-01',
      nextFollowUp: '2024-02-28',
      appointmentScheduled: true,
      scheduledDate: '2024-02-28',
      scheduledTime: '11:00',
      assignedDoctor: 'Dr. Emma Wilson',
      histopathology: {
        gleasonScore: '4+3',
        marginStatus: 'Negative',
        stage: 'pT2c',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'Mild incontinence',
        sexual: 'Moderate ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-02-02',
        continence: 'Improving',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'High Risk',
      notes: 'Recovery progressing well, continence improving',
      dischargeReady: false
    },
    {
      id: 'POSTOP006',
      patientName: 'Mark Johnson',
      upi: 'URP2024013',
      age: 67,
      gender: 'Male',
      phone: '+61 427 890 123',
      email: 'mark.johnson@email.com',
      surgeryDate: '2024-01-22',
      surgeryType: 'RALP',
      surgeon: 'Dr. James Brown',
      status: 'Follow-up',
      followUpStatus: 'Complete',
      dischargeStatus: 'Ready',
      lastPSA: 0.03,
      lastPSADate: '2024-01-25',
      nextFollowUp: '2024-04-22',
      appointmentScheduled: true,
      scheduledDate: '2024-04-22',
      scheduledTime: '09:30',
      assignedDoctor: 'Dr. James Brown',
      histopathology: {
        gleasonScore: '3+3',
        marginStatus: 'Negative',
        stage: 'pT2a',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'None',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-25',
        continence: 'Excellent',
        painLevel: 'None',
        mobility: 'Excellent'
      },
      riskAssessment: 'Low Risk',
      notes: 'Excellent recovery, ready for discharge to GP care',
      dischargeReady: true
    },
    {
      id: 'POSTOP007',
      patientName: 'Steven Garcia',
      upi: 'URP2024014',
      age: 54,
      gender: 'Male',
      phone: '+61 438 901 234',
      email: 'steven.garcia@email.com',
      surgeryDate: '2024-01-18',
      surgeryType: 'RALP',
      surgeon: 'Dr. Lisa Davis',
      status: 'High Risk',
      followUpStatus: 'In Progress',
      dischargeStatus: 'MDT Review',
      lastPSA: 0.4,
      lastPSADate: '2024-01-20',
      nextFollowUp: '2024-02-18',
      appointmentScheduled: false,
      histopathology: {
        gleasonScore: '4+4',
        marginStatus: 'Positive',
        stage: 'pT3b',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'Moderate incontinence',
        sexual: 'Severe ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-01-21',
        continence: 'Poor',
        painLevel: 'Moderate',
        mobility: 'Fair'
      },
      riskAssessment: 'High Risk',
      notes: 'Positive margins, elevated PSA, requires MDT review',
      dischargeReady: false
    },
    {
      id: 'POSTOP008',
      patientName: 'Anthony Martinez',
      upi: 'URP2024015',
      age: 61,
      gender: 'Male',
      phone: '+61 449 012 345',
      email: 'anthony.martinez@email.com',
      surgeryDate: '2024-01-30',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      status: 'Recovery',
      followUpStatus: 'In Progress',
      dischargeStatus: 'Pending',
      lastPSA: 0.15,
      lastPSADate: '2024-02-02',
      nextFollowUp: '2024-02-28',
      appointmentScheduled: true,
      scheduledDate: '2024-02-28',
      scheduledTime: '14:00',
      assignedDoctor: 'Dr. Michael Chen',
      histopathology: {
        gleasonScore: '3+4',
        marginStatus: 'Negative',
        stage: 'pT2b',
        lymphNodes: 'Negative',
        status: 'Complete'
      },
      complications: {
        urinary: 'None',
        sexual: 'Mild ED',
        bowel: 'None',
        other: 'None'
      },
      recovery: {
        catheterRemoved: '2024-02-03',
        continence: 'Good',
        painLevel: 'Low',
        mobility: 'Good'
      },
      riskAssessment: 'Intermediate Risk',
      notes: 'Good recovery, PSA levels within expected range',
      dischargeReady: false
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

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low Risk': return 'bg-green-100 text-green-800';
      case 'Intermediate Risk': return 'bg-yellow-100 text-yellow-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarginColor = (margin) => {
    switch (margin) {
      case 'Negative': return 'bg-green-100 text-green-800';
      case 'Positive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = mockPostOpPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.surgeon.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (activeFilter === 'Recovery' && patient.status === 'Recovery') ||
      (activeFilter === 'Follow-up' && patient.status === 'Follow-up') ||
      (activeFilter === 'High Risk' && patient.status === 'High Risk');
    
    return searchMatch && statusMatch;
  });



  const handleScheduleFollowUp = (patientId) => {
    const patient = mockPostOpPatients.find(p => p.id === patientId);
    setSelectedPatientForSchedule(patient);
    setShowScheduleModal(true);
  };

  const handleReschedule = (patientId) => {
    const patient = mockPostOpPatients.find(p => p.id === patientId);
    setSelectedPatientForSchedule(patient);
    
    // Pre-populate form with existing appointment details
    if (patient.appointmentScheduled) {
      setScheduleForm({
        date: patient.scheduledDate || '',
        time: patient.scheduledTime || '',
        type: 'followup',
        doctor: patient.assignedDoctor || '',
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
    console.log('Scheduling follow-up for patient:', selectedPatientForSchedule?.id, scheduleForm);
    
    // Reset form and close modal
    setScheduleForm({
      date: '',
      time: '',
      type: 'followup',
      doctor: '',
      notes: ''
    });
    setSelectedPatientForSchedule(null);
    setShowScheduleModal(false);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would update the existing appointment
    console.log('Rescheduling follow-up for patient:', selectedPatientForSchedule?.id, scheduleForm);
    
    // Reset form and close modal
    setScheduleForm({
      date: '',
      time: '',
      type: 'followup',
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
      type: 'followup',
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
      type: 'followup',
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

      {/* Post-Op Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Post-Op Follow-Up</h2>
              <p className="text-sm text-gray-600 mt-1">Manage recovery and discharge planning</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="font-medium">Refresh Queue</span>
            </button>
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
                          {patient.status === 'High Risk' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                          )}
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
                        <p className="text-sm text-gray-500">{patient.surgeryDate}</p>
                        <p className="text-xs text-gray-400">Surgeon: {patient.surgeon}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.lastPSA} ng/mL</p>
                        <p className="text-xs text-gray-400">Next: {patient.nextFollowUp}</p>
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
                      <div className="flex flex-col space-y-1">
                        {!patient.appointmentScheduled ? (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center justify-center w-40 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Book Follow-up</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center justify-center w-40 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Update Follow-up</span>
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
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No post-op patients
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('Recovery');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/surgical-pathway')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post-Op Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Follow-up Modal */}
      {showScheduleModal && selectedPatientForSchedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Schedule Follow-up</h2>
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
                  Follow-up Date *
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
                  Follow-up Time *
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
                  Follow-up Type *
                </label>
                <select
                  name="type"
                  value={scheduleForm.type}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="followup">Post-Op Follow-up</option>
                  <option value="psa_check">PSA Check</option>
                  <option value="continence_review">Continence Review</option>
                  <option value="sexual_function">Sexual Function Review</option>
                  <option value="discharge_planning">Discharge Planning</option>
                  <option value="mdt_review">MDT Review</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Doctor *
                </label>
                <select
                  name="doctor"
                  value={scheduleForm.doctor}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a doctor...</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
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
                  placeholder="Additional notes for the follow-up..."
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
                  Schedule Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Follow-up Modal */}
      {showRescheduleModal && selectedPatientForSchedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Reschedule Follow-up</h2>
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
                  New Follow-up Date *
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
                  New Follow-up Time *
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
                  Assigned Doctor *
                </label>
                <select
                  name="doctor"
                  value={scheduleForm.doctor}
                  onChange={handleScheduleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a doctor...</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
                </select>
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
                  Reschedule Follow-up
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

export default PostOpFollowUp;
