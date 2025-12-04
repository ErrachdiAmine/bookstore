import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, TrendingUp, Link as LinkIcon, HelpCircle, FileText, Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSteps = 5; // Intro (0), Pillars 1-3 (1,2,3), Missing Piece (4)

  const nextStep = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  // Listen for fullscreen change events (e.g. user pressing Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    // Changed from "relative" to "fixed inset-0 z-50" to force it to cover the entire viewport
    // regardless of parent container constraints.
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0f1020] text-white font-sans selection:bg-pink-500 selection:text-white z-50">
      
      {/* --- BACKGROUND GLOW ANIMATION --- */}
      {/* This creates the persistent moving glow effect behind the content */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Left Purple Glow */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-700/30 rounded-full blur-[120px] mix-blend-screen transition-all duration-1000 ease-in-out"
          style={{ 
            transform: `translate(${currentStep * 10}px, ${currentStep * 5}px)`,
            opacity: currentStep === 0 ? 0.6 : 0.4
          }} 
        />
        {/* Center/Right Blue Glow */}
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[130px] mix-blend-screen transition-all duration-1000 ease-in-out"
          style={{ 
            transform: `translate(${-currentStep * 20}px, 0)`,
          }}
        />
        {/* Center Highlight (Changes position based on slide) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[100px] transition-all duration-700"
          style={{
            opacity: (currentStep >= 1 && currentStep <= 3) ? 0.6 : 0.2,
            background: currentStep === 4 ? 'rgba(236, 72, 153, 0.15)' : 'rgba(99, 102, 241, 0.15)' 
          }}
        />
      </div>

      {/* --- TOP CONTROLS --- */}
      <div className="absolute top-8 right-8 z-50">
        <button 
          onClick={toggleFullscreen}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5 backdrop-blur-sm"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 transition-all duration-700">
        
        {/* SLIDE 0: INTRODUCTION */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${
            currentStep === 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'
          }`}
        >
          <div className="relative z-10 text-center">
            <h1 className="text-7xl md:text-9xl font-serif font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-lg">
              Learning<br />Autonomy
            </h1>
            <p className="text-sm md:text-base tracking-[0.3em] text-blue-200/70 uppercase font-medium mt-6">
              The Introduction
            </p>
          </div>
          
          {/* Decorative Circle (now supports an image placed at /public/magic-book.png) */}
          <div className="mt-16 w-64 h-64 rounded-full bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md border border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Image: place the attached picture at public/magic-book.png to see it here. */}
            <img
              src="/magic-book.jpg"
              alt="Decorative book"
              className="w-56 h-56 object-cover rounded-full transform transition-transform duration-700 ease-in-out"
              onError={(e) => {
                // If image is missing, keep the gradient fallback by hiding the broken image element
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* Gradient overlay (fallback / tint) */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60" />
          </div>
        </div>


        {/* SLIDES 1-3: THE THREE PILLARS (Carousel) */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${
            (currentStep >= 1 && currentStep <= 3) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 transition-all duration-500">The Three Pillars</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-6xl perspective-1000">
            {/* CARDS */}
            {[
              { id: 1, title: 'Definition', subtitle: 'THE FOUNDATION', icon: BookOpen, number: '01' },
              { id: 2, title: 'Importance', subtitle: 'MODERN EDUCATION', icon: TrendingUp, number: '02' },
              { id: 3, title: 'The Connection', subtitle: 'SELF-DIRECTED LEARNING', icon: LinkIcon, number: '03' }
            ].map((card, index) => {
              const isActive = currentStep === index + 1;
              const isPast = currentStep > index + 1;
              const isFuture = currentStep < index + 1;
              
              // Calculate dynamic styles based on active step
              // This creates the "between the cards" animation flow
              let containerClasses = "relative w-full md:w-[350px] h-[400px] rounded-3xl p-8 flex flex-col justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] border border-white/10 shadow-2xl";
              
              if (isActive) {
                containerClasses += " bg-white/10 backdrop-blur-xl scale-110 z-20 opacity-100 ring-1 ring-white/20";
              } else {
                containerClasses += " bg-white/5 backdrop-blur-sm scale-90 z-10 opacity-40 grayscale-[50%]";
              }

              return (
                <div 
                  key={card.id} 
                  className={containerClasses}
                  onClick={() => setCurrentStep(index + 1)}
                  style={{
                    transform: isActive ? 'translateY(0) scale(1.05)' : 'translateY(0) scale(0.9)',
                    boxShadow: isActive ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none'
                  }}
                >
                  {/* Card Background Number */}
                  <span className={`absolute top-4 right-6 text-8xl font-serif font-bold transition-colors duration-500 ${isActive ? 'text-white/5' : 'text-white/5'}`}>
                    {card.number}
                  </span>

                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/5 text-gray-400'}`}>
                    <card.icon size={24} />
                  </div>

                  {/* Text Content */}
                  <h3 className="text-3xl font-bold mb-2">{card.title}</h3>
                  <p className={`text-xs tracking-widest uppercase font-semibold mb-6 transition-colors duration-500 ${isActive ? 'text-indigo-300' : 'text-gray-500'}`}>
                    {card.subtitle}
                  </p>
                  
                  {/* Decorative Line */}
                  <div className={`h-1 rounded-full transition-all duration-700 ${isActive ? 'w-12 bg-indigo-500' : 'w-4 bg-gray-700'}`}></div>

                  {/* Subtle Glow inside card */}
                  {isActive && (
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SLIDE 4: THE MISSING PIECE */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${
            currentStep === 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
          }`}
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-8 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-pulse-slow">
            <HelpCircle size={36} className="text-pink-300" />
          </div>

          <h2 className="text-5xl md:text-6xl font-serif text-white mb-8 text-center">The Missing Piece</h2>
          
          <div className="text-center max-w-2xl space-y-4 mb-12">
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
              If Autonomy is the <span className="text-pink-400 font-semibold">"Will"</span>,
            </p>
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
              Multiple Intelligences provide the <span className="text-blue-400 font-semibold">"Way"</span>.
            </p>
          </div>

          <button className="px-8 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-xs tracking-[0.2em] uppercase text-gray-300 hover:text-white backdrop-blur-md">
            Next: Gardner's Theory
          </button>
        </div>

      </div>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <div className="absolute bottom-8 left-8 z-20">
        <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-pink-400 transition-colors border border-white/5">
          <FileText size={20} />
        </button>
      </div>

      <div className="absolute bottom-8 right-8 z-20 flex gap-4">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 ${
            currentStep === 0 ? 'bg-transparent text-gray-600 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-white'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={nextStep}
          disabled={currentStep === totalSteps - 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 transition-all duration-300 ${
            currentStep === totalSteps - 1 ? 'bg-transparent text-gray-600 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Navigation Indicators (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${
              currentStep === i ? 'w-8 bg-white' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

    </div>
  );
}