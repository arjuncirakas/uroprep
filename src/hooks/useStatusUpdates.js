import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useStatusUpdates = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);

  // Update referral status
  const updateReferralStatus = useCallback((referralId, status, notes, assignedTo) => {
    dispatch({
      type: 'referrals/updateReferralStatus',
      payload: {
        id: referralId,
        status,
        notes,
        assignedTo: assignedTo || currentUser?.role
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addReferralStatusNotification',
      payload: {
        referralId,
        status,
        message: `Referral ${referralId} status updated to ${status}${notes ? `. Notes: ${notes}` : ''}`
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'referral_status_update',
        referralId,
        status,
        notes,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Update patient status
  const updatePatientStatus = useCallback((patientId, database, status, data, assignedTo) => {
    dispatch({
      type: 'databases/updatePatientStatus',
      payload: {
        patientId,
        database,
        status,
        data,
        assignedTo: assignedTo || currentUser?.role
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addPatientTransitionNotification',
      payload: {
        patientId,
        fromDb: database,
        toDb: database,
        reason: `Status updated to ${status}`,
        message: `Patient ${patientId} status updated to ${status} in ${database}`
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'patient_status_update',
        patientId,
        database,
        status,
        data,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Transition patient between databases
  const transitionPatient = useCallback((patientId, fromDb, toDb, reason, clinicalData, assignedTo) => {
    dispatch({
      type: 'databases/transitionPatient',
      payload: {
        patientId,
        fromDb,
        toDb,
        reason,
        clinicalData,
        assignedTo: assignedTo || currentUser?.role
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addPatientTransitionNotification',
      payload: {
        patientId,
        fromDb,
        toDb,
        reason,
        message: `Patient ${patientId} moved from ${fromDb} to ${toDb}. Reason: ${reason}`
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'patient_transition',
        patientId,
        fromDb,
        toDb,
        reason,
        clinicalData,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Update appointment status
  const updateAppointmentStatus = useCallback((appointmentId, status, notes, assignedTo) => {
    dispatch({
      type: 'appointments/updateAppointment',
      payload: {
        id: appointmentId,
        status,
        notes,
        assignedTo: assignedTo || currentUser?.role,
        lastUpdated: new Date().toISOString()
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addAppointmentNotification',
      payload: {
        appointmentId,
        type: status,
        message: `Appointment ${appointmentId} status updated to ${status}${notes ? `. Notes: ${notes}` : ''}`
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'appointment_status_update',
        appointmentId,
        status,
        notes,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Add clinical alert
  const addClinicalAlert = useCallback((patientId, alertType, message, priority = 'normal') => {
    dispatch({
      type: 'notifications/addClinicalAlertNotification',
      payload: {
        patientId,
        alertType,
        message,
        priority
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'clinical_alert',
        patientId,
        alertType,
        message,
        priority,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Update PSA alert
  const updatePSAAlert = useCallback((patientId, psaValue, velocity, riskLevel) => {
    const alertMessage = `PSA Alert: Value ${psaValue} ng/mL, Velocity ${velocity} ng/mL/year, Risk: ${riskLevel}`;
    
    dispatch({
      type: 'notifications/addClinicalAlertNotification',
      payload: {
        patientId,
        alertType: 'psa_alert',
        message: alertMessage,
        priority: riskLevel === 'high' ? 'high' : 'normal'
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'psa_alert',
        patientId,
        psaValue,
        velocity,
        riskLevel,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Update MDT case status
  const updateMDTCaseStatus = useCallback((caseId, status, outcome, notes) => {
    dispatch({
      type: 'mdt/updateMDTCase',
      payload: {
        id: caseId,
        status,
        outcome,
        notes,
        lastUpdated: new Date().toISOString()
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addNotification',
      payload: {
        type: 'mdt_case_update',
        title: 'MDT Case Update',
        message: `MDT case ${caseId} status updated to ${status}. Outcome: ${outcome}`,
        priority: 'normal'
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'mdt_case_update',
        caseId,
        status,
        outcome,
        notes,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Update surgical case status
  const updateSurgicalCaseStatus = useCallback((patientId, status, notes, complications) => {
    dispatch({
      type: 'databases/updatePatientStatus',
      payload: {
        patientId,
        database: 'db3',
        status,
        data: {
          surgicalStatus: status,
          surgicalNotes: notes,
          complications: complications,
          lastUpdated: new Date().toISOString()
        }
      }
    });

    // Add notification
    dispatch({
      type: 'notifications/addNotification',
      payload: {
        type: 'surgical_status_update',
        title: 'Surgical Status Update',
        message: `Surgical status updated for patient ${patientId}: ${status}`,
        patientId,
        priority: complications && complications.length > 0 ? 'high' : 'normal'
      }
    });

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'surgical_status_update',
        patientId,
        status,
        notes,
        complications,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Update surveillance status
  const updateSurveillanceStatus = useCallback((patientId, status, psaData, riskAssessment) => {
    dispatch({
      type: 'databases/updatePatientStatus',
      payload: {
        patientId,
        database: 'db2',
        status,
        data: {
          surveillanceStatus: status,
          psaData,
          riskAssessment,
          lastUpdated: new Date().toISOString()
        }
      }
    });

    // Add notification if high risk
    if (riskAssessment === 'high' || riskAssessment === 'very_high') {
      dispatch({
        type: 'notifications/addClinicalAlertNotification',
        payload: {
          patientId,
          alertType: 'surveillance_alert',
          message: `High-risk surveillance alert for patient ${patientId}. Risk level: ${riskAssessment}`,
          priority: 'high'
        }
      });
    }

    // Log audit trail
    dispatch({
      type: 'databases/addAuditEntry',
      payload: {
        type: 'surveillance_status_update',
        patientId,
        status,
        psaData,
        riskAssessment,
        user: currentUser?.name || 'Unknown',
        timestamp: new Date().toISOString()
      }
    });
  }, [dispatch, currentUser]);

  // Get status history for a patient
  const getPatientStatusHistory = useCallback((patientId) => {
    const auditTrail = useSelector(state => state.databases.auditTrail);
    return auditTrail.filter(entry => 
      entry.patientId === patientId && 
      (entry.type.includes('status_update') || entry.type.includes('transition'))
    );
  }, []);

  // Get referral status history
  const getReferralStatusHistory = useCallback((referralId) => {
    const auditTrail = useSelector(state => state.databases.auditTrail);
    return auditTrail.filter(entry => 
      entry.referralId === referralId && 
      entry.type.includes('referral')
    );
  }, []);

  return {
    // Status update functions
    updateReferralStatus,
    updatePatientStatus,
    transitionPatient,
    updateAppointmentStatus,
    addClinicalAlert,
    updatePSAAlert,
    updateMDTCaseStatus,
    updateSurgicalCaseStatus,
    updateSurveillanceStatus,
    
    // History functions
    getPatientStatusHistory,
    getReferralStatusHistory
  };
};

export default useStatusUpdates;
