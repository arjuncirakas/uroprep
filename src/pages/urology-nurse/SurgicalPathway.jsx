import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Search, 
  Eye,
  Calendar,
  AlertTriangle,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Heart,
  Activity,
  ArrowRight,
  Plus,
  RefreshCw,
  ClipboardList,
  Shield
} from 'lucide-react';

const SurgicalPathway = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSurgeon, setSelectedSurgeon] = useState('all');

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
      preOpStatus: 'In Progress',
      postOpStatus: 'Pending',
      lastPSA: 4.8,
      riskCategory: 'Intermediate Risk',
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
      preOpStatus: 'Complete',
      postOpStatus: 'In Progress',
      lastPSA: 0.02,
      riskCategory: 'Intermediate Risk',
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
    }
  ];

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
      case 'Intermediate Risk': return 'bg-yellow-100 text-yellow-800';
      case 'High Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = mockSurgicalPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedSurgeon.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === 'all' || patient.status === selectedStatus;
    const surgeonMatch = selectedSurgeon === 'all' || patient.assignedSurgeon === selectedSurgeon;
    
    return searchMatch && statusMatch && surgeonMatch;
  });



  const handleStatusUpdate = (patientId, newStatus) => {
    console.log(`Updating patient ${patientId} status to ${newStatus}`);
  };


  const handleScheduleSurgery = (patientId) => {
    navigate(`/urology-nurse/surgical-pathway/${patientId}/schedule`);
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Surgical Pathway</h1>
        <p className="text-gray-600 mt-1">Manage surgical scheduling and pre/post-operative steps</p>
      </div>


      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, UPI, or surgeon..."
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
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pre-Op">Pre-Op</option>
              <option value="In Surgery">In Surgery</option>
              <option value="Post-Op">Post-Op</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={selectedSurgeon}
              onChange={(e) => setSelectedSurgeon(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Surgeons</option>
              <option value="Dr. Michael Chen">Dr. Michael Chen</option>
              <option value="Dr. Sarah Wilson">Dr. Sarah Wilson</option>
            </select>
          </div>
        </div>
      </div>

      {/* Surgical Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Surgical Pathway</h2>
            <p className="text-sm text-gray-600 mt-1">Manage pre-operative, surgical, and post-operative phases</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Risk Category</th>
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
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getRiskColor(patient.riskCategory)}`}>
                        {patient.riskCategory}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PSA: {patient.lastPSA} ng/mL</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col space-y-1">
                        <button 
                          onClick={() => navigate(`/urology-nurse/patient-details/${patient.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => handleScheduleSurgery(patient.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{patient.status === 'Scheduled' ? 'Reschedule' : 'Schedule'}</span>
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
                    setSelectedStatus('all');
                    setSelectedSurgeon('all');
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
    </div>
  );
};

export default SurgicalPathway;
