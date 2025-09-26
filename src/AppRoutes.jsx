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
import PatientSearch from './pages/gp/PatientSearch';
import PatientDetails from './pages/gp/PatientDetails';
import GPProfile from './pages/gp/Profile';

// Urology Nurse Pages
import UrologyNurseDashboard from './pages/urology-nurse/Dashboard';
import ReferralTriage from './pages/urology-nurse/ReferralTriage';
import Appointments from './pages/urology-nurse/Appointments';
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
import PriorityDashboard from './pages/urologist/PriorityDashboard';
import ReferralsQueue from './pages/urologist/ReferralsQueue';
import PatientChart from './pages/urologist/PatientChart';
import SurgeryManagement from './pages/urologist/SurgeryManagement';
import MDTCaseManager from './pages/urologist/MDTCaseManager';
import ClinicalTools from './pages/urologist/ClinicalTools';
import OutcomeTracker from './pages/urologist/OutcomeTracker';
import ResearchAnalytics from './pages/urologist/ResearchAnalytics';

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
        <Route path="patient-search" element={<PatientSearch />} />
        <Route path="patient-details/:id" element={<PatientDetails />} />
      </Route>
      
      {/* Urology Nurse Routes */}
      <Route path="/urology-nurse" element={
        <ProtectedRoute allowedRoles={['urology_nurse']}>
          <UrologyNurseLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<UrologyNurseDashboard />} />
        <Route path="triage" element={<ReferralTriage />} />
        <Route path="appointments" element={<Appointments />} />
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
        <Route path="priorities" element={<PriorityDashboard />} />
        <Route path="referrals" element={<ReferralsQueue />} />
        <Route path="patient-chart" element={<PatientChart />} />
        <Route path="surgery" element={<SurgeryManagement />} />
        <Route path="mdt" element={<MDTCaseManager />} />
        <Route path="clinical-tools" element={<ClinicalTools />} />
        <Route path="outcomes" element={<OutcomeTracker />} />
        <Route path="research" element={<ResearchAnalytics />} />
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
