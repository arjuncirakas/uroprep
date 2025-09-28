import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [previousPage, setPreviousPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Update previous page when location changes
    if (currentPage && currentPage !== location.pathname) {
      setPreviousPage(currentPage);
    }
    setCurrentPage(location.pathname);
  }, [location.pathname, currentPage]);

  const getActiveSidebarItem = () => {
    // If we're on a patient details, appointment details, reschedule, or add-patient page, return the appropriate parent page
    if (location.pathname.includes('/patient-details/') || 
        location.pathname.includes('/appointment-details/') || 
        location.pathname.includes('/reschedule/')) {
      return previousPage;
    }
    // For triage patient details route, return the triage page to keep the Referral Triage tab active
    if (location.pathname.includes('/triage-patient-details/')) {
      return '/urology-nurse/triage';
    }
    // For add-patient route, return the patients page to keep the Patients tab active
    if (location.pathname.includes('/add-patient')) {
      return '/urology-nurse/patients';
    }
    // For edit-patient route, return the patients page to keep the Patients tab active
    if (location.pathname.includes('/edit-patient/')) {
      return '/urology-nurse/patients';
    }
    // Otherwise return current page
    return location.pathname;
  };

  const getBackPath = () => {
    // If we have a previous page, go back to it
    if (previousPage) {
      return previousPage;
    }
    // Default fallbacks based on current page and user role
    if (location.pathname.includes('/patient-details/')) {
      // Check sessionStorage for lastVisitedPage to determine correct back path
      const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
      if (lastVisitedPage === 'referral-status') {
        return '/gp/referral-status';
      } else if (lastVisitedPage === 'patient-search') {
        return '/gp/patient-search';
      } else if (location.pathname.startsWith('/gp/')) {
        return '/gp/patient-search'; // Default for GP
      } else if (location.pathname.startsWith('/urology-nurse/')) {
        return '/urology-nurse/dashboard'; // Default for Urology Nurse
      }
      return '/gp/patient-search'; // Ultimate fallback
    }
    // For triage patient details route, go back to triage list
    if (location.pathname.includes('/triage-patient-details/')) {
      return '/urology-nurse/triage';
    }
    if (location.pathname.includes('/appointment-details/')) {
      return location.pathname.startsWith('/gp/') ? '/gp/dashboard' : '/urology-nurse/dashboard';
    }
    if (location.pathname.includes('/reschedule/')) {
      return location.pathname.startsWith('/gp/') ? '/gp/dashboard' : '/urology-nurse/dashboard';
    }
    // For add-patient route, go back to patients list
    if (location.pathname.includes('/add-patient')) {
      return '/urology-nurse/patients';
    }
    // For edit-patient route, go back to patients list
    if (location.pathname.includes('/edit-patient/')) {
      return '/urology-nurse/patients';
    }
    // Default fallback based on current path
    if (location.pathname.startsWith('/gp/')) {
      return '/gp/dashboard';
    } else if (location.pathname.startsWith('/urology-nurse/')) {
      return '/urology-nurse/dashboard';
    }
    return '/gp/dashboard'; // Ultimate fallback
  };

  return (
    <NavigationContext.Provider value={{
      previousPage,
      currentPage,
      getActiveSidebarItem,
      getBackPath
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
