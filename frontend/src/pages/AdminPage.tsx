import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity } from 'lucide-react';
import heroApi from '../api/heroApi';
import authApi from '../api/authApi';

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalHeroes: 0,
    totalUsers: 0,
    recentActivity: [] as Array<{
      id: number;
      action: string;
      user: string;
      date: string;
    }>,
  });

  useEffect(() => {
    // Fetch admin data from the API (heroes count). Keep mock fallbacks.
    const fetchStats = async () => {
      try {
        const heroes = await heroApi.getHeroes();
        setStats((prev) => ({
          ...prev,
          totalHeroes: Array.isArray(heroes) ? heroes.length : prev.totalHeroes,
        }));
        // fetch users count
        try {
          const usersCount = await authApi.getUsersCount();
          setStats((prev) => ({ ...prev, totalUsers: usersCount }));
        } catch (e) {
          // ignore users count error — keep fallback
          // eslint-disable-next-line no-console
          console.error('Failed to fetch users count', e);
        }
      } catch (err) {
        // If API fails, keep a reasonable fallback and log to console
        // Fallback remains the mock values defined below
        // eslint-disable-next-line no-console
        console.error('Failed to fetch heroes for admin stats', err);
        setStats((prev) => ({
          ...prev,
          totalHeroes: prev.totalHeroes || 563,
        }));
      }
    };

    // initial mock data for other stats and as fallback until API responds
    setStats((prev) => ({
      ...prev,
      totalHeroes: prev.totalHeroes || 10,
      totalUsers: 2,
      recentActivity: [
        { id: 1, action: 'Nouveau héros ajouté', user: 'admin', date: '2024-01-15 10:30' },
        { id: 2, action: 'Héros modifié', user: 'editor', date: '2024-01-15 09:15' },
        { id: 3, action: 'Utilisateur créé', user: 'admin', date: '2024-01-14 16:45' },
      ],
    }));

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panneau d'Administration
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez les utilisateurs et surveillez l'activité du système
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Héros</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalHeroes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Utilisateurs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activité Récente</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.recentActivity.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Journal d'Activité</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentActivity.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                Aucune activité récente
              </div>
            ) : (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">par {activity.user}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Actions d'Administration</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                <Users className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Gérer les utilisateurs</p>
                  <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer des utilisateurs</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                <Shield className="h-5 w-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Paramètres système</p>
                  <p className="text-sm text-gray-500">Configurer les paramètres de l'application</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;