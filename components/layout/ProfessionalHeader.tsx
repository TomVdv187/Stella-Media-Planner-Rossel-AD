'use client';

import React from 'react';
import { Plus, BarChart3, Sparkles } from 'lucide-react';

interface ProfessionalHeaderProps {
  onCreateCampaign?: () => void;
}

export default function ProfessionalHeader({ onCreateCampaign }: ProfessionalHeaderProps) {
  return (
    <header className="header-gradient shadow-soft sticky top-0 z-50">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-rossel-600 to-rossel-700 rounded-xl flex items-center justify-center shadow-soft">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-rossel-700 to-rossel-900 bg-clip-text text-transparent">
                  Stella Media Planner
                </h1>
                <p className="text-sm text-gray-500 font-medium">Rossel Group</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {onCreateCampaign && (
              <button
                onClick={onCreateCampaign}
                className="btn-primary group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                <span>Nouvelle Campagne</span>
              </button>
            )}
            
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">En ligne</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}