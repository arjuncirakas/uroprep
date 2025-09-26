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
  Send
} from 'lucide-react';

const ReferralDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock discharge summary data - in real app, fetch by ID
  const mockDischargeSummary = {
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
    // Additional details for comprehensive view
    patientDetails: {
      dateOfBirth: '1965-03-15',
      phoneNumber: '+61 412 345 678',
      address: '123 Main Street, Melbourne VIC 3000',
      medicareNumber: '1234 56789 0',
      emergencyContact: 'Jane Smith (Wife)',
      emergencyPhone: '+61 412 345 679'
    },
    clinicalHistory: {
      presentingSymptoms: 'Elevated PSA, urinary frequency',
      comorbidities: 'Hypertension, Type 2 Diabetes',
      allergies: 'Penicillin',
      previousSurgeries: 'Appendectomy (1985)',
      familyHistory: 'Father - Prostate Cancer (age 72)'
    },
    operativeDetails: {
      operationDate: '2024-01-10',
      operationTime: '3 hours 45 minutes',
      bloodLoss: '200ml',
      complications: 'None',
      pathology: 'pT2c pN0 pMx, Gleason 7 (3+4), margins negative',
      lymphNodes: '12 nodes examined, all negative'
    },
    postOperative: {
      day1: 'Patient comfortable, mobilizing well, catheter draining clear',
      day2: 'Pain well controlled, diet advanced',
      day3: 'Continuing to improve, physiotherapy commenced',
      day4: 'Ready for discharge planning',
      day5: 'Catheter removed, voiding trial successful'
    }
  };

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
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'clinical', name: 'Clinical Details', icon: Activity },
    { id: 'operative', name: 'Operative Notes', icon: Target },
    { id: 'followup', name: 'Follow-up Plan', icon: Calendar }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/gp/discharge-summaries')}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Discharge Summaries
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
                    {mockDischargeSummary.patientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {mockDischargeSummary.readmissionRisk === 'High' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{mockDischargeSummary.patientName}</h1>
                <p className="text-sm text-gray-600">UPI: {mockDischargeSummary.upi}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(mockDischargeSummary.status)}`}>
                    {mockDischargeSummary.status}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md ${getRiskColor(mockDischargeSummary.readmissionRisk)}`}>
                    Risk: {mockDischargeSummary.readmissionRisk}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Discharge Date</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(mockDischargeSummary.dischargeDate)}</p>
              <p className="text-sm text-gray-500">
                LOS: {Math.ceil((new Date(mockDischargeSummary.dischargeDate) - new Date(mockDischargeSummary.admissionDate)) / (1000 * 60 * 60 * 24))} days
              </p>
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
                      <span className="text-gray-900">{mockDischargeSummary.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">UPI:</span>
                      <span className="text-gray-900">{mockDischargeSummary.upi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">DOB:</span>
                      <span className="text-gray-900">{formatDate(mockDischargeSummary.patientDetails.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-900">{mockDischargeSummary.patientDetails.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Address:</span>
                      <span className="text-gray-900 text-right">{mockDischargeSummary.patientDetails.address}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Clinical Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Procedure:</span>
                      <span className="text-gray-900 text-right">{mockDischargeSummary.procedure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Diagnosis:</span>
                      <span className="text-gray-900 text-right">{mockDischargeSummary.diagnosis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Surgeon:</span>
                      <span className="text-gray-900">{mockDischargeSummary.surgeon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Ward:</span>
                      <span className="text-gray-900">{mockDischargeSummary.ward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Discharge Destination:</span>
                      <span className="text-gray-900">{mockDischargeSummary.dischargeDestination}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Clinical Summary</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">{mockDischargeSummary.summary}</p>
                </div>
              </div>

              {/* Enhanced Medications Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Discharge Medications
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="space-y-3">
                    {mockDischargeSummary.medications.map((med, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-md border border-blue-100">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-xs font-semibold">{index + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{med}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-100 rounded-md">
                    <p className="text-xs text-blue-800 font-medium">
                      💊 Please ensure patient understands medication instructions and has adequate supply for discharge period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Details Tab */}
          {activeTab === 'clinical' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Clinical History</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Presenting Symptoms:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.clinicalHistory.presentingSymptoms}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Comorbidities:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.clinicalHistory.comorbidities}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Allergies:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.clinicalHistory.allergies}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Previous Surgeries:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.clinicalHistory.previousSurgeries}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Family History:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.clinicalHistory.familyHistory}</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">PSA Levels</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Pre-operative PSA:</span>
                      <span className="text-gray-900 font-semibold">{mockDischargeSummary.psaPreOp} ng/mL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">Post-operative PSA:</span>
                      <span className="text-gray-900 font-semibold">{mockDischargeSummary.psaPostOp} ng/mL</span>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">Significant reduction achieved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Post-Operative Progress</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-4 text-sm">
                    {Object.entries(mockDischargeSummary.postOperative).map(([day, notes]) => (
                      <div key={day} className="flex items-start space-x-4">
                        <span className="font-semibold text-gray-600 min-w-[60px] bg-white px-2 py-1 rounded border">{day}:</span>
                        <span className="text-gray-700 leading-relaxed">{notes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operative Notes Tab */}
          {activeTab === 'operative' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Operative Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Operation Date:</span>
                      <span className="text-gray-900">{formatDate(mockDischargeSummary.operativeDetails.operationDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Operation Time:</span>
                      <span className="text-gray-900">{mockDischargeSummary.operativeDetails.operationTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Blood Loss:</span>
                      <span className="text-gray-900">{mockDischargeSummary.operativeDetails.bloodLoss}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Complications:</span>
                      <span className="text-gray-900">{mockDischargeSummary.operativeDetails.complications}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 text-base">Pathology Results</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Pathology:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.operativeDetails.pathology}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Lymph Nodes:</span>
                      <p className="text-gray-900 mt-1">{mockDischargeSummary.operativeDetails.lymphNodes}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Surgical Team</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Surgeon:</span>
                        <span className="text-gray-900">{mockDischargeSummary.surgeon}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Anesthetist:</span>
                        <span className="text-gray-900">{mockDischargeSummary.anesthetist}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Follow-up Plan Tab */}
          {activeTab === 'followup' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Follow-up Instructions</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Follow-up Required:</span>
                    <span className="text-gray-900">{mockDischargeSummary.followUpRequired ? 'Yes' : 'No'}</span>
                  </div>
                  {mockDischargeSummary.nextAppointment && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Next Appointment:</span>
                      <span className="text-gray-900 font-semibold">{formatDate(mockDischargeSummary.nextAppointment)}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Instructions:</span>
                    <p className="text-gray-900 mt-1">{mockDischargeSummary.followUpInstructions}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base">Emergency Contact Information</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emergency Contact:</span>
                      <span className="text-gray-900">{mockDischargeSummary.patientDetails.emergencyContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Emergency Phone:</span>
                      <span className="text-gray-900">{mockDischargeSummary.patientDetails.emergencyPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Important Follow-up Notes</h4>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Patient should contact the urology department immediately if experiencing severe pain, 
                      fever, or difficulty urinating. Regular PSA monitoring is essential for ongoing care.
                    </p>
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

export default ReferralDetails;