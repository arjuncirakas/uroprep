import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Stethoscope,
  Heart,
  Home,
  Users,
  ArrowRightCircle
} from 'lucide-react';

const DatabaseAssignmentModal = ({ isOpen, onClose, patient, onAssign }) => {
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState(null);

  // Database options with descriptions and icons
  const databaseOptions = [
    {
      id: 'active_surveillance',
      name: 'Active Surveillance',
      description: 'Monitor patient with regular PSA tests and follow-ups',
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      id: 'surgical_pathway',
      name: 'Surgical Pathway',
      description: 'Patient scheduled for or undergoing surgical treatment',
      icon: Stethoscope,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      iconColor: 'text-orange-600'
    },
    {
      id: 'post_op_followup',
      name: 'Post-Op Follow-up',
      description: 'Post-surgical monitoring and recovery management',
      icon: Heart,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      iconColor: 'text-purple-600'
    },
    {
      id: 'discharged',
      name: 'Discharged',
      description: 'Patient completed treatment and returned to GP care',
      icon: Home,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      iconColor: 'text-gray-600'
    }
  ];

  const getCurrentDatabaseInfo = (currentPathway) => {
    return databaseOptions.find(db => 
      db.id === currentPathway.toLowerCase().replace(/\s+/g, '_').replace('-', '_') ||
      db.name.toLowerCase() === currentPathway.toLowerCase()
    ) || {
      id: 'unknown',
      name: currentPathway,
      description: 'Current patient pathway',
      icon: Database,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    };
  };

  const currentDbInfo = getCurrentDatabaseInfo(patient?.pathway || 'OPD Queue');

  const handleAssign = async () => {
    if (!selectedDatabase) return;
    
    setIsAssigning(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedDbInfo = databaseOptions.find(db => db.id === selectedDatabase);
      
      // Set success result
      setAssignmentResult({
        success: true,
        patientName: patient?.name || 'Patient',
        databaseName: selectedDbInfo.name,
        databaseId: selectedDatabase
      });
      
      // Call the onAssign callback
      onAssign(patient.id, selectedDatabase, selectedDbInfo.name);
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error assigning patient to database:', error);
      
      // Set error result
      setAssignmentResult({
        success: false,
        patientName: patient?.name || 'Patient',
        error: error.message || 'An unexpected error occurred'
      });
      
      // Show error modal
      setShowSuccessModal(true);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedDatabase('');
    setIsAssigning(false);
    setShowSuccessModal(false);
    setAssignmentResult(null);
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setAssignmentResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm overflow-y-auto h-full w-full z-[60] flex items-center justify-center p-4">
      <div className="relative mx-auto w-full max-w-5xl h-[90vh] flex flex-col">
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-8 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Database Assignment</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Transfer patient to appropriate care pathway
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Patient Info */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {patient?.name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{patient?.name || 'Patient'}</h3>
                <p className="text-sm text-gray-500 font-medium">UPI: {patient?.upi || patient?.id}</p>
                <div className="flex items-center space-x-3 mt-3">
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                    Age: {patient?.age || 'Unknown'} years
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-100 text-green-700 border border-green-200">
                    PSA: {typeof patient?.lastPSA === 'object' ? patient?.lastPSA?.value : patient?.lastPSA || 'Unknown'} ng/mL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-8 py-6">
              {/* Current Database */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                  Current Database
                </h3>
                <div className={`p-5 rounded-2xl border ${currentDbInfo.borderColor} ${currentDbInfo.bgColor}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${currentDbInfo.color}`}>
                      <currentDbInfo.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${currentDbInfo.textColor}`}>
                        {currentDbInfo.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{currentDbInfo.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <ArrowRightCircle className="h-5 w-5 mr-3 text-blue-500" />
                  Select Target Database
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {databaseOptions.map((db) => {
                    const IconComponent = db.icon;
                    const isSelected = selectedDatabase === db.id;
                    const isCurrent = db.id === currentDbInfo.id;
                    
                    return (
                      <button
                        key={db.id}
                        onClick={() => !isCurrent && setSelectedDatabase(db.id)}
                        disabled={isCurrent}
                        className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                          isCurrent
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : `border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50`
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl transition-all duration-200 ${
                            isCurrent 
                              ? 'bg-gray-200' 
                              : isSelected 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                              : `bg-gradient-to-r ${db.color}`
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              isCurrent 
                                ? 'text-gray-500' 
                                : isSelected 
                                ? 'text-white' 
                                : 'text-white'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className={`font-bold text-lg ${
                                isCurrent 
                                  ? 'text-gray-500' 
                                  : isSelected 
                                  ? 'text-blue-800' 
                                  : 'text-gray-900'
                              }`}>
                                {db.name}
                              </h4>
                              {isCurrent && (
                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-200 text-gray-600">
                                  Current
                                </span>
                              )}
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <p className={`text-sm leading-relaxed ${
                              isCurrent ? 'text-gray-500' : 'text-gray-600'
                            }`}>
                              {db.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedDatabase && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span>
                      Ready to transfer to{' '}
                      <span className="font-bold text-gray-900">
                        {databaseOptions.find(db => db.id === selectedDatabase)?.name}
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!selectedDatabase || isAssigning}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAssigning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Assigning...</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      <span>Assign to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
      {showSuccessModal && assignmentResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[70] flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-md">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className={`px-8 py-6 ${assignmentResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center justify-center">
                  <div className={`p-4 rounded-2xl ${assignmentResult.success ? 'bg-green-500' : 'bg-red-500'}`}>
                    {assignmentResult.success ? (
                      <CheckCircle className="h-8 w-8 text-white" />
                    ) : (
                      <X className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 text-center">
                <h3 className={`text-xl font-bold mb-2 ${assignmentResult.success ? 'text-green-900' : 'text-red-900'}`}>
                  {assignmentResult.success ? 'Assignment Successful!' : 'Assignment Failed'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {assignmentResult.success ? (
                    <>
                      <span className="font-semibold text-gray-900">{assignmentResult.patientName}</span> has been successfully assigned to{' '}
                      <span className="font-semibold text-gray-900">{assignmentResult.databaseName}</span>.
                    </>
                  ) : (
                    <>
                      Failed to assign <span className="font-semibold text-gray-900">{assignmentResult.patientName}</span> to the selected database.
                      {assignmentResult.error && (
                        <div className="mt-2 text-sm text-red-600">
                          {assignmentResult.error}
                        </div>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="px-8 pb-6">
                <button
                  onClick={handleSuccessModalClose}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    assignmentResult.success
                      ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                      : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  }`}
                >
                  {assignmentResult.success ? 'Continue' : 'Try Again'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseAssignmentModal;
