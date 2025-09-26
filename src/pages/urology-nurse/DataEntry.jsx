import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDb1Patient, updateDb2Patient, updateDb3Patient, updateDb4Patient } from '../../store/slices/databaseSlice';
import { 
  User, 
  FileText, 
  Database, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Calendar,
  Activity,
  Stethoscope,
  Heart,
  TrendingUp,
  Clock,
  Shield,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  X,
  Bell
} from 'lucide-react';

const DataEntry = () => {
  const dispatch = useDispatch();
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { patients } = useSelector(state => state.patients);
  
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    database: 'db1',
    priority: 'medium',
    status: 'active',
    notes: ''
  });

  const databases = [
    { id: 'db1', name: 'Database 1 (OPD)', count: db1.patients.length, color: 'purple', icon: Stethoscope },
    { id: 'db2', name: 'Database 2 (Surveillance)', count: db2.patients.length, color: 'green', icon: Activity },
    { id: 'db3', name: 'Database 3 (Surgery)', count: db3.patients.length, color: 'red', icon: Heart },
    { id: 'db4', name: 'Database 4 (Follow-up)', count: db4.patients.length, color: 'blue', icon: TrendingUp },
  ];

  // Enhanced dummy data
  const enhancedRecentEntries = [
    { 
      id: 1, 
      patient: 'John Smith', 
      database: 'DB1', 
      field: 'PSA Value', 
      value: '4.2 ng/mL', 
      timestamp: '2 minutes ago',
      status: 'success',
      type: 'psa'
    },
    { 
      id: 2, 
      patient: 'Michael Brown', 
      database: 'DB2', 
      field: 'DRE Findings', 
      value: 'Normal', 
      timestamp: '15 minutes ago',
      status: 'success',
      type: 'clinical'
    },
    { 
      id: 3, 
      patient: 'David Wilson', 
      database: 'DB3', 
      field: 'Surgical Notes', 
      value: 'RALP completed', 
      timestamp: '1 hour ago',
      status: 'success',
      type: 'surgery'
    },
    { 
      id: 4, 
      patient: 'Robert Davis', 
      database: 'DB4', 
      field: 'Follow-up PSA', 
      value: '0.1 ng/mL', 
      timestamp: '2 hours ago',
      status: 'success',
      type: 'psa'
    },
    { 
      id: 5, 
      patient: 'James Anderson', 
      database: 'DB1', 
      field: 'Clinical Assessment', 
      value: 'Stable', 
      timestamp: '3 hours ago',
      status: 'success',
      type: 'clinical'
    },
    { 
      id: 6, 
      patient: 'William Thompson', 
      database: 'DB2', 
      field: 'PSA Velocity', 
      value: '0.8 ng/mL/year', 
      timestamp: '4 hours ago',
      status: 'warning',
      type: 'psa'
    },
    { 
      id: 7, 
      patient: 'Christopher Lee', 
      database: 'DB3', 
      field: 'Pre-op Checklist', 
      value: 'Completed', 
      timestamp: '5 hours ago',
      status: 'success',
      type: 'surgery'
    },
    { 
      id: 8, 
      patient: 'Matthew Garcia', 
      database: 'DB4', 
      field: 'Outcome Assessment', 
      value: 'Excellent', 
      timestamp: '6 hours ago',
      status: 'success',
      type: 'outcome'
    }
  ];

  const enhancedPatients = [
    {
      id: 'P001',
      name: 'John Smith',
      age: 65,
      status: 'Active',
      lastVisit: '2024-01-20',
      database: 'DB1',
      priority: 'Medium',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      notes: 'Regular follow-up patient with stable condition'
    },
    {
      id: 'P002',
      name: 'Michael Brown',
      age: 58,
      status: 'Active',
      lastVisit: '2024-01-19',
      database: 'DB2',
      priority: 'High',
      phone: '+61 423 456 789',
      email: 'michael.brown@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      notes: 'Active surveillance monitoring - PSA velocity increasing'
    },
    {
      id: 'P003',
      name: 'David Wilson',
      age: 71,
      status: 'Active',
      lastVisit: '2024-01-18',
      database: 'DB3',
      priority: 'High',
      phone: '+61 434 567 890',
      email: 'david.wilson@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      notes: 'Pre-operative assessment completed - RALP scheduled'
    },
    {
      id: 'P004',
      name: 'Robert Davis',
      age: 62,
      status: 'Active',
      lastVisit: '2024-01-17',
      database: 'DB4',
      priority: 'Low',
      phone: '+61 445 678 901',
      email: 'robert.davis@email.com',
      address: '321 Elm St, Perth WA 6000',
      notes: 'Post-operative follow-up - excellent recovery'
    },
    {
      id: 'P005',
      name: 'James Anderson',
      age: 55,
      status: 'Active',
      lastVisit: '2024-01-16',
      database: 'DB1',
      priority: 'Medium',
      phone: '+61 456 789 012',
      email: 'james.anderson@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      notes: 'New referral - initial assessment pending'
    },
    {
      id: 'P006',
      name: 'William Thompson',
      age: 68,
      status: 'Active',
      lastVisit: '2024-01-15',
      database: 'DB2',
      priority: 'High',
      phone: '+61 467 890 123',
      email: 'william.thompson@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      notes: 'Surveillance patient - requires close monitoring'
    }
  ];

  const filteredPatients = enhancedPatients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.database.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      patient.database.toLowerCase() === selectedFilter ||
      patient.priority.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: enhancedPatients.length,
    db1: enhancedPatients.filter(p => p.database === 'DB1').length,
    db2: enhancedPatients.filter(p => p.database === 'DB2').length,
    db3: enhancedPatients.filter(p => p.database === 'DB3').length,
    db4: enhancedPatients.filter(p => p.database === 'DB4').length,
    highPriority: enhancedPatients.filter(p => p.priority === 'High').length
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const closeAddPatientModal = () => {
    setShowAddPatientModal(false);
    setNewPatientForm({
      name: '',
      age: '',
      phone: '',
      email: '',
      address: '',
      database: 'db1',
      priority: 'medium',
      status: 'active',
      notes: ''
    });
  };

  const handleNewPatientSubmit = () => {
    // Simulate adding new patient
    console.log('Adding new patient:', newPatientForm);
    closeAddPatientModal();
  };

  const handleNewPatientInputChange = (field, value) => {
    setNewPatientForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'psa': return Activity;
      case 'clinical': return Stethoscope;
      case 'surgery': return Heart;
      case 'outcome': return TrendingUp;
      default: return FileText;
    }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+3</span>
              <span className="text-sm text-gray-500 ml-1">this week</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">OPD Patients</p>
            <p className="text-3xl font-bold text-gray-900">{stats.db1}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-purple-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">this week</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Surveillance</p>
            <p className="text-3xl font-bold text-gray-900">{stats.db2}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-green-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">this week</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-700">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Surgical</p>
            <p className="text-3xl font-bold text-gray-900">{stats.db3}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-red-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">this week</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-700">
            <Heart className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Follow-up</p>
            <p className="text-3xl font-bold text-gray-900">{stats.db4}</p>
            <div className="mt-2">
              <span className="text-sm font-medium text-blue-600">+1</span>
              <span className="text-sm text-gray-500 ml-1">this week</span>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFiltersAndControls = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or database..."
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
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Patients</option>
            <option value="db1">OPD Patients</option>
            <option value="db2">Surveillance</option>
            <option value="db3">Surgical</option>
            <option value="db4">Follow-up</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <button
          onClick={handleAddPatient}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>
    </div>
  );

  const renderPatientList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Patient List ({filteredPatients.length})
        </h3>
      </div>
      
      {filteredPatients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Database</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Last Visit</th>
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
                          <User className="h-5 w-5 text-white" />
                        </div>
                        {patient.priority === 'High' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">ID: {patient.id} | Age: {patient.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      patient.database === 'DB1' ? 'bg-purple-100 text-purple-800' :
                      patient.database === 'DB2' ? 'bg-green-100 text-green-800' :
                      patient.database === 'DB3' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {patient.database}
                    </span>
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
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{patient.lastVisit}</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePatientSelect(patient)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span>View</span>
                      </button>
                      <button 
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No patients found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? `No patients match your search for "${searchTerm}".`
              : 'No patients match your current filter criteria.'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderPatientDetails = (patient) => (
    <div className="space-y-6">
      {/* Patient Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Age</p>
              <p className="text-lg font-bold text-blue-600">{patient.age}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-3">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">Database</p>
              <p className="text-lg font-bold text-green-600">{patient.database}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mr-3">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-900">Priority</p>
              <p className="text-lg font-bold text-yellow-600">{patient.priority}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-900">Last Visit</p>
              <p className="text-lg font-bold text-purple-600">{patient.lastVisit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">{patient.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">{patient.email}</span>
          </div>
          <div className="flex items-center space-x-3 md:col-span-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">{patient.address}</span>
          </div>
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-green-900 mb-4">Clinical Notes</h4>
        <p className="text-sm text-gray-700">{patient.notes}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-2">Add, view, and manage patients across all databases</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
                <span className="text-green-800 font-semibold">{stats.total} Total Patients</span>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-3">
                <span className="text-blue-800 font-semibold">{stats.highPriority} High Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderStatsCards()}
      {renderFiltersAndControls()}
      {renderPatientList()}

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedPatient.name}
                    </h3>
                    <p className="text-sm text-gray-600">Patient ID: {selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  onClick={closePatientModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {renderPatientDetails(selectedPatient)}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      console.log('Call patient:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Patient
                  </button>
                  <button
                    onClick={() => {
                      console.log('Send reminder to:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Reminder
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={closePatientModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      console.log('Edit patient:', selectedPatient.id);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    Edit Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Patient</h3>
                    <p className="text-sm text-gray-600">Enter patient information to add to the system</p>
                  </div>
                </div>
                <button
                  onClick={closeAddPatientModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.name}
                      onChange={(e) => handleNewPatientInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={newPatientForm.age}
                      onChange={(e) => handleNewPatientInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newPatientForm.phone}
                      onChange={(e) => handleNewPatientInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newPatientForm.email}
                      onChange={(e) => handleNewPatientInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.address}
                      onChange={(e) => handleNewPatientInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Database *
                    </label>
                    <select
                      value={newPatientForm.database}
                      onChange={(e) => handleNewPatientInputChange('database', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="db1">DB1 - OPD Management</option>
                      <option value="db2">DB2 - Active Surveillance</option>
                      <option value="db3">DB3 - Surgical Pathway</option>
                      <option value="db4">DB4 - Post-Op Follow-up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newPatientForm.priority}
                      onChange={(e) => handleNewPatientInputChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Clinical Notes
                    </label>
                    <textarea
                      value={newPatientForm.notes}
                      onChange={(e) => handleNewPatientInputChange('notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      rows="3"
                      placeholder="Enter clinical notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeAddPatientModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewPatientSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntry;