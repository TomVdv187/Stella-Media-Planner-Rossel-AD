'use client';

import React from 'react';
import { Campaign } from '@/types';

interface StatusBadgeProps {
  status: Campaign['status'];
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          className: 'badge-success',
          dot: 'bg-success-500',
        };
      case 'completed':
        return {
          label: 'Terminée',
          className: 'badge-info',
          dot: 'bg-primary-500',
        };
      case 'cancelled':
        return {
          label: 'Annulée',
          className: 'badge-error',
          dot: 'bg-error-500',
        };
      default:
        return {
          label: 'Brouillon',
          className: 'badge-warning',
          dot: 'bg-warning-500',
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-2xs';
      case 'lg':
        return 'px-3 py-1.5 text-sm';
      default:
        return 'px-2.5 py-1 text-xs';
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`${config.className} ${getSizeClasses(size)} inline-flex items-center font-medium`}>
      <span className={`w-1.5 h-1.5 ${config.dot} rounded-full mr-1.5`}></span>
      {config.label}
    </span>
  );
}