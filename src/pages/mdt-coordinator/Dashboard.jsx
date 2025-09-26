import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  Users, 
  FileText, 
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Plus,
  Eye
} from 'lucide-react';

const MDTDashboard = () => {
  const dispatch = useDispatch();
  const { cases, meetings, outcomes } = useSelector(state => state.mdt);
  const { db1, db2, db3, db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.scheduledDate) > new Date()
  ).slice(0, 5);

  const pendingCases = cases.filter(case_ => case_.status === 'pending');
  const activeCases = cases.filter(case_ => case_.status === 'active');
  const completedCases = cases.filter(case_ => case_.status === 'completed');

  const stats = [
    {
      name: 'Pending Cases',
      value: pendingCases.length,
      icon: AlertTriangle,
      color: 'yellow',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Active Cases',
      value: activeCases.length,
      icon: Clock,
      color: 'blue',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Completed Cases',
      value: completedCases.length,
      icon: CheckCircle,
      color: 'green',
      change: '+15%',
      changeType: 'increase'
    },
    {
      name: 'Upcoming Meetings',
      value: upcomingMeetings.length,
      icon: Calendar,
      color: 'purple',
      change: '+3',
      changeType: 'increase'
    }
  ];

  const recentOutcomes = outcomes.slice(0, 5);

  // Generate cross-database case summaries for MDT
  const generateCrossDatabaseSummary = () => {
    const db1Cases = db1.patients.filter(p => p.clinicalDecision === 'mdt_referral');
    const db2Cases = db2.patients.filter(p => p.progressionAlert);
    const db3Cases = db3.patients.filter(p => p.mdtDiscussionRequired);
    const db4Cases = db4.patients.filter(p => p.biochemicalRecurrence);
    
    return {
      totalMDTCases: db1Cases.length + db2Cases.length + db3Cases.length + db4Cases.length,
      db1Referrals: db1Cases.length,
      db2Progression: db2Cases.length,
      db3Complex: db3Cases.length,
      db4Recurrence: db4Cases.length
    };
  };

  const crossDBSummary = generateCrossDatabaseSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MDT Coordinator Dashboard</h1>
          <p className="text-gray-600">Multidisciplinary Team Management Overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Database MDT Case Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cross-Database MDT Cases</h3>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {crossDBSummary.totalMDTCases} Cases Requiring MDT
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">DB1 Referrals</p>
                <p className="text-xl font-bold text-blue-900">{crossDBSummary.db1Referrals}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-orange-900">DB2 Progression</p>
                <p className="text-xl font-bold text-orange-900">{crossDBSummary.db2Progression}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-900">DB3 Complex</p>
                <p className="text-xl font-bold text-red-900">{crossDBSummary.db3Complex}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-purple-900">DB4 Recurrence</p>
                <p className="text-xl font-bold text-purple-900">{crossDBSummary.db4Recurrence}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming MDT Meetings</h3>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {upcomingMeetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No upcoming meetings scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(meeting.scheduledDate).toLocaleDateString()} at {meeting.time}
                      </p>
                      <p className="text-sm text-gray-500">{meeting.caseCount} cases</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Cases */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pending Cases</h3>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {pendingCases.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No pending cases</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCases.slice(0, 5).map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Case #{case_.id}</h4>
                      <p className="text-sm text-gray-600">{case_.patientName}</p>
                      <p className="text-sm text-gray-500">
                        Priority: <span className="font-medium">{case_.priority}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        {case_.priority}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Outcomes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent MDT Outcomes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outcome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOutcomes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No recent outcomes
                  </td>
                </tr>
              ) : (
                recentOutcomes.map((outcome) => (
                  <tr key={outcome.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {outcome.caseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {outcome.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {outcome.decision}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(outcome.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        outcome.status === 'implemented' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {outcome.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <Plus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Schedule New Meeting</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Add New Case</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Generate Report</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MDTDashboard;
