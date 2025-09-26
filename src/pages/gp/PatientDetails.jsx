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
  MapPin
} from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data - in real app, fetch by ID
  const mockPatient = {
    id: 'URP2024001',
    name: 'John Smith',
    dob: '1965-03-15',
    medicare: '1234567890',
    phone: '0412 345 678',
    address: '123 Main Street, Melbourne VIC 3000',
    emergencyContact: 'Jane Smith (Wife)',
    emergencyPhone: '0412 345 679',
    currentStatus: 'Active Surveillance',
    lastPSA: { value: 6.2, date: '2024-01-10' },
    referrals: [
      { id: 1, date: '2023-06-15', reason: 'PSA 8.5', status: 'Completed', outcome: 'Active Surveillance' },
      { id: 2, date: '2024-01-10', reason: 'Routine follow-up', status: 'Active', outcome: null }
    ],
    psaHistory: [
      { value: 8.5, date: '2023-06-15', velocity: null },
      { value: 7.8, date: '2023-09-20', velocity: -0.23 },
      { value: 6.2, date: '2024-01-10', velocity: -0.53 }
    ],
    appointments: [
      { date: '2024-04-15', type: 'Follow-up', status: 'Scheduled', location: 'Urology Clinic' },
      { date: '2024-07-15', type: 'PSA Review', status: 'Scheduled', location: 'Urology Clinic' }
    ],
    clinicalHistory: {
      presentingSymptoms: 'Elevated PSA, urinary frequency',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      allergies: 'Penicillin',
      currentMedications: ['Metformin 500mg BD', 'Lisinopril 10mg daily', 'Tamsulosin 0.4mg daily'],
      familyHistory: 'Father - Prostate Cancer (age 72), Mother - Breast Cancer (age 68)',
      socialHistory: 'Non-smoker, occasional alcohol, retired engineer'
    },
    imaging: [
      { type: 'MRI Prostate', date: '2023-06-20', result: 'PIRADS 3 lesion in left peripheral zone' },
      { type: 'CT Abdomen/Pelvis', date: '2023-06-25', result: 'No evidence of metastatic disease' }
    ],
    procedures: [
      { type: 'Prostate Biopsy', date: '2023-07-10', result: 'Gleason 6 (3+3), 2/12 cores positive' },
      { type: 'Repeat Biopsy', date: '2024-01-15', result: 'Gleason 6 (3+3), 1/12 cores positive' }
    ],
    dischargeSummaries: [
      {
        id: 'DS001',
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
        dischargeDate: '2023-06-20',
        admissionDate: '2023-06-20',
        procedure: 'Active Surveillance - OPD Review',
        diagnosis: 'Prostate Cancer - Gleason 6 (3+3)',
        status: 'Discharged to GP',
        followUpRequired: true,
        nextAppointment: '2023-12-20',
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
        acknowledged: true
      }
    ]
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
      case 'Active Surveillance': return 'bg-blue-100 text-blue-800';
      case 'Post-Surgery': return 'bg-green-100 text-green-800';
      case 'Awaiting Triage': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled for Surgery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDischargeStatusColor = (status) => {
    switch (status) {
      case 'Discharged': return 'bg-green-100 text-green-800';
      case 'Discharged to GP': return 'bg-blue-100 text-blue-800';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Very Low': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'clinical', name: 'Clinical History', icon: Stethoscope },
    { id: 'psa', name: 'PSA History', icon: TrendingUp },
    { id: 'appointments', name: 'Appointments', icon: CalendarIcon },
    { id: 'discharge', name: 'Discharge Summaries', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/gp/patient-search')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient Search
          </button>
        </div>
        <div className="flex items-center space-x-3">
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
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {mockPatient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{mockPatient.name}</h1>
                <p className="text-sm text-gray-600">UPI: {mockPatient.id}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(mockPatient.currentStatus)}`}>
                    {mockPatient.currentStatus}
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
                      <span className="font-medium text-gray-600">UPI:</span>
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

          {/* PSA History Tab */}
          {activeTab === 'psa' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base">PSA Trend Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Latest PSA</p>
                    <p className="text-lg font-semibold text-blue-600">{mockPatient.lastPSA.value} ng/mL</p>
                    <p className="text-xs text-gray-500">{formatDate(mockPatient.lastPSA.date)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">PSA Velocity</p>
                    <p className="text-lg font-semibold text-green-600">-0.53 ng/mL/year</p>
                    <p className="text-xs text-gray-500">Improving trend</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Time in Surveillance</p>
                    <p className="text-lg font-semibold text-gray-600">8 months</p>
                    <p className="text-xs text-gray-500">Since first referral</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">PSA History</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.psaHistory.map((psa, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            psa.value > 10 ? 'bg-red-500' : 
                            psa.value > 4 ? 'bg-amber-500' : 
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

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Upcoming Appointments</h3>
                  <div className="space-y-3">
                    {mockPatient.appointments
                      .filter(apt => apt.status === 'Scheduled')
                      .map((appointment, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{appointment.type}</p>
                            <p className="text-sm text-gray-600">{formatDate(appointment.date)}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Appointment History</h3>
                  <div className="space-y-3">
                    {mockPatient.appointments
                      .filter(apt => apt.status === 'Completed')
                      .map((appointment, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">{appointment.type}</p>
                            <p className="text-sm text-gray-600">{formatDate(appointment.date)}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {appointment.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Referral History</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockPatient.referrals.map((referral) => (
                      <div key={referral.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{referral.reason}</p>
                            <p className="text-sm text-gray-600">{formatDate(referral.date)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              referral.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {referral.status}
                            </span>
                            {referral.outcome && (
                              <p className="text-sm text-gray-600 mt-1">Outcome: {referral.outcome}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Discharge Summaries Tab */}
          {activeTab === 'discharge' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Discharge Summaries</h3>
                <div className="space-y-4">
                  {mockPatient.dischargeSummaries.map((summary, index) => (
                    <div key={summary.id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {summary.id}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{summary.procedure}</h4>
                            <p className="text-sm text-gray-600">{summary.diagnosis}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Discharge Date</p>
                          <p className="text-lg font-semibold text-gray-900">{formatDate(summary.dischargeDate)}</p>
                          <p className="text-sm text-gray-500">
                            LOS: {Math.ceil((new Date(summary.dischargeDate) - new Date(summary.admissionDate)) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Status:</span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getDischargeStatusColor(summary.status)}`}>
                              {summary.status}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Surgeon:</span>
                            <span className="text-gray-900">{summary.surgeon}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Ward:</span>
                            <span className="text-gray-900">{summary.ward}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Readmission Risk:</span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(summary.readmissionRisk)}`}>
                              {summary.readmissionRisk}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Pre-op PSA:</span>
                            <span className="text-gray-900">{summary.psaPreOp} ng/mL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Post-op PSA:</span>
                            <span className="text-gray-900">{summary.psaPostOp} ng/mL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Complications:</span>
                            <span className="text-gray-900">{summary.complications}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Acknowledged:</span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              summary.acknowledged ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {summary.acknowledged ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2 text-sm">Clinical Summary</h5>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-700 leading-relaxed">{summary.summary}</p>
                        </div>
                      </div>

                      {summary.followUpRequired && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2 text-sm">Follow-up Instructions</h5>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Next Appointment:</span>
                                <span className="text-gray-900 font-semibold">{formatDate(summary.nextAppointment)}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Instructions:</span>
                                <p className="text-gray-700 mt-1">{summary.followUpInstructions}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 text-sm">Discharge Medications</h5>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="space-y-2">
                            {summary.medications.map((med, medIndex) => (
                              <div key={medIndex} className="flex items-center space-x-3 p-2 bg-white rounded-md border border-gray-100">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-600 text-xs font-semibold">{medIndex + 1}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{med}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
