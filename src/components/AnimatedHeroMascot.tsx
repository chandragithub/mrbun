import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Star, Heart, Flame, PartyPopper } from 'lucide-react';

interface AnimatedHeroMascotProps {
  logoUrl?: string;
  brandName: string;
  onOpenPartyModal?: () => void;
  onExploreMenu?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  rot: number;
  scale: number;
}

const FUN_QUOTES = [
  "Hot, Fresh & Cheesy! 🍕",
  "Brioche Smash Perfection! 🍔",
  "1,500+ Happy Foodies! ❤️",
  "Lightning Fast 30-Min Delivery! ⚡",
  "100% Real Sourdough Love! ✨",
  "Best Burgers & Cocktails in Town! 🍹"
];

export const AnimatedHeroMascot: React.FC<AnimatedHeroMascotProps> = ({
  logoUrl,
  brandName,
  onOpenPartyModal,
  onExploreMenu
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Speech Bubble State
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Confetti / Food Sparkles Burst
  const [particles, setParticles] = useState<Particle[]>([]);

  // Mouse Move 3D Tilt calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize -1 to 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Max 12 deg tilt
    const rotateY = normX * 10;
    const rotateX = -normY * 10;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  // Click Mascot to Celebrate
  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 600);

    // Cycle speech
    setSpeechText(FUN_QUOTES[quoteIndex]);
    setQuoteIndex((prev) => (prev + 1) % FUN_QUOTES.length);

    // Spawn Burst Particles
    const burstEmojis = ['🍔', '🍕', '✨', '🍟', '🧀', '🎉', '⭐', '🥤'];
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      emoji: burstEmojis[i % burstEmojis.length],
      vx: (Math.random() - 0.5) * 120,
      vy: (Math.random() - 0.7) * 120,
      rot: (Math.random() - 0.5) * 180,
      scale: 0.8 + Math.random() * 0.5
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);
  };

  // Auto-hide speech bubble
  useEffect(() => {
    if (!speechText) return;
    const timer = setTimeout(() => {
      setSpeechText(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [speechText]);

  return (
    <div 
      className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md select-none perspective-1000 py-4 px-2"
      style={{ perspective: '1100px' }}
    >
      {/* Dynamic Animated Ambient Glow Aura */}
      <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-amber-400/35 via-orange-500/25 to-red-500/25 rounded-[3rem] blur-3xl animate-pulse pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-400/20 rounded-full blur-2xl animate-blob pointer-events-none -z-10" />

      {/* Floating Appetizing Food Accessories in Background */}
      
      {/* Floating 🍕 Pizza Slice Badge (Top Right) */}
      <div 
        className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 z-20 pointer-events-none"
        style={{
          animation: 'floatSlow 4.5s ease-in-out infinite',
          animationDelay: '0.4s'
        }}
      >
        <div className="bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-xl px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 transform hover:scale-110 transition duration-300">
          <span className="text-xl inline-block animate-bounce" style={{ animationDuration: '2s' }}>🍕</span>
          <div className="text-left leading-tight hidden xs:block">
            <span className="text-[10px] font-black text-amber-950 block uppercase tracking-wider">Crispy</span>
            <span className="text-[9px] font-bold text-orange-600 block">Sourdough</span>
          </div>
        </div>
      </div>

      {/* Floating 🍔 Gourmet Burger Badge (Bottom Left) */}
      <div 
        className="absolute -bottom-4 -left-3 sm:-bottom-5 sm:-left-5 z-20 pointer-events-none"
        style={{
          animation: 'floatSlowAlt 5s ease-in-out infinite',
          animationDelay: '1.2s'
        }}
      >
        <div className="bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-xl px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5">
          <span className="text-xl inline-block animate-pulse" style={{ animationDuration: '2.5s' }}>🍔</span>
          <div className="text-left leading-tight hidden xs:block">
            <span className="text-[10px] font-black text-amber-950 block uppercase tracking-wider">Brioche</span>
            <span className="text-[9px] font-bold text-red-600 block">Smash</span>
          </div>
        </div>
      </div>

      {/* Interactive 3D Card Shell */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMascotClick}
        className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(217,119,6,0.22)] border-4 border-amber-300 cursor-pointer overflow-visible transition-transform duration-200 ease-out will-change-transform group"
        style={{
          transform: isHovered 
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d'
        }}
        title="Click Mr. Bun to celebrate!"
      >
        
        {/* Dynamic Light Sheen / Glare that responds to cursor */}
        {isHovered && (
          <div 
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 opacity-60 z-30 overflow-hidden"
            style={{
              background: `radial-gradient(circle 280px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`
            }}
          />
        )}

        {/* Diagonal Shimmer Beam sweeping across the card */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-10">
          <div className="shimmer-sweep w-32 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12" />
        </div>

        {/* Fresh Hot Food Steam Ribbons (rising from pizza box) */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-32 h-16 pointer-events-none z-10 flex justify-center items-end gap-3 opacity-80">
          <svg className="w-5 h-12 text-amber-500/60 steam-waft-1" viewBox="0 0 20 60" fill="none">
            <path d="M10 55 C 5 45, 15 35, 10 25 C 5 15, 15 5, 10 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <svg className="w-5 h-14 text-orange-500/70 steam-waft-2" viewBox="0 0 20 60" fill="none">
            <path d="M10 55 C 15 45, 5 35, 10 25 C 15 15, 5 5, 10 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <svg className="w-4 h-10 text-amber-400/60 steam-waft-3" viewBox="0 0 20 60" fill="none">
            <path d="M10 50 C 6 40, 14 30, 10 20 C 6 10, 12 5, 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Mascot Interactive Speech Bubble */}
        {speechText && (
          <div 
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-2xl whitespace-nowrap animate-bounce flex items-center gap-1.5"
            style={{ animationDuration: '0.8s' }}
          >
            <span>{speechText}</span>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rotate-45 transform" />
          </div>
        )}

        {/* Mascot Center Image with Squash & Stretch Breathing Animation */}
        <div 
          className="relative z-10 transform-gpu"
          style={{ transform: 'translateZ(35px)' }}
        >
          <div className={`transition-transform duration-300 ${isClicked ? 'scale-110 -rotate-3' : ''}`}>
            <img 
              src={logoUrl || '/logo.png'} 
              alt={`${brandName} Mascot`} 
              className="w-full h-auto object-contain rounded-2xl mascot-living-motion drop-shadow-md"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
            />
          </div>
        </div>

        {/* Floating Badge 1: Top-Left 4.9/5.0 Rating */}
        <div 
          className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 bg-white border-2 border-amber-200 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 z-30 transition-transform duration-300 hover:scale-105"
          style={{
            transform: 'translateZ(55px)',
            animation: 'floatSlow 3.8s ease-in-out infinite'
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-amber-500/30">
            <Star className="w-4 h-4 fill-white text-white star-twinkle" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-xs font-black text-slate-900">4.9 / 5.0 Rating</p>
            </div>
            <p className="text-[10px] font-semibold text-amber-700">1,500+ Happy Foodies</p>
          </div>
        </div>

        {/* Floating Badge 2: Bottom-Right Party Discount */}
        <div 
          onClick={(e) => {
            if (onOpenPartyModal) {
              e.stopPropagation();
              onOpenPartyModal();
            }
          }}
          className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 z-30 cursor-pointer transition transform hover:scale-105 active:scale-95 group/badge border border-amber-300/40"
          style={{
            transform: 'translateZ(65px)',
            animation: 'floatSlowAlt 4.2s ease-in-out infinite'
          }}
          title="Click to view party discount packages!"
        >
          <div className="p-1 rounded-lg bg-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
              <span>PARTY DISCOUNT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping inline-block" />
            </p>
            <p className="text-[11px] font-bold text-amber-100">Up to 20% OFF on Bulk</p>
          </div>
        </div>

        {/* Particles Explosion on Tap */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none z-50 text-xl font-bold transition-all duration-700 ease-out"
            style={{
              top: `${p.y}%`,
              left: `${p.x}%`,
              transform: `translate(${p.vx}px, ${p.vy}px) rotate(${p.rot}deg) scale(${p.scale})`,
              opacity: isClicked ? 1 : 0
            }}
          >
            {p.emoji}
          </div>
        ))}

        {/* Floating Hint Pill */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <span className="bg-amber-950/80 backdrop-blur-sm text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-md">
            ✨ Tap Mr. Bun for foodie vibes!
          </span>
        </div>

      </div>

      {/* Shadow under the 3D card */}
      <div 
        className="w-4/5 h-4 mx-auto mt-2 bg-amber-950/15 rounded-full blur-md transition-transform duration-300"
        style={{
          transform: isHovered ? 'scale(1.08)' : 'scale(0.95)'
        }}
      />
    </div>
  );
};
