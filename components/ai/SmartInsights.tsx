'use client';

import React from 'react';
import { Campaign } from '@/types';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar,
  Users,
  DollarSign,
  Zap,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface SmartInsightsProps {
  campaigns: Campaign[];
}

interface Insight {
  id: string;
  type: 'trend' | 'alert' | 'opportunity' | 'performance';
  title: string;
  description: string;
  value?: string;
  change?: number;
  actionable: boolean;
}

export default function SmartInsights({ campaigns }: SmartInsightsProps) {
  const generateSmartInsights = (): Insight[] => {
    const insights: Insight[] = [];
    
    if (campaigns.length === 0) {
      return [{
        id: 'empty',
        type: 'opportunity',
        title: 'Prêt à commencer',
        description: 'Utilisez l\'assistant IA pour créer votre première campagne optimisée.',
        actionable: true
      }];
    }

    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.totalCost, 0);
    const avgBudgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Budget efficiency insights
    if (avgBudgetUtilization > 85) {
      insights.push({
        id: 'budget-high',
        type: 'alert',
        title: 'Utilisation budget élevée',
        description: 'Vos campagnes utilisent beaucoup de budget. Surveillez les performances.',
        value: `${avgBudgetUtilization.toFixed(0)}%`,
        actionable: true
      });
    } else if (avgBudgetUtilization < 40) {
      insights.push({
        id: 'budget-low',
        type: 'opportunity',
        title: 'Potentiel d\'optimisation',
        description: 'Budget sous-utilisé. Opportunité d\'augmenter l\'impact.',
        value: `${avgBudgetUtilization.toFixed(0)}%`,
        actionable: true
      });
    }

    // Active campaigns insights
    if (activeCampaigns.length === 0 && campaigns.length > 0) {
      insights.push({
        id: 'no-active',
        type: 'opportunity',
        title: 'Aucune campagne active',
        description: 'Relancez vos campagnes pour maintenir votre présence média.',
        actionable: true
      });
    } else if (activeCampaigns.length > 5) {
      insights.push({
        id: 'many-active',
        type: 'alert',
        title: 'Nombreuses campagnes actives',
        description: 'Surveillez la cohérence des messages et évitez la cannibalisation.',
        value: `${activeCampaigns.length} actives`,
        actionable: true
      });
    }

    // Performance trends
    const recentCampaigns = campaigns
      .filter(c => new Date(c.createdAt).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000))
      .length;
    
    if (recentCampaigns > 3) {
      insights.push({
        id: 'high-activity',
        type: 'trend',
        title: 'Activité intense détectée',
        description: 'Forte création de campagnes ce mois. Excellente dynamique !',
        value: `+${recentCampaigns} ce mois`,
        change: 25,
        actionable: false
      });
    }

    // Seasonal insights
    const currentMonth = new Date().getMonth();
    const seasonalMonths = [8, 9, 10, 11]; // Sept-Déc
    
    if (seasonalMonths.includes(currentMonth)) {
      insights.push({
        id: 'seasonal-opportunity',
        type: 'opportunity',
        title: 'Période saisonnière forte',
        description: 'Q4 approach - période idéale pour intensifier les campagnes.',
        actionable: true
      });
    }

    // Client diversity insights
    const uniqueClients = new Set(campaigns.map(c => c.client)).size;
    if (uniqueClients === 1 && campaigns.length > 1) {
      insights.push({
        id: 'single-client',
        type: 'opportunity',
        title: 'Diversification client',
        description: 'Opportunité d\'élargir votre portefeuille client.',
        actionable: true
      });
    } else if (uniqueClients > 10) {
      insights.push({
        id: 'diverse-clients',
        type: 'performance',
        title: 'Portefeuille diversifié',
        description: 'Excellent équilibre avec de nombreux clients actifs.',
        value: `${uniqueClients} clients`,
        actionable: false
      });
    }

    // Budget size insights
    const avgBudget = totalBudget / campaigns.length;
    if (avgBudget > 50000) {
      insights.push({
        id: 'premium-campaigns',
        type: 'trend',
        title: 'Campagnes premium',
        description: 'Budget moyen élevé. Maximisez l\'impact avec des stratégies 360°.',
        value: `${(avgBudget / 1000).toFixed(0)}k€ moy.`,
        actionable: true
      });
    }

    // Add default insights if none generated
    if (insights.length === 0) {
      insights.push({
        id: 'all-good',
        type: 'performance',
        title: 'Gestion optimale',
        description: 'Vos campagnes sont bien équilibrées. Continuez ainsi !',
        actionable: false
      });
    }

    return insights.slice(0, 4); // Limit to 4 insights
  };

  const insights = generateSmartInsights();

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'alert': return AlertTriangle;
      case 'opportunity': return Target;
      case 'performance': return CheckCircle;
      default: return Brain;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'trend': return {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-200',
        bgLight: 'bg-blue-50'
      };
      case 'alert': return {
        bg: 'from-orange-500 to-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-200',
        bgLight: 'bg-orange-50'
      };
      case 'opportunity': return {
        bg: 'from-green-500 to-green-600',
        text: 'text-green-600',
        border: 'border-green-200',
        bgLight: 'bg-green-50'
      };
      case 'performance': return {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-200',
        bgLight: 'bg-purple-50'
      };
      default: return {
        bg: 'from-gray-500 to-gray-600',
        text: 'text-gray-600',
        border: 'border-gray-200',
        bgLight: 'bg-gray-50'
      };
    }
  };

  if (insights.length === 0) return null;

  return (
    <div className="card bg-gradient-to-br from-gray-50 to-white border-gray-100 animate-fade-in">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Insights Intelligents</h3>
            <p className="text-sm text-gray-600">Analyse automatisée de vos performances</p>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colors = getInsightColor(insight.type);
            
            return (
              <div 
                key={insight.id}
                className={`relative p-4 rounded-xl border ${colors.border} ${colors.bgLight} hover:shadow-md transition-all duration-200 group`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {insight.title}
                      </h4>
                      {insight.value && (
                        <span className={`text-xs font-bold ${colors.text} flex items-center`}>
                          {insight.change && insight.change > 0 && (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          )}
                          {insight.value}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <div className="flex items-center mt-2 text-xs">
                        <Zap className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-yellow-600 font-medium">Action possible</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {insight.actionable && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-yellow-400/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <BarChart3 className="w-3 h-3" />
              <span>Mis à jour automatiquement</span>
            </div>
            <span>Basé sur {campaigns.length} campagne{campaigns.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
}