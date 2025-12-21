'use client';

import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Wait for window load + minimum time
        const minTime = 2000; // 2 seconds minimum for the premium feel
        const start = Date.now();

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, minTime - elapsed);

            setTimeout(() => {
                setIsExiting(true);
                setTimeout(onFinish, 500); // Wait for fade out animation
            }, remaining);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, [onFinish]);

    if (!onFinish) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ease-in-out ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="relative flex flex-col items-center">
                {/* Logo / Icon Animation */}
                <div className="relative w-24 h-24 mb-8 opacity-0 animate-fade-in-up animation-delay-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-2xl animate-pulse opacity-50" />
                    <div className="relative w-full h-full bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden group">
                        {/* Diamond Logo */}
                        <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 z-10 transition-transform duration-500 group-hover:scale-110">
                            <div className="w-5 h-5 border-2 border-white/80 rounded-sm transform rotate-45" />
                        </div>
                        {/* Subtle pulse ring */}
                        <div className="absolute w-16 h-16 border border-indigo-500/20 rounded-full animate-ping opacity-20" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                    </div>
                </div>

                {/* Text */}
                <h1 className="text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 opacity-0 animate-fade-in-up animation-delay-500">
                    SyntaRay
                </h1>
                <p className="mt-4 text-sm font-bold tracking-[0.2em] text-white/50 opacity-0 animate-fade-in-up animation-delay-700">
                    Powerful • Fast • Minimal
                </p>

                {/* Loading Bar */}
                <div className="mt-8 w-48 h-1 bg-gray-800 rounded-full overflow-hidden opacity-0 animate-fade-in-up animation-delay-1000">
                    <div className="h-full bg-indigo-500 animate-loading-bar rounded-full" />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes loading-bar {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 70%; transform: translateX(0%); }
                    100% { width: 100%; transform: translateX(0%); }
                }
                .animate-loading-bar {
                     animation: loading-bar 2s ease-in-out infinite;
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1.5s ease-out forwards;
                }
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                .animation-delay-600 {
                    animation-delay: 600ms;
                }
            `}</style>
        </div>
    );
}
