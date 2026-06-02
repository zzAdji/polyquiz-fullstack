import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  selected = false, 
  status = 'default', // 'default', 'correct', 'wrong', 'blue'
  className = '', 
  style = {}, // extract style from props to avoid overwriting baseStyle completely
  ...props 
}) {
  let bgColor = 'var(--surface-solid)';
  let borderColor = 'var(--border-color)';
  let shadowColor = 'var(--border-color)';
  let textColor = 'var(--text-primary)';

  if (variant === 'primary') {
    bgColor = 'var(--apple-blue)';
    borderColor = 'var(--apple-blue-dark)';
    shadowColor = 'var(--apple-blue-dark)';
    textColor = '#FFF';
    
    if (status === 'wrong') {
      bgColor = 'var(--apple-red)';
      borderColor = 'var(--apple-red-dark)';
      shadowColor = 'var(--apple-red-dark)';
    } else if (status === 'correct' || status === 'green') {
      bgColor = 'var(--apple-green)';
      borderColor = 'var(--apple-green-dark)';
      shadowColor = 'var(--apple-green-dark)';
    }
  } else if (variant === 'secondary') {
    if (selected) {
      bgColor = 'var(--apple-blue-light)';
      borderColor = 'var(--apple-blue)';
      shadowColor = 'var(--apple-blue-dark)';
    } else if (status === 'correct') {
      bgColor = 'var(--apple-green-light)';
      borderColor = 'var(--apple-green)';
      shadowColor = 'var(--apple-green-dark)';
    } else if (status === 'wrong') {
      bgColor = 'var(--apple-red-light)';
      borderColor = 'var(--apple-red)';
      shadowColor = 'var(--apple-red-dark)';
    } else {
      // default secondary
      borderColor = 'var(--border-color)';
      shadowColor = 'var(--border-color)';
    }
  }

  const baseStyle = {
    backgroundColor: bgColor,
    color: textColor,
    border: `2px solid ${borderColor}`,
    borderRadius: '16px',
    padding: '16px 24px',
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    boxShadow: `0 4px 0 ${shadowColor}`,
    transition: 'all 0.1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: variant === 'primary' ? 'center' : 'space-between',
    gap: '12px',
    width: '100%',
    opacity: props.disabled && variant === 'primary' ? 0.6 : 1,
    ...style // properly merge passed styles
  };

  return (
    <button 
      className={className} 
      style={baseStyle} 
      {...props}
      onMouseDown={(e) => {
        if(!props.disabled) {
          e.currentTarget.style.transform = 'translateY(4px)';
          e.currentTarget.style.boxShadow = `0 0px 0 ${shadowColor}`;
        }
      }}
      onMouseUp={(e) => {
        if(!props.disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 0 ${shadowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        if(!props.disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 0 ${shadowColor}`;
        }
      }}
    >
      {children}
    </button>
  );
}
