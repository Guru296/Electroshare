import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings } from '../api/listingApi';
import ListingCard from '../components/listing/ListingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import { Package, Plus } from 'lucide-react';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyListings();
      setListings(data);
    } catch (err) {
      setError('Failed to fetch your listings. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Listings</h1>
          <p className="text-slate-500 mt-1">Manage the components you are selling</p>
        </div>
        <Link 
          to="/sell" 
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-md transition-colors"
        >
          <Plus size={20} />
          Post New
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && listings.length === 0 ? (
        <div className="mt-12">
          <EmptyState 
            icon={Package}
            title="No listings yet"
            message="You haven't posted any electronic components for sale."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
