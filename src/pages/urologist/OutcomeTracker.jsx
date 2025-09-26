import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Activity,
  CheckCircle, 
  AlertTriangle,
  Users,
  Clock,
  Heart
} from 'lucide-react';

const OutcomeTracker = () => {
  const { db4 } = useSelector(state => state.databases);
  const { referrals } = useSelector(state => state.referrals);
  const [timeRange, setTimeRange] = useState('12months');

  // Basic outcome metrics only
  const outcomeMetrics = {
    totalSurgeries: db4.patients.length,
    complicationRate: 8.2, // Mock data
    positiveMargins: 12.8, // Mock data
    biochemicalRecurrence: 15.4, // Mock data
    followUpCompliance: {
      threeMonth: 94.2,
      sixMonth: 91.8,
      twelveMonth: 88.5
    }
  };

  const OutcomeCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${
            color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
            color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
            color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-700' : 'bg-gradient-to-br from-red-500 to-red-700'
          }`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outcome Tracker</h1>
            <p className="text-sm text-gray-600 mt-1">Track patient outcomes and quality metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="24months">Last 24 Months</option>
            </select>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">Quality Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Surgical Outcomes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Surgical Outcomes</h3>
                <p className="text-sm text-gray-600 mt-1">Key performance indicators for surgical procedures</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <OutcomeCard
              title="Total Surgeries"
              value={outcomeMetrics.totalSurgeries}
              icon={Users}
              color="blue"
              subtitle="Last 12 months"
            />
            <OutcomeCard
              title="Complication Rate"
              value={`${outcomeMetrics.complicationRate}%`}
              icon={AlertTriangle}
              color="orange"
              subtitle="30-day complications"
            />
            <OutcomeCard
              title="Positive Margins"
              value={`${outcomeMetrics.positiveMargins}%`}
              icon={Target}
              color="red"
              subtitle="Pathological margins"
            />
            <OutcomeCard
              title="Biochemical Recurrence"
              value={`${outcomeMetrics.biochemicalRecurrence}%`}
              icon={Activity}
              color="orange"
              subtitle="PSA >0.2 ng/mL"
            />
          </div>
        </div>
      </div>

      {/* Follow-up Compliance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Follow-up Compliance</h3>
                <p className="text-sm text-gray-600 mt-1">Patient adherence to scheduled follow-up appointments</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Tracking</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <OutcomeCard
              title="3-Month Follow-up"
              value={`${outcomeMetrics.followUpCompliance.threeMonth}%`}
              icon={Clock}
              color="green"
            />
            <OutcomeCard
              title="6-Month Follow-up"
              value={`${outcomeMetrics.followUpCompliance.sixMonth}%`}
              icon={Clock}
              color="green"
            />
            <OutcomeCard
              title="12-Month Follow-up"
              value={`${outcomeMetrics.followUpCompliance.twelveMonth}%`}
              icon={Clock}
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutcomeTracker;