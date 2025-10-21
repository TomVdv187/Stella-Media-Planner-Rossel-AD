'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, Placement } from '@/types';
import { getPlacements } from '@/lib/storage';
import { Calendar, Euro, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PlacementForm from './PlacementForm';

interface CampaignDetailsProps {
  campaign: Campaign;
  onClose: () => void;
  onEdit: () => void;
  onRefresh: () => void;
}

export default function CampaignDetails({ campaign, onClose, onEdit, onRefresh }: CampaignDetailsProps) {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlacementForm, setShowPlacementForm] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);

  useEffect(() => {
    loadPlacements();
  }, [campaign.id]);

  const loadPlacements = async () => {
    try {
      const placementList = await getPlacements(campaign.id);
      setPlacements(placementList);
    } catch (error) {
      console.error('Error loading placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlacementSaved = () => {
    setShowPlacementForm(false);
    setEditingPlacement(null);
    loadPlacements();
    onRefresh();
  };

  const totalCost = placements.reduce((sum, placement) => sum + placement.finalPrice, 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
            <p className="text-gray-600">{campaign.client}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="bg-rossel-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">Période</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {format(campaign.startDate, 'dd MMM', { locale: fr })} - {format(campaign.endDate, 'dd MMM yyyy', { locale: fr })}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Euro className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-600">Budget</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {campaign.budget.toLocaleString('fr-BE')} €
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Euro className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-600">Coût total</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {totalCost.toLocaleString('fr-BE')} €
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-600">Emplacements</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {placements.length}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Emplacements publicitaires</h3>
          <button
            onClick={() => setShowPlacementForm(true)}
            className="bg-rossel-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un emplacement</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lesoir-blue"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {placements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun emplacement ajouté</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type / Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taille
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {placements.map((placement) => (
                    <tr key={placement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {placement.publication}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {placement.adType} / {placement.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {placement.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {placement.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {placement.finalPrice.toLocaleString('fr-BE')} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingPlacement(placement)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {(showPlacementForm || editingPlacement) && (
          <PlacementForm
            campaign={campaign}
            placement={editingPlacement}
            onSave={handlePlacementSaved}
            onCancel={() => {
              setShowPlacementForm(false);
              setEditingPlacement(null);
            }}
          />
        )}
      </div>
    </div>
  );
}