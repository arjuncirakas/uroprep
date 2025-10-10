import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Send, User, TestTube, Stethoscope, FileText, X } from 'lucide-react'

const NewReferralModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  
  // Form state
  const [formData, setFormData] = useState({
    // Patient Information
    patientName: '',
    dateOfBirth: '',
    medicareNumber: '',
    contactNumber: '',
    email: '',
    address: '',
    
    
    // PSA Details
    psaValue: '',
    psaDate: '',
    labReport: null,
    
    // Clinical Context
    dreFinding: '',
    familyHistory: false,
    comorbidities: [],
    imaging: null,
    preferredDoctor: '',
    
    // GP Details (auto-filled)
    gpName: user?.name || '',
    phoneNumber: user?.phoneNumber || '+61 3 9876 5432'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)


  // Comorbidity options
  const comorbidityOptions = [
    'Diabetes',
    'Hypertension',
    'Cardiovascular disease',
    'Obesity',
    'Previous cancer',
    'Chronic kidney disease',
    'Liver disease',
    'Immunocompromised',
    'Other'
  ]

  // Available doctors for referral
  const availableDoctors = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Rodriguez',
    'Dr. David Thompson',
    'Dr. Lisa Anderson',
    'Dr. James Wilson',
    'Dr. Maria Garcia',
    'Dr. Robert Brown',
    'Dr. Jennifer Taylor',
    'Dr. Christopher Lee',
    'Any Available Doctor'
  ]


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleComorbidityChange = (comorbidity) => {
    setFormData(prev => ({
      ...prev,
      comorbidities: prev.comorbidities.includes(comorbidity)
        ? prev.comorbidities.filter(c => c !== comorbidity)
        : [...prev.comorbidities, comorbidity]
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Patient Information validation
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.medicareNumber.trim()) newErrors.medicareNumber = 'Medicare number is required'
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required'
    
    
    // PSA Details validation
    if (!formData.psaValue) newErrors.psaValue = 'PSA value is required'
    if (!formData.psaDate) newErrors.psaDate = 'PSA test date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Generate patient ID
      const patientId = `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      
      const referralData = {
        ...formData,
        patientId,
        status: 'In Urology Queue',
        submittedAt: new Date().toISOString(),
        submittedBy: user.id
      }

      // Submit referral (API call would go here)
      console.log('Submitting referral:', referralData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      alert('Referral submitted successfully! Patient ID: ' + patientId)
      
      // Close modal after successful submission
      onClose()
      
    } catch (error) {
      console.error('Error submitting referral:', error)
      alert('Error submitting referral. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Referral</h1>
            <p className="text-gray-600">New Patient Referral Entry</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-gray-600" />
                  Patient Information
                  <span className="text-red-500 text-sm">*</span>
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-patientName" className="block text-sm font-medium text-gray-700">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-patientName"
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.patientName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.patientName && (
                      <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-medicareNumber" className="block text-sm font-medium text-gray-700">
                      Medicare Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-medicareNumber"
                      type="text"
                      value={formData.medicareNumber}
                      onChange={(e) => handleInputChange('medicareNumber', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.medicareNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter Medicare number"
                    />
                    {errors.medicareNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.medicareNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-contactNumber" className="block text-sm font-medium text-gray-700">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.contactNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="modal-address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>
                </div>
                
              </div>
            </div>


            {/* PSA Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                  <TestTube className="w-5 h-5 text-gray-600" />
                  PSA Details (Initial Test)
                  <span className="text-red-500 text-sm">*</span>
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-psaValue" className="block text-sm font-medium text-gray-700">
                      PSA Value (ng/mL) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-psaValue"
                      type="number"
                      step="0.01"
                      value={formData.psaValue}
                      onChange={(e) => handleInputChange('psaValue', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.psaValue ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 4.5"
                    />
                    {errors.psaValue && (
                      <p className="text-red-500 text-xs mt-1">{errors.psaValue}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-psaDate" className="block text-sm font-medium text-gray-700">
                      Date of Test <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-psaDate"
                      type="date"
                      value={formData.psaDate}
                      onChange={(e) => handleInputChange('psaDate', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.psaDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.psaDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.psaDate}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="modal-labReport" className="block text-sm font-medium text-gray-700">
                    Upload Lab Report (PDF or Image)
                  </label>
                  <div className="relative">
                    <input
                      id="modal-labReport"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('labReport', e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer group">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">
                            <span className="text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    {formData.labReport && (
                      <div className="mt-2 flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800 font-medium">{formData.labReport.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileUpload('labReport', null)}
                          className="ml-auto text-green-600 hover:text-green-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Context Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                  <Stethoscope className="w-5 h-5 text-gray-600" />
                  Clinical Context (Optional)
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-dreFinding" className="block text-sm font-medium text-gray-700">
                      DRE Finding
                    </label>
                    <select
                      id="modal-dreFinding"
                      value={formData.dreFinding}
                      onChange={(e) => handleInputChange('dreFinding', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select DRE finding</option>
                      <option value="normal">Normal</option>
                      <option value="abnormal">Abnormal</option>
                      <option value="not-done">Not Done</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Family History of Prostate Cancer
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          value="yes"
                          checked={formData.familyHistory === true}
                          onChange={(e) => handleInputChange('familyHistory', e.target.value === 'yes')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          value="no"
                          checked={formData.familyHistory === false}
                          onChange={(e) => handleInputChange('familyHistory', e.target.value !== 'yes')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-preferredDoctor" className="block text-sm font-medium text-gray-700">
                      Preferred Doctor
                    </label>
                    <select
                      id="modal-preferredDoctor"
                      value={formData.preferredDoctor}
                      onChange={(e) => handleInputChange('preferredDoctor', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select preferred doctor (optional)</option>
                      {availableDoctors.map((doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Co-morbidities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                    {comorbidityOptions.map((comorbidity) => (
                      <label key={comorbidity} className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.comorbidities.includes(comorbidity)}
                          onChange={() => handleComorbidityChange(comorbidity)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{comorbidity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="modal-imaging" className="block text-sm font-medium text-gray-700">
                    Upload Imaging (MRI/US if available)
                  </label>
                  <div className="relative">
                    <input
                      id="modal-imaging"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.dcm"
                      onChange={(e) => handleFileUpload('imaging', e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer group">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">
                            <span className="text-purple-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DCM up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    {formData.imaging && (
                      <div className="mt-2 flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800 font-medium">{formData.imaging.name}</span>
                        <button
                          type="button"
                          onClick={() => handleFileUpload('imaging', null)}
                          className="ml-auto text-green-600 hover:text-green-800"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* GP Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                  <User className="w-5 h-5 text-gray-600" />
                  Referring GP Details
                  <span className="text-xs text-gray-500 font-normal">(Auto-filled from GP Profile)</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-gpName" className="block text-sm font-medium text-gray-700">
                      GP Name
                    </label>
                    <input
                      id="modal-gpName"
                      type="text"
                      value={formData.gpName}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      id="modal-phoneNumber"
                      type="text"
                      value={formData.phoneNumber}
                      readOnly
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex gap-3 order-2 sm:order-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-green-800 to-black text-white font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Referral
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewReferralModal
