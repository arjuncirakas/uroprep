import React from 'react';
import PlaceholderPage from '../../components/PlaceholderPage';

const UserActivity = () => {
  const features = [
    'Real-time user activity monitoring',
    'Login/logout tracking',
    'Page access logs',
    'User session management',
    'Activity reports and analytics',
    'Suspicious activity alerts',
    'User behavior patterns'
  ];

  return (
    <PlaceholderPage
      title="User Activity Monitor"
      description="Monitor and track user activities across the system"
      features={features}
    />
  );
};

export default UserActivity;

