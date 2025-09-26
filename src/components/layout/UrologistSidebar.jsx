import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  ClipboardList, 
  FileText,
  Stethoscope,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const UrologistSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/urologist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/urologist/priorities', label: 'Priority Dashboard', icon: AlertTriangle },
    { path: '/urologist/referrals', label: 'Referrals Queue', icon: ClipboardList },
    { path: '/urologist/patient-chart', label: 'Patient Chart', icon: FileText },
    { path: '/urologist/surgery', label: 'Surgery Management', icon: Stethoscope },
    { path: '/urologist/mdt', label: 'MDT Cases', icon: Users },
    { path: '/urologist/clinical-tools', label: 'Clinical Tools', icon: Shield },
  ];

  return (
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
              
              // Check if current path matches the item
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
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-[0.5rem] flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">UR</span>
                </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800">Dr. John Smith</h4>
                <p className="text-xs text-gray-500">Urologist</p>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Collapsed Profile Icon */}
      {isCollapsed && (
        <div className="absolute bottom-4 left-2 right-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-800 to-black rounded-[0.5rem] flex items-center justify-center mx-auto">
            <span className="text-white font-semibold text-sm">UR</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UrologistSidebar;
