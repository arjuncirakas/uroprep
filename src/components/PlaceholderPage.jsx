import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description, features = [] }) => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Construction className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {features.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Planned Features:</h3>
            <ul className="text-left space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            This page is under development. The functionality will be implemented in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;

