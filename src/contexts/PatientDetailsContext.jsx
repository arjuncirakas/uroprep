import React, { createContext, useContext, useState } from 'react';

const PatientDetailsContext = createContext();

export const usePatientDetails = () => {
  const context = useContext(PatientDetailsContext);
  if (!context) {
    throw new Error('usePatientDetails must be used within a PatientDetailsProvider');
  }
  return context;
};

export const PatientDetailsProvider = ({ children }) => {
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const openPatientDetails = (patientId) => {
    setSelectedPatientId(patientId);
    setShowPatientDetailsModal(true);
  };

  const closePatientDetails = () => {
    setShowPatientDetailsModal(false);
    setSelectedPatientId(null);
  };

  const value = {
    showPatientDetailsModal,
    selectedPatientId,
    openPatientDetails,
    closePatientDetails
  };

  return (
    <PatientDetailsContext.Provider value={value}>
      {children}
    </PatientDetailsContext.Provider>
  );
};





