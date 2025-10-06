import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save,
  CheckCircle,
  Award,
  GraduationCap,
  Building2,
  UserCheck,
  Key,
  Briefcase,
  Star,
  Users,
  Target,
  BookOpen,
  Home,
  FileText,
  Shield,
  Activity
} from 'lucide-react';
import { useSelector } from 'react-redux';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, role, permissions } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  
  // Generate dummy data based on role
  const getDummyUserData = () => {
    const dummyData = {
      gp: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@gppractice.com',
        phone: '+1 (555) 123-4567',
        employeeId: 'GP-2024-001',
        address: '123 Main Street, Healthcare District, City 12345',
        emergencyContact: 'John Johnson (Spouse) - +1 (555) 987-6543',
        qualifications: 'MBBS, MRCGP, Diploma in Family Medicine',
        licenseNumber: 'GMC-12345678',
        hireDate: '2020-03-15',
        practice: 'Greenfield Medical Practice',
        practiceAddress: '456 Healthcare Blvd, City 12345',
        practicePhone: '+1 (555) 555-0123'
      },
      urologist: {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        phone: '+1 (555) 234-5678',
        employeeId: 'URO-2024-015',
        department: 'Urology Department',
        specialization: 'Urological Oncology & Robotic Surgery',
        address: '789 Medical Center Dr, Healthcare City 54321',
        emergencyContact: 'Lisa Chen (Wife) - +1 (555) 876-5432',
        qualifications: 'MBBS, MS (Urology), FRCS (Urol), Fellowship in Robotic Surgery',
        licenseNumber: 'GMC-87654321',
        hireDate: '2018-07-01',
        subspecialty: 'Prostate Cancer, Kidney Surgery, Bladder Reconstruction',
        yearsExperience: '12 years'
      },
      urology_nurse: {
        name: 'Emma Thompson',
        email: 'emma.thompson@hospital.com',
        phone: '+1 (555) 345-6789',
        employeeId: 'URN-2024-008',
        department: 'Urology Department',
        specialization: 'Urology Clinical Nursing',
        address: '321 Nurse Lane, Medical District 67890',
        emergencyContact: 'Robert Thompson (Brother) - +1 (555) 765-4321',
        qualifications: 'RN, BSc Nursing, Urology Nurse Specialist Certificate',
        licenseNumber: 'NMC-11223344',
        hireDate: '2021-09-10',
        certifications: 'Advanced Urology Care, Patient Education Specialist',
        yearsExperience: '8 years'
      },
      admin: {
        name: 'Jennifer Smith',
        email: 'jennifer.smith@hospital.com',
        phone: '+1 (555) 456-7890',
        employeeId: 'ADM-2024-003',
        department: 'Hospital Administration',
        specialization: 'Healthcare Management',
        address: '654 Admin Plaza, Corporate City 11111',
        emergencyContact: 'David Smith (Husband) - +1 (555) 654-3210',
        qualifications: 'MBA Healthcare Management, BSc Health Administration',
        licenseNumber: 'ADM-55667788',
        hireDate: '2019-01-15',
        responsibilities: 'System Administration, User Management, Data Analytics',
        yearsExperience: '10 years'
      },
      mdt_coordinator: {
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@hospital.com',
        phone: '+1 (555) 567-8901',
        employeeId: 'MDT-2024-005',
        department: 'MDT Coordination',
        specialization: 'Multi-Disciplinary Team Coordination',
        address: '987 Coordination Ave, Medical Complex 22222',
        emergencyContact: 'Maria Wilson (Wife) - +1 (555) 543-2109',
        qualifications: 'MBBS, MSc Healthcare Leadership, MDT Coordination Certificate',
        licenseNumber: 'GMC-99887766',
        hireDate: '2020-06-01',
        focus: 'Cancer Care Coordination, Team Management, Quality Assurance',
        yearsExperience: '9 years'
      },
      urology_registrar: {
        name: 'Dr. Alex Kumar',
        email: 'alex.kumar@hospital.com',
        phone: '+1 (555) 678-9012',
        employeeId: 'REG-2024-012',
        department: 'Urology Department',
        specialization: 'Urology Registrar',
        address: '147 Registrar Street, Training Center 33333',
        emergencyContact: 'Priya Kumar (Sister) - +1 (555) 432-1098',
        qualifications: 'MBBS, MRCS, Currently pursuing FRCS (Urol)',
        licenseNumber: 'GMC-44332211',
        hireDate: '2022-08-01',
        trainingLevel: 'Senior Registrar (Year 4)',
        supervisor: 'Dr. Michael Chen (Consultant)',
        yearsExperience: '6 years'
      }
    };
    
    return dummyData[role] || dummyData.urologist;
  };

  const dummyData = getDummyUserData();
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || dummyData.name,
    email: user?.email || dummyData.email,
    phone: user?.phone || dummyData.phone,
    department: user?.department || dummyData.department || '',
    employeeId: user?.employeeId || dummyData.employeeId,
    specialization: user?.specialization || dummyData.specialization || '',
    qualifications: user?.qualifications || dummyData.qualifications,
    licenseNumber: user?.licenseNumber || dummyData.licenseNumber,
    address: user?.address || dummyData.address,
    emergencyContact: user?.emergencyContact || dummyData.emergencyContact,
    hireDate: user?.hireDate || dummyData.hireDate,
    lastLogin: user?.lastLogin || new Date().toISOString(),
    // Additional role-specific fields
    practice: dummyData.practice || '',
    practiceAddress: dummyData.practiceAddress || '',
    practicePhone: dummyData.practicePhone || '',
    subspecialty: dummyData.subspecialty || '',
    yearsExperience: dummyData.yearsExperience || '',
    certifications: dummyData.certifications || '',
    responsibilities: dummyData.responsibilities || '',
    focus: dummyData.focus || '',
    trainingLevel: dummyData.trainingLevel || '',
    supervisor: dummyData.supervisor || '',
  });

  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: 'Administrator',
      gp: 'General Practitioner',
      urology_nurse: 'Urology Clinical Nurse',
      urologist: 'Urologist',
      urology_registrar: 'Urology Registrar',
      mdt_coordinator: 'MDT Coordinator'
    };
    return roleMap[role] || role;
  };

  const getRoleIcon = (role) => {
    const iconMap = {
      admin: Shield,
      gp: UserCheck,
      urology_nurse: Activity,
      urologist: User,
      urology_registrar: GraduationCap,
      mdt_coordinator: Building2
    };
    return iconMap[role] || User;
  };

  const getRoleColor = (role) => {
    const colorMap = {
      admin: 'from-red-500 to-red-700',
      gp: 'from-blue-500 to-blue-700',
      urology_nurse: 'from-green-500 to-green-700',
      urologist: 'from-purple-500 to-purple-700',
      urology_registrar: 'from-indigo-500 to-indigo-700',
      mdt_coordinator: 'from-orange-500 to-orange-700'
    };
    return colorMap[role] || 'from-gray-500 to-gray-700';
  };

  // Helper functions to determine field visibility based on role
  const isHospitalStaff = () => ['urologist', 'urology_nurse', 'urology_registrar', 'admin', 'mdt_coordinator'].includes(role);
  const isGP = () => role === 'gp';
  const isDoctor = () => ['urologist', 'urology_registrar', 'mdt_coordinator'].includes(role);
  const isNurse = () => role === 'urology_nurse';
  const isAdmin = () => role === 'admin';
  const isRegistrar = () => role === 'urology_registrar';

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically dispatch an action to update the user profile
    // For now, we'll just close the editing mode
    setIsEditing(false);
    // TODO: Implement profile update logic
  };

  const handleCancel = () => {
    setEditedProfile({
      name: user?.name || dummyData.name,
      email: user?.email || dummyData.email,
      phone: user?.phone || dummyData.phone,
      department: user?.department || dummyData.department || '',
      employeeId: user?.employeeId || dummyData.employeeId,
      specialization: user?.specialization || dummyData.specialization || '',
      qualifications: user?.qualifications || dummyData.qualifications,
      licenseNumber: user?.licenseNumber || dummyData.licenseNumber,
      address: user?.address || dummyData.address,
      emergencyContact: user?.emergencyContact || dummyData.emergencyContact,
      hireDate: user?.hireDate || dummyData.hireDate,
      lastLogin: user?.lastLogin || new Date().toISOString(),
      // Additional role-specific fields
      practice: dummyData.practice || '',
      practiceAddress: dummyData.practiceAddress || '',
      practicePhone: dummyData.practicePhone || '',
      subspecialty: dummyData.subspecialty || '',
      yearsExperience: dummyData.yearsExperience || '',
      certifications: dummyData.certifications || '',
      responsibilities: dummyData.responsibilities || '',
      focus: dummyData.focus || '',
      trainingLevel: dummyData.trainingLevel || '',
      supervisor: dummyData.supervisor || '',
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const RoleIcon = getRoleIcon(role);
  const roleColor = getRoleColor(role);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-gray-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-gray-200/60 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 bg-gradient-to-br ${roleColor} rounded-xl`}>
                <RoleIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Professional Profile
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1">View and manage your professional information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2.5 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2.5 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] px-8 py-6">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl p-8 border border-gray-200/60 mb-8">
            <div className="flex items-center space-x-6">
              <div className={`h-24 w-24 bg-gradient-to-br ${roleColor} rounded-2xl flex items-center justify-center relative`}>
                <User className="h-12 w-12 text-white" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                    />
                  ) : (
                    editedProfile.name || 'User Name'
                  )}
                </h2>
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${roleColor} text-white`}>
                    <RoleIcon className="h-4 w-4 mr-2" />
                    {getRoleDisplayName(role)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active Status
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{editedProfile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{editedProfile.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <Mail className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-medium">{editedProfile.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <Phone className="h-5 w-5 mr-3 text-blue-600" />
                      <span className="font-medium">{editedProfile.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                    />
                  ) : (
                    <div className="flex items-start text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <MapPin className="h-5 w-5 mr-3 text-blue-600 mt-0.5" />
                      <span className="font-medium">{editedProfile.address || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mr-3">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isGP() ? 'Practice Information' : 'Professional Information'}
                </h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Employee ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <Key className="h-5 w-5 mr-3 text-purple-600" />
                      <span className="font-medium">{editedProfile.employeeId || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                
                {/* GP Practice Information */}
                {isGP() && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Practice Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.practice}
                          onChange={(e) => handleInputChange('practice', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <Home className="h-5 w-5 mr-3 text-purple-600" />
                          <span className="font-medium">{editedProfile.practice || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Practice Address</label>
                      {isEditing ? (
                        <textarea
                          value={editedProfile.practiceAddress}
                          onChange={(e) => handleInputChange('practiceAddress', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-start text-gray-900">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                          {editedProfile.practiceAddress || 'Not provided'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Practice Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.practicePhone}
                          onChange={(e) => handleInputChange('practicePhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          {editedProfile.practicePhone || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Hospital Staff Information */}
                {isHospitalStaff() && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">Department</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900 bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <Building2 className="h-5 w-5 mr-3 text-purple-600" />
                          <span className="font-medium">{editedProfile.department || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.specialization}
                          onChange={(e) => handleInputChange('specialization', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                          {editedProfile.specialization || 'Not provided'}
                        </div>
                      )}
                    </div>
                    {isDoctor() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subspecialty</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.subspecialty}
                            onChange={(e) => handleInputChange('subspecialty', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center text-gray-900">
                            <Target className="h-4 w-4 mr-2 text-gray-500" />
                            {editedProfile.subspecialty || 'Not provided'}
                          </div>
                        )}
                      </div>
                    )}
                    {isRegistrar() && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Training Level</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.trainingLevel}
                              onChange={(e) => handleInputChange('trainingLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center text-gray-900">
                              <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                              {editedProfile.trainingLevel || 'Not provided'}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedProfile.supervisor}
                              onChange={(e) => handleInputChange('supervisor', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          ) : (
                            <div className="flex items-center text-gray-900">
                              <Users className="h-4 w-4 mr-2 text-gray-500" />
                              {editedProfile.supervisor || 'Not provided'}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                    {isAdmin() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.responsibilities}
                            onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-start text-gray-900">
                            <FileText className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                            {editedProfile.responsibilities || 'Not provided'}
                          </div>
                        )}
                      </div>
                    )}
                    {isNurse() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.certifications}
                            onChange={(e) => handleInputChange('certifications', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-start text-gray-900">
                            <Star className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                            {editedProfile.certifications || 'Not provided'}
                          </div>
                        )}
                      </div>
                    )}
                    {role === 'mdt_coordinator' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Focus Areas</label>
                        {isEditing ? (
                          <textarea
                            value={editedProfile.focus}
                            onChange={(e) => handleInputChange('focus', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-start text-gray-900">
                            <Target className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                            {editedProfile.focus || 'Not provided'}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Shield className="h-4 w-4 mr-2 text-gray-500" />
                      {editedProfile.licenseNumber || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.yearsExperience}
                      onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      {editedProfile.yearsExperience || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg mr-3">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Qualifications & Experience</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Professional Qualifications</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  placeholder="e.g., MBBS, MD, FRCS, MRCGP, etc."
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start">
                    <GraduationCap className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" />
                    <span className="font-medium leading-relaxed">{editedProfile.qualifications || 'No qualifications listed'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg mr-3">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Emergency Contact Information</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Name and phone number"
                />
              ) : (
                <div className="text-gray-900 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 text-red-600 mt-0.5" />
                    <span className="font-medium">{editedProfile.emergencyContact || 'Not provided'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200/60 px-8 py-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200 font-medium border border-gray-200 hover:border-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
