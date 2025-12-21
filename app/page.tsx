'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, Palette, Code2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isLaunching, setIsLaunching] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stars, setStars] = useState<Array<{ top: string; left: string; opacity: number; scale: number; animationDuration: string }>>([]);
  const [smallStars, setSmallStars] = useState<Array<{ top: string; left: string; opacity: number }>>([]);

  React.useEffect(() => {
    // Generate stars on client side only to avoid hydration mismatch
    setStars([...Array(100)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.8 + 0.2,
      scale: Math.random() * 0.6 + 0.4,
      animationDuration: `${Math.random() * 3 + 2}s`
    })));

    setSmallStars([...Array(400)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.6 + 0.2,
    })));
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunch = () => {
    setIsLaunching(true);

    // Fade out content after arrow has traveled a bit (600ms)
    setTimeout(() => {
      setIsFadingOut(true);
    }, 600);

    // Navigate after fade out is mostly done
    setTimeout(() => {
      router.push('/editor');
    }, 1500);
  };

  return (
    <main className={`flex-1 flex flex-col items-center justify-center min-h-screen relative overflow-hidden text-white selection:bg-indigo-500/30 transition-colors duration-1000 ease-in-out ${isFadingOut ? 'bg-black' : 'bg-[#0a0a0a]'}`}>

      {/* Dynamic Background - Fades out on launch */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : ''}`}>

        {/* Rotating Star Field */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] animate-spin-slow opacity-70">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                top: star.top,
                left: star.left,
                opacity: star.opacity,
                transform: `scale(${star.scale})`,
                animation: `pulse ${star.animationDuration} infinite ease-in-out`
              }}
            />
          ))}
          {smallStars.map((star, i) => (
            <div
              key={`sm-${i}`}
              className="absolute w-[2px] h-[2px] bg-indigo-50 rounded-full"
              style={{
                top: star.top,
                left: star.left,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] rotate-12" />
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/18/Transparent_Square_Tiles_Texture.png')] opacity-[0.03] bg-repeat" />
      </div>

      {/* Brand Logo - Top Left */}
      <div
        className={`${isScrolled ? 'fixed' : 'absolute'} top-6 left-6 z-50 flex items-center gap-3 ${isFadingOut ? 'opacity-0' : 'opacity-100'} ${isScrolled ? 'backdrop-blur-xl bg-black/80 px-4 py-2 rounded-full border border-white/10' : ''}`}
        style={{
          transition: 'opacity 400ms ease-in-out, transform 400ms ease-out, background-color 400ms, backdrop-filter 400ms, border 400ms, padding 400ms',
          transform: isScrolled ? 'translateY(0)' : 'translateY(0)'
        }}
      >
        <div className="relative w-10 h-10 group cursor-default">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 transform rotate-45 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:animate-shimmer" />
          </div>
        </div>
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          SyntaRay
        </span>
      </div>

      {/* Created By Badge - Top Right */}
      <a
        href="https://github.com/ayazdoruck"
        target="_blank"
        rel="noopener noreferrer"
        className={`${isScrolled ? 'fixed' : 'absolute'} top-6 right-6 z-50 group flex items-center gap-1.5 font-medium active:scale-95 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 ${isFadingOut ? 'opacity-0' : 'opacity-100'} ${isScrolled ? 'backdrop-blur-xl bg-black/80' : 'bg-white/5'}`}
        style={{
          transition: 'opacity 400ms ease-in-out, transform 400ms ease-out, background-color 400ms, backdrop-filter 400ms',
          transform: isScrolled ? 'translateY(0)' : 'translateY(0)'
        }}
      >
        <span className="text-white/40 group-hover:text-white/60 transition-colors text-sm">
          created by
        </span>
        <span className="relative">
          <span className="text-indigo-400 group-hover:text-indigo-300 transition-colors drop-shadow-[0_0_8px_rgba(129,140,248,0.3)] text-sm">
            @ayazdoruck
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500/50 group-hover:w-full transition-all duration-300" />
        </span>
      </a>

      <div className="z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">

        {/* Content Wrapper for Fade Out */}
        <div className={`flex flex-col items-center w-full transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : ''}`}>
          {/* Badge */}
          <div className="mb-8 animate-fade-in-down">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-500/10">
              <Sparkles size={16} />
              <span>The Most Aesthetic Code Snippets</span>
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-fade-in-up space-y-4">
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm">
              Make Your Code
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
              Look Beautiful.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-12 animate-fade-in-up animation-delay-200 leading-relaxed">
            Create stunning, shareable code snippets in seconds. <br className="hidden md:block" />
            Choose from elegant themes, fonts, and backgrounds to make your work shine.
          </p>
        </div>

        {/* CTA Button - Kept outside fading wrapper so Arrow remains visible */}
        <div className="animate-fade-in-up animation-delay-400 relative group z-20 mb-20">
          <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-70 transition-opacity duration-1000 ease-in-out ${isFadingOut ? '!opacity-0' : isLaunching ? 'opacity-0 duration-300' : 'group-hover:opacity-100'}`} />
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`relative px-8 py-4 rounded-xl leading-none flex items-center gap-3 transition-all duration-1000 ease-in-out active:scale-95 ${isFadingOut ? 'bg-transparent' : 'bg-black'} ${isLaunching && !isFadingOut ? 'scale-95 bg-black/50 duration-200' : ''} ${!isLaunching ? 'group-hover:-translate-y-1 duration-200' : ''}`}
          >
            <span className={`font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white transition-opacity duration-300 ${isLaunching ? 'opacity-0' : ''}`}>
              Let's Try
            </span>
            <ArrowRight
              className={`text-white ${isLaunching ? 'animate-arrow-launch' : 'group-hover:translate-x-1 transition-transform'}`}
            />
          </button>
        </div>

        {/* Visual Content & Footer - Wrapped for Fade Out */}
        <div className={`w-full flex flex-col items-center transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : ''}`}>

          {/* Code Preview Section with Description */}
          <div className="w-full max-w-6xl mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">

            {/* Left: Description Text */}
            <div className="space-y-6 animate-fade-in-up animation-delay-600">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 drop-shadow-sm">
                  Code That
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg">
                  Speaks for Itself
                </span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Transform your code into stunning visual presentations. Perfect for documentation, social media, and portfolios.
              </p>
            </div>

            {/* Right: Code Window Mockup */}
            <div className="relative w-full h-64 md:h-80 animate-fade-in-up animation-delay-600 perspective-[2000px] group">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl transform -rotate-6 rounded-full opacity-60" />

              {/* The Window Card - Monokai Theme */}
              <div className="absolute inset-x-4 inset-y-0 bg-[#272822]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out overflow-hidden flex flex-col">
                {/* Window Header */}
                <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <div className="ml-4 h-2 w-32 bg-white/10 rounded-full" />
                </div>

                {/* Code Content - Monokai Palette */}
                <div className="p-6 font-mono text-sm md:text-base space-y-2 opacity-100">
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">1</span>
                    <span><span className="text-[#F92672]">const</span> <span className="text-[#66D9EF]">App</span> <span className="text-[#F92672]">=</span> <span className="text-[#FD971F]">()</span> <span className="text-[#F92672]">=</span><span className="text-[#F8F8F2]">&gt;</span> <span className="text-[#F8F8F2]">{'{'}</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">2</span>
                    <span className="pl-4"><span className="text-[#F92672]">return</span> <span className="text-[#F8F8F2]">(</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">3</span>
                    <span className="pl-8"><span className="text-[#F8F8F2]">&lt;</span><span className="text-[#66D9EF]">SyntaRay</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">4</span>
                    <span className="pl-12"><span className="text-[#A6E22E]">theme</span><span className="text-[#F92672]">=</span><span className="text-[#E6DB74]">"monokai"</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">5</span>
                    <span className="pl-12"><span className="text-[#A6E22E]">padding</span><span className="text-[#F92672]">=</span><span className="text-[#F8F8F2]">{'{'}</span><span className="text-[#AE81FF]">32</span><span className="text-[#F8F8F2]">{'}'}</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">6</span>
                    <span className="pl-8"><span className="text-[#F8F8F2]">/&gt;</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">7</span>
                    <span className="pl-4"><span className="text-[#F8F8F2]">);</span></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-500 select-none">8</span>
                    <span><span className="text-[#F8F8F2]">{'}'}</span><span className="text-[#F8F8F2]">;</span></span>
                  </div>
                </div>

                {/* Highlight Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl animate-fade-in-up animation-delay-600 px-4">
            {[
              {
                icon: <Palette size={28} className="text-pink-400 group-hover:drop-shadow-[0_0_15px_rgba(244,114,182,0.5)] transition-all duration-500" />,
                title: "Modern Themes",
                desc: "Curated aesthetic gradients and presets."
              },
              {
                icon: <Code2 size={28} className="text-indigo-400 group-hover:drop-shadow-[0_0_15px_rgba(129,140,248,0.5)] transition-all duration-500" />,
                title: "Smart Syntax",
                desc: "Auto-detection for 20+ languages."
              },
              {
                icon: <Zap size={28} className="text-yellow-400 group-hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all duration-500" />,
                title: "Instant Export",
                desc: "Export 4K PNG, JPG, or SVG instantly."
              }
            ].map((feature, i) => (
              <div key={i} className="relative group overflow-hidden rounded-3xl p-[1px]">
                {/* Border Gradient Outline */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Content */}
                <div className="relative h-64 bg-[#0a0a0a]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500 hover:-translate-y-1 hover:bg-[#0a0a0a]/60">

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Icon Container */}
                  <div className="relative mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-500">
                    {feature.icon}
                  </div>

                  {/* Text */}
                  <h3 className="relative text-xl font-bold mb-2 text-white group-hover:text-indigo-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm text-gray-400 group-hover:text-gray-300 leading-relaxed max-w-[220px] transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-24 mb-12 flex flex-col items-center gap-6 animate-fade-in text-sm">
            {/* Product Hunt Badge */}
            <a
              href="https://www.producthunt.com/products/syntaray?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-syntaray"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1052897&theme=dark"
                alt="SyntaRay - Create beautiful code snippets | Product Hunt"
                style={{ width: '180px', height: '40px' }}
                width="180"
                height="40"
              />
            </a>

            {/* Development Warning */}
            <div className="max-w-2xl mx-auto px-6 py-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <p className="text-red-200 font-medium">⚠️ Under Active Development</p>
                </div>
                <p className="text-red-300/70 text-xs leading-relaxed max-w-lg">
                  This project is currently in active development. Some features may be incomplete or contain bugs. Your feedback is appreciated.
                </p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </main>
  );
}
