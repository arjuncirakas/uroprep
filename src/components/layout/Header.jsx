import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { addPSAMonitoringNotification, addPSAEntryNotification } from '../../store/slices/notificationSlice';
import NotificationBell from '../NotificationBell';
import ProfileModal from '../modals/ProfileModal';

const Header = ({ onToggleSidebar, isCollapsed }) => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const notifications = useSelector(state => state.notifications.notifications);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [psaChecked, setPsaChecked] = useState(false);

  // Count PSA-related notifications
  const psaNotificationCount = notifications.filter(
    n => !n.read && (n.type === 'psa_monitoring' || n.type === 'psa_entry')
  ).length;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  // Check for PSA monitoring requirements for nurses
  useEffect(() => {
    // Only run once per session and only for urology nurses
    if (psaChecked || role !== 'urology_nurse') return;

    // Mock patient data - In production, this would come from an API/Redux store
    const mockPatients = [
      {
        id: 'URP2024001',
        name: 'John Smith',
        pathway: 'Active Surveillance',
        lastPSADate: '2025-08-10', // More than 60 days ago
        lastPSA: 8.5,
      },
      {
        id: 'URP2024005',
        name: 'Robert Johnson',
        pathway: 'Active Surveillance',
        lastPSADate: null, // No PSA entry
        lastPSA: null,
      },
      {
        id: 'URP2024008',
        name: 'James Williams',
        pathway: 'Post-Op Follow Up',
        lastPSADate: '2025-09-01', // More than 30 days ago
        lastPSA: 6.2,
      },
      {
        id: 'URP2024012',
        name: 'Thomas Brown',
        pathway: 'OPD Queue',
        lastPSADate: null, // No PSA entry
        lastPSA: null,
      },
    ];

    const today = new Date();
    
    mockPatients.forEach(patient => {
      // Check if PSA has never been entered
      if (!patient.lastPSADate || !patient.lastPSA) {
        dispatch(addPSAEntryNotification({
          patientId: patient.id,
          patientName: patient.name,
          pathway: patient.pathway,
          message: `PSA entry required for ${patient.name} (${patient.id}) in ${patient.pathway}`,
        }));
      } else {
        // Check if PSA monitoring is overdue
        const lastPSADate = new Date(patient.lastPSADate);
        const daysSinceLastPSA = Math.floor((today - lastPSADate) / (1000 * 60 * 60 * 24));
        
        // For Active Surveillance patients, PSA should be monitored every 90 days
        // For Post-Op patients, every 60 days
        // For other pathways, every 180 days
        let monitoringInterval = 180;
        if (patient.pathway === 'Active Surveillance') {
          monitoringInterval = 90;
        } else if (patient.pathway === 'Post-Op Follow Up') {
          monitoringInterval = 60;
        }
        
        if (daysSinceLastPSA > monitoringInterval) {
          const daysOverdue = daysSinceLastPSA - monitoringInterval;
          dispatch(addPSAMonitoringNotification({
            patientId: patient.id,
            patientName: patient.name,
            daysOverdue,
            message: `PSA monitoring overdue for ${patient.name} (${patient.id}). Last PSA: ${patient.lastPSA} on ${patient.lastPSADate} (${daysOverdue} days overdue)`,
          }));
        }
      }
    });

    setPsaChecked(true);
  }, [role, dispatch, psaChecked]);

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

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleSidebar}
            className="sm:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200/50 px-4 py-2.5 rounded-full shadow-sm">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {getRoleDisplayName(role)}
            </span>
          </div>

        </div>

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
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};

export default Header;
