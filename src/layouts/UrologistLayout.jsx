import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import NotificationBell from '../components/NotificationBell';
import ProfileModal from '../components/modals/ProfileModal';
import PatientDetailsModal from '../components/modals/PatientDetailsModal';
import { PatientDetailsProvider, usePatientDetails } from '../contexts/PatientDetailsContext';

// Component that uses the patient details context
const UrologistLayoutContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { showPatientDetailsModal, selectedPatientId, userRole, closePatientDetails } = usePatientDetails();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      admin: 'Administrator',
      gp: 'General Practitioner',
      urology_nurse: 'Urology Clinical Nurse',
      urologist: 'Urologist',
      urology_registrar: 'Urology Registrar',
      mdt_coordinator: 'MDT Coordinator'
    };
    return roleMap[role] || role;
  };

  // Scroll to top when route changes
  useEffect(() => {
    const scrollToTop = () => {
      // Find the main element and scroll it to top
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo(0, 0);
      }
    };

    // Scroll to top when pathname changes
    scrollToTop();
    
    // Also try after a short delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with Logo */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Role */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <div className="w-[10rem] flex items-center justify-center overflow-hidden">
                <img 
                  src="/urologo.png" 
                  alt="UroPrep Logo" 
                  className="max-w-full max-h-full object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              
              {/* Role Badge */}
              <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200/50 px-4 py-2.5 rounded-full shadow-sm">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  {getRoleDisplayName(role)}
                </span>
              </div>
            </div>

            {/* Right side - User Menu */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <NotificationBell />

              {/* User Menu */}
              <div className="flex items-center space-x-3 bg-gray-50/80 rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="h-10 w-10 bg-gradient-to-br from-green-800 to-black rounded-full flex items-center justify-center shadow-lg ring-2 ring-green-200/50 hover:ring-green-300/50 transition-all duration-200 hover:scale-105 cursor-pointer"
                  title="View Profile"
                >
                  <User className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105 group"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
          <div className="w-full p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        isOpen={showPatientDetailsModal}
        onClose={closePatientDetails}
        patientId={selectedPatientId}
        userRole={userRole}
      />
    </div>
  );
};

const UrologistLayout = () => {
  return (
    <PatientDetailsProvider>
      <UrologistLayoutContent />
    </PatientDetailsProvider>
  );
};

export default UrologistLayout;
