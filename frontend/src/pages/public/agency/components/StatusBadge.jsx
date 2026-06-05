import React from 'react';

const StatusBadge = ({ status }) => {
  // تعريف الألوان والحالات بناءً على الـ CSS Tokens ديالك
  const statusConfig = {
    available: {
      label: 'Disponible',
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-bg)',
    },
    reserved: {
      label: 'Réservé',
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-bg)',
    },
    unavailable: {
      label: 'Indisponible',
      color: 'var(--color-error)',
      bgColor: 'var(--color-error-bg)',
    },
    // تقدر تزيد حالات خاصة بالـ Bookings
    confirmed: {
      label: 'Confirmé',
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-bg)',
    },
    pending: {
      label: 'En attente',
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-bg)',
    }
  };

  const config = statusConfig[status] || statusConfig.unavailable;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-bold)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: config.color,
    backgroundColor: config.bgColor,
    border: `1px solid ${config.color}33`, // إضافة border خفيف بنفس اللون
  };

  const dotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: config.color,
    marginRight: '8px'
  };

  return (
    <span style={badgeStyle}>
      <span style={dotStyle}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;