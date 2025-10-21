'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, Placement } from '@/types';
import { getCampaigns, deleteCampaign, getPlacements, generateId } from '@/lib/storage';
import { exportToPDF, exportToExcel } from '@/lib/export';
import { 
  BarChart3, 
  Plus, 
  Calendar, 
  Euro, 
  Eye, 
  Edit, 
  Trash2, 
  FileDown, 
  Settings, 
  Users,
  TrendingUp,
  Target,
  Activity,
  PieChart,
  Bot,
  Sparkles
} from 'lucide-react';
import SimpleCampaignList from './campaigns/SimpleCampaignList';
import CampaignForm from './campaigns/CampaignForm';
import CampaignDetails from './campaigns/CampaignDetails';
import ProfessionalHeader from './layout/ProfessionalHeader';
import MetricCard from './ui/MetricCard';
import AIAssistant from './ai/AIAssistant';
import MediaPlanViewer from './plans/MediaPlanViewer';
import SmartInsights from './ai/SmartInsights';
import { BriefingData, MediaPlanningAgent, MediaPlan } from '@/lib/mediaAgent';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SimpleDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MediaPlan | null>(null);

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

  const handleAIAssistant = () => {
    setShowAIAssistant(true);
  };

  const handlePlanGenerated = (briefing: BriefingData) => {
    const plan = MediaPlanningAgent.calculatePlan(briefing);
    setGeneratedPlan(plan);
    setShowAIAssistant(false);
  };

  const handleClosePlanViewer = () => {
    setGeneratedPlan(null);
  };

  const handleExportPlan = () => {
    if (generatedPlan) {
      // Export plan as PDF logic would go here
      console.log('Exporting plan:', generatedPlan);
    }
  };

  // Calculate stats
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.totalCost, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const budgetUtilization = totalBudget > 0 ? (totalCost / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen">
      <ProfessionalHeader onCreateCampaign={handleCreateCampaign} />
      
      <main className="page-container py-8 space-y-8">
        {/* Hero Section */}
        <div className="section-header animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="section-title text-balance">
                Tableau de Bord 
                <span className="bg-gradient-to-r from-rossel-600 to-accent-500 bg-clip-text text-transparent ml-2">
                  Media Planning
                </span>
              </h1>
              <p className="section-subtitle">
                Gérez vos campagnes publicitaires Rossel avec une vue d'ensemble complète et des outils professionnels
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="glass-effect rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span>Données sauvegardées localement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <MetricCard
            title="Total Campagnes"
            value={campaigns.length}
            icon={BarChart3}
            gradient="from-rossel-500 to-rossel-600"
            iconColor="text-rossel-600"
            description="Toutes vos campagnes créées"
            change={{
              value: 12,
              type: 'increase'
            }}
          />
          
          <MetricCard
            title="Campagnes Actives"
            value={activeCampaigns}
            icon={Activity}
            gradient="from-success-500 to-success-600"
            iconColor="text-success-600"
            description="En cours d'exécution"
            change={{
              value: 8,
              type: 'increase'
            }}
          />
          
          <MetricCard
            title="Budget Total"
            value={`${totalBudget.toLocaleString('fr-BE')} €`}
            icon={Target}
            gradient="from-accent-500 to-accent-600"
            iconColor="text-accent-600"
            description="Budget alloué aux campagnes"
            change={{
              value: 15,
              type: 'increase'
            }}
          />
          
          <MetricCard
            title="Utilisation Budget"
            value={`${budgetUtilization.toFixed(1)}%`}
            icon={PieChart}
            gradient="from-primary-500 to-primary-600"
            iconColor="text-primary-600"
            description={`${totalCost.toLocaleString('fr-BE')} € dépensés`}
            change={{
              value: 5,
              type: budgetUtilization > 80 ? 'decrease' : 'increase'
            }}
          />
        </div>

        {/* Smart Insights */}
        <SmartInsights campaigns={campaigns} />

        {/* AI Assistant CTA */}
        <div className="card bg-gradient-to-br from-rossel-50 via-white to-accent-50 border-rossel-100 animate-fade-in">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rossel-500 to-rossel-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Assistant IA - Plan Média Intelligent</h3>
                  <p className="text-gray-600 text-sm">Créez un plan média optimisé en quelques minutes avec notre IA avancée</p>
                </div>
              </div>
              <button
                onClick={handleAIAssistant}
                className="btn-primary bg-gradient-to-r from-rossel-500 to-rossel-600 hover:from-rossel-600 hover:to-rossel-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Créer avec l'IA
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="card animate-fade-in">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Mes Campagnes</h2>
                <p className="text-sm text-gray-600 mt-1">Gérez et suivez toutes vos campagnes média</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <span>{campaigns.length} campagne{campaigns.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <SimpleCampaignList
              campaigns={campaigns}
              onEditCampaign={handleEditCampaign}
              onViewCampaign={handleViewCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onExportCampaign={handleExportCampaign}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
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

      {showAIAssistant && (
        <AIAssistant
          onPlanGenerated={handlePlanGenerated}
          onClose={() => setShowAIAssistant(false)}
        />
      )}

      {generatedPlan && (
        <MediaPlanViewer
          plan={generatedPlan}
          onClose={handleClosePlanViewer}
          onExport={handleExportPlan}
        />
      )}
    </div>
  );
}