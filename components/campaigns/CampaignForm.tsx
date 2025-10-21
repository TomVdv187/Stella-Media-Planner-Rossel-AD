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
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {campaign ? 'Modifier la campagne' : 'Nouvelle campagne'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {campaign ? 'Mettez à jour les informations de votre campagne' : 'Créez une nouvelle campagne de planification média'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-error-500 rounded-full mr-3"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="input-label">
                <FileText className="w-4 h-4 inline mr-2 text-rossel-600" />
                Nom de la campagne
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Campagne Black Friday 2024"
                required
              />
            </div>

            <div>
              <label className="input-label">
                <User className="w-4 h-4 inline mr-2 text-rossel-600" />
                Client
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="input-field"
                placeholder="Ex: Carrefour Belgium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">
                  <Calendar className="w-4 h-4 inline mr-2 text-rossel-600" />
                  Date de début
                </label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date: Date) => setFormData({ ...formData, startDate: date })}
                  dateFormat="dd/MM/yyyy"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="input-label">
                  <Calendar className="w-4 h-4 inline mr-2 text-rossel-600" />
                  Date de fin
                </label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date: Date) => setFormData({ ...formData, endDate: date })}
                  dateFormat="dd/MM/yyyy"
                  minDate={formData.startDate}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">
                <Euro className="w-4 h-4 inline mr-2 text-rossel-600" />
                Budget (€)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                className="input-field"
                placeholder="10000"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="input-label">
                Statut de la campagne
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Campaign['status'] })}
                className="input-field"
              >
                <option value="draft">Brouillon</option>
                <option value="active">Active</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </form>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}