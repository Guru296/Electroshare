import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getListings } from '../api/listingApi';
import { getCategories } from '../api/categoryApi';
import ListingCard from '../components/listing/ListingCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        const items = Array.isArray(data) ? data : (data.content || []);
        
        // Filter out the logged-in user's own listings
        const otherPeoplesListings = user 
          ? items.filter(item => item.sellerEmail !== user.email && String(item.sellerId) !== String(user.id))
          : items;
          
        // Take top 8 recent listings
        setListings(otherPeoplesListings.slice(0, 8));
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoadingListings(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const items = Array.isArray(data) ? data : (data.content || []);
        setCategories(items.slice(0, 6)); // Top 6 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchListings();
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-2xl p-8 md:p-16 mb-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-slate-900 to-slate-900"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Find the Electronic Parts You Need
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8">
            Buy and sell electronic components, parts, and modules from people around you.
          </p>
          
          <form action="/listings" className="flex flex-col md:flex-row gap-2 max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-lg">
            <div className="flex-grow flex items-center bg-slate-50 rounded-md px-3 border border-slate-200">
              <Search className="text-slate-400" size={20} />
              <input 
                type="text" 
                name="keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..." 
                className="w-full bg-transparent border-none focus:ring-0 py-3 px-3 text-slate-800 outline-none"
              />
            </div>
            <div className="md:w-1/3">
              <input 
                type="text" 
                name="location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Location" 
                className="w-full bg-slate-50 border border-slate-200 rounded-md py-3 px-4 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-md transition-colors whitespace-nowrap">
              Search
            </button>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/listings" className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Browse All Listings
            </Link>
            <Link to="/sell" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-md transition-colors">
              Sell
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Popular Categories</h2>
          <Link to="/listings" className="text-amber-600 hover:text-amber-700 font-medium text-sm">View All</Link>
        </div>
        
        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-32 animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id || category.categoryId} 
                to={`/listings?categoryId=${category.id || category.categoryId}`}
                className="bg-white hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-lg p-6 text-center shadow-sm hover:shadow transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <span className="font-bold text-xl">{category.name?.charAt(0) || 'C'}</span>
                </div>
                <span className="font-medium text-slate-700">{category.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg text-slate-500">
            No categories available.
          </div>
        )}
      </div>

      {/* Recent Listings Section */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recently Added</h2>
          <Link to="/listings" className="text-amber-600 hover:text-amber-700 font-medium text-sm">View More</Link>
        </div>

        {loadingListings ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-80 animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-lg font-medium text-slate-700 mb-2">No electronic components found.</h3>
            <p className="text-slate-500 mb-6">Be the first to list an item on ElectroShare!</p>
            <Link to="/sell" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-md transition-colors">
              Sell
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
