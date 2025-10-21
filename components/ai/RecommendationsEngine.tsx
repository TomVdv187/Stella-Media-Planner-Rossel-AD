'use client';

import React from 'react';
import { BriefingData, MediaPlan } from '@/lib/mediaAgent';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  Calendar,
  DollarSign,
  Users,
  BarChart3
} from 'lucide-react';

interface RecommendationsEngineProps {
  plan: MediaPlan;
  briefing: BriefingData;
}

interface Recommendation {
  id: string;
  type: 'optimization' | 'warning' | 'success' | 'insight';
  category: 'budget' | 'timing' | 'targeting' | 'performance' | 'strategy';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}

export default function RecommendationsEngine({ plan, briefing }: RecommendationsEngineProps) {
  const generateIntelligentRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const { metrics } = plan;
    
    // Budget Optimization Recommendations
    if (metrics.blendedCpm > 10) {
      recommendations.push({
        id: 'cpm-high',
        type: 'warning',
        category: 'budget',
        title: 'CPM élevé détecté',
        description: `Votre CPM blended de ${metrics.blendedCpm.toFixed(2)}€ est supérieur à la moyenne du marché (8€). Considérez réajuster le mix média.`,
        impact: 'high',
        actionable: true,
        action: 'Augmenter la part digital ou réduire les formats premium'
      });
    } else if (metrics.blendedCpm < 6) {
      recommendations.push({
        id: 'cpm-optimal',
        type: 'success',
        category: 'budget',
        title: 'CPM très compétitif',
        description: `Excellent CPM de ${metrics.blendedCpm.toFixed(2)}€, vous optimisez bien votre budget.`,
        impact: 'medium',
        actionable: false
      });
    }

    // Frequency Recommendations
    if (metrics.frequency < 1.5) {
      recommendations.push({
        id: 'frequency-low',
        type: 'warning',
        category: 'performance',
        title: 'Fréquence trop faible',
        description: `Fréquence de ${metrics.frequency.toFixed(1)}× insuffisante pour la mémorisation. Minimum recommandé: 2×.`,
        impact: 'high',
        actionable: true,
        action: 'Réduire la durée de campagne ou concentrer sur moins de supports'
      });
    } else if (metrics.frequency > 6) {
      recommendations.push({
        id: 'frequency-high',
        type: 'warning',
        category: 'performance',
        title: 'Risque de saturation',
        description: `Fréquence de ${metrics.frequency.toFixed(1)}× élevée. Risque de lassitude publicitaire.`,
        impact: 'medium',
        actionable: true,
        action: 'Étaler sur une période plus longue ou élargir la cible'
      });
    } else {
      recommendations.push({
        id: 'frequency-optimal',
        type: 'success',
        category: 'performance',
        title: 'Fréquence optimale',
        description: `Fréquence de ${metrics.frequency.toFixed(1)}× idéale pour la mémorisation sans saturation.`,
        impact: 'medium',
        actionable: false
      });
    }

    // Coverage Analysis
    if (metrics.coverage < 20) {
      recommendations.push({
        id: 'coverage-low',
        type: 'warning',
        category: 'targeting',
        title: 'Couverture limitée',
        description: `Seulement ${metrics.coverage.toFixed(1)}% de couverture. Impact potentiel limité.`,
        impact: 'high',
        actionable: true,
        action: 'Augmenter le budget ou réviser la stratégie de ciblage'
      });
    } else if (metrics.coverage > 80) {
      recommendations.push({
        id: 'coverage-excellent',
        type: 'success',
        category: 'targeting',
        title: 'Excellente couverture marché',
        description: `Couverture de ${metrics.coverage.toFixed(1)}% très forte sur votre marché ${briefing.region}.`,
        impact: 'high',
        actionable: false
      });
    }

    // Objective-specific recommendations
    switch (briefing.objective) {
      case 'notoriete':
        if (plan.mix.print < 0.2) {
          recommendations.push({
            id: 'notoriete-print',
            type: 'optimization',
            category: 'strategy',
            title: 'Renforcer le print pour la notoriété',
            description: 'Pour un objectif notoriété, une part print plus importante (25%+) renforce la crédibilité.',
            impact: 'medium',
            actionable: true,
            action: 'Réallouer 5-10% du budget digital vers le print'
          });
        }
        break;
        
      case 'trafic':
        if (plan.mix.digital < 0.6) {
          recommendations.push({
            id: 'trafic-digital',
            type: 'optimization',
            category: 'strategy',
            title: 'Privilégier le digital pour le trafic',
            description: 'Pour générer du trafic, concentrez au moins 70% sur le digital.',
            impact: 'high',
            actionable: true,
            action: 'Augmenter la part digital avec des formats cliquables'
          });
        }
        break;
        
      case 'engagement':
        if (plan.mix.video < 0.2) {
          recommendations.push({
            id: 'engagement-video',
            type: 'optimization',
            category: 'strategy',
            title: 'Renforcer la vidéo pour l\'engagement',
            description: 'La vidéo génère 3× plus d\'engagement que les formats statiques.',
            impact: 'high',
            actionable: true,
            action: 'Allouer au moins 25% du budget à la vidéo'
          });
        }
        break;
    }

    // Seasonal and timing recommendations
    const currentMonth = new Date().getMonth();
    const startMonthIndex = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ].indexOf(briefing.startMonth);

    if (startMonthIndex === 7 || startMonthIndex === 11) { // Août ou Décembre
      recommendations.push({
        id: 'seasonal-timing',
        type: 'insight',
        category: 'timing',
        title: 'Période saisonnière identifiée',
        description: startMonthIndex === 7 ? 
          'Août: audience réduite, mais moins de concurrence publicitaire.' :
          'Décembre: forte concurrence, considérez commencer mi-novembre.',
        impact: 'medium',
        actionable: true,
        action: startMonthIndex === 7 ? 
          'Profiter des tarifs réduits et CPM plus bas' :
          'Anticiper le lancement pour éviter la saturation'
      });
    }

    // Duration-based recommendations
    if (briefing.duration < 4) {
      recommendations.push({
        id: 'duration-short',
        type: 'insight',
        category: 'timing',
        title: 'Campagne courte détectée',
        description: `${briefing.duration} semaines permettent un impact rapide mais limité pour la mémorisation.`,
        impact: 'medium',
        actionable: true,
        action: 'Concentrer sur les formats à fort impact (vidéo, print premium)'
      });
    } else if (briefing.duration > 12) {
      recommendations.push({
        id: 'duration-long',
        type: 'insight',
        category: 'timing',
        title: 'Campagne longue durée',
        description: `${briefing.duration} semaines permettent une montée en puissance progressive.`,
        impact: 'low',
        actionable: true,
        action: 'Planifier des vagues d\'intensité variable'
      });
    }

    // Target-specific insights
    if (briefing.targetAge === '18-34' && plan.mix.digital < 0.7) {
      recommendations.push({
        id: 'young-target-digital',
        type: 'optimization',
        category: 'targeting',
        title: 'Cible jeune: renforcer le digital',
        description: 'Les 18-34 ans consomment 80% de leur média en digital.',
        impact: 'high',
        actionable: true,
        action: 'Allouer au moins 70% au digital avec focus mobile'
      });
    }

    if (briefing.targetAge === '45-65' && plan.mix.print < 0.3) {
      recommendations.push({
        id: 'senior-target-print',
        type: 'optimization',
        category: 'targeting',
        title: 'Cible senior: valoriser le print',
        description: 'Les 45-65 ans ont une forte affinité avec la presse (crédibilité +40%).',
        impact: 'medium',
        actionable: true,
        action: 'Maintenir au moins 30% en print pour cette cible'
      });
    }

    // Competitive insights
    if (briefing.sector === 'Retail' && briefing.startMonth === 'Novembre') {
      recommendations.push({
        id: 'retail-blackfriday',
        type: 'insight',
        category: 'strategy',
        title: 'Période Black Friday',
        description: 'Forte concurrence retail en novembre. CPM digital +30% attendu.',
        impact: 'high',
        actionable: true,
        action: 'Réserver les espaces en avance ou reporter sur début décembre'
      });
    }

    return recommendations;
  };

  const recommendations = generateIntelligentRecommendations();

  const getRecommendationIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'insight': return Lightbulb;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'optimization': return 'from-blue-500 to-blue-600';
      case 'warning': return 'from-orange-500 to-orange-600';
      case 'success': return 'from-green-500 to-green-600';
      case 'insight': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getImpactBadge = (impact: Recommendation['impact']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[impact]}`}>
        Impact {impact}
      </span>
    );
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'budget': return DollarSign;
      case 'timing': return Calendar;
      case 'targeting': return Users;
      case 'performance': return BarChart3;
      case 'strategy': return Target;
      default: return Lightbulb;
    }
  };

  const groupedRecommendations = recommendations.reduce((groups, rec) => {
    if (!groups[rec.category]) groups[rec.category] = [];
    groups[rec.category].push(rec);
    return groups;
  }, {} as Record<string, Recommendation[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Intelligence Artificielle</h3>
          <p className="text-sm text-gray-600">{recommendations.length} recommandations personnalisées</p>
        </div>
      </div>

      {Object.entries(groupedRecommendations).map(([category, recs]) => {
        const CategoryIcon = getCategoryIcon(category as Recommendation['category']);
        const categoryNames = {
          budget: 'Budget & Coûts',
          timing: 'Timing & Saisonnalité',
          targeting: 'Ciblage & Audience',
          performance: 'Performance & Métriques',
          strategy: 'Stratégie & Mix'
        };

        return (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <CategoryIcon className="w-4 h-4" />
              <span>{categoryNames[category as keyof typeof categoryNames]}</span>
            </div>
            
            <div className="space-y-3">
              {recs.map((rec) => {
                const Icon = getRecommendationIcon(rec.type);
                const gradientColor = getRecommendationColor(rec.type);
                
                return (
                  <div key={rec.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${gradientColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{rec.title}</h4>
                          {getImpactBadge(rec.impact)}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {rec.description}
                        </p>
                        
                        {rec.actionable && rec.action && (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                              <Target className="w-3 h-3" />
                              <span className="font-medium">Action recommandée:</span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium">{rec.action}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}