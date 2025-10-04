import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UrologyNurseSidebar from '../components/layout/UrologyNurseSidebar';
import Header from '../components/layout/Header';
import { NavigationProvider } from '../contexts/NavigationContext';
import PatientDetailsModal from '../components/modals/PatientDetailsModal';
import { PatientDetailsProvider, usePatientDetails } from '../contexts/PatientDetailsContext';

// Component that uses the patient details context
const UrologyNurseLayoutContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { showPatientDetailsModal, selectedPatientId, closePatientDetails } = usePatientDetails();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
    <NavigationProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <UrologyNurseSidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-16' : 'ml-[280px]'
        }`}>
          {/* Header */}
          <Header onToggleSidebar={toggleSidebar} isCollapsed={sidebarCollapsed} />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
        
        {/* Patient Details Modal */}
        <PatientDetailsModal
          isOpen={showPatientDetailsModal}
          onClose={closePatientDetails}
          patientId={selectedPatientId}
        />
      </div>
    </NavigationProvider>
  );
};

const UrologyNurseLayout = () => {
  return (
    <PatientDetailsProvider>
      <UrologyNurseLayoutContent />
    </PatientDetailsProvider>
  );
};

export default UrologyNurseLayout;
