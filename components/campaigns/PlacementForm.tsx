'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, Placement } from '@/types';
import { savePlacement, generateId } from '@/lib/storage';
import { 
  getAllPublications, 
  getAdTypes, 
  getPositions, 
  getSizes, 
  getPrice 
} from '@/data/rateCard';
import { Calendar, Euro, Save, X, Package } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';

interface PlacementFormProps {
  campaign: Campaign;
  placement?: Placement | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function PlacementForm({ campaign, placement, onSave, onCancel }: PlacementFormProps) {
  const [formData, setFormData] = useState({
    publication: '',
    adType: '',
    position: '',
    size: '',
    dates: [] as Date[],
    quantity: 1,
    discount: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const publications = getAllPublications();
  const adTypes = getAdTypes(formData.publication);
  const positions = getPositions(formData.publication, formData.adType);
  const sizes = getSizes(formData.publication, formData.adType, formData.position);
  const unitPrice = getPrice(formData.publication, formData.adType, formData.position, formData.size);
  const totalPrice = unitPrice * formData.quantity * selectedDates.length;
  const discountAmount = (totalPrice * formData.discount) / 100;
  const finalPrice = totalPrice - discountAmount;

  useEffect(() => {
    if (placement) {
      setFormData({
        publication: placement.publication,
        adType: placement.adType,
        position: placement.position,
        size: placement.size,
        dates: placement.dates,
        quantity: placement.quantity,
        discount: placement.discount,
        notes: placement.notes || '',
      });
      setSelectedDates(placement.dates);
    }
  }, [placement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const placementData: Placement = {
        id: placement?.id || generateId(),
        campaignId: campaign.id,
        ...formData,
        dates: selectedDates,
        unitPrice,
        totalPrice,
        finalPrice,
      };

      savePlacement(placementData);
      onSave();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingIndex = selectedDates.findIndex(d => format(d, 'yyyy-MM-dd') === dateStr);
    
    if (existingIndex >= 0) {
      setSelectedDates(selectedDates.filter((_, index) => index !== existingIndex));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      adType: '',
      position: '',
      size: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {placement ? 'Modifier l\'emplacement' : 'Nouvel emplacement'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication
              </label>
              <select
                value={formData.publication}
                onChange={(e) => {
                  setFormData({ ...formData, publication: e.target.value });
                  resetForm();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une publication</option>
                {publications.map(pub => (
                  <option key={pub} value={pub}>{pub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de publicité
              </label>
              <select
                value={formData.adType}
                onChange={(e) => {
                  setFormData({ ...formData, adType: e.target.value, position: '', size: '' });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.publication}
              >
                <option value="">Sélectionner un type</option>
                {adTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) => {
                  setFormData({ ...formData, position: e.target.value, size: '' });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.adType}
              >
                <option value="">Sélectionner une position</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taille
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.position}
              >
                <option value="">Sélectionner une taille</option>
                {sizes.map(size => (
                  <option key={size.size} value={size.size}>
                    {size.size} - {size.price.toLocaleString('fr-BE')} € {size.description && `(${size.description})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Quantité
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Euro className="w-4 h-4 inline mr-2" />
                Remise (%)
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Dates de diffusion
            </label>
            <div className="border border-gray-300 rounded-md p-4">
              <DatePicker
                selected={null}
                onChange={handleDateChange}
                highlightDates={selectedDates}
                minDate={campaign.startDate}
                maxDate={campaign.endDate}
                inline
                className="w-full"
              />
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Dates sélectionnées ({selectedDates.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {format(date, 'dd/MM/yyyy')}
                      <button
                        type="button"
                        onClick={() => handleDateChange(date)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Remarques particulières..."
            />
          </div>

          {unitPrice > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Récapitulatif des coûts</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Prix unitaire:</span>
                  <span>{unitPrice.toLocaleString('fr-BE')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantité × Dates:</span>
                  <span>{formData.quantity} × {selectedDates.length} = {formData.quantity * selectedDates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{totalPrice.toLocaleString('fr-BE')} €</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Remise ({formData.discount}%):</span>
                    <span>-{discountAmount.toLocaleString('fr-BE')} €</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-1">
                  <span>Total:</span>
                  <span>{finalPrice.toLocaleString('fr-BE')} €</span>
                </div>
              </div>
            </div>
          )}

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
              disabled={loading || selectedDates.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-lesoir-blue hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
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