import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  X,
  Edit,
  Trash2
} from 'lucide-react';

const SurgeryScheduling = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const surgeries = [
    {
      id: 1,
      patient: 'David Wilson',
      type: 'RALP',
      date: '2024-01-15',
      time: '09:00',
      theatre: 'Theatre 1',
      surgeon: 'Dr. Smith',
      status: 'Scheduled',
      duration: 180,
      preOpComplete: true
    },
    {
      id: 2,
      patient: 'Sarah Davis',
      type: 'Open',
      date: '2024-01-16',
      time: '14:00',
      theatre: 'Theatre 2',
      surgeon: 'Dr. Johnson',
      status: 'Scheduled',
      duration: 240,
      preOpComplete: false
    },
    {
      id: 3,
      patient: 'Michael Miller',
      type: 'RALP',
      date: '2024-01-17',
      time: '10:30',
      theatre: 'Theatre 1',
      surgeon: 'Dr. Brown',
      status: 'Pre-op',
      duration: 180,
      preOpComplete: true
    }
  ];

  const theatres = ['Theatre 1', 'Theatre 2', 'Theatre 3'];
  const surgeons = ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Wilson'];
  const surgeryTypes = ['RALP', 'Open', 'Laparoscopic', 'Robotic'];

  const [newSurgery, setNewSurgery] = useState({
    patient: '',
    type: 'RALP',
    date: '',
    time: '',
    theatre: 'Theatre 1',
    surgeon: '',
    duration: 180
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-green-100 text-green-800';
      case 'Pre-op': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddSurgery = (e) => {
    e.preventDefault();
    console.log('Adding surgery:', newSurgery);
    setShowAddModal(false);
    setNewSurgery({
      patient: '',
      type: 'RALP',
      date: '',
      time: '',
      theatre: 'Theatre 1',
      surgeon: '',
      duration: 180
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEndTime = (startTime, duration) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(start.getTime() + duration * 60000);
    return end.toTimeString().slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surgery Scheduling Center</h1>
          <p className="text-gray-600">Manage and schedule surgical procedures</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Surgery
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search surgeries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Theatres</option>
              {theatres.map(theatre => (
                <option key={theatre} value={theatre}>{theatre}</option>
              ))}
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Surgeons</option>
              {surgeons.map(surgeon => (
                <option key={surgeon} value={surgeon}>{surgeon}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Surgery List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Surgeries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surgery Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Theatre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Surgeon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pre-op
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {surgeries.map((surgery) => (
                <tr key={surgery.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{surgery.patient}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {surgery.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{surgery.date}</div>
                    <div className="text-sm text-gray-500">
                      {formatTime(surgery.time)} - {formatTime(getEndTime(surgery.time, surgery.duration))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {surgery.theatre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {surgery.surgeon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(surgery.status)}`}>
                      {surgery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {surgery.preOpComplete ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Surgery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Surgery</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddSurgery} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={newSurgery.patient}
                    onChange={(e) => setNewSurgery({ ...newSurgery, patient: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type</label>
                  <select
                    value={newSurgery.type}
                    onChange={(e) => setNewSurgery({ ...newSurgery, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {surgeryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSurgery.date}
                    onChange={(e) => setNewSurgery({ ...newSurgery, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newSurgery.time}
                    onChange={(e) => setNewSurgery({ ...newSurgery, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theatre</label>
                  <select
                    value={newSurgery.theatre}
                    onChange={(e) => setNewSurgery({ ...newSurgery, theatre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {theatres.map(theatre => (
                      <option key={theatre} value={theatre}>{theatre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surgeon</label>
                  <select
                    value={newSurgery.surgeon}
                    onChange={(e) => setNewSurgery({ ...newSurgery, surgeon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Surgeon</option>
                    {surgeons.map(surgeon => (
                      <option key={surgeon} value={surgeon}>{surgeon}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newSurgery.duration}
                    onChange={(e) => setNewSurgery({ ...newSurgery, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="30"
                    max="480"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Surgery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurgeryScheduling;

