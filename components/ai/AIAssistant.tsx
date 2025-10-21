'use client';

import React, { useState } from 'react';
import { BriefingData, MediaPlanningAgent } from '@/lib/mediaAgent';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Target,
  Calendar,
  Users,
  MapPin,
  Building,
  Video,
  MessageSquare
} from 'lucide-react';

interface AIAssistantProps {
  onPlanGenerated: (briefing: BriefingData) => void;
  onClose: () => void;
}

const STEPS = [
  { id: 'client', title: 'Client', icon: Building },
  { id: 'budget', title: 'Budget', icon: Target },
  { id: 'objective', title: 'Objectif', icon: Sparkles },
  { id: 'timing', title: 'Timing', icon: Calendar },
  { id: 'audience', title: 'Audience', icon: Users },
  { id: 'location', title: 'Zone', icon: MapPin },
  { id: 'details', title: 'Détails', icon: MessageSquare },
];

export default function AIAssistant({ onPlanGenerated, onClose }: AIAssistantProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [briefing, setBriefing] = useState<Partial<BriefingData>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const updateBriefing = (updates: Partial<BriefingData>) => {
    setBriefing(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generatePlan();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generatePlan = async () => {
    setIsGenerating(true);
    // Simulate AI processing time
    setTimeout(() => {
      onPlanGenerated(briefing as BriefingData);
      setIsGenerating(false);
    }, 2000);
  };

  const isStepValid = () => {
    const step = STEPS[currentStep];
    switch (step.id) {
      case 'client': return briefing.clientName && briefing.clientName.trim().length > 0;
      case 'budget': return briefing.budget && briefing.budget > 0;
      case 'objective': return briefing.objective;
      case 'timing': return briefing.startMonth && briefing.duration && briefing.duration > 0;
      case 'audience': return briefing.targetAge;
      case 'location': return briefing.region;
      case 'details': return briefing.sector && briefing.videoNeed;
      default: return false;
    }
  };

  const renderStepContent = () => {
    const step = STEPS[currentStep];

    switch (step.id) {
      case 'client':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rossel-100 to-rossel-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-rossel-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Commençons par votre client
              </h3>
              <p className="text-gray-600">
                Pour qui créons-nous cette campagne média ?
              </p>
            </div>
            <div>
              <label className="input-label">Nom du client</label>
              <input
                type="text"
                value={briefing.clientName || ''}
                onChange={(e) => updateBriefing({ clientName: e.target.value })}
                className="input-field text-lg"
                placeholder="Ex: Carrefour Belgium, ING Bank..."
                autoFocus
              />
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quel est votre budget ?
              </h3>
              <p className="text-gray-600">
                Budget total disponible pour cette campagne
              </p>
            </div>
            <div>
              <label className="input-label">Budget (€)</label>
              <input
                type="number"
                value={briefing.budget || ''}
                onChange={(e) => updateBriefing({ budget: parseFloat(e.target.value) || 0 })}
                className="input-field text-lg text-center"
                placeholder="25000"
                min="1000"
                step="1000"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[10000, 25000, 50000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => updateBriefing({ budget: amount })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      briefing.budget === amount
                        ? 'bg-rossel-50 border-rossel-200 text-rossel-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {MediaPlanningAgent.formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'objective':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quel est votre objectif principal ?
              </h3>
              <p className="text-gray-600">
                Cela déterminera l'allocation optimale de votre budget
              </p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'notoriete', title: 'Notoriété', desc: 'Faire connaître votre marque', icon: '🎯' },
                { key: 'trafic', title: 'Trafic', desc: 'Générer des visites et des ventes', icon: '📈' },
                { key: 'engagement', title: 'Engagement', desc: 'Créer de l\'interaction', icon: '💬' },
              ].map(({ key, title, desc, icon }) => (
                <button
                  key={key}
                  onClick={() => updateBriefing({ objective: key as any })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    briefing.objective === key
                      ? 'bg-rossel-50 border-rossel-200 ring-2 ring-rossel-500/20'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{title}</div>
                      <div className="text-sm text-gray-600">{desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'timing':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quand souhaitez-vous lancer ?
              </h3>
              <p className="text-gray-600">
                Période et durée de votre campagne
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="input-label">Mois de départ</label>
                <select
                  value={briefing.startMonth || ''}
                  onChange={(e) => updateBriefing({ startMonth: e.target.value })}
                  className="input-field"
                >
                  <option value="">Sélectionner...</option>
                  {[
                    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                  ].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Durée (semaines)</label>
                <input
                  type="number"
                  value={briefing.duration || ''}
                  onChange={(e) => updateBriefing({ duration: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="8"
                  min="1"
                  max="52"
                />
                <div className="mt-2 flex space-x-2">
                  {[4, 8, 12].map(weeks => (
                    <button
                      key={weeks}
                      onClick={() => updateBriefing({ duration: weeks })}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        briefing.duration === weeks
                          ? 'bg-rossel-100 text-rossel-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {weeks}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quelle est votre cible ?
              </h3>
              <p className="text-gray-600">
                Définissons votre audience principale
              </p>
            </div>
            <div>
              <label className="input-label">Tranche d'âge</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: '18-34', label: '18-34 ans', desc: 'Jeunes adultes' },
                  { key: '25-45', label: '25-45 ans', desc: 'Adultes actifs' },
                  { key: '35-54', label: '35-54 ans', desc: 'Cadres seniors' },
                  { key: '45-65', label: '45-65 ans', desc: 'Seniors actifs' },
                ].map(({ key, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => updateBriefing({ targetAge: key as any })}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      briefing.targetAge === key
                        ? 'bg-rossel-50 border-rossel-200 text-rossel-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Zone géographique
              </h3>
              <p className="text-gray-600">
                Où souhaitez-vous diffuser votre campagne ?
              </p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'Bruxelles + Wallonie', label: 'Bruxelles + Wallonie', desc: 'Marché principal Rossel' },
                { key: 'Bruxelles', label: 'Bruxelles uniquement', desc: 'Zone urbaine ciblée' },
                { key: 'Wallonie', label: 'Wallonie uniquement', desc: 'Provinces wallonnes' },
                { key: 'National', label: 'National', desc: 'Belgique entière' },
              ].map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => updateBriefing({ region: key as any })}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    briefing.region === key
                      ? 'bg-rossel-50 border-rossel-200 ring-2 ring-rossel-500/20'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{label}</div>
                  <div className="text-sm text-gray-600">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Derniers détails
              </h3>
              <p className="text-gray-600">
                Secteur d'activité et besoins vidéo
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="input-label">Secteur d'activité</label>
                <select
                  value={briefing.sector || ''}
                  onChange={(e) => updateBriefing({ sector: e.target.value as any })}
                  className="input-field"
                >
                  <option value="">Sélectionner...</option>
                  {['Retail', 'Services', 'Automobile', 'Immobilier', 'Food & Beverage', 'Autre'].map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Besoin vidéo</label>
                <div className="space-y-2">
                  {[
                    { key: 'production', label: 'Production nécessaire', desc: 'Nous devons créer le contenu' },
                    { key: 'existant', label: 'Contenu existant', desc: 'Vous avez déjà les créations' },
                    { key: 'none', label: 'Pas de vidéo', desc: 'Focus print et display' },
                  ].map(({ key, label, desc }) => (
                    <button
                      key={key}
                      onClick={() => updateBriefing({ videoNeed: key as any })}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        briefing.videoNeed === key
                          ? 'bg-rossel-50 border-rossel-200 text-rossel-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="input-label">Informations supplémentaires (optionnel)</label>
                <textarea
                  value={briefing.additionalInfo || ''}
                  onChange={(e) => updateBriefing({ additionalInfo: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Contraintes particulières, contexte, objectifs spécifiques..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rossel-500 to-rossel-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Assistant IA</h2>
              <p className="text-sm text-gray-600">Création guidée de campagne média</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-rossel-500 to-rossel-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isGenerating ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-rossel-100 to-rossel-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-rossel-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Génération de votre plan média...
              </h3>
              <p className="text-gray-600">
                L'IA analyse vos données et optimise votre stratégie
              </p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Footer */}
        {!isGenerating && (
          <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`btn-secondary ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </button>

            <div className="flex items-center space-x-2">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      index === currentStep
                        ? 'bg-rossel-500 text-white'
                        : index < currentStep
                        ? 'bg-success-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`btn-primary ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer le plan
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}