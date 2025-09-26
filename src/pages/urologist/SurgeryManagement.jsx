import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Stethoscope, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';

const SurgeryManagement = () => {
  const dispatch = useDispatch();
  const { db3 } = useSelector(state => state.databases);
  const [selectedSurgery, setSelectedSurgery] = useState(null);

  // Mock surgical cases data
  const surgicalCases = [
    {
      id: 1,
      patientName: 'David Wilson',
      age: 65,
      surgeryType: 'RALP',
      surgeryDate: '2024-01-16',
      surgeryTime: '09:00',
      theatre: 'Theatre 1',
      surgeon: 'Dr. Sarah Johnson',
      assistant: 'Dr. Michael Brown',
      psa: 8.5,
      gleason: '3+4=7',
      stage: 'T2c',
      preOpChecklist: {
        anestheticConsult: true,
        cardiologyClearance: true,
        bloodCrossMatch: true,
        urinalysis: true,
        bowelPrep: false,
        informedConsent: true,
        anticoagulation: true,
        postOpPlan: false
      },
      status: 'scheduled'
    },
    {
      id: 2,
      patientName: 'Robert Chen',
      age: 58,
      surgeryType: 'Open Radical Prostatectomy',
      surgeryDate: '2024-01-17',
      surgeryTime: '14:00',
      theatre: 'Theatre 2',
      surgeon: 'Dr. Sarah Johnson',
      assistant: 'Dr. Lisa Wang',
      psa: 12.3,
      gleason: '4+3=7',
      stage: 'T3a',
      preOpChecklist: {
        anestheticConsult: true,
        cardiologyClearance: true,
        bloodCrossMatch: true,
        urinalysis: true,
        bowelPrep: true,
        informedConsent: true,
        anticoagulation: true,
        postOpPlan: true
      },
      status: 'scheduled'
    },
    {
      id: 3,
      patientName: 'Michael Thompson',
      age: 72,
      surgeryType: 'RALP',
      surgeryDate: '2024-01-18',
      surgeryTime: '08:30',
      theatre: 'Theatre 1',
      surgeon: 'Dr. Sarah Johnson',
      assistant: 'Dr. Michael Brown',
      psa: 15.7,
      gleason: '4+4=8',
      stage: 'T3b',
      preOpChecklist: {
        anestheticConsult: true,
        cardiologyClearance: false,
        bloodCrossMatch: true,
        urinalysis: true,
        bowelPrep: false,
        informedConsent: true,
        anticoagulation: false,
        postOpPlan: false
      },
      status: 'pending'
    }
  ];

  const SurgeryCard = ({ surgery }) => (
    <div className="group bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-semibold text-sm">
                {surgery.patientName.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <Stethoscope className="h-2 w-2 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{surgery.patientName}</h3>
            <p className="text-sm text-gray-700 font-medium">
              Age: {surgery.age} • PSA: {surgery.psa} ng/mL • Gleason: {surgery.gleason}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                surgery.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {surgery.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {surgery.surgeryType}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{surgery.surgeryDate}</p>
          <p className="text-sm text-gray-600">{surgery.surgeryTime}</p>
          <p className="text-xs text-gray-500 mt-1">{surgery.theatre}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Surgical Team</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Surgeon:</strong> {surgery.surgeon}</p>
            <p><strong>Assistant:</strong> {surgery.assistant}</p>
            <p><strong>Theatre:</strong> {surgery.theatre}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Clinical Details</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Stage:</strong> {surgery.stage}</p>
            <p><strong>Gleason Score:</strong> {surgery.gleason}</p>
            <p><strong>Pre-op PSA:</strong> {surgery.psa} ng/mL</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3">Pre-operative Checklist</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(surgery.preOpChecklist).map(([key, checked]) => (
            <div key={key} className={`p-3 rounded-xl text-xs font-medium flex items-center space-x-2 ${
              checked ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {checked ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Surgery Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage surgical procedures and post-operative care</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">{surgicalCases.length} Surgeries</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">Surgical Planning Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surgery List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Scheduled Surgeries</h2>
              <p className="text-sm text-gray-600 mt-1">Upcoming surgical procedures and pre-operative checklists</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Schedule</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {surgicalCases.map((surgery) => (
              <SurgeryCard key={surgery.id} surgery={surgery} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeryManagement;