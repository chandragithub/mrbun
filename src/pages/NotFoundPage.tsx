import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-amber-200 shadow-xl space-y-6">
        <div className="w-24 h-24 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center p-2 shadow-inner">
          <img
            src="/logo.png"
            alt="Mr Bun 404"
            className="w-full h-full object-contain animate-bounce"
          />
        </div>

        <div>
          <span className="text-4xl font-black text-amber-600 font-display">404</span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Oops! Page Melted Away</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            We couldn't find the page you were looking for. Perhaps you'd like a hot pizza or double smash burger instead?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </button>
          
          <button
            onClick={() => navigate('/menu')}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
