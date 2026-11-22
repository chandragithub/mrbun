import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Sparkles, 
  Star, 
  Flame, 
  ChefHat 
} from 'lucide-react';

interface HeroAnimationVideoProps {
  brandName: string;
  logoUrl?: string;
  onOpenPartyModal?: () => void;
  onExploreMenu?: () => void;
}

export const HeroAnimationVideo: React.FC<HeroAnimationVideoProps> = ({
  brandName,
  logoUrl = '/logo.png',
  onOpenPartyModal,
  onExploreMenu
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Video Player Controls State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeScene, setActiveScene] = useState<number>(0); // 0: Burger, 1: Pizza, 2: Mascot
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // Audio Synth Ref (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const DURATION = 15; // 15-second loop (5s Burger, 5s Pizza, 5s Mr Bun)

  // Jump to specific scene
  const jumpToScene = (sceneIndex: number) => {
    setCurrentTime(sceneIndex * 5);
  };

  // Toggle Sound with gentle procedural sizzle ambient
  const toggleSound = () => {
    if (isMuted) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Create subtle pink noise for grill sizzle
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2) * 0.04;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          // Bandpass filter to sound like hot skillet
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1400, ctx.currentTime);
          filter.Q.setValueAtTime(1.2, ctx.currentTime);

          const gainNode = ctx.createGain();
          gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

          whiteNoise.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);
          whiteNoise.start();

          noiseNodeRef.current = gainNode;
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        setIsMuted(false);
      } catch (e) {
        console.warn('AudioContext not allowed or supported', e);
        setIsMuted(true);
      }
    } else {
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
      setIsMuted(true);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Preload Mascot Logo image for canvas
  const mascotImgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoUrl;
    img.onload = () => {
      mascotImgRef.current = img;
    };
  }, [logoUrl]);

  // Main 60 FPS Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();

    // Particle systems
    const embers: Array<{ x: number; y: number; r: number; vy: number; vx: number; opacity: number; color: string }> = [];
    for (let i = 0; i < 40; i++) {
      embers.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: 1.5 + Math.random() * 3,
        vy: -0.8 - Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.8,
        opacity: 0.3 + Math.random() * 0.7,
        color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444'
      });
    }

    // Floating food particles (sesame, herbs, stars)
    const sparkles: Array<{ x: number; y: number; rot: number; speed: number; size: number; emoji: string }> = [
      { x: 120, y: 150, rot: 0, speed: 0.02, size: 24, emoji: '✨' },
      { x: 680, y: 180, rot: 0, speed: -0.015, size: 26, emoji: '🔥' },
      { x: 160, y: 440, rot: 0, speed: 0.018, size: 22, emoji: '🌿' },
      { x: 650, y: 420, rot: 0, speed: -0.025, size: 24, emoji: '⭐' }
    ];

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          return next >= DURATION ? 0 : next;
        });
      }

      const t = currentTime;
      const scene = Math.floor(t / 5); // 0, 1, or 2
      setActiveScene(scene);
      const sceneProgress = (t % 5) / 5; // 0 to 1 within scene

      const W = canvas.width;
      const H = canvas.height;

      // 1. Clear Canvas with rich dark kitchen vignette
      ctx.clearRect(0, 0, W, H);
      
      // Dynamic Background Gradient depending on scene
      const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.65);
      if (scene === 0) {
        // Sizzling Charcoal / Ember Warmth
        bgGrad.addColorStop(0, '#451a03');
        bgGrad.addColorStop(0.5, '#270e02');
        bgGrad.addColorStop(1, '#110500');
      } else if (scene === 1) {
        // Stone Oven Hearth Fire
        bgGrad.addColorStop(0, '#501604');
        bgGrad.addColorStop(0.5, '#2f0b00');
        bgGrad.addColorStop(1, '#0e0300');
      } else {
        // Golden Mr. Bun Celebration Stage
        bgGrad.addColorStop(0, '#592900');
        bgGrad.addColorStop(0.5, '#301300');
        bgGrad.addColorStop(1, '#120500');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Spotlight Cone Effect from Top
      ctx.save();
      const spotGrad = ctx.createRadialGradient(W / 2, 0, 20, W / 2, H * 0.6, W * 0.5);
      spotGrad.addColorStop(0, 'rgba(251, 191, 36, 0.28)');
      spotGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 80, 0);
      ctx.lineTo(W / 2 + 80, 0);
      ctx.lineTo(W + 50, H);
      ctx.lineTo(-50, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Render Rising Flame Embers
      embers.forEach((emb) => {
        emb.y += emb.vy;
        emb.x += emb.vx + Math.sin(now * 0.003 + emb.y * 0.05) * 0.4;
        if (emb.y < -10) {
          emb.y = H + 10;
          emb.x = Math.random() * W;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(emb.x, emb.y, emb.r, 0, Math.PI * 2);
        ctx.fillStyle = emb.color;
        ctx.globalAlpha = emb.opacity * (1 - emb.y / H * 0.3);
        ctx.shadowColor = emb.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // 4. SCENE-SPECIFIC HERO ANIMATION
      ctx.save();
      ctx.translate(W / 2, H / 2 - 20);

      // Camera breathing / slight drift
      const cameraBreath = Math.sin(now * 0.002) * 4;
      ctx.translate(0, cameraBreath);

      if (scene === 0) {
        // ==========================================
        // SCENE 1: Sizzling Brioche Smash Burger
        // ==========================================
        const easeIn = Math.min(sceneProgress * 2.5, 1);
        const floatBob = Math.sin(now * 0.003) * 6;

        // Grill Sizzle Plate Base
        ctx.save();
        ctx.translate(0, 100 + floatBob);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 20, 160, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Animated Burger Layers stacking in
        // Bottom Bun
        ctx.save();
        ctx.translate(0, 70 + floatBob);
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.ellipse(0, 0, 130, 26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Juicy Smashed Patty with grill lines
        ctx.save();
        ctx.translate(0, 42 + floatBob);
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.ellipse(0, 0, 142, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        // Patty texture
        ctx.strokeStyle = '#270e02';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-100, -5); ctx.lineTo(100, 5);
        ctx.moveTo(-80, 5); ctx.lineTo(80, -5);
        ctx.stroke();
        ctx.restore();

        // Melted Cheddar Cheese Drips (flowing down)
        ctx.save();
        ctx.translate(0, 26 + floatBob);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(0, -2, 145, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        // Dripping cheese tendrils
        ctx.beginPath();
        ctx.moveTo(-120, 0);
        ctx.quadraticCurveTo(-110, 35 + Math.sin(now * 0.005) * 5, -100, 5);
        ctx.quadraticCurveTo(-40, 45 + Math.cos(now * 0.004) * 6, -20, 5);
        ctx.quadraticCurveTo(50, 40 + Math.sin(now * 0.006) * 4, 70, 5);
        ctx.quadraticCurveTo(110, 30, 125, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Crisp Lettuce & Red Tomato Slice
        ctx.save();
        ctx.translate(0, 8 + floatBob);
        ctx.fillStyle = '#16a34a'; // Crisp green
        ctx.beginPath();
        ctx.ellipse(0, 0, 138, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626'; // Tomato
        ctx.beginPath();
        ctx.ellipse(20, -6, 120, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Golden Glazed Brioche Top Bun (descends dynamically)
        const topBunY = -40 + (1 - easeIn) * -90 + floatBob;
        ctx.save();
        ctx.translate(0, topBunY);
        // Bun body
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(0, 20, 135, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        // Golden glaze highlight
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.ellipse(-20, -50, 75, 18, -0.15, 0, Math.PI * 2);
        ctx.fill();

        // White sesame seeds on bun
        ctx.fillStyle = '#fffbeb';
        const sesames = [
          [-60, -25], [-30, -50], [0, -60], [35, -45], [60, -20],
          [-40, -10], [10, -30], [-10, 0], [40, -5]
        ];
        sesames.forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.ellipse(sx, sy, 3.5, 2, 0.4, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Steam Rising from hot burger
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let s = -1; s <= 1; s++) {
          ctx.beginPath();
          const sx = s * 55;
          const sy = topBunY - 40;
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(
            sx - 15, sy - 30 - (now * 0.04) % 20, 
            sx + 15, sy - 60 - (now * 0.04) % 20, 
            sx, sy - 90
          );
          ctx.stroke();
        }
        ctx.restore();

      } else if (scene === 1) {
        // ==========================================
        // SCENE 2: Artisan Cheese Burst Pizza
        // ==========================================
        const floatBob = Math.sin(now * 0.0035) * 8;
        const cheeseStretch = Math.sin(now * 0.004) * 12;

        // Shadow
        ctx.save();
        ctx.translate(0, 110 + floatBob);
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 170, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Woodfire Pizza Pie (Tilted 3D perspective)
        ctx.save();
        ctx.translate(0, 20 + floatBob);
        ctx.rotate(0.08);

        // Crispy Sourdough Crust
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(0, 0, 175, 95, 0, 0, Math.PI * 2);
        ctx.fill();

        // Charred Leopard Spots on Crust
        ctx.fillStyle = '#290e03';
        const charSpots = [
          [-140, -30], [-100, -75], [0, -92], [110, -70], [150, -20],
          [130, 50], [0, 88], [-120, 55]
        ];
        charSpots.forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.ellipse(cx, cy, 7, 4, 0.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Golden Melted Mozzarella Surface
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.ellipse(0, 0, 150, 80, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pepperoni & Herb Toppings
        const toppings = [
          [-60, -25], [10, -40], [70, -20], [-40, 25], [30, 25], [80, 30], [-10, 0]
        ];
        toppings.forEach(([tx, ty], i) => {
          // Pepperoni slice
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.ellipse(tx, ty, 18, 12, 0.3, 0, Math.PI * 2);
          ctx.fill();
          // Pepperoni rim
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Green basil / oregano flakes
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(tx + (i % 2 === 0 ? 12 : -12), ty - 8, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Animated Cheese Pull Slice lifting out
        ctx.save();
        ctx.translate(0, -40 - Math.abs(cheeseStretch));
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-50, -60);
        ctx.lineTo(50, -60);
        ctx.closePath();
        ctx.fill();

        // Golden gooey cheese strings connecting slice to pie
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-45, -55);
        ctx.quadraticCurveTo(-30, 0, -25, 20 + cheeseStretch);
        ctx.moveTo(0, -50);
        ctx.quadraticCurveTo(5, 5, 10, 25 + cheeseStretch);
        ctx.moveTo(45, -55);
        ctx.quadraticCurveTo(30, 0, 25, 20 + cheeseStretch);
        ctx.stroke();
        ctx.restore();

        ctx.restore();

      } else {
        // ==========================================
        // SCENE 3: Mr. Bun Brand Mascot & Party Box
        // ==========================================
        const bounce = Math.sin(now * 0.005) * 8;
        const mascotWink = Math.sin(now * 0.003) > 0.6;

        // Radiant Sunburst Rays in background
        ctx.save();
        ctx.rotate(now * 0.0008);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        for (let ray = 0; ray < 12; ray++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 240, (ray * Math.PI) / 6, (ray * Math.PI) / 6 + 0.25);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Draw Preloaded Mr Bun Mascot Image if available
        if (mascotImgRef.current && mascotImgRef.current.complete) {
          ctx.save();
          ctx.translate(0, bounce);
          const imgW = 280;
          const imgH = (mascotImgRef.current.naturalHeight / (mascotImgRef.current.naturalWidth || 1)) * imgW || 240;
          
          // Card glow border behind mascot
          ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
          ctx.shadowBlur = 30;
          ctx.drawImage(mascotImgRef.current, -imgW / 2, -imgH / 2, imgW, imgH);
          ctx.restore();
        } else {
          // Fallback vector mascot illustration
          ctx.save();
          ctx.translate(0, bounce);
          // Pizza Box base
          ctx.fillStyle = '#b45309';
          ctx.fillRect(-110, 10, 220, 80);
          // Burger face
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, -10, 75, 0, Math.PI * 2);
          ctx.fill();
          // Hat
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-50, -95, 100, 40);
          ctx.fillRect(-70, -60, 140, 10);
          // Smile & Mustache
          ctx.fillStyle = '#331502';
          ctx.beginPath();
          ctx.arc(0, 12, 30, 0, Math.PI);
          ctx.fill();
          // Thumbs up
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(85, -5, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Celebratory Party Confetti Shower
        ctx.save();
        const confettis: Array<{ x: number; y: number; color: string }> = [
          { x: -140, y: -120, color: '#ef4444' },
          { x: -90, y: -160, color: '#3b82f6' },
          { x: 120, y: -140, color: '#10b981' },
          { x: 160, y: -90, color: '#f59e0b' },
          { x: -160, y: 40, color: '#a855f7' },
          { x: 150, y: 60, color: '#ec4899' }
        ];
        confettis.forEach((item, ci) => {
          ctx.fillStyle = item.color;
          ctx.save();
          ctx.translate(item.x, item.y + (now * 0.05 + ci * 20) % 250 - 100);
          ctx.rotate(now * 0.004 + ci);
          ctx.fillRect(-6, -3, 12, 6);
          ctx.restore();
        });
        ctx.restore();
      }

      ctx.restore(); // restore center translation

      // 5. Floating Accent Foodie Emojis around screen
      sparkles.forEach((spk) => {
        spk.rot += spk.speed;
        const fy = spk.y + Math.sin(now * 0.003 + spk.x) * 6;
        ctx.save();
        ctx.translate(spk.x, fy);
        ctx.rotate(spk.rot);
        ctx.font = `${spk.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(spk.emoji, 0, 0);
        ctx.restore();
      });

      // 6. Kinetic Scene Caption / Food Title Bar
      ctx.save();
      const titles = [
        { main: 'BRIOCHE SMASH BURGER', sub: 'Double Patty • Melted Cheddar • Fresh Grilled' },
        { main: 'CHEESE BURST PIZZA', sub: 'Artisan Sourdough • 100% Real Dairy Mozzarella' },
        { main: `${brandName.toUpperCase()} PARTY FEAST`, sub: 'Fresh Everyday • Bulk Orders Up to 20% OFF' }
      ];

      const currentTitle = titles[scene];
      
      // Bottom title banner
      ctx.fillStyle = 'rgba(15, 6, 2, 0.75)';
      ctx.fillRect(0, H - 75, W, 75);

      // Accent border
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, H - 75, W, 2);

      // Title Text
      ctx.font = 'bold 18px "Montserrat", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(currentTitle.main, W / 2, H - 46);

      // Subtitle
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(currentTitle.sub, W / 2, H - 24);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, currentTime, brandName]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md select-none py-2 px-1"
    >
      {/* Warm Ambient Glow behind Video Player */}
      <div className="absolute inset-0 -m-5 bg-gradient-to-tr from-amber-500/35 via-orange-600/30 to-red-600/25 rounded-[2.5rem] blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Floating Badge 1: Top-Left Rating (Matches brand screenshot) */}
      <div 
        className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-white/95 backdrop-blur-md border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 z-30 transition transform hover:scale-105"
        style={{ animation: 'floatSlow 4s ease-in-out infinite' }}
      >
        <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shadow-md">
          <Star className="w-3.5 h-3.5 fill-white text-white" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-900 leading-tight">4.9 / 5.0 Rating</p>
          <p className="text-[10px] font-semibold text-slate-500 leading-tight">1,500+ Happy Foodies</p>
        </div>
      </div>

      {/* Floating Badge 2: Bottom-Right Party Discount (Matches brand screenshot) */}
      <div 
        onClick={onOpenPartyModal}
        className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-gradient-to-r from-red-600 to-amber-600 text-white px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2 z-30 cursor-pointer border border-amber-300/40 transition transform hover:scale-105 active:scale-95"
        style={{ animation: 'floatSlowAlt 4.5s ease-in-out infinite' }}
        title="View party bulk packages"
      >
        <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide flex items-center gap-1">
            <span>PARTY DISCOUNT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping inline-block" />
          </p>
          <p className="text-[10px] font-medium text-amber-100">Up to 20% OFF on Bulk</p>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-4 border-amber-400 shadow-[0_20px_50px_rgba(217,119,6,0.25)] group">
        
        {/* Cinematic Viewfinder Corner Brackets */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-amber-400/80 pointer-events-none z-20" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-400/80 pointer-events-none z-20" />
        <div className="absolute bottom-16 left-3 w-4 h-4 border-b-2 border-l-2 border-amber-400/80 pointer-events-none z-20" />
        <div className="absolute bottom-16 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-400/80 pointer-events-none z-20" />

        {/* Top Video HUD Status Bar */}
        <div className="absolute top-3 inset-x-8 flex items-center justify-between z-20 pointer-events-none">
          {/* Live REC Indicator */}
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-[10px] font-bold">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-red-500 font-black tracking-wider">● REC</span>
            <span className="text-slate-400">| 4K 60FPS</span>
          </div>

          {/* Scene Jump Pills */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              onClick={() => jumpToScene(0)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                activeScene === 0 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-black/50 text-white/70 hover:bg-black/80'
              }`}
            >
              🍔 Burger
            </button>
            <button
              onClick={() => jumpToScene(1)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                activeScene === 1 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-black/50 text-white/70 hover:bg-black/80'
              }`}
            >
              🍕 Pizza
            </button>
            <button
              onClick={() => jumpToScene(2)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition ${
                activeScene === 2 ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-black/50 text-white/70 hover:bg-black/80'
              }`}
            >
              🎉 Mr. Bun
            </button>
          </div>
        </div>

        {/* Canvas Video Viewport */}
        <canvas
          ref={canvasRef}
          width={800}
          height={680}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full h-auto aspect-[4/3.4] object-cover cursor-pointer block"
          title="Click to play / pause video"
        />

        {/* Pause Overlay Icon */}
        {!isPlaying && (
          <div 
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform hover:scale-110 transition">
              <Play className="w-8 h-8 fill-slate-950 ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Interactive Video Player Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-6 pb-2.5 px-4 z-20 transition-opacity duration-300">
          
          {/* Timeline Progress Bar */}
          <div 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setCurrentTime(pos * DURATION);
            }}
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden group/bar mb-2.5"
          >
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all duration-100 relative"
              style={{ width: `${(currentTime / DURATION) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white text-xs">
            
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-amber-400 transition"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button 
                onClick={() => setCurrentTime(0)}
                className="hover:text-amber-400 transition text-slate-400 hover:text-white"
                title="Restart Animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Timecode */}
              <span className="font-mono text-[11px] text-slate-300">
                {formatTime(currentTime)} / {formatTime(DURATION)}
              </span>
            </div>

            {/* Sound & Fullscreen */}
            <div className="flex items-center gap-3">
              {/* Sound Toggle (Ambient Skillet Audio Synth) */}
              <button
                onClick={toggleSound}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition text-[11px]"
                title={isMuted ? 'Turn on kitchen sizzle sound' : 'Mute'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-400">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    {/* Animated Equalizer Waves */}
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-amber-400 h-2 animate-bounce" style={{ animationDuration: '0.6s' }} />
                      <span className="w-0.5 bg-amber-400 h-3 animate-bounce" style={{ animationDuration: '0.4s' }} />
                      <span className="w-0.5 bg-amber-400 h-1.5 animate-bounce" style={{ animationDuration: '0.5s' }} />
                    </div>
                  </>
                )}
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="hover:text-amber-400 transition text-slate-400 hover:text-white"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Under-player Shadow */}
      <div className="w-4/5 h-4 mx-auto mt-2 bg-amber-950/20 rounded-full blur-md" />
    </div>
  );
};
