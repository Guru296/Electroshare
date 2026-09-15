import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api/listingApi';
import { getCategories } from '../api/categoryApi';
import { Upload, Plus, AlertCircle } from 'lucide-react';

const CreateListing = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: 1,
    condition: 'NEW',
    location: '',
    categoryId: '',
    image: null
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const items = Array.isArray(data) ? data : (data.content || []);
        setCategories(items);
        if (items.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: items[0].id || items[0].categoryId }));
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        setError('Failed to load categories. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      setError('Please upload an image for your listing.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('quantity', formData.quantity);
      submitData.append('condition', formData.condition);
      submitData.append('location', formData.location);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('image', formData.image);

      const response = await createListing(submitData);
      const newId = response.id || response.listingId;
      
      // Redirect to the new listing or my listings
      navigate(newId ? `/listings/${newId}` : '/listings');
    } catch (err) {
      console.error(err);
      setError('Failed to create listing. Please ensure all fields are correct.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Post a New Listing</h1>
        <p className="text-slate-500 mt-2">Sell your electronic components to the community</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3 border border-red-100">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Listing Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Arduino Uno R3, 500W Power Supply..."
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>
            
            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Quantity Available *</label>
              <input
                type="number"
                name="quantity"
                required
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Condition */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Condition *</label>
              <select
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white"
              >
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="FOR_PARTS">For Parts</option>
              </select>
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
              <select
                name="categoryId"
                required
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(c => (
                  <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Area (e.g., Mumbai, Andheri East)"
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item, its features, and any defects..."
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-y"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Product Image *</label>
            
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
              <div className="text-center">
                {imagePreview ? (
                  <div className="mb-4 relative mx-auto h-48 w-full max-w-sm rounded-md overflow-hidden bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                    <button 
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <span className="sr-only">Remove</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                )}
                
                {!imagePreview && (
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-amber-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-600 focus-within:ring-offset-2 hover:text-amber-500"
                    >
                      <span>Upload a file</span>
                      <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                )}
                {!imagePreview && <p className="text-xs leading-5 text-slate-500 mt-2">PNG, JPG, GIF up to 5MB</p>}
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-100 mr-4 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-8 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : (
              <>
                <Plus size={18} /> Post Listing
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
