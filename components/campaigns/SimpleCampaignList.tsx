'use client';

import React from 'react';
import { Campaign } from '@/types';
import { Calendar, Euro, Eye, Edit, Trash2, FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Brouillon';
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune campagne</h3>
        <p className="text-gray-600">Créez votre première campagne pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {campaign.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <p className="truncate">{campaign.client}</p>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {format(campaign.startDate, 'dd MMM', { locale: fr })} - {format(campaign.endDate, 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Euro className="w-4 h-4 mr-1" />
                      <span>{campaign.budget.toLocaleString('fr-BE')} €</span>
                    </div>
                    <div className="text-xs">
                      Coût total: {campaign.totalCost.toLocaleString('fr-BE')} €
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewCampaign(campaign)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onExportCampaign(campaign)}
                    className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                    title="Exporter"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditCampaign(campaign)}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCampaign(campaign)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}