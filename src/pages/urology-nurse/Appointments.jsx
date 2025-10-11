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
  Clock,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Stethoscope,
  FileText,
  Trash2
} from 'lucide-react';

const Appointments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector(state => state.appointments);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('calendar'); // week, calendar, daily
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('All Appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Drag and drop states
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [localAppointments, setLocalAppointments] = useState([]);
  
  // Appointment details modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});


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
    // Type filter
    const filterMatch = 
      (activeFilter === 'All Appointments') ||
      (activeFilter === 'Appointment for Investigation' && (appointment.type === 'OPD' || appointment.type === 'Surgery')) ||
      (activeFilter === 'Appointment for Urologist' && (appointment.type === 'Follow-up' || appointment.type === 'Surveillance'));
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return filterMatch && searchMatch;
  });

  const handleAppointmentSelect = (appointment) => {
    setSelectedAppointment(appointment);
    setEditFormData(appointment);
    setShowAppointmentModal(true);
    setIsEditing(false);
  };

  const handleEditAppointment = () => {
    setIsEditing(true);
  };

  const handleSaveAppointment = () => {
    // Update the appointment in local state
    const updatedAppointments = localAppointments.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, ...editFormData }
        : apt
    );
    
    setLocalAppointments(updatedAppointments);
    setSelectedAppointment({ ...selectedAppointment, ...editFormData });
    setIsEditing(false);
    
    // Here you would typically dispatch an action to update the Redux store
    // dispatch(updateAppointment(selectedAppointment.id, editFormData));
  };

  const handleCancelEdit = () => {
    setEditFormData(selectedAppointment);
    setIsEditing(false);
  };

  const handleDeleteAppointment = () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = localAppointments.filter(apt => apt.id !== selectedAppointment.id);
      setLocalAppointments(updatedAppointments);
      setShowAppointmentModal(false);
      setSelectedAppointment(null);
    }
  };


  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

      {/* Filter Tabs */}
      <div className="px-6 py-4">
        <nav className="flex space-x-2" aria-label="Tabs">
          {['All Appointments', 'Appointment for Investigation', 'Appointment for Urologist'].map((filter) => (
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
                       case 'All Appointments': return true;
                       case 'Appointment for Investigation': return (appointment.type === 'OPD' || appointment.type === 'Surgery');
                       case 'Appointment for Urologist': return (appointment.type === 'Follow-up' || appointment.type === 'Surveillance');
                       default: return true;
                     }
                   }).length}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>

    </div>
  );

  const renderWeekView = () => {
    const weekDates = getWeekDates(new Date(selectedDate));
    
    const getAppointmentsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return filteredAppointments.filter(apt => apt.date === dateStr);
    };
    
    return (
      <div className="p-6">
        {/* Week Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 7);
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {weekDates[0].toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} - {weekDates[6].toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 7);
                setSelectedDate(newDate.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'daily' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Daily View"
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'week' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Week View"
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Month View"
            >
              Month
            </button>
          </div>
        </div>

        {/* Color Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">Appointment for Investigation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">Appointment for Urologist</span>
          </div>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
          
          {/* Week Days */}
          {weekDates.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const dayAppointments = getAppointmentsForDate(day);
            const isDragOver = dragOverDate && dragOverDate.toDateString() === day.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[200px] max-h-[400px] p-2 border border-gray-200 rounded-lg transition-all duration-200 flex flex-col ${
                  isToday ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white'
                } ${
                  isDragOver ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                <div className={`text-sm font-medium mb-2 flex-shrink-0 ${
                  isToday ? 'text-green-600' : 'text-gray-900'
                }`}>
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
                        (appointment.type === 'OPD' || appointment.type === 'Surgery') ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') ? 'bg-green-100 text-green-800 hover:bg-green-200' :
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
      return filteredAppointments.filter(apt => apt.date === dateStr);
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
          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'daily' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Daily View"
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'week' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Week View"
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Month View"
            >
              Month
            </button>
          </div>
        </div>
        
        {/* Color Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">Appointment for Investigation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">Appointment for Urologist</span>
          </div>
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
                        (appointment.type === 'OPD' || appointment.type === 'Surgery') ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') ? 'bg-green-100 text-green-800 hover:bg-green-200' :
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

  const renderDailyView = () => {
    const selectedDateObj = new Date(selectedDate);
    const dayAppointments = filteredAppointments.filter(apt => apt.date === selectedDate);
    
    // Sort appointments by time
    const sortedAppointments = dayAppointments.sort((a, b) => {
      const timeA = a.time.replace(/[^\d]/g, '');
      const timeB = b.time.replace(/[^\d]/g, '');
      return timeA.localeCompare(timeB);
    });

    const navigateDay = (direction) => {
      const newDate = new Date(selectedDateObj);
      newDate.setDate(newDate.getDate() + direction);
      setSelectedDate(newDate.toISOString().split('T')[0]);
    };
    
    return (
      <div className="p-6">
        {/* Daily Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDay(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedDateObj.toLocaleDateString('en-AU', { 
                weekday: 'long',
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => navigateDay(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          {/* View Mode Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'daily' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Daily View"
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'week' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Week View"
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar' 
                  ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Month View"
            >
              Month
            </button>
          </div>
        </div>

        {/* Color Legend */}
        <div className="mb-4 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">Appointment for Investigation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm font-medium text-gray-700">Appointment for Urologist</span>
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {sortedAppointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {sortedAppointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  onClick={() => handleAppointmentSelect(appointment)}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Time */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-200">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-900">{appointment.time}</div>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 truncate">
                            {appointment.patientName}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {appointment.upi}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              (appointment.type === 'OPD' || appointment.type === 'Surgery') ? 'bg-blue-500' :
                              (appointment.type === 'Follow-up' || appointment.type === 'Surveillance') ? 'bg-green-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="text-sm font-medium text-gray-700">{appointment.title}</span>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Stethoscope className="h-4 w-4" />
                            <span>{appointment.doctor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.duration} min</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(appointment.priority)}`}>
                        {appointment.priority}
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No appointments scheduled
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                There are no appointments scheduled for {selectedDateObj.toLocaleDateString('en-AU', { 
                  weekday: 'long',
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

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
      

      {renderFiltersAndControls()}
      
      {/* Appointments Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === 'daily' ? renderDailyView() : viewMode === 'week' ? renderWeekView() : renderCalendarView()}
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
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
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

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                    <p className="text-sm text-gray-600">{selectedAppointment.patientName} - {selectedAppointment.upi}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEditAppointment}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAppointment}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowAppointmentModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Patient Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.patientName || ''}
                            onChange={(e) => handleInputChange('patientName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.patientName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPI</label>
                        <p className="text-sm text-gray-900">{selectedAppointment.upi}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editFormData.age || ''}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.age} years</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editFormData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {selectedAppointment.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editFormData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {selectedAppointment.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        {isEditing ? (
                          <textarea
                            value={editFormData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-start">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            {selectedAppointment.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                      Appointment Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.title}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        {isEditing ? (
                          <textarea
                            value={editFormData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          {isEditing ? (
                            <input
                              type="date"
                              value={editFormData.date || ''}
                              onChange={(e) => handleInputChange('date', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900 flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {formatDate(selectedAppointment.date)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          {isEditing ? (
                            <input
                              type="time"
                              value={editFormData.time || ''}
                              onChange={(e) => handleInputChange('time', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900 flex items-center">
                              <ClockIcon className="h-4 w-4 mr-2" />
                              {selectedAppointment.time}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        {isEditing ? (
                          <select
                            value={editFormData.type || ''}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="OPD">OPD</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Surgery">Surgery</option>
                            <option value="Surveillance">Surveillance</option>
                          </select>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {selectedAppointment.type}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editFormData.duration || ''}
                              onChange={(e) => handleInputChange('duration', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{selectedAppointment.duration} minutes</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                          {isEditing ? (
                            <select
                              value={editFormData.priority || ''}
                              onChange={(e) => handleInputChange('priority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="Normal">Normal</option>
                              <option value="High">High</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedAppointment.priority)}`}>
                              {selectedAppointment.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.doctor || ''}
                            onChange={(e) => handleInputChange('doctor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 flex items-center">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            {selectedAppointment.doctor}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editFormData.room || ''}
                            onChange={(e) => handleInputChange('room', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{selectedAppointment.room}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Notes
                    </h4>
                    <div>
                      {isEditing ? (
                        <textarea
                          value={editFormData.notes || ''}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add appointment notes..."
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{selectedAppointment.notes || 'No notes available'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDeleteAppointment}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Appointment
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default Appointments;