import api from './axios';

export const getListings = async () => {
  const response = await api.get('/api/listings');
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get('/api/listings/my');
  return response.data;
};

export const searchListings = async (params) => {
  const response = await api.get('/api/listings/search', { params });
  return response.data;
};

export const getListingById = async (id) => {
  const response = await api.get(`/api/listings/${id}`);
  return response.data;
};

export const createListing = async (formData) => {
  const response = await api.post('/api/listings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateListing = async (id, formData) => {
  const response = await api.put(`/api/listings/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateQuantity = async (id, quantity) => {
  const response = await api.patch(`/api/listings/${id}/quantity?quantity=${quantity}`);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/api/listings/${id}`);
  return response.data;
};
