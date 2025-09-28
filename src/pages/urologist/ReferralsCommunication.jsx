import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Clock,
  Database,
  Activity,
  Stethoscope,
  Heart,
  ArrowRight,
  X,
  Filter,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Target,
  Shield,
  Users,
  Send,
  Download,
  ClipboardList,
  MessageSquare,
  FileCheck,
  Upload,
  CheckSquare,
  Square,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Microscope,
  TestTube,
  FileBarChart,
  Zap,
  LineChart,
  BarChart3,
  PieChart,
  Mail as MailIcon,
  FileX,
  Printer,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';

const ReferralsCommunication = () => {
  const navigate = useNavigate();
  const { referrals } = useSelector(state => state.referrals);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock incoming referrals data
  const incomingReferrals = [
    {
      id: 'REF001',
      patientName: 'John Smith',
      patientId: 'P006',
      referringDoctor: 'Dr. Emma Thompson',
      referringPractice: 'City Medical Centre',
      referralDate: '2024-01-28',
      referralType: 'GP Referral',
      priority: 'High',
      status: 'New',
      reason: 'Elevated PSA levels and abnormal DRE findings',
      psa: 12.5,
      age: 65,
      symptoms: 'Urinary frequency, nocturia',
      clinicalNotes: 'Patient presents with elevated PSA and abnormal DRE. Family history of prostate cancer.',
      attachments: ['PSA Results.pdf', 'DRE Report.pdf'],
      type: 'OPD'
    },
    {
      id: 'REF002',
      patientName: 'Mark Davis',
      patientId: 'P007',
      referringDoctor: 'Dr. Lisa Chen',
      referringPractice: 'Riverside Clinic',
      referralDate: '2024-01-27',
      referralType: 'GP Referral',
      priority: 'Medium',
      status: 'New',
      reason: 'Prostate biopsy required',
      psa: 8.2,
      age: 58,
      symptoms: 'Asymptomatic',
      clinicalNotes: 'PSA rising trend over 2 years. MRI shows suspicious lesion.',
      attachments: ['PSA History.pdf', 'MRI Report.pdf'],
      type: 'OPD'
    },
    {
      id: 'REF003',
      patientName: 'Peter Wilson',
      patientId: 'P008',
      referringDoctor: 'Dr. James Brown',
      referringPractice: 'Metro Health',
      referralDate: '2024-01-26',
      referralType: 'GP Referral',
      priority: 'Urgent',
      status: 'New',
      reason: 'Suspected prostate cancer',
      psa: 25.8,
      age: 72,
      symptoms: 'Bone pain, weight loss',
      clinicalNotes: 'High PSA with bone pain. Urgent assessment required.',
      attachments: ['PSA Results.pdf', 'Bone Scan.pdf'],
      type: 'IPD'
    }
  ];


  // Filter and search logic
  const filteredReferrals = incomingReferrals.filter(referral => {
    const matchesSearch = searchTerm === '' || 
      referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referringDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referralType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'new' && referral.status === 'New') ||
      (activeFilter === 'reviewed' && referral.status === 'Reviewed') ||
      (activeFilter === 'urgent' && referral.priority === 'Urgent') ||
      (activeFilter === 'high' && referral.priority === 'High') ||
      (activeFilter === 'medium' && referral.priority === 'Medium');
    
    return matchesSearch && matchesFilter;
  });

  // Sort referrals
  const sortedReferrals = [...filteredReferrals].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.referralDate) - new Date(a.referralDate);
      case 'priority':
        const priorityOrder = { 'Urgent': 3, 'High': 2, 'Medium': 1, 'Normal': 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        const statusOrder = { 'New': 2, 'Reviewed': 1 };
        return statusOrder[b.status] - statusOrder[a.status];
      case 'patient':
        return a.patientName.localeCompare(b.patientName);
      default:
        return 0;
    }
  });


  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incoming Referrals</h1>
            <p className="text-sm text-gray-600 mt-1">Manage new referrals from GPs and other specialists</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedReferrals.length} Referrals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter Referrals</h2>
              <p className="text-sm text-gray-600 mt-1">Find and manage incoming referrals</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Search</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient, referring doctor, or referral type..."
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
              
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Referrals</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="urgent">Urgent Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
                <option value="patient">Sort by Patient</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {sortedReferrals.filter(r => r.status === 'New').length} New Referrals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Incoming Referrals</h2>
              <p className="text-sm text-gray-600 mt-1">New referrals from GPs and other specialists</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Queue</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {sortedReferrals.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Referral Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedReferrals.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {item.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {item.priority === 'Urgent' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.patientName}</p>
                          <p className="text-sm text-gray-500">ID: {item.id}</p>
                          <p className="text-xs text-gray-400">From: {item.referringDoctor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{item.referralType}</p>
                        <p className="text-xs text-gray-500">{item.reason}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/urologist/patient-details/${item.patientId}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
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
                <MailIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No referrals found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm ? 'No referrals match your search criteria. Try adjusting your filters or search terms.' : 'No referrals are currently in the system.'}
              </p>
              <div className="flex items-center justify-center space-x-4">
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReferralsCommunication;
