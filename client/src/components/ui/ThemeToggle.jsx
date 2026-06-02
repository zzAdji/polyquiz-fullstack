import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'var(--surface-color)',
        border: '2px solid var(--border-color)',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 0 var(--border-color)',
        color: 'var(--text-primary)',
        transition: 'transform 0.1s',
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(4px)';
        e.currentTarget.style.boxShadow = '0 0px 0 var(--border-color)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 var(--border-color)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 var(--border-color)';
      }}
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun size={24} color="#FFD700" /> : <Moon size={24} color="#5C5C5C" />}
    </button>
  );
}
