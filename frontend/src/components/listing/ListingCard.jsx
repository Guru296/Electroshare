import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User, Tag } from 'lucide-react';
import SecureImage from '../common/SecureImage';

const ListingCard = ({ listing }) => {
  const isSold = listing.quantity === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-slate-100 overflow-hidden group">
        <SecureImage 
          src={listing.imageUrl} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 absolute inset-0"
        />
        
        {isSold ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            SOLD OUT
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
            {listing.quantity} available
          </div>
        )}
        
        <div className="absolute top-2 left-2 bg-slate-900/70 text-white text-xs font-medium px-2 py-1 rounded">
          {listing.condition}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg line-clamp-1" title={listing.title}>
            {listing.title}
          </h3>
          <span className="font-bold text-amber-600 text-lg">
            ₹{listing.price}
          </span>
        </div>
        
        <div className="space-y-1 mb-4 flex-grow text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Tag size={14} className="text-slate-400" />
            <span className="truncate">{listing.categoryName}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-slate-400" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} className="text-slate-400" />
            <span className="truncate">Seller: {listing.sellerName || 'Unknown'}</span>
          </div>
        </div>
        
        <Link 
          to={`/listings/${listing.id}`}
          className="mt-auto block w-full text-center bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-medium py-2 border border-slate-200 hover:border-amber-200 rounded transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
