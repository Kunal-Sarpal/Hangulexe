import React, { useEffect, useRef } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { navigate } from '../../hooks/useRouter';
import { gsap } from 'gsap';

function AnimatedGrid() {
  const gridRef = useRef(null);

  useEffect(() => {
    gsap.to(gridRef.current, {
      backgroundPosition: '50px 50px',
      duration: 8,
      repeat: -1,
      ease: "none"
    });
  }, []);

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(250, 204, 21, 0.25) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(250, 204, 21, 0.25) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        WebkitMaskImage: 'radial-gradient(circle at center, transparent 10%, black 80%)',
        maskImage: 'radial-gradient(circle at center, transparent 10%, black 80%)'
      }}
    />
  );
}

function Marquee() {
  const containerRef = useRef(null);
  const anims = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const a1 = gsap.to(".marquee-1-content", {
        xPercent: -50,
        repeat: -1,
        duration: 45,
        ease: "linear"
      });
      const a2 = gsap.to(".marquee-2-content", {
        xPercent: -50,
        repeat: -1,
        duration: 35,
        ease: "linear"
      });
      anims.current = [a1, a2];
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => anims.current.forEach(a => a.pause());
  const handleMouseLeave = () => anims.current.forEach(a => a.play());

  return (
    <div 
      ref={containerRef} 
      className="absolute bottom-8 left-0 right-0 w-full z-40 flex flex-col justify-center drop-shadow-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full bg-yellow-400 py-3 md:py-4 -rotate-2 scale-110 shadow-2xl z-20 transition-transform hover:scale-110 hover:-rotate-1 cursor-pointer">
        <div className="marquee-1-content inline-flex font-black tracking-tight text-2xl md:text-5xl uppercase gap-6 w-max text-black items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-6 items-center whitespace-nowrap">
              <span>EXPLORE</span>
              <span className="text-black/60 font-serif italic lowercase font-medium text-xl md:text-4xl">premium collection</span>
              <span>•</span>
              <span>ELEVATE</span>
              <span className="text-black/60 font-serif italic lowercase font-medium text-xl md:text-4xl">your fits</span>
              <span>•</span>
              <span>DISCOVER</span>
              <span className="text-black/60 font-serif italic lowercase font-medium text-xl md:text-4xl">exclusive drops</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full bg-gray-900 py-3 md:py-4 rotate-2 scale-110 shadow-2xl z-10 -mt-6 md:-mt-8 transition-transform hover:scale-110 hover:rotate-1 cursor-pointer">
        <div className="marquee-2-content inline-flex font-black tracking-tight text-2xl md:text-5xl uppercase gap-6 w-max text-white items-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-6 items-center whitespace-nowrap">
              <span>JOIN THE MOVEMENT</span>
              <span className="text-yellow-400 font-serif italic lowercase font-medium text-xl md:text-4xl">@hanguluxe</span>
              <span>•</span>
              <span>STAY AHEAD</span>
              <span className="text-yellow-400 font-serif italic lowercase font-medium text-xl md:text-4xl">of the trend</span>
              <span>•</span>
              <span>REDEFINE</span>
              <span className="text-yellow-400 font-serif italic lowercase font-medium text-xl md:text-4xl">streetwear</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { trackEvent } = useAnalytics('/');

  const handleCategoryClick = (category) => {
    trackEvent('click', `category_card_${category}`);
    navigate(`/${category}`);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-80px)] overflow-y-auto pb-36 relative bg-[#FAF9F6] text-[#1C1B19]">
      {/* Hero Banner with GSAP Grid */}
      <div className="relative w-full overflow-hidden py-6 px-4 text-center border-b border-[#E6E2DA] flex-shrink-0">
        <AnimatedGrid />
        
        <div className="relative z-10">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[#1C1B19] tracking-widest mb-2 drop-shadow-sm uppercase">
            HANGULUXE
          </h1>
          <p className="text-xs md:text-sm text-[#6E6A63] max-w-2xl mx-auto font-semibold uppercase tracking-wider mb-3">
            Explore our newest collection of premium fits and exclusive designs.
          </p>
          <button 
            onClick={() => navigate('/product/hangul-tee')} 
            className="bg-[#1C1B19] text-[#FAF9F6] px-5 py-2 text-xs font-bold tracking-widest hover:opacity-90 uppercase border border-[#1C1B19] transition-all"
          >
            View Signature Drop: The Hangul Tee →
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full max-w-lg mx-auto px-4 py-8 mb-16 flex-1 flex justify-center items-center gap-4 relative z-10">
        
        {/* Men Card */}
        <div 
          onClick={() => handleCategoryClick('men')}
          className="relative group cursor-pointer flex-1 flex flex-col justify-end items-center"
        >
          <img 
            src="https://images.bewakoof.com/uploads/grid/app/gender-men-1766398718.png" 
            alt="Men's Collection" 
            className="w-full h-[80%] object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 max-w-[200px]">
            <button className="font-display w-full bg-white/90 backdrop-blur border-2 border-yellow-400 text-gray-900 font-black text-xl py-2 rounded shadow-lg transform transition-transform group-hover:-translate-y-1">
              MEN
            </button>
          </div>
        </div>

        {/* Women Card */}
        <div 
          onClick={() => handleCategoryClick('women')}
          className="relative group cursor-pointer flex-1 flex flex-col justify-end items-center"
        >
          <img 
            src="https://images.bewakoof.com/uploads/grid/app/gender-women-1766398717.png" 
            alt="Women's Collection" 
            className="w-full h-[80%] object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-xl"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 max-w-[200px]">
            <button className="font-display w-full bg-white/90 backdrop-blur border-2 border-yellow-400 text-gray-900 font-black text-xl py-2 rounded shadow-lg transform transition-transform group-hover:-translate-y-1">
              WOMEN
            </button>
          </div>
        </div>

      </div>

      {/* Premium Scrolling Marquee */}
      <Marquee />
    </div>
  );
}
