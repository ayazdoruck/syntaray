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

      <div className={`w-full max-w-5xl space-y-8 flex flex-col items-center transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Controls />
        <CodeFrame />
      </div>

      {/* Personalized Footer */}
      {!loading && (
        <footer className="mt-12 mb-8 animate-fade-in-up animation-delay-1000">
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
