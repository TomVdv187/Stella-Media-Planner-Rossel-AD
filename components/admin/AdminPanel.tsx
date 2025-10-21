'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, User } from '@/types';
import { getCampaigns } from '@/lib/firestore';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Euro, Calendar, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminPanel() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'campaigns' | 'users' | 'analytics'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load all campaigns
      const allCampaigns = await getCampaigns();
      setCampaigns(allCampaigns);

      // Load users
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate() || new Date(),
      })) as User[];
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalCost = campaigns.reduce((sum, campaign) => sum + campaign.totalCost, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

  const campaignsByStatus = campaigns.reduce((acc, campaign) => {
    acc[campaign.status] = (acc[campaign.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(campaignsByStatus).map(([status, count]) => ({
    name: status === 'draft' ? 'Brouillon' : 
          status === 'active' ? 'Active' : 
          status === 'completed' ? 'Terminée' : 'Annulée',
    value: count
  }));

  const monthlyData = campaigns.reduce((acc, campaign) => {
    const month = format(campaign.createdAt, 'MMM yyyy', { locale: fr });
    if (!acc[month]) {
      acc[month] = { month, campaigns: 0, budget: 0, cost: 0 };
    }
    acc[month].campaigns += 1;
    acc[month].budget += campaign.budget;
    acc[month].cost += campaign.totalCost;
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(monthlyData).slice(-6);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lesoir-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panneau d'administration</h2>
          <p className="text-gray-600">Vue d'ensemble de l'activité de la plateforme</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'campaigns', name: 'Campagnes', icon: FileText },
            { id: 'users', name: 'Utilisateurs', icon: Users },
            { id: 'analytics', name: 'Analytiques', icon: BarChart },
          ].map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeView === id
                  ? 'border-lesoir-blue text-lesoir-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {name}
            </button>
          ))}
        </nav>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campagnes</p>
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Campagnes Actives</p>
                  <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Euro className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Budget Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBudget.toLocaleString('fr-BE')} €</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution mensuelle</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="campaigns" fill="#3B82F6" name="Campagnes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par statut</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'campaigns' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Toutes les campagnes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campagne
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créée le
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          campaign.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {campaign.status === 'active' ? 'Active' :
                           campaign.status === 'completed' ? 'Terminée' :
                           campaign.status === 'cancelled' ? 'Annulée' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.budget.toLocaleString('fr-BE')} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(campaign.createdAt, 'dd/MM/yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === 'users' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Utilisateurs de la plateforme</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Créé le
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.email}
                        {user.email === 'tom.vandevenne@rossel.be' && (
                          <span className="ml-2 bg-lesoir-gold text-lesoir-blue px-2 py-1 rounded-full text-xs font-medium">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(user.lastLogin, 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(user.createdAt, 'dd/MM/yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analyse financière</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString('fr-BE') + ' €' : value,
                  name === 'budget' ? 'Budget' : 'Coût'
                ]} />
                <Bar dataKey="budget" fill="#3B82F6" name="budget" />
                <Bar dataKey="cost" fill="#EF4444" name="cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Métriques clés</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux d'utilisation du budget:</span>
                  <span className="font-semibold">
                    {totalBudget > 0 ? ((totalCost / totalBudget) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget moyen par campagne:</span>
                  <span className="font-semibold">
                    {campaigns.length > 0 ? (totalBudget / campaigns.length).toLocaleString('fr-BE') : 0} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coût moyen par campagne:</span>
                  <span className="font-semibold">
                    {campaigns.length > 0 ? (totalCost / campaigns.length).toLocaleString('fr-BE') : 0} €
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <Download className="w-5 h-5 mr-3 text-gray-600" />
                  <span>Exporter toutes les données</span>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-gray-600" />
                  <span>Rapport mensuel</span>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center">
                  <Users className="w-5 h-5 mr-3 text-gray-600" />
                  <span>Gérer les utilisateurs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}