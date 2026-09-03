import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        borderRadius: '12px',
        background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
        backdropFilter: 'blur(12px)',
        color: isSuccess ? '#10b981' : '#ef4444',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          marginLeft: '8px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
