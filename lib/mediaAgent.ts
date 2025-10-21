// Media Planning Agent - Rossel Group
// Advanced intelligence for campaign optimization

export interface BriefingData {
  clientName: string;
  budget: number;
  objective: 'notoriete' | 'trafic' | 'engagement';
  startMonth: string;
  duration: number; // weeks
  targetAge: '18-34' | '25-45' | '35-54' | '45-65';
  region: 'Bruxelles + Wallonie' | 'Bruxelles' | 'Wallonie' | 'National';
  sector: 'Retail' | 'Services' | 'Automobile' | 'Immobilier' | 'Food & Beverage' | 'Autre';
  videoNeed: 'production' | 'existant' | 'none';
  additionalInfo?: string;
}

export interface ChannelMetrics {
  budget: number;
  impressions: number;
  reach: number;
  cpm?: number;
  formats?: string[];
  insertions?: number;
  costPerInsertion?: number;
  format?: string;
  views?: number;
  production?: number;
  diffusion?: number;
  cpv?: number;
}

export interface MediaPlan {
  briefing: BriefingData;
  mix: {
    digital: number;
    print: number;
    video: number;
  };
  channels: {
    digital: ChannelMetrics;
    print: ChannelMetrics;
    video?: ChannelMetrics;
  };
  metrics: {
    totalReach: number;
    totalImpressions: number;
    frequency: number;
    blendedCpm: number;
    coverage: number;
  };
  recommendations: string[];
  generatedAt: string;
}

export class MediaPlanningAgent {
  // Rate cards 2024 - Rossel Group
  private static readonly RATES = {
    digital: {
      displayCpm: 6.0,
      videoCpv: 5.0,
      nativeCpm: 8.0,
      reachRate: 0.22, // % of impressions that are unique reach
    },
    print: {
      fullPage: 4800,
      halfPage: 2500,
      circulation: 45000,
      readersPerCopy: 1.9,
      reachPerInsertion: 85000,
    },
    video: {
      production15s: 1500,
      production30s: 2000,
      production60s: 3500,
      completionRate: 0.18,
    },
    population: {
      totalTarget: 3500000, // Wallonie + Brussels, 25-65 years
    },
  };

  // Mix strategies by objective
  private static readonly MIX_STRATEGIES = {
    notoriete: { digital: 0.60, print: 0.25, video: 0.15 },
    trafic: { digital: 0.70, print: 0.15, video: 0.15 },
    engagement: { digital: 0.50, print: 0.20, video: 0.30 },
  };

  static calculatePlan(briefing: BriefingData): MediaPlan {
    const { budget, objective, videoNeed } = briefing;
    
    // Get mix strategy
    const mix = { ...this.MIX_STRATEGIES[objective] };
    
    // Adjust if no video
    if (videoNeed === 'none') {
      const videoPct = mix.video;
      mix.digital += videoPct * 0.6;
      mix.print += videoPct * 0.4;
      mix.video = 0;
    }

    // Calculate budgets
    const digitalBudget = budget * mix.digital;
    const printBudget = budget * mix.print;
    const videoBudget = budget * mix.video;

    // Digital calculations
    const digitalImpressions = (digitalBudget / this.RATES.digital.displayCpm) * 1000;
    const digitalReach = digitalImpressions * this.RATES.digital.reachRate;

    // Print calculations
    const printInsertions = Math.floor(printBudget / this.RATES.print.halfPage);
    const printReach = printInsertions * this.RATES.print.reachPerInsertion;

    // Video calculations
    let videoViews = 0;
    let videoProduction = 0;
    let videoDiffusion = 0;

    if (videoBudget > 0) {
      if (videoNeed === 'production') {
        videoProduction = this.RATES.video.production30s;
      }
      videoDiffusion = videoBudget - videoProduction;
      videoViews = (videoDiffusion / this.RATES.digital.videoCpv) * 1000;
    }

    const videoReach = videoViews * this.RATES.video.completionRate;

    // Global metrics
    const totalReach = digitalReach + printReach + videoReach;
    const totalImpressions = digitalImpressions + (printInsertions * 45000) + videoViews;
    const frequency = totalReach > 0 ? totalImpressions / totalReach : 0;
    const blendedCpm = totalImpressions > 0 ? (budget / totalImpressions) * 1000 : 0;
    const coverage = (totalReach / this.RATES.population.totalTarget) * 100;

    // Build plan
    const plan: MediaPlan = {
      briefing,
      mix,
      channels: {
        digital: {
          budget: digitalBudget,
          impressions: digitalImpressions,
          reach: digitalReach,
          cpm: this.RATES.digital.displayCpm,
          formats: ['Leaderboard 728×90', 'MPU 300×250', 'Mobile Interstitiel'],
        },
        print: {
          budget: printBudget,
          impressions: printInsertions * this.RATES.print.circulation,
          insertions: printInsertions,
          reach: printReach,
          costPerInsertion: this.RATES.print.halfPage,
          format: 'Demi-page couleur Le Soir Weekend',
        },
      },
      metrics: {
        totalReach,
        totalImpressions,
        frequency,
        blendedCpm,
        coverage,
      },
      recommendations: this.generateRecommendations(briefing, {
        totalReach,
        totalImpressions,
        frequency,
        blendedCpm,
        coverage,
      }),
      generatedAt: new Date().toISOString(),
    };

    // Add video if applicable
    if (videoBudget > 0) {
      plan.channels.video = {
        budget: videoBudget,
        impressions: videoViews,
        production: videoProduction,
        diffusion: videoDiffusion,
        views: videoViews,
        reach: videoReach,
        cpv: this.RATES.digital.videoCpv,
        format: 'Pre-roll 30" Sudinfo.be',
      };
    }

    return plan;
  }

