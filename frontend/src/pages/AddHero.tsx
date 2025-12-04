import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroForm from '../components/HeroForm';
import heroApi from '../api/heroApi';
import { Plus } from 'lucide-react';

const AddHero: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      
      await heroApi.createHero(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du héros');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ajouter un nouveau Super-Héros
              </h1>
              <p className="mt-2 text-gray-600">
                Remplissez les informations pour créer un nouveau héros dans votre collection
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
          <HeroForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddHero;