import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  TrendingUp,
  Target,
  Zap,
  Bell,
  Share,
  Printer,
  Send,
  Heart,
  Stethoscope,
  Pill,
  Calendar as CalendarIcon,
  MapPin,
  Edit,
  Plus,
  Eye,
  Database
} from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data - in real app, fetch by ID
  const mockPatient = {
    id: 'URP001',
    name: 'John Smith',
    dob: '1959-03-15',
    medicare: '1234567890',
    phone: '+61 412 345 678',
    email: 'john.smith@email.com',
    address: '123 Main St, Melbourne VIC 3000',
    emergencyContact: 'Jane Smith (Wife)',
    emergencyPhone: '+61 412 345 679',
    currentStatus: 'OPD Queue',
    currentDatabase: 'DB1',
    lastPSA: { value: 25.4, date: '2024-01-10' },
    gleasonScore: '4+3=7',
    stage: 'T2b',
    referrals: [
      { id: 1, date: '2024-01-10', reason: 'Elevated PSA with family history', status: 'Active', outcome: null, referringGP: 'Dr. Sarah Johnson' }
    ],
    psaHistory: [
      { value: 25.4, date: '2024-01-10', velocity: null },
      { value: 18.7, date: '2023-12-15', velocity: 2.23 },
      { value: 15.2, date: '2023-09-20', velocity: 1.17 }
    ],
    appointments: [
      { id: 'APT001', date: '2024-01-15', type: 'Initial Consultation', status: 'Completed', location: 'Urology Clinic', time: '9:00 AM' },
      { id: 'APT002', date: '2024-01-22', type: 'Follow-up', status: 'Scheduled', location: 'Urology Clinic', time: '10:30 AM' },
      { id: 'APT003', date: '2024-02-15', type: 'Surgery Consultation', status: 'Scheduled', location: 'Urology Clinic', time: '2:00 PM' }
    ],
    clinicalHistory: {
      presentingSymptoms: 'Elevated PSA, urinary frequency, family history of prostate cancer',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      allergies: 'Penicillin',
      currentMedications: ['Metformin 500mg BD', 'Lisinopril 10mg daily', 'Tamsulosin 0.4mg daily'],
      familyHistory: 'Father - Prostate Cancer (age 72), Mother - Breast Cancer (age 68)',
      socialHistory: 'Non-smoker, occasional alcohol, retired engineer'
    },
    imaging: [
      { type: 'MRI Prostate', date: '2024-01-12', result: 'PIRADS 4 lesion in left peripheral zone, suspicious for malignancy' },
      { type: 'CT Abdomen/Pelvis', date: '2024-01-15', result: 'No evidence of metastatic disease' },
      { type: 'Bone Scan', date: '2024-01-16', result: 'No evidence of bone metastases' }
    ],
    procedures: [
      { type: 'Prostate Biopsy', date: '2024-01-18', result: 'Gleason 7 (4+3), 6/12 cores positive, bilateral involvement' },
      { type: 'PSMA PET Scan', date: '2024-01-20', result: 'No evidence of distant metastases' }
    ],
    surgicalPathway: {
      surgeryDate: '2024-02-15',
      surgeryType: 'RALP',
      surgeon: 'Dr. Michael Chen',
      anesthetist: 'Dr. Sarah Williams',
      preoperativeAssessment: 'Completed',
      consentObtained: true,
      bloodWork: 'Completed',
      anesthesiaAssessment: 'Completed'
    },
    dischargeSummaries: [],
    surveillanceData: null
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPD Queue': return 'bg-blue-100 text-blue-800';
      case 'Active Surveillance': return 'bg-green-100 text-green-800';
      case 'Surgery Scheduled': return 'bg-orange-100 text-orange-800';
      case 'Post-Op Follow-Up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDatabaseColor = (database) => {
    switch (database) {
      case 'DB1': return 'bg-blue-100 text-blue-800';
      case 'DB2': return 'bg-green-100 text-green-800';
      case 'DB3': return 'bg-orange-100 text-orange-800';
      case 'DB4': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'clinical', name: 'Clinical History', icon: Stethoscope },
    { id: 'surgical', name: 'Surgical Pathway', icon: Heart },
    { id: 'appointments', name: 'Appointments', icon: CalendarIcon },
    { id: 'imaging', name: 'Imaging & Procedures', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/urologist/patient-management')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient Management
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {mockPatient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{mockPatient.name}</h1>
                <p className="text-sm text-gray-600">ID: {mockPatient.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(mockPatient.currentStatus)}`}>
                    {mockPatient.currentStatus}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getDatabaseColor(mockPatient.currentDatabase)}`}>
                    {mockPatient.currentDatabase}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-green-100 text-green-800">
                    Age: {calculateAge(mockPatient.dob)} years
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Latest PSA</p>
              <p className="text-lg font-semibold text-gray-900">{mockPatient.lastPSA.value} ng/mL</p>
              <p className="text-sm text-gray-500">{formatDate(mockPatient.lastPSA.date)}</p>
              {mockPatient.gleasonScore && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Gleason Score</p>
                  <p className="text-lg font-semibold text-gray-900">{mockPatient.gleasonScore}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Patient Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-900">{mockPatient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">ID:</span>
                      <span className="text-gray-900">{mockPatient.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">DOB:</span>
                      <span className="text-gray-900">{formatDate(mockPatient.dob)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Age:</span>
                      <span className="text-gray-900">{calculateAge(mockPatient.dob)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Medicare:</span>
                      <span className="text-gray-900">{mockPatient.medicare}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Contact Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-900">{mockPatient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-gray-900">{mockPatient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Address:</span>
                      <span className="text-gray-900 text-right">{mockPatient.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emergency Contact:</span>
                      <span className="text-gray-900">{mockPatient.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emergency Phone:</span>
                      <span className="text-gray-900">{mockPatient.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base">PSA History</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.psaHistory.map((psa, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            psa.value > 20 ? 'bg-red-500' : 
                            psa.value > 10 ? 'bg-orange-500' : 
                            psa.value > 4 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{psa.value} ng/mL</p>
                            <p className="text-sm text-gray-600">{formatDate(psa.date)}</p>
                          </div>
                        </div>
                        {psa.velocity && (
                          <div className="text-right">
                            <p className={`text-sm font-medium ${psa.velocity > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {psa.velocity > 0 ? '+' : ''}{psa.velocity.toFixed(2)} ng/mL/year
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical History Tab */}
          {activeTab === 'clinical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Clinical History</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Presenting Symptoms:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.presentingSymptoms}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Comorbidities:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.comorbidities}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Allergies:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.allergies}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Family History:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.familyHistory}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Social History:</span>
                      <p className="text-gray-900 mt-1">{mockPatient.clinicalHistory.socialHistory}</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Current Medications</h3>
                  <div className="space-y-3">
                    {mockPatient.clinicalHistory.currentMedications.map((med, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-xs font-semibold">{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Referral Information</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.referrals.map((referral, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">Referral from {referral.referringGP}</p>
                          <p className="text-sm text-gray-600">{formatDate(referral.date)}</p>
                          <p className="text-sm text-gray-700 mt-1">{referral.reason}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          referral.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {referral.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Surgical Pathway Tab */}
          {activeTab === 'surgical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Surgery Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Surgery Date:</span>
                      <span className="text-gray-900 font-semibold">{formatDate(mockPatient.surgicalPathway.surgeryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Surgery Type:</span>
                      <span className="text-gray-900">{mockPatient.surgicalPathway.surgeryType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Surgeon:</span>
                      <span className="text-gray-900">{mockPatient.surgicalPathway.surgeon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Anesthetist:</span>
                      <span className="text-gray-900">{mockPatient.surgicalPathway.anesthetist}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Pre-operative Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Preoperative Assessment</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Consent Obtained</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Blood Work</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Anesthesia Assessment</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-base">Appointments</h3>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="space-y-3">
                  {mockPatient.appointments.map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{appointment.type}</p>
                            <p className="text-sm text-gray-600">{formatDate(appointment.date)} at {appointment.time}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>View</span>
                          </button>
                          <button className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Reschedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Imaging & Procedures Tab */}
          {activeTab === 'imaging' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Imaging Results</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.imaging.map((image, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{image.type}</p>
                          <p className="text-sm text-gray-600">{formatDate(image.date)}</p>
                          <p className="text-sm text-gray-700 mt-1">{image.result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Procedures</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.procedures.map((procedure, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div>
                          <p className="font-medium text-gray-900">{procedure.type}</p>
                          <p className="text-sm text-gray-600">{formatDate(procedure.date)}</p>
                          <p className="text-sm text-gray-700 mt-1">{procedure.result}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
