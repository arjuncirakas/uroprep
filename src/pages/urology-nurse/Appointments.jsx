import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Search,
  Eye,
  X,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const Appointments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector(state => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list, week, month
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Drag and drop states
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [localAppointments, setLocalAppointments] = useState([]);

  const today = new Date();
  const currentWeek = getWeekDates(today);

  // Initialize local appointments state
  useEffect(() => {
    setLocalAppointments(enhancedUpcomingAppointments);
  }, []);

  // Enhanced dummy data with appointments across multiple dates
  const enhancedUpcomingAppointments = [
    // Today's appointments
    { 
      id: 'APT001', 
      patientName: 'John Smith', 
      upi: 'URP2024001',
      title: 'PSA Follow-up',
      description: '3-month PSA review and consultation',
      time: '9:00 AM', 
      type: 'Follow-up', 
      status: 'Confirmed', 
      phone: '0412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main Street, Melbourne VIC 3000',
      age: 65,
      priority: 'High',
      notes: 'New referral from GP. Patient has elevated PSA levels and requires immediate assessment.',
      duration: 60,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    { 
      id: 'APT002', 
      patientName: 'Michael Brown', 
      upi: 'URP2024002',
      title: 'OPD Assessment',
      description: 'Initial assessment and triage',
      time: '10:30 AM', 
      type: 'OPD', 
      status: 'Pending', 
      phone: '0412 345 679',
      email: 'michael.brown@email.com',
      address: '456 Oak Avenue, Sydney NSW 2000',
      age: 58,
      priority: 'Normal',
      notes: 'PSA monitoring. Patient responding well to treatment.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 102'
    },
    { 
      id: 'APT003', 
      patientName: 'David Wilson', 
      upi: 'URP2024003',
      title: 'Pre-op Consultation',
      description: 'Pre-operative assessment and planning',
      time: '2:00 PM', 
      type: 'Surgery', 
      status: 'Confirmed', 
      phone: '0412 345 680',
      email: 'david.wilson@email.com',
      address: '789 Pine Road, Brisbane QLD 4000',
      age: 71,
      priority: 'High',
      notes: 'RALP scheduled next week. Pre-operative assessment required.',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 103'
    },
    { 
      id: 'APT004', 
      patientName: 'Robert Davis', 
      upi: 'URP2024004',
      title: 'PSA Review',
      description: '6-month PSA monitoring',
      time: '3:30 PM', 
      type: 'Surveillance', 
      status: 'Confirmed', 
      phone: '0412 345 681',
      email: 'robert.davis@email.com',
      address: '321 Elm Street, Perth WA 6000',
      age: 62,
      priority: 'Normal',
      notes: 'Post-surgery follow-up. Excellent recovery progress.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 101'
    },
    { 
      id: 'APT005', 
      patientName: 'James Anderson', 
      upi: 'URP2024005',
      title: 'Surveillance Check',
      description: 'Active surveillance monitoring',
      time: '4:00 PM', 
      type: 'Surveillance', 
      status: 'Scheduled', 
      phone: '0412 345 682',
      email: 'james.anderson@email.com',
      address: '654 Maple Drive, Adelaide SA 5000',
      age: 55,
      priority: 'Normal',
      notes: 'Active surveillance patient. Regular monitoring required.',
      duration: 30,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 102'
    },
    { 
      id: 'APT006', 
      patientName: 'William Thompson', 
      upi: 'URP2024006',
      title: 'Post-op Follow-up',
      description: 'Post-operative assessment',
      time: '4:30 PM', 
      type: 'Follow-up', 
      status: 'Pending', 
      phone: '0412 345 683',
      email: 'william.thompson@email.com',
      address: '987 Cedar Lane, Hobart TAS 7000',
      age: 68,
      priority: 'High',
      notes: 'Urgent review required. Patient experiencing complications.',
      duration: 45,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 103'
    },
    
    // Tomorrow's appointments (more appointments to demonstrate scrolling)
    { 
      id: 'APT007', 
      patientName: 'Christopher Lee', 
      upi: 'URP2024007',
      title: 'Initial Consultation',
      description: 'First-time patient assessment',
      time: '8:30 AM', 
      type: 'OPD', 
      status: 'Confirmed', 
      phone: '0412 345 684',
      email: 'christopher.lee@email.com',
      address: '111 Collins Street, Melbourne VIC 3000',
      age: 52,
      priority: 'Normal',
      notes: 'New patient referral. Elevated PSA detected during routine screening.',
      duration: 45,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    { 
      id: 'APT008', 
      patientName: 'Mark Taylor', 
      upi: 'URP2024008',
      title: 'PSA Monitoring',
      description: 'Regular PSA level check',
      time: '10:00 AM', 
      type: 'Surveillance', 
      status: 'Confirmed', 
      phone: '0412 345 685',
      email: 'mark.taylor@email.com',
      address: '222 Bourke Street, Melbourne VIC 3000',
      age: 60,
      priority: 'Normal',
      notes: 'Stable PSA levels. Continue monitoring.',
      duration: 30,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 102'
    },
    { 
      id: 'APT009', 
      patientName: 'Steven White', 
      upi: 'URP2024009',
      title: 'Surgical Consultation',
      description: 'Discussion of surgical options',
      time: '11:30 AM', 
      type: 'Surgery', 
      status: 'Confirmed', 
      phone: '0412 345 686',
      email: 'steven.white@email.com',
      address: '333 Swanston Street, Melbourne VIC 3000',
      age: 67,
      priority: 'High',
      notes: 'Patient considering RALP. Detailed discussion required.',
      duration: 60,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 103'
    },
    { 
      id: 'APT010', 
      patientName: 'Kevin Martinez', 
      upi: 'URP2024010',
      title: 'Follow-up Visit',
      description: 'Post-treatment follow-up',
      time: '2:00 PM', 
      type: 'Follow-up', 
      status: 'Scheduled', 
      phone: '0412 345 687',
      email: 'kevin.martinez@email.com',
      address: '444 Flinders Street, Melbourne VIC 3000',
      age: 59,
      priority: 'Normal',
      notes: '6-month post-treatment follow-up. Good recovery.',
      duration: 30,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 101'
    },
    { 
      id: 'APT023', 
      patientName: 'Andrew Scott', 
      upi: 'URP2024023',
      title: 'PSA Review',
      description: '3-month PSA monitoring',
      time: '3:00 PM', 
      type: 'Follow-up', 
      status: 'Confirmed', 
      phone: '0412 345 700',
      email: 'andrew.scott@email.com',
      address: '555 Collins Street, Melbourne VIC 3000',
      age: 61,
      priority: 'Normal',
      notes: 'Regular PSA monitoring. Levels stable.',
      duration: 30,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 102'
    },
    { 
      id: 'APT024', 
      patientName: 'Matthew Green', 
      upi: 'URP2024024',
      title: 'OPD Assessment',
      description: 'Comprehensive urological evaluation',
      time: '4:00 PM', 
      type: 'OPD', 
      status: 'Confirmed', 
      phone: '0412 345 701',
      email: 'matthew.green@email.com',
      address: '666 Bourke Street, Melbourne VIC 3000',
      age: 58,
      priority: 'Normal',
      notes: 'New patient with urinary symptoms.',
      duration: 45,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 103'
    },
    { 
      id: 'APT025', 
      patientName: 'Ryan Murphy', 
      upi: 'URP2024025',
      title: 'Surveillance Check',
      description: 'Active surveillance monitoring',
      time: '4:30 PM', 
      type: 'Surveillance', 
      status: 'Confirmed', 
      phone: '0412 345 702',
      email: 'ryan.murphy@email.com',
      address: '777 Swanston Street, Melbourne VIC 3000',
      age: 55,
      priority: 'Normal',
      notes: 'Low-risk prostate cancer. Continue surveillance.',
      duration: 30,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    
    // Day after tomorrow
    { 
      id: 'APT011', 
      patientName: 'Richard Garcia', 
      upi: 'URP2024011',
      title: 'OPD Assessment',
      description: 'Comprehensive urological assessment',
      time: '9:15 AM', 
      type: 'OPD', 
      status: 'Confirmed', 
      phone: '0412 345 688',
      email: 'richard.garcia@email.com',
      address: '555 Elizabeth Street, Melbourne VIC 3000',
      age: 64,
      priority: 'High',
      notes: 'Complex case. Multiple symptoms requiring thorough evaluation.',
      duration: 60,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    { 
      id: 'APT012', 
      patientName: 'Thomas Rodriguez', 
      upi: 'URP2024012',
      title: 'Active Surveillance',
      description: 'Regular monitoring appointment',
      time: '10:45 AM', 
      type: 'Surveillance', 
      status: 'Confirmed', 
      phone: '0412 345 689',
      email: 'thomas.rodriguez@email.com',
      address: '666 King Street, Melbourne VIC 3000',
      age: 57,
      priority: 'Normal',
      notes: 'Low-risk prostate cancer. Active surveillance protocol.',
      duration: 30,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 102'
    },
    { 
      id: 'APT013', 
      patientName: 'Daniel Lopez', 
      upi: 'URP2024013',
      title: 'Pre-operative Assessment',
      description: 'Final pre-surgery evaluation',
      time: '1:30 PM', 
      type: 'Surgery', 
      status: 'Confirmed', 
      phone: '0412 345 690',
      email: 'daniel.lopez@email.com',
      address: '777 Little Collins Street, Melbourne VIC 3000',
      age: 69,
      priority: 'High',
      notes: 'RALP scheduled for next week. Final assessment required.',
      duration: 45,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 103'
    },
    
    // Next week appointments
    { 
      id: 'APT014', 
      patientName: 'Anthony Wilson', 
      upi: 'URP2024014',
      title: 'PSA Review',
      description: '3-month PSA monitoring',
      time: '8:00 AM', 
      type: 'Follow-up', 
      status: 'Scheduled', 
      phone: '0412 345 691',
      email: 'anthony.wilson@email.com',
      address: '888 Collins Street, Melbourne VIC 3000',
      age: 61,
      priority: 'Normal',
      notes: 'Regular PSA monitoring. Levels stable.',
      duration: 30,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 101'
    },
    { 
      id: 'APT015', 
      patientName: 'Paul Anderson', 
      upi: 'URP2024015',
      title: 'New Patient Consultation',
      description: 'Initial urological consultation',
      time: '9:30 AM', 
      type: 'OPD', 
      status: 'Confirmed', 
      phone: '0412 345 692',
      email: 'paul.anderson@email.com',
      address: '999 Bourke Street, Melbourne VIC 3000',
      age: 55,
      priority: 'Normal',
      notes: 'New referral from GP. Elevated PSA levels.',
      duration: 45,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 102'
    },
    { 
      id: 'APT016', 
      patientName: 'George Thomas', 
      upi: 'URP2024016',
      title: 'Surveillance Check',
      description: 'Active surveillance monitoring',
      time: '11:00 AM', 
      type: 'Surveillance', 
      status: 'Confirmed', 
      phone: '0412 345 693',
      email: 'george.thomas@email.com',
      address: '1010 Swanston Street, Melbourne VIC 3000',
      age: 58,
      priority: 'Normal',
      notes: 'Low-risk prostate cancer. Continue surveillance.',
      duration: 30,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 103'
    },
    { 
      id: 'APT017', 
      patientName: 'Kenneth Jackson', 
      upi: 'URP2024017',
      title: 'Post-op Follow-up',
      description: 'Post-operative assessment',
      time: '2:15 PM', 
      type: 'Follow-up', 
      status: 'Confirmed', 
      phone: '0412 345 694',
      email: 'kenneth.jackson@email.com',
      address: '1111 Flinders Street, Melbourne VIC 3000',
      age: 66,
      priority: 'High',
      notes: 'Post-RALP follow-up. Monitor recovery progress.',
      duration: 45,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 101'
    },
    
    // Two weeks from now
    { 
      id: 'APT018', 
      patientName: 'Brian Harris', 
      upi: 'URP2024018',
      title: 'PSA Monitoring',
      description: 'Regular PSA level check',
      time: '8:30 AM', 
      type: 'Surveillance', 
      status: 'Scheduled', 
      phone: '0412 345 695',
      email: 'brian.harris@email.com',
      address: '1212 Elizabeth Street, Melbourne VIC 3000',
      age: 63,
      priority: 'Normal',
      notes: 'Stable PSA levels. Continue monitoring.',
      duration: 30,
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 102'
    },
    { 
      id: 'APT019', 
      patientName: 'Edward Clark', 
      upi: 'URP2024019',
      title: 'Surgical Consultation',
      description: 'Discussion of treatment options',
      time: '10:00 AM', 
      type: 'Surgery', 
      status: 'Confirmed', 
      phone: '0412 345 696',
      email: 'edward.clark@email.com',
      address: '1313 King Street, Melbourne VIC 3000',
      age: 70,
      priority: 'High',
      notes: 'High-risk prostate cancer. Surgical options discussion.',
      duration: 60,
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 103'
    },
    { 
      id: 'APT020', 
      patientName: 'Ronald Lewis', 
      upi: 'URP2024020',
      title: 'OPD Assessment',
      description: 'Comprehensive urological evaluation',
      time: '11:30 AM', 
      type: 'OPD', 
      status: 'Confirmed', 
      phone: '0412 345 697',
      email: 'ronald.lewis@email.com',
      address: '1414 Little Collins Street, Melbourne VIC 3000',
      age: 56,
      priority: 'Normal',
      notes: 'New patient with urinary symptoms.',
      duration: 45,
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 101'
    },
    
    // Previous week appointments (for calendar context)
    { 
      id: 'APT021', 
      patientName: 'Timothy Walker', 
      upi: 'URP2024021',
      title: 'Follow-up Visit',
      description: 'Post-treatment follow-up',
      time: '9:00 AM', 
      type: 'Follow-up', 
      status: 'Completed', 
      phone: '0412 345 698',
      email: 'timothy.walker@email.com',
      address: '1515 Collins Street, Melbourne VIC 3000',
      age: 62,
      priority: 'Normal',
      notes: 'Completed appointment. Good progress.',
      duration: 30,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Sarah Johnson',
      room: 'Room 102'
    },
    { 
      id: 'APT022', 
      patientName: 'Jason Hall', 
      upi: 'URP2024022',
      title: 'PSA Review',
      description: '6-month PSA monitoring',
      time: '10:30 AM', 
      type: 'Surveillance', 
      status: 'Completed', 
      phone: '0412 345 699',
      email: 'jason.hall@email.com',
      address: '1616 Bourke Street, Melbourne VIC 3000',
      age: 59,
      priority: 'Normal',
      notes: 'Completed appointment. PSA levels stable.',
      duration: 30,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: 'Dr. Michael Chen',
      room: 'Room 103'
    }
  ];



  function getWeekDates(date) {
    const week = [];
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Follow-up': return 'bg-blue-100 text-blue-800';
      case 'OPD': return 'bg-purple-100 text-purple-800';
      case 'Surgery': return 'bg-red-100 text-red-800';
      case 'Surveillance': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'First Consultation': return User;
      case 'Follow-up': return Stethoscope;
      case 'Pre-op Assessment': return Heart;
      case 'PSA Review': return Activity;
      case 'Surveillance': return TrendingUp;
      case 'Consultation': return User;
      default: return Calendar;
    }
  };

  // Filter appointments based on active filter and search term
  const filteredAppointments = localAppointments.filter(appointment => {
    // Status filter
    const filterMatch = 
      (activeFilter === 'Today' && appointment.date === selectedDate) ||
      (activeFilter === 'Follow-ups' && (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') && appointment.date === selectedDate) ||
      (activeFilter === 'OPD Consultations' && appointment.type === 'OPD' && appointment.date === selectedDate) ||
      (activeFilter === 'Surgeries' && appointment.type === 'Surgery' && appointment.date === selectedDate);
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return filterMatch && searchMatch;
  });

  const handleAppointmentSelect = (appointment) => {
    navigate(`/urology-nurse/appointment-details/${appointment.id}`);
  };

  // Drag and drop handlers
  const handleDragStart = (e, appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedAppointment(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e, date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverDate(null);
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    setDragOverDate(null);
    
    if (draggedAppointment && targetDate) {
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const originalDateStr = draggedAppointment.date;
      
      // Don't allow dropping on the same date
      if (targetDateStr === originalDateStr) {
        return;
      }
      
      // Show confirmation modal
      setRescheduleData({
        appointment: draggedAppointment,
        originalDate: originalDateStr,
        newDate: targetDateStr,
        newDateFormatted: targetDate.toLocaleDateString('en-AU')
      });
      setShowRescheduleModal(true);
    }
  };

  // Reschedule confirmation
  const confirmReschedule = () => {
    if (rescheduleData) {
      // Update the appointment date in the local state
      const updatedAppointments = localAppointments.map(apt => 
        apt.id === rescheduleData.appointment.id 
          ? { ...apt, date: rescheduleData.newDate }
          : apt
      );
      
      setLocalAppointments(updatedAppointments);
      
      // Here you would typically dispatch an action to update the Redux store
      // dispatch(updateAppointment(rescheduleData.appointment.id, { date: rescheduleData.newDate }));
      
      console.log(`Rescheduled appointment ${rescheduleData.appointment.id} from ${rescheduleData.originalDate} to ${rescheduleData.newDate}`);
      
      // Close modal and reset states
      setShowRescheduleModal(false);
      setRescheduleData(null);
      setDraggedAppointment(null);
    }
  };

  const cancelReschedule = () => {
    setShowRescheduleModal(false);
    setRescheduleData(null);
    setDraggedAppointment(null);
  };



  const renderFiltersAndControls = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Appointments Management</h2>
            <p className="text-sm text-gray-600 mt-1">Central calendar to manage schedules - OPD consultations, investigations, surgeries, follow-ups</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="Calendar View"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-4">
        <nav className="flex space-x-2" aria-label="Tabs">
          {['Today', 'OPD Consultations', 'Surgeries', 'Follow-ups'].map((filter) => (
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
                  {localAppointments.filter(appointment => {
                     switch (filter) {
                       case 'Today': return appointment.date === selectedDate;
                       case 'OPD Consultations': return appointment.type === 'OPD' && appointment.date === selectedDate;
                       case 'Surgeries': return appointment.type === 'Surgery' && appointment.date === selectedDate;
                       case 'Follow-ups': return (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') && appointment.date === selectedDate;
                       default: return true;
                     }
                   }).length}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, UPI, or appointment type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/urology-nurse/book-appointment')}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarView = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const calendarDays = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      calendarDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const getAppointmentsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return localAppointments.filter(apt => apt.date === dateStr);
    };
    
    const navigateMonth = (direction) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
    };
    
    return (
      <div className="p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Today
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const dayAppointments = getAppointmentsForDate(day);
            const isDragOver = dragOverDate && dragOverDate.toDateString() === day.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] max-h-[200px] p-2 border border-gray-200 rounded-lg transition-all duration-200 flex flex-col ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-green-500' : ''} ${
                  isDragOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-medium mb-2 flex-shrink-0 ${
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                } ${isToday ? 'text-green-600' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {dayAppointments.map(appointment => (
                    <div
                      key={appointment.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, appointment)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleAppointmentSelect(appointment)}
                      className={`text-xs p-1 rounded cursor-move transition-all duration-200 flex-shrink-0 ${
                        appointment.type === 'OPD' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        appointment.type === 'Surgery' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                        appointment.type === 'Follow-up' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        appointment.type === 'Surveillance' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } hover:shadow-md hover:scale-105`}
                      title="Drag to reschedule"
                    >
                      <div className="font-medium flex items-center justify-between">
                        <span>{appointment.time}</span>
                        <span className="text-xs opacity-60">⋮⋮</span>
                      </div>
                      <div className="truncate">{appointment.patientName}</div>
                    </div>
                  ))}
                  {dayAppointments.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-2">
                      No appointments
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAppointmentsList = () => (
    <div className="overflow-x-auto">
      {filteredAppointments.length > 0 ? (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[150px]">Appointment</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date & Time</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment, index) => (
              <tr key={appointment.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="py-5 px-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold text-sm">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {appointment.priority === 'High' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-500">UPI: {appointment.upi}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <p className="font-medium text-gray-900">{appointment.title}</p>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(appointment.date)}</p>
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(appointment.type)}`}>
                    {appointment.type}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleAppointmentSelect(appointment)}
                      className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      <span>View Details</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No appointments found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {activeFilter === 'Today' 
              ? `No appointments scheduled for ${formatDate(selectedDate)}.`
              : `No ${activeFilter.toLowerCase()} appointments scheduled for ${formatDate(selectedDate)}.`
            }
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Go to Today
            </button>
            <button
              onClick={() => setActiveFilter('Today')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              View All Today
            </button>
          </div>
        </div>
      )}
    </div>
  );


  return (
    <div className="space-y-6">
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-1">Central calendar to manage schedules - OPD consultations, investigations, surgeries, follow-ups</p>
      </div>

      {renderFiltersAndControls()}
      
      {/* Appointments Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === 'list' && (
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Appointments List</h2>
                <p className="text-sm text-gray-600 mt-1">All scheduled appointments and consultations</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>
          </div>
        )}
        {viewMode === 'calendar' ? renderCalendarView() : renderAppointmentsList()}
        
        {/* Pagination - Only show for list view */}
        {viewMode === 'list' && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>Showing {filteredAppointments.length} of {localAppointments.length} appointments</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-transparent rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reschedule Confirmation Modal */}
      {showRescheduleModal && rescheduleData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
                  <p className="text-sm text-gray-600">Confirm the appointment rescheduling</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {rescheduleData.appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{rescheduleData.appointment.patientName}</h4>
                      <p className="text-sm text-gray-600">UPI: {rescheduleData.appointment.upi}</p>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Appointment Type:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(rescheduleData.appointment.type)}`}>
                      {rescheduleData.appointment.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Current Date:</span>
                    <span className="text-sm text-gray-900">{formatDate(rescheduleData.originalDate)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">New Date:</span>
                    <span className="text-sm font-semibold text-blue-600">{rescheduleData.newDateFormatted}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Time:</span>
                    <span className="text-sm text-gray-900">{rescheduleData.appointment.time}</span>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Rescheduling this appointment will update the patient's schedule. 
                        Please ensure the new date and time are appropriate for the patient's care plan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={cancelReschedule}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReschedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Reschedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Appointments;