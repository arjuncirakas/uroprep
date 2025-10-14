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
import NursePatientDetailsModal from '../../components/modals/NursePatientDetailsModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';

const SurgicalPathway = () => {
  const navigate = useNavigate();
  const { openPatientDetails } = usePatientDetails();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Scheduled');
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
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
  const [isNursePatientDetailsModalOpen, setIsNursePatientDetailsModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);

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
      surgeryDate: '2025-10-25',
      surgeryTime: '9:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Michael Chen',
      status: 'Scheduled',
      appointmentScheduled: true,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 4.8,
      psaHistory: [
        { date: '2023-06-15', value: 3.2 },
        { date: '2023-09-15', value: 3.8 },
        { date: '2023-12-15', value: 4.2 },
        { date: '2024-03-15', value: 4.8 }
      ],
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
      surgeryDate: '2025-10-28',
      surgeryTime: '10:30 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Sarah Wilson',
      status: 'Pre-Op',
      appointmentScheduled: true,
      preOpStatus: 'Complete',
      postOpStatus: 'Pending',
      lastPSA: 6.8,
      psaHistory: [
        { date: '2023-05-20', value: 4.1 },
        { date: '2023-08-20', value: 5.2 },
        { date: '2023-11-20', value: 6.1 },
        { date: '2024-02-20', value: 6.8 }
      ],
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
      surgeryDate: '2025-10-30',
      surgeryTime: '2:00 PM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Michael Chen',
      status: 'Pre-Op',
      appointmentScheduled: false,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 7.2,
      psaHistory: [
        { date: '2023-07-10', value: 5.8 },
        { date: '2023-10-10', value: 6.4 },
        { date: '2024-01-10', value: 6.9 },
        { date: '2024-04-10', value: 7.2 }
      ],
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
      surgeryDate: '2025-09-20',
      surgeryTime: '9:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Sarah Wilson',
      status: 'Post-Op',
      appointmentScheduled: false,
      preOpStatus: 'Complete',
      postOpStatus: 'In Progress',
      lastPSA: 0.02,
      psaHistory: [
        { date: '2023-08-15', value: 8.5 },
        { date: '2023-11-15', value: 9.1 },
        { date: '2024-02-15', value: 9.8 },
        { date: '2024-05-15', value: 0.02 }
      ],
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
      surgeryDate: '2025-11-05',
      surgeryTime: '11:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Emma Wilson',
      status: 'Scheduled',
      appointmentScheduled: true,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 8.1,
      psaHistory: [
        { date: '2023-09-05', value: 6.2 },
        { date: '2023-12-05', value: 7.1 },
        { date: '2024-03-05', value: 7.6 },
        { date: '2024-06-05', value: 8.1 }
      ],
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
      surgeryDate: '2025-11-08',
      surgeryTime: '9:30 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. James Brown',
      status: 'Pre-Op',
      appointmentScheduled: true,
      preOpStatus: 'Complete',
      postOpStatus: 'Pending',
      lastPSA: 9.2,
      psaHistory: [
        { date: '2023-10-08', value: 7.5 },
        { date: '2024-01-08', value: 8.3 },
        { date: '2024-04-08', value: 8.8 },
        { date: '2024-07-08', value: 9.2 }
      ],
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
      surgeryDate: '2025-09-18',
      surgeryTime: '1:00 PM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Lisa Davis',
      status: 'Post-Op',
      appointmentScheduled: false,
      preOpStatus: 'Complete',
      postOpStatus: 'Complete',
      lastPSA: 0.05,
      psaHistory: [
        { date: '2023-07-18', value: 6.8 },
        { date: '2023-10-18', value: 7.4 },
        { date: '2024-01-18', value: 8.1 },
        { date: '2024-04-18', value: 0.05 }
      ],
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
      surgeryDate: '2025-11-12',
      surgeryTime: '10:00 AM',
      surgeryType: 'RALP',
      assignedSurgeon: 'Dr. Michael Chen',
      status: 'Scheduled',
      appointmentScheduled: true,
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 7.8,
      psaHistory: [
        { date: '2023-08-12', value: 5.9 },
        { date: '2023-11-12', value: 6.6 },
        { date: '2024-02-12', value: 7.2 },
        { date: '2024-05-12', value: 7.8 }
      ],
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

  // Available doctors list
  const availableDoctors = [
    'Dr. Michael Chen',
    'Dr. Sarah Wilson',
    'Dr. Emma Wilson',
    'Dr. James Brown',
    'Dr. Lisa Davis'
  ];

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
    
    const doctorMatch = selectedDoctor === 'All Doctors' || 
      patient.assignedSurgeon === selectedDoctor;
    
    return searchMatch && statusMatch && doctorMatch;
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
    const patient = mockSurgicalPatients.find(p => p.id === patientId);
    setSelectedPatientForDetails(patient);
    setIsNursePatientDetailsModalOpen(true);
  };

  const handleCloseNursePatientDetailsModal = () => {
    setIsNursePatientDetailsModalOpen(false);
    setSelectedPatientForDetails(null);
  };

  const handleBookAppointment = (patient) => {
    setSelectedPatientForAppointment(patient);
    
    // Convert surgery time format (e.g., "8:00 AM" to "08:00")
    let formattedTime = '';
    if (patient.surgeryTime) {
      // Convert "8:00 AM" format to "08:00" format
      const timeMatch = patient.surgeryTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3].toUpperCase();
        
        if (ampm === 'PM' && hours !== 12) {
          hours += 12;
        } else if (ampm === 'AM' && hours === 12) {
          hours = 0;
        }
        
        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
    }
    
    // Pre-populate form with existing surgery details if available
    setScheduleForm({
      date: patient.surgeryDate || '',
      time: formattedTime || '',
      type: patient.surgeryType || 'surgery',
      doctor: patient.assignedSurgeon || '',
      notes: patient.notes || ''
    });
    
    setIsBookAppointmentModalOpen(true);
  };

  const handleAppointmentBooked = (appointmentData) => {
    console.log('Surgery details updated:', appointmentData);
    // Here you would typically update the patient's status in your state management
    // For now, we'll just close the modal and show a success message
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
    alert('Surgery details updated successfully!');
  };

  const handleCloseAppointmentModal = () => {
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
    setScheduleForm({
      date: '',
      time: '',
      type: 'surgery',
      doctor: '',
      notes: ''
    });
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

        {/* Search Bar and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
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
            
            {/* Doctor Filter */}
            <div className="relative">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400 bg-white min-w-[180px] appearance-none cursor-pointer"
              >
                <option value="All Doctors">All Doctors</option>
                {availableDoctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
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
                            <span>Edit Appointment</span>
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
                    setSelectedDoctor('All Doctors');
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

      {/* Edit Surgery Details Modal */}
      {isBookAppointmentModalOpen && selectedPatientForAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[110] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Edit Surgery Details</h3>
                    <p className="text-sm text-gray-600 mt-1">Update surgery information for {selectedPatientForAppointment.patientName}</p>
                  </div>
                  <button
                    onClick={handleCloseAppointmentModal}
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
                            {selectedPatientForAppointment.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedPatientForAppointment.patientName}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">UPI: {selectedPatientForAppointment.upi}</span>
                          <span className="text-sm text-gray-600">Age: {selectedPatientForAppointment.age} years</span>
                          <span className="text-sm text-gray-600">PSA: {selectedPatientForAppointment.lastPSA} ng/mL</span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${getRiskColor(selectedPatientForAppointment.riskCategory)}`}>
                            {selectedPatientForAppointment.riskCategory}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Surgery Details Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Surgery Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Surgery Type *</label>
                        <select
                          value={scheduleForm.type}
                          onChange={(e) => setScheduleForm(prev => ({...prev, type: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                          <option value="surgery">RALP (Robotic Assisted Laparoscopic Prostatectomy)</option>
                          <option value="open_surgery">Open Radical Prostatectomy</option>
                          <option value="laparoscopic">Laparoscopic Prostatectomy</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Assigned Surgeon *</label>
                        <select
                          value={scheduleForm.doctor}
                          onChange={(e) => setScheduleForm(prev => ({...prev, doctor: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select surgeon...</option>
                          {availableDoctors.map((doctor) => (
                            <option key={doctor} value={doctor}>
                              {doctor}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Surgery Date *</label>
                        <input
                          type="date"
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm(prev => ({...prev, date: e.target.value}))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Notes</label>
                        <textarea
                          value={scheduleForm.notes}
                          onChange={(e) => setScheduleForm(prev => ({...prev, notes: e.target.value}))}
                          rows={4}
                          placeholder="Add any notes or special instructions for this surgery..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: Add any relevant notes, special considerations, or instructions</p>
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Surgery Time *</label>
                      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setScheduleForm(prev => ({...prev, time: time}))}
                            className={`px-3 py-2 text-sm rounded-md border transition-all duration-200 font-medium ${
                              scheduleForm.time === time
                                ? 'bg-green-500 text-white border-green-500 shadow-md transform scale-105'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-green-300 hover:bg-green-50 hover:shadow-sm'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Click on a time slot to select your preferred surgery time</p>
                    </div>
                  </div>

                  {/* Selected Summary */}
                  {scheduleForm.date && scheduleForm.time && scheduleForm.doctor && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <div className="flex items-center mb-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                        <h4 className="text-sm font-semibold text-green-900">Surgery Summary</h4>
                      </div>
                      <div className="text-sm text-green-800 space-y-2">
                        <p><strong>Type:</strong> {scheduleForm.type === 'surgery' ? 'RALP' : scheduleForm.type}</p>
                        <p><strong>Patient:</strong> {selectedPatientForAppointment.patientName}</p>
                        <p><strong>Surgeon:</strong> {scheduleForm.doctor}</p>
                        <p><strong>Date:</strong> {new Date(scheduleForm.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                        <p><strong>Time:</strong> {scheduleForm.time}</p>
                        {scheduleForm.notes && (
                          <div className="mt-3 pt-2 border-t border-green-200">
                            <p><strong>Notes:</strong> {scheduleForm.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.doctor) {
                        alert('Please select date, time, and surgeon');
                        return;
                      }
                      handleAppointmentBooked(scheduleForm);
                    }}
                    disabled={!scheduleForm.date || !scheduleForm.time || !scheduleForm.doctor}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2 inline" />
                    Update Surgery Details
                  </button>
                  <button
                    onClick={handleCloseAppointmentModal}
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

      {/* Nurse Patient Details Modal */}
      <NursePatientDetailsModal
        isOpen={isNursePatientDetailsModalOpen}
        onClose={handleCloseNursePatientDetailsModal}
        patientId={selectedPatientForDetails?.id}
        patientData={selectedPatientForDetails}
        userRole="urology-nurse"
        source="surgicalPathway"
        context="surgicalPathway"
      />
    </div>
  );
};

export default SurgicalPathway;
