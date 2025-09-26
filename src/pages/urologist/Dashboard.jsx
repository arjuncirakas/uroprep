import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  AlertTriangle, 
  ClipboardList, 
  Stethoscope, 
  Users,
  TrendingUp,
  Clock,
  FileText,
  Activity,
  Database,
  Heart,
  Bell,
  Target,
  Zap,
  Shield,
  BarChart3,
  Eye,
  Edit,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  User
} from 'lucide-react';

const UrologistDashboard = () => {
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const { alerts } = useSelector(state => state.alerts);
  
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Calculate required KPIs only
  const calculateKPIs = () => {
    const totalReferrals = referrals.length;
    const avgWaitTime = referrals.reduce((acc, r) => {
      const waitTime = new Date() - new Date(r.referralDate);
      return acc + (waitTime / (1000 * 60 * 60 * 24)); // days
    }, 0) / totalReferrals;
    
    const dischargedToGP = referrals.filter(r => r.outcome === 'discharged_gp').length;
    const referredToMDT = referrals.filter(r => r.outcome === 'mdt_referral').length;
    const surveillanceCompliance = db2.patients.length > 0 ? 
      (db2.patients.filter(p => p.lastAppointment && new Date(p.lastAppointment) > new Date(Date.now() - 30*24*60*60*1000)).length / db2.patients.length * 100).toFixed(1) : 100;
    
    return {
      avgWaitTime: avgWaitTime.toFixed(1),
      dischargedToGP: ((dischargedToGP / totalReferrals) * 100).toFixed(1),
      referredToMDT: ((referredToMDT / totalReferrals) * 100).toFixed(1),
      surveillanceCompliance
    };
  };

  const kpis = calculateKPIs();

  const priorityStats = {
    urgentReferrals: referrals.filter(r => r.priority === 'urgent' && r.status === 'pending').length,
    awaitingDecisions: db1.patients.filter(p => !p.clinicalDecision).length,
    tomorrowSurgeries: db3.patients.filter(p => new Date(p.surgeryDate) <= new Date(Date.now() + 24*60*60*1000)).length,
    overdueFollowups: db4.patients.filter(p => p.nextAppointment && new Date(p.nextAppointment) < new Date()).length
  };

  const workloadStats = {
    db1: db1.patients.length,
    db2: db2.patients.length,
    db3: db3.patients.length,
    db4: db4.patients.length,
    mdtPending: referrals.filter(r => r.status === 'mdt_pending').length
  };

  const enhancedUrgentReferrals = [
    { 
      id: 1, 
      name: 'John Smith', 
      age: 65, 
      psa: 25.4, 
      summary: 'PSA 25.4, ?prostate cancer', 
      priority: 'High',
      phone: '+61 412 345 678',
      email: 'john.smith@email.com',
      address: '123 Main St, Melbourne VIC 3000',
      referringGP: 'Dr. Sarah Johnson',
      referralDate: '2024-01-10',
      clinicalNotes: 'Patient presents with elevated PSA and family history of prostate cancer. DRE reveals firm nodule in left lobe.',
      imaging: 'MRI scheduled for next week',
      comorbidities: 'Hypertension, Type 2 Diabetes'
    },
    { 
      id: 2, 
      name: 'Mary Johnson', 
      age: 58, 
      psa: 18.7, 
      summary: 'PSA 18.7, clinical concerns', 
      priority: 'High',
      phone: '+61 423 456 789',
      email: 'mary.johnson@email.com',
      address: '456 Oak Ave, Sydney NSW 2000',
      referringGP: 'Dr. Michael Chen',
      referralDate: '2024-01-12',
      clinicalNotes: 'Rapidly rising PSA over 6 months. Patient reports urinary symptoms and weight loss.',
      imaging: 'CT scan completed - no distant metastases',
      comorbidities: 'Obesity'
    },
    { 
      id: 3, 
      name: 'Robert Brown', 
      age: 72, 
      psa: 12.3, 
      summary: 'PSA 12.3, routine referral', 
      priority: 'Medium',
      phone: '+61 434 567 890',
      email: 'robert.brown@email.com',
      address: '789 Pine Rd, Brisbane QLD 4000',
      referringGP: 'Dr. David Wilson',
      referralDate: '2024-01-14',
      clinicalNotes: 'Stable PSA over 2 years. Patient asymptomatic. Routine surveillance referral.',
      imaging: 'PSMA PET scan negative',
      comorbidities: 'None'
    },
  ];

  const enhancedTomorrowSurgeries = [
    { 
      id: 1, 
      name: 'David Wilson', 
      type: 'RALP', 
      time: '09:00', 
      theatre: 'Theatre 1', 
      checklist: 'Complete',
      age: 68,
      psa: 8.5,
      gleasonScore: '3+4=7',
      stage: 'T2a',
      phone: '+61 445 678 901',
      email: 'david.wilson@email.com',
      address: '321 Elm St, Perth WA 6000',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Michael Chen',
      estimatedDuration: '4 hours',
      specialRequirements: 'Cardiac monitoring required'
    },
    { 
      id: 2, 
      name: 'Sarah Davis', 
      type: 'Open Prostatectomy', 
      time: '14:00', 
      theatre: 'Theatre 2', 
      checklist: 'Complete',
      age: 71,
      psa: 15.2,
      gleasonScore: '4+3=7',
      stage: 'T2b',
      phone: '+61 456 789 012',
      email: 'sarah.davis@email.com',
      address: '654 Maple Dr, Adelaide SA 5000',
      surgeon: 'Dr. Sarah Johnson',
      anesthetist: 'Dr. Jennifer Lee',
      estimatedDuration: '5 hours',
      specialRequirements: 'None'
    },
  ];

  const enhancedMdtCases = [
    { 
      id: 1, 
      name: 'Michael Miller', 
      psa: 15.2, 
      imaging: 'MRI completed', 
      status: 'Pending Review',
      age: 69,
      gleasonScore: '4+4=8',
      stage: 'T3a',
      phone: '+61 467 890 123',
      email: 'michael.miller@email.com',
      address: '987 Cedar Ln, Hobart TAS 7000',
      clinicalNotes: 'High-risk prostate cancer. MRI shows extracapsular extension. PSMA PET scan shows no distant metastases.',
      mdtDate: '2024-01-20',
      teamMembers: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Jennifer Lee', 'Dr. David Wilson']
    },
    { 
      id: 2, 
      name: 'Jennifer Wilson', 
      psa: 8.7, 
      imaging: 'CT completed', 
      status: 'Pending Review',
      age: 64,
      gleasonScore: '3+4=7',
      stage: 'T2c',
      phone: '+61 478 901 234',
      email: 'jennifer.wilson@email.com',
      address: '147 Birch St, Darwin NT 0800',
      clinicalNotes: 'Intermediate-risk prostate cancer. CT shows no lymph node involvement. Patient prefers active surveillance.',
      mdtDate: '2024-01-22',
      teamMembers: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Jennifer Lee', 'Dr. David Wilson']
    },
  ];

  // Basic alerts for overdue follow-ups and abnormal labs only
  const basicAlerts = alerts.filter(a => 
    a.type === 'overdue_followup' || a.type === 'abnormal_lab'
  );

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Urologist Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Clinical decisions and case management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">Dr. Sarah Johnson</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">On Duty</span>
              </div>
            </div>
            {basicAlerts.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">{basicAlerts.length} Alerts</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Basic Alerts */}
      {basicAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900">Clinical Alerts</h3>
                <p className="text-sm text-orange-800 mt-1">Urgent items requiring attention</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {basicAlerts.map((alert) => (
                <div key={alert.id} className="bg-gradient-to-r from-orange-50 to-gray-50 border border-orange-200 rounded-xl p-4">
                  <p className="font-medium text-gray-900">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Urgent Referrals"
          value={priorityStats.urgentReferrals}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-red-500 to-red-700"
          subtitle="Requiring immediate attention"
        />
        <StatCard
          title="Awaiting Decisions"
          value={priorityStats.awaitingDecisions}
          icon={ClipboardList}
          color="bg-gradient-to-br from-yellow-500 to-orange-500"
          subtitle="Clinical decisions needed"
        />
        <StatCard
          title="Tomorrow's Surgeries"
          value={priorityStats.tomorrowSurgeries}
          icon={Stethoscope}
          color="bg-gradient-to-br from-blue-500 to-blue-700"
          subtitle="Scheduled procedures"
        />
        <StatCard
          title="Overdue Follow-ups"
          value={priorityStats.overdueFollowups}
          icon={Clock}
          color="bg-gradient-to-br from-orange-500 to-red-500"
          subtitle="Requiring review"
        />
      </div>


      {/* Urgent Referrals Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Urgent Referrals Queue</h2>
              <p className="text-sm text-gray-600 mt-1">High-priority referrals requiring immediate clinical review</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Urgent</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Clinical Details</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Priority</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Referring GP</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enhancedUrgentReferrals.map((referral, index) => (
                <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {referral.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                          <AlertTriangle className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{referral.name}</p>
                        <p className="text-sm text-gray-500">Age: {referral.age}</p>
                        <p className="text-sm text-gray-500">ID: {referral.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{referral.summary}</p>
                      <p className="text-sm text-gray-500">PSA: {referral.psa} ng/mL</p>
                      <p className="text-sm text-gray-500">Date: {referral.referralDate}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(referral.priority)}`}>
                      {referral.priority}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{referral.referringGP}</p>
                      <p className="text-sm text-gray-500">Phone: {referral.phone}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-800 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        <span>Accept</span>
                      </button>
                      <button 
                        onClick={() => handlePatientSelect(referral)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span>Showing {enhancedUrgentReferrals.length} urgent referrals</span>
          </div>
        </div>
      </div>

      {/* Tomorrow's Surgeries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tomorrow's Surgeries</h2>
              <p className="text-sm text-gray-600 mt-1">Scheduled procedures and pre-operative checklists</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Scheduled</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Surgery Details</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Schedule</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Checklist</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enhancedTomorrowSurgeries.map((surgery, index) => (
                <tr key={surgery.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {surgery.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Stethoscope className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{surgery.name}</p>
                        <p className="text-sm text-gray-500">Age: {surgery.age}</p>
                        <p className="text-sm text-gray-500">ID: {surgery.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{surgery.type}</p>
                      <p className="text-sm text-gray-500">PSA: {surgery.psa} ng/mL</p>
                      <p className="text-sm text-gray-500">Gleason: {surgery.gleasonScore}</p>
                      <p className="text-sm text-gray-500">Stage: {surgery.stage}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{surgery.time}</p>
                      <p className="text-sm text-gray-500">Theatre: {surgery.theatre}</p>
                      <p className="text-sm text-gray-500">Duration: {surgery.estimatedDuration}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                      surgery.checklist === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {surgery.checklist}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePatientSelect(surgery)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span>View Details</span>
                      </button>
                      <button className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>Call</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span>Showing {enhancedTomorrowSurgeries.length} scheduled surgeries</span>
          </div>
        </div>
      </div>

      {/* MDT Cases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MDT Cases Pending Review</h2>
              <p className="text-sm text-gray-600 mt-1">Multi-disciplinary team cases awaiting discussion</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">MDT Queue</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Clinical Details</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Imaging</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enhancedMdtCases.map((case_, index) => (
                <tr key={case_.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white font-semibold text-sm">
                            {case_.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Users className="h-2 w-2 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{case_.name}</p>
                        <p className="text-sm text-gray-500">Age: {case_.age}</p>
                        <p className="text-sm text-gray-500">ID: {case_.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">PSA: {case_.psa} ng/mL</p>
                      <p className="text-sm text-gray-500">Gleason: {case_.gleasonScore}</p>
                      <p className="text-sm text-gray-500">Stage: {case_.stage}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{case_.imaging}</p>
                      <p className="text-sm text-gray-500">MDT Date: {case_.mdtDate}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      {case_.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handlePatientSelect(case_)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-800 border border-purple-600 rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        <span>Review</span>
                      </button>
                      <button className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200">
                        <Users className="h-3 w-3 mr-1" />
                        <span>MDT</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <span>Showing {enhancedMdtCases.length} MDT cases</span>
          </div>
        </div>
      </div>

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
                    <p className="text-sm text-gray-600">Age: {selectedPatient.age} • PSA: {selectedPatient.psa} ng/mL</p>
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
                        <p className="text-lg font-bold text-blue-600">{selectedPatient.age}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mr-3">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-900">PSA</p>
                        <p className="text-lg font-bold text-green-600">{selectedPatient.psa} ng/mL</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedPatient.gleasonScore && (
                    <div className="bg-gradient-to-r from-yellow-50 to-gray-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center mr-3">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-yellow-900">Gleason</p>
                          <p className="text-lg font-bold text-yellow-600">{selectedPatient.gleasonScore}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPatient.stage && (
                    <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-900">Stage</p>
                          <p className="text-lg font-bold text-purple-600">{selectedPatient.stage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{selectedPatient.address}</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-4">Clinical Information</h4>
                  <div className="space-y-3">
                    {selectedPatient.clinicalNotes && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Clinical Notes:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.clinicalNotes}</p>
                      </div>
                    )}
                    {selectedPatient.imaging && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Imaging:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.imaging}</p>
                      </div>
                    )}
                    {selectedPatient.comorbidities && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Comorbidities:</p>
                        <p className="text-sm text-gray-700">{selectedPatient.comorbidities}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                      console.log('Schedule appointment for:', selectedPatient.id);
                    }}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
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
    </div>
  );
};

export default UrologistDashboard;
