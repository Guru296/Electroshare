import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-2">Manage your account information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-3xl font-bold">
              {(user.name && user.name.charAt(0)) || (user.email && user.email.charAt(0).toUpperCase()) || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{user.name || 'ElectroShare User'}</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <User size={18} />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <div className="font-medium text-slate-800 pl-7">
                    {user.name || 'Not provided'}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <Mail size={18} />
                    <span className="text-sm font-medium">Email Address</span>
                  </div>
                  <div className="font-medium text-slate-800 pl-7">
                    {user.email || 'Not provided'}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-500 mb-2">
                    <Phone size={18} />
                    <span className="text-sm font-medium">Phone Number</span>
                  </div>
                  <div className="font-medium text-slate-800 pl-7">
                    {user.phone || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-500 text-center">
            <p>Profile information is currently read-only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
