import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Calendar, 
  Activity,
  FileText,
  Clock,
  Eye
} from 'lucide-react';

const PatientChart = () => {
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: 'John Smith',
      dob: '1958-03-15',
      mrn: 'MRN123456',
      currentDatabase: 'DB1',
      emergencyContact: {
        name: 'Jane Smith',
        relationship: 'Wife',
        phone: '0400 123 456'
      },
      clinicalTimeline: [
        { date: '2024-01-10', event: 'Referral received', type: 'referral' },
        { date: '2024-01-15', event: 'OPD consultation', type: 'consultation' },
        { date: '2024-01-20', event: 'PSA: 8.5 ng/mL', type: 'lab' }
      ],
      psaHistory: [
        { date: '2024-01-20', value: 8.5 },
        { date: '2023-12-15', value: 7.2 },
        { date: '2023-09-10', value: 6.8 }
      ],
      imaging: {
        mri: { date: '2024-01-18', result: 'PIRADS 3, no significant lesions' },
        boneScan: { date: '2024-01-19', result: 'Negative for bone metastases' }
      },
      treatmentDecisions: [
        { date: '2024-01-15', decision: 'Active surveillance recommended', clinician: 'Dr. Sarah Johnson' }
      ],
      followUpAppointments: [
        { date: '2024-04-15', type: 'PSA follow-up', status: 'scheduled' }
      ]
    }
  ];

  const PatientCard = ({ patient }) => (
    <div className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-semibold text-sm">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <User className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{patient.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  patient.currentDatabase === 'DB1' ? 'bg-blue-100 text-blue-800' :
                  patient.currentDatabase === 'DB2' ? 'bg-green-100 text-green-800' :
                  patient.currentDatabase === 'DB3' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {patient.currentDatabase}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Demographics</h4>
              <p><strong>DOB:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
              <p><strong>MRN:</strong> {patient.mrn}</p>
              <p><strong>Age:</strong> {new Date().getFullYear() - new Date(patient.dob).getFullYear()} years</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Clinical Info</h4>
              <p><strong>Latest PSA:</strong> {patient.psaHistory[0]?.value} ng/mL</p>
              <p><strong>Next Appointment:</strong> {patient.followUpAppointments[0] ? new Date(patient.followUpAppointments[0].date).toLocaleDateString() : 'Not scheduled'}</p>
            </div>
          </div>
          
          <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
            <p className="text-sm text-gray-700">
              <strong>{patient.emergencyContact.name}</strong> ({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 ml-6">
          <button
            onClick={() => setSelectedPatient(patient)}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="View Patient Chart"
          >
            <Eye className="h-5 w-5" />
          </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Patient Chart Viewer</h1>
            <p className="text-sm text-gray-600 mt-1">Comprehensive patient chart and clinical timeline</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">{patients.length} Patients</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">Chart Viewer Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Patient Search</h2>
              <p className="text-sm text-gray-600 mt-1">Find patients by name, MRN, or date of birth</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Search</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by patient name, MRN, or DOB..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm font-medium">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Patient Charts</h2>
              <p className="text-sm text-gray-600 mt-1">Comprehensive patient information and clinical history</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          {patients.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">No patients match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Chart Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Patient Chart - {selectedPatient.name}</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Header */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Demographics</h4>
                        <p className="text-sm text-gray-600">DOB: {new Date(selectedPatient.dob).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">MRN: {selectedPatient.mrn}</p>
                        <p className="text-sm text-gray-600">Age: {new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()} years</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                        <p className="text-sm text-gray-600">{selectedPatient.emergencyContact.name}</p>
                        <p className="text-sm text-gray-600">{selectedPatient.emergencyContact.relationship}</p>
                        <p className="text-sm text-gray-600">{selectedPatient.emergencyContact.phone}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Current Status</h4>
                        <p className="text-sm text-gray-600">Database: {selectedPatient.currentDatabase}</p>
                        <p className="text-sm text-gray-600">Latest PSA: {selectedPatient.psaHistory[0]?.value} ng/mL</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          <button className="w-full px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                            Move to Active Surveillance
                          </button>
                          <button className="w-full px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                            Schedule Surgery
                          </button>
                          <button className="w-full px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700">
                            Request MDT Discussion
                          </button>
                          <button className="w-full px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                            Discharge to GP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Clinical Timeline */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Clinical Timeline</h3>
                  <div className="space-y-3">
                    {selectedPatient.clinicalTimeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          event.type === 'referral' ? 'bg-blue-500' :
                          event.type === 'consultation' ? 'bg-green-500' :
                          'bg-orange-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{event.event}</p>
                          <p className="text-xs text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* PSA History */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">PSA History</h3>
                  <div className="space-y-3">
                    {selectedPatient.psaHistory.map((psa, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{psa.value} ng/mL</p>
                          <p className="text-xs text-gray-600">{new Date(psa.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Imaging Results */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Imaging Results</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">MRI</h4>
                      <p className="text-xs text-gray-600">{selectedPatient.imaging.mri.result}</p>
                      <p className="text-xs text-gray-500">{new Date(selectedPatient.imaging.mri.date).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900">Bone Scan</h4>
                      <p className="text-xs text-gray-600">{selectedPatient.imaging.boneScan.result}</p>
                      <p className="text-xs text-gray-500">{new Date(selectedPatient.imaging.boneScan.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Treatment Decisions */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Treatment Decisions</h3>
                  <div className="space-y-3">
                    {selectedPatient.treatmentDecisions.map((decision, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{decision.decision}</p>
                        <p className="text-xs text-gray-600">By: {decision.clinician}</p>
                        <p className="text-xs text-gray-500">{new Date(decision.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Follow-up Appointments */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Follow-up Appointments</h3>
                  <div className="space-y-3">
                    {selectedPatient.followUpAppointments.map((appointment, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
                        <p className="text-xs text-gray-600">{new Date(appointment.date).toLocaleDateString()}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientChart;