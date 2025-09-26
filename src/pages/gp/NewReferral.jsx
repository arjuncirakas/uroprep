import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Save, ArrowLeft, AlertTriangle, CheckCircle, Info, Send, FileText } from 'lucide-react';

const NewReferral = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Patient Information
    patientName: '',
    dateOfBirth: '',
    phoneNumber: '',
    medicareNumber: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    mrn: '',
    
    // Referring Clinician Information
    referringClinician: '',
    providerNumber: '',
    practiceName: '',
    practicePhone: '',
    
    // Clinical Information
    psaValue: '',
    psaDate: '',
    previousPsa: '',
    dreFindings: '',
    comorbidities: '',
    currentMedications: '',
    symptoms: '',
    
    // Risk Factors
    isAboriginalTorresStraitIslander: false,
    familyHistoryProstateCancer: false,
    familyHistoryBreastCancer: false,
    
    // CPC Criteria
    cpcCompliant: false,
    clinicalOverride: false,
    overrideJustification: '',
    
    // Prior Imaging
    priorImaging: {
      mri: false,
      ct: false,
      ultrasound: false,
      boneScan: false
    },
    
    triagePriority: 'Routine'
  });

  const [files, setFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [cpcStatus, setCpcStatus] = useState({});
  const [upi, setUpi] = useState('');

  // Generate UPI on component mount
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    setUpi(`URP${currentYear}${randomNum}`);
  }, []);

  // CPC Criteria Validation
  const validateCPCCriteria = () => {
    const age = calculateAge(formData.dateOfBirth);
    const psaValue = parseFloat(formData.psaValue);
    
    let criteria = {
      psaCriteria: false,
      ageCriteria: false,
      riskFactorCriteria: false,
      clinicalCriteria: false,
      isCompliant: false
    };

    // PSA Criteria
    if (psaValue >= 4.0 && age >= 50 && age <= 69) {
      criteria.psaCriteria = true;
    } else if (psaValue >= 2.0 && (formData.isAboriginalTorresStraitIslander || formData.familyHistoryProstateCancer)) {
      criteria.psaCriteria = true;
    }

    // Age Criteria
    criteria.ageCriteria = age >= 40 && age <= 80;

    // Risk Factor Criteria
    criteria.riskFactorCriteria = formData.familyHistoryProstateCancer || 
                                 formData.familyHistoryBreastCancer || 
                                 formData.isAboriginalTorresStraitIslander;

    // Clinical Criteria (DRE findings, symptoms)
    criteria.clinicalCriteria = formData.dreFindings !== '' || formData.symptoms !== '';

    // Overall compliance
    criteria.isCompliant = criteria.psaCriteria || criteria.clinicalCriteria;

    setCpcStatus(criteria);
    return criteria;
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Auto-triage based on clinical parameters
  const determineTriagePriority = () => {
    const psaValue = parseFloat(formData.psaValue);
    const age = calculateAge(formData.dateOfBirth);
    
    if (psaValue > 100) {
      return 'URGENT';
    } else if (psaValue > 20 || (age > 75 && formData.comorbidities)) {
      return 'High';
    } else if (psaValue > 4 || formData.dreFindings.toLowerCase().includes('abnormal')) {
      return 'Medium';
    } else {
      return 'Routine';
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    const age = calculateAge(formData.dateOfBirth);
    const psaValue = parseFloat(formData.psaValue);

    // Required fields validation
    if (!formData.patientName) errors.patientName = 'Patient name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.medicareNumber) errors.medicareNumber = 'Medicare number is required';
    if (!formData.psaValue) errors.psaValue = 'PSA value is required';
    if (!formData.psaDate) errors.psaDate = 'PSA test date is required';
    if (!formData.dreFindings) errors.dreFindings = 'DRE findings are mandatory';
    if (!formData.referringClinician) errors.referringClinician = 'Referring clinician is required';
    if (!formData.providerNumber) errors.providerNumber = 'Provider number is required';
    if (!formData.symptoms) errors.symptoms = 'Clinical symptoms/indication is required';

    // Clinical validation
    if (psaValue > 100) {
      // Auto-flag as urgent - no error, just notification
    }
    if (age < 40 || age > 80) {
      errors.ageOverride = 'Age outside standard range - clinical override required';
    }
    if (!formData.medicareNumber || formData.medicareNumber.length < 10) {
      errors.medicareNumber = 'Valid Medicare number required for patient eligibility';
    }

    // CPC Compliance check
    const cpcValidation = validateCPCCriteria();
    if (!cpcValidation.isCompliant && !formData.clinicalOverride) {
      errors.cpcCompliance = 'Referral does not meet CPC criteria. Clinical override justification required.';
    }
    if (formData.clinicalOverride && !formData.overrideJustification) {
      errors.overrideJustification = 'Clinical override justification is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('priorImaging.')) {
      const imagingType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        priorImaging: {
          ...prev.priorImaging,
          [imagingType]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please correct the validation errors before submitting.');
      return;
    }

    // Auto-determine triage priority
    const triagePriority = determineTriagePriority();
    
    const submissionData = {
      ...formData,
      upi: upi,
      triagePriority: triagePriority,
      submissionTimestamp: new Date().toISOString(),
      cpcValidation: cpcStatus,
      files: files
    };

    console.log('Submitting referral:', submissionData);
    
    // TODO: Submit to backend API
    alert(`Referral submitted successfully!\nUPI: ${upi}\nTriage Priority: ${triagePriority}`);
  };

  // Real-time validation on field changes
  useEffect(() => {
    if (formData.psaValue || formData.dateOfBirth) {
      validateCPCCriteria();
    }
  }, [formData.psaValue, formData.dateOfBirth, formData.isAboriginalTorresStraitIslander, formData.familyHistoryProstateCancer]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/gp/dashboard')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">New Referral</h1>
              <p className="text-sm text-gray-600 mt-1">Create a new urology referral with clinical assessment</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Info className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-900">UPI: {upi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CPC Criteria Status */}
      {(formData.psaValue || formData.dateOfBirth) && (
        <div className={`border rounded-xl p-4 ${
          cpcStatus.isCompliant ? 'bg-gradient-to-r from-green-50 to-gray-50 border-green-200' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-3">
            {cpcStatus.isCompliant ? (
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            )}
            <div>
              <span className={`text-base font-semibold ${
                cpcStatus.isCompliant ? 'text-green-900' : 'text-yellow-900'
              }`}>
                CPC Criteria Status: {cpcStatus.isCompliant ? 'COMPLIANT' : 'REQUIRES CLINICAL OVERRIDE'}
              </span>
              {!cpcStatus.isCompliant && (
                <p className="text-sm text-yellow-800 mt-1">
                  Referral does not meet standard CPC criteria. Clinical override justification required.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Urgent PSA Alert */}
      {parseFloat(formData.psaValue) > 100 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <span className="text-base font-semibold text-red-900">URGENT: PSA &gt; 100 ng/mL</span>
              <p className="text-sm text-red-800 mt-1">
                Immediate urologist notification triggered. Patient requires urgent assessment.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Referring Clinician Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-900">Referring Clinician Information</h2>
            <p className="text-sm text-gray-600 mt-1">Primary care provider details and practice information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Referring Clinician Name *</label>
                <input
                  type="text"
                  name="referringClinician"
                  value={formData.referringClinician}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.referringClinician ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Dr. John Smith"
                  required
                />
                {validationErrors.referringClinician && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.referringClinician}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider Number *</label>
                <input
                  type="text"
                  name="providerNumber"
                  value={formData.providerNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.providerNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="1234567A"
                  required
                />
                {validationErrors.providerNumber && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.providerNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name</label>
                <input
                  type="text"
                  name="practiceName"
                  value={formData.practiceName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="City Medical Centre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Practice Phone</label>
                <input
                  type="tel"
                  name="practicePhone"
                  value={formData.practicePhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="(02) 1234 5678"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-900">Patient Demographics</h2>
            <p className="text-sm text-gray-600 mt-1">Patient identification and contact information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.patientName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="John Smith"
                  required
                />
                {validationErrors.patientName && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.patientName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  required
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.dateOfBirth}
                  </p>
                )}
                {validationErrors.ageOverride && (
                  <p className="text-yellow-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.ageOverride}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medicare Number *</label>
                <input
                  type="text"
                  name="medicareNumber"
                  value={formData.medicareNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.medicareNumber ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="1234567890"
                  required
                />
                {validationErrors.medicareNumber && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.medicareNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="(02) 1234 5678"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="123 Main Street, Suburb, State 2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MRN (if existing patient)</label>
                <input
                  type="text"
                  name="mrn"
                  value={formData.mrn}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="Leave blank for new patient"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="Jane Smith (Spouse)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="(02) 9876 5432"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-900">Clinical Assessment</h2>
            <p className="text-sm text-gray-600 mt-1">PSA values, examination findings, and clinical indicators</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current PSA Value (ng/mL) *</label>
                <input
                  type="number"
                  step="0.1"
                  name="psaValue"
                  value={formData.psaValue}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.psaValue ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="4.5"
                  required
                />
                {validationErrors.psaValue && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.psaValue}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PSA Test Date *</label>
                <input
                  type="date"
                  name="psaDate"
                  value={formData.psaDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.psaDate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  required
                />
                {validationErrors.psaDate && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.psaDate}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Previous PSA Values (if available)</label>
                <textarea
                  name="previousPsa"
                  value={formData.previousPsa}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                  placeholder="e.g., 2.5 (2023-06-15), 3.1 (2023-12-10)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">DRE Findings *</label>
                <select
                  name="dreFindings"
                  value={formData.dreFindings}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.dreFindings ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  required
                >
                  <option value="">Select DRE findings</option>
                  <option value="normal">Normal</option>
                  <option value="abnormal_smooth_enlargement">Abnormal - Smooth enlargement</option>
                  <option value="abnormal_irregular">Abnormal - Irregular/nodular</option>
                  <option value="abnormal_hard">Abnormal - Hard/indurated</option>
                  <option value="unable_to_assess">Unable to assess</option>
                </select>
                {validationErrors.dreFindings && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.dreFindings}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Symptoms/Indication *</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.symptoms ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Describe patient's symptoms, LUTS, bone pain, weight loss, or other clinical findings..."
                  required
                />
                {validationErrors.symptoms && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.symptoms}
                  </p>
                )}
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Risk Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAboriginalTorresStraitIslander"
                    checked={formData.isAboriginalTorresStraitIslander}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Aboriginal/Torres Strait Islander</span>
                </label>
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="familyHistoryProstateCancer"
                    checked={formData.familyHistoryProstateCancer}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Family History - Prostate Cancer</span>
                </label>
                <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="familyHistoryBreastCancer"
                    checked={formData.familyHistoryBreastCancer}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Family History - Breast Cancer</span>
                </label>
              </div>
            </div>

            {/* Medical History */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Medical History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comorbidities</label>
                  <textarea
                    name="comorbidities"
                    value={formData.comorbidities}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                    placeholder="Diabetes, cardiovascular disease, previous cancers, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <textarea
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                    placeholder="Anticoagulants, 5-ARI inhibitors, other medications..."
                  />
                </div>
              </div>
            </div>

            {/* Prior Imaging */}
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Prior Imaging</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.priorImaging).map(([type, checked]) => (
                  <label key={type} className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name={`priorImaging.${type}`}
                      checked={checked}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700 capitalize">{type.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CPC Criteria Compliance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-900">CPC Criteria Compliance</h2>
            <p className="text-sm text-gray-600 mt-1">Clinical Practice Committee referral criteria validation</p>
          </div>
          
          <div className="p-6">
            {/* Clinical Override Section */}
            <div className="mb-6">
              <label className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  name="clinicalOverride"
                  checked={formData.clinicalOverride}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-semibold text-gray-700">Clinical Override (referral outside CPC criteria)</span>
              </label>
              {validationErrors.cpcCompliance && (
                <p className="text-red-600 text-sm mt-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {validationErrors.cpcCompliance}
                </p>
              )}
            </div>

            {formData.clinicalOverride && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Override Justification *</label>
                <textarea
                  name="overrideJustification"
                  value={formData.overrideJustification}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                    validationErrors.overrideJustification ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="Provide detailed clinical justification for referral outside standard CPC criteria..."
                  required
                />
                {validationErrors.overrideJustification && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {validationErrors.overrideJustification}
                  </p>
                )}
              </div>
            )}

            {/* CPC Criteria Summary */}
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">CPC Criteria Summary:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">PSA ≥4.0 ng/mL for men aged 50-69</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">PSA ≥2.0 ng/mL for high-risk men</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Abnormal DRE findings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Clinical symptoms (LUTS, bone pain, weight loss)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-gray-900">Attach Documents</h2>
            <p className="text-sm text-gray-600 mt-1">Upload supporting clinical documents and reports</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50 transition-all duration-200">
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-gray-100 rounded-full mb-3">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="block text-base font-semibold text-gray-900 mb-2">
                        Upload PSA results, imaging reports, or other documents
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                    <p className="text-sm text-gray-500">PDF, JPG, PNG, DOC up to 10MB each</p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Uploaded Files:</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-gray-700">
                  Referral will be automatically assigned UPI: <span className="font-mono font-semibold text-green-600">{upi}</span>
                </p>
              </div>
              <p className="text-sm text-gray-600">
                System will auto-determine triage priority based on clinical parameters
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </button>
              <button
                type="submit"
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-800 to-black text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-sm font-semibold"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Referral
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewReferral;
