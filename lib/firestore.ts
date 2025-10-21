import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Campaign, Placement, Client, User } from '@/types';

export const COLLECTIONS = {
  CAMPAIGNS: 'campaigns',
  PLACEMENTS: 'placements',
  CLIENTS: 'clients',
  USERS: 'users',
  RATE_CARDS: 'rateCards',
};

export const campaignConverter = {
  toFirestore: (campaign: Omit<Campaign, 'id'>) => ({
    ...campaign,
    startDate: Timestamp.fromDate(campaign.startDate),
    endDate: Timestamp.fromDate(campaign.endDate),
    createdAt: Timestamp.fromDate(campaign.createdAt),
    updatedAt: Timestamp.fromDate(campaign.updatedAt),
  }),
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Campaign;
  },
};

export const placementConverter = {
  toFirestore: (placement: Omit<Placement, 'id'>) => ({
    ...placement,
    dates: placement.dates.map(date => Timestamp.fromDate(date)),
  }),
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      dates: data.dates.map((timestamp: Timestamp) => timestamp.toDate()),
    } as Placement;
  },
};

export const clientConverter = {
  toFirestore: (client: Omit<Client, 'id'>) => ({
    ...client,
    createdAt: Timestamp.fromDate(client.createdAt),
    updatedAt: Timestamp.fromDate(client.updatedAt),
  }),
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Client;
  },
};

export const userConverter = {
  toFirestore: (user: Omit<User, 'id'>) => ({
    ...user,
    createdAt: Timestamp.fromDate(user.createdAt),
    lastLogin: Timestamp.fromDate(user.lastLogin),
  }),
  fromFirestore: (snapshot: any) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      lastLogin: data.lastLogin.toDate(),
    } as User;
  },
};

export async function getCampaigns(userId?: string): Promise<Campaign[]> {
  const campaignsRef = collection(db, COLLECTIONS.CAMPAIGNS).withConverter(campaignConverter);
  let q = query(campaignsRef, orderBy('createdAt', 'desc'));
  
  if (userId) {
    q = query(campaignsRef, where('createdBy', '==', userId), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const docRef = doc(db, COLLECTIONS.CAMPAIGNS, id).withConverter(campaignConverter);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function createCampaign(campaign: Omit<Campaign, 'id'>): Promise<string> {
  const docRef = await addDoc(
    collection(db, COLLECTIONS.CAMPAIGNS).withConverter(campaignConverter),
    campaign
  );
  return docRef.id;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CAMPAIGNS, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCampaign(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.CAMPAIGNS, id));
}

export async function getPlacements(campaignId: string): Promise<Placement[]> {
  const placementsRef = collection(db, COLLECTIONS.PLACEMENTS).withConverter(placementConverter);
  const q = query(placementsRef, where('campaignId', '==', campaignId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function createPlacement(placement: Omit<Placement, 'id'>): Promise<string> {
  const docRef = await addDoc(
    collection(db, COLLECTIONS.PLACEMENTS).withConverter(placementConverter),
    placement
  );
  return docRef.id;
}

export async function updatePlacement(id: string, updates: Partial<Placement>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PLACEMENTS, id);
  await updateDoc(docRef, updates);
}

export async function deletePlacement(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PLACEMENTS, id));
}

export async function getClients(): Promise<Client[]> {
  const clientsRef = collection(db, COLLECTIONS.CLIENTS).withConverter(clientConverter);
  const q = query(clientsRef, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function createClient(client: Omit<Client, 'id'>): Promise<string> {
  const docRef = await addDoc(
    collection(db, COLLECTIONS.CLIENTS).withConverter(clientConverter),
    client
  );
  return docRef.id;
}

export async function createOrUpdateUser(userData: Omit<User, 'id'>): Promise<void> {
  const usersRef = collection(db, COLLECTIONS.USERS);
  const q = query(usersRef, where('email', '==', userData.email));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    await addDoc(usersRef.withConverter(userConverter), userData);
  } else {
    const userDoc = snapshot.docs[0];
    await updateDoc(userDoc.ref, {
      lastLogin: Timestamp.fromDate(userData.lastLogin),
    });
  }
}