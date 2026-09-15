import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Listings from '../pages/Listings';
import ListingDetails from '../pages/ListingDetails';
import CreateListing from '../pages/CreateListing';
import EditListing from '../pages/EditListing';
import MyListings from '../pages/MyListings';
import Profile from '../pages/Profile';
import CategoryManagement from '../pages/admin/CategoryManagement';
import NotFound from '../pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="listings/:id" element={<ListingDetails />} />
          <Route path="sell" element={<CreateListing />} />
          <Route path="listings/:id/edit" element={<EditListing />} />
          <Route path="my-listings" element={<MyListings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<RoleProtectedRoute requireAdmin={true} />}>
          <Route path="admin/categories" element={<CategoryManagement />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
