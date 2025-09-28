import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { NavigationProvider } from './contexts/NavigationContext';
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <NavigationProvider>
            <AppRoutes />
          </NavigationProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;