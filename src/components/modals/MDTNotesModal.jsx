import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  CheckCircle, 
  FileText, 
  Download,
  Activity,
  Stethoscope,
  Target,
  Calendar,
  Clock,
  MessageSquare
} from 'lucide-react';

const MDTNotesModal = ({ 
  isOpen, 
  onClose, 
  patient, 
  onSave, 
  mdtNotes = [] 
}) => {
  // Initialize form with current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const [mdtForm, setMdtForm] = useState({
    mdtDate: currentDate,
    time: currentTime,
    caseType: '',
    priority: 'Medium',
    status: 'Pending Review',
    teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
    discussionNotes: '',
    outcome: '',
    recommendations: '',
    followUpActions: [''],
    documents: []
  });

  const [isDragOver, setIsDragOver] = useState(false);
  
  // Add Team Member Modal state
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    department: ''
  });

  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearchTerm, setDropdownSearchTerm] = useState('');

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

  // Handlers
  const closeAddTeamMemberModal = () => {
    setShowAddTeamMemberModal(false);
    setNewTeamMember({ name: '', department: '' });
  };

  const handleAddNewTeamMember = () => {
    if (newTeamMember.name.trim() && newTeamMember.department.trim()) {
      const fullName = `Dr. ${newTeamMember.name.trim()}`;
      const department = newTeamMember.department.trim();
      const newMember = `${fullName} (${department})`;
      
      // Add to available team members list
      if (!availableTeamMembers.includes(newMember)) {
        availableTeamMembers.push(newMember);
      }
      
      // Add to current form's team members
      if (!mdtForm.teamMembers.includes(newMember)) {
        setMdtForm(prev => ({
          ...prev,
          teamMembers: [...prev.teamMembers, newMember]
        }));
      }
      
      closeAddTeamMemberModal();
    }
  };

  const handleSelectTeamMember = (member) => {
    addTeamMember(member);
    setIsDropdownOpen(false);
    setDropdownSearchTerm('');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setDropdownSearchTerm('');
    }
  };

  // MDT Notes helper functions
  const handleMDTFormChange = (field, value) => {
    setMdtForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFollowUpAction = () => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: [...prev.followUpActions, '']
    }));
  };

  const removeFollowUpAction = (index) => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.filter((_, i) => i !== index)
    }));
  };

  const updateFollowUpAction = (index, value) => {
    setMdtForm(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.map((action, i) => i === index ? value : action)
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

  const addDocument = (file) => {
    if (file) {
      const documentName = file.name;
      setMdtForm(prev => ({
        ...prev,
        documents: [...prev.documents, documentName]
      }));
    }
  };

  const removeDocument = (index) => {
    setMdtForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        addDocument(file);
      } else {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      }
    });
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          addDocument(file);
        } else {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        }
      });
      e.target.value = ''; // Reset file input
    }
  };

  const saveMDTNote = () => {
    const newMDTNote = {
      id: `MDT${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: mdtForm.mdtDate,
      time: mdtForm.time,
      mdtDate: mdtForm.mdtDate,
      patientId: patient.id,
      patientName: patient.name,
      teamMembers: mdtForm.teamMembers.filter(member => member.trim() !== ''),
      caseType: mdtForm.caseType,
      priority: mdtForm.priority,
      status: mdtForm.status,
      discussionNotes: mdtForm.discussionNotes,
      outcome: mdtForm.outcome,
      recommendations: mdtForm.recommendations,
      followUpActions: mdtForm.followUpActions.filter(action => action.trim() !== ''),
      documents: mdtForm.documents
    };

    onSave(newMDTNote);
    
    // Reset form (keep date and time for next use)
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setMdtForm({
      mdtDate: currentDate,
      time: currentTime,
      caseType: '',
      priority: 'Medium',
      status: 'Pending Review',
      teamMembers: ['Dr. Sarah Wilson (Urologist)', 'Dr. Michael Chen (Oncologist)', 'Dr. Jennifer Lee (Radiologist)', 'Dr. David Wilson (Pathologist)'],
      discussionNotes: '',
      outcome: '',
      recommendations: '',
      followUpActions: [''],
      documents: []
    });

    onClose();
  };

  if (!isOpen || !patient) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-200 rounded-xl shadow-2xl">
          {/* Modal Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    MDT Notes - {patient.name}
                  </h3>
                  <p className="text-sm text-gray-600">Add comprehensive MDT discussion notes and outcomes</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {mdtForm.mdtDate ? new Date(mdtForm.mdtDate).toLocaleDateString('en-AU') : 'Date not set'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {mdtForm.time || 'Time not set'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">

              {/* Team Members */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Team Members</h4>
                  <div className="relative dropdown-container">
                    <button
                      onClick={handleDropdownToggle}
                      className="flex items-center justify-between w-64 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white hover:bg-gray-50 transition-colors"
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
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        {/* Add New Button */}
                        <div className="p-2 border-b border-gray-200">
                          <button
                            onClick={() => {
                              setShowAddTeamMemberModal(true);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
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
                      <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                        {member}
                      </div>
                      {mdtForm.teamMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Remove team member"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* MDT Outcome */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Outcome</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleMDTFormChange('outcome', 'Continue Active Surveillance')}
                    className={`w-full p-4 text-left border rounded transition-colors ${
                      mdtForm.outcome === 'Continue Active Surveillance' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Continue Active Surveillance</p>
                        <p className="text-sm text-gray-600">Patient remains on surveillance protocol</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleMDTFormChange('outcome', 'Proceed to Surgery')}
                    className={`w-full p-4 text-left border rounded transition-colors ${
                      mdtForm.outcome === 'Proceed to Surgery' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Proceed to Surgery</p>
                        <p className="text-sm text-gray-600">Schedule surgical intervention</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleMDTFormChange('outcome', 'Radiation Therapy')}
                    className={`w-full p-4 text-left border rounded transition-colors ${
                      mdtForm.outcome === 'Radiation Therapy' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Radiation Therapy</p>
                        <p className="text-sm text-gray-600">Refer for radiation oncology</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Discussion Notes */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Discussion Notes</h4>
                <textarea
                  value={mdtForm.discussionNotes}
                  onChange={(e) => handleMDTFormChange('discussionNotes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="6"
                  placeholder="Enter detailed MDT discussion notes, findings, and clinical reasoning..."
                />
              </div>

              {/* Recommendations */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">MDT Recommendations</h4>
                <textarea
                  value={mdtForm.recommendations}
                  onChange={(e) => handleMDTFormChange('recommendations', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Enter specific recommendations and next steps..."
                />
              </div>

              {/* Follow-up Actions */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Follow-up Actions</h4>
                  <button
                    type="button"
                    onClick={addFollowUpAction}
                    className="flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Action
                  </button>
                </div>
                <div className="space-y-3">
                  {mdtForm.followUpActions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => updateFollowUpAction(index, e.target.value)}
                        placeholder="e.g., Schedule pre-operative cardiology assessment"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {mdtForm.followUpActions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFollowUpAction(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Documents</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{mdtForm.documents.length} files</span>
                  </div>
                </div>

                {/* Drag and Drop Zone */}
                <div
                  className={`relative border-2 border-dashed rounded p-6 transition-all duration-200 ${
                    isDragOver
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="document-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      isDragOver ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`h-6 w-6 transition-colors ${
                        isDragOver ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <h5 className={`text-base font-medium mb-2 transition-colors ${
                      isDragOver ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {isDragOver ? 'Drop files here' : 'Upload Documents'}
                    </h5>
                    
                    <p className="text-sm text-gray-500 mb-3">
                      Drag and drop files here, or{' '}
                      <label
                        htmlFor="document-upload"
                        className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium underline"
                      >
                        browse to choose files
                      </label>
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                      <span>PDF, DOC, DOCX</span>
                      <span>JPG, PNG</span>
                      <span>Max 10MB</span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files List */}
                {mdtForm.documents.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h5>
                    <div className="space-y-2">
                      {mdtForm.documents.map((document, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="p-2 bg-blue-100 rounded">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{document}</p>
                              <p className="text-xs text-gray-500">Ready to attach</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => console.log('Download:', document)}
                              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="Download document"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Remove document"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 rounded-b-xl">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveMDTNote}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Save MDT Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddTeamMemberModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full border border-gray-200 rounded-xl shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Team Member</h3>
                    <p className="text-sm text-gray-600">Add a new team member to the MDT</p>
                  </div>
                </div>
                <button
                  onClick={closeAddTeamMemberModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newTeamMember.name}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the full name (Dr. will be added automatically)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department/Specialty *</label>
                <input
                  type="text"
                  value={newTeamMember.department}
                  onChange={(e) => setNewTeamMember(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="e.g., Cardiologist, Nurse Practitioner"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Enter the medical specialty or department</p>
              </div>

              {/* Preview */}
              {newTeamMember.name.trim() && newTeamMember.department.trim() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">Preview:</p>
                  <p className="text-sm text-blue-700">
                    Dr. {newTeamMember.name.trim()} ({newTeamMember.department.trim()})
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeAddTeamMemberModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewTeamMember}
                  disabled={!newTeamMember.name.trim() || !newTeamMember.department.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Add Team Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MDTNotesModal;



