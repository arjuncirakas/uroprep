import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  User,
  Phone,
  Mail,
  Activity,
  Stethoscope,
  FileText,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const OPDManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

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
      status: 'Waiting',
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
      status: 'In Consultation',
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
      status: 'Awaiting Results',
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
      status: 'Waiting',
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
      status: 'Waiting',
      waitTime: '10 minutes',
      priority: 'High',
      reason: 'Rising PSA levels',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'PSA increased from 5.8 to 7.2'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return 'bg-yellow-100 text-yellow-800';
      case 'In Consultation': return 'bg-blue-100 text-blue-800';
      case 'Awaiting Results': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
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

  const filteredOPDQueue = mockOPDQueue.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedUrologist.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === 'all' || patient.status === selectedStatus;
    const dateMatch = patient.appointmentDate === selectedDate;
    
    return searchMatch && statusMatch && dateMatch;
  });


  const handleStatusUpdate = (patientId, newStatus) => {
    // This would update the patient status in the backend
    console.log(`Updating patient ${patientId} status to ${newStatus}`);
  };

  const handleReschedule = (patientId) => {
    navigate(`/urology-nurse/reschedule-appointment/${patientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">OPD Management</h1>
        <p className="text-gray-600 mt-1">Track patients in OPD queue and manage consultation flow</p>
      </div>


      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter OPD Queue</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients in the OPD queue</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Search</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name, UPI, or urologist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Waiting">Waiting</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Awaiting Results">Awaiting Results</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
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

        <div className="overflow-x-auto">
          {filteredOPDQueue.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Wait Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Urologist</th>
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
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(patient.priority)}`}>
                        {patient.priority}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{patient.waitTime}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.assignedUrologist}</p>
                        <p className="text-sm text-gray-500">PSA: {patient.latestPSA} ng/mL</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => navigate(`/urology-nurse/patient-details/${patient.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        {patient.status === 'Waiting' && (
                          <button 
                            onClick={() => handleStatusUpdate(patient.id, 'In Consultation')}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Start</span>
                          </button>
                        )}
                        {patient.status === 'In Consultation' && (
                          <button 
                            onClick={() => handleStatusUpdate(patient.id, 'Awaiting Results')}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            <span>Results</span>
                          </button>
                        )}
                        <button 
                          onClick={() => handleReschedule(patient.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Reschedule</span>
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
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No patients in OPD queue
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {selectedDate === new Date().toISOString().split('T')[0] 
                  ? 'No patients scheduled for today.'
                  : `No patients scheduled for ${selectedDate}.`
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
    </div>
  );
};

export default OPDManagement;
