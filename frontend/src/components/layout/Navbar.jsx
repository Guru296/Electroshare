import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, Zap } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-amber-500">
              <Zap size={24} />
              ElectroShare
            </Link>
            <div className="hidden md:block">
              {user && (
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                  <Link to="/listings" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium">Browse Listings</Link>
                  {isAdmin() && (
                    <Link to="/admin/categories" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium text-amber-400">Categories (Admin)</Link>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-4">
              {user && (
                <Link to="/sell" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                  Sell
                </Link>
              )}
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-sm font-medium hover:text-amber-500">Profile</Link>
                  <Link to="/my-listings" className="text-sm font-medium hover:text-amber-500">My Listings</Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-slate-300 hover:text-white">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-medium hover:text-amber-500">Login</Link>
                  <Link to="/register" className="text-sm font-medium hover:text-amber-500">Register</Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (
              <>
                <Link to="/" className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/listings" className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Browse Listings</Link>
                <Link to="/sell" className="block text-amber-500 font-bold hover:bg-slate-700 px-3 py-2 rounded-md text-base" onClick={() => setIsMenuOpen(false)}>Sell</Link>
                {isAdmin() && (
                  <Link to="/admin/categories" className="block text-amber-400 hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Categories (Admin)</Link>
                )}
              </>
            )}

            {user ? (
              <>
                <Link to="/profile" className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link to="/my-listings" className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block hover:bg-slate-700 px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
