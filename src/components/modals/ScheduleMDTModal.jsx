import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  X,
  Clock,
  Users,
  Plus,
  Search,
  CheckCircle
} from 'lucide-react';

const ScheduleMDTModal = ({ isOpen, onClose, onScheduled, selectedPatientData }) => {
  // Initialize form with current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [mdtForm, setMdtForm] = useState({
    mdtDate: currentDate,
    time: currentTime,
    priority: 'Medium',
    teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
    notes: ''
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState('');
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    department: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scheduledMDTData, setScheduledMDTData] = useState(null);

  // Available team members for dropdown
  const availableTeamMembers = [
    'Dr. Sarah Wilson (Urologist)',
    'Dr. Michael Chen (Oncologist)',
    'Dr. Jennifer Lee (Radiologist)',
    'Dr. David Wilson (Pathologist)',
    'Dr. Emily Brown (Medical Oncologist)',
    'Dr. James Taylor (Radiation Oncologist)',
    'Dr. Lisa Anderson (Nurse Practitioner)',
    'Dr. Robert Garcia (Clinical Psychologist)',
    'Dr. Maria Rodriguez (Social Worker)',
    'Dr. Thomas Lee (Anesthesiologist)',
    'Dr. Amanda White (Physiotherapist)',
    'Dr. Kevin Park (Nutritionist)'
  ];

  // Filter team members based on search
  const filteredTeamMembers = availableTeamMembers.filter(member => 
    !mdtForm.teamMembers.includes(member) && 
    member.toLowerCase().includes(dropdownSearchTerm.toLowerCase())
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);
      
      setMdtForm({
        mdtDate: currentDate,
        time: currentTime,
        priority: 'Medium',
        teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
        notes: ''
      });
    }
  }, [isOpen]);

  const handleMDTFormChange = (field, value) => {
    setMdtForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTeamMember = (selectedMember) => {
    if (selectedMember && !mdtForm.teamMembers.includes(selectedMember)) {
      setMdtForm(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, selectedMember]
      }));
    }
  };

  const removeTeamMember = (index) => {
    setMdtForm(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSelectTeamMember = (member) => {
    addTeamMember(member);
    setIsDropdownOpen(false);
    setDropdownSearchTerm('');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAddNewTeamMember = () => {
    if (newTeamMember.name && newTeamMember.department) {
      const fullName = `${newTeamMember.name} (${newTeamMember.department})`;
      addTeamMember(fullName);
      setShowAddTeamMemberModal(false);
      setNewTeamMember({ name: '', department: '' });
    }
  };

  const handleSubmit = () => {
    if (!selectedPatientData) {
      alert('Patient data is missing');
      return;
    }

    if (!mdtForm.mdtDate || !mdtForm.time) {
      alert('Please fill in all required fields (Date, Time)');
      return;
    }

    const mdtData = {
      id: `MDT${Date.now()}`,
      patient: selectedPatientData,
      timestamp: new Date().toISOString(),
      ...mdtForm
    };

    console.log('Scheduling MDT:', mdtData);
    
    if (onScheduled) {
      onScheduled(mdtData);
    }

    // Store the scheduled data and show success modal
    setScheduledMDTData(mdtData);
    setShowSuccessModal(true);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setScheduledMDTData(null);
    onClose();
  };

  if (!isOpen) return null;

  // Success Modal
  if (showSuccessModal && scheduledMDTData) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[110] flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-4 animate-pulse">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center">MDT Meeting Scheduled Successfully!</h3>
              <p className="text-sm text-gray-600 text-center mt-2">
                The multidisciplinary team meeting has been scheduled
              </p>
            </div>

            {/* Success Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                {/* Meeting Details */}
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Meeting Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-32">Patient:</span>
                      <span className="text-gray-900">
                        {scheduledMDTData.patient.name} (ID: {scheduledMDTData.patient.id})
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-32">Date & Time:</span>
                      <span className="text-gray-900">
                        {new Date(scheduledMDTData.mdtDate).toLocaleDateString('en-AU', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {scheduledMDTData.time}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-32">Priority:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        scheduledMDTData.priority === 'High' ? 'bg-red-100 text-red-800' :
                        scheduledMDTData.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {scheduledMDTData.priority}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-700 w-32">Meeting ID:</span>
                      <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {scheduledMDTData.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600" />
                    Team Members ({scheduledMDTData.teamMembers.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scheduledMDTData.teamMembers.map((member, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                {scheduledMDTData.notes && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Additional Notes</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{scheduledMDTData.notes}</p>
                  </div>
                )}

                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h4 className="text-md font-semibold text-blue-900 mb-2">Next Steps</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Calendar invitations will be sent to all team members</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Patient records and imaging will be prepared for review</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Meeting details have been saved to the patient's timeline</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleCloseSuccessModal}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Scheduling Form
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[110] flex items-center justify-center p-4">
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center shadow-sm">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Schedule MDT Meeting</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Schedule multidisciplinary team discussion for {selectedPatientData?.name}
                  </p>
                  {mdtForm.mdtDate && mdtForm.time && (
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(mdtForm.mdtDate).toLocaleDateString('en-AU')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {mdtForm.time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Patient Information Display */}
              {selectedPatientData && (
                <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {selectedPatientData.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {selectedPatientData.priority === 'High' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{selectedPatientData.name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                        <span>ID: {selectedPatientData.id}</span>
                        <span>Age: {selectedPatientData.age}</span>
                        <span>PSA: {selectedPatientData.psa} ng/mL</span>
                        {selectedPatientData.gleasonScore && (
                          <span>Gleason: {selectedPatientData.gleasonScore}</span>
                        )}
                        {selectedPatientData.stage && (
                          <span>Stage: {selectedPatientData.stage}</span>
                        )}
                      </div>
                      {selectedPatientData.clinicalNotes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {selectedPatientData.clinicalNotes}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MDT Scheduling Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      MDT Date *
                    </label>
                    <input
                      type="date"
                      value={mdtForm.mdtDate}
                      onChange={(e) => handleMDTFormChange('mdtDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={mdtForm.time}
                      onChange={(e) => handleMDTFormChange('time', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Priority
                    </label>
                    <select
                      value={mdtForm.priority}
                      onChange={(e) => handleMDTFormChange('priority', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Team Members</h4>
                  <div className="relative dropdown-container">
                    <button
                      type="button"
                      onClick={handleDropdownToggle}
                      className="flex items-center justify-between w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-500">Select team member to add</span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden">
                        {/* Search Field */}
                        <div className="p-3 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search team members..."
                              value={dropdownSearchTerm}
                              onChange={(e) => setDropdownSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        {/* Add New Button */}
                        <div className="p-2 border-b border-gray-200">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddTeamMemberModal(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Team Member
                          </button>
                        </div>
                        
                        {/* Team Members List */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredTeamMembers.length > 0 ? (
                            filteredTeamMembers.map((member, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectTeamMember(member)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                {member}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-4 text-sm text-gray-500 text-center">
                              {dropdownSearchTerm ? 'No team members found matching your search' : 'No available team members'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {mdtForm.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                        {member}
                      </div>
                      {mdtForm.teamMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove team member"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h4>
                <textarea
                  value={mdtForm.notes}
                  onChange={(e) => handleMDTFormChange('notes', e.target.value)}
                  rows={4}
                  placeholder="Add any additional notes or information about this MDT meeting..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">Optional: Add any relevant notes for the MDT meeting</p>
              </div>

              {/* Summary */}
              {selectedPatientData && mdtForm.mdtDate && mdtForm.time && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                  <div className="flex items-center mb-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <h4 className="text-sm font-semibold text-green-900">MDT Meeting Summary</h4>
                  </div>
                  <div className="text-sm text-green-800 space-y-2">
                    <p><strong>Patient:</strong> {selectedPatientData.name} ({selectedPatientData.id})</p>
                    <p><strong>Date:</strong> {new Date(mdtForm.mdtDate).toLocaleDateString('en-AU', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {mdtForm.time}</p>
                    <p><strong>Priority:</strong> {mdtForm.priority}</p>
                    <p><strong>Team Members:</strong> {mdtForm.teamMembers.length} members</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={!selectedPatientData || !mdtForm.mdtDate || !mdtForm.time}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Calendar className="h-4 w-4 mr-2 inline" />
                Schedule MDT Meeting
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddTeamMemberModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[120] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Team Member</h2>
              <button
                onClick={() => setShowAddTeamMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Dr. John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department/Specialization
                </label>
                <input
                  type="text"
                  value={newTeamMember.department}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Oncologist"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
              <button
                onClick={handleAddNewTeamMember}
                disabled={!newTeamMember.name || !newTeamMember.department}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowAddTeamMemberModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleMDTModal;

