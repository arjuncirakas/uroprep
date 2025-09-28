import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, Scalpel, Heart, FileText, Clock } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

const SurgicalNotesModal = ({ patient, onSave, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const [surgicalData, setSurgicalData] = useState({
    operativeNotes: '',
    complications: [],
    bloodLoss: '',
    surgeryDuration: '',
    postOpStatus: '',
    histopathology: {
      diagnosis: '',
      gleasonScore: '',
      stage: '',
      marginStatus: '',
      riskAssessment: ''
    },
    followUpPlan: '',
    surgeon: '',
    assistant: '',
    anesthetist: '',
    procedureType: '',
    approach: '',
    estimatedBloodLoss: '',
    actualBloodLoss: '',
    urineOutput: '',
    fluidBalance: '',
    vitalSigns: {
      preOp: { bp: '', hr: '', temp: '', spo2: '' },
      postOp: { bp: '', hr: '', temp: '', spo2: '' }
    }
  });

  const validationRules = {
    operativeNotes: { required: true, message: 'Operative notes are required' },
    postOpStatus: { required: true, message: 'Post-operative status is required' },
    surgeon: { required: true, message: 'Surgeon name is required' },
    procedureType: { required: true, message: 'Procedure type is required' }
  };

  const { errors, isValid, validateField, validateAll } = useFormValidation(surgicalData, validationRules);

  const complicationOptions = [
    'None',
    'Bleeding',
    'Infection',
    'Urinary retention',
    'Incontinence',
    'Erectile dysfunction',
    'Rectal injury',
    'Ureteral injury',
    'Anesthesia complications',
    'Cardiac complications',
    'Respiratory complications',
    'Other'
  ];

  const postOpStatusOptions = [
    'Stable',
    'Critical',
    'Recovering well',
    'Complications',
    'Discharged',
    'ICU',
    'Step-down unit'
  ];

  const procedureTypeOptions = [
    'Radical Prostatectomy (Open)',
    'Laparoscopic Radical Prostatectomy',
    'Robot-assisted Radical Prostatectomy',
    'Transurethral Resection of Prostate (TURP)',
    'Laser Prostatectomy',
    'Biopsy',
    'Other'
  ];

  const approachOptions = [
    'Retropubic',
    'Perineal',
    'Laparoscopic',
    'Robot-assisted',
    'Transurethral',
    'Other'
  ];

  const marginStatusOptions = [
    'Negative margins',
    'Positive margins',
    'Close margins',
    'Not applicable'
  ];

  const riskAssessmentOptions = [
    'Low risk',
    'Intermediate risk',
    'High risk',
    'Very high risk'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSurgicalData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSurgicalData(prev => ({ ...prev, [field]: value }));
    }
    validateField(field);
  };

  const handleArrayChange = (field, value, checked) => {
    setSurgicalData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSave = () => {
    if (!isValid) {
      validateAll();
      return;
    }

    // Dispatch action to update patient surgical data
    dispatch({
      type: 'databases/updatePatientStatus',
      payload: {
        patientId: patient.id,
        database: 'db3',
        status: 'surgical_notes_complete',
        data: {
          surgicalData: surgicalData,
          surgeryDate: new Date().toISOString(),
          completedBy: 'current_user'
        }
      }
    });

    // Transition to DB4 if post-op status indicates completion
    if (surgicalData.postOpStatus === 'Discharged' || surgicalData.postOpStatus === 'Stable') {
      dispatch({
        type: 'databases/transitionPatient',
        payload: {
          patientId: patient.id,
          fromDb: 'db3',
          toDb: 'db4',
          reason: 'post_op_followup',
          clinicalData: surgicalData,
          assignedTo: 'urology_nurse'
        }
      });
    }

    // Add notification
    dispatch({
      type: 'notifications/addNotification',
      payload: {
        type: 'surgical_notes',
        title: 'Surgical Notes Complete',
        message: `Surgical notes completed for ${patient.firstName} ${patient.lastName}. Status: ${surgicalData.postOpStatus}`,
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Surgical Notes & Post-Operative Data
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Patient Information</h3>
            <p className="text-blue-800">
              {patient?.firstName} {patient?.lastName} (ID: {patient?.id})
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Procedure Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Scalpel className="w-5 h-5 mr-2 text-red-600" />
                  Procedure Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure Type *
                    </label>
                    <select
                      value={surgicalData.procedureType}
                      onChange={(e) => handleInputChange('procedureType', e.target.value)}
                      onBlur={() => validateField('procedureType')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.procedureType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select procedure type</option>
                      {procedureTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.procedureType && (
                      <p className="mt-1 text-sm text-red-600">{errors.procedureType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surgical Approach
                    </label>
                    <select
                      value={surgicalData.approach}
                      onChange={(e) => handleInputChange('approach', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select approach</option>
                      {approachOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surgeon *
                    </label>
                    <input
                      type="text"
                      value={surgicalData.surgeon}
                      onChange={(e) => handleInputChange('surgeon', e.target.value)}
                      onBlur={() => validateField('surgeon')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.surgeon ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter surgeon name"
                    />
                    {errors.surgeon && (
                      <p className="mt-1 text-sm text-red-600">{errors.surgeon}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assistant
                    </label>
                    <input
                      type="text"
                      value={surgicalData.assistant}
                      onChange={(e) => handleInputChange('assistant', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter assistant name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anesthetist
                    </label>
                    <input
                      type="text"
                      value={surgicalData.anesthetist}
                      onChange={(e) => handleInputChange('anesthetist', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter anesthetist name"
                    />
                  </div>
                </div>
              </div>

              {/* Operative Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Operative Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surgery Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={surgicalData.surgeryDuration}
                      onChange={(e) => handleInputChange('surgeryDuration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter duration in minutes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Blood Loss (mL)
                    </label>
                    <input
                      type="number"
                      value={surgicalData.estimatedBloodLoss}
                      onChange={(e) => handleInputChange('estimatedBloodLoss', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter estimated blood loss"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Actual Blood Loss (mL)
                    </label>
                    <input
                      type="number"
                      value={surgicalData.actualBloodLoss}
                      onChange={(e) => handleInputChange('actualBloodLoss', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter actual blood loss"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urine Output (mL)
                    </label>
                    <input
                      type="number"
                      value={surgicalData.urineOutput}
                      onChange={(e) => handleInputChange('urineOutput', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter urine output"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Complications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Complications
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {complicationOptions.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={surgicalData.complications.includes(option)}
                        onChange={(e) => handleArrayChange('complications', option, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Post-Operative Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Post-Operative Status
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status *
                    </label>
                    <select
                      value={surgicalData.postOpStatus}
                      onChange={(e) => handleInputChange('postOpStatus', e.target.value)}
                      onBlur={() => validateField('postOpStatus')}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.postOpStatus ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select status</option>
                      {postOpStatusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    {errors.postOpStatus && (
                      <p className="mt-1 text-sm text-red-600">{errors.postOpStatus}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Histopathology */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Histopathology Results
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      value={surgicalData.histopathology.diagnosis}
                      onChange={(e) => handleInputChange('histopathology.diagnosis', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter histopathology diagnosis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gleason Score
                    </label>
                    <input
                      type="text"
                      value={surgicalData.histopathology.gleasonScore}
                      onChange={(e) => handleInputChange('histopathology.gleasonScore', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3+4=7"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stage
                    </label>
                    <input
                      type="text"
                      value={surgicalData.histopathology.stage}
                      onChange={(e) => handleInputChange('histopathology.stage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., T2c N0 M0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margin Status
                    </label>
                    <select
                      value={surgicalData.histopathology.marginStatus}
                      onChange={(e) => handleInputChange('histopathology.marginStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select margin status</option>
                      {marginStatusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Assessment
                    </label>
                    <select
                      value={surgicalData.histopathology.riskAssessment}
                      onChange={(e) => handleInputChange('histopathology.riskAssessment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select risk assessment</option>
                      {riskAssessmentOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operative Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Operative Notes *
            </h3>
            <textarea
              value={surgicalData.operativeNotes}
              onChange={(e) => handleInputChange('operativeNotes', e.target.value)}
              onBlur={() => validateField('operativeNotes')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.operativeNotes ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="6"
              placeholder="Enter detailed operative notes including procedure steps, findings, and any complications..."
            />
            {errors.operativeNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.operativeNotes}</p>
            )}
          </div>

          {/* Follow-up Plan */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Follow-up Plan
            </h3>
            <textarea
              value={surgicalData.followUpPlan}
              onChange={(e) => handleInputChange('followUpPlan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter follow-up plan including medications, restrictions, and next appointments..."
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
            Save Surgical Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurgicalNotesModal;
