import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMeeting, updateMeeting } from '../../store/slices/mdtSlice';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Video
} from 'lucide-react';

const MDTScheduling = () => {
  const dispatch = useDispatch();
  const { meetings, participants } = useSelector(state => state.mdt);
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    location: '',
    type: 'in_person',
    description: '',
    participants: [],
  });

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.scheduledDate) > new Date()
  ).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  // Calculate clinical urgency for automatic scheduling
  const calculateClinicalUrgency = () => {
    const urgentCases = [
      ...db1.patients.filter(p => p.priority === 'urgent' && p.clinicalDecision === 'mdt_referral'),
      ...db2.patients.filter(p => p.progressionAlert && p.psaVelocity > 1.0),
      ...db4.patients.filter(p => p.biochemicalRecurrence && p.psa > 0.5)
    ];

    const highPriorityCases = [
      ...db1.patients.filter(p => p.priority === 'high' && p.clinicalDecision === 'mdt_referral'),
      ...db2.patients.filter(p => p.progressionAlert && p.psaVelocity > 0.75),
      ...db3.patients.filter(p => p.mdtDiscussionRequired)
    ];

    return {
      urgent: urgentCases.length,
      high: highPriorityCases.length,
      total: urgentCases.length + highPriorityCases.length,
      requiresUrgentMeeting: urgentCases.length >= 2,
      nextRecommendedDate: urgentCases.length > 0 ? 
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) : // 2 days
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)   // 1 week
    };
  };

  const clinicalUrgency = calculateClinicalUrgency();

  const availableParticipants = [
    { id: 1, name: 'Dr. John Smith', role: 'Urologist', specialty: 'Urology' },
    { id: 2, name: 'Dr. Sarah Johnson', role: 'Medical Oncologist', specialty: 'Medical Oncology' },
    { id: 3, name: 'Dr. Michael Brown', role: 'Radiation Oncologist', specialty: 'Radiation Oncology' },
    { id: 4, name: 'Dr. Emily Davis', role: 'Pathologist', specialty: 'Pathology' },
    { id: 5, name: 'Dr. Robert Wilson', role: 'Radiologist', specialty: 'Radiology' },
    { id: 6, name: 'Dr. Lisa Anderson', role: 'Urologist', specialty: 'Urology' },
  ];

  const handleCreateMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      alert('Please fill in all required fields');
      return;
    }

    const meeting = {
      ...newMeeting,
      id: Date.now(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      scheduledDate: `${newMeeting.date}T${newMeeting.time}:00`,
    };

    dispatch(addMeeting(meeting));
    setNewMeeting({
      title: '',
      date: '',
      time: '',
      duration: '60',
      location: '',
      type: 'in_person',
      description: '',
      participants: [],
    });
    setShowNewMeeting(false);
  };

  const handleUpdateMeeting = (meetingId, updates) => {
    dispatch(updateMeeting({ id: meetingId, ...updates }));
  };

  const getMeetingStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'in_person': return <Users className="h-4 w-4" />;
      case 'virtual': return <Video className="h-4 w-4" />;
      case 'hybrid': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MDT Scheduling</h1>
          <p className="text-gray-600">Schedule and manage multidisciplinary team meetings</p>
        </div>
        <button
          onClick={() => setShowNewMeeting(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Meeting
        </button>
      </div>

      {/* Clinical Urgency Alert */}
      {clinicalUrgency.total > 0 && (
        <div className={`rounded-lg p-6 ${
          clinicalUrgency.requiresUrgentMeeting 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className={`h-6 w-6 mr-3 ${
                clinicalUrgency.requiresUrgentMeeting ? 'text-red-600' : 'text-orange-600'
              }`} />
              <h3 className={`text-lg font-semibold ${
                clinicalUrgency.requiresUrgentMeeting ? 'text-red-900' : 'text-orange-900'
              }`}>
                Clinical Urgency Alert
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              clinicalUrgency.requiresUrgentMeeting 
                ? 'bg-red-100 text-red-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {clinicalUrgency.requiresUrgentMeeting ? 'URGENT MEETING REQUIRED' : 'HIGH PRIORITY CASES'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Urgent Cases:</p>
              <p className="text-2xl font-bold text-red-600">{clinicalUrgency.urgent}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">High Priority Cases:</p>
              <p className="text-2xl font-bold text-orange-600">{clinicalUrgency.high}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Recommended Meeting Date:</p>
              <p className="text-lg font-bold text-gray-900">
                {clinicalUrgency.nextRecommendedDate.toLocaleDateString()}
              </p>
            </div>
          </div>
          {clinicalUrgency.requiresUrgentMeeting && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setNewMeeting(prev => ({
                    ...prev,
                    title: 'Urgent MDT Meeting',
                    date: clinicalUrgency.nextRecommendedDate.toISOString().split('T')[0],
                    time: '09:00',
                    description: 'Urgent MDT meeting for high-priority cases requiring immediate discussion'
                  }));
                  setShowNewMeeting(true);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Schedule Urgent Meeting
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming MDT Meetings</h3>
        </div>
        <div className="p-6">
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No upcoming meetings scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {getMeetingTypeIcon(meeting.type)}
                        <span className="ml-2 text-sm text-gray-500 capitalize">{meeting.type.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                        <p className="text-sm text-gray-600">{meeting.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(meeting.scheduledDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(meeting.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            {meeting.participants.length} participants
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMeetingStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                      <button
                        onClick={() => setSelectedMeeting(meeting)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Meeting Modal */}
      {showNewMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New MDT Meeting</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Weekly MDT Meeting"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Type
                  </label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="in_person">In Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Conference Room A or Zoom link"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Meeting agenda and objectives..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {availableParticipants.map((participant) => (
                    <label key={participant.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newMeeting.participants.includes(participant.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewMeeting(prev => ({
                              ...prev,
                              participants: [...prev.participants, participant.id]
                            }));
                          } else {
                            setNewMeeting(prev => ({
                              ...prev,
                              participants: prev.participants.filter(id => id !== participant.id)
                            }));
                          }
                        }}
                        className="mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-500">{participant.role} - {participant.specialty}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowNewMeeting(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMeeting}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.filter(m => m.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.filter(m => m.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Active Participants</p>
              <p className="text-2xl font-bold text-gray-900">{availableParticipants.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MDTScheduling;

