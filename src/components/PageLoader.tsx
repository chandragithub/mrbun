import React from 'react';

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Baking fresh content for you...' }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        {/* Glowing backdrop */}
        <div className="w-24 h-24 bg-amber-400/30 rounded-full blur-xl animate-pulse" />
        
        {/* Mascot bouncing logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Mr Bun Loading"
            className="w-16 h-16 object-contain animate-bounce drop-shadow-lg"
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-black text-amber-950 font-display">
          Mr <span className="text-amber-600">Bun</span> is on it!
        </h3>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
          {message}
        </p>
      </div>

      {/* Progress pill */}
      <div className="w-48 h-1.5 bg-amber-100 rounded-full mt-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-full animate-marquee" />
      </div>
    </div>
  );
};
