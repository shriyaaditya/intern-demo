import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCartIcon, 
  Bars3Icon, 
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Products
            </Link>

            {isAdmin && isAdmin() && (
              <Link to="/admin" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Admin
              </Link>
            )}

            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`} 
                    alt={user.name || 'User'} 
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
                    }}
                  />
                  <span className="font-medium">{user.name || 'User'}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </form>

            <div className="space-y-2">
              <Link to="/products" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                Products
              </Link>
             
              {isAdmin && isAdmin() && (
                <Link to="/admin" className="block py-2 text-primary-600 font-medium">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/cart" className="flex items-center py-2 text-gray-700 hover:text-primary-600 font-medium">
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Cart ({cartCount})
              </Link>

              {user ? (
                <>
                  
                  <button 
                    onClick={logout}
                    className="block w-full text-left py-2 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <Link to="/login" className="block py-2 text-gray-700 font-medium">
                    Sign In
                  </Link>
                  <Link to="/register" className="block py-2 text-primary-600 font-medium">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;