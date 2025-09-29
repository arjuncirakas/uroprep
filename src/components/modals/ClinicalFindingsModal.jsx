import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, Stethoscope, Heart, FileText, Upload, Activity, User, AlertTriangle, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-800 to-black rounded-lg">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Clinical Findings - {patient?.name || `${patient?.firstName} ${patient?.lastName}`}
                </h3>
                <p className="text-sm text-gray-600">Enter clinical assessment findings and make treatment decisions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Summary */}
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Patient ID</p>
                <p className="text-lg font-bold text-gray-900">{patient?.id}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Age</p>
                <p className="text-lg font-bold text-gray-900">{patient?.age} years</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Current PSA</p>
                <p className="text-lg font-bold text-gray-900">{patient?.psa} ng/mL</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Priority</p>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                  patient?.priority === 'High' ? 'bg-red-100 text-red-800' :
                  patient?.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {patient?.priority}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Assessment Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Clinical Assessment</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DRE Findings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DRE Findings *
                </label>
                <select
                  value={clinicalData.dreFindings}
                  onChange={(e) => handleInputChange('dreFindings', e.target.value)}
                  onBlur={() => validateField('dreFindings')}
                  className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter pain scale (0-10)"
                />
              </div>
            </div>
          </div>

          {/* Family History & Comorbidities Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Family History & Comorbidities</h4>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Family History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Family History
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {familyHistoryOptions.map(option => (
                    <label key={option} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={clinicalData.familyHistory.includes(option)}
                        onChange={(e) => handleArrayChange('familyHistory', option, e.target.checked)}
                        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comorbidities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comorbidities
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {comorbidityOptions.map(option => (
                    <label key={option} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={clinicalData.comorbidities.includes(option)}
                        onChange={(e) => handleArrayChange('comorbidities', option, e.target.checked)}
                        className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Notes & Imaging Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Clinical Notes & Imaging</h4>
            </div>
            
            <div className="space-y-6">
              {/* Imaging Results */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imaging Results
                </label>
                <textarea
                  value={clinicalData.imagingResults}
                  onChange={(e) => handleInputChange('imagingResults', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  rows="3"
                  placeholder="Enter imaging results and findings..."
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  rows="4"
                  placeholder="Enter detailed clinical notes and observations..."
                />
              </div>
            </div>
          </div>

          {/* Clinical Decision Section */}
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-lg">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-green-900">Clinical Decision & Plan</h4>
            </div>
            
            <div className="space-y-6">
              {/* Clinical Decision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Decision *
                </label>
                <select
                  value={clinicalData.decision}
                  onChange={(e) => handleInputChange('decision', e.target.value)}
                  onBlur={() => validateField('decision')}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${
                    errors.rationale ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="3"
                  placeholder="Provide detailed rationale for the clinical decision..."
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  rows="2"
                  placeholder="Enter next steps and follow-up plan..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gradient-to-r from-green-50 to-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Clinical Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalFindingsModal;
