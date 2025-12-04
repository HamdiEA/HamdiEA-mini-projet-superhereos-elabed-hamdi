import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Hero } from '../types/Hero';
import heroApi from '../api/heroApi';
import { Edit, Trash2, ArrowLeft, MapPin, Calendar, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeroDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
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
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!hero) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${hero.nom} de façon permanente ?`)) {
      try {
        await heroApi.deleteHero(hero._id);
        navigate('/dashboard');
      } catch (error) {
        alert('Erreur lors de la suppression du héros');
      }
    }
  };

  const getUniversColor = (univers: string) => {
    switch (univers) {
      case 'Marvel':
        return 'bg-red-500';
      case 'DC':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getImageSrc = (image?: string) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/')) return image;
    return `https://raw.githubusercontent.com/akabab/superhero-api/master/api/images/${image}`;
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='%23c7d2fe'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%234b5563' font-family='Arial' font-size='36'>No image</text></svg>`)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !hero) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Héros non trouvé'}</h2>
          <Link to="/dashboard" className="btn-primary">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour au tableau de bord
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-600">
            {hero.image ? (
              <img
                src={getImageSrc(hero.image)}
                alt={hero.nom}
                onError={handleImgError}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-6xl font-bold">
                  {hero.nom.charAt(0)}
                </div>
              </div>
            )}
            
            {/* Universe Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`${getUniversColor(
                  hero.univers
                )} text-white px-3 py-1 rounded-full text-sm font-medium`}
              >
                {hero.univers}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex space-x-2">
              {user && (user.role === 'admin' || user.role === 'editor') && (
                <Link
                  to={`/edit-hero/${hero._id}`}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-lg transition duration-200"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </Link>
              )}
              
              {user && user.role === 'admin' && (
                <button
                  onClick={handleDelete}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 p-2 rounded-lg transition duration-200"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Hero Info */}
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hero.nom}</h1>
              <p className="text-xl text-gray-600">{hero.alias}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Origine</h3>
                    <p className="text-gray-900">{hero.origine}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Première Apparition</h3>
                    <p className="text-gray-900">{hero.premiereApparition}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pouvoirs</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {hero.pouvoirs.map((pouvoir, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {pouvoir}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-900 mt-1 leading-relaxed">{hero.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6">
              <div className="text-sm text-gray-500">
                <p>Créé le: {new Date(hero.createdAt).toLocaleDateString('fr-FR')}</p>
                {hero.updatedAt !== hero.createdAt && (
                  <p>Modifié le: {new Date(hero.updatedAt).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDetails;