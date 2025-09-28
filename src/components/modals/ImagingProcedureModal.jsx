import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, FileText, Upload, Image, Activity } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

const ImagingProcedureModal = ({ patient, onSave, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const [procedureData, setProcedureData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    results: '',
    files: [],
    technician: '',
    notes: '',
    findings: '',
    recommendations: '',
    followUpRequired: false,
    followUpDate: '',
    radiologist: '',
    contrastUsed: false,
    contrastType: '',
    sedationUsed: false,
    sedationType: '',
    complications: [],
    quality: '',
    artifacts: '',
    measurements: {
      length: '',
      width: '',
      height: '',
      volume: ''
    }
  });

  const validationRules = {
    type: { required: true, message: 'Procedure type is required' },
    date: { required: true, message: 'Date is required' },
    results: { required: true, message: 'Results are required' }
  };

  const { errors, isValid, validateField, validateAll } = useFormValidation(procedureData, validationRules);

  const procedureTypeOptions = [
    'MRI Prostate',
    'CT Abdomen/Pelvis',
    'Bone Scan',
    'PSMA PET-CT',
    'Ultrasound Prostate',
    'TRUS Biopsy',
    'MRI Fusion Biopsy',
    'Cystoscopy',
    'Urodynamics',
    'Other'
  ];

  const qualityOptions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Limited'
  ];

  const complicationOptions = [
    'None',
    'Bleeding',
    'Infection',
    'Pain',
    'Nausea/Vomiting',
    'Allergic reaction',
    'Technical difficulty',
    'Patient movement',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProcedureData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProcedureData(prev => ({ ...prev, [field]: value }));
    }
    validateField(field);
  };

  const handleArrayChange = (field, value, checked) => {
    setProcedureData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setProcedureData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setProcedureData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!isValid) {
      validateAll();
      return;
    }

    // Dispatch action to update patient imaging/procedure data
    dispatch({
      type: 'patients/updatePatientImaging',
      payload: {
        patientId: patient.id,
        imagingData: {
          ...procedureData,
          id: Date.now(),
          timestamp: new Date().toISOString(),
          uploadedBy: 'current_user'
        }
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addNotification',
      payload: {
        type: 'imaging_procedure',
        title: 'Imaging/Procedure Results Added',
        message: `${procedureData.type} results added for ${patient.firstName} ${patient.lastName}`,
        patientId: patient.id,
        priority: 'normal'
      }
    });

    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Imaging/Procedure Results Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Patient Information</h3>
            <p className="text-blue-800">
              {patient?.firstName} {patient?.lastName} (ID: {patient?.id})
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Procedure Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Procedure Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure Type *
                    </label>
                    <select
                      value={procedureData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      onBlur={() => validateField('type')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select procedure type</option>
                      {procedureTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Performed *
                    </label>
                    <input
                      type="date"
                      value={procedureData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      onBlur={() => validateField('date')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technician/Radiologist
                    </label>
                    <input
                      type="text"
                      value={procedureData.technician}
                      onChange={(e) => handleInputChange('technician', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter technician or radiologist name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reporting Radiologist
                    </label>
                    <input
                      type="text"
                      value={procedureData.radiologist}
                      onChange={(e) => handleInputChange('radiologist', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter reporting radiologist name"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={procedureData.contrastUsed}
                        onChange={(e) => handleInputChange('contrastUsed', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Contrast Used</span>
                    </label>
                  </div>

                  {procedureData.contrastUsed && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contrast Type
                      </label>
                      <input
                        type="text"
                        value={procedureData.contrastType}
                        onChange={(e) => handleInputChange('contrastType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Gadolinium, Iodinated contrast"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={procedureData.sedationUsed}
                        onChange={(e) => handleInputChange('sedationUsed', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Sedation Used</span>
                    </label>
                  </div>

                  {procedureData.sedationUsed && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sedation Type
                      </label>
                      <input
                        type="text"
                        value={procedureData.sedationType}
                        onChange={(e) => handleInputChange('sedationType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Local anesthesia, General anesthesia"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Quality
                    </label>
                    <select
                      value={procedureData.quality}
                      onChange={(e) => handleInputChange('quality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select quality</option>
                      {qualityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artifacts
                    </label>
                    <input
                      type="text"
                      value={procedureData.artifacts}
                      onChange={(e) => handleInputChange('artifacts', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe any artifacts or technical issues"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Measurements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Measurements
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={procedureData.measurements.length}
                      onChange={(e) => handleInputChange('measurements.length', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={procedureData.measurements.width}
                      onChange={(e) => handleInputChange('measurements.width', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={procedureData.measurements.height}
                      onChange={(e) => handleInputChange('measurements.height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume (cc)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={procedureData.measurements.volume}
                      onChange={(e) => handleInputChange('measurements.volume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {/* Complications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Complications
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {complicationOptions.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={procedureData.complications.includes(option)}
                        onChange={(e) => handleArrayChange('complications', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Follow-up */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Follow-up
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={procedureData.followUpRequired}
                        onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">Follow-up Required</span>
                    </label>
                  </div>

                  {procedureData.followUpRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={procedureData.followUpDate}
                        onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Results *
            </h3>
            <textarea
              value={procedureData.results}
              onChange={(e) => handleInputChange('results', e.target.value)}
              onBlur={() => validateField('results')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.results ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="6"
              placeholder="Enter detailed results and findings..."
            />
            {errors.results && (
              <p className="mt-1 text-sm text-red-600">{errors.results}</p>
            )}
          </div>

          {/* Findings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Findings
            </h3>
            <textarea
              value={procedureData.findings}
              onChange={(e) => handleInputChange('findings', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter key findings and observations..."
            />
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recommendations
            </h3>
            <textarea
              value={procedureData.recommendations}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter recommendations for further management..."
            />
          </div>

          {/* File Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-purple-600" />
              File Upload
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.dcm,.dicom"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG, DICOM files accepted
                </span>
              </label>
            </div>

            {procedureData.files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                <div className="space-y-2">
                  {procedureData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Notes
            </h3>
            <textarea
              value={procedureData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter any additional notes or comments..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagingProcedureModal;
