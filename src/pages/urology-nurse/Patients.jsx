import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Eye,
  X,
  UserPlus
} from 'lucide-react';

const Patients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock patient data
  const mockPatients = [
    {
      id: 'PAT001',
      name: 'John Smith',
      upi: 'URP2024001',
      age: 65,
      gender: 'Male',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      status: 'Active',
      pathway: 'OPD Queue',
      type: 'OPD',
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-01-22',
      lastPSA: 8.5,
      lastPSADate: '2024-01-08',
      referringGP: 'Dr. Sarah Johnson',
      notes: 'Elevated PSA, awaiting urologist consultation'
    },
    {
      id: 'PAT002',
      name: 'Michael Brown',
      upi: 'URP2024002',
      age: 58,
      gender: 'Male',
      phone: '+61 423 456 789',
      email: 'michael.brown@email.com',
      status: 'Active',
      pathway: 'Active Surveillance',
      type: 'OPD',
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-04-10',
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      referringGP: 'Dr. Robert Wilson',
      notes: 'Under active surveillance, stable PSA'
    },
    {
      id: 'PAT003',
      name: 'David Wilson',
      upi: 'URP2024003',
      age: 71,
      gender: 'Male',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      status: 'Active',
      pathway: 'Surgical Pathway',
      type: 'IPD',
      lastAppointment: '2024-01-12',
      nextAppointment: '2024-01-25',
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      referringGP: 'Dr. Emily Davis',
      notes: 'Scheduled for RALP surgery'
    },
    {
      id: 'PAT004',
      name: 'Robert Davis',
      upi: 'URP2024004',
      age: 62,
      gender: 'Male',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      status: 'Discharged',
      pathway: 'Post-Op Follow-up',
      type: 'OPD',
      lastAppointment: '2024-01-08',
      nextAppointment: '2024-04-08',
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      referringGP: 'Dr. Jennifer Lee',
      notes: 'Post-RALP, excellent recovery, ready for GP care'
    },
    {
      id: 'PAT005',
      name: 'James Anderson',
      upi: 'URP2024005',
      age: 55,
      gender: 'Male',
      phone: '+61 456 789 012',
      email: 'james.anderson@email.com',
      status: 'Active',
      pathway: 'OPD Queue',
      type: 'OPD',
      lastAppointment: '2024-01-14',
      nextAppointment: '2024-01-21',
      lastPSA: 6.8,
      lastPSADate: '2024-01-12',
      referringGP: 'Dr. Mark Thompson',
      notes: 'Suspicious MRI findings, urgent biopsy required'
    },
    {
      id: 'PAT006',
      name: 'William Thompson',
      upi: 'URP2024006',
      age: 68,
      gender: 'Male',
      phone: '+61 467 890 123',
      email: 'william.thompson@email.com',
      status: 'Active',
      pathway: 'Active Surveillance',
      type: 'OPD',
      lastAppointment: '2024-01-11',
      nextAppointment: '2024-04-11',
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      referringGP: 'Dr. Lisa Chen',
      notes: 'PSA velocity concern, review surveillance protocol'
    }
  ];

  const getPathwayColor = (pathway) => {
    switch (pathway) {
      case 'OPD Queue': return 'bg-blue-100 text-blue-800';
      case 'Active Surveillance': return 'bg-green-100 text-green-800';
      case 'Surgical Pathway': return 'bg-orange-100 text-orange-800';
      case 'Post-Op Follow-up': return 'bg-purple-100 text-purple-800';
      case 'Discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Discharged': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'OPD': return 'bg-blue-100 text-blue-800';
      case 'IPD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPatients = mockPatients.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.referringGP.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === 'all' || patient.status === selectedStatus;
    const pathwayMatch = selectedPathway === 'all' || patient.pathway === selectedPathway;
    const typeMatch = selectedType === 'all' || patient.type === selectedType;
    
    return searchMatch && statusMatch && pathwayMatch && typeMatch;
  });


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">Unified searchable list of all patients with current pathway status</p>
          </div>
          <button
            onClick={() => navigate('/urology-nurse/add-patient')}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Patient
          </button>
        </div>
      </div>


      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search & Filter Patients</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients across all pathways and statuses</p>
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
                  placeholder="Search by name, UPI, or GP..."
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
                <option value="Pending">Pending</option>
              </select>
              
              <select
                value={selectedPathway}
                onChange={(e) => setSelectedPathway(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Pathways</option>
                <option value="OPD Queue">OPD Queue</option>
                <option value="Active Surveillance">Active Surveillance</option>
                <option value="Surgical Pathway">Surgical Pathway</option>
                <option value="Post-Op Follow-up">Post-Op Follow-up</option>
                <option value="Discharged">Discharged</option>
              </select>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              >
                <option value="all">All Types</option>
                <option value="OPD">OPD</option>
                <option value="IPD">IPD</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">
                  {filteredPatients.length} Patients Found
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Patient List</h2>
              <p className="text-sm text-gray-600 mt-1">All patients under urology care</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {filteredPatients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Pathway</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Latest PSA</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Next Appointment</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
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
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">UPI: {patient.upi}</p>
                          <p className="text-xs text-gray-400">Age: {patient.age} • {patient.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(patient.type)}`}>
                        {patient.type}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPathwayColor(patient.pathway)}`}>
                        {patient.pathway}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <p className="font-medium text-gray-900">{patient.lastPSA} ng/mL</p>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-medium text-gray-900">{patient.nextAppointment}</p>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <button 
                        onClick={() => navigate(`/urology-nurse/patient-details/${patient.id}`)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span>View Details</span>
                      </button>
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
                No patients found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No patients match your search criteria. Try adjusting your filters or search terms.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedPathway('all');
                    setSelectedType('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/urology-nurse/add-patient')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Patient
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;
