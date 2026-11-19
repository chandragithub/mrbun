import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          
          // Show button after scrolling down 240px
          setIsVisible(scrollY > 240);

          if (totalHeight > 0) {
            const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
            setScrollProgress(progress);
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to establish position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => setIsClicked(false), 800);
  };

  // SVG Circular Ring calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed z-40 transition-all duration-500 ease-out flex flex-col items-center ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100' 
          : 'opacity-0 translate-y-6 pointer-events-none scale-75'
      } bottom-20 right-4 sm:bottom-8 sm:right-8`}
    >
      {/* Tooltip on hover */}
      <div
        className={`absolute -top-9 px-2.5 py-1 bg-slate-900/90 text-amber-300 text-[11px] font-bold rounded-lg shadow-lg backdrop-blur-xs whitespace-nowrap transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
        }`}
      >
        <span>Back to Top ({Math.round(scrollProgress)}%)</span>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900/90" />
      </div>

      {/* Interactive Button */}
      <button
        type="button"
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Scroll to top of page"
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl group focus:outline-none focus:ring-4 focus:ring-amber-400/50 ${
          isClicked 
            ? 'scale-90 bg-amber-600' 
            : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-red-500 hover:from-amber-500 hover:to-red-600 hover:scale-110 active:scale-95'
        }`}
      >
        {/* Glow ambient background ring */}
        <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-md group-hover:bg-amber-500/50 transition-all duration-300 pointer-events-none" />

        {/* Circular Progress SVG */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 52 52"
        >
          {/* Background circle track */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="text-black/20"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated progress circle indicator */}
          <circle
            cx="26"
            cy="26"
            r={radius}
            className="text-amber-200 transition-[stroke-dashoffset] duration-150 ease-out"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        {/* Animated Arrow Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white">
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-y-1 stroke-[2.5]" />
          {/* Small sparkle dots when hovering */}
          <Sparkles className="w-2.5 h-2.5 text-amber-200 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition duration-300 animate-spin" />
        </div>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
