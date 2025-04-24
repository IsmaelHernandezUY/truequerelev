import React from 'react';

export function Button(props) {
    return (
      <button
        {...props}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          background: '#2563eb',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
        }}
      />
    )
  }
  