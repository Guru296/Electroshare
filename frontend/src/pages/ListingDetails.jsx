import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById, deleteListing, updateQuantity } from '../api/listingApi';
import { useAuth } from '../context/AuthContext';
import { MapPin, User, Tag, Clock, Package, AlertCircle, Edit, Trash2, Mail, MessageCircle } from 'lucide-react';
import SecureImage from '../components/common/SecureImage';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const data = await getListingById(id);
      setListing(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Listing not found.');
      } else {
        setError('Failed to load listing details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteListing(id);
        navigate('/listings', { replace: true });
      } catch (err) {
        alert('Failed to delete listing. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center max-w-2xl mx-auto mt-12 border border-red-100">
        <AlertCircle className="mx-auto mb-4" size={48} />
        <h2 className="text-xl font-bold mb-2">Oops!</h2>
        <p>{error || 'Listing not found.'}</p>
        <Link to="/listings" className="inline-block mt-4 text-slate-800 font-medium hover:underline">
          Back to Listings
        </Link>
      </div>
    );
  }

  const isOwner = user && (user.email === listing.sellerEmail || user.id === listing.sellerId);
  const isSold = listing.quantity === 0;

  // Format date if available
  const formattedDate = listing.createdAt 
    ? new Date(listing.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown date';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-slate-800 hover:underline">Home</Link>
        <span>/</span>
        <Link to="/listings" className="hover:text-slate-800 hover:underline">Listings</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{listing.title}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="md:w-1/2 bg-slate-100 relative min-h-[300px]">
            <SecureImage 
              src={listing.imageUrl} 
              alt={listing.title} 
              className="w-full h-full object-contain object-center absolute inset-0"
              fallbackText="No Image Available"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-slate-900/80 text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider backdrop-blur-sm">
                {listing.condition}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="mb-4">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{listing.title}</h1>
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-4">₹{listing.price}</div>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <Tag size={16} className="text-slate-400" />
                  <span>{listing.categoryName}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                  <Clock size={16} className="text-slate-400" />
                  <span>Listed {formattedDate}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 flex-grow">
              <h2 className="text-lg font-bold text-slate-800 mb-3">Description</h2>
              <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                {listing.description || 'No description provided.'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Package size={20} className="text-amber-500" />
                  Availability
                </div>
                {isOwner ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={async () => {
                        if (listing.quantity > 0) {
                          try {
                            const newQ = listing.quantity - 1;
                            await updateQuantity(id, newQ);
                            setListing({...listing, quantity: newQ});
                          } catch(e) {}
                        }
                      }}
                      className="bg-slate-200 hover:bg-slate-300 w-8 h-8 rounded flex items-center justify-center text-slate-700 font-bold"
                      disabled={listing.quantity <= 0}
                    >-</button>
                    <span className="font-bold w-8 text-center">{listing.quantity}</span>
                    <button 
                      onClick={async () => {
                        try {
                          const newQ = listing.quantity + 1;
                          await updateQuantity(id, newQ);
                          setListing({...listing, quantity: newQ});
                        } catch(e) {}
                      }}
                      className="bg-slate-200 hover:bg-slate-300 w-8 h-8 rounded flex items-center justify-center text-slate-700 font-bold"
                    >+</button>
                  </div>
                ) : (
                  isSold ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      SOLD OUT
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                      Available — {listing.quantity} units
                    </span>
                  )
                )}
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <User size={16} /> Seller Information
                </h3>
                <div className="text-slate-600 text-sm">
                  <p className="font-medium text-slate-900 mb-1">{listing.sellerName || 'Unknown Seller'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
              {isOwner ? (
                <>
                  <Link 
                    to={`/listings/${id}/edit`}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={18} /> Edit Listing
                  </Link>
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-md border border-red-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 size={18} /> {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              ) : (
                !isSold && (
                  <>
                    <a 
                      href={`https://wa.me/${listing.sellerPhone?.replace(/\D/g,'')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} /> WhatsApp Seller
                    </a>
                    <a 
                      href={`mailto:${listing.sellerEmail}?subject=Regarding your ElectroShare listing: ${listing.title}`}
                      className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail size={20} /> Email Seller
                    </a>
                  </>
                )
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
