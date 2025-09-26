import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';

const DataExport = () => {
  const features = [
    'Export patient data in multiple formats',
    'Custom data field selection',
    'Date range filtering',
    'Bulk export operations',
    'Scheduled exports',
    'Data anonymization options',
    'Export history and audit trail'
  ];

  return (
    <PlaceholderPage
      title="Data Export Tools"
      description="Export system data for analysis and reporting"
      features={features}
    />
  );
};

export default DataExport;

