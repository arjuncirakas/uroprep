import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3,
  Settings,
  Activity,
  Database,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import ProfileModal from '../modals/ProfileModal';

const AdminSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { user, role } = useSelector((state) => state.auth);
  
  const navigationItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { path: '/admin/settings', label: 'System Settings', icon: Settings },
    { path: '/admin/activity', label: 'User Activity', icon: Activity },
    { path: '/admin/export', label: 'Data Export', icon: Database },
  ];

  return (
    <>
      <aside className={`${isCollapsed ? 'w-16' : 'w-[280px]'} bg-white text-gray-700 h-screen fixed left-0 top-0 z-10 border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0`}>
      {/* Header */}
      <div className={`${isCollapsed ? 'px-3 py-6' : 'p-6'} `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${isCollapsed ? 'w-8 h-8' : 'w-[10rem]'} flex items-center justify-center overflow-hidden`}>
              <img 
                src={isCollapsed ? "/urologo2.png" : "/urologo.png"} 
                alt="UroPrep Logo" 
                className="max-w-full max-h-full object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Collapse/Expand button */}
            <button
              onClick={onToggleCollapse}
              className="hidden sm:flex p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="sm:hidden p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className={`${isCollapsed ? 'px-2' : 'px-6'} py-4`}>
        <nav>
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out ${
                      isActive
                        ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-[1.01]'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} transition-colors duration-300 ease-in-out ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    {!isCollapsed && <span className="transition-colors duration-300 ease-in-out">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Profile Info Card */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-[0.5rem] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-sm text-gray-800">{user?.name || 'User Name'}</h4>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </button>
        </div>
      )}
      
      {/* Collapsed Profile Icon */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-2 right-2">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-[0.5rem] flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-200"
          >
            <span className="text-white font-semibold text-sm">AD</span>
          </button>
        </div>
      )}

    </aside>

    {/* Profile Modal - Rendered using Portal to appear outside sidebar DOM tree */}
    {isProfileModalOpen && createPortal(
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />,
      document.body
    )}
  </>
  );
};

export default AdminSidebar;
