import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../types/Hero';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeroCardProps {
  hero: Hero;
  onDelete: (id: string) => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onDelete }) => {
  const { user } = useAuth();

  // Normalize hero.image to a usable URL and provide a fallback on error
  const getImageSrc = (image?: string) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/')) return image; // served by backend (e.g. /uploads/...)
    // relative path from JSON like 'md/1-a-bomb.jpg' -> use Akabab raw github
    return `https://raw.githubusercontent.com/akabab/superhero-api/master/api/images/${image}`;
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.onerror = null;
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='100%' height='100%' fill='%23c7d2fe'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%234b5563' font-family='Arial' font-size='24'>No image</text></svg>`)}`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${hero.nom} ?`)) {
      onDelete(hero._id);
    }
  };

  const getUniversColor = (univers: string) => {
    switch (univers) {
      case 'Marvel':
        return 'bg-red-100 text-red-800';
      case 'DC':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="hero-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl">
      {hero.image ? (
        <img
          src={getImageSrc(hero.image)}
          alt={hero.nom}
          onError={handleImgError}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
          <div className="text-white text-4xl font-bold">
            {hero.nom.charAt(0)}
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{hero.nom}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded ${getUniversColor(hero.univers)}`}>
            {hero.univers}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">Alias: {hero.alias}</p>
        
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Pouvoirs:</p>
          <div className="flex flex-wrap gap-1">
            {hero.pouvoirs.slice(0, 3).map((pouvoir, index) => (
              <span
                key={index}
                className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
              >
                {pouvoir}
              </span>
            ))}
            {hero.pouvoirs.length > 3 && (
              <span className="text-xs text-gray-500">
                +{hero.pouvoirs.length - 3} autres
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {hero.description}
        </p>
        
        <div className="flex justify-between items-center">
          <Link
            to={`/hero/${hero._id}`}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            <span>Voir détails</span>
          </Link>
          
          <div className="flex space-x-2">
            {user && (user.role === 'admin' || user.role === 'editor') && (
              <Link
                to={`/edit-hero/${hero._id}`}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Modifier"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}
            
            {user && user.role === 'admin' && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 p-1"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;