  private static generateRecommendations(
    briefing: BriefingData,
    metrics: MediaPlan['metrics']
  ): string[] {
    const recommendations: string[] = [];

    // Objective-based recommendations
    switch (briefing.objective) {
      case 'notoriete':
        recommendations.push('Mix optimisé pour maximiser la notoriété avec forte couverture print');
        break;
      case 'trafic':
        recommendations.push('Mix digital-first pour générer du trafic qualifié');
        break;
      case 'engagement':
        recommendations.push('Stratégie vidéo renforcée pour créer de l\'engagement');
        break;
    }

    // Frequency recommendations
    if (metrics.frequency < 2) {
      recommendations.push('Fréquence faible - considérer concentrer sur une période plus courte');
    } else if (metrics.frequency > 5) {
      recommendations.push('Fréquence élevée - risque de saturation, étaler davantage');
    } else {
      recommendations.push(`Fréquence ${metrics.frequency.toFixed(1)}× idéale pour mémorisation`);
    }

    // Coverage recommendations
    if (metrics.coverage > 70) {
      recommendations.push(`Excellente couverture ${metrics.coverage.toFixed(0)}% du marché ${briefing.region}`);
    } else if (metrics.coverage > 40) {
      recommendations.push(`Bonne couverture ${metrics.coverage.toFixed(0)}% du marché cible`);
    } else {
      recommendations.push('Couverture limitée - considérer augmenter le budget ou réduire la cible');
    }

    // Sector-specific recommendations
    recommendations.push(`Formats adaptés au secteur ${briefing.sector}`);

    // Budget efficiency
    if (metrics.blendedCpm < 8) {
      recommendations.push('CPM très compétitif pour le marché belge francophone');
    }

    return recommendations;
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-BE').format(Math.round(num));
  }

  static getObjectiveColor(objective: string): string {
    switch (objective) {
      case 'notoriete': return 'bg-blue-100 text-blue-800';
      case 'trafic': return 'bg-green-100 text-green-800';
      case 'engagement': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  static getObjectiveIcon(objective: string): string {
    switch (objective) {
      case 'notoriete': return '🎯';
      case 'trafic': return '📈';
      case 'engagement': return '💬';
      default: return '📊';
    }
  }

  static getPerformanceScore(plan: MediaPlan): {
    score: number;
    level: 'excellent' | 'good' | 'average' | 'poor';
    color: string;
  } {
    const { frequency, coverage, blendedCpm } = plan.metrics;
    
    let score = 0;
    
    // Frequency score (30%)
    if (frequency >= 2 && frequency <= 4) score += 30;
    else if (frequency >= 1.5 && frequency <= 5) score += 20;
    else score += 10;
    
    // Coverage score (40%)
    if (coverage >= 60) score += 40;
    else if (coverage >= 40) score += 30;
    else if (coverage >= 20) score += 20;
    else score += 10;
    
    // CPM efficiency score (30%)
    if (blendedCpm <= 6) score += 30;
    else if (blendedCpm <= 8) score += 25;
    else if (blendedCpm <= 10) score += 15;
    else score += 5;

    if (score >= 85) return { score, level: 'excellent', color: 'text-green-600' };
    if (score >= 70) return { score, level: 'good', color: 'text-blue-600' };
    if (score >= 50) return { score, level: 'average', color: 'text-yellow-600' };
    return { score, level: 'poor', color: 'text-red-600' };
  }
}