import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import { Edit, Trash2, Plus, X, Save } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      const items = Array.isArray(data) ? data : (data.content || []);
      setCategories(items);
    } catch (err) {
      console.error(err);
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCategory({ id: null, name: '', description: '' });
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory({
      id: category.id || category.categoryId,
      name: category.name,
      description: category.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect existing listings.')) {
      try {
        await deleteCategory(id);
        fetchCategories(); // refresh list
      } catch (err) {
        console.error(err);
        alert('Failed to delete category. It might be in use.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory.id) {
        // Update
        await updateCategory(currentCategory.id, {
          name: currentCategory.name,
          description: currentCategory.description
        });
      } else {
        // Create
        await createCategory({
          name: currentCategory.name,
          description: currentCategory.description
        });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to save category. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Category Management</h1>
          <p className="text-slate-500 mt-2">Manage electronic component categories</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={currentCategory.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
                  placeholder="e.g., Microcontrollers"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentCategory.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm resize-y"
                  placeholder="Category description..."
                ></textarea>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-3 rounded-md transition-colors text-sm"
                >
                  {isEditing ? <Save size={16} /> : <Plus size={16} />}
                  {isEditing ? 'Update' : 'Add'}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md transition-colors text-sm"
                  >
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold hidden sm:table-cell">Description</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500">
                        Loading categories...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500">
                        No categories found. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id || category.categoryId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">
                          {category.name}
                        </td>
                        <td className="p-4 text-slate-500 text-sm hidden sm:table-cell truncate max-w-xs">
                          {category.description || '-'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id || category.categoryId)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CategoryManagement;
