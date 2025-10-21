export interface Campaign {
  id: string;
  name: string;
  client: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  placements: Placement[];
  totalCost: number;
  totalImpressions: number;
}

export interface Placement {
  id: string;
  campaignId: string;
  publication: string;
  adType: string;
  position: string;
  size: string;
  dates: Date[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  notes?: string;
}

export interface RateCard {
  publication: string;
  adTypes: AdType[];
}

export interface AdType {
  name: string;
  positions: Position[];
}

export interface Position {
  name: string;
  sizes: AdSize[];
}

export interface AdSize {
  size: string;
  price: number;
  description?: string;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin: Date;
}

export interface ExportData {
  campaign: Campaign;
  placements: Placement[];
  client?: Client;
  exportDate: Date;
  exportedBy: string;
}