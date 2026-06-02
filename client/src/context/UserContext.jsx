import React, { createContext, useCallback, useContext, useState } from 'react';
import { getStoredToken, setStoredToken, TOKEN_STORAGE_KEY } from '../config/api';

const UserContext = createContext(null);
const PSEUDO_STORAGE_KEY = 'polyquiz_pseudo';

export function UserProvider({ children }) {
  const [pseudo, setPseudoState] = useState(() => localStorage.getItem(PSEUDO_STORAGE_KEY));
  const [token, setTokenState] = useState(() => getStoredToken());
  const [bestScore, setBestScore] = useState(0);

  const setPseudo = useCallback((value) => {
    const normalizedValue = value || null;
    setPseudoState(normalizedValue);
    if (normalizedValue) {
      localStorage.setItem(PSEUDO_STORAGE_KEY, normalizedValue);
    } else {
      localStorage.removeItem(PSEUDO_STORAGE_KEY);
    }
  }, []);

  const setToken = useCallback((value) => {
    setTokenState(value);
    if (value) {
      setStoredToken(value);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const updateBestScore = useCallback((newScore) => {
    setBestScore(prev => (newScore > prev ? newScore : prev));
  }, []);

  return (
    <UserContext.Provider value={{ pseudo, setPseudo, token, setToken, bestScore, updateBestScore }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un <UserProvider>');
  }
  return context;
}
