import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hero } from '../types/Hero';
import HeroForm from '../components/HeroForm';
import heroApi from '../api/heroApi';
import { Edit } from 'lucide-react';

const EditHero: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchHero();
    }
  }, [id]);

  const fetchHero = async () => {
    try {
      const data = await heroApi.getHeroById(id!);
      setHero(data);
    } catch (err) {
      setError('Impossible de charger les détails du héros');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Parse pouvoirs from string to array
      const pouvoirsString = formData.get('pouvoirs') as string;
      const pouvoirsArray = JSON.parse(pouvoirsString);
      
      // Update the formData with the correct pouvoirs format
      formData.delete('pouvoirs');
      pouvoirsArray.forEach((pouvoir: string) => {
        formData.append('pouvoirs', pouvoir);
      });
      
      await heroApi.updateHero(id!, formData);
      navigate(`/hero/${id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du héros');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !hero) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifier un Super-Héros
              </h1>
              <p className="mt-2 text-gray-600">
                Mettez à jour les informations de {hero?.nom}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {hero && (
            <HeroForm
              hero={hero}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditHero;