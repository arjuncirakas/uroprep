import React, { useState } from 'react';
import { X, Database, Calendar, User, Microscope, Activity } from 'lucide-react';

const TestResultsModal = ({ isOpen, onClose, patientData }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen || !patientData) return null;

  // Mock test results data - in real app this would come from props or API
  const mockTestResults = [
    {
      id: 1,
      type: 'MRI Prostate',
      category: 'mri',
      date: '2023-06-20',
      result: 'PIRADS 3 lesion in left peripheral zone measuring 8mm. No evidence of extracapsular extension. Prostate volume: 45cc.',
      status: 'completed',
      document: 'MRI Prostate Report - 20/06/2023.pdf',
      orderedBy: 'Dr. Sarah Wilson',
      lab: 'Melbourne Radiology',
      findings: {
        pirads: 3,
        lesionSize: '8mm',
        location: 'Left peripheral zone',
        extracapsularExtension: 'None',
        prostateVolume: '45cc'
      }
    },
    {
      id: 2,
      type: 'Prostate Biopsy',
      category: 'biopsy',
      date: '2023-08-15',
      result: 'Gleason Score 3+4=7 (Grade Group 2). Positive in 2/12 cores. No perineural invasion.',
      status: 'completed',
      document: 'Prostate Biopsy Report - 15/08/2023.pdf',
      orderedBy: 'Dr. Sarah Wilson',
      lab: 'Melbourne Pathology',
      findings: {
        gleasonScore: '3+4=7',
        gradeGroup: 2,
        positiveCores: 2,
        totalCores: 12,
        perineuralInvasion: 'None',
        tumorPercentage: '15%'
      }
    },
    {
      id: 3,
      type: 'TRUS Prostate',
      category: 'trus',
      date: '2023-08-10',
      result: 'Transrectal ultrasound shows hypoechoic lesion in left peripheral zone. Prostate volume: 42cc.',
      status: 'completed',
      document: 'TRUS Report - 10/08/2023.pdf',
      orderedBy: 'Dr. Sarah Wilson',
      lab: 'Melbourne Radiology',
      findings: {
        lesionType: 'Hypoechoic',
        location: 'Left peripheral zone',
        prostateVolume: '42cc',
        echogenicity: 'Decreased'
      }
    },
    {
      id: 4,
      type: 'MRI Prostate (Follow-up)',
      category: 'mri',
      date: '2023-12-15',
      result: 'Stable PIRADS 3 lesion. No significant interval change. Prostate volume: 46cc.',
      status: 'completed',
      document: 'MRI Prostate Follow-up - 15/12/2023.pdf',
      orderedBy: 'Dr. Michael Chen',
      lab: 'Melbourne Radiology',
      findings: {
        pirads: 3,
        lesionSize: '8mm',
        location: 'Left peripheral zone',
        extracapsularExtension: 'None',
        prostateVolume: '46cc',
        change: 'Stable'
      }
    },
    {
      id: 5,
      type: 'Repeat Biopsy',
      category: 'biopsy',
      date: '2024-01-20',
      result: 'Gleason Score 3+3=6 (Grade Group 1). Positive in 1/12 cores. No progression.',
      status: 'completed',
      document: 'Repeat Biopsy Report - 20/01/2024.pdf',
      orderedBy: 'Dr. Michael Chen',
      lab: 'Melbourne Pathology',
      findings: {
        gleasonScore: '3+3=6',
        gradeGroup: 1,
        positiveCores: 1,
        totalCores: 12,
        perineuralInvasion: 'None',
        tumorPercentage: '8%',
        progression: 'No progression'
      }
    },
    {
      id: 6,
      type: 'TRUS Follow-up',
      category: 'trus',
      date: '2024-01-18',
      result: 'Stable hypoechoic lesion. No significant changes from previous examination.',
      status: 'completed',
      document: 'TRUS Follow-up - 18/01/2024.pdf',
      orderedBy: 'Dr. Michael Chen',
      lab: 'Melbourne Radiology',
      findings: {
        lesionType: 'Hypoechoic',
        location: 'Left peripheral zone',
        prostateVolume: '44cc',
        echogenicity: 'Decreased',
        change: 'Stable'
      }
    },
  ];

  const categories = [
    { id: 'all', name: 'All Results', count: mockTestResults.length },
    { id: 'mri', name: 'MRI', count: mockTestResults.filter(r => r.category === 'mri').length },
    { id: 'biopsy', name: 'BIOPSY', count: mockTestResults.filter(r => r.category === 'biopsy').length },
    { id: 'trus', name: 'TRUS', count: mockTestResults.filter(r => r.category === 'trus').length }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'mri': return 'bg-blue-100 text-blue-800';
      case 'biopsy': return 'bg-purple-100 text-purple-800';
      case 'trus': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'mri': return <Database className="h-4 w-4" />;
      case 'biopsy': return <Microscope className="h-4 w-4" />;
      case 'trus': return <Activity className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const filteredResults = mockTestResults.filter(result => 
    selectedCategory === 'all' || result.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Test Results & Documents</h2>
                <p className="text-blue-100 text-sm">{patientData?.name || 'Patient'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden" style={{ height: 'calc(90vh - 120px)' }}>
          <div className="flex h-full">
            {/* Sidebar - Categories */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredResults.length > 0 ? (
                <div className="space-y-6">
                  {/* Timeline Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Test Timeline</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Chronological order</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {filteredResults
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((result, index) => (
                      <div key={result.id} className="relative flex items-start space-x-6 pb-8">
                        {/* Timeline dot */}
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(result.category)}`}>
                          {getCategoryIcon(result.category)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{result.type}</h3>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(result.category)}`}>
                              {result.category.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(result.date)}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {result.orderedBy}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Database className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    No test results found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    No test results match the selected category. Try selecting a different category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TestResultsModal;
