import React from 'react';

export default function Input({ icon: Icon, ...props }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {Icon && (
        <Icon 
          size={20} 
          color="var(--text-secondary)" 
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
        />
      )}
      <input 
        {...props}
        style={{
          width: '100%',
          backgroundColor: 'var(--surface-color)',
          border: '2px solid var(--border-color)',
          borderRadius: '16px',
          padding: '16px',
          paddingLeft: Icon ? '48px' : '16px',
          color: 'var(--text-primary)',
          fontSize: '1.1rem',
          fontFamily: 'Nunito, sans-serif',
          outline: 'none',
          transition: 'border-color 0.2s',
          ...(props.style || {})
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--duo-blue)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
      />
    </div>
  );
}
