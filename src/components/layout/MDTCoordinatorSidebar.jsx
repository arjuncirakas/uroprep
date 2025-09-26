import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText,
  ClipboardList,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const MDTCoordinatorSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const navigation = [
    { name: 'Dashboard', href: '/mdt-coordinator/dashboard', icon: LayoutDashboard },
    { name: 'MDT Scheduling', href: '/mdt-coordinator/scheduling', icon: Calendar },
    { name: 'Case Management', href: '/mdt-coordinator/cases', icon: ClipboardList },
    { name: 'Reports', href: '/mdt-coordinator/reports', icon: BarChart3 },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-[280px]'} bg-gray-50 text-gray-700 h-screen fixed left-0 top-0 z-10 border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } sm:translate-x-0`}>
      {/* Header */}
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            {!isCollapsed && <span className="text-xl font-semibold text-gray-800">UroPrep</span>}
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
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out ${
                        isActive
                          ? 'bg-gradient-to-r from-green-800 to-black text-white shadow-md transform scale-[1.02]'
                          : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-[1.01]'
                      }`
                    }
                    title={isCollapsed ? item.name : ''}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} transition-colors duration-300 ease-in-out ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        {!isCollapsed && <span className="transition-colors duration-300 ease-in-out">{item.name}</span>}
                      </>
                    )}
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
                  <span className="text-white font-semibold text-sm">MD</span>
                </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-800">Dr. Michael Brown</h4>
                <p className="text-xs text-gray-500">MDT Coordinator</p>
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
            <span className="text-white font-semibold text-sm">MD</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default MDTCoordinatorSidebar;
