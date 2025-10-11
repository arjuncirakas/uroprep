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
  const [source, setSource] = useState(null);
  const [context, setContext] = useState(null);

  const openPatientDetails = (patientId, role = 'nurse', sourceParam = null, context = null) => {
    setSelectedPatientId(patientId);
    setUserRole(role);
    setSource(sourceParam);
    setContext(context);
    setShowPatientDetailsModal(true);
  };

  const closePatientDetails = () => {
    setShowPatientDetailsModal(false);
    setSelectedPatientId(null);
    setUserRole('nurse');
    setSource(null);
    setContext(null);
  };

  const value = {
    showPatientDetailsModal,
    selectedPatientId,
    userRole,
    source,
    context,
    openPatientDetails,
    closePatientDetails
  };

  return (
    <PatientDetailsContext.Provider value={value}>
      {children}
    </PatientDetailsContext.Provider>
  );
};





