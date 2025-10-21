'use client';

import React from 'react';
import { Campaign } from '@/types';
import { Calendar, Euro, Eye, Edit, Trash2, FileDown, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatusBadge from '../ui/StatusBadge';

interface SimpleCampaignListProps {
  campaigns: Campaign[];
  onEditCampaign: (campaign: Campaign) => void;
  onViewCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (campaign: Campaign) => void;
  onExportCampaign: (campaign: Campaign) => void;
}

export default function SimpleCampaignList({ 
  campaigns,
  onEditCampaign, 
  onViewCampaign, 
  onDeleteCampaign,
  onExportCampaign
}: SimpleCampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gradient-to-br from-rossel-100 to-rossel-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-rossel-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne créée</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Commencez par créer votre première campagne de planification média pour gérer vos budgets et emplacements publicitaires.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {campaigns.map((campaign, index) => (
        <div 
          key={campaign.id} 
          className="group p-6 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-rossel-50/30 transition-all duration-200 animate-slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rossel-700 transition-colors truncate">
                      {campaign.name}
                    </h3>
                    <StatusBadge status={campaign.status} />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {campaign.client}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    {format(campaign.startDate, 'dd MMM', { locale: fr })} - {format(campaign.endDate, 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Euro className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    Budget: <span className="font-semibold text-gray-900">{campaign.budget.toLocaleString('fr-BE')} €</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">
                    Dépensé: <span className="font-semibold text-gray-900">{campaign.totalCost.toLocaleString('fr-BE')} €</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {campaign.budget > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Utilisation du budget</span>
                    <span className="font-medium text-gray-700">
                      {((campaign.totalCost / campaign.budget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-rossel-500 to-rossel-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((campaign.totalCost / campaign.budget) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={() => onViewCampaign(campaign)}
                className="p-2 text-gray-400 hover:text-rossel-600 hover:bg-rossel-50 rounded-lg transition-all duration-200 group/btn"
                title="Voir les détails"
              >
                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => onExportCampaign(campaign)}
                className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-all duration-200 group/btn"
                title="Exporter"
              >
                <FileDown className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => onEditCampaign(campaign)}
                className="p-2 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-all duration-200 group/btn"
                title="Modifier"
              >
                <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => onDeleteCampaign(campaign)}
                className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all duration-200 group/btn"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}