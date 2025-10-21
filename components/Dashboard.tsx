'use client';

import React, { useState } from 'react';
import { Campaign, Placement } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { deleteCampaign, getPlacements } from '@/lib/firestore';
import { exportToPDF, exportToExcel } from '@/lib/export';
import Header from './layout/Header';
import CampaignList from './campaigns/CampaignList';
import CampaignForm from './campaigns/CampaignForm';
import CampaignDetails from './campaigns/CampaignDetails';
import AdminPanel from './admin/AdminPanel';
import { BarChart3, FileDown, Settings, Users } from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'admin'>('campaigns');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setShowCampaignForm(true);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowCampaignForm(true);
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setViewingCampaign(campaign);
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la campagne "${campaign.name}" ?`)) {
      try {
        await deleteCampaign(campaign.id);
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Erreur lors de la suppression de la campagne');
      }
    }
  };

  const handleExportCampaign = async (campaign: Campaign) => {
    try {
      const placements = await getPlacements(campaign.id);
      const choice = window.confirm('Choisissez le format d\'export:\nOK = PDF\nAnnuler = Excel');
      
      if (choice) {
        await exportToPDF(campaign, placements, user?.email || 'Utilisateur');
      } else {
        await exportToExcel(campaign, placements, user?.email || 'Utilisateur');
      }
    } catch (error) {
      console.error('Error exporting campaign:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const handleCampaignSaved = () => {
    setShowCampaignForm(false);
    setEditingCampaign(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCampaignFormCancel = () => {
    setShowCampaignForm(false);
    setEditingCampaign(null);
  };

  const handleCampaignDetailsClose = () => {
    setViewingCampaign(null);
  };

  const handleCampaignRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateCampaign={handleCreateCampaign} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'campaigns'
                      ? 'border-lesoir-blue text-lesoir-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 inline mr-2" />
                  Campagnes
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'admin'
                      ? 'border-lesoir-blue text-lesoir-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  Administration
                </button>
              </nav>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Mes campagnes</h2>
              <p className="text-gray-600">Gérez vos campagnes de planning média</p>
            </div>

            <CampaignList
              onEditCampaign={handleEditCampaign}
              onViewCampaign={handleViewCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onExportCampaign={handleExportCampaign}
              refreshTrigger={refreshTrigger}
            />
          </div>
        ) : (
          <AdminPanel />
        )}

        {showCampaignForm && (
          <CampaignForm
            campaign={editingCampaign}
            onSave={handleCampaignSaved}
            onCancel={handleCampaignFormCancel}
          />
        )}

        {viewingCampaign && (
          <CampaignDetails
            campaign={viewingCampaign}
            onClose={handleCampaignDetailsClose}
            onEdit={() => {
              handleEditCampaign(viewingCampaign);
              setViewingCampaign(null);
            }}
            onRefresh={handleCampaignRefresh}
          />
        )}
      </div>
    </div>
  );
}