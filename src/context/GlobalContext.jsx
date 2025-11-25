import  { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const GlobalContext = createContext();
const STORAGE_KEY = 'wifiQrState';

export const GlobalProvider = ({ children }) => {
  const { user, isConfirmed } = useAuth();
  const savedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(STORAGE_KEY)) : null;

  const [qrUrl, setQrUrl] = useState(savedState?.qrUrl || null);
  const [networkName, setNetworkName] = useState(savedState?.networkName || '');
  const [networkPassword, setNetworkPassword] = useState('');
  const [networkSecurity, setNetworkSecurity] = useState(savedState?.networkSecurity || '');
  const [formVisible, setFormVisible] = useState(savedState?.formVisible ?? true);
  const [error, setError] = useState('');

  const saveQR = (url, name, password = '', security = '') => {
    if (!user) {
      setError('You must be logged in to save QR cards');
      return false;
    }
    if (!isConfirmed) {
      setError('Your email must be confirmed to save QR cards');
      return false;
    }

    setQrUrl(url);
    setNetworkName(name);
    setNetworkPassword(password);
    setNetworkSecurity(security);
    setFormVisible(false);
    setError('');

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        qrUrl: url,
        networkName: name,
        networkSecurity: security,
        formVisible: false
      })
    );

    return true;
  };

  const resetQR = () => {
    setQrUrl(null);
    setNetworkName('');
    setNetworkPassword('');
    setNetworkSecurity('');
    setFormVisible(true);
    setError('');
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ qrUrl, networkName, networkSecurity, formVisible })
    );
  }, [qrUrl, networkName, networkSecurity, formVisible]);

  return (
    <GlobalContext.Provider
      value={{
        qrUrl,
        networkName,
        networkPassword,
        networkSecurity,
        formVisible,
        setFormVisible,
        saveQR,
        resetQR,
        error
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
