import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Eye,
  Calendar,
  X,
  RefreshCw
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';
import PatientDetailsModal from '../../components/modals/PatientDetailsModal';

const OPDManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Waiting for Scheduling');
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);

  // Mock OPD queue data
  const mockOPDQueue = [
    {
      id: 'OPD001',
      patientName: 'John Smith',
      upi: 'URP2024001',
      age: 65,
      gender: 'Male',
      phone: '+61 412 345 678',
      referralSource: 'GP',
      latestPSA: 8.5,
      appointmentDate: '2024-01-15',
      appointmentTime: '9:00 AM',
      status: 'Waiting for Scheduling',
      waitTime: '15 minutes',
      priority: 'High',
      reason: 'Elevated PSA with abnormal DRE',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Urgent review required'
    },
    {
      id: 'OPD002',
      patientName: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      referralSource: 'GP',
      latestPSA: 6.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30 AM',
      status: 'Scheduled Doctor Appointment',
      waitTime: '0 minutes',
      priority: 'Urgent',
      reason: 'Suspicious MRI findings',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'MRI shows PIRADS 4 lesion'
    },
    {
      id: 'OPD003',
      patientName: 'Robert Brown',
      upi: 'URP2024007',
      age: 58,
      gender: 'Male',
      phone: '+61 423 456 789',
      referralSource: 'IPD',
      latestPSA: 5.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '11:00 AM',
      status: 'Waiting for Secondary Appointment',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Family history of prostate cancer',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Awaiting biopsy results'
    },
    {
      id: 'OPD004',
      patientName: 'David Wilson',
      upi: 'URP2024008',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      referralSource: 'GP',
      latestPSA: 4.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '2:00 PM',
      status: 'Waiting for Scheduling',
      waitTime: '5 minutes',
      priority: 'Normal',
      reason: 'Routine PSA monitoring',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Stable PSA levels'
    },
    {
      id: 'OPD005',
      patientName: 'Michael Thompson',
      upi: 'URP2024009',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      referralSource: 'GP',
      latestPSA: 7.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '2:30 PM',
      status: 'Waiting for Scheduling',
      waitTime: '10 minutes',
      priority: 'High',
      reason: 'Rising PSA levels',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'PSA increased from 5.8 to 7.2'
    },
    {
      id: 'OPD006',
      patientName: 'William Davis',
      upi: 'URP2024010',
      age: 68,
      gender: 'Male',
      phone: '+61 456 789 123',
      referralSource: 'GP',
      latestPSA: 9.1,
      appointmentDate: '2024-01-15',
      appointmentTime: '3:00 PM',
      status: 'Waiting for Scheduling',
      waitTime: '25 minutes',
      priority: 'Urgent',
      reason: 'High PSA with urinary symptoms',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Patient reports urgency and frequency'
    },
    {
      id: 'OPD007',
      patientName: 'Christopher Lee',
      upi: 'URP2024011',
      age: 59,
      gender: 'Male',
      phone: '+61 467 890 234',
      referralSource: 'IPD',
      latestPSA: 4.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '3:30 PM',
      status: 'Scheduled for Procedure',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Post-surgery follow-up',
      assignedUrologist: 'Dr. James Brown',
      notes: 'RALP performed 6 weeks ago'
    },
    {
      id: 'OPD008',
      patientName: 'Richard Taylor',
      upi: 'URP2024012',
      age: 73,
      gender: 'Male',
      phone: '+61 478 901 345',
      referralSource: 'GP',
      latestPSA: 6.5,
      appointmentDate: '2024-01-15',
      appointmentTime: '4:00 PM',
      status: 'Waiting for Scheduling',
      waitTime: '35 minutes',
      priority: 'High',
      reason: 'Abnormal DRE findings',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'GP noted firm nodule on DRE'
    },
    {
      id: 'OPD009',
      patientName: 'Thomas White',
      upi: 'URP2024013',
      age: 61,
      gender: 'Male',
      phone: '+61 489 012 456',
      referralSource: 'GP',
      latestPSA: 5.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '4:30 PM',
      status: 'Waiting for Secondary Appointment',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Active surveillance monitoring',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Biopsy scheduled for next week'
    },
    {
      id: 'OPD010',
      patientName: 'Mark Johnson',
      upi: 'URP2024014',
      age: 56,
      gender: 'Male',
      phone: '+61 490 123 567',
      referralSource: 'GP',
      latestPSA: 3.9,
      appointmentDate: '2024-01-15',
      appointmentTime: '5:00 PM',
      status: 'Waiting for Scheduling',
      waitTime: '45 minutes',
      priority: 'Normal',
      reason: 'Annual PSA check',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Routine annual follow-up'
    },
    {
      id: 'OPD011',
      patientName: 'Steven Miller',
      upi: 'URP2024015',
      age: 64,
      gender: 'Male',
      phone: '+61 401 234 678',
      referralSource: 'IPD',
      latestPSA: 7.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '5:30 PM',
      status: 'Completed',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Post-biopsy consultation',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Biopsy results: Gleason 7 (3+4)'
    },
    {
      id: 'OPD012',
      patientName: 'Kevin Garcia',
      upi: 'URP2024016',
      age: 52,
      gender: 'Male',
      phone: '+61 412 345 789',
      referralSource: 'GP',
      latestPSA: 4.6,
      appointmentDate: '2024-01-15',
      appointmentTime: '6:00 PM',
      status: 'Waiting for Scheduling',
      waitTime: '55 minutes',
      priority: 'Medium',
      reason: 'Family history screening',
      assignedUrologist: 'Dr. James Brown',
      notes: 'Father had prostate cancer at 65'
    },
    {
      id: 'OPD013',
      patientName: 'Daniel Martinez',
      upi: 'URP2024017',
      age: 69,
      gender: 'Male',
      phone: '+61 423 456 890',
      referralSource: 'GP',
      latestPSA: 8.9,
      appointmentDate: '2024-01-15',
      appointmentTime: '6:30 PM',
      status: 'Scheduled Doctor Appointment',
      waitTime: '0 minutes',
      priority: 'Urgent',
      reason: 'Rapidly rising PSA',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'PSA increased from 6.2 to 8.9 in 3 months'
    },
    {
      id: 'OPD014',
      patientName: 'Paul Rodriguez',
      upi: 'URP2024018',
      age: 57,
      gender: 'Male',
      phone: '+61 434 567 901',
      referralSource: 'IPD',
      latestPSA: 5.1,
      appointmentDate: '2024-01-15',
      appointmentTime: '7:00 PM',
      status: 'Scheduled for Procedure',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Scheduled for RALP next month'
    },
    {
      id: 'OPD015',
      patientName: 'Andrew Lewis',
      upi: 'URP2024019',
      age: 63,
      gender: 'Male',
      phone: '+61 445 678 012',
      referralSource: 'GP',
      latestPSA: 6.3,
      appointmentDate: '2024-01-15',
      appointmentTime: '7:30 PM',
      status: 'Waiting for Scheduling',
      waitTime: '65 minutes',
      priority: 'High',
      reason: 'Urinary retention episodes',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Patient reports 2 episodes of retention'
    },
    // Today's patients
    {
      id: 'OPD016',
      patientName: 'Robert Johnson',
      upi: 'URP2024020',
      age: 67,
      gender: 'Male',
      phone: '+61 456 789 123',
      referralSource: 'GP',
      latestPSA: 7.4,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '9:30 AM',
      status: 'Waiting for Scheduling',
      waitTime: '20 minutes',
      priority: 'High',
      reason: 'Elevated PSA with family history',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Father and brother had prostate cancer'
    },
    {
      id: 'OPD017',
      patientName: 'David Anderson',
      upi: 'URP2024021',
      age: 54,
      gender: 'Male',
      phone: '+61 467 890 234',
      referralSource: 'GP',
      latestPSA: 5.9,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      status: 'In Consultation',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Routine PSA monitoring',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Annual follow-up appointment'
    },
    {
      id: 'OPD018',
      patientName: 'Michael Brown',
      upi: 'URP2024022',
      age: 71,
      gender: 'Male',
      phone: '+61 478 901 345',
      referralSource: 'IPD',
      latestPSA: 8.2,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '11:15 AM',
      status: 'Waiting for Scheduling',
      waitTime: '35 minutes',
      priority: 'Urgent',
      reason: 'High PSA with urinary symptoms',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Patient reports nocturia and urgency'
    },
    {
      id: 'OPD019',
      patientName: 'James Wilson',
      upi: 'URP2024023',
      age: 59,
      gender: 'Male',
      phone: '+61 489 012 456',
      referralSource: 'GP',
      latestPSA: 4.3,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '2:00 PM',
      status: 'Awaiting Results',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Post-biopsy follow-up',
      assignedUrologist: 'Dr. James Brown',
      notes: 'Biopsy performed 2 weeks ago'
    },
    {
      id: 'OPD020',
      patientName: 'William Taylor',
      upi: 'URP2024024',
      age: 66,
      gender: 'Male',
      phone: '+61 490 123 567',
      referralSource: 'GP',
      latestPSA: 6.7,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '3:30 PM',
      status: 'Waiting for Scheduling',
      waitTime: '50 minutes',
      priority: 'High',
      reason: 'Rising PSA trend',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'PSA increased from 4.8 to 6.7 over 6 months'
    },
    // Tomorrow's patients
    {
      id: 'OPD021',
      patientName: 'Christopher Davis',
      upi: 'URP2024025',
      age: 62,
      gender: 'Male',
      phone: '+61 401 234 678',
      referralSource: 'GP',
      latestPSA: 5.5,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '9:00 AM',
      status: 'Waiting for Scheduling',
      waitTime: '0 minutes',
      priority: 'Normal',
      reason: 'Annual PSA screening',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Routine annual check-up'
    },
    {
      id: 'OPD022',
      patientName: 'Richard Miller',
      upi: 'URP2024026',
      age: 68,
      gender: 'Male',
      phone: '+61 412 345 789',
      referralSource: 'IPD',
      latestPSA: 7.9,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '10:30 AM',
      status: 'Awaiting Results',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Awaiting pathology results from biopsy'
    },
    {
      id: 'OPD023',
      patientName: 'Edward Thompson',
      upi: 'URP2024027',
      age: 61,
      gender: 'Male',
      phone: '+61 423 456 890',
      referralSource: 'GP',
      latestPSA: 6.1,
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '2:00 PM',
      status: 'Awaiting Results',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Follow-up consultation',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Awaiting MRI results and lab reports'
    },
    {
      id: 'OPD024',
      patientName: 'George Wilson',
      upi: 'URP2024028',
      age: 55,
      gender: 'Male',
      phone: '+61 434 567 901',
      referralSource: 'GP',
      latestPSA: 5.3,
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '11:00 AM',
      status: 'Scheduled',
      waitTime: '0 minutes',
      priority: 'Normal',
      reason: 'Annual PSA monitoring',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Routine annual check-up scheduled'
    },
    {
      id: 'OPD025',
      patientName: 'Frank Davis',
      upi: 'URP2024029',
      age: 67,
      gender: 'Male',
      phone: '+61 445 678 012',
      referralSource: 'IPD',
      latestPSA: 8.3,
      appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '3:30 PM',
      status: 'Scheduled',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'Scheduled for prostatectomy consultation'
    }
  ];



  const filteredOPDQueue = mockOPDQueue.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedUrologist.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (activeFilter === 'Waiting for Scheduling' && patient.status === 'Waiting for Scheduling') ||
      (activeFilter === 'Scheduled Doctor Appointment' && patient.status === 'Scheduled Doctor Appointment') ||
      (activeFilter === 'Scheduled for Procedure' && patient.status === 'Scheduled for Procedure') ||
      (activeFilter === 'Waiting for Secondary Appointment' && patient.status === 'Waiting for Secondary Appointment') ||
      (activeFilter === 'Awaiting Results' && patient.status === 'Awaiting Results');
    
    return searchMatch && statusMatch;
  });

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

  const handleCloseModal = () => {
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
  };

  const handleViewPatientDetails = (patient) => {
    setSelectedPatientForDetails(patient);
    setIsPatientDetailsModalOpen(true);
  };

  const handleClosePatientDetailsModal = () => {
    setIsPatientDetailsModalOpen(false);
    setSelectedPatientForDetails(null);
  };




  return (
    <div className="space-y-6">
      {/* Page Header with Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OPD Management</h1>
              <p className="text-gray-600 mt-1">Track patients in OPD queue and manage consultation flow</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {['Waiting for Scheduling', 'Scheduled Doctor Appointment', 'Scheduled for Procedure', 'Awaiting Results', 'Waiting for Secondary Appointment'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{filter}</span>
                  <span className={`py-0.5 px-2 rounded-full text-xs font-semibold transition-colors ${
                    activeFilter === filter
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {mockOPDQueue.filter(patient => {
                       switch (filter) {
                         case 'Waiting for Scheduling': return patient.status === 'Waiting for Scheduling';
                         case 'Scheduled Doctor Appointment': return patient.status === 'Scheduled Doctor Appointment';
                         case 'Scheduled for Procedure': return patient.status === 'Scheduled for Procedure';
                         case 'Waiting for Secondary Appointment': return patient.status === 'Waiting for Secondary Appointment';
                         case 'Awaiting Results': return patient.status === 'Awaiting Results';
                         default: return false;
                       }
                     }).length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* OPD Queue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">OPD Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Patients waiting for urologist consultation</p>
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
              placeholder="Search by patient name, UPI, or urologist..."
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
          {filteredOPDQueue.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOPDQueue.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {patient.priority === 'Urgent' && (
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
                        <p className="font-medium text-gray-900">{patient.appointmentTime}</p>
                        <p className="text-sm text-gray-500">{patient.appointmentDate}</p>
                        <p className="text-xs text-gray-400">Source: {patient.referralSource}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewPatientDetails(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        {patient.status === 'Waiting for Scheduling' && (
                          <button 
                            onClick={() => handleBookAppointment(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Book Appointment</span>
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
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients in OPD queue
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients in the OPD queue.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveFilter('Waiting for Scheduling')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Show Waiting Patients
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/appointments')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModalWithPatient
        isOpen={isBookAppointmentModalOpen}
        onClose={handleCloseModal}
        onAppointmentBooked={handleAppointmentBooked}
        selectedPatientData={selectedPatientForAppointment}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={isPatientDetailsModalOpen}
        onClose={handleClosePatientDetailsModal}
        patientId={selectedPatientForDetails?.id}
        userRole="urology-nurse"
      />
    </div>
  );
};

export default OPDManagement;
