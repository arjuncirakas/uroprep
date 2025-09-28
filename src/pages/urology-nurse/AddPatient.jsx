import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  X,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  User,
  Stethoscope,
  Heart,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
  Activity
} from 'lucide-react';

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    postcode: '',
    city: '',
    state: '',
    
    // Medical Information
    referringGP: '',
    referralDate: '',
    initialPSA: '',
    initialPSADate: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    
    // Initial Assessment
    pathway: 'OPD Queue',
    priority: 'Normal',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGPReferral, setIsGPReferral] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.initialPSA) newErrors.initialPSA = 'Initial PSA is required';
    
    // GP Referral validation (only if GP referral is enabled)
    if (isGPReferral) {
      if (!formData.referringGP.trim()) newErrors.referringGP = 'Referring GP is required';
      if (!formData.referralDate) newErrors.referralDate = 'Referral date is required';
    }
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate UPI
      const upi = `URP${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      
      // Create patient object
      const newPatient = {
        id: `PAT${String(mockPatients.length + 1).padStart(3, '0')}`,
        upi,
        name: `${formData.firstName} ${formData.lastName}`,
        ...formData,
        status: 'Active',
        lastAppointment: formData.referralDate,
        nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        lastPSA: parseFloat(formData.initialPSA),
        lastPSADate: formData.initialPSADate,
        age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
      };
      
      console.log('New patient created:', newPatient);
      
      // Navigate back to patients list
      navigate('/urology-nurse/patients');
      
    } catch (error) {
      console.error('Error creating patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/urology-nurse/patients');
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleCancel}
              className="group flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Patients
            </button>
            <div className="flex-1">
              <h1 className="text-4xl font-medium text-slate-900 mb-2">Add New Patient</h1>
              <p className="text-lg text-slate-600 font-light">Create a comprehensive patient record for the urology department</p>
            </div>
          </div>
        </div>

        {/* Patient Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Personal Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500">Basic patient details and contact information</p>
              </div>
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.firstName 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.firstName}
                  </p>
                )}
              </div>
            
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.lastName 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.lastName}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.dateOfBirth 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.gender 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.gender}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.phone 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                  placeholder="+61 412 345 678"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                  placeholder="patient@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          
            <div className="mt-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                placeholder="Street address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Postcode
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  placeholder="2000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  placeholder="Sydney"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                >
                  <option value="">Select state</option>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
              </div>
            </div>
          </div>

          {/* PSA Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-900">PSA Information</h2>
                <p className="text-sm text-slate-500">Prostate-specific antigen levels and testing details</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Initial PSA Level *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="initialPSA"
                  value={formData.initialPSA}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.initialPSA 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-slate-200 bg-white focus:border-blue-500'
                  }`}
                  placeholder="4.5"
                />
                {errors.initialPSA && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.initialPSA}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  PSA Test Date
                </label>
                <input
                  type="date"
                  name="initialPSADate"
                  value={formData.initialPSADate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* GP Referral Toggle */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-900">GP Referral</h2>
                  <p className="text-sm text-slate-500">Toggle if patient is referred by a GP</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => setIsGPReferral(!isGPReferral)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isGPReferral ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                    title={isGPReferral ? "GP Referral is enabled - Click to disable" : "GP Referral is disabled - Click to enable"}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                        isGPReferral ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {isGPReferral ? "GP Referral Enabled" : "GP Referral Disabled"}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isGPReferral 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isGPReferral ? 'bg-indigo-500' : 'bg-slate-400'
                  }`}></div>
                  <span>{isGPReferral ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
            
            {isGPReferral && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Referring GP *
                  </label>
                  <input
                    type="text"
                    name="referringGP"
                    value={formData.referringGP}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                      errors.referringGP 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-slate-200 bg-white focus:border-blue-500'
                    }`}
                    placeholder="Dr. Sarah Johnson"
                  />
                  {errors.referringGP && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.referringGP}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Referral Date *
                  </label>
                  <input
                    type="date"
                    name="referralDate"
                    value={formData.referralDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                      errors.referralDate 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-slate-200 bg-white focus:border-blue-500'
                    }`}
                  />
                  {errors.referralDate && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {errors.referralDate}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Medical Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-900">Medical Information</h2>
                <p className="text-sm text-slate-500">Clinical details and treatment pathway</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Initial Pathway
                </label>
                <select
                  name="pathway"
                  value={formData.pathway}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                >
                  <option value="OPD Queue">OPD Queue</option>
                  <option value="Active Surveillance">Active Surveillance</option>
                  <option value="Surgical Pathway">Surgical Pathway</option>
                  <option value="Post-Op Follow-up">Post-Op Follow-up</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          
            <div className="mt-8">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
                placeholder="Previous medical conditions, surgeries, etc."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Current Medications
                </label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
                  placeholder="List current medications"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
                  placeholder="Known allergies"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-900">Emergency Contact</h2>
                <p className="text-sm text-slate-500">Emergency contact information for the patient</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  placeholder="Emergency contact name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  placeholder="+61 412 345 678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Relationship
                </label>
                <input
                  type="text"
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                  placeholder="Spouse, Child, etc."
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-slate-900">Additional Notes</h2>
                <p className="text-sm text-slate-500">Any additional notes or special considerations</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
                placeholder="Any additional notes or special considerations"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-6 pt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="group flex items-center px-8 py-3 border-2 border-slate-300 rounded-xl text-slate-700 hover:border-slate-400 transition-all duration-200 font-medium"
            >
              <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex items-center px-8 py-3 bg-gradient-to-r from-green-800 to-black text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
            >
              <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              {isSubmitting ? 'Adding Patient...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;

