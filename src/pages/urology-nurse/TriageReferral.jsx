import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateReferral } from '../../store/slices/referralSlice';
import { useNavigation } from '../../contexts/NavigationContext';
import { 
  ArrowLeft, 
  CheckCircle,
  Activity,
  Stethoscope,
  Heart,
  Database,
  FileText,
  TrendingUp,
  Save,
  X
} from 'lucide-react';

const TriageReferral = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getBackPath } = useNavigation();
  
  const [triageData, setTriageData] = useState({
    triageOutcome: '',
    clinicalNotes: '',
    assignedTo: '',
    priority: '',
    nextAction: '',
    database: '',
    psaLevel: '',
    psaDate: new Date().toISOString().split('T')[0], // Set today's date automatically
    clinicalAssessment: '',
    riskFactors: [],
    comorbidities: [],
    medications: []
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock referral data - in real app, fetch by ID
  const mockReferral = {
    id: id,
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
    notes: 'Urgent review required due to rapid PSA rise'
  };

  // Triage outcomes based on workflow
  const triageOutcomes = [
    { 
      value: 'opd_assessment', 
      label: 'OPD Assessment (DB1)', 
      description: 'Initial clinical assessment and decision point',
      icon: Stethoscope,
      color: 'purple'
    },
    { 
      value: 'active_surveillance', 
      label: 'Active Surveillance (DB2)', 
      description: 'Low-risk disease suitable for monitoring',
      icon: Activity,
      color: 'green'
    },
    { 
      value: 'surgical_pathway', 
      label: 'Surgical Pathway (DB3)', 
      description: 'Clear surgical indication',
      icon: Heart,
      color: 'red'
    },
    { 
      value: 'mdt_review', 
      label: 'MDT Review', 
      description: 'Complex cases requiring multidisciplinary discussion',
      icon: Database,
      color: 'blue'
    },
    { 
      value: 'external_referral', 
      label: 'External Referral', 
      description: 'Refer to radiotherapy/medical oncology',
      icon: FileText,
      color: 'orange'
    },
    { 
      value: 'discharge_gp', 
      label: 'Discharge to GP', 
      description: 'No cancer - return to GP care',
      icon: CheckCircle,
      color: 'gray'
    }
  ];

  const getDatabaseFromOutcome = (outcome) => {
    switch (outcome) {
      case 'opd_assessment': return 'DB1';
      case 'active_surveillance': return 'DB2';
      case 'surgical_pathway': return 'DB3';
      case 'mdt_review': return 'MDT';
      case 'external_referral': return 'External';
      case 'discharge_gp': return 'Discharged';
      default: return '';
    }
  };

  // Automatic triage based on PSA levels
  const getAutoTriageOutcome = (psaLevel) => {
    if (!psaLevel || isNaN(psaLevel)) return '';
    
    if (psaLevel > 20) {
      return 'surgical_pathway'; // Very high PSA - likely surgical
    } else if (psaLevel > 10) {
      return 'mdt_review'; // High PSA - needs MDT discussion
    } else if (psaLevel > 4) {
      return 'opd_assessment'; // Elevated PSA - needs assessment
    } else {
      return 'discharge_gp'; // Normal PSA - discharge to GP
    }
  };

  const getDatabaseFromPSA = (psaLevel) => {
    if (!psaLevel || isNaN(psaLevel)) return '';
    
    if (psaLevel > 20) {
      return 'DB3'; // Surgical pathway
    } else if (psaLevel > 10) {
      return 'MDT'; // MDT review
    } else if (psaLevel > 4) {
      return 'DB1'; // OPD assessment
    } else {
      return 'Discharged'; // Discharge to GP
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

  const getOutcomeColor = (color) => {
    switch (color) {
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'gray': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTriageSubmit = () => {
    if (!triageData.triageOutcome || !triageData.clinicalNotes) {
      alert('Please fill in all required fields');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTriage = () => {
    // Update referral with triage data
    const updatedReferral = {
      ...mockReferral,
      status: 'triaged',
      triagedAt: new Date().toISOString(),
      triagedBy: 'Current User',
      triageOutcome: triageData.triageOutcome,
      clinicalNotes: triageData.clinicalNotes,
      assignedTo: triageData.assignedTo,
      priority: triageData.priority,
      nextAction: triageData.nextAction,
      database: triageData.database,
      currentPSA: triageData.psaLevel,
      psaDate: triageData.psaDate,
      clinicalAssessment: triageData.clinicalAssessment
    };

    dispatch(updateReferral(updatedReferral));
    
    // Navigate back to triage page
    navigate('/urology-nurse/triage');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

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
            Back to Triage
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Triage Referral</h1>
        <p className="text-gray-600 mt-1">Review and assign clinical pathway for {mockReferral.patientName}</p>
      </div>

      <div className="space-y-6">
        {/* Patient Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900">Patient Information</h3>
            <p className="text-sm text-gray-600 mt-1">Review patient details and clinical information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {mockReferral.patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{mockReferral.patientName}</h4>
                <p className="text-sm text-gray-500">Age: {mockReferral.age} • {mockReferral.gender}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Referral Date:</span>
                <span className="text-gray-900">{formatDate(mockReferral.referralDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(mockReferral.priority)}`}>
                  {mockReferral.priority}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Referring GP:</span>
                <span className="text-gray-900">{mockReferral.referringGP}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Practice:</span>
                <span className="text-gray-900">{mockReferral.practice}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Current PSA:</span>
                <span className="text-gray-900">{mockReferral.lastPSA} ng/mL</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">PSA Date:</span>
                <span className="text-gray-900">{formatDate(mockReferral.lastPSADate)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-2">Clinical Details</h5>
            <p className="text-sm text-gray-600">{mockReferral.clinicalDetails}</p>
          </div>
        </div>

        {/* PSA Level Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">PSA Level Assessment</h3>
                <p className="text-sm text-blue-600">Enter current PSA level - database will be automatically assigned based on level</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (triageData.psaLevel) {
                  const psaValue = parseFloat(triageData.psaLevel);
                  setTriageData({ 
                    ...triageData, 
                    triageOutcome: getAutoTriageOutcome(psaValue),
                    database: getDatabaseFromPSA(psaValue)
                  });
                }
              }}
              disabled={!triageData.psaLevel}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Add PSA Level
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PSA Level (ng/mL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={triageData.psaLevel}
                onChange={(e) => {
                  const psaValue = parseFloat(e.target.value);
                  setTriageData({ 
                    ...triageData, 
                    psaLevel: e.target.value,
                    triageOutcome: getAutoTriageOutcome(psaValue),
                    database: getDatabaseFromPSA(psaValue)
                  });
                }}
                placeholder="Enter current PSA level"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PSA Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={triageData.psaDate}
                onChange={(e) => setTriageData({ ...triageData, psaDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {triageData.psaLevel && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">PSA Assessment</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {triageData.psaLevel} ng/mL
                  </p>
                  <p className="text-sm text-gray-500">
                    {triageData.psaDate || 'Date not specified'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Risk Level</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    parseFloat(triageData.psaLevel) > 20 
                      ? 'bg-red-100 text-red-800' 
                      : parseFloat(triageData.psaLevel) > 10 
                      ? 'bg-orange-100 text-orange-800'
                      : parseFloat(triageData.psaLevel) > 4 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {parseFloat(triageData.psaLevel) > 20 
                      ? 'Very High Risk' 
                      : parseFloat(triageData.psaLevel) > 10 
                      ? 'High Risk'
                      : parseFloat(triageData.psaLevel) > 4 
                      ? 'Elevated'
                      : 'Normal'
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Automatic Database Allocation */}
        {triageData.psaLevel && triageData.triageOutcome && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Automatic Pathway Allocation</h3>
                <p className="text-sm text-green-600">Based on PSA level: {triageData.psaLevel} ng/mL</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recommended Pathway</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {triageOutcomes.find(o => o.value === triageData.triageOutcome)?.label}
                  </p>
                  <p className="text-sm text-gray-500">
                    {triageOutcomes.find(o => o.value === triageData.triageOutcome)?.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Database</p>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    {triageData.database}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Triage Form */}
        <div className="space-y-6">

            {/* Triage Outcome */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Triage Outcome</h3>
                <p className="text-sm text-gray-600 mt-1">Select the appropriate clinical pathway</p>
              </div>
              <div className="flex items-center justify-between mb-4">
                {triageData.psaLevel && (
                  <span className="text-sm text-gray-500">
                    Auto-selected based on PSA: {triageData.psaLevel} ng/mL
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triageOutcomes.map((outcome) => {
                  const Icon = outcome.icon;
                  const isSelected = triageData.triageOutcome === outcome.value;
                  const isAutoSelected = triageData.psaLevel && getAutoTriageOutcome(parseFloat(triageData.psaLevel)) === outcome.value;
                  return (
                    <button
                      key={outcome.value}
                      onClick={() => {
                        setTriageData({
                          ...triageData,
                          triageOutcome: outcome.value,
                          database: getDatabaseFromOutcome(outcome.value)
                        });
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left relative ${
                        isSelected 
                          ? `${getOutcomeColor(outcome.color)} border-current` 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {isAutoSelected && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            Auto
                          </span>
                        </div>
                      )}
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-6 w-6 mt-1 ${isSelected ? 'text-current' : 'text-gray-400'}`} />
                        <div>
                          <h4 className="font-semibold text-gray-900">{outcome.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{outcome.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Triage Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 -m-6 mb-6 px-6 py-4">
                <h3 className="text-xl font-semibold text-gray-900">Additional Information</h3>
                <p className="text-sm text-gray-600 mt-1">Clinical notes and supporting information</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={triageData.priority}
                    onChange={(e) => setTriageData({ ...triageData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    value={triageData.assignedTo}
                    onChange={(e) => setTriageData({ ...triageData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select clinician...</option>
                    <option value="dr_chen">Dr. Michael Chen</option>
                    <option value="dr_williams">Dr. Sarah Williams</option>
                    <option value="dr_thompson">Dr. Mark Thompson</option>
                    <option value="mdt_team">MDT Team</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Action
                  </label>
                  <input
                    type="text"
                    value={triageData.nextAction}
                    onChange={(e) => setTriageData({ ...triageData, nextAction: e.target.value })}
                    placeholder="e.g., Schedule OPD appointment within 2 weeks"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Assessment
                  </label>
                  <textarea
                    value={triageData.clinicalAssessment}
                    onChange={(e) => setTriageData({ ...triageData, clinicalAssessment: e.target.value })}
                    rows={3}
                    placeholder="Document clinical assessment and findings..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={triageData.clinicalNotes}
                    onChange={(e) => setTriageData({ ...triageData, clinicalNotes: e.target.value })}
                    rows={4}
                    placeholder="Document clinical reasoning for triage decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(getBackPath())}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTriageSubmit}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Save className="h-4 w-4 mr-2" />
                Complete Triage
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Triage</h3>
                <p className="text-sm text-gray-600">Please review the triage decision before confirming</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Patient:</span>
                <span className="text-gray-900">{mockReferral.patientName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Outcome:</span>
                <span className="text-gray-900">
                  {triageOutcomes.find(o => o.value === triageData.triageOutcome)?.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Database:</span>
                <span className="text-gray-900">{triageData.database}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600">Priority:</span>
                <span className="text-gray-900">{triageData.priority}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmTriage}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-800 to-black text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Triage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriageReferral;
