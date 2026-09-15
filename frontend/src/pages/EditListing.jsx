import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListingById, updateListing } from '../api/listingApi';
import { getCategories } from '../api/categoryApi';
import { Upload, Save, AlertCircle } from 'lucide-react';
import SecureImage from '../components/common/SecureImage';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

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
    const fetchData = async () => {
      try {
        const [listingData, categoriesData] = await Promise.all([
          getListingById(id),
          getCategories()
        ]);
        
        const catItems = Array.isArray(categoriesData) ? categoriesData : (categoriesData.content || []);
        setCategories(catItems);
        
        setFormData({
          title: listingData.title || '',
          description: listingData.description || '',
          price: listingData.price || '',
          quantity: listingData.quantity || 1,
          condition: listingData.condition || 'NEW',
          location: listingData.location || '',
          categoryId: listingData.categoryId || (catItems.length > 0 ? (catItems[0].id || catItems[0].categoryId) : ''),
          image: null // File object won't be pre-filled
        });
        
        if (listingData.imageUrl) {
          setCurrentImage(listingData.imageUrl);
        }
      } catch (err) {
        console.error('Failed to load data', err);
        setError('Failed to load listing data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
    setIsSubmitting(true);
    setError('');
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('quantity', formData.quantity);
      submitData.append('condition', formData.condition);
      submitData.append('location', formData.location);
      submitData.append('categoryId', formData.categoryId);
      
      // Image is optional for update
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await updateListing(id, submitData);
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update listing. Please ensure all fields are correct.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Edit Listing</h1>
        <p className="text-slate-500 mt-2">Update information about your component</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-start gap-3 border border-red-100">
          <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Same form layout as CreateListing... */}
        <div className="p-6 md:p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Listing Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Quantity Available *</label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Update Product Image (Optional)</label>
            
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
              <div className="text-center">
                {(imagePreview || currentImage) ? (
                  <div className="mb-4 relative mx-auto h-48 w-full max-w-sm rounded-md overflow-hidden bg-slate-100">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                    ) : (
                      <SecureImage src={currentImage} alt="Current" className="h-full w-full object-contain" />
                    )}
                  </div>
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                )}
                
                <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-amber-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-amber-600 focus-within:ring-offset-2 hover:text-amber-500"
                  >
                    <span>Change image</span>
                    <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
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
            {isSubmitting ? 'Saving...' : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;
