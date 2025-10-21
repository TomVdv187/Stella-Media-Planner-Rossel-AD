'use client';

import React from 'react';
import { MediaPlan, MediaPlanningAgent } from '@/lib/mediaAgent';
import RecommendationsEngine from '@/components/ai/RecommendationsEngine';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Eye, 
  Zap,
  Award,
  BarChart3,
  PieChart,
  Monitor,
  Newspaper,
  Video,
  Lightbulb,
  Download,
  Sparkles
} from 'lucide-react';

interface MediaPlanViewerProps {
  plan: MediaPlan;
  onClose: () => void;
  onExport: () => void;
}

export default function MediaPlanViewer({ plan, onClose, onExport }: MediaPlanViewerProps) {
  const performance = MediaPlanningAgent.getPerformanceScore(plan);

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 animate-fade-in">
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-rossel-50 via-white to-accent-50 rounded-t-2xl border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
            >
              ×
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rossel-500 to-rossel-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Plan Média Intelligent</h1>
                    <p className="text-gray-600">{plan.briefing.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-rossel-600" />
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-semibold text-gray-900">
                      {MediaPlanningAgent.formatCurrency(plan.briefing.budget)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${MediaPlanningAgent.getObjectiveColor(plan.briefing.objective)}`}>
                      {MediaPlanningAgent.getObjectiveIcon(plan.briefing.objective)} {plan.briefing.objective.charAt(0).toUpperCase() + plan.briefing.objective.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{plan.briefing.duration} semaines</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-2 rounded-lg bg-white shadow-soft border ${performance.color}`}>
                  <Award className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Score: {performance.score}/100</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 capitalize">{performance.level}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Global Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">Reach Total</p>
                  <Users className="w-5 h-5 text-rossel-600" />
                </div>
                <p className="stat-number">
                  {MediaPlanningAgent.formatNumber(plan.metrics.totalReach)}
                </p>
                <p className="text-xs text-gray-500 mt-1">personnes</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">Impressions</p>
                  <Eye className="w-5 h-5 text-primary-600" />
                </div>
                <p className="stat-number">
                  {MediaPlanningAgent.formatNumber(plan.metrics.totalImpressions)}
                </p>
                <p className="text-xs text-gray-500 mt-1">vues totales</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">Fréquence</p>
                  <Zap className="w-5 h-5 text-accent-600" />
                </div>
                <p className="stat-number">
                  {plan.metrics.frequency.toFixed(1)}×
                </p>
                <p className="text-xs text-gray-500 mt-1">exposition moy.</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">CPM Blended</p>
                  <TrendingUp className="w-5 h-5 text-success-600" />
                </div>
                <p className="stat-number">
                  {MediaPlanningAgent.formatCurrency(plan.metrics.blendedCpm)}
                </p>
                <p className="text-xs text-gray-500 mt-1">coût/1000 imp.</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">Couverture</p>
                  <PieChart className="w-5 h-5 text-purple-600" />
                </div>
                <p className="stat-number">
                  {plan.metrics.coverage.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">du marché cible</p>
              </div>
            </div>

            {/* Mix Strategy */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Répartition Budgétaire Optimisée</h3>
                <p className="text-sm text-gray-600 mt-1">Mix média adapté à votre objectif {plan.briefing.objective}</p>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Digital */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Digital - Sudinfo.be</h4>
                        <p className="text-sm text-gray-600">{(plan.mix.digital * 100).toFixed(0)}% du budget</p>
                      </div>
                    </div>
                    <div className="space-y-3 pl-13">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget alloué:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.digital.budget)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Impressions:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatNumber(plan.channels.digital.impressions)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reach estimé:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatNumber(plan.channels.digital.reach)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CPM:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.digital.cpm || 0)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Formats:</p>
                        <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                          {plan.channels.digital.formats?.map((format, i) => (
                            <li key={i}>• {format}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Print */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rossel-100 to-rossel-200 rounded-lg flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-rossel-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Print - Le Soir</h4>
                        <p className="text-sm text-gray-600">{(plan.mix.print * 100).toFixed(0)}% du budget</p>
                      </div>
                    </div>
                    <div className="space-y-3 pl-13">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget alloué:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.print.budget)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Insertions:</span>
                        <span className="font-semibold">{plan.channels.print.insertions}× demi-pages</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reach estimé:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatNumber(plan.channels.print.reach)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coût/insertion:</span>
                        <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.print.costPerInsertion || 0)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium">Format:</p>
                        <p className="text-xs text-gray-600 mt-1">{plan.channels.print.format}</p>
                      </div>
                    </div>
                  </div>

                  {/* Video */}
                  {plan.channels.video && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Vidéo - LDV</h4>
                          <p className="text-sm text-gray-600">{(plan.mix.video * 100).toFixed(0)}% du budget</p>
                        </div>
                      </div>
                      <div className="space-y-3 pl-13">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget total:</span>
                          <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.video.budget)}</span>
                        </div>
                        {(plan.channels.video.production || 0) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Production:</span>
                            <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.video.production || 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Diffusion:</span>
                          <span className="font-semibold">{MediaPlanningAgent.formatCurrency(plan.channels.video.diffusion || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Vues estimées:</span>
                          <span className="font-semibold">{MediaPlanningAgent.formatNumber(plan.channels.video.views || 0)}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">Format:</p>
                          <p className="text-xs text-gray-600 mt-1">{plan.channels.video.format}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Intelligent Recommendations */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-accent-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Recommandations Intelligentes</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">Analyse IA avancée et optimisations personnalisées</p>
              </div>
              <div className="card-body">
                <RecommendationsEngine plan={plan} briefing={plan.briefing} />
              </div>
            </div>

            {/* Audience Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Cible & Contexte</h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tranche d'âge:</span>
                    <span className="font-semibold">{plan.briefing.targetAge} ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zone géographique:</span>
                    <span className="font-semibold">{plan.briefing.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Secteur:</span>
                    <span className="font-semibold">{plan.briefing.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Période:</span>
                    <span className="font-semibold">{plan.briefing.startMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-semibold">{plan.briefing.duration} semaines</span>
                  </div>
                  {plan.briefing.additionalInfo && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600 font-medium mb-2">Informations supplémentaires:</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{plan.briefing.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Prédite</h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Score global:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-rossel-500 to-success-500 rounded-full transition-all duration-500"
                            style={{ width: `${performance.score}%` }}
                          />
                        </div>
                        <span className={`font-semibold ${performance.color}`}>
                          {performance.score}/100
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficacité fréquence:</span>
                      <span className={`font-semibold ${plan.metrics.frequency >= 2 && plan.metrics.frequency <= 4 ? 'text-success-600' : 'text-warning-600'}`}>
                        {plan.metrics.frequency >= 2 && plan.metrics.frequency <= 4 ? 'Optimale' : 'À ajuster'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Niveau de couverture:</span>
                      <span className={`font-semibold ${plan.metrics.coverage >= 40 ? 'text-success-600' : 'text-warning-600'}`}>
                        {plan.metrics.coverage >= 60 ? 'Excellente' : plan.metrics.coverage >= 40 ? 'Bonne' : 'Limitée'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compétitivité CPM:</span>
                      <span className={`font-semibold ${plan.metrics.blendedCpm <= 8 ? 'text-success-600' : 'text-warning-600'}`}>
                        {plan.metrics.blendedCpm <= 8 ? 'Très bon' : 'Acceptable'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Niveau de performance:</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      performance.level === 'excellent' ? 'bg-success-100 text-success-800' :
                      performance.level === 'good' ? 'bg-primary-100 text-primary-800' :
                      performance.level === 'average' ? 'bg-warning-100 text-warning-800' :
                      'bg-error-100 text-error-800'
                    }`}>
                      {performance.level === 'excellent' ? '🏆 Excellent' :
                       performance.level === 'good' ? '👍 Bon' :
                       performance.level === 'average' ? '⚡ Moyen' : '⚠️ Faible'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <div className="text-sm text-gray-500">
              Généré le {new Date(plan.generatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="flex space-x-3">
              <button onClick={onClose} className="btn-secondary">
                Fermer
              </button>
              <button onClick={onExport} className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}