import React, { useState } from 'react';
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
  Download
} from 'lucide-react';

const PostOpFollowUp = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

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
    }
  ];


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
    
    const statusMatch = selectedStatus === 'all' || patient.status === selectedStatus;
    const riskMatch = selectedRisk === 'all' || patient.riskAssessment === selectedRisk;
    
    return searchMatch && statusMatch && riskMatch;
  });



  const handleScheduleFollowUp = (patientId) => {
    navigate(`/urology-nurse/appointments?patient=${patientId}&type=followup`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post-Op Follow-Up</h1>
        <p className="text-gray-600 mt-1">Manage recovery phase and post-operative care</p>
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
              <option value="Recovery">Recovery</option>
              <option value="Follow-up">Follow-up</option>
              <option value="High Risk">High Risk</option>
              <option value="Discharged">Discharged</option>
            </select>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Intermediate Risk">Intermediate Risk</option>
              <option value="High Risk">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Post-Op Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Post-Op Follow-Up</h2>
            <p className="text-sm text-gray-600 mt-1">Manage recovery and discharge planning</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Histopathology</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Latest PSA</th>
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
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getMarginColor(patient.histopathology.marginStatus)}`}>
                          {patient.histopathology.marginStatus}
                        </span>
                        <p className="text-xs text-gray-600">Gleason: {patient.histopathology.gleasonScore}</p>
                        <p className="text-xs text-gray-600">Stage: {patient.histopathology.stage}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.lastPSA} ng/mL</p>
                        <p className="text-sm text-gray-500">{patient.lastPSADate}</p>
                        <p className="text-xs text-gray-400">Next: {patient.nextFollowUp}</p>
                      </div>
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
                          onClick={() => handleScheduleFollowUp(patient.id)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Schedule Follow-up</span>
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
                    setSelectedStatus('all');
                    setSelectedRisk('all');
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
    </div>
  );
};

export default PostOpFollowUp;
