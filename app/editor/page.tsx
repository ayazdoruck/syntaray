'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import Controls from '@/components/Controls';
import CodeFrame from '@/components/CodeFrame';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { appTheme } = useStore();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-h-screen relative overflow-hidden">
      {/* Global Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-colors duration-1000">
        <div className={`absolute top-[-15%] right-[-15%] w-[800px] h-[800px] rounded-full blur-[180px] animate-pulse transition-all duration-1000 ${appTheme === 'dark' ? 'bg-purple-600/10' : 'bg-purple-600/30'}`} />
        <div className={`absolute bottom-[-15%] left-[-15%] w-[900px] h-[900px] rounded-full blur-[180px] animate-pulse transition-all duration-1000 ${appTheme === 'dark' ? 'bg-indigo-600/10' : 'bg-indigo-600/30'}`} style={{ animationDelay: '2s' }} />
        <div className={`absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-1000 ${appTheme === 'dark' ? 'bg-pink-600/5' : 'bg-pink-600/15'}`} />
      </div>

      {loading && <SplashScreen onFinish={() => setLoading(false)} />}

      <div className={`w-full max-w-5xl space-y-8 flex-1 flex flex-col items-center justify-center transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full flex flex-col items-center space-y-8 py-12">
          <Controls />
          <CodeFrame />
        </div>
      </div>

      {/* Product Hunt Badge - Fixed Bottom Left */}
      {!loading && (
        <a
          href="https://www.producthunt.com/products/syntaray?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-syntaray"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 left-4 z-50 transition-all duration-300 hover:scale-105 active:scale-95 hover:rotate-2 animate-fade-in hidden md:block"
        >
          <img
            src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1052897&theme=${appTheme === 'dark' ? 'dark' : 'light'}&t=${appTheme === 'dark' ? '1766341913514' : '1766342063585'}`}
            alt="SyntaRay - Create beautiful code snippets | Product Hunt"
            style={{ width: '180px', height: '39px' }}
            width="180"
            height="39"
          />
        </a>
      )}

      {/* Personalized Footer */}
      {!loading && (
        <footer className="w-full flex justify-center pb-8 animate-fade-in-up animation-delay-1000 z-10">
          <a
            href="https://github.com/ayazdoruck"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm font-medium transition-all duration-300 active:scale-95"
          >
            <span className={`transition-colors ${appTheme === 'dark' ? 'text-white/40 group-hover:text-white/60' : 'text-black/30 group-hover:text-black/50'}`}>
              created by
            </span>
            <span className="relative">
              <span className={`transition-colors drop-shadow-[0_0_8px_rgba(129,140,248,0.3)] ${appTheme === 'dark' ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-600 group-hover:text-indigo-500'}`}>
                @ayazdoruck
              </span>
              <span className={`absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 ${appTheme === 'dark' ? 'bg-indigo-500/50 group-hover:w-full' : 'bg-indigo-600/40 group-hover:w-full'}`} />
            </span>
            <svg
              className={`w-3 h-3 transition-colors mt-0.5 ${appTheme === 'dark' ? 'text-white/20 group-hover:text-white/40' : 'text-black/20 group-hover:text-black/40'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </footer>
      )}
    </main>
  );
}
