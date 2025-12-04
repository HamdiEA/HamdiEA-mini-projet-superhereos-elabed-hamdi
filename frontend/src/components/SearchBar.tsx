import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUnivers: string;
  onUniversChange: (univers: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedUnivers,
  onUniversChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un héros..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input h-10 w-full"
          />
        </div>

        {/* Filter by Universe */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-gray-400">
            <Filter className="w-5 h-5" />
          </div>
          <select
            value={selectedUnivers}
            onChange={(e) => onUniversChange(e.target.value)}
            className="form-input h-10 w-full appearance-none"
          >
            <option value="">Tous les univers</option>
            <option value="Marvel">Marvel</option>
            <option value="DC">DC</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 text-gray-400">
            <SortAsc className="w-5 h-5" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-input h-10 w-full appearance-none"
          >
            <option value="">Trier par...</option>
            <option value="name">Nom (A-Z)</option>
            <option value="date">Date d'ajout</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;