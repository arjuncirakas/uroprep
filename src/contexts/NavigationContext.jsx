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
    // If we're on a patient details, appointment details, or reschedule page, return the previous page
    if (location.pathname.includes('/patient-details/') || 
        location.pathname.includes('/appointment-details/') || 
        location.pathname.includes('/reschedule/')) {
      return previousPage;
    }
    // Otherwise return current page
    return location.pathname;
  };

  const getBackPath = () => {
    // If we have a previous page, go back to it
    if (previousPage) {
      return previousPage;
    }
    // Default fallbacks based on current page
    if (location.pathname.includes('/patient-details/')) {
      return '/urology-nurse/dashboard';
    }
    if (location.pathname.includes('/appointment-details/')) {
      return '/urology-nurse/dashboard';
    }
    if (location.pathname.includes('/reschedule/')) {
      return '/urology-nurse/dashboard';
    }
    return '/urology-nurse/dashboard';
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
