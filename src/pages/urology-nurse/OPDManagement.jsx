import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Eye,
  Calendar,
  X,
  ArrowRight,
  User,
  FileText,
  TrendingUp,
  Edit,
  Save,
  Check,
  Download,
  Plus,
  Upload
} from 'lucide-react';
import BookAppointmentModalWithPatient from '../../components/modals/BookAppointmentModalWithPatient';

const OPDManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('New Patient');
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [clinicalData, setClinicalData] = useState({
    currentPSA: '',
    psaDate: new Date().toISOString().split('T')[0],
    clinicalNotes: '',
    symptoms: '',
    familyHistory: '',
    medications: '',
    allergies: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: ''
    }
  });
  const [documents, setDocuments] = useState([]);
  const [isEditingDocuments, setIsEditingDocuments] = useState(false);

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
      dateOfEntry: '2024-01-10',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '15 minutes',
      priority: 'High',
      reason: 'Elevated PSA with abnormal DRE',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Urgent review required',
      clinicalDetails: 'PSA rising from 4.2 to 8.5 over 6 months. DRE reveals firm, irregular prostate.',
      comorbidities: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Metformin', 'Lisinopril'],
      familyHistory: 'Father had prostate cancer at age 70',
      psaCriteria: 'PSA >10 ng/mL',
      suggestedPathway: 'MDT Review',
      clinicalNotes: 'Patient reports urinary frequency and urgency. DRE shows firm, irregular prostate with nodularity in the right lobe.',
      symptoms: 'Urinary frequency, urgency, nocturia, weak stream',
      allergies: 'Penicillin, Sulfa drugs',
      vitalSigns: {
        bloodPressure: '145/90',
        heartRate: '78',
        temperature: '36.8',
        weight: '85.2'
      },
      documents: [
        {
          title: 'PSA Test Results',
          fileName: 'PSA_Results_2024_01_08.pdf',
          uploadDate: '2024-01-08'
        },
        {
          title: 'MRI Prostate Report',
          fileName: 'MRI_Prostate_2024_01_10.pdf',
          uploadDate: '2024-01-10'
        },
        {
          title: 'Digital Rectal Examination',
          fileName: 'DRE_Report_2024_01_12.pdf',
          uploadDate: '2024-01-12'
        }
      ]
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
      status: 'Scheduled Doctor Appointment',
      testStatus: 'Results Available',
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
      status: 'Waiting for Secondary Appointment',
      testStatus: 'Pending Results',
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
      dateOfEntry: '2024-01-12',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
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
      dateOfEntry: '2024-01-11',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '10 minutes',
      priority: 'High',
      reason: 'Rising PSA levels',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'PSA increased from 5.8 to 7.2'
    },
    {
      id: 'OPD006',
      patientName: 'William Davis',
      upi: 'URP2024010',
      age: 68,
      gender: 'Male',
      phone: '+61 456 789 123',
      referralSource: 'GP',
      latestPSA: 9.1,
      appointmentDate: '2024-01-15',
      appointmentTime: '3:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '25 minutes',
      priority: 'Urgent',
      reason: 'High PSA with urinary symptoms',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Patient reports urgency and frequency'
    },
    {
      id: 'OPD007',
      patientName: 'Christopher Lee',
      upi: 'URP2024011',
      age: 59,
      gender: 'Male',
      phone: '+61 467 890 234',
      referralSource: 'IPD',
      latestPSA: 4.2,
      appointmentDate: '2024-01-15',
      appointmentTime: '3:30 PM',
      status: 'Scheduled for Procedure',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Post-surgery follow-up',
      assignedUrologist: 'Dr. James Brown',
      notes: 'RALP performed 6 weeks ago'
    },
    {
      id: 'OPD008',
      patientName: 'Richard Taylor',
      upi: 'URP2024012',
      age: 73,
      gender: 'Male',
      phone: '+61 478 901 345',
      referralSource: 'GP',
      latestPSA: 6.5,
      appointmentDate: '2024-01-15',
      appointmentTime: '4:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '35 minutes',
      priority: 'High',
      reason: 'Abnormal DRE findings',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'GP noted firm nodule on DRE'
    },
    {
      id: 'OPD009',
      patientName: 'Thomas White',
      upi: 'URP2024013',
      age: 61,
      gender: 'Male',
      phone: '+61 489 012 456',
      referralSource: 'GP',
      latestPSA: 5.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '4:30 PM',
      status: 'Waiting for Secondary Appointment',
      testStatus: 'Pending Results',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Active surveillance monitoring',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Biopsy scheduled for next week'
    },
    {
      id: 'OPD010',
      patientName: 'Mark Johnson',
      upi: 'URP2024014',
      age: 56,
      gender: 'Male',
      phone: '+61 490 123 567',
      referralSource: 'GP',
      latestPSA: 3.9,
      appointmentDate: '2024-01-15',
      appointmentTime: '5:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '45 minutes',
      priority: 'Normal',
      reason: 'Annual PSA check',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Routine annual follow-up'
    },
    {
      id: 'OPD011',
      patientName: 'Steven Miller',
      upi: 'URP2024015',
      age: 64,
      gender: 'Male',
      phone: '+61 401 234 678',
      referralSource: 'IPD',
      latestPSA: 7.8,
      appointmentDate: '2024-01-15',
      appointmentTime: '5:30 PM',
      status: 'Completed',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Post-biopsy consultation',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Biopsy results: Gleason 7 (3+4)'
    },
    {
      id: 'OPD012',
      patientName: 'Kevin Garcia',
      upi: 'URP2024016',
      age: 52,
      gender: 'Male',
      phone: '+61 412 345 789',
      referralSource: 'GP',
      latestPSA: 4.6,
      appointmentDate: '2024-01-15',
      appointmentTime: '6:00 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '55 minutes',
      priority: 'Medium',
      reason: 'Family history screening',
      assignedUrologist: 'Dr. James Brown',
      notes: 'Father had prostate cancer at 65'
    },
    {
      id: 'OPD013',
      patientName: 'Daniel Martinez',
      upi: 'URP2024017',
      age: 69,
      gender: 'Male',
      phone: '+61 423 456 890',
      referralSource: 'GP',
      latestPSA: 8.9,
      appointmentDate: '2024-01-15',
      appointmentTime: '6:30 PM',
      status: 'Scheduled Doctor Appointment',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Urgent',
      reason: 'Rapidly rising PSA',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'PSA increased from 6.2 to 8.9 in 3 months'
    },
    {
      id: 'OPD014',
      patientName: 'Paul Rodriguez',
      upi: 'URP2024018',
      age: 57,
      gender: 'Male',
      phone: '+61 434 567 901',
      referralSource: 'IPD',
      latestPSA: 5.1,
      appointmentDate: '2024-01-15',
      appointmentTime: '7:00 PM',
      status: 'Scheduled for Procedure',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Scheduled for RALP next month'
    },
    {
      id: 'OPD015',
      patientName: 'Andrew Lewis',
      upi: 'URP2024019',
      age: 63,
      gender: 'Male',
      phone: '+61 445 678 012',
      referralSource: 'GP',
      latestPSA: 6.3,
      appointmentDate: '2024-01-15',
      appointmentTime: '7:30 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '65 minutes',
      priority: 'High',
      reason: 'Urinary retention episodes',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Patient reports 2 episodes of retention'
    },
    // Today's patients
    {
      id: 'OPD016',
      patientName: 'Robert Johnson',
      upi: 'URP2024020',
      age: 67,
      gender: 'Male',
      phone: '+61 456 789 123',
      referralSource: 'GP',
      latestPSA: 7.4,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '9:30 AM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '20 minutes',
      priority: 'High',
      reason: 'Elevated PSA with family history',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Father and brother had prostate cancer'
    },
    {
      id: 'OPD017',
      patientName: 'David Anderson',
      upi: 'URP2024021',
      age: 54,
      gender: 'Male',
      phone: '+61 467 890 234',
      referralSource: 'GP',
      latestPSA: 5.9,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '10:00 AM',
      status: 'In Consultation',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Routine PSA monitoring',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Annual follow-up appointment'
    },
    {
      id: 'OPD018',
      patientName: 'Michael Brown',
      upi: 'URP2024022',
      age: 71,
      gender: 'Male',
      phone: '+61 478 901 345',
      referralSource: 'IPD',
      latestPSA: 8.2,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '11:15 AM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Unavailable',
      waitTime: '35 minutes',
      priority: 'Urgent',
      reason: 'High PSA with urinary symptoms',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Patient reports nocturia and urgency'
    },
    {
      id: 'OPD019',
      patientName: 'James Wilson',
      upi: 'URP2024023',
      age: 59,
      gender: 'Male',
      phone: '+61 489 012 456',
      referralSource: 'GP',
      latestPSA: 4.3,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '2:00 PM',
      status: 'Awaiting Results',
      testStatus: 'Pending Results',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Post-biopsy follow-up',
      assignedUrologist: 'Dr. James Brown',
      notes: 'Biopsy performed 2 weeks ago'
    },
    {
      id: 'OPD020',
      patientName: 'William Taylor',
      upi: 'URP2024024',
      age: 66,
      gender: 'Male',
      phone: '+61 490 123 567',
      referralSource: 'GP',
      latestPSA: 6.7,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '3:30 PM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '50 minutes',
      priority: 'High',
      reason: 'Rising PSA trend',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'PSA increased from 4.8 to 6.7 over 6 months'
    },
    // Tomorrow's patients
    {
      id: 'OPD021',
      patientName: 'Christopher Davis',
      upi: 'URP2024025',
      age: 62,
      gender: 'Male',
      phone: '+61 401 234 678',
      referralSource: 'GP',
      latestPSA: 5.5,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '9:00 AM',
      status: 'Waiting for Scheduling',
      testStatus: 'Results Available',
      waitTime: '0 minutes',
      priority: 'Normal',
      reason: 'Annual PSA screening',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Routine annual check-up'
    },
    {
      id: 'OPD022',
      patientName: 'Richard Miller',
      upi: 'URP2024026',
      age: 68,
      gender: 'Male',
      phone: '+61 412 345 789',
      referralSource: 'IPD',
      latestPSA: 7.9,
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '10:30 AM',
      status: 'Awaiting Results',
      testStatus: 'Pending Results',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Sarah Wilson',
      notes: 'Awaiting pathology results from biopsy'
    },
    {
      id: 'OPD023',
      patientName: 'Edward Thompson',
      upi: 'URP2024027',
      age: 61,
      gender: 'Male',
      phone: '+61 423 456 890',
      referralSource: 'GP',
      latestPSA: 6.1,
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '2:00 PM',
      status: 'Awaiting Results',
      testStatus: 'Pending Results',
      waitTime: '0 minutes',
      priority: 'Medium',
      reason: 'Follow-up consultation',
      assignedUrologist: 'Dr. Michael Chen',
      notes: 'Awaiting MRI results and lab reports'
    },
    {
      id: 'OPD024',
      patientName: 'George Wilson',
      upi: 'URP2024028',
      age: 55,
      gender: 'Male',
      phone: '+61 434 567 901',
      referralSource: 'GP',
      latestPSA: 5.3,
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '11:00 AM',
      status: 'Scheduled',
      testStatus: 'Tests Ordered',
      waitTime: '0 minutes',
      priority: 'Normal',
      reason: 'Annual PSA monitoring',
      assignedUrologist: 'Dr. Emma Wilson',
      notes: 'Routine annual check-up scheduled'
    },
    {
      id: 'OPD025',
      patientName: 'Frank Davis',
      upi: 'URP2024029',
      age: 67,
      gender: 'Male',
      phone: '+61 445 678 012',
      referralSource: 'IPD',
      latestPSA: 8.3,
      appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      appointmentTime: '3:30 PM',
      status: 'Scheduled',
      testStatus: 'In Progress',
      waitTime: '0 minutes',
      priority: 'High',
      reason: 'Pre-operative assessment',
      assignedUrologist: 'Dr. Lisa Davis',
      notes: 'Scheduled for prostatectomy consultation'
    }
  ];



  const filteredOPDQueue = mockOPDQueue.filter(patient => {
    const searchMatch = searchTerm === '' || 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.assignedUrologist.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter based on active tab
    const statusMatch = 
      (activeFilter === 'New Patient' && patient.status === 'Waiting for Scheduling') ||
      (activeFilter === 'Appointment for Investigation' && patient.status === 'Scheduled for Procedure') ||
      (activeFilter === 'Appointment for Urologist' && (patient.status === 'Scheduled Doctor Appointment' || patient.status === 'Awaiting Results' || patient.status === 'Waiting for Secondary Appointment'));
    
    return searchMatch && statusMatch;
  });

  const handleBookAppointment = (patient) => {
    setSelectedPatientForAppointment(patient);
    setIsBookAppointmentModalOpen(true);
  };

  const handleAppointmentBooked = (appointmentData) => {
    console.log('Appointment booked:', appointmentData);
    // Here you would typically update the patient's status in your state management
    // For now, we'll just close the modal and show a success message
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
    alert('Appointment booked successfully!');
  };

  const handleCloseModal = () => {
    setIsBookAppointmentModalOpen(false);
    setSelectedPatientForAppointment(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting for Scheduling': return 'bg-red-100 text-red-800';
      case 'Scheduled Doctor Appointment': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled for Procedure': return 'bg-blue-100 text-blue-800';
      case 'Awaiting Results': return 'bg-purple-100 text-purple-800';
      case 'Waiting for Secondary Appointment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTestStatusColor = (testStatus) => {
    switch (testStatus) {
      case 'Results Available': return 'bg-green-100 text-green-800';
      case 'Results Unavailable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    setIsEditing(false);
    
    // Populate clinical data with existing patient data
    setClinicalData({
      currentPSA: patient.latestPSA?.toString() || '',
      psaDate: patient.dateOfEntry || new Date().toISOString().split('T')[0],
      clinicalNotes: patient.clinicalNotes || '',
      symptoms: patient.symptoms || '',
      familyHistory: patient.familyHistory || '',
      medications: patient.medications?.join(', ') || '',
      allergies: patient.allergies || '',
      vitalSigns: {
        bloodPressure: patient.vitalSigns?.bloodPressure || '',
        heartRate: patient.vitalSigns?.heartRate || '',
        temperature: patient.vitalSigns?.temperature || '',
        weight: patient.vitalSigns?.weight || ''
      }
    });
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
    setIsEditing(false);
    setDocuments([]);
    setIsEditingDocuments(false);
  };

  // Document handling functions
  const addDocument = () => {
    const newDocument = {
      id: Date.now(),
      title: '',
      file: null,
      fileName: ''
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (documentId) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
  };

  const updateDocumentTitle = (documentId, title) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId ? { ...doc, title } : doc
    ));
  };

  const handleFileUpload = (documentId, event) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments(documents.map(doc => 
        doc.id === documentId ? { ...doc, file, fileName: file.name } : doc
      ));
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Here you would typically save the changes to your backend
    console.log('Saving patient data:', {
      ...selectedPatient,
      clinicalData
    });
    
    // Update the selected patient with new data
    setSelectedPatient({
      ...selectedPatient,
      latestPSA: parseFloat(clinicalData.currentPSA) || selectedPatient.latestPSA,
      clinicalNotes: clinicalData.clinicalNotes,
      symptoms: clinicalData.symptoms,
      familyHistory: clinicalData.familyHistory,
      medications: clinicalData.medications.split(',').map(m => m.trim()).filter(m => m),
      allergies: clinicalData.allergies,
      vitalSigns: clinicalData.vitalSigns
    });
    
    setIsEditing(false);
    alert('Patient data updated successfully!');
  };




  return (
    <div className="space-y-6">
      {/* Page Header with Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OPD Management</h1>
              <p className="text-gray-600 mt-1">Track patients in OPD queue and manage consultation flow</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-4">
          <nav className="flex space-x-2" aria-label="Tabs">
            {['New Patient', 'Appointment for Investigation', 'Appointment for Urologist'].map((filter) => (
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
                    {mockOPDQueue.filter(patient => {
                       switch (filter) {
                         case 'New Patient': return patient.status === 'Waiting for Scheduling';
                         case 'Appointment for Investigation': return patient.status === 'Scheduled for Procedure';
                         case 'Appointment for Urologist': return patient.status === 'Scheduled Doctor Appointment' || patient.status === 'Awaiting Results' || patient.status === 'Waiting for Secondary Appointment';
                         default: return false;
                       }
                     }).length}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>

      </div>

      {/* OPD Queue Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-sm text-gray-600 mt-1">Patients waiting for urologist consultation</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, UPI, or urologist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
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

        <div className="overflow-x-auto">
          {filteredOPDQueue.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Date of Entry</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA Level</th>
                  {activeFilter === 'New Patient' && (
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Test Status</th>
                  )}
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOPDQueue.map((patient, index) => (
                  <tr key={patient.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {patient.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
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
                        <p className="font-medium text-gray-900">{patient.dateOfEntry || '2024-01-10'}</p>
                        <p className="text-sm text-gray-500">Entry Date</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{patient.latestPSA} ng/mL</p>
                        <p className="text-sm text-gray-500">Latest PSA</p>
                      </div>
                    </td>
                    {activeFilter === 'New Patient' && (
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTestStatusColor(patient.testStatus)}`}>
                          {patient.testStatus || 'Results Unavailable'}
                        </span>
                      </td>
                    )}
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        {patient.status === 'Waiting for Scheduling' && (
                          <>
                            <button 
                              onClick={() => handleBookAppointment(patient)}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Book Investigation</span>
                            </button>
                            <button 
                              onClick={() => handleBookAppointment(patient)}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Book Urologist</span>
                            </button>
                          </>
                        )}
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
                No patients in the OPD queue.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setActiveFilter('New Patient')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Show New Patients
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

      {/* Book Appointment Modal */}
      <BookAppointmentModalWithPatient
        isOpen={isBookAppointmentModalOpen}
        onClose={handleCloseModal}
        onAppointmentBooked={handleAppointmentBooked}
        selectedPatientData={selectedPatientForAppointment}
      />

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative top-4 mx-auto p-0 shadow-lg rounded-md bg-white max-w-6xl w-full min-w-[800px] mb-4 h-[90vh] flex flex-col">
            <div className="p-0 flex flex-col h-full">
              {/* Modal Header */}
              <div className="flex items-center justify-end p-3 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                  <button
                      onClick={handleEditToggle}
                      className="flex items-center px-4 py-2 rounded-lg transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                    </button>
                  )}
                <button
                  onClick={closePatientModal}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </button>
                </div>
              </div>

              {/* Patient Header Card */}
              <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    {/* Left side - Patient Information */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedPatient.patientName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-gray-900">{selectedPatient.patientName}</h1>
                        <p className="text-xs text-gray-600">UPI: {selectedPatient.upi}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(selectedPatient.status)}`}>
                            {selectedPatient.status.replace('_', ' ')}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-green-100 text-green-800">
                            Age: {selectedPatient.age} years
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
                            {selectedPatient.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Clinical Information */}
                    <div className="text-right">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Clinical Information</h3>
                      <p className="text-sm font-medium text-gray-900">Referral: {selectedPatient.referralSource}</p>
                      <p className="text-xs text-gray-600">Entry Date: {selectedPatient.dateOfEntry || '2024-01-10'}</p>
                      <p className="text-xs text-gray-500 mt-1">Urologist: {selectedPatient.assignedUrologist}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white flex flex-col flex-1 min-h-0">
                <div className="p-4 flex-1 overflow-y-auto">

                  {/* PSA Data Section */}
                  <div className="space-y-4 mb-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">PSA Data & Criteria</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            <div className="text-3xl font-bold text-blue-900">{selectedPatient.latestPSA}</div>
                            <div className="text-sm text-blue-700">ng/mL</div>
                            <div className="text-xs text-blue-600 mt-1">Latest PSA</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                            <div className="text-lg font-semibold text-green-900">{selectedPatient.psaCriteria || 'PSA 4-10 ng/mL'}</div>
                            <div className="text-sm text-green-700">PSA Criteria</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                            <div className="text-lg font-semibold text-purple-900">{selectedPatient.dateOfEntry || '2024-01-10'}</div>
                            <div className="text-sm text-purple-700">Test Date</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Comorbidities</h3>
                            <div className="space-y-2">
                              {(selectedPatient.comorbidities || []).map((comorbidity, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {comorbidity}
                                </span>
                              ))}
                              {(!selectedPatient.comorbidities || selectedPatient.comorbidities.length === 0) && (
                                <span className="text-sm text-gray-500">No comorbidities recorded</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Current Medications</h3>
                            <div className="space-y-2">
                              {(selectedPatient.medications || []).map((medication, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {medication}
                                </span>
                              ))}
                              {(!selectedPatient.medications || selectedPatient.medications.length === 0) && (
                                <span className="text-sm text-gray-500">No medications recorded</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Family History</h3>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{selectedPatient.familyHistory || 'No significant family history recorded'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Clinical Notes Section */}
                  <div className="space-y-4 mb-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Clinical Notes</h2>
                      
                      {isEditing ? (
                        <div className="space-y-4">
                            <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Clinical Notes
                          </label>
                          <textarea
                            value={clinicalData.clinicalNotes}
                            onChange={(e) => setClinicalData({...clinicalData, clinicalNotes: e.target.value})}
                              rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter clinical observations and notes..."
                          />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {clinicalData.clinicalNotes || 'No clinical notes available. Click "Edit Notes" to add clinical observations and notes.'}
                          </p>
                        </div>
                      )}
                    </div>
                        </div>

                  {/* Patient Assessment Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Patient Assessment</h2>

                        {/* Symptoms */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Symptoms
                          </label>
                        {isEditing ? (
                          <textarea
                            value={clinicalData.symptoms}
                            onChange={(e) => setClinicalData({...clinicalData, symptoms: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Describe patient symptoms..."
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 min-h-[2.5rem] flex items-center">
                            {clinicalData.symptoms || 'No symptoms recorded'}
                          </div>
                        )}
                        </div>

                        {/* Family History */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Family History
                          </label>
                        {isEditing ? (
                          <textarea
                            value={clinicalData.familyHistory}
                            onChange={(e) => setClinicalData({...clinicalData, familyHistory: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter relevant family medical history..."
                          />
                        ) : (
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 min-h-[2.5rem] flex items-center">
                            {clinicalData.familyHistory || 'No family history recorded'}
                          </div>
                        )}
                        </div>

                        {/* Medications and Allergies */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Current Medications
                            </label>
                          {isEditing ? (
                            <textarea
                              value={clinicalData.medications}
                              onChange={(e) => setClinicalData({...clinicalData, medications: e.target.value})}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="List current medications..."
                            />
                          ) : (
                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 min-h-[2.5rem] flex items-center">
                              {clinicalData.medications || 'No medications recorded'}
                            </div>
                          )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Allergies
                            </label>
                          {isEditing ? (
                            <textarea
                              value={clinicalData.allergies}
                              onChange={(e) => setClinicalData({...clinicalData, allergies: e.target.value})}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="List known allergies..."
                            />
                          ) : (
                            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 min-h-[2.5rem] flex items-center">
                              {clinicalData.allergies || 'No allergies recorded'}
                            </div>
                          )}
                          </div>
                        </div>

                        {/* Vital Signs */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-3">Vital Signs</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Blood Pressure
                              </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={clinicalData.vitalSigns.bloodPressure}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, bloodPressure: e.target.value}
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="120/80"
                              />
                            ) : (
                              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                {clinicalData.vitalSigns.bloodPressure || 'Not recorded'}
                              </div>
                            )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Heart Rate (bpm)
                              </label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={clinicalData.vitalSigns.heartRate}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, heartRate: e.target.value}
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="72"
                              />
                            ) : (
                              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                {clinicalData.vitalSigns.heartRate || 'Not recorded'}
                              </div>
                            )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Temperature (°C)
                              </label>
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                value={clinicalData.vitalSigns.temperature}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, temperature: e.target.value}
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="36.5"
                              />
                            ) : (
                              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                {clinicalData.vitalSigns.temperature || 'Not recorded'}
                              </div>
                            )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Weight (kg)
                              </label>
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.1"
                                value={clinicalData.vitalSigns.weight}
                                onChange={(e) => setClinicalData({
                                  ...clinicalData, 
                                  vitalSigns: {...clinicalData.vitalSigns, weight: e.target.value}
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="70.5"
                              />
                            ) : (
                              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                                {clinicalData.vitalSigns.weight || 'Not recorded'}
                              </div>
                            )}
                            </div>
                          </div>
                        </div>

                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-900">Documents & Test Results</h2>
                        <button
                          onClick={() => {
                            setIsEditingDocuments(true);
                            addDocument();
                          }}
                          className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Document
                        </button>
                      </div>
                      
                      {isEditingDocuments ? (
                        // Edit Mode - Add New Document
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700">Add New Document</h3>
                            <button
                              onClick={() => setIsEditingDocuments(false)}
                              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Done
                            </button>
                          </div>
                          
                          {/* New Document Form */}
                          {documents.length > 0 && (
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-700">New Document</h3>
                                <button
                                  onClick={() => {
                                    setDocuments([]);
                                    setIsEditingDocuments(false);
                                  }}
                                  className="flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:border-red-300 transition-colors"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Document Title
                                  </label>
                                  <input
                                    type="text"
                                    value={documents[0]?.title || ''}
                                    onChange={(e) => updateDocumentTitle(documents[0]?.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    placeholder="e.g., PSA Test Results, MRI Report, Biopsy Report"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Upload File
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="file"
                                      onChange={(e) => handleFileUpload(documents[0]?.id, e)}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
                                    />
                                    <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                                      <div className="flex items-center">
                                        <Upload className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">
                                          {documents[0]?.fileName || 'Choose file...'}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500">Browse</span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: PDF, DOC, DOCX, JPG, PNG, TIFF
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Existing Documents List */}
                          {selectedPatient.documents && selectedPatient.documents.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Documents</h3>
                              <div className="space-y-3">
                                {selectedPatient.documents.map((document, index) => (
                                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                          <FileText className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-gray-900">{document.title || `Document ${index + 1}`}</h3>
                                          <p className="text-xs text-gray-500">{document.fileName || 'No filename available'}</p>
                                          {document.uploadDate && (
                                            <p className="text-xs text-gray-400">Uploaded: {document.uploadDate}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
                                          <Download className="h-3 w-3 mr-1" />
                                          View
                                        </button>
                                        <button 
                                          onClick={() => {
                                            // Remove document from existing documents
                                            if (selectedPatient.documents && selectedPatient.documents.length > 0) {
                                              const updatedDocuments = selectedPatient.documents.filter((_, i) => i !== index);
                                              setSelectedPatient({
                                                ...selectedPatient,
                                                documents: updatedDocuments
                                              });
                                              console.log('Removed document:', document.title);
                                            }
                                          }}
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                        >
                                          <X className="h-3 w-3 mr-1" />
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                        </div>
                      ) : (
                        // View Mode - Display Existing Documents
                        <div>
                          {selectedPatient.documents && selectedPatient.documents.length > 0 ? (
                            <div className="space-y-3">
                              {selectedPatient.documents.map((document, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium text-gray-900">{document.title || `Document ${index + 1}`}</h3>
                                        <p className="text-xs text-gray-500">{document.fileName || 'No filename available'}</p>
                                        {document.uploadDate && (
                                          <p className="text-xs text-gray-400">Uploaded: {document.uploadDate}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors">
                                        <Download className="h-3 w-3 mr-1" />
                                        View
                                      </button>
                                      <button 
                                        onClick={() => {
                                          // Add edit functionality for existing documents
                                          const updatedDocuments = [...documents];
                                          const existingDoc = {
                                            id: Date.now() + index,
                                            title: document.title || `Document ${index + 1}`,
                                            fileName: document.fileName || '',
                                            file: null
                                          };
                                          updatedDocuments.push(existingDoc);
                                          setDocuments(updatedDocuments);
                                          setIsEditingDocuments(true);
                                        }}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                                      >
                                        <Edit className="h-3 w-3 mr-1" />
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => {
                                          // Remove document from existing documents
                                          if (selectedPatient.documents && selectedPatient.documents.length > 0) {
                                            const updatedDocuments = selectedPatient.documents.filter((_, i) => i !== index);
                                            // Update the selected patient's documents
                                            setSelectedPatient({
                                              ...selectedPatient,
                                              documents: updatedDocuments
                                            });
                                            console.log('Removed document:', document.title);
                                          }
                                        }}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-500 mb-2">No documents available</p>
                              <p className="text-xs text-gray-400">No test results or documents have been uploaded for this patient yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Button - Only show when editing */}
                        {isEditing && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                          <div className="pt-4 border-t border-gray-200">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setIsEditing(false)}
                              className="flex-1 flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveChanges}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.01]"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OPDManagement;
