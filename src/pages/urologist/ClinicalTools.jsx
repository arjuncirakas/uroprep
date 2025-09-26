import React, { useState } from 'react';
import { 
  Calculator, 
  FileText, 
  Shield, 
  Target, 
  Activity,
  Heart, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';

const ClinicalTools = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [psaVelocity, setPsaVelocity] = useState({
    psa1: '',
    psa2: '',
    timeInterval: ''
  });

  // PSA Velocity Calculator
  const calculatePSAVelocity = () => {
    const { psa1, psa2, timeInterval } = psaVelocity;
    if (!psa1 || !psa2 || !timeInterval) return null;
    
    const velocity = (parseFloat(psa2) - parseFloat(psa1)) / (parseFloat(timeInterval) / 12);
    return velocity.toFixed(2);
  };

  const clinicalTools = [
    {
      id: 'psa-velocity',
      title: 'PSA Velocity Calculator',
      description: 'Calculate PSA velocity between two measurements',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'risk-assessment',
      title: 'Prostate Cancer Risk Assessment',
      description: 'Assess prostate cancer risk based on clinical parameters',
      icon: Target,
      color: 'green'
    },
    {
      id: 'gleason-calculator',
      title: 'Gleason Score Calculator',
      description: 'Calculate and interpret Gleason scores',
      icon: Calculator,
      color: 'purple'
    },
    {
      id: 'surveillance-tools',
      title: 'Active Surveillance Tools',
      description: 'Tools for monitoring patients on active surveillance',
      icon: Activity,
      color: 'orange'
    }
  ];

  const ToolCard = ({ tool }) => (
    <div 
      className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedTool(tool.id)}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${
          tool.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
          tool.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-700' :
          tool.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gradient-to-br from-orange-500 to-orange-700'
        }`}>
          <tool.icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-gray-900">{tool.title}</h3>
          <p className="text-sm text-gray-600">{tool.description}</p>
        </div>
      </div>
    </div>
  );

  const PSAVelocityTool = () => {
    const velocity = calculatePSAVelocity();
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">PSA Velocity Calculator</h3>
                <p className="text-sm text-gray-600 mt-1">Calculate PSA velocity between two measurements</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Active Tool</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First PSA (ng/mL)</label>
              <input
                type="number"
                step="0.1"
                value={psaVelocity.psa1}
                onChange={(e) => setPsaVelocity({...psaVelocity, psa1: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                placeholder="e.g., 4.2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second PSA (ng/mL)</label>
              <input
                type="number"
                step="0.1"
                value={psaVelocity.psa2}
                onChange={(e) => setPsaVelocity({...psaVelocity, psa2: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                placeholder="e.g., 6.8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Interval (months)</label>
              <input
                type="number"
                value={psaVelocity.timeInterval}
                onChange={(e) => setPsaVelocity({...psaVelocity, timeInterval: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors hover:border-gray-400"
                placeholder="e.g., 12"
              />
            </div>
          </div>
          
          {velocity && (
            <div className={`p-6 rounded-xl border ${
              parseFloat(velocity) > 0.75 ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' : 
              parseFloat(velocity) > 0.5 ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200' : 'bg-gradient-to-r from-green-50 to-gray-50 border-green-200'
            }`}>
              <div className="flex items-center">
                <Calculator className="h-5 w-5 text-gray-600 mr-2" />
                <span className="font-semibold text-gray-900">PSA Velocity: </span>
                <span className={`ml-2 font-bold ${
                  parseFloat(velocity) > 0.75 ? 'text-red-600' : 
                  parseFloat(velocity) > 0.5 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {velocity} ng/mL/year
                </span>
              </div>
              <p className={`text-sm mt-2 ${
                parseFloat(velocity) > 0.75 ? 'text-red-700' : 
                parseFloat(velocity) > 0.5 ? 'text-orange-700' : 'text-green-700'
              }`}>
                {parseFloat(velocity) > 0.75 ? 
                  '⚠️ High risk - Consider MDT discussion and biopsy' :
                  parseFloat(velocity) > 0.5 ? 
                  '⚠️ Moderate concern - Monitor closely' : 
                  '✅ Within normal range - Continue surveillance'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clinical Decision Tools</h1>
            <p className="text-sm text-gray-600 mt-1">Clinical support tools and decision aids</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">Evidence-Based Tools</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-gray-50 border border-green-200 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-900">RACGP Guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Available Clinical Tools</h2>
              <p className="text-sm text-gray-600 mt-1">Evidence-based calculators and decision support tools</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Tools</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clinicalTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </div>

      {/* Selected Tool */}
      {selectedTool === 'psa-velocity' && <PSAVelocityTool />}
    </div>
  );
};

export default ClinicalTools;