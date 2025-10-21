'use client';

import React, { useState, useEffect } from 'react';
import { Campaign } from '@/types';
import { saveCampaign, generateId } from '@/lib/storage';
import { Calendar, Euro, User, FileText, Save, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface CampaignFormProps {
  campaign?: Campaign | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function CampaignForm({ campaign, onSave, onCancel }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: new Date(),
    endDate: new Date(),
    budget: 0,
    status: 'draft' as Campaign['status'],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        client: campaign.client,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        budget: campaign.budget,
        status: campaign.status,
      });
    }
  }, [campaign]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const campaignData: Campaign = {
        id: campaign?.id || generateId(),
        ...formData,
        createdBy: 'user',
        createdAt: campaign?.createdAt || new Date(),
        updatedAt: new Date(),
        placements: campaign?.placements || [],
        totalCost: campaign?.totalCost || 0,
        totalImpressions: campaign?.totalImpressions || 0,
      };

      saveCampaign(campaignData);
      onSave();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {campaign ? 'Modifier la campagne' : 'Nouvelle campagne'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Nom de la campagne
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Campagne Black Friday 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Client
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Carrefour Belgium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date de début
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date: Date) => setFormData({ ...formData, startDate: date })}
                dateFormat="dd/MM/yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date de fin
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date: Date) => setFormData({ ...formData, endDate: date })}
                dateFormat="dd/MM/yyyy"
                minDate={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Euro className="w-4 h-4 inline mr-2" />
              Budget (€)
            </label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Campaign['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="active">Active</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-rossel-blue hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}