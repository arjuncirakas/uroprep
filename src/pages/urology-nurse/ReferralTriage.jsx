import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateReferral, setFilters } from '../../store/slices/referralSlice';
import { 
  Search,
  Eye,
  FileText,
  CheckCircle,
  Shield,
  X
} from 'lucide-react';

const ReferralTriage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referrals, filters } = useSelector(state => state.referrals);
  
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [triageStatus, setTriageStatus] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced dummy data with PSA criteria
  const enhancedReferrals = [
    {
      id: 'REF001',
      patientName: 'John Smith',
      age: 65,
      gender: 'Male',
      referralDate: '2024-01-10',
      receivedDate: '2024-01-12',
      status: 'pending',
      urgency: 'high',
      priority: 'urgent',
      referringGP: 'Dr. Sarah Johnson',
      practice: 'City Medical Centre',
      reason: 'Elevated PSA (8.5 ng/mL) with abnormal DRE',
      clinicalDetails: 'PSA rising from 4.2 to 8.5 over 6 months. DRE reveals firm, irregular prostate.',
      comorbidities: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Metformin', 'Lisinopril'],
      lastPSA: 8.5,
      lastPSADate: '2024-01-08',
      familyHistory: 'Father had prostate cancer at age 70',
      triagedBy: null,
      triagedAt: null,
      notes: 'Urgent review required due to rapid PSA rise',
      psaSuggestion: 'MDT/Urology OPD (urgent)',
      psaCriteria: 'PSA >10 ng/mL',
      suggestedPathway: 'MDT Review'
    },
    {
      id: 'REF002',
      patientName: 'Michael Brown',
      age: 58,
      gender: 'Male',
      referralDate: '2024-01-08',
      receivedDate: '2024-01-09',
      status: 'triaged',
      urgency: 'medium',
      priority: 'high',
      referringGP: 'Dr. Robert Wilson',
      practice: 'Suburban Family Practice',
      reason: 'Abnormal PSA (5.2 ng/mL) with family history',
      clinicalDetails: 'PSA 5.2 ng/mL, normal DRE. Strong family history of prostate cancer.',
      comorbidities: ['Hyperlipidemia'],
      medications: ['Atorvastatin'],
      lastPSA: 5.2,
      lastPSADate: '2024-01-05',
      familyHistory: 'Brother diagnosed with prostate cancer at age 55',
      triagedBy: 'Nurse Sarah',
      triagedAt: '2024-01-13',
      notes: 'Scheduled for first consultation within 2 weeks',
      psaSuggestion: 'OPD Consultation',
      psaCriteria: 'PSA 4-10 ng/mL',
      suggestedPathway: 'OPD Queue'
    },
    {
      id: 'REF003',
      patientName: 'David Wilson',
      age: 71,
      gender: 'Male',
      referralDate: '2024-01-05',
      receivedDate: '2024-01-06',
      status: 'active',
      urgency: 'low',
      priority: 'medium',
      referringGP: 'Dr. Emily Davis',
      practice: 'Rural Health Clinic',
      reason: 'Routine PSA monitoring - elevated levels',
      clinicalDetails: 'PSA 4.8 ng/mL, normal DRE. Patient asymptomatic.',
      comorbidities: ['COPD'],
      medications: ['Salbutamol', 'Tiotropium'],
      lastPSA: 4.8,
      lastPSADate: '2024-01-03',
      familyHistory: 'No significant family history',
      triagedBy: 'Nurse Michael',
      triagedAt: '2024-01-08',
      notes: 'Under active surveillance, next review in 3 months',
      psaSuggestion: 'Active Surveillance',
      psaCriteria: 'PSA <4 ng/mL',
      suggestedPathway: 'Active Surveillance'
    },
    {
      id: 'REF004',
      patientName: 'Robert Davis',
      age: 62,
      gender: 'Male',
      referralDate: '2023-12-20',
      receivedDate: '2023-12-21',
      status: 'ready_for_discharge',
      urgency: 'low',
      priority: 'low',
      referringGP: 'Dr. Jennifer Lee',
      practice: 'Metro Medical Group',
      reason: 'Post-treatment follow-up',
      clinicalDetails: 'Post-RALP patient, PSA undetectable, excellent recovery.',
      comorbidities: [],
      medications: [],
      lastPSA: 0.02,
      lastPSADate: '2024-01-10',
      familyHistory: 'No significant family history',
      triagedBy: 'Nurse Sarah',
      triagedAt: '2023-12-22',
      notes: 'Ready for discharge to GP care with annual PSA monitoring',
      psaSuggestion: 'Discharge to GP',
      psaCriteria: 'PSA <0.1 ng/mL',
      suggestedPathway: 'Discharge'
    },
    {
      id: 'REF005',
      patientName: 'James Anderson',
      age: 55,
      gender: 'Male',
      referralDate: '2024-01-14',
      receivedDate: '2024-01-15',
      status: 'pending',
      urgency: 'high',
      priority: 'urgent',
      referringGP: 'Dr. Mark Thompson',
      practice: 'Coastal Medical Centre',
      reason: 'Suspicious MRI findings with elevated PSA',
      clinicalDetails: 'PSA 6.8 ng/mL, MRI shows PIRADS 4 lesion in peripheral zone.',
      comorbidities: ['Obesity'],
      medications: ['Metformin'],
      lastPSA: 6.8,
      lastPSADate: '2024-01-12',
      familyHistory: 'Uncle had prostate cancer',
      triagedBy: null,
      triagedAt: null,
      notes: 'Urgent biopsy required due to MRI findings',
      psaSuggestion: 'OPD Consultation',
      psaCriteria: 'PSA 4-10 ng/mL',
      suggestedPathway: 'OPD Queue'
    },
    {
      id: 'REF006',
      patientName: 'William Thompson',
      age: 68,
      gender: 'Male',
      referralDate: '2024-01-11',
      receivedDate: '2024-01-12',
      status: 'triaged',
      urgency: 'medium',
      priority: 'high',
      referringGP: 'Dr. Lisa Chen',
      practice: 'University Medical Centre',
      reason: 'Active surveillance - progression concerns',
      clinicalDetails: 'PSA velocity 0.8 ng/mL/year, stable DRE. Patient concerned about progression.',
      comorbidities: ['Hypertension'],
      medications: ['Amlodipine'],
      lastPSA: 4.5,
      lastPSADate: '2024-01-09',
      familyHistory: 'No significant family history',
      triagedBy: 'Nurse Michael',
      triagedAt: '2024-01-14',
      notes: 'Review active surveillance protocol, consider repeat biopsy',
      psaSuggestion: 'Active Surveillance',
      psaCriteria: 'PSA <4 ng/mL',
      suggestedPathway: 'Active Surveillance'
    }
  ];

  const getDaysSinceReferral = (referralDate) => {
    const today = new Date();
    const referral = new Date(referralDate);
    const diffTime = Math.abs(today - referral);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };


  const handleTriageUpdate = (referralId, newStatus) => {
    dispatch(updateReferral({
      id: referralId,
      status: newStatus,
      triagedAt: new Date().toISOString(),
      triagedBy: 'Current User' // This would come from auth state
    }));
  };


  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'triaged': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'ready_for_discharge': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPSASuggestionColor = (suggestion) => {
    switch (suggestion) {
      case 'MDT/Urology OPD (urgent)': return 'bg-red-100 text-red-800 border-red-200';
      case 'OPD Consultation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Active Surveillance': return 'bg-green-100 text-green-800 border-green-200';
      case 'Discharge to GP': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredReferrals = enhancedReferrals.filter(referral => {
    // Status filter
    const statusMatch = selectedFilter === 'all' || referral.status === selectedFilter;
    
    // Search filter
    const searchMatch = searchTerm === '' || 
      referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referringGP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.practice.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Referral Triage</h1>
        <p className="text-gray-600 mt-1">Manage incoming patients with PSA criteria and automatic suggestions</p>
      </div>
      


      {/* Referrals Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Referrals Management</h2>
              <p className="text-sm text-gray-600 mt-1">Review and triage incoming referrals with PSA criteria and automatic suggestions</p>
            </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
                <option value="pending">Pending Triage</option>
            <option value="triaged">Triaged</option>
                <option value="active">Active Cases</option>
            <option value="ready_for_discharge">Ready for Discharge</option>
                <option value="all">All Referrals</option>
          </select>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
              <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
                  placeholder="Search by patient name, GP, or reason..."
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
      </div>
    </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredReferrals.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">PSA & Criteria</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">System Suggestion</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Referring GP</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReferrals.map((referral, index) => (
                  <tr key={referral.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {referral.patientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {referral.priority === 'urgent' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{referral.patientName}</p>
                          <p className="text-sm text-gray-500">Age: {referral.age} • PSA: {referral.lastPSA} ng/mL</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">PSA: {referral.lastPSA} ng/mL</p>
                        <p className="text-sm text-gray-500">{referral.psaCriteria}</p>
                        <p className="text-xs text-gray-400">{referral.lastPSADate}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getPSASuggestionColor(referral.psaSuggestion)}`}>
                          {referral.psaSuggestion}
                        </span>
                        <p className="text-xs text-gray-500">Suggested: {referral.suggestedPathway}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{referral.referringGP}</p>
                        <p className="text-sm text-gray-500">{referral.practice}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/urology-nurse/patient-details/${referral.id}`)}
                          className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-600 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span>View</span>
                        </button>
                        {referral.status === 'pending' && (
                          <div className="flex flex-col space-y-1">
                            <button 
                              onClick={() => navigate(`/urology-nurse/triage/${referral.id}`)}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-700 border border-green-600 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span>Accept Suggestion</span>
                            </button>
                            <button 
                              onClick={() => navigate(`/urology-nurse/triage/${referral.id}`)}
                              className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              <span>Manual Assign</span>
                            </button>
                          </div>
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
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No referrals found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {selectedFilter === 'all' 
                  ? 'No referrals match your search criteria.'
                  : `No ${selectedFilter.replace('_', ' ')} referrals found.`
                }
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </button>
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  View All Referrals
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReferralTriage;