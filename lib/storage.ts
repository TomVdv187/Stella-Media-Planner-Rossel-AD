import { Campaign, Placement, Client } from '@/types';

// Local storage keys
const STORAGE_KEYS = {
  CAMPAIGNS: 'rossel_campaigns',
  PLACEMENTS: 'rossel_placements',
  CLIENTS: 'rossel_clients',
  USER_PREFERENCES: 'rossel_user_preferences',
};

// Helper function to safely parse JSON
function safeJSONParse<T>(str: string | null, defaultValue: T): T {
  if (!str) return defaultValue;
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

// Campaign storage functions
export function getCampaigns(): Campaign[] {
  const campaigns = safeJSONParse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS), []);
  return campaigns.map((campaign: any) => ({
    ...campaign,
    startDate: new Date(campaign.startDate),
    endDate: new Date(campaign.endDate),
    createdAt: new Date(campaign.createdAt),
    updatedAt: new Date(campaign.updatedAt),
  }));
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === campaign.id);
  
  if (index >= 0) {
    campaigns[index] = campaign;
  } else {
    campaigns.push(campaign);
  }
  
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  
  // Also delete related placements
  const placements = getPlacements().filter(p => p.campaignId !== id);
  localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(placements));
}

export function getCampaign(id: string): Campaign | null {
  const campaigns = getCampaigns();
  return campaigns.find(c => c.id === id) || null;
}

// Placement storage functions
export function getPlacements(campaignId?: string): Placement[] {
  const placements = safeJSONParse(localStorage.getItem(STORAGE_KEYS.PLACEMENTS), []);
  const parsedPlacements = placements.map((placement: any) => ({
    ...placement,
    dates: placement.dates.map((date: string) => new Date(date)),
  }));
  
  return campaignId 
    ? parsedPlacements.filter(p => p.campaignId === campaignId)
    : parsedPlacements;
}

export function savePlacement(placement: Placement): void {
  const placements = getPlacements();
  const index = placements.findIndex(p => p.id === placement.id);
  
  if (index >= 0) {
    placements[index] = placement;
  } else {
    placements.push(placement);
  }
  
  localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(placements));
  
  // Update campaign total cost
  updateCampaignTotals(placement.campaignId);
}

export function deletePlacement(id: string): void {
  const placements = getPlacements();
  const placement = placements.find(p => p.id === id);
  const filteredPlacements = placements.filter(p => p.id !== id);
  
  localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(filteredPlacements));
  
  // Update campaign total cost
  if (placement) {
    updateCampaignTotals(placement.campaignId);
  }
}

// Client storage functions
export function getClients(): Client[] {
  const clients = safeJSONParse(localStorage.getItem(STORAGE_KEYS.CLIENTS), []);
  return clients.map((client: any) => ({
    ...client,
    createdAt: new Date(client.createdAt),
    updatedAt: new Date(client.updatedAt),
  }));
}

export function saveClient(client: Client): void {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === client.id);
  
  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }
  
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

// Helper function to update campaign totals
function updateCampaignTotals(campaignId: string): void {
  const campaign = getCampaign(campaignId);
  if (!campaign) return;
  
  const placements = getPlacements(campaignId);
  const totalCost = placements.reduce((sum, p) => sum + p.finalPrice, 0);
  const totalImpressions = placements.reduce((sum, p) => sum + (p.quantity * p.dates.length), 0);
  
  const updatedCampaign = {
    ...campaign,
    totalCost,
    totalImpressions,
    updatedAt: new Date(),
  };
  
  saveCampaign(updatedCampaign);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export all data
export function exportAllData() {
  return {
    campaigns: getCampaigns(),
    placements: getPlacements(),
    clients: getClients(),
    exportDate: new Date(),
  };
}

// Import data
export function importData(data: any): void {
  if (data.campaigns) {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(data.campaigns));
  }
  if (data.placements) {
    localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(data.placements));
  }
  if (data.clients) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(data.clients));
  }
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.CAMPAIGNS);
  localStorage.removeItem(STORAGE_KEYS.PLACEMENTS);
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
}

// User preferences
export function getUserPreferences() {
  return safeJSONParse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES), {
    defaultClient: '',
    defaultBudget: 10000,
    autoSave: true,
  });
}

export function saveUserPreferences(preferences: any): void {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
}