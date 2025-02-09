import React, { createContext, useState, useContext } from 'react';

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [apiEndpoint, setApiEndpoint] = useState('https://c6fa-102-96-49-175.ngrok-free.app/process-link/');

  const updateApiEndpoint = (newEndpoint) => {
    setApiEndpoint(newEndpoint);
    // You might want to save this to localStorage as well
    localStorage.setItem('apiEndpoint', newEndpoint);
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedEndpoint = localStorage.getItem('apiEndpoint');
    if (savedEndpoint) {
      setApiEndpoint(savedEndpoint);
    }
  }, []);

  return (
    <ApiContext.Provider value={{ apiEndpoint, updateApiEndpoint }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
