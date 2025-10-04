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
    idProof: null,
    insuranceInfo: null,
    
    // Referral Type
    referralType: 'cpc', // 'cpc' or 'clinical-override'
    cpcCriteria: '',
    clinicalOverrideReason: '',
    
    // PSA Details
    psaValue: '',
    psaDate: '',
    labReport: null,
    
    // Clinical Context
    dreFinding: '',
    familyHistory: false,
    comorbidities: [],
    imaging: null,
    
    // GP Details (auto-filled)
    gpName: user?.name || '',
    providerNumber: user?.providerNumber || ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // CPC Criteria options
  const cpcCriteriaOptions = [
    'PSA > 3.0 ng/mL',
    'PSA > 4.0 ng/mL',
    'Abnormal DRE',
    'Family history of prostate cancer',
    'Rising PSA trend',
    'PSA velocity > 0.35 ng/mL/year',
    'Age-specific PSA elevation',
    'Previous negative biopsy with persistent elevation'
  ]

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
    
    // Referral Type validation
    if (formData.referralType === 'cpc' && !formData.cpcCriteria) {
      newErrors.cpcCriteria = 'CPC criteria is required'
    }
    if (formData.referralType === 'clinical-override' && !formData.clinicalOverrideReason.trim()) {
      newErrors.clinicalOverrideReason = 'Clinical override reason is required'
    }
    
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
            <p className="text-gray-600">CPC or Clinical Override Entry</p>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="modal-idProof" className="block text-sm font-medium text-gray-700">
                      ID Proof (Optional)
                    </label>
                    <input
                      id="modal-idProof"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('idProof', e.target.files[0])}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="modal-insuranceInfo" className="block text-sm font-medium text-gray-700">
                      Insurance Information (Optional)
                    </label>
                    <input
                      id="modal-insuranceInfo"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('insuranceInfo', e.target.files[0])}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Type Section */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Referral Type
                  <span className="text-red-500 text-sm">*</span>
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Select Referral Type</label>
                  <div className="flex gap-6">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="radio"
                        value="cpc"
                        checked={formData.referralType === 'cpc'}
                        onChange={(e) => handleInputChange('referralType', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">CPC Criteria</span>
                    </label>
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="radio"
                        value="clinical-override"
                        checked={formData.referralType === 'clinical-override'}
                        onChange={(e) => handleInputChange('referralType', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700">Clinical Override</span>
                    </label>
                  </div>
                </div>
                
                {formData.referralType === 'cpc' && (
                  <div className="space-y-2">
                    <label htmlFor="modal-cpcCriteria" className="block text-sm font-medium text-gray-700">
                      CPC Criteria <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="modal-cpcCriteria"
                      value={formData.cpcCriteria}
                      onChange={(e) => handleInputChange('cpcCriteria', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.cpcCriteria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select CPC criteria</option>
                      {cpcCriteriaOptions.map((criteria) => (
                        <option key={criteria} value={criteria}>
                          {criteria}
                        </option>
                      ))}
                    </select>
                    {errors.cpcCriteria && (
                      <p className="text-red-500 text-xs mt-1">{errors.cpcCriteria}</p>
                    )}
                  </div>
                )}
                
                {formData.referralType === 'clinical-override' && (
                  <div className="space-y-2">
                    <label htmlFor="modal-clinicalOverrideReason" className="block text-sm font-medium text-gray-700">
                      Clinical Override Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="modal-clinicalOverrideReason"
                      value={formData.clinicalOverrideReason}
                      onChange={(e) => handleInputChange('clinicalOverrideReason', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        errors.clinicalOverrideReason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Provide detailed clinical reasoning for override"
                      rows={4}
                    />
                    {errors.clinicalOverrideReason && (
                      <p className="text-red-500 text-xs mt-1">{errors.clinicalOverrideReason}</p>
                    )}
                  </div>
                )}
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
                  <input
                    id="modal-labReport"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('labReport', e.target.files[0])}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
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
                  <input
                    id="modal-imaging"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.dcm"
                    onChange={(e) => handleFileUpload('imaging', e.target.files[0])}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
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
                    <label htmlFor="modal-providerNumber" className="block text-sm font-medium text-gray-700">
                      Provider Number
                    </label>
                    <input
                      id="modal-providerNumber"
                      type="text"
                      value={formData.providerNumber}
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
