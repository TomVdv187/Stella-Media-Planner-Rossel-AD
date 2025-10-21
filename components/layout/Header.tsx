'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onCreateCampaign?: () => void;
}

export default function Header({ onCreateCampaign }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-rossel-blue">Rossel</h1>
            <span className="ml-2 text-gray-600">Media Planning</span>
          </div>

          <div className="flex items-center space-x-4">
            {onCreateCampaign && (
              <button
                onClick={onCreateCampaign}
                className="bg-rossel-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle campagne</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}