import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  AlertCircle,
  TrendingUp,
  Activity,
  Eye,
  ArrowUp,
  ArrowDown,
  Plus,
  Send,
  RotateCcw,
  Bell,
  Target,
  Zap,
  Grid3X3,
  Share,
  MoreHorizontal,
  X,
  FileX
} from 'lucide-react';

const DischargeSummaries = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock discharge summary data
  const mockDischargeSummaries = [
    {
      id: 'DS001',
      patientName: 'John Smith',
      upi: 'URP2024001',
      dischargeDate: '2024-01-15',
      admissionDate: '2024-01-10',
      procedure: 'RALP (Robotic Assisted Laparoscopic Prostatectomy)',
      diagnosis: 'Prostate Cancer - Gleason 7 (3+4)',
      status: 'Discharged',
      followUpRequired: true,
      nextAppointment: '2024-04-15',
      followUpInstructions: '3-month PSA, 6-month follow-up appointment',
      medications: ['Tamsulosin 0.4mg daily', 'Paracetamol PRN'],
      complications: 'None',
      summary: 'Patient underwent successful RALP. No complications. Catheter removed on day 5. Patient mobilizing well.',
      psaPreOp: 8.5,
      psaPostOp: 0.1,
      surgeon: 'Dr. Michael Chen',
      anesthetist: 'Dr. Sarah Williams',
      ward: 'Urology Ward 3B',
      dischargeDestination: 'Home',
      readmissionRisk: 'Low',
      acknowledged: true
    },
    {
      id: 'DS002',
      patientName: 'Mary Johnson',
      upi: 'URP2024002',
      dischargeDate: '2024-01-12',
      admissionDate: '2024-01-12',
      procedure: 'Active Surveillance - OPD Review',
      diagnosis: 'Prostate Cancer - Gleason 6 (3+3)',
      status: 'Discharged to GP',
      followUpRequired: true,
      nextAppointment: '2024-07-12',
      followUpInstructions: '6-month PSA, annual review',
      medications: ['Continue current medications'],
      complications: 'None',
      summary: 'Patient reviewed in OPD. PSA stable at 4.2 ng/mL. No progression on imaging. Continue active surveillance.',
      psaPreOp: 4.2,
      psaPostOp: 4.2,
      surgeon: 'Dr. Michael Chen',
      anesthetist: 'N/A',
      ward: 'OPD',
      dischargeDestination: 'GP Care',
      readmissionRisk: 'Very Low',
      acknowledged: false
    },
    {
      id: 'DS003',
      patientName: 'Robert Brown',
      upi: 'URP2024003',
      dischargeDate: '2024-01-08',
      admissionDate: '2024-01-05',
      procedure: 'TURP (Transurethral Resection of Prostate)',
      diagnosis: 'Benign Prostatic Hyperplasia',
      status: 'Discharged',
      followUpRequired: true,
      nextAppointment: '2024-02-08',
      followUpInstructions: '4-week follow-up, IPSS assessment',
      medications: ['Tamsulosin 0.4mg daily', 'Antibiotics x 5 days'],
      complications: 'Minor bleeding - resolved',
      summary: 'Patient underwent TURP for BPH. Minor bleeding post-op resolved with irrigation. Good voiding function restored.',
      psaPreOp: 2.8,
      psaPostOp: 1.2,
      surgeon: 'Dr. Lisa Anderson',
      anesthetist: 'Dr. James Wilson',
      ward: 'Urology Ward 3A',
      dischargeDestination: 'Home',
      readmissionRisk: 'Low',
      acknowledged: true
    },
    {
      id: 'DS004',
      patientName: 'David Wilson',
      upi: 'URP2024004',
      dischargeDate: '2024-01-05',
      admissionDate: '2024-01-03',
      procedure: 'Cystoscopy + Biopsy',
      diagnosis: 'Bladder Cancer - T1G2',
      status: 'Discharged',
      followUpRequired: true,
      nextAppointment: '2024-01-26',
      followUpInstructions: '2-week follow-up for biopsy results, discuss treatment options',
      medications: ['Antibiotics x 3 days', 'Paracetamol PRN'],
      complications: 'None',
      summary: 'Patient underwent cystoscopy and bladder biopsy. T1G2 bladder cancer confirmed. Treatment options to be discussed at follow-up.',
      psaPreOp: 3.1,
      psaPostOp: 3.1,
      surgeon: 'Dr. Michael Chen',
      anesthetist: 'Dr. Sarah Williams',
      ward: 'Day Surgery',
      dischargeDestination: 'Home',
      readmissionRisk: 'Medium',
      acknowledged: false
    },
    {
      id: 'DS005',
      patientName: 'Sarah Davis',
      upi: 'URP2024005',
      dischargeDate: '2024-01-03',
      admissionDate: '2024-01-01',
      procedure: 'Nephrectomy (Partial)',
      diagnosis: 'Renal Cell Carcinoma - T1a',
      status: 'Discharged',
      followUpRequired: true,
      nextAppointment: '2024-04-03',
      followUpInstructions: '3-month CT scan, 6-month follow-up',
      medications: ['Paracetamol PRN', 'Laxatives PRN'],
      complications: 'None',
      summary: 'Patient underwent successful partial nephrectomy for T1a RCC. No complications. Good renal function preserved.',
      psaPreOp: 'N/A',
      psaPostOp: 'N/A',
      surgeon: 'Dr. Lisa Anderson',
      anesthetist: 'Dr. James Wilson',
      ward: 'Urology Ward 3B',
      dischargeDestination: 'Home',
      readmissionRisk: 'Low',
      acknowledged: true
    }
  ];

  const filters = ['All', 'Discharged', 'Discharged to GP', 'Pending Review', 'Follow-up Required'];

  // Filter summaries by status and search term
  const filteredSummaries = mockDischargeSummaries.filter(summary => {
    // Status filter
    const statusMatch = activeFilter === 'All' || 
      (activeFilter === 'Discharged' && summary.status === 'Discharged') ||
      (activeFilter === 'Discharged to GP' && summary.status === 'Discharged to GP') ||
      (activeFilter === 'Pending Review' && summary.status === 'Pending Review') ||
      (activeFilter === 'Follow-up Required' && summary.followUpRequired);
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      summary.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Discharged': return 'bg-green-100 text-green-800';
      case 'Discharged to GP': return 'bg-blue-100 text-blue-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAcknowledgedColor = (acknowledged) => {
    return acknowledged 
      ? 'bg-green-100 text-green-800' 
      : 'bg-amber-100 text-amber-800';
  };

  // Clear session storage when component mounts to ensure clean state
  useEffect(() => {
    sessionStorage.removeItem('lastVisitedPage');
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discharge Summaries</h1>
      </div>
      
      {/* Search Bar and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UPI, or procedure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-20 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
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
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4 mr-2" />
            <span className="font-medium">Export All</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {filters.map((filter) => (
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
                    {filter === 'All' ? mockDischargeSummaries.length : 
                     mockDischargeSummaries.filter(summary => {
                       switch (filter) {
                         case 'Discharged': return summary.status === 'Discharged';
                         case 'Discharged to GP': return summary.status === 'Discharged to GP';
                         case 'Pending Review': return summary.status === 'Pending Review';
                         case 'Follow-up Required': return summary.followUpRequired;
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

      {/* Discharge Summaries List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter} Discharge Summaries ({filteredSummaries.length})
              {searchTerm && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - Search: "{searchTerm}"
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchTerm 
                ? `Found ${filteredSummaries.length} discharge summar${filteredSummaries.length !== 1 ? 'ies' : 'y'} matching your search`
                : 'Patient outcomes and follow-up instructions'
              }
            </p>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          {filteredSummaries.length > 0 ? (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[200px] min-w-[200px]">Patient</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[180px] min-w-[180px]">Procedure</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Discharge Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[160px] min-w-[160px]">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Follow-up</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider w-[140px] min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSummaries.map((summary, index) => (
                <tr key={summary.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-4 px-4 w-[200px] min-w-[200px]">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {summary.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {summary.readmissionRisk === 'High' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{summary.patientName}</p>
                        <p className="text-xs text-gray-500 leading-tight">UPI: {summary.upi}</p>
                        <p className="text-xs text-gray-400 leading-tight">Ward: {summary.ward}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[180px] min-w-[180px]">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900 text-sm leading-tight">{summary.procedure}</p>
                      <p className="text-xs text-gray-500 leading-tight">{summary.diagnosis}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[140px] min-w-[140px]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(summary.dischargeDate)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-tight">
                        LOS: {Math.ceil((new Date(summary.dischargeDate) - new Date(summary.admissionDate)) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[160px] min-w-[160px]">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(summary.status)}`}>
                        {summary.status}
                      </span>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getAcknowledgedColor(summary.acknowledged)}`}>
                          {summary.acknowledged ? 'Acknowledged' : 'Not Acknowledged'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[140px] min-w-[140px]">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {summary.followUpRequired ? 'Required' : 'Not Required'}
                      </p>
                      {summary.nextAppointment && (
                        <p className="text-xs text-blue-600 leading-tight">{formatDate(summary.nextAppointment)}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 w-[140px] min-w-[140px]">
                    <div className="flex items-center justify-start">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('lastVisitedPage', 'discharge-summaries');
                          navigate(`/gp/referral-details/${summary.id}`);
                        }}
                        className="group relative inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1 text-white group-hover:text-white transition-colors" />
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
                <FileX className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? 'No discharge summaries found' : 'No discharge summaries available'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No discharge summaries match your search for "${searchTerm}". Try adjusting your search terms or clearing the search.`
                  : 'There are no discharge summaries in this category at the moment.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span>Showing {filteredSummaries.length} of {mockDischargeSummaries.length} discharge summaries</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DischargeSummaries;
