'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  gradient?: string;
  iconColor?: string;
  description?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  gradient = 'from-primary-500 to-primary-600',
  iconColor = 'text-primary-600',
  description
}: MetricCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'increase': return 'text-success-600';
      case 'decrease': return 'text-error-600';
      default: return 'text-gray-500';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase': return '↗';
      case 'decrease': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
              {title}
            </p>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient.replace('500', '50').replace('600', '100')}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="stat-number group-hover:scale-105 transition-transform duration-200">
              {typeof value === 'number' ? value.toLocaleString('fr-BE') : value}
            </p>
            
            {description && (
              <p className="text-xs text-gray-500 leading-relaxed">
                {description}
              </p>
            )}
            
            {change && (
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium ${getChangeColor(change.type)}`}>
                  {getChangeIcon(change.type)} {Math.abs(change.value)}%
                </span>
                <span className="text-xs text-gray-500">vs mois dernier</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Subtle hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}