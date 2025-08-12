
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-teal-600">👗</span>
            <h1 className="text-xl font-bold text-gray-800">Virtual Stylist AI</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
