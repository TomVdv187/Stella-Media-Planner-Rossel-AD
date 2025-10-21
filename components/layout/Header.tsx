'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, Plus } from 'lucide-react';

interface HeaderProps {
  onCreateCampaign?: () => void;
}

export default function Header({ onCreateCampaign }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth();

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

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
              {isAdmin && (
                <span className="bg-rossel-gold text-rossel-blue px-2 py-1 rounded-full text-xs font-medium">
                  Admin
                </span>
              )}
            </div>

            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}