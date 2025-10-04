import React, { useState } from 'react';
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
  TestTube,
  FileX,
  X,
  ArrowUp,
  ArrowDown,
  Plus,
  RotateCcw,
  Grid3X3,
  MoreHorizontal
} from 'lucide-react';

const DischargeSummaryModal = ({ isOpen, onClose, patientId }) => {
  // Mock discharge summary data for different patients
  const mockDischargeSummaries = {
    'URP2024001': {
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
      acknowledged: true
    },
    'URP2024004': {
      id: 'DS004',
      patientName: 'David Wilson',
      upi: 'URP2024004',
      dischargeDate: '2024-01-05',
      admissionDate: '2024-01-03',
      procedure: 'Active Surveillance Review',
      diagnosis: 'Prostate Cancer - Low Risk',
      status: 'Discharged',
      followUpRequired: true,
      nextAppointment: '2024-12-05',
      followUpInstructions: 'Annual PSA monitoring, return to GP care',
      medications: ['Continue current medications'],
      complications: 'None',
      summary: 'Patient reviewed in OPD. PSA levels normalized to 3.1 ng/mL. No progression on imaging. Patient discharged to GP care with annual monitoring.',
      psaPreOp: 5.8,
      psaPostOp: 3.1,
      surgeon: 'Dr. Michael Chen',
      anesthetist: 'N/A',
      ward: 'OPD',
      dischargeDestination: 'GP Care',
      readmissionRisk: 'Very Low',
      acknowledged: true
    },
    'URP2024010': {
      id: 'DS010',
      patientName: 'Thomas Miller',
      upi: 'URP2024010',
      dischargeDate: '2023-11-15',
      admissionDate: '2023-11-15',
      procedure: 'OPD Review and PSA Monitoring',
      diagnosis: 'Benign Prostatic Hyperplasia',
      status: 'Discharged',
      followUpRequired: false,
      nextAppointment: null,
      followUpInstructions: 'Returned to GP care, annual PSA monitoring',
      medications: ['Continue current medications'],
      complications: 'None',
      summary: 'Patient reviewed in OPD. PSA levels normalized to 2.1 ng/mL. No evidence of malignancy. Patient returned to GP care with annual monitoring.',
      psaPreOp: 4.5,
      psaPostOp: 2.1,
      surgeon: 'Dr. Lisa Anderson',
      anesthetist: 'N/A',
      ward: 'OPD',
      dischargeDestination: 'GP Care',
      readmissionRisk: 'Very Low',
      acknowledged: true
    },
    'URP2024011': {
      id: 'DS011',
      patientName: 'Jennifer Taylor',
      upi: 'URP2024011',
      dischargeDate: '2023-10-20',
      admissionDate: '2023-10-20',
      procedure: 'OPD Review and PSA Monitoring',
      diagnosis: 'Normal PSA Levels',
      status: 'Discharged',
      followUpRequired: false,
      nextAppointment: null,
      followUpInstructions: 'Patient completed treatment, returned to GP management',
      medications: [],
      complications: 'None',
      summary: 'Patient reviewed in OPD. PSA levels normalized to 1.8 ng/mL. No evidence of malignancy. Patient completed treatment and returned to GP management.',
      psaPreOp: 4.2,
      psaPostOp: 1.8,
      surgeon: 'Dr. Michael Chen',
      anesthetist: 'N/A',
      ward: 'OPD',
      dischargeDestination: 'GP Care',
      readmissionRisk: 'Very Low',
      acknowledged: true
    }
  };

  // Get discharge summary data based on patientId, fallback to first patient if not found
  const mockDischargeSummary = mockDischargeSummaries[patientId] || mockDischargeSummaries['URP2024001'];

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

  const getAcknowledgedColor = (acknowledged) => {
    return acknowledged 
      ? 'bg-green-100 text-green-800' 
      : 'bg-amber-100 text-amber-800';
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

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClose}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Discharge Summary</h1>
              <p className="text-sm text-gray-600">Patient: {mockDischargeSummary.patientName} - {mockDischargeSummary.upi}</p>
            </div>
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
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
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
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{mockDischargeSummary.patientName}</h2>
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

          {/* Discharge Summary Details */}
          <div className="space-y-6">
            {/* Procedure and Diagnosis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-gray-600" />
                  Procedure
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Procedure:</span>
                    <p className="text-gray-900 mt-1">{mockDischargeSummary.procedure}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Diagnosis:</span>
                    <p className="text-gray-900 mt-1">{mockDischargeSummary.diagnosis}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Complications:</span>
                    <p className="text-gray-900 mt-1">{mockDischargeSummary.complications}</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  Medical Team
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Surgeon:</span>
                    <span className="text-gray-900">{mockDischargeSummary.surgeon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Anesthetist:</span>
                    <span className="text-gray-900">{mockDischargeSummary.anesthetist}</span>
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

            {/* PSA Values */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                <TestTube className="w-4 h-4 text-gray-600" />
                PSA Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Pre-operative PSA:</span>
                    <span className={`text-lg font-semibold ${
                      mockDischargeSummary.psaPreOp > 10 ? 'text-red-600' : 
                      mockDischargeSummary.psaPreOp > 4 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {mockDischargeSummary.psaPreOp} ng/mL
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Post-operative PSA:</span>
                    <span className={`text-lg font-semibold ${
                      mockDischargeSummary.psaPostOp > 10 ? 'text-red-600' : 
                      mockDischargeSummary.psaPostOp > 4 ? 'text-amber-600' : 
                      'text-green-600'
                    }`}>
                      {mockDischargeSummary.psaPostOp} ng/mL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                Clinical Summary
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{mockDischargeSummary.summary}</p>
              </div>
            </div>

            {/* Follow-up Information */}
            {mockDischargeSummary.followUpRequired && (
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  Follow-up Information
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Next Appointment:</span>
                      <span className="text-gray-900 font-semibold">{formatDate(mockDischargeSummary.nextAppointment)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Follow-up Instructions:</span>
                      <p className="text-gray-700 mt-1">{mockDischargeSummary.followUpInstructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Discharge Medications */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                <Pill className="w-4 h-4 text-gray-600" />
                Discharge Medications
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  {mockDischargeSummary.medications.map((med, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-100">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-xs font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{med}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acknowledgment Status */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-600" />
                Acknowledgment Status
              </h3>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getAcknowledgedColor(mockDischargeSummary.acknowledged)}`}>
                  {mockDischargeSummary.acknowledged ? 'Acknowledged by GP' : 'Pending Acknowledgment'}
                </span>
                {!mockDischargeSummary.acknowledged && (
                  <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-colors">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeSummaryModal;
