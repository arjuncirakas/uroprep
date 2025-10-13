import React, { useState } from 'react';
import AddPatientModal from '../../components/modals/AddPatientModal';
import ScheduleMDTModal from '../../components/modals/ScheduleMDTModal';
import { usePatientDetails } from '../../contexts/PatientDetailsContext';
import { 
  Search, 
  UserPlus, 
  Eye, 
  X,
  Users,
  Calendar,
  MessageSquare,
  Clock,
  Activity,
  Stethoscope,
  Target,
  CheckCircle,
  FileText,
  Download,
  Plus
} from 'lucide-react';

const PatientManagement = () => {
  const { openPatientDetails } = usePatientDetails();
  
  const [newPatientsSearch, setNewPatientsSearch] = useState('');
  const [surgicalPathwaySearch, setSurgicalPathwaySearch] = useState('');
  const [postOpFollowUpSearch, setPostOpFollowUpSearch] = useState('');
  const [selectedPathway, setSelectedPathway] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  // Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Schedule MDT Modal state
  const [showScheduleMDTModal, setShowScheduleMDTModal] = useState(false);
  const [selectedPatientForMDT, setSelectedPatientForMDT] = useState(null);

  // MDT Notes Modal state
  const [showMDTNotesModal, setShowMDTNotesModal] = useState(false);
  const [selectedPatientForMDTNotes, setSelectedPatientForMDTNotes] = useState(null);
  const [mdtNotes, setMdtNotes] = useState([]);
  
  // Initialize form with current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const [mdtForm, setMdtForm] = useState({
    mdtDate: currentDate,
    time: currentTime,
    caseType: '',
    priority: 'Medium',
    status: 'Pending Review',
    teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
    discussionNotes: '',
    outcome: '',
    recommendations: '',
    followUpActions: [''],
    documents: []
  });

  const [isDragOver, setIsDragOver] = useState(false);
  
  // Add Team Member Modal state
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    department: ''
  });

  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState('');

  // Available team members for dropdown
  const availableTeamMembers = [
    'Dr. Sarah Wilson (Urologist)',
    'Dr. Michael Chen (Oncologist)',
    'Dr. Jennifer Lee (Radiologist)',
    'Dr. David Wilson (Pathologist)',
    'Dr. Emily Brown (Medical Oncologist)',
    'Dr. James Taylor (Radiation Oncologist)',
    'Dr. Lisa Anderson (Nurse Practitioner)',
    'Dr. Robert Garcia (Clinical Psychologist)',
    'Dr. Maria Rodriguez (Social Worker)',
    'Dr. Thomas Lee (Anesthesiologist)',
    'Dr. Amanda White (Physiotherapist)',
    'Dr. Kevin Park (Nutritionist)'
  ];

  // Filter team members based on search
  const filteredTeamMembers = availableTeamMembers.filter(member => 
    !mdtForm.teamMembers.includes(member) && 
    member.toLowerCase().includes(dropdownSearchTerm.toLowerCase())
  );

  // Mock patient data combining all databases
  const allPatients = [
    // DB1 - OPD Queue
    {
      id: 'URP2024001',
      name: 'John Smith',
      age: 65,
      dob: '1959-03-15',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      psa: 25.4,
      status: 'OPD Queue',
      database: 'DB1',
      patientType: 'OPD',
      referralDate: '2024-01-10',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'Elevated PSA with family history',
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-01-22',
      priority: 'High',
      assignedDoctor: 'Dr. Michael Chen'
    },
    {
      id: 'URP002',
      name: 'Mary Johnson',
      age: 58,
      dob: '1966-07-22',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      psa: 18.7,
      status: 'OPD Queue',
      database: 'DB1',
      patientType: 'OPD',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Rapidly rising PSA',
      lastAppointment: '2024-01-16',
      nextAppointment: '2024-01-23',
      priority: 'High',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    // DB2 - Active Surveillance
    {
      id: 'URP003',
      name: 'Robert Brown',
      age: 72,
      dob: '1952-11-08',
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      psa: 4.2,
      status: 'Active Surveillance',
      database: 'DB2',
      patientType: 'OPD',
      referralDate: '2023-06-15',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Low-risk prostate cancer on surveillance',
      lastAppointment: '2023-12-15',
      nextAppointment: '2024-06-15',
      priority: 'Normal',
      gleasonScore: '3+3=6',
      stage: 'T1c',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP2024004',
      name: 'David Wilson',
      age: 68,
      dob: '1956-05-12',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      psa: 3.8,
      status: 'Active Surveillance',
      database: 'DB2',
      patientType: 'OPD',
      referralDate: '2023-08-20',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'Stable PSA on surveillance',
      lastAppointment: '2023-11-20',
      nextAppointment: '2024-05-20',
      priority: 'Normal',
      gleasonScore: '3+3=6',
      stage: 'T1c',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // DB3 - Surgical Pathway
    {
      id: 'URP005',
      name: 'Sarah Davis',
      age: 71,
      dob: '1953-09-30',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      psa: 15.2,
      status: 'Surgery Scheduled',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2023-10-15',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'High-risk prostate cancer',
      lastAppointment: '2024-01-10',
      nextAppointment: '2024-02-15',
      priority: 'High',
      gleasonScore: '4+3=7',
      stage: 'T2b',
      surgeryDate: '2024-02-15',
      surgeryType: 'RALP',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP006',
      name: 'Michael Thompson',
      age: 69,
      dob: '1955-12-03',
      phone: '+61 467 890 123',
      email: 'michael.thompson@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      psa: 12.8,
      status: 'Surgery Scheduled',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2023-11-20',
      referringGP: 'Dr. Sarah Johnson',
      clinicalNotes: 'Intermediate-risk prostate cancer',
      lastAppointment: '2024-01-12',
      nextAppointment: '2024-02-20',
      priority: 'High',
      gleasonScore: '3+4=7',
      stage: 'T2a',
      surgeryDate: '2024-02-20',
      surgeryType: 'RALP',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // DB4 - Post-Op Follow-Up
    {
      id: 'URP007',
      name: 'Jennifer Wilson',
      age: 64,
      dob: '1960-04-18',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      psa: 0.8,
      status: 'Post-Op Follow-Up',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-05-10',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'Post-operative surveillance',
      lastAppointment: '2024-01-08',
      nextAppointment: '2024-04-08',
      priority: 'Normal',
      gleasonScore: '3+4=7',
      stage: 'T2c',
      surgeryDate: '2023-08-15',
      surgeryType: 'RALP',
      histopathology: 'Negative margins, organ-confined',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP008',
      name: 'William Anderson',
      age: 66,
      dob: '1958-01-25',
      phone: '+61 489 012 345',
      email: 'william.anderson@email.com',
      address: '258 Pine St, Canberra ACT 2600',
      psa: 1.2,
      status: 'Post-Op Follow-Up',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-03-15',
      referringGP: 'Dr. Jennifer Lee',
      clinicalNotes: 'Post-operative monitoring',
      lastAppointment: '2023-12-15',
      nextAppointment: '2024-03-15',
      priority: 'Normal',
      gleasonScore: '4+3=7',
      stage: 'T3a',
      surgeryDate: '2023-06-20',
      surgeryType: 'Open Prostatectomy',
      histopathology: 'Positive margins, extracapsular extension',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // Additional IPD Patients
    {
      id: 'URP009',
      name: 'Christopher Lee',
      age: 72,
      dob: '1952-08-12',
      phone: '+61 490 123 456',
      email: 'christopher.lee@email.com',
      address: '369 Oak Ave, Gold Coast QLD 4217',
      psa: 6.8,
      status: 'Inpatient',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2024-01-12',
      referringGP: 'Dr. Michael Chen',
      clinicalNotes: 'Intermediate-risk prostate cancer requiring inpatient care',
      lastAppointment: '2024-01-15',
      nextAppointment: '2024-01-25',
      priority: 'High',
      gleasonScore: '3+4=7',
      stage: 'T2b',
      surgeryDate: '2024-01-25',
      surgeryType: 'RALP',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP010',
      name: 'Thomas Brown',
      age: 68,
      dob: '1956-11-30',
      phone: '+61 501 234 567',
      email: 'thomas.brown@email.com',
      address: '741 Elm St, Newcastle NSW 2300',
      psa: 18.3,
      status: 'Inpatient',
      database: 'DB3',
      patientType: 'IPD',
      referralDate: '2024-01-15',
      referringGP: 'Dr. David Wilson',
      clinicalNotes: 'High-risk prostate cancer with complications',
      lastAppointment: '2024-01-18',
      nextAppointment: '2024-01-28',
      priority: 'High',
      gleasonScore: '4+4=8',
      stage: 'T3b',
      surgeryDate: '2024-01-28',
      surgeryType: 'Open Prostatectomy',
      assignedDoctor: 'Dr. Michael Chen'
    },
    // Additional patients from PatientDetailsModal
    {
      id: 'URP2024010',
      name: 'Thomas Miller',
      age: 65,
      dob: '1959-04-22',
      phone: '+61 414 567 890',
      email: 'thomas.miller@email.com',
      address: '789 Pine Street, Melbourne VIC 3002',
      psa: 2.1,
      status: 'Discharged',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-11-15',
      referringGP: 'Dr. Sarah Wilson',
      clinicalNotes: 'PSA levels normalized',
      lastAppointment: '2023-11-15',
      nextAppointment: null,
      priority: 'Normal',
      assignedDoctor: 'Dr. Sarah Wilson'
    },
    {
      id: 'URP2024011',
      name: 'Jennifer Taylor',
      age: 57,
      dob: '1967-09-18',
      phone: '+61 415 678 901',
      email: 'jennifer.taylor@email.com',
      address: '321 Elm Drive, Melbourne VIC 3003',
      psa: 1.8,
      status: 'Discharged',
      database: 'DB4',
      patientType: 'OPD',
      referralDate: '2023-10-20',
      referringGP: 'Dr. Sarah Wilson',
      clinicalNotes: 'Normal PSA levels',
      lastAppointment: '2023-10-20',
      nextAppointment: null,
      priority: 'Normal',
      assignedDoctor: 'Dr. Michael Chen'
    }
  ];

  // Filter and search logic for each category
  const filterPatients = (patients, category, searchTerm) => {
    return patients.filter(patient => {
      const searchMatch = searchTerm === '' || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const pathwayMatch = selectedPathway === 'all' || patient.status === selectedPathway;
      
      let categoryMatch = false;
      switch (category) {
        case 'newPatients':
          categoryMatch = patient.database === 'DB1' || patient.status === 'OPD Queue';
          break;
        case 'surgicalPathway':
          categoryMatch = patient.database === 'DB3' || patient.status === 'Surgery Scheduled' || patient.status === 'Inpatient';
          break;
        case 'postOpFollowUp':
          categoryMatch = patient.database === 'DB4' || patient.status === 'Post-Op Follow-Up' || patient.status === 'Discharged';
          break;
        default:
          categoryMatch = true;
      }
      
      return searchMatch && pathwayMatch && categoryMatch;
    });
  };

  // Sort patients helper function
  const sortPatients = (patients) => {
    return [...patients].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'psa':
          return b.psa - a.psa;
        case 'age':
          return b.age - a.age;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Normal': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });
  };

  // Get filtered and sorted patients for each category
  const newPatients = sortPatients(filterPatients(allPatients, 'newPatients', newPatientsSearch));
  const surgicalPathwayPatients = sortPatients(filterPatients(allPatients, 'surgicalPathway', surgicalPathwaySearch));
  const postOpFollowUpPatients = sortPatients(filterPatients(allPatients, 'postOpFollowUp', postOpFollowUpSearch));


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  // Add Patient Modal handlers
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handlePatientAdded = (newPatient) => {
    console.log('New patient added:', newPatient);
    // Here you could update your local state or dispatch to Redux store
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
  };

  // Patient Details Modal handlers
  const handleViewPatientDetails = (patientId, context) => {
    openPatientDetails(patientId, 'urologist', null, context);
  };

  // Schedule MDT Modal handlers
  const handleScheduleMDT = (patient) => {
    setSelectedPatientForMDT(patient);
    setShowScheduleMDTModal(true);
  };

  const handleMDTScheduled = (mdtData) => {
    console.log('MDT scheduled:', mdtData);
    // Here you could update your local state or dispatch to Redux store
  };

  const handleCloseScheduleMDTModal = () => {
    setShowScheduleMDTModal(false);
    setSelectedPatientForMDT(null);
  };

  // MDT Notes Modal handlers
  const handleMDTNotes = (patient) => {
    setSelectedPatientForMDTNotes(patient);
    // Auto-populate date and time
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setMdtForm(prev => ({
      ...prev,
      mdtDate: currentDate,
      time: currentTime
    }));
    setShowMDTNotesModal(true);
  };

  const closeMDTNotesModal = () => {
    setShowMDTNotesModal(false);
    setSelectedPatientForMDTNotes(null);
  };

  const closeAddTeamMemberModal = () => {
    setShowAddTeamMemberModal(false);
    setNewTeamMember({ name: '', department: '' });
  };

  const handleAddNewTeamMember = () => {
    if (newTeamMember.name.trim() && newTeamMember.department.trim()) {
      const fullName = `Dr. ${newTeamMember.name.trim()}`;
      const department = newTeamMember.department.trim();
      const newMember = `${fullName} (${department})`;
      
      // Add to available team members list
      if (!availableTeamMembers.includes(newMember)) {
        availableTeamMembers.push(newMember);
      }
      
      // Add to current form's team members
      if (!mdtForm.teamMembers.includes(newMember)) {
        setMdtForm(prev => ({
          ...prev,
          teamMembers: [...prev.teamMembers, newMember]
        }));
      }
      
      closeAddTeamMemberModal();
    }
  };

  const handleSelectTeamMember = (member) => {
    addTeamMember(member);
    setIsDropdownOpen(false);
    setDropdownSearchTerm('');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setDropdownSearchTerm('');
    }
  };

  // MDT Notes helper functions
  const handleMDTFormChange = (field, value) => {
    setMdtForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFollowUpAction = () => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: [...prev.followUpActions, '']
    }));
  };

  const removeFollowUpAction = (index) => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.filter((_, i) => i !== index)
    }));
  };

  const updateFollowUpAction = (index, value) => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.map((action, i) => i === index ? value : action)
    }));
  };

  const addTeamMember = (selectedMember) => {
    if (selectedMember && !mdtForm.teamMembers.includes(selectedMember)) {
      setMdtForm(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, selectedMember]
      }));
    }
  };

  const removeTeamMember = (index) => {
    setMdtForm(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const addDocument = (file) => {
    if (file) {
      const documentName = file.name;
      setMdtForm(prev => ({
        ...prev,
        documents: [...prev.documents, documentName]
      }));
    }
  };

  const removeDocument = (index) => {
    setMdtForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        addDocument(file);
      } else {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      }
    });
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          addDocument(file);
        } else {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
      });
      e.target.value = ''; // Reset file input
    }
  };

  const saveMDTNote = () => {
    const newMDTNote = {
      id: `MDT${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: mdtForm.mdtDate,
      time: mdtForm.time,
      mdtDate: mdtForm.mdtDate,
      patientId: selectedPatientForMDTNotes.id,
      patientName: selectedPatientForMDTNotes.name,
      teamMembers: mdtForm.teamMembers.filter(member => member.trim() !== ''),
      caseType: mdtForm.caseType,
      priority: mdtForm.priority,
      status: mdtForm.status,
      discussionNotes: mdtForm.discussionNotes,
      outcome: mdtForm.outcome,
      recommendations: mdtForm.recommendations,
      followUpActions: mdtForm.followUpActions.filter(action => action.trim() !== ''),
      documents: mdtForm.documents
    };

    setMdtNotes(prev => [newMDTNote, ...prev]);
    
    // Reset form (keep date and time for next use)
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setMdtForm({
      mdtDate: currentDate,
      time: currentTime,
      caseType: '',
      priority: 'Medium',
      status: 'Pending Review',
      teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      discussionNotes: '',
      outcome: '',
      recommendations: '',
      followUpActions: [''],
      documents: []
    });

    closeMDTNotesModal();
  };


  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
            <p className="text-gray-600">Search, add, and view patient timelines across all databases</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddPatient}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="font-medium">Add New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Three Tables Side by Side */}
      <div className="grid grid-cols-3 gap-6">
        {/* New Patients Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New Patients</h3>
                <p className="text-gray-600 text-sm">Fresh referrals & consultations</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search new patients..."
                value={newPatientsSearch}
                onChange={(e) => setNewPatientsSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
              />
              {newPatientsSearch && (
                <button
                  onClick={() => setNewPatientsSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            {newPatients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-0"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {patient.psa}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewPatientDetails(patient.id, 'newPatients')}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-500 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleScheduleMDT(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 border border-green-500 rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>MDT</span>
                          </button>
                          <button
                            onClick={() => handleMDTNotes(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 border border-purple-500 rounded-lg shadow-sm hover:from-purple-600 hover:to-purple-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>Notes</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No new patients found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Surgical Pathway Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Stethoscope className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Surgical Pathway</h3>
                <p className="text-gray-600 text-sm">Pre & post-operative care</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search surgical patients..."
                value={surgicalPathwaySearch}
                onChange={(e) => setSurgicalPathwaySearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-500"
              />
              {surgicalPathwaySearch && (
                <button
                  onClick={() => setSurgicalPathwaySearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            {surgicalPathwayPatients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {surgicalPathwayPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-orange-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-0"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {patient.psa}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewPatientDetails(patient.id, 'surgicalPathway')}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-500 rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleScheduleMDT(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 border border-green-500 rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>MDT</span>
                          </button>
                          <button
                            onClick={() => handleMDTNotes(patient)}
                            className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 border border-purple-500 rounded-lg shadow-sm hover:from-purple-600 hover:to-purple-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>Notes</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No surgical patients found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Post-op Follow-up Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Post-op Follow-up</h3>
                <p className="text-gray-600 text-sm">Recovery & monitoring</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search follow-up patients..."
                value={postOpFollowUpSearch}
                onChange={(e) => setPostOpFollowUpSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-500"
              />
              {postOpFollowUpSearch && (
                <button
                  onClick={() => setPostOpFollowUpSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-96">
            {postOpFollowUpPatients.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {postOpFollowUpPatients.map((patient, index) => (
                    <tr key={patient.id} className={`hover:bg-green-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {patient.priority === 'High' && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-0"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {patient.psa}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewPatientDetails(patient.id, 'postOpFollowUp')}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 border border-green-500 rounded-lg shadow-sm hover:from-green-600 hover:to-green-700 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No follow-up patients found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={handleCloseAddPatientModal}
        onPatientAdded={handlePatientAdded}
        isUrologist={true}
      />

      {/* Schedule MDT Modal */}
      <ScheduleMDTModal
        isOpen={showScheduleMDTModal}
        onClose={handleCloseScheduleMDTModal}
        onScheduled={handleMDTScheduled}
        selectedPatientData={selectedPatientForMDT}
      />

      {/* MDT Notes Modal */}
      {showMDTNotesModal && selectedPatientForMDTNotes && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      MDT Notes - {selectedPatientForMDTNotes.name}
                    </h3>
                    <p className="text-sm text-gray-600">Add comprehensive MDT discussion notes and outcomes</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {mdtForm.mdtDate ? new Date(mdtForm.mdtDate).toLocaleDateString('en-AU') : 'Date not set'}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {mdtForm.time || 'Time not set'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeMDTNotesModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">

                {/* Team Members */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Team Members</h4>
                    <div className="relative dropdown-container">
                      <button
                        onClick={handleDropdownToggle}
                        className="flex items-center justify-between w-64 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-gray-500">Select team member to add</span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden">
                          {/* Search Field */}
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search team members..."
                                value={dropdownSearchTerm}
                                onChange={(e) => setDropdownSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          {/* Add New Button */}
                          <div className="p-2 border-b border-gray-200">
                            <button
                              onClick={() => {
                                setShowAddTeamMemberModal(true);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Team Member
                            </button>
                          </div>
                          
                          {/* Team Members List */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredTeamMembers.length > 0 ? (
                              filteredTeamMembers.map((member, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSelectTeamMember(member)}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                                >
                                  {member}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                {dropdownSearchTerm ? 'No team members found matching your search' : 'No available team members'}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mdtForm.teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                          {member}
                        </div>
                        {mdtForm.teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Remove team member"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* MDT Outcome */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Outcome</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleMDTFormChange('outcome', 'Continue Active Surveillance')}
                      className={`w-full p-4 text-left border rounded transition-colors ${
                        mdtForm.outcome === 'Continue Active Surveillance' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Continue Active Surveillance</p>
                          <p className="text-sm text-gray-600">Patient remains on surveillance protocol</p>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleMDTFormChange('outcome', 'Proceed to Surgery')}
                      className={`w-full p-4 text-left border rounded transition-colors ${
                        mdtForm.outcome === 'Proceed to Surgery' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Proceed to Surgery</p>
                          <p className="text-sm text-gray-600">Schedule surgical intervention</p>
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleMDTFormChange('outcome', 'Radiation Therapy')}
                      className={`w-full p-4 text-left border rounded transition-colors ${
                        mdtForm.outcome === 'Radiation Therapy' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Radiation Therapy</p>
                          <p className="text-sm text-gray-600">Refer for radiation oncology</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Discussion Notes */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Discussion Notes</h4>
                  <textarea
                    value={mdtForm.discussionNotes}
                    onChange={(e) => handleMDTFormChange('discussionNotes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="6"
                    placeholder="Enter detailed MDT discussion notes, findings, and clinical reasoning..."
                  />
                </div>

                {/* Recommendations */}
                <div className="bg-white border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Recommendations</h4>
                  <textarea
                    value={mdtForm.recommendations}
                    onChange={(e) => handleMDTFormChange('recommendations', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter specific recommendations and next steps..."
                  />
                </div>

                {/* Follow-up Actions */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Follow-up Actions</h4>
                    <button
                      type="button"
                      onClick={addFollowUpAction}
                      className="flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Action
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mdtForm.followUpActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={action}
                          onChange={(e) => updateFollowUpAction(index, e.target.value)}
                          placeholder="e.g., Schedule pre-operative cardiology assessment"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {mdtForm.followUpActions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFollowUpAction(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Documents</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{mdtForm.documents.length} files</span>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded p-6 transition-all duration-200 ${
                      isDragOver
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <div className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                        isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <FileText className={`h-6 w-6 transition-colors ${
                          isDragOver ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                      
                      <h5 className={`text-base font-medium mb-2 transition-colors ${
                        isDragOver ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {isDragOver ? 'Drop files here' : 'Upload Documents'}
                      </h5>
                      
                      <p className="text-sm text-gray-500 mb-3">
                        Drag and drop files here, or{' '}
                        <label
                          htmlFor="document-upload"
                          className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium underline"
                        >
                          browse to choose files
                        </label>
                      </p>
                      
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                        <span>PDF, DOC, DOCX</span>
                        <span>JPG, PNG</span>
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {mdtForm.documents.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h5>
                      <div className="space-y-2">
                        {mdtForm.documents.map((document, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="p-2 bg-blue-100 rounded">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{document}</p>
                                <p className="text-xs text-gray-500">Ready to attach</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => console.log('Download:', document)}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Download document"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDocument(index)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title="Remove document"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeMDTNotesModal}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveMDTNote}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Save MDT Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {showAddTeamMemberModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full border border-gray-200 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Team Member</h3>
                    <p className="text-sm text-gray-600">Add a new team member to the MDT</p>
                  </div>
                </div>
                <button
                  onClick={closeAddTeamMemberModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the full name (Dr. will be added automatically)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department/Specialty *</label>
                <input
                  type="text"
                  value={newTeamMember.department}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Cardiologist, Nurse Practitioner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the medical specialty or department</p>
              </div>

              {/* Preview */}
              {newTeamMember.name.trim() && newTeamMember.department.trim() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">Preview:</p>
                  <p className="text-sm text-blue-700">
                    Dr. {newTeamMember.name.trim()} ({newTeamMember.department.trim()})
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeAddTeamMemberModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewTeamMember}
                  disabled={!newTeamMember.name.trim() || !newTeamMember.department.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Add Team Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientManagement;
