import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCard from '../components/HeroCard';
import SearchBar from '../components/SearchBar';
import { Hero } from '../types/Hero';
import heroApi from '../api/heroApi';
import { Plus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnivers, setSelectedUnivers] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchHeroes();
  }, []);

  useEffect(() => {
    filterAndSortHeroes();
  }, [heroes, searchQuery, selectedUnivers, sortBy]);

  const fetchHeroes = async () => {
    try {
      const data = await heroApi.getHeroes();
      setHeroes(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortHeroes = () => {
    let filtered = [...heroes];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(hero =>
        hero.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hero.alias.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply universe filter
    if (selectedUnivers) {
      filtered = filtered.filter(hero => hero.univers === selectedUnivers);
    }

    // Apply sorting
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredHeroes(filtered);
  };

  const handleDeleteHero = async (id: string) => {
    try {
      await heroApi.deleteHero(id);
      setHeroes(heroes.filter(hero => hero._id !== id));
    } catch (error) {
      console.error('Error deleting hero:', error);
      alert('Erreur lors de la suppression du héros');
    }
  };

  const getUniversStats = () => {
    const stats = heroes.reduce((acc, hero) => {
      acc[hero.univers] = (acc[hero.univers] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  const universStats = getUniversStats();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de bord des Super-Héros
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez votre collection de super-héros
              </p>
            </div>
            {user?.role !== 'viewer' && (
              <Link
                to="/add-hero"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un Héros</span>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Héros</p>
                <p className="text-2xl font-semibold text-gray-900">{heroes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <div className="h-6 w-6 text-red-600 font-bold">M</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Marvel</p>
                <p className="text-2xl font-semibold text-gray-900">{universStats.Marvel || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <div className="h-6 w-6 text-blue-600 font-bold">DC</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">DC Comics</p>
                <p className="text-2xl font-semibold text-gray-900">{universStats.DC || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                <div className="h-6 w-6 text-gray-600 font-bold">A</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Autre</p>
                <p className="text-2xl font-semibold text-gray-900">{universStats.Autre || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedUnivers={selectedUnivers}
          onUniversChange={setSelectedUnivers}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Heroes Grid */}
        {filteredHeroes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {heroes.length === 0 ? 'Aucun héros trouvé' : 'Aucun héros ne correspond à vos critères'}
            </h3>
            <p className="text-gray-500">
              {heroes.length === 0 
                ? 'Commencez par ajouter votre premier super-héros!' 
                : 'Essayez de modifier vos filtres de recherche'}
            </p>
            {heroes.length === 0 && (
              <Link
                to="/add-hero"
                className="mt-4 inline-flex btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un Héros
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHeroes.map((hero) => (
              <HeroCard
                key={hero._id}
                hero={hero}
                onDelete={handleDeleteHero}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;