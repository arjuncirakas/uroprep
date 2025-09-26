import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  FileText, 
  Calendar, 
  Target,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';

const MDTCaseManager = () => {
  const dispatch = useDispatch();
  const { referrals } = useSelector(state => state.referrals);
  const [selectedCase, setSelectedCase] = useState(null);

  // Mock MDT cases data
  const mdtCases = [
    {
      id: 1,
      patientName: 'Michael Miller',
      age: 67,
      psa: 15.2,
      gleason: '4+3=7',
      stage: 'T3a',
      imaging: {
        mri: 'Completed',
        pirads: '4',
        boneScan: 'Pending'
      },
      clinicalHistory: {
        familyHistory: true,
        comorbidities: ['Hypertension', 'Diabetes']
      },
      mdtDiscussion: {
        scheduledDate: '2024-01-18',
        status: 'pending',
        presentingUrologist: 'Dr. Sarah Johnson',
        clinicalQuestion: 'Optimal management for T3a Gleason 4+3 disease'
      },
      priority: 'high'
    }
  ];

  const MDTCaseCard = ({ caseData }) => (
    <div className="group bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-6 hover:shadow-md hover:border-purple-300 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-semibold text-sm">
                  {caseData.patientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                <Users className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{caseData.patientName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  caseData.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {caseData.priority.toUpperCase()}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                  MDT PENDING
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Clinical Details</h4>
              <p><strong>Age:</strong> {caseData.age} years</p>
              <p><strong>PSA:</strong> {caseData.psa} ng/mL</p>
              <p><strong>Gleason:</strong> {caseData.gleason}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Staging & Imaging</h4>
              <p><strong>Stage:</strong> {caseData.stage}</p>
              <p><strong>MRI PIRADS:</strong> {caseData.imaging.pirads}</p>
              <p><strong>Bone Scan:</strong> {caseData.imaging.boneScan}</p>
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Clinical Question for MDT</h4>
            <p className="text-sm text-gray-700">{caseData.mdtDiscussion.clinicalQuestion}</p>
          </div>
          
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">MDT Schedule</h4>
            <p className="text-sm text-gray-700">
              <strong>Scheduled:</strong> {new Date(caseData.mdtDiscussion.scheduledDate).toLocaleDateString()} 
              {' • '}<strong>Presenting:</strong> {caseData.mdtDiscussion.presentingUrologist}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 ml-6">
          <button
            onClick={() => setSelectedCase(caseData)}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="View Case Details"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={() => {/* Navigate to case presentation */}}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm"
          >
            Prepare Case
          </button>
        </div>
      </div>
    </div>
  );

  const CaseDetailModal = ({ caseData, onClose }) => {
    const [mdtOutcome, setMdtOutcome] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');

    const handleSubmitMDTOutcome = () => {
      dispatch({
        type: 'mdt/updateCaseOutcome',
        payload: {
          caseId: caseData.id,
          outcome: mdtOutcome,
          notes: clinicalNotes,
          timestamp: new Date().toISOString(),
          presenter: 'Dr. Sarah Johnson'
        }
      });
      
      // Auto-route based on MDT decision
      if (mdtOutcome === 'surgery') {
        dispatch({
          type: 'databases/moveToDB3',
          payload: { caseId: caseData.id, ...caseData }
        });
      } else if (mdtOutcome === 'active_surveillance') {
        dispatch({
          type: 'databases/moveToDB2',
          payload: { caseId: caseData.id, ...caseData }
        });
      }
      
      onClose();
    };

    if (!caseData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">MDT Case Details - {caseData.patientName}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clinical Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Clinical Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium">Patient:</span> {caseData.patientName}, {caseData.age} years
                  </div>
                  <div>
                    <span className="font-medium">PSA:</span> {caseData.psa} ng/mL
                  </div>
                  <div>
                    <span className="font-medium">Gleason Score:</span> {caseData.gleason}
                  </div>
                  <div>
                    <span className="font-medium">Stage:</span> {caseData.stage}
                  </div>
                  <div>
                    <span className="font-medium">Family History:</span> {caseData.clinicalHistory.familyHistory ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              
              {/* Imaging Results */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Imaging Results</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium">MRI:</span> {caseData.imaging.mri} (PIRADS {caseData.imaging.pirads})
                  </div>
                  <div>
                    <span className="font-medium">Bone Scan:</span> {caseData.imaging.boneScan}
                  </div>
                </div>
              </div>
              
              {/* Clinical Question */}
              <div className="lg:col-span-2">
                <h3 className="font-medium text-gray-900 mb-4">Clinical Question for MDT</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900">{caseData.mdtDiscussion.clinicalQuestion}</p>
                </div>
              </div>
              
              {/* MDT Outcome Entry */}
              <div className="lg:col-span-2">
                <h3 className="font-medium text-gray-900 mb-4">MDT Discussion Outcome</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Treatment</label>
                    <select
                      value={mdtOutcome}
                      onChange={(e) => setMdtOutcome(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select recommendation...</option>
                      <option value="surgery">Radical Prostatectomy</option>
                      <option value="active_surveillance">Active Surveillance</option>
                      <option value="radiotherapy">Radiotherapy</option>
                      <option value="hormone_therapy">Hormone Therapy</option>
                      <option value="further_investigation">Further Investigation Required</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                    <textarea
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter MDT discussion notes and rationale..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitMDTOutcome}
                disabled={!mdtOutcome}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit MDT Outcome
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MDT Case Manager</h1>
            <p className="text-sm text-gray-600 mt-1">Manage Multi-Disciplinary Team cases and discussions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">{mdtCases.length} Cases</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">MDT Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MDT Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MDT Overview</h2>
              <p className="text-sm text-gray-600 mt-1">Multi-disciplinary team case statistics and scheduling</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-gray-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Pending Cases</p>
                  <p className="text-3xl font-bold text-purple-900">{mdtCases.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Awaiting review</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Next MDT</p>
                  <p className="text-2xl font-bold text-blue-900">Jan 18, 2024</p>
                  <p className="text-sm text-gray-500 mt-1">Scheduled meeting</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">High Priority</p>
                  <p className="text-3xl font-bold text-green-900">
                    {mdtCases.filter(c => c.priority === 'high').length}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Urgent cases</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-700 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MDT Cases List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MDT Cases Pending Review</h2>
              <p className="text-sm text-gray-600 mt-1">Cases awaiting multi-disciplinary team discussion</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">MDT Queue</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {mdtCases.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No MDT cases pending</h3>
              <p className="text-gray-600">All cases have been reviewed or no cases are currently queued for MDT discussion.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mdtCases.map((caseData) => (
                <MDTCaseCard key={caseData.id} caseData={caseData} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailModal 
          caseData={selectedCase} 
          onClose={() => setSelectedCase(null)} 
        />
      )}
    </div>
  );
};

export default MDTCaseManager;