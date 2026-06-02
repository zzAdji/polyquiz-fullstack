import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../context/UserContext';

export default function MainLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { pseudo } = useUser();
  const location = useLocation();

  return (
    <div className="app-container">
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        {/* Pseudo affiché à gauche si disponible */}
        {pseudo ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '99px',
            padding: '8px 16px',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: 'var(--apple-blue)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: '0.75rem'
            }}>
              {pseudo[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {pseudo}
            </span>
          </div>
        ) : (
          <div />
        )}

        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      <main key={location.pathname} className="page-transition" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}

