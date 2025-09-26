import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp,
  Edit,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download
} from 'lucide-react';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBackPath } = useNavigation();
  
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock appointment data - in real app, fetch by ID
  const mockAppointment = {
    id: id,
    patientName: 'John Smith',
    patientId: 'PAT001',
    phone: '0412 345 678',
    email: 'john.smith@email.com',
    appointmentType: 'first_consultation',
    priority: 'high',
    date: '2024-01-15',
    time: '09:00',
    duration: 60,
    location: 'clinic',
    status: 'confirmed',
    notes: 'New referral from GP. Patient has elevated PSA levels.',
    referringDoctor: 'Dr. Sarah Johnson',
    reason: 'Elevated PSA (8.5 ng/mL) with abnormal DRE',
    createdAt: '2024-01-10T10:30:00Z',
    createdBy: 'Urology Nurse',
    lastModified: '2024-01-12T14:20:00Z'
  };

  const appointmentTypes = {
    first_consultation: { label: 'First Consultation', icon: User, description: 'Initial patient assessment' },
    follow_up: { label: 'Follow-up', icon: Stethoscope, description: 'Routine follow-up visit' },
    pre_op_assessment: { label: 'Pre-op Assessment', icon: Heart, description: 'Pre-surgical evaluation' },
    psa_review: { label: 'PSA Review', icon: Activity, description: 'PSA monitoring appointment' },
    surveillance: { label: 'Surveillance', icon: TrendingUp, description: 'Active surveillance monitoring' },
    consultation: { label: 'Consultation', icon: User, description: 'General consultation' }
  };

  const locations = {
    clinic: 'Main Clinic',
    hospital: 'Hospital OPD',
    telehealth: 'Telehealth'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-AU');
  };

  const appointmentType = appointmentTypes[mockAppointment.appointmentType];
  const TypeIcon = appointmentType?.icon || User;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
        <p className="text-gray-600 mt-1">View and manage appointment information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {mockAppointment.patientName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{mockAppointment.patientName}</h4>
                  <p className="text-sm text-gray-500">ID: {mockAppointment.patientId}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{mockAppointment.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{mockAppointment.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">Referred by: {mockAppointment.referringDoctor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Appointment Overview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Overview</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(mockAppointment.status)}`}>
                    {mockAppointment.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(mockAppointment.priority)}`}>
                    {mockAppointment.priority} priority
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Appointment Type</p>
                      <p className="text-lg font-semibold text-gray-900">{appointmentType?.label}</p>
                      <p className="text-sm text-gray-500">{appointmentType?.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(mockAppointment.date)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time & Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{mockAppointment.time}</p>
                      <p className="text-sm text-gray-500">{mockAppointment.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{locations[mockAppointment.location]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Appointment</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{mockAppointment.reason}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{mockAppointment.notes}</p>
                </div>
              </div>
            </div>

            {/* Appointment History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Appointment Created</p>
                      <p className="text-sm text-gray-500">by {mockAppointment.createdBy}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatDateTime(mockAppointment.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Modified</p>
                      <p className="text-sm text-gray-500">Appointment details updated</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{formatDateTime(mockAppointment.lastModified)}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status: Confirmed</p>
                      <p className="text-sm text-gray-500">Patient has been notified</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </button>
                <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
                <button className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
