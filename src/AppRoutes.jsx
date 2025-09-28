import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import AdminLayout from './layouts/AdminLayout';
import GPLayout from './layouts/GPLayout';
import UrologyNurseLayout from './layouts/UrologyNurseLayout';
import UrologistLayout from './layouts/UrologistLayout';
import MDTCoordinatorLayout from './layouts/MDTCoordinatorLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import SystemSettings from './pages/admin/SystemSettings';
import UserActivity from './pages/admin/UserActivity';
import DataExport from './pages/admin/DataExport';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';

// GP Portal Pages (Read-Only)
import GPDashboard from './pages/gp/Dashboard';
import NewReferral from './pages/gp/NewReferral';
import GPReferralStatus from './pages/gp/ReferralStatus';
import ReferralDetails from './pages/gp/ReferralDetails';
import DischargeSummaries from './pages/gp/DischargeSummaries';
import PatientDetails from './pages/gp/PatientDetails';
import GPProfile from './pages/gp/Profile';

// Urology Nurse Pages
import UrologyNurseDashboard from './pages/urology-nurse/Dashboard';
import Patients from './pages/urology-nurse/Patients';
import AddPatient from './pages/urology-nurse/AddPatient';
import ReferralTriage from './pages/urology-nurse/ReferralTriage';
import Appointments from './pages/urology-nurse/Appointments';
import OPDManagement from './pages/urology-nurse/OPDManagement';
import ActiveSurveillance from './pages/urology-nurse/ActiveSurveillance';
import SurgicalPathway from './pages/urology-nurse/SurgicalPathway';
import PostOpFollowUp from './pages/urology-nurse/PostOpFollowUp';
import DB1Management from './pages/urology-nurse/DB1Management';
import DB2Management from './pages/urology-nurse/DB2Management';
import DB3Management from './pages/urology-nurse/DB3Management';
import DB4Management from './pages/urology-nurse/DB4Management';
import DataEntry from './pages/urology-nurse/DataEntry';
import UrologyNursePatientDetails from './pages/urology-nurse/PatientDetails';
import RescheduleAppointment from './pages/urology-nurse/RescheduleAppointment';
import TriageReferral from './pages/urology-nurse/TriageReferral';
import BookAppointment from './pages/urology-nurse/BookAppointment';
import AppointmentDetails from './pages/urology-nurse/AppointmentDetails';
import CalendarView from './pages/urology-nurse/CalendarView';

// Urologist Pages
import UrologistDashboard from './pages/urologist/Dashboard';
import PatientManagement from './pages/urologist/PatientManagement';
import UrologistAddPatient from './pages/urologist/AddPatient';
import UrologistPatientDetails from './pages/urologist/PatientDetails';
import PSAChart from './pages/urologist/PSAChart';
import OPDConsultations from './pages/urologist/OPDConsultations';
import MDTCases from './pages/urologist/MDTCases';
import UrologistSurgicalPathway from './pages/urologist/SurgicalPathway';
import UrologistPostOpFollowUp from './pages/urologist/PostOpFollowUp';
import UrologistActiveSurveillance from './pages/urologist/ActiveSurveillance';
import ReferralsCommunication from './pages/urologist/ReferralsCommunication';
import ReportsAnalytics from './pages/urologist/ReportsAnalytics';

// MDT Coordinator Pages
import MDTDashboard from './pages/mdt-coordinator/Dashboard';
import MDTScheduling from './pages/mdt-coordinator/Scheduling';
import MDTCaseManagement from './pages/mdt-coordinator/CaseManagement';
import MDTReports from './pages/mdt-coordinator/Reports';

// Error Pages
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Default redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="activity" element={<UserActivity />} />
        <Route path="export" element={<DataExport />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Route>
      
      {/* GP Portal Routes (Read-Only) */}
      <Route path="/gp" element={
        <ProtectedRoute allowedRoles={['gp']}>
          <GPLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<GPDashboard />} />
        <Route path="profile" element={<GPProfile />} />
        <Route path="new-referral" element={<NewReferral />} />
        <Route path="referral-status" element={<GPReferralStatus />} />
        <Route path="referral-details/:id" element={<ReferralDetails />} />
        <Route path="discharge-summaries" element={<DischargeSummaries />} />
        <Route path="patient-details/:id" element={<PatientDetails />} />
      </Route>
      
      {/* Urology Nurse Routes */}
            <Route path="/urology-nurse" element={
              <ProtectedRoute allowedRoles={['urology_nurse']}>
                <UrologyNurseLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<UrologyNurseDashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="add-patient" element={<AddPatient />} />
              <Route path="triage" element={<ReferralTriage />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="opd-management" element={<OPDManagement />} />
              <Route path="active-surveillance" element={<ActiveSurveillance />} />
              <Route path="surgical-pathway" element={<SurgicalPathway />} />
              <Route path="postop-followup" element={<PostOpFollowUp />} />
        <Route path="db1" element={<DB1Management />} />
        <Route path="db2" element={<DB2Management />} />
        <Route path="db3" element={<DB3Management />} />
        <Route path="db4" element={<DB4Management />} />
        <Route path="data-entry" element={<DataEntry />} />
        <Route path="patient-details/:id" element={<UrologyNursePatientDetails />} />
        <Route path="reschedule/:id" element={<RescheduleAppointment />} />
        <Route path="triage/:id" element={<TriageReferral />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="appointment-details/:id" element={<AppointmentDetails />} />
        <Route path="edit-appointment/:id" element={<BookAppointment />} />
        <Route path="appointments/calendar" element={<CalendarView />} />
      </Route>
      
      {/* Urologist Routes */}
      <Route path="/urologist" element={
        <ProtectedRoute allowedRoles={['urologist', 'urology_registrar']}>
          <UrologistLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<UrologistDashboard />} />
        <Route path="patient-management" element={<PatientManagement />} />
        <Route path="add-patient" element={<UrologistAddPatient />} />
        <Route path="patient-details/:id" element={<UrologistPatientDetails />} />
        <Route path="psa-chart/:id" element={<PSAChart />} />
        <Route path="opd-consultations" element={<OPDConsultations />} />
        <Route path="mdt-cases" element={<MDTCases />} />
        <Route path="surgical-pathway" element={<UrologistSurgicalPathway />} />
        <Route path="post-op-follow-up" element={<UrologistPostOpFollowUp />} />
        <Route path="active-surveillance" element={<UrologistActiveSurveillance />} />
        <Route path="referrals-communication" element={<ReferralsCommunication />} />
        <Route path="reports-analytics" element={<ReportsAnalytics />} />
      </Route>
      
      {/* MDT Coordinator Routes */}
      <Route path="/mdt-coordinator" element={
        <ProtectedRoute allowedRoles={['mdt_coordinator']}>
          <MDTCoordinatorLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<MDTDashboard />} />
        <Route path="scheduling" element={<MDTScheduling />} />
        <Route path="cases" element={<MDTCaseManagement />} />
        <Route path="reports" element={<MDTReports />} />
      </Route>
      
      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
