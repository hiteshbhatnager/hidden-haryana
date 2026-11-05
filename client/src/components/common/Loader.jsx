import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ message = 'Loading Haryana treasures...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-forest-100 border-t-forest-700 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-forest-800 text-xs font-bold">
          🌾
        </div>
      </div>
      <p className="mt-4 text-stone-600 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};
