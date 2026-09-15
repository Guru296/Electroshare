import React from 'react';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 font-bold text-xl text-amber-500 mb-4">
              <Zap size={24} />
              ElectroShare
            </div>
            <p className="text-sm max-w-xs text-center md:text-left">
              The premier peer-to-peer marketplace for buying and selling electronic components, parts, and modules.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Explore</h3>
              <ul className="space-y-2">
                <li><a href="/listings" className="hover:text-amber-500">Browse Parts</a></li>
                <li><a href="/sell" className="hover:text-amber-500">Sell Components</a></li>
                <li><a href="#" className="hover:text-amber-500">Categories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-amber-500">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-500">Safety Tips</a></li>
                <li><a href="#" className="hover:text-amber-500">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} ElectroShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
