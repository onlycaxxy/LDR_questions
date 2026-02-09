
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-10 bg-white/100 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-yellow-400 bg-clip-text text-transparent">LDR questions to bondᯓ★</span>  </Link>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-yellow-200">
            <div className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">(cw)²</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
