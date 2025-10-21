'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, Placement } from '@/types';
import { getCampaigns, deleteCampaign, getPlacements, generateId } from '@/lib/storage';
import { exportToPDF, exportToExcel } from '@/lib/export';
import { BarChart3, Plus, Calendar, Euro, Eye, Edit, Trash2, FileDown, Settings, Users } from 'lucide-react';
import SimpleCampaignList from './campaigns/SimpleCampaignList';
import CampaignForm from './campaigns/CampaignForm';
import CampaignDetails from './campaigns/CampaignDetails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SimpleDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadCampaigns();
  }, [refreshTrigger]);

  const loadCampaigns = () => {
    const campaignList = getCampaigns();
    setCampaigns(campaignList);
  };

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
        deleteCampaign(campaign.id);
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting campaign:', error);
        alert('Erreur lors de la suppression de la campagne');
      }
    }
  };

  const handleExportCampaign = async (campaign: Campaign) => {
    try {
      const placements = getPlacements(campaign.id);
      const choice = window.confirm('Choisissez le format d\'export:\nOK = PDF\nAnnuler = Excel');
      
      if (choice) {
        await exportToPDF(campaign, placements, 'Utilisateur Rossel');
      } else {
        await exportToExcel(campaign, placements, 'Utilisateur Rossel');
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

  // Calculate stats
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.totalCost, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-rossel-blue">Rossel</h1>
              <span className="ml-2 text-gray-600">Media Planning</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateCampaign}
                className="bg-rossel-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle campagne</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campagnes</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Euro className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalBudget.toLocaleString('fr-BE')} €</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Euro className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Coût Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalCost.toLocaleString('fr-BE')} €</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mes campagnes</h2>
          <p className="text-gray-600">Gérez vos campagnes de planning média</p>
        </div>

        <SimpleCampaignList
          campaigns={campaigns}
          onEditCampaign={handleEditCampaign}
          onViewCampaign={handleViewCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          onExportCampaign={handleExportCampaign}
        />

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