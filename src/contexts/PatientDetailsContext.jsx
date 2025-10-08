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
  const [userRole, setUserRole] = useState('nurse');

  const openPatientDetails = (patientId, role = 'nurse') => {
    setSelectedPatientId(patientId);
    setUserRole(role);
    setShowPatientDetailsModal(true);
  };

  const closePatientDetails = () => {
    setShowPatientDetailsModal(false);
    setSelectedPatientId(null);
    setUserRole('nurse');
  };

  const value = {
    showPatientDetailsModal,
    selectedPatientId,
    userRole,
    openPatientDetails,
    closePatientDetails
  };

  return (
    <PatientDetailsContext.Provider value={value}>
      {children}
    </PatientDetailsContext.Provider>
  );
};





