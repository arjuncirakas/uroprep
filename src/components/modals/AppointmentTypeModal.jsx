import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X,
  User,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp
} from 'lucide-react';

const AppointmentTypeModal = ({ isOpen, onClose, onTypeSelect }) => {
  const navigate = useNavigate();

  const appointmentTypes = [
    { value: 'first_consultation', label: 'First Consultation', icon: User, duration: 60, description: 'Initial patient assessment' },
    { value: 'follow_up', label: 'Follow-up', icon: Stethoscope, duration: 30, description: 'Routine follow-up visit' },
    { value: 'pre_op_assessment', label: 'Pre-op Assessment', icon: Heart, duration: 45, description: 'Pre-surgical evaluation' },
    { value: 'psa_review', label: 'PSA Review', icon: Activity, duration: 30, description: 'PSA monitoring appointment' },
    { value: 'surveillance', label: 'Surveillance', icon: TrendingUp, duration: 30, description: 'Active surveillance monitoring' },
    { value: 'consultation', label: 'Consultation', icon: User, duration: 45, description: 'General consultation' }
  ];

  const handleTypeSelect = (type) => {
    if (onTypeSelect) {
      onTypeSelect(type);
    } else {
      // Fallback: Navigate to booking page with selected type
      navigate(`/urology-nurse/book-appointment?type=${type.value}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Appointment Type</h2>
              <p className="text-sm text-gray-600 mt-1">Choose the type of appointment you want to book</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointmentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => handleTypeSelect(type)}
                  className="p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-gray-100 rounded-lg flex items-center justify-center group-hover:from-green-200 group-hover:to-green-100 transition-colors">
                      <Icon className="h-6 w-6 text-gray-600 group-hover:text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{type.label}</h3>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Duration: {type.duration} minutes</span>
                        <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                          Select →
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTypeModal;
