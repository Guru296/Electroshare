import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, X, Search as SearchIcon } from 'lucide-react';
import { searchListings } from '../api/listingApi';
import { getCategories } from '../api/categoryApi';
import ListingCard from '../components/listing/ListingCard';
import { useAuth } from '../context/AuthContext';

const Listings = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initialize filter state from URL params
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    categoryId: searchParams.get('categoryId') || '',
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchListings();
    // Update local filter state when URL changes
    setFilters({
      keyword: searchParams.get('keyword') || '',
      categoryId: searchParams.get('categoryId') || '',
      location: searchParams.get('location') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || ''
    });
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      const items = Array.isArray(data) ? data : (data.content || []);
      setCategories(items);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Build API params, ignoring empty ones
      const apiParams = {};
      for (const [key, value] of searchParams.entries()) {
        if (value) apiParams[key] = value;
      }
      
      const data = await searchListings(apiParams);
      const items = Array.isArray(data) ? data : (data.content || []);
      
      // Filter out the logged-in user's own listings
      const otherPeoplesListings = user 
        ? items.filter(item => item.sellerEmail !== user.email && String(item.sellerId) !== String(user.id))
        : items;
        
      setListings(otherPeoplesListings);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    
    // Update URL params which will trigger useEffect to fetch
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    
    setSearchParams(newParams);
    setIsFilterOpen(false); // Close mobile filter
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      categoryId: '',
      location: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchParams({});
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Mobile Filter Button */}
      <button 
        onClick={() => setIsFilterOpen(true)}
        className="md:hidden w-full bg-white border border-slate-200 p-3 rounded-lg flex items-center justify-center gap-2 font-medium text-slate-700 shadow-sm"
      >
        <Filter size={18} />
        Filters & Search
      </button>

      {/* Filter Sidebar */}
      <div className={`
        fixed inset-0 z-50 bg-white md:bg-transparent md:static p-6 md:p-0 
        md:w-64 flex-shrink-0 transition-transform transform 
        ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:block overflow-y-auto h-full md:h-auto
      `}>
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-bold text-slate-800">Filters</h2>
          <button onClick={() => setIsFilterOpen(false)} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={applyFilters} className="space-y-6 md:sticky md:top-24">
          <div>
            <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Search</h3>
            <div className="relative">
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                placeholder="Keywords..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Category</h3>
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Location</h3>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="City or area..."
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Price Range (₹)</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-md transition-colors text-sm"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="flex-grow w-full">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {loading ? 'Loading listings...' : `${listings.length} Listings Found`}
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-80 animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg border border-slate-100 text-center shadow-sm">
            <div className="inline-flex justify-center items-center bg-slate-100 p-4 rounded-full mb-4">
              <SearchIcon className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No listings match your search</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              We couldn't find any electronic components matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-md transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
