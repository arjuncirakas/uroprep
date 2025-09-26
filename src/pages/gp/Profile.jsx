import React from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Award,
  Building,
  FileText,
  Users,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const GPProfile = () => {
  // Mock data - replace with actual data from Redux store
  const gpData = {
    name: 'Dr. Sarah Johnson',
    title: 'General Practitioner',
    practiceId: '789 990 123 768',
    email: 'sarah.johnson@medicalpractice.com.au',
    phone: '+61 2 9876 5432',
    address: '123 Medical Centre, Sydney NSW 2000',
    practice: 'Sydney Medical Centre',
    registrationNumber: 'MED123456',
    qualifications: ['MBBS', 'FRACGP', 'Dip. Child Health'],
    specializations: ['General Practice', 'Preventive Medicine', 'Chronic Disease Management'],
    experience: '15 years',
    languages: ['English', 'Spanish', 'French'],
    activePatients: 45,
    newThisMonth: 8,
    activeCases: 20,
    totalReferrals: 156,
    averageWaitTime: '12 days',
    cpcCompliance: 94
  };

  const recentActivity = [
    { id: 1, action: 'New referral submitted', patient: 'John Smith', date: '2024-01-15', time: '10:30 AM' },
    { id: 2, action: 'Discharge summary received', patient: 'Mary Johnson', date: '2024-01-14', time: '2:15 PM' },
    { id: 3, action: 'Follow-up appointment scheduled', patient: 'Robert Brown', date: '2024-01-13', time: '9:45 AM' },
    { id: 4, action: 'Patient status updated', patient: 'David Wilson', date: '2024-01-12', time: '4:20 PM' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">GP Profile</h1>
        <p className="text-sm text-gray-600 mt-1">Your practice profile and performance metrics</p>
      </div>
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{gpData.name}</h2>
              <p className="text-lg text-gray-600">{gpData.title}</p>
              <p className="text-sm text-gray-500 mt-1">{gpData.practice}</p>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Practice ID: {gpData.practiceId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Registration: {gpData.registrationNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{gpData.experience} experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 -m-6 mb-6 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-600 mt-1">Practice details and professional qualifications</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{gpData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{gpData.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">{gpData.address}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Qualifications</h4>
                <div className="flex flex-wrap gap-2">
                  {gpData.qualifications.map((qual, index) => (
                    <span key={index} className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm rounded-full border border-green-300">
                      {qual}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {gpData.languages.map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Patients"
            value={gpData.activePatients}
            icon={Users}
            color="bg-gradient-to-br from-green-800 to-black"
            subtitle="Currently under care"
          />
          <StatCard
            title="New This Month"
            value={gpData.newThisMonth}
            icon={TrendingUp}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
            subtitle="New referrals"
          />
          <StatCard
            title="Active Cases"
            value={gpData.activeCases}
            icon={Clock}
            color="bg-gradient-to-br from-yellow-500 to-orange-500"
            subtitle="Pending outcomes"
          />
          <StatCard
            title="Total Referrals"
            value={gpData.totalReferrals}
            icon={FileText}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            subtitle="All time"
          />
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 -m-6 mb-6 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
            <p className="text-sm text-gray-600 mt-1">Key performance indicators and quality metrics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">CPC Compliance</h4>
              <p className="text-2xl font-bold text-green-600">{gpData.cpcCompliance}%</p>
              <p className="text-sm text-gray-500">Above target (80%)</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Average Wait Time</h4>
              <p className="text-2xl font-bold text-blue-600">{gpData.averageWaitTime}</p>
              <p className="text-sm text-gray-500">Referral to consultation</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Referral Quality</h4>
              <p className="text-2xl font-bold text-purple-600">Excellent</p>
              <p className="text-sm text-gray-500">Complete documentation</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 -m-6 mb-6 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600 mt-1">Your latest actions and patient interactions</p>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl hover:shadow-md hover:border-green-300 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {activity.patient.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">Patient: {activity.patient}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.date}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default GPProfile;
