import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">
              🦸 SuperHero Manager
            </Link>
            
            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`navbar-link ${isActivePath('/dashboard') ? 'navbar-link-active' : ''}`}
                >
                  Dashboard
                </Link>
                {user?.role !== 'viewer' && (
                  <Link
                    to="/add-hero"
                    className={`navbar-link ${isActivePath('/add-hero') ? 'navbar-link-active' : ''}`}
                  >
                    Ajouter un Héros
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`navbar-link ${isActivePath('/admin') ? 'navbar-link-active' : ''}`}
                  >
                    Administration
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user?.role === 'admin' ? (
                    <Shield className="w-5 h-5 text-purple-600" />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                  <span className="text-gray-700">{user?.username}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="navbar-link"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="navbar-link"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;