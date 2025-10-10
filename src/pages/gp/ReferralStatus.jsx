import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  FileText,
  Search,
  X,
  FileX,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  Phone,
  AlertTriangle
} from 'lucide-react';
import PatientDetailsModal from '../../components/modals/PatientDetailsModal';
import NewReferralModal from '../../components/modals/NewReferralModal';

const ReferralStatus = () => {
  const [activeFilter, setActiveFilter] = useState('Triage Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [hoveredPSA, setHoveredPSA] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Mock referral data - replace with actual API calls
  const mockReferrals = [
    {
      id: 'REF001',
      upi: 'URP2024001',
      patientName: 'John Smith',
      dob: '1965-03-15',
      gender: 'Male',
      referralDate: '2024-01-15',
      status: 'Active Surveillance',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 12,
      nextAction: '6-month PSA review',
      nextAppointment: '2024-07-15',
      latestPSA: 6.2
    },
    {
      id: 'REF002',
      upi: 'URP2024002',
      patientName: 'Mary Johnson',
      dob: '1958-07-22',
      gender: 'Female',
      referralDate: '2024-01-10',
      status: 'Post-Op Follow-up',
      priority: 'High',
      currentDatabase: 'DB4',
      daysSinceReferral: 17,
      nextAction: '3-month follow-up',
      nextAppointment: '2024-04-20',
      latestPSA: 0.1
    },
    {
      id: 'REF003',
      upi: 'URP2024003',
      patientName: 'Robert Brown',
      dob: '1970-11-08',
      referralDate: '2024-01-20',
      status: 'OPD Management',
      priority: 'Routine',
      currentDatabase: 'Queue',
      daysSinceReferral: 7,
      nextAction: 'Initial consultation',
      nextAppointment: null,
      latestPSA: 5.8
    },
    {
      id: 'REF004',
      upi: 'URP2024004',
      patientName: 'David Wilson',
      dob: '1962-05-14',
      gender: 'Male',
      referralDate: '2023-12-05',
      status: 'Discharged',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 52,
      nextAction: 'Annual PSA monitoring',
      nextAppointment: '2024-12-05',
      latestPSA: 3.1
    },
    {
      id: 'REF005',
      upi: 'URP2024005',
      patientName: 'Sarah Davis',
      dob: '1968-09-12',
      referralDate: '2024-01-18',
      status: 'OPD Management',
      priority: 'Medium',
      currentDatabase: 'DB1',
      daysSinceReferral: 9,
      nextAction: 'MDT review',
      nextAppointment: '2024-02-15',
      latestPSA: 8.5
    },
    {
      id: 'REF006',
      upi: 'URP2024006',
      patientName: 'Michael Chen',
      dob: '1972-04-25',
      gender: 'Male',
      referralDate: '2024-01-12',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 15,
      nextAction: 'MDT discussion',
      nextAppointment: '2024-02-10',
      latestPSA: 12.3
    },
    {
      id: 'REF007',
      upi: 'URP2024007',
      patientName: 'Emma Thompson',
      dob: '1955-11-30',
      gender: 'Female',
      referralDate: '2023-12-20',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB4',
      daysSinceReferral: 38,
      nextAction: 'Pre-operative assessment',
      nextAppointment: '2024-02-28',
      latestPSA: 15.7
    },
    {
      id: 'REF008',
      upi: 'URP2024008',
      patientName: 'James Wilson',
      dob: '1963-08-15',
      gender: 'Male',
      referralDate: '2024-01-05',
      status: 'Pending',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 22,
      nextAction: 'PSA monitoring',
      nextAppointment: '2024-02-12',
      latestPSA: 25.3
    },
    {
      id: 'REF009',
      upi: 'URP2024009',
      patientName: 'Lisa Anderson',
      dob: '1971-12-03',
      referralDate: '2024-01-08',
      status: 'Post-Op Follow-up',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 19,
      nextAction: '6-month follow-up',
      nextAppointment: '2024-02-15',
      latestPSA: 18.7
    },
    {
      id: 'REF010',
      upi: 'URP2024010',
      patientName: 'Thomas Miller',
      dob: '1959-04-22',
      gender: 'Male',
      referralDate: '2023-11-15',
      status: 'Discharged',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 68,
      nextAction: 'Returned to GP care',
      nextAppointment: null,
      latestPSA: 2.1,
      dischargeReason: 'PSA levels normalized, no further urology intervention required'
    },
    {
      id: 'REF011',
      upi: 'URP2024011',
      patientName: 'Jennifer Taylor',
      dob: '1967-09-18',
      gender: 'Female',
      referralDate: '2023-10-20',
      status: 'Discharged',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 94,
      nextAction: 'Annual monitoring',
      nextAppointment: null,
      latestPSA: 1.8,
      dischargeReason: 'Patient completed treatment, returned to GP management'
    },
    {
      id: 'REF012',
      upi: 'URP2024012',
      patientName: 'Andrew Mitchell',
      dob: '1964-06-10',
      gender: 'Male',
      referralDate: '2024-01-22',
      status: 'Active Surveillance',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 5,
      nextAction: '3-month PSA monitoring',
      nextAppointment: '2024-04-22',
      latestPSA: 5.1
    },
    {
      id: 'REF013',
      upi: 'URP2024013',
      patientName: 'Patricia Robinson',
      dob: '1969-02-28',
      gender: 'Female',
      referralDate: '2024-01-19',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 8,
      nextAction: 'Surgery scheduled',
      nextAppointment: '2024-02-25',
      latestPSA: 16.8
    },
    {
      id: 'REF014',
      upi: 'URP2024014',
      patientName: 'George Hamilton',
      dob: '1956-11-14',
      referralDate: '2023-12-28',
      status: 'Post-Op Follow-up',
      priority: 'Medium',
      currentDatabase: 'DB4',
      daysSinceReferral: 30,
      nextAction: '3-month post-op review',
      nextAppointment: '2024-03-28',
      latestPSA: 0.3
    },
    {
      id: 'REF015',
      upi: 'URP2024015',
      patientName: 'Barbara Stevens',
      dob: '1973-07-05',
      gender: 'Female',
      referralDate: '2024-01-16',
      status: 'Pending',
      priority: 'High',
      currentDatabase: 'DB2',
      daysSinceReferral: 11,
      nextAction: 'Urgent PSA review',
      nextAppointment: '2024-02-05',
      latestPSA: 22.5
    },
    {
      id: 'REF016',
      upi: 'URP2024016',
      patientName: 'Kevin Martinez',
      dob: '1961-03-20',
      gender: 'Male',
      referralDate: '2023-11-22',
      status: 'Discharged',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 61,
      nextAction: 'GP monitoring',
      nextAppointment: null,
      latestPSA: 2.8,
      dischargeReason: 'Benign prostatic hyperplasia, no malignancy detected'
    },
    {
      id: 'REF017',
      upi: 'URP2024017',
      patientName: 'Nancy Cooper',
      dob: '1968-12-08',
      gender: 'Female',
      referralDate: '2024-01-14',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 13,
      nextAction: 'Pre-operative workup',
      nextAppointment: '2024-02-18',
      latestPSA: 19.2
    },
    {
      id: 'REF018',
      upi: 'URP2024018',
      patientName: 'Ronald Hughes',
      dob: '1957-09-25',
      referralDate: '2023-12-10',
      status: 'Post-Op Follow-up',
      priority: 'Medium',
      currentDatabase: 'DB4',
      daysSinceReferral: 47,
      nextAction: '6-month follow-up',
      nextAppointment: '2024-06-10',
      latestPSA: 0.5
    },
    {
      id: 'REF019',
      upi: 'URP2024019',
      patientName: 'Dorothy Walker',
      dob: '1966-05-17',
      gender: 'Female',
      referralDate: '2024-01-21',
      status: 'Active Surveillance',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 6,
      nextAction: '6-month PSA check',
      nextAppointment: '2024-07-21',
      latestPSA: 4.8
    },
    {
      id: 'REF020',
      upi: 'URP2024020',
      patientName: 'Charles Foster',
      dob: '1971-01-30',
      gender: 'Male',
      referralDate: '2024-01-11',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 16,
      nextAction: 'MDT discussion scheduled',
      nextAppointment: '2024-02-08',
      latestPSA: 14.7
    },
    {
      id: 'REF021',
      upi: 'URP2024021',
      patientName: 'Susan Bennett',
      dob: '1963-08-22',
      gender: 'Female',
      referralDate: '2023-11-05',
      status: 'Discharged',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 78,
      nextAction: 'Annual screening',
      nextAppointment: null,
      latestPSA: 3.2,
      dischargeReason: 'Low-risk patient, stable PSA levels'
    },
    {
      id: 'REF022',
      upi: 'URP2024022',
      patientName: 'Paul Richardson',
      dob: '1960-04-12',
      gender: 'Male',
      referralDate: '2024-01-23',
      status: 'Pending',
      priority: 'High',
      currentDatabase: 'DB2',
      daysSinceReferral: 4,
      nextAction: 'Repeat biopsy',
      nextAppointment: '2024-02-14',
      latestPSA: 28.4
    },
    {
      id: 'REF023',
      upi: 'URP2024023',
      patientName: 'Helen Phillips',
      dob: '1965-10-05',
      referralDate: '2023-12-18',
      status: 'Post-Op Follow-up',
      priority: 'Medium',
      currentDatabase: 'DB4',
      daysSinceReferral: 40,
      nextAction: '6-month follow-up',
      nextAppointment: '2024-03-18',
      latestPSA: 0.2
    },
    {
      id: 'REF024',
      upi: 'URP2024024',
      patientName: 'Edward Campbell',
      dob: '1958-07-28',
      gender: 'Male',
      referralDate: '2024-01-17',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 10,
      nextAction: 'Surgical consultation',
      nextAppointment: '2024-02-22',
      latestPSA: 17.9
    },
    {
      id: 'REF025',
      upi: 'URP2024025',
      patientName: 'Margaret Turner',
      dob: '1972-03-16',
      gender: 'Female',
      referralDate: '2024-01-24',
      status: 'Active Surveillance',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 3,
      nextAction: '3-month PSA review',
      nextAppointment: '2024-04-24',
      latestPSA: 6.7
    },
    {
      id: 'REF026',
      upi: 'URP2024026',
      patientName: 'Brian Morrison',
      dob: '1967-11-09',
      gender: 'Male',
      referralDate: '2023-10-15',
      status: 'Discharged',
      priority: 'Low',
      currentDatabase: 'Discharged',
      daysSinceReferral: 99,
      nextAction: 'Discharged to GP care',
      nextAppointment: null,
      latestPSA: 2.5,
      dischargeReason: 'Watchful waiting completed, no intervention required'
    },
    {
      id: 'REF027',
      upi: 'URP2024027',
      patientName: 'Carol Edwards',
      dob: '1969-06-23',
      referralDate: '2024-01-13',
      status: 'Post-Op Follow-up',
      priority: 'High',
      currentDatabase: 'DB4',
      daysSinceReferral: 14,
      nextAction: 'Early post-op review',
      nextAppointment: '2024-02-13',
      latestPSA: 0.9
    },
    {
      id: 'REF028',
      upi: 'URP2024028',
      patientName: 'Frank Wright',
      dob: '1962-02-14',
      gender: 'Male',
      referralDate: '2024-01-20',
      status: 'Active Surveillance',
      priority: 'Medium',
      currentDatabase: 'DB2',
      daysSinceReferral: 7,
      nextAction: '12-month PSA review',
      nextAppointment: '2024-07-20',
      latestPSA: 5.9
    },
    {
      id: 'REF029',
      upi: 'URP2024029',
      patientName: 'Betty Parker',
      dob: '1964-09-19',
      gender: 'Female',
      referralDate: '2024-01-09',
      status: 'Surgical Pathway',
      priority: 'High',
      currentDatabase: 'DB3',
      daysSinceReferral: 18,
      nextAction: 'Surgery prep',
      nextAppointment: '2024-03-05',
      latestPSA: 13.8
    },
    {
      id: 'REF030',
      upi: 'URP2024030',
      patientName: 'Gregory Bell',
      dob: '1970-12-27',
      referralDate: '2023-12-01',
      status: 'Post-Op Follow-up',
      priority: 'Medium',
      currentDatabase: 'DB4',
      daysSinceReferral: 56,
      nextAction: 'Annual review',
      nextAppointment: '2024-12-01',
      latestPSA: 0.4
    }
  ];

  const filters = ['Triage Pending', 'Active Monitoring', 'Surgical Pathway', 'Post-Op Follow-up', 'Discharged'];

  // Filter referrals by status and search query
  const filteredReferrals = mockReferrals.filter(ref => {
    // Exclude OPD Management referrals completely for GP view
    if (ref.status === 'OPD Management') {
      return false;
    }
    
    // Status filter
    let statusMatch;
    if (activeFilter === 'Triage Pending') {
      // Triage Pending includes referrals with 'Pending' status
      statusMatch = ref.status === 'Pending';
    } else if (activeFilter === 'Active Monitoring') {
      // Active Monitoring includes referrals with 'Active Surveillance' status
      statusMatch = ref.status === 'Active Surveillance';
    } else {
      statusMatch = ref.status === activeFilter;
    }
    
    // Search filter
    const searchMatch = searchQuery === '' || 
      ref.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.upi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReferrals = filteredReferrals.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Clear session storage when component mounts to ensure clean state
  useEffect(() => {
    sessionStorage.removeItem('lastVisitedPage');
  }, []);

  // Function to handle opening patient details modal
  const handleViewPatientDetails = (upi) => {
    setSelectedPatientId(upi);
    setShowPatientModal(true);
  };

  // Function to handle closing patient details modal
  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatientId(null);
  };

  // Close dropdown when clicking outside and prevent background scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    // Prevent background scrolling when dropdown is open
    if (showDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showDropdown]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Function to format wait time with highlighting for urgent cases
  const formatWaitTime = (days, status) => {
    // Only show wait time for Triage Pending (which maps to 'Pending' status)
    if (status !== 'Pending') {
      return {
        text: null,
        isUrgent: false,
        className: ''
      };
    }
    
    if (days > 10) {
      return {
        text: `${days} days - URGENT`,
        isUrgent: true,
        className: 'text-red-600 font-medium'
      };
    } else if (days > 7) {
      return {
        text: `${days} days - Review needed`,
        isUrgent: false,
        className: 'text-amber-600 font-medium'
      };
    } else {
      return {
        text: `${days} days ago`,
        isUrgent: false,
        className: 'text-gray-400'
      };
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case 'OPD Management': return 'bg-amber-100 text-amber-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Active Surveillance': return 'bg-cyan-100 text-cyan-800';
      case 'Surgical Pathway': return 'bg-red-100 text-red-800';
      case 'Post-Op Follow-up': return 'bg-green-100 text-green-800';
      case 'Discharged': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Routine': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // PSA baseline values for tooltip
  const getPSABaselineInfo = (gender) => {
    if (gender === 'Male') {
      return {
        normal: '0-4.0 ng/mL',
        borderline: '4.0-10.0 ng/mL', 
        elevated: '>10.0 ng/mL',
        description: 'Male PSA Reference Ranges:'
      };
    } else if (gender === 'Female') {
      return {
        normal: '0-0.5 ng/mL',
        borderline: '0.5-1.0 ng/mL',
        elevated: '>1.0 ng/mL', 
        description: 'Female PSA Reference Ranges:'
      };
    }
    return null;
  };

  // Handle PSA hover for tooltip positioning
  const handlePSAHover = (event, referral) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredPSA(referral);
  };

  const handlePSALeave = () => {
    setHoveredPSA(null);
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referral Status Tracker</h1>
      </div>
      
      {/* Search Bar and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UPI, or referral ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              ⌘K
            </div>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowNewReferralModal(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-medium">New Referral</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">All Referrals ({mockReferrals.filter(ref => ref.status !== 'OPD Management').length})</h2>
            <p className="text-sm text-gray-600">Track your latest patient referrals and their status</p>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              let count;
              if (filter === 'Triage Pending') {
                // Triage Pending includes referrals with 'Pending' status
                count = mockReferrals.filter(ref => ref.status === 'Pending').length;
              } else if (filter === 'Active Monitoring') {
                // Active Monitoring includes referrals with 'Active Surveillance' status
                count = mockReferrals.filter(ref => ref.status === 'Active Surveillance').length;
              } else {
                // Exclude OPD Management from all counts
                count = mockReferrals.filter(ref => ref.status === filter && ref.status !== 'OPD Management').length;
              }
              
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <span>{filter}</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeFilter === filter
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Search Results Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {activeFilter} ({filteredReferrals.length})
                {searchQuery && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    - Search: "{searchQuery}"
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {searchQuery 
                  ? `Found ${filteredReferrals.length} result${filteredReferrals.length !== 1 ? 's' : ''} matching your search`
                  : `Showing ${filteredReferrals.length} of ${mockReferrals.filter(ref => ref.status !== 'OPD Management').length} total`
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {filteredReferrals.length > 0 ? (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[200px] min-w-[200px]">Patient</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">UPI</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[180px] min-w-[180px]">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">Latest PSA</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentReferrals.map((referral, index) => {
                  const waitTimeInfo = formatWaitTime(referral.daysSinceReferral, referral.status);
                  return (
                    <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${waitTimeInfo.isUrgent ? 'bg-red-50/30 border-l-4 border-red-500' : ''}`}>
                      <td className="py-4 px-4 w-[200px] min-w-[200px]">
                        <div className="flex items-center space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${waitTimeInfo.isUrgent ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-green-800 to-black'}`}>
                              <span className="text-white font-semibold text-sm">
                                {referral.patientName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {referral.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-gray-900 text-sm leading-tight">{referral.patientName}</p>
                              {waitTimeInfo.isUrgent && (
                                <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                                  <AlertTriangle className="w-3 h-3 text-red-600" />
                                  <span className="text-xs font-medium text-red-600">URGENT</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 leading-tight">ID: {referral.id}</p>
                            {waitTimeInfo.text && (
                              <p className={`text-xs leading-tight ${waitTimeInfo.className}`}>
                                {waitTimeInfo.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    <td className="py-4 px-4 w-[140px] min-w-[140px]">
                      <div className="space-y-1">
                        <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-medium rounded-full border border-green-300">
                          {referral.upi}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[180px] min-w-[180px]">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                          {referral.status}
                        </span>
                        {referral.status !== 'Pending' && referral.status !== 'Surgical Pathway' && (
                          <p className="text-xs text-gray-500 leading-tight">Next: {referral.nextAction}</p>
                        )}
                        {referral.status !== 'Pending' && referral.status !== 'Surgical Pathway' && referral.nextAppointment && (
                          <p className="text-xs text-gray-400 leading-tight">{formatDate(referral.nextAppointment)}</p>
                        )}
                        {referral.status === 'Discharged' && referral.dischargeReason && (
                          <p className="text-xs text-gray-400 leading-tight italic">{referral.dischargeReason}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[160px] min-w-[160px]">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            referral.latestPSA > 10 ? 'bg-red-500' : 
                            referral.latestPSA > 4 ? 'bg-amber-500' : 
                            'bg-green-500'
                          }`}></div>
                          <span 
                            className={`text-sm font-semibold cursor-help ${
                              referral.latestPSA > 10 ? 'text-red-600' : 
                              referral.latestPSA > 4 ? 'text-amber-600' : 
                              'text-green-600'
                            }`}
                            onMouseEnter={(e) => handlePSAHover(e, referral)}
                            onMouseLeave={handlePSALeave}
                          >
                            {referral.latestPSA} ng/mL
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-tight">
                          {referral.latestPSA > 10 ? 'High Risk' : 
                           referral.latestPSA > 4 ? 'Elevated' : 
                           'Normal Range'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 w-[140px] min-w-[140px]">
                      <div className="flex items-center justify-start">
                        <button
                          onClick={() => handleViewPatientDetails(referral.upi)}
                          className="group relative inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1 text-white group-hover:text-white transition-colors" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <FileX className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery ? 'No results found' : 'No entries available'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No entries match your search for "${searchQuery}". Try adjusting your search terms or clearing the search.`
                  : 'There are no entries in this category at the moment. Check back later or try a different filter.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with Pagination */}
        {filteredReferrals.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredReferrals.length)} of {filteredReferrals.length} entries
              </div>
              
              {/* Pagination */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal 
        isOpen={showPatientModal}
        onClose={handleClosePatientModal}
        patientId={selectedPatientId}
        userRole="gp"
      />

      {/* New Referral Modal */}
      <NewReferralModal 
        isOpen={showNewReferralModal}
        onClose={() => setShowNewReferralModal(false)}
      />

      {/* PSA Tooltip Portal - Rendered outside table overflow */}
      {hoveredPSA && createPortal(
        <div 
          className="fixed px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            minWidth: '220px'
          }}
        >
          <div className="text-center">
            <div className="font-semibold mb-2 text-white">{getPSABaselineInfo(hoveredPSA.gender)?.description}</div>
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Normal:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender)?.normal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Borderline:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender)?.borderline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 mr-2">•</span>
                <span className="font-medium">Elevated:</span>
                <span className="text-gray-300">{getPSABaselineInfo(hoveredPSA.gender)?.elevated}</span>
              </div>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"
            style={{ marginTop: '-1px' }}
          ></div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default ReferralStatus;

