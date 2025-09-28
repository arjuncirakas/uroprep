import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Save, Calculator } from 'lucide-react';
import { usePSAValidation } from '../../hooks/useFormValidation';

const PSAEntryModal = ({ patient, onSave, onClose, isOpen }) => {
  const dispatch = useDispatch();
  const [psaData, setPsaData] = useState({
    value: '',
    date: new Date().toISOString().split('T')[0],
    labName: '',
    notes: '',
    velocity: 0
  });

  const { errors, isValid, validateField, validateAll } = usePSAValidation(psaData);

  // Calculate PSA velocity when value or date changes
  useEffect(() => {
    if (patient?.psaHistory && psaData.value && psaData.date) {
      const velocity = calculatePSAVelocity(patient.psaHistory, psaData.value, psaData.date);
      setPsaData(prev => ({ ...prev, velocity }));
    }
  }, [psaData.value, psaData.date, patient?.psaHistory]);

  const calculatePSAVelocity = (psaHistory, newValue, newDate) => {
    if (!psaHistory || psaHistory.length === 0) return 0;
    
    const sortedHistory = [...psaHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastPSA = sortedHistory[0];
    
    if (!lastPSA) return 0;
    
    const timeDiff = (new Date(newDate) - new Date(lastPSA.date)) / (1000 * 60 * 60 * 24 * 365); // years
    const psaDiff = parseFloat(newValue) - parseFloat(lastPSA.value);
    
    return timeDiff > 0 ? psaDiff / timeDiff : 0;
  };

  const handleInputChange = (field, value) => {
    setPsaData(prev => ({ ...prev, [field]: value }));
    validateField(field);
  };

  const handleSave = () => {
    if (!isValid) {
      validateAll();
      return;
    }

    // Dispatch action to update patient PSA data
    dispatch({
      type: 'patients/updatePatientPSA',
      payload: {
        patientId: patient.id,
        psaEntry: {
          ...psaData,
          id: Date.now(),
          timestamp: new Date().toISOString()
        }
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addNotification',
      payload: {
        type: 'psa_entry',
        title: 'PSA Entry Added',
        message: `New PSA value of ${psaData.value} ng/mL added for ${patient.firstName} ${patient.lastName}`,
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Add PSA Entry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Patient Information</h3>
            <p className="text-blue-800">
              {patient?.firstName} {patient?.lastName} (ID: {patient?.id})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PSA Value (ng/mL) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1000"
              value={psaData.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
              onBlur={() => validateField('value')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.value ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter PSA value"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Test *
            </label>
            <input
              type="date"
              value={psaData.date}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lab Name *
            </label>
            <input
              type="text"
              value={psaData.labName}
              onChange={(e) => handleInputChange('labName', e.target.value)}
              onBlur={() => validateField('labName')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.labName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter lab name"
            />
            {errors.labName && (
              <p className="mt-1 text-sm text-red-600">{errors.labName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={psaData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Additional notes about this PSA test"
            />
          </div>

          {psaData.velocity !== 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Calculator className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">PSA Velocity</span>
              </div>
              <p className="text-yellow-700 mt-1">
                {psaData.velocity > 0 ? '+' : ''}{psaData.velocity.toFixed(2)} ng/mL/year
              </p>
            </div>
          )}
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
            Save PSA Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default PSAEntryModal;
