import React, { useState } from 'react';
import { 
  UserPlus, 
  X,
  Mail,
  Phone,
  User,
  Stethoscope,
  Award,
  Calendar,
  AlertCircle,
  Save,
  FileText,
  MapPin
} from 'lucide-react';

const AddDoctorModal = ({ isOpen, onClose, onDoctorAdded }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional Information
    specialization: '',
    qualification: '',
    licenseNumber: '',
    department: 'Urology',
    joinDate: '',
    experience: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    postcode: '',
    
    // Additional Information
    status: 'Active',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    
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
      
      // Create doctor object
      const newDoctor = {
        id: `DOC${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: `Dr. ${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        qualification: formData.qualification,
        licenseNumber: formData.licenseNumber,
        department: formData.department,
        status: formData.status,
        joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
        experience: formData.experience,
        patients: 0,
        ...formData
      };
      
      console.log('New doctor created:', newDoctor);
      
      // Call the callback function to notify parent component
      if (onDoctorAdded) {
        onDoctorAdded(newDoctor);
      }
      
      // Reset form and close modal
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('Error creating doctor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      specialization: '',
      qualification: '',
      licenseNumber: '',
      department: 'Urology',
      joinDate: '',
      experience: '',
      address: '',
      city: '',
      state: '',
      postcode: '',
      status: 'Active',
      notes: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative mx-auto w-full max-w-5xl max-h-[95vh] overflow-hidden">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-[95vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Add New Doctor</h3>
                  <p className="text-sm text-gray-600 mt-1">Create a comprehensive doctor profile</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-900">Personal Information</h2>
                    <p className="text-sm text-slate-500">Basic personal details</p>
                  </div>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Email Address *
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
                      placeholder="doctor@uroprep.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.email}
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
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-900">Professional Information</h2>
                    <p className="text-sm text-slate-500">Medical credentials and expertise</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.specialization 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-200 bg-white focus:border-blue-500'
                      }`}
                    >
                      <option value="">Select specialization</option>
                      <option value="Urologist">Urologist</option>
                      <option value="Urology Registrar">Urology Registrar</option>
                      <option value="Consultant Urologist">Consultant Urologist</option>
                      <option value="Senior Urologist">Senior Urologist</option>
                    </select>
                    {errors.specialization && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.specialization}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Qualification *
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.qualification 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-200 bg-white focus:border-blue-500'
                      }`}
                      placeholder="e.g., MBBS, FRACS"
                    />
                    {errors.qualification && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.qualification}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 ${
                        errors.licenseNumber 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-slate-200 bg-white focus:border-blue-500'
                      }`}
                      placeholder="Medical license number"
                    />
                    {errors.licenseNumber && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                      placeholder="Department"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Join Date
                    </label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                      placeholder="e.g., 15 years"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-900">Address Information</h2>
                    <p className="text-sm text-slate-500">Contact address details</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-slate-900">Additional Information</h2>
                    <p className="text-sm text-slate-500">Status and notes</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500 resize-none"
                      placeholder="Any additional notes"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="group flex items-center px-6 py-3 border-2 border-slate-300 rounded-xl text-slate-700 hover:border-slate-400 transition-all duration-200 font-medium"
              >
                <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-green-800 to-black text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl"
              >
                <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                {isSubmitting ? 'Adding Doctor...' : 'Add Doctor'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;

