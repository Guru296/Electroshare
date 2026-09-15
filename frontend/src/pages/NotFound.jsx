import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-600 mb-6">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-md transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
