import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, Stethoscope, Heart, FileText, Upload } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';

const ClinicalFindingsModal = ({ patient, onSave, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const [clinicalData, setClinicalData] = useState({
    dreFindings: '',
    familyHistory: [],
    comorbidities: [],
    imagingResults: '',
    clinicalNotes: '',
    decision: '',
    rationale: '',
    nextSteps: '',
    ecogStatus: '',
    ipssScore: '',
    painScale: ''
  });

  const validationRules = {
    dreFindings: { required: true, message: 'DRE findings are required' },
    decision: { required: true, message: 'Clinical decision is required' },
    rationale: { required: true, message: 'Clinical rationale is required' }
  };

  const { errors, isValid, validateField, validateAll } = useFormValidation(clinicalData, validationRules);

  const dreOptions = [
    'Normal',
    'Smooth enlargement',
    'Nodular',
    'Asymmetric',
    'Hard nodule',
    'Extracapsular extension',
    'Other'
  ];

  const familyHistoryOptions = [
    'Prostate cancer (father)',
    'Prostate cancer (brother)',
    'Prostate cancer (grandfather)',
    'Breast cancer (mother)',
    'Breast cancer (sister)',
    'Ovarian cancer (mother)',
    'Ovarian cancer (sister)',
    'Other cancers',
    'No family history'
  ];

  const comorbidityOptions = [
    'Diabetes',
    'Hypertension',
    'Cardiovascular disease',
    'COPD',
    'Chronic kidney disease',
    'Liver disease',
    'Previous cancer',
    'Obesity',
    'Depression/Anxiety',
    'None'
  ];

  const clinicalDecisionOptions = [
    'No Cancer - Watchful Waiting',
    'Refer to MDT',
    'Proceed to Surgery',
    'Active Surveillance',
    'External Referral',
    'Additional Investigations Required'
  ];

  const ecogOptions = [
    { value: '0', label: '0 - Fully active, able to carry on all pre-disease performance without restriction' },
    { value: '1', label: '1 - Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature' },
    { value: '2', label: '2 - Ambulatory and capable of all selfcare but unable to carry out any work activities' },
    { value: '3', label: '3 - Capable of only limited selfcare, confined to bed or chair more than 50% of waking hours' },
    { value: '4', label: '4 - Completely disabled, cannot carry on any selfcare, totally confined to bed or chair' }
  ];

  const handleInputChange = (field, value) => {
    setClinicalData(prev => ({ ...prev, [field]: value }));
    validateField(field);
  };

  const handleArrayChange = (field, value, checked) => {
    setClinicalData(prev => ({
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

    // Dispatch action to update patient clinical data
    dispatch({
      type: 'databases/updatePatientStatus',
      payload: {
        patientId: patient.id,
        database: 'db1',
        status: 'clinical_assessment_complete',
        data: {
          clinicalFindings: clinicalData,
          assessmentDate: new Date().toISOString(),
          assessedBy: 'current_user'
        }
      }
    });

    // Trigger database transition if needed
    if (clinicalData.decision === 'Proceed to Surgery') {
      dispatch({
        type: 'databases/transitionPatient',
        payload: {
          patientId: patient.id,
          fromDb: 'db1',
          toDb: 'db3',
          reason: 'surgical_indication',
          clinicalData: clinicalData,
          assignedTo: 'urologist'
        }
      });
    } else if (clinicalData.decision === 'Active Surveillance') {
      dispatch({
        type: 'databases/transitionPatient',
        payload: {
          patientId: patient.id,
          fromDb: 'db1',
          toDb: 'db2',
          reason: 'active_surveillance',
          clinicalData: clinicalData,
          assignedTo: 'urologist'
        }
      });
    } else if (clinicalData.decision === 'Refer to MDT') {
      dispatch({
        type: 'mdt/addMDTCase',
        payload: {
          patientId: patient.id,
          clinicalData: clinicalData,
          priority: 'medium',
          assignedTo: 'mdt_coordinator'
        }
      });
    }

    // Add notification
    dispatch({
      type: 'notifications/addNotification',
      payload: {
        type: 'clinical_assessment',
        title: 'Clinical Assessment Complete',
        message: `Clinical assessment completed for ${patient.firstName} ${patient.lastName}. Decision: ${clinicalData.decision}`,
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Clinical Assessment
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DRE Findings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Stethoscope className="w-4 h-4 inline mr-1" />
                DRE Findings *
              </label>
              <select
                value={clinicalData.dreFindings}
                onChange={(e) => handleInputChange('dreFindings', e.target.value)}
                onBlur={() => validateField('dreFindings')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dreFindings ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select DRE findings</option>
                {dreOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.dreFindings && (
                <p className="mt-1 text-sm text-red-600">{errors.dreFindings}</p>
              )}
            </div>

            {/* ECOG Performance Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ECOG Performance Status
              </label>
              <select
                value={clinicalData.ecogStatus}
                onChange={(e) => handleInputChange('ecogStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select ECOG status</option>
                {ecogOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* IPSS Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPSS Score
              </label>
              <input
                type="number"
                min="0"
                max="35"
                value={clinicalData.ipssScore}
                onChange={(e) => handleInputChange('ipssScore', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IPSS score (0-35)"
              />
            </div>

            {/* Pain Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Scale (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={clinicalData.painScale}
                onChange={(e) => handleInputChange('painScale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pain scale (0-10)"
              />
            </div>
          </div>

          {/* Family History */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 inline mr-1" />
              Family History
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {familyHistoryOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={clinicalData.familyHistory.includes(option)}
                    onChange={(e) => handleArrayChange('familyHistory', option, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Comorbidities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comorbidities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {comorbidityOptions.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={clinicalData.comorbidities.includes(option)}
                    onChange={(e) => handleArrayChange('comorbidities', option, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imaging Results */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Imaging Results
            </label>
            <textarea
              value={clinicalData.imagingResults}
              onChange={(e) => handleInputChange('imagingResults', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter imaging results and findings"
            />
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Notes
            </label>
            <textarea
              value={clinicalData.clinicalNotes}
              onChange={(e) => handleInputChange('clinicalNotes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter detailed clinical notes and observations"
            />
          </div>

          {/* Clinical Decision */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Decision *
            </label>
            <select
              value={clinicalData.decision}
              onChange={(e) => handleInputChange('decision', e.target.value)}
              onBlur={() => validateField('decision')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.decision ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select clinical decision</option>
              {clinicalDecisionOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.decision && (
              <p className="mt-1 text-sm text-red-600">{errors.decision}</p>
            )}
          </div>

          {/* Clinical Rationale */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Rationale *
            </label>
            <textarea
              value={clinicalData.rationale}
              onChange={(e) => handleInputChange('rationale', e.target.value)}
              onBlur={() => validateField('rationale')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.rationale ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="3"
              placeholder="Provide detailed rationale for the clinical decision"
            />
            {errors.rationale && (
              <p className="mt-1 text-sm text-red-600">{errors.rationale}</p>
            )}
          </div>

          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Steps
            </label>
            <textarea
              value={clinicalData.nextSteps}
              onChange={(e) => handleInputChange('nextSteps', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Enter next steps and follow-up plan"
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
            Save Clinical Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalFindingsModal;
