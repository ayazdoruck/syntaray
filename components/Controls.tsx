'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Download, Copy, Settings, Check, ChevronDown, Image as ImageIcon, Upload, Moon, Sun, Palette, Zap, RotateCcw } from 'lucide-react';
import { downloadImage, copyImageToClipboard } from '@/lib/export';
import { HexColorPicker } from 'react-colorful';

const THEME_GROUPS = {
    'Dark': [
        'one-dark-pro', 'dracula', 'dracula-soft', 'github-dark', 'github-dark-dimmed',
        'monokai', 'night-owl', 'nord', 'material-theme', 'material-theme-ocean',
        'material-theme-palenight', 'material-theme-darker', 'poimandres', 'rose-pine',
        'rose-pine-moon', 'solarized-dark', 'tokyo-night', 'vitesse-dark',
        'andromeeda', 'aurora-x', 'ayu-dark', 'dark-plus', 'synthwave-84', 'slack-dark'
    ],
    'Light': [
        'github-light', 'solarized-light', 'light-plus', 'material-theme-lighter',
        'min-light', 'rose-pine-dawn', 'slack-ochin', 'vitesse-light', 'catppuccin-latte'
    ],
    'Colorful': [
        'catppuccin-frappe', 'catppuccin-macchiato', 'catppuccin-mocha'
    ]
};

const FONTS = [
    { name: 'JetBrains Mono', value: 'JetBrains Mono' },
    { name: 'Fira Code', value: 'Fira Code' },
    { name: 'IBM Plex Mono', value: 'IBM Plex Mono' },
    { name: 'Source Code Pro', value: 'Source Code Pro' },
    { name: 'Inconsolata', value: 'Inconsolata' },
    { name: 'Anonymous Pro', value: 'Anonymous Pro' },
    { name: 'Geist Mono', value: 'Geist Mono' },
    { name: 'Custom Font...', value: 'custom' },
];

const LANGUAGES = [
    'auto',
    'javascript', 'typescript', 'tsx', 'jsx', 'python', 'html', 'css',
    'json', 'bash', 'go', 'rust', 'java', 'c', 'cpp', 'csharp', 'php',
    'kotlin', 'swift', 'ruby', 'sql', 'yaml', 'markdown', 'vue', 'svelte'
];

const GRADIENTS = [
    { name: 'Sunset', value: 'linear-gradient(140deg, rgb(255, 207, 115), rgb(255, 122, 47))' },
    { name: 'Lavender', value: 'linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248))' },
    { name: 'Ocean', value: 'linear-gradient(140deg, rgb(66, 211, 146), rgb(92, 187, 246))' },
    { name: 'Sky', value: 'linear-gradient(140deg, rgb(89, 212, 242), rgb(44, 125, 250))' },
    { name: 'Melon', value: 'linear-gradient(140deg, rgb(255, 119, 115), rgb(255, 237, 175))' },
    { name: 'Neon', value: 'linear-gradient(140deg, rgb(42, 252, 152), rgb(41, 143, 161))' },
    { name: 'Peachy', value: 'linear-gradient(140deg, rgb(255, 204, 128), rgb(255, 107, 107))' },
    { name: 'Emerald', value: 'linear-gradient(140deg, rgb(189, 255, 243), rgb(74, 194, 154))' },
    { name: 'Night', value: 'linear-gradient(140deg, rgb(0, 0, 0), rgb(67, 67, 67))' },
    { name: 'Concrete', value: 'linear-gradient(140deg, rgb(204, 204, 204), rgb(112, 112, 112))' },
];

export default function Controls() {
    const {
        theme, setTheme,
        language, setLanguage,
        background, setBackground,
        padding, setPadding,
        fontFamily, setFontFamily,
        fontSize, setFontSize,
        showLineNumbers, setShowLineNumbers,
        windowTheme, setWindowTheme,
        hasShadow, setHasShadow,
        watermark, setWatermark,
        fileName, setFileName,
        showFileName, setShowFileName,
        appTheme, setAppTheme,
        editorWidth, setEditorWidth,
        editorHeight, setEditorHeight,
        frameWidth, setFrameWidth,
        frameHeight, setFrameHeight,
        lineHeight, setLineHeight,
        letterSpacing, setLetterSpacing,
        customWindowBg, setCustomWindowBg,
        borderRadius, setBorderRadius,
        glassOpacity, setGlassOpacity,
        glassBlur, setGlassBlur,
        showGrain, setShowGrain,
        exportPixelRatio, setExportPixelRatio,
        highlightedLines, setHighlightedLines,
        setToast, setDialog, reset
    } = useStore();

    const [copying, setCopying] = useState(false);

    // Custom Color State
    const [solidColor, setSolidColor] = useState('#aabbcc');
    const [gradientStart, setGradientStart] = useState('#ec4899');
    const [gradientEnd, setGradientEnd] = useState('#8b5cf6');
    const [gradientAngle, setGradientAngle] = useState(140);
    const [colorMode, setColorMode] = useState<'solid' | 'gradient' | 'image'>('solid');
    const [activeStop, setActiveStop] = useState<'start' | 'end'>('start');

    const [activePopover, setActivePopover] = useState<'bg' | 'settings' | 'export' | 'theme' | 'language' | null>(null);
    const [settingsTab, setSettingsTab] = useState<'window' | 'editor' | 'misc'>('window');

    const bgFileInputRef = useRef<HTMLInputElement>(null);
    const configFileInputRef = useRef<HTMLInputElement>(null);
    const fontInputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close popover on click outside with safe check
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                // We only close if activePopover is NOT null
                if (activePopover) {
                    setActivePopover(null);
                }
            }
        }
        // Bind the event listener to document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activePopover]);

    // Update HTML class for app theme
    useEffect(() => {
        if (appTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.setProperty('--bg-color', '#0f0f11'); // Slightly lighter than black
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.body.style.background = 'radial-gradient(circle at top, #1a1a20, #0a0a0a)'; // Subtle gradient
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.setProperty('--bg-color', '#f3f4f6');
            document.documentElement.style.setProperty('--text-color', '#1f2937');
            document.body.style.background = 'radial-gradient(circle at top, #ffffff, #f0f2f5)';
        }
    }, [appTheme]);

    const toggleAppTheme = () => {
        setAppTheme(appTheme === 'dark' ? 'light' : 'dark');
    };

    const handleExport = async (format: 'png' | 'svg' | 'jpeg' | 'webp') => {
        await downloadImage('code-frame-export', format, 'syntaray', exportPixelRatio);
    };

    const handleCopy = async () => {
        setCopying(true);
        try {
            await copyImageToClipboard('code-frame-export', exportPixelRatio);
            setTimeout(() => setCopying(false), 2000);
        } catch {
            setCopying(false);
        }
    };

    const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fontName = file.name.split('.')[0].replace(/\s+/g, '-');
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const fontFace = new FontFace(fontName, `url(${event.target.result})`);
                    fontFace.load().then((loadedFace) => {
                        document.fonts.add(loadedFace);
                        setFontFamily(fontName);
                        setToast({ message: `Custom font "${fontName}" loaded!`, type: 'success' });
                    }).catch(err => {
                        console.error('Font loading failed:', err);
                        setToast({ message: 'Failed to load font file.', type: 'error' });
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopyShareLink = () => {
        const state = useStore.getState();
        const data = {
            c: state.code,
            l: state.language,
            t: state.theme,
            b: state.background,
            p: state.padding,
            f: state.fontFamily,
            fs: state.fontSize,
            wt: state.windowTheme,
            go: state.glassOpacity,
            gb: state.glassBlur,
            sg: state.showGrain,
        };
        const hash = btoa(encodeURIComponent(JSON.stringify(data)));
        const url = `${window.location.origin}${window.location.pathname}#${hash}`;
        navigator.clipboard.writeText(url).then(() => {
            setToast({ message: 'Share link copied to clipboard!', type: 'success' });
        });
    };

    // Auto-import from hash
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                try {
                    const data = JSON.parse(decodeURIComponent(atob(hash)));
                    const store = useStore.getState();
                    if (data.c) store.setCode(data.c);
                    if (data.l) store.setLanguage(data.l);
                    if (data.t) store.setTheme(data.t);
                    if (data.b) store.setBackground(data.b);
                    if (data.p) store.setPadding(data.p);
                    if (data.f) store.setFontFamily(data.f);
                    if (data.fs) store.setFontSize(data.fs);
                    if (data.wt) store.setWindowTheme(data.wt);
                    if (data.go !== undefined) store.setGlassOpacity(data.go);
                    if (data.gb !== undefined) store.setGlassBlur(data.gb);
                    if (data.sg !== undefined) store.setShowGrain(data.sg);
                    window.history.replaceState(null, '', ' '); // Clean hash
                } catch (e) {
                    console.error('Failed to parse share link data', e);
                }
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // --- Misc Handlers ---

    const handleReset = () => {
        setDialog({
            title: 'Reset All Settings',
            message: 'Are you sure you want to reset all settings to default? This action cannot be undone.',
            onConfirm: () => {
                reset();
                setToast({ message: 'All settings have been reset', type: 'info' });
            }
        });
    };

    const handleExportConfig = () => {
        const state = useStore.getState();
        // Exclude transient/internal state if any (like toast, dialog, copying)
        const { toast, dialog, ...config } = state;

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `syntaray-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const config = JSON.parse(event.target?.result as string);
                const store = useStore.getState();

                // Object of valid setter keys to check against
                const setters: Record<string, any> = {
                    code: store.setCode,
                    language: store.setLanguage,
                    theme: store.setTheme,
                    background: store.setBackground,
                    padding: store.setPadding,
                    showLineNumbers: store.setShowLineNumbers,
                    showWindowControls: store.setShowWindowControls,
                    fileName: store.setFileName,
                    showFileName: store.setShowFileName,
                    fontFamily: store.setFontFamily,
                    fontSize: store.setFontSize,
                    windowTheme: store.setWindowTheme,
                    borderRadius: store.setBorderRadius,
                    hasShadow: store.setHasShadow,
                    watermark: store.setWatermark,
                    appTheme: store.setAppTheme,
                    editorWidth: store.setEditorWidth,
                    editorHeight: store.setEditorHeight,
                    frameWidth: store.setFrameWidth,
                    frameHeight: store.setFrameHeight,
                    lineHeight: store.setLineHeight,
                    letterSpacing: store.setLetterSpacing,
                    customWindowBg: store.setCustomWindowBg,
                    highlightedLines: store.setHighlightedLines,
                    exportPixelRatio: store.setExportPixelRatio,
                    glassOpacity: store.setGlassOpacity,
                    glassBlur: store.setGlassBlur,
                    showGrain: store.setShowGrain,
                };

                // Apply each value from config if a setter exists
                Object.keys(config).forEach(key => {
                    if (setters[key] && config[key] !== undefined) {
                        setters[key](config[key]);
                    }
                });

                setToast({ message: 'Configuration fully restored!', type: 'success' });
            } catch (err) {
                console.error('Failed to parse config:', err);
                setToast({ message: 'Invalid configuration file.', type: 'error' });
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    // ----------------------

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setBackground(`url(${event.target.result}) center/cover no-repeat`);
                    setColorMode('image');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const updateGradient = (start: string, end: string, angle: number) => {
        const bg = `linear-gradient(${angle}deg, ${start}, ${end})`;
        setBackground(bg);
    };

    const handleColorChange = (newColor: string) => {
        if (colorMode === 'solid') {
            setSolidColor(newColor);
            setBackground(newColor);
        } else if (colorMode === 'gradient') {
            if (activeStop === 'start') {
                setGradientStart(newColor);
                updateGradient(newColor, gradientEnd, gradientAngle);
            } else {
                setGradientEnd(newColor);
                updateGradient(gradientStart, newColor, gradientAngle);
            }
        }
    };

    // Dynamic Styles based on App Theme
    const glassyClass = appTheme === 'dark'
        ? 'bg-[#1e1e2e]/90 backdrop-blur-2xl border-white/20 text-gray-100 shadow-2xl shadow-black/20 ring-1 ring-white/10'
        : 'bg-white/80 backdrop-blur-2xl border-white/40 text-gray-800 shadow-xl shadow-black/5 ring-1 ring-black/5';

    const popoverClass = appTheme === 'dark'
        ? 'bg-[#1e1e2e]/95 backdrop-blur-3xl border-white/20 text-gray-200 shadow-2xl shadow-black/50 ring-1 ring-white/10'
        : 'bg-white/90 backdrop-blur-3xl border-gray-200/50 text-gray-800 shadow-2xl shadow-black/10 ring-1 ring-black/5';

    const inputClass = appTheme === 'dark'
        ? 'bg-black/20 border-white/10 hover:border-white/30 text-gray-100 focus:border-indigo-500/50 focus:bg-black/40'
        : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-800 focus:border-indigo-500';

    const settingsSidebarClass = appTheme === 'dark'
        ? 'bg-black/20 border-r border-white/10'
        : 'bg-black/[0.02] border-r border-black/5';

    const sectionBorderClass = appTheme === 'dark' ? 'border-white/5' : 'border-black/5';
    const sectionTitleClass = appTheme === 'dark' ? 'text-white/40' : 'text-black/40';

    // Toggle Switch Component
    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => {
        const [isClicking, setIsClicking] = useState(false);

        const handleClick = () => {
            setIsClicking(true);
            onChange();
            setTimeout(() => setIsClicking(false), 200);
        };

        return (
            <button
                onClick={handleClick}
                className={`w-11 h-6 rounded-full relative transition-all duration-500 overflow-hidden ${isClicking ? 'animate-toggle-click' : ''} ${checked ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}
            >
                {/* Glow Background for Active State */}
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-opacity duration-500 ${checked ? 'opacity-100' : 'opacity-0'}`} />

                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-lg ${checked ? 'left-[22px] scale-110 shadow-indigo-200' : 'left-1 scale-90'}`} />
            </button>
        );
    };

    return (
        <>

            {/* Top Right Theme Toggle */}
            <div className="fixed top-6 right-6 z-50 select-none">
                <button
                    onClick={toggleAppTheme}
                    className={`p-3 rounded-full transition-all duration-300 ${glassyClass} hover:scale-110 hover:bg-white/10`}
                >
                    {appTheme === 'dark' ? <Sun size={20} className="text-yellow-100" /> : <Moon size={20} className="text-indigo-600" />}
                </button>
            </div>

            {/* Bottom Right Reset Action */}
            <div className="fixed bottom-8 right-8 z-50 select-none">
                <button
                    onClick={handleReset}
                    title="Reset Everything"
                    className={`p-4 rounded-full transition-all duration-300 shadow-2xl group active:scale-90 ${appTheme === 'dark'
                        ? 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 shadow-red-500/10'
                        : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 shadow-red-200'
                        }`}
                >
                    <RotateCcw size={24} className="group-hover:-rotate-180 transition-transform duration-500" />
                </button>
            </div>

            {/* Main Toolbar */}
            <div className="w-full max-w-6xl mx-auto mb-8 z-40 relative px-4 select-none">
                <div className={`
             rounded-2xl p-2 pl-4 md:p-3 md:pl-6 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 transition-all duration-300
             ${glassyClass}
        `}>
                    {/* Brand / Logo */}
                    <Link href="/" className={`flex items-center gap-3 mr-auto md:mr-4 pr-0 md:pr-6 md:border-r relative group cursor-pointer transition-colors ${appTheme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                            <div className="w-4 h-4 border-2 border-white/80 rounded-sm transform rotate-45" />
                        </div>
                        <span className={`font-bold text-lg tracking-tight bg-clip-text text-transparent hidden sm:block transition-all duration-300 ${appTheme === 'dark'
                            ? 'bg-gradient-to-r from-indigo-200 to-white'
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-950'
                            }`}>
                            SyntaRay
                        </span>
                    </Link>

                    {/* Theme Select (Custom) */}
                    <div className="relative group w-full sm:w-auto min-w-[160px]">
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); setActivePopover(activePopover === 'theme' ? null : 'theme'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium border transition-all active:scale-[0.98] ${activePopover === 'theme' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : (appTheme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5')} ${inputClass}`}
                        >
                            <div className="flex items-center gap-2">
                                <Palette size={14} className="opacity-50" />
                                <span className="truncate">{theme}</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activePopover === 'theme' ? 'rotate-180' : ''}`} />
                        </button>

                        {activePopover === 'theme' && (
                            <div ref={popoverRef} className={`absolute top-12 left-0 w-64 max-h-[400px] overflow-y-auto rounded-xl border z-50 p-1 animate-dropdown shadow-2xl ${popoverClass}`} onMouseDown={(e) => e.stopPropagation()}>
                                {Object.entries(THEME_GROUPS).map(([group, themes]) => (
                                    <div key={group} className="p-1">
                                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest opacity-40">{group}</div>
                                        {themes.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => { setTheme(t); setActivePopover(null); }}
                                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between group ${theme === t ? 'bg-indigo-500 text-white' : (appTheme === 'dark' ? 'hover:bg-white/5 text-white/80' : 'hover:bg-black/5 text-black/80')}`}
                                            >
                                                <span>{t}</span>
                                                {theme === t && <Check size={12} />}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language Select (Custom) */}
                    <div className="relative group w-full sm:w-auto min-w-[120px]">
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); setActivePopover(activePopover === 'language' ? null : 'language'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium border transition-all active:scale-[0.98] ${activePopover === 'language' ? 'border-indigo-500 ring-4 ring-indigo-500/10' : (appTheme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5')} ${inputClass}`}
                        >
                            <span className="truncate">{language === 'auto' ? 'Auto' : language}</span>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activePopover === 'language' ? 'rotate-180' : ''}`} />
                        </button>

                        {activePopover === 'language' && (
                            <div ref={popoverRef} className={`absolute top-12 left-0 w-48 max-h-[300px] overflow-y-auto rounded-xl border z-50 p-1 animate-dropdown shadow-2xl ${popoverClass}`} onMouseDown={(e) => e.stopPropagation()}>
                                {LANGUAGES.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => { setLanguage(l); setActivePopover(null); }}
                                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between group ${language === l ? 'bg-indigo-500 text-white' : (appTheme === 'dark' ? 'hover:bg-white/5 text-white/80' : 'hover:bg-black/5 text-black/80')}`}
                                    >
                                        <span>{l === 'auto' ? 'Auto' : l}</span>
                                        {language === l && <Check size={12} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Background Picker Trigger */}
                    <div className="relative">
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); setActivePopover(activePopover === 'bg' ? null : 'bg'); }}
                            className={`w-10 h-10 rounded-lg border-2 transition-transform active:scale-95 flex items-center justify-center ${background.includes('url') ? 'bg-cover bg-center' : ''} ${appTheme === 'dark' ? 'border-white/20' : 'border-black/10'}`}
                            style={{ background: background.includes('url') ? background : background }}
                            aria-label="Change Background"
                        >
                            {!background.includes('url') && background === 'transparent' && (
                                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/18/Transparent_Square_Tiles_Texture.png')] bg-cover opacity-50 rounded-md" />
                            )}
                        </button>

                        {/* Background Popover */}
                        {activePopover === 'bg' && (
                            <div ref={popoverRef} className={`absolute top-14 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-[300px] md:w-[320px] p-4 rounded-xl border backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 ${popoverClass}`} onMouseDown={(e) => e.stopPropagation()}>
                                {/* Tabs / Switcher with Sliding Pill */}
                                <div className="relative flex p-1 mb-4 rounded-lg bg-black/10 dark:bg-black/40 isolation-auto">
                                    {/* The Sliding Pill */}
                                    <div
                                        className="absolute top-1 bottom-1 left-1 rounded-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] bg-indigo-500 shadow-lg shadow-indigo-500/20"
                                        style={{
                                            width: 'calc(33.333% - 2.66px)',
                                            transform: `translateX(${colorMode === 'solid' ? '0' : colorMode === 'gradient' ? '100%' : '200%'})`,
                                        }}
                                    />
                                    {['solid', 'gradient', 'image'].map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                if (m === 'image') {
                                                    if (colorMode === 'image') {
                                                        bgFileInputRef.current?.click();
                                                    } else {
                                                        setColorMode('image');
                                                    }
                                                } else {
                                                    setColorMode(m as any);
                                                    if (m === 'solid') setBackground(solidColor);
                                                    else if (m === 'gradient') updateGradient(gradientStart, gradientEnd, gradientAngle);
                                                }
                                            }}
                                            className={`relative z-10 flex-1 py-1 px-2 text-xs font-semibold rounded-md capitalize transition-colors duration-200 ${colorMode === m ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                <input ref={bgFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                                {/* Controls */}
                                <div className="space-y-4">
                                    {colorMode === 'gradient' && (
                                        <div className="flex items-center gap-2 justify-center pb-2">
                                            <div
                                                className={`w-6 h-6 rounded-full border cursor-pointer hover:scale-110 transition ${activeStop === 'start' ? 'ring-2 ring-indigo-500 border-transparent' : 'border-gray-500'}`}
                                                style={{ background: gradientStart }}
                                                onClick={() => setActiveStop('start')}
                                            />
                                            <div className="flex-1 h-1 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full" />
                                            <div
                                                className={`w-6 h-6 rounded-full border cursor-pointer hover:scale-110 transition ${activeStop === 'end' ? 'ring-2 ring-indigo-500 border-transparent' : 'border-gray-500'}`}
                                                style={{ background: gradientEnd }}
                                                onClick={() => setActiveStop('end')}
                                            />
                                        </div>
                                    )}

                                    {colorMode !== 'image' && (
                                        <HexColorPicker
                                            color={colorMode === 'solid' ? solidColor : (activeStop === 'start' ? gradientStart : gradientEnd)}
                                            onChange={handleColorChange}
                                            style={{ width: '100%', height: '140px' }}
                                        />
                                    )}

                                    {colorMode === 'gradient' && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] uppercase font-bold opacity-50">
                                                <span>Angle</span>
                                                <span>{gradientAngle}°</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="360" value={gradientAngle}
                                                onChange={(e) => {
                                                    const a = Number(e.target.value);
                                                    setGradientAngle(a);
                                                    updateGradient(gradientStart, gradientEnd, a);
                                                }}
                                                className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    {colorMode === 'image' && (
                                        <div className={`flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed rounded-xl space-y-3 transition-colors ${appTheme === 'dark' ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/[0.02]'}`}>
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <ImageIcon size={20} />
                                            </div>
                                            <div className="text-center px-4">
                                                <p className="text-xs font-bold leading-tight">High-Res Wallpaper</p>
                                                <p className="text-[10px] opacity-50 mt-1 leading-relaxed">Images are processed locally to maintain maximum quality.</p>
                                            </div>
                                            <button
                                                onClick={() => bgFileInputRef.current?.click()}
                                                className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                                            >
                                                Select File
                                            </button>
                                        </div>
                                    )}

                                    {colorMode !== 'image' && (
                                        <div className={`grid grid-cols-5 gap-2 pt-2 border-t ${appTheme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
                                            {GRADIENTS.slice(0, 5).map(g => (
                                                <button
                                                    key={g.name}
                                                    className="w-full aspect-square rounded-md hover:scale-110 transition-transform shadow-sm"
                                                    style={{ background: g.value }}
                                                    onClick={() => {
                                                        setBackground(g.value);
                                                        setColorMode('gradient');
                                                    }}
                                                    title={g.name}
                                                />
                                            ))}
                                            <button
                                                className="w-full aspect-square rounded-md hover:scale-110 transition-transform border border-black/10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/1/18/Transparent_Square_Tiles_Texture.png')] bg-cover shadow-sm"
                                                onClick={() => { setBackground('transparent'); setColorMode('solid'); }}
                                                title="Transparent"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings Trigger -> Complex Popover */}
                    <div className="relative">
                        <button
                            onMouseDown={(e) => { e.stopPropagation(); setActivePopover(activePopover === 'settings' ? null : 'settings'); }}
                            className={`p-2.5 rounded-lg border transition-all active:scale-95 ${activePopover === 'settings' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' : (appTheme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5')}`}
                        >
                            <Settings size={20} className={`transition-transform duration-500 ${activePopover === 'settings' ? 'rotate-90' : 'rotate-0'}`} />
                        </button>

                        {/* Carbon-like Settings Popover */}
                        {activePopover === 'settings' && (
                            <div ref={popoverRef} className={`absolute top-14 left-0 w-[400px] rounded-xl border z-50 flex flex-col overflow-hidden animate-dropdown shadow-2xl ${popoverClass}`} onMouseDown={(e) => e.stopPropagation()}>

                                {/* Body: Sidebar + Content */}
                                <div className="flex h-[320px]">
                                    {/* Sidebar with Sliding Pill */}
                                    <div className={`w-28 flex flex-col relative ${settingsSidebarClass}`}>
                                        {/* Sliding Pill Indicator */}
                                        <div
                                            className="absolute left-0 w-1 bg-white rounded-r-full transition-all duration-300 ease-out z-20"
                                            style={{
                                                height: '44px',
                                                top: `${['window', 'editor', 'misc'].indexOf(settingsTab) * 44}px`
                                            }}
                                        />
                                        <div
                                            className="absolute left-0 right-0 bg-white/10 transition-all duration-300 ease-out -z-10"
                                            style={{
                                                height: '44px',
                                                top: `${['window', 'editor', 'misc'].indexOf(settingsTab) * 44}px`
                                            }}
                                        />

                                        {['window', 'editor', 'misc'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setSettingsTab(tab as any)}
                                                className={`px-4 py-3 text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between relative z-10 ${settingsTab === tab
                                                    ? 'text-white'
                                                    : (appTheme === 'dark' ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-black/60 hover:text-black hover:bg-black/5')
                                                    }`}
                                            >
                                                <span className="capitalize">{tab}</span>
                                                {settingsTab === tab && <ChevronDown size={12} className="-rotate-90 animate-in fade-in zoom-in" />}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content Area */}
                                    <div className={`flex-1 p-4 overflow-y-auto space-y-5 transition-colors ${appTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white/50'}`}>
                                        {settingsTab === 'window' && (
                                            <div className="tab-content-enter space-y-5">
                                                <div className="space-y-3">
                                                    <div className={`flex justify-between items-center text-[10px] font-bold uppercase tracking-widest ${sectionTitleClass}`}>
                                                        <span>Window Style</span>
                                                        <Check size={12} className="opacity-0" />
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {['mac', 'windows', 'gray', 'none'].map((style) => (
                                                            <button
                                                                key={style}
                                                                onClick={() => setWindowTheme(style as any)}
                                                                className={`flex-1 h-9 rounded-md border flex items-center justify-center transition-all ${windowTheme === style ? (appTheme === 'dark' ? 'bg-indigo-500 border-transparent text-white' : 'bg-white border-indigo-200 shadow-sm text-indigo-600') : 'bg-black/5 dark:bg-white/5 border-transparent opacity-60 hover:opacity-100'}`}
                                                            >
                                                                {style === 'mac' && <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#ff5f56]" /><div className="w-2 h-2 rounded-full bg-[#ffbd2e]" /><div className="w-2 h-2 rounded-full bg-[#27c93f]" /></div>}
                                                                {style === 'windows' && <div className="flex gap-1.5"><div className="w-2 h-[1px] bg-white/50" /><div className="w-2 h-2 border border-white/50" /><div className="w-2 h-2 relative"><div className="absolute top-1/2 left-0 w-2 h-[1px] bg-white/50 rotate-45" /><div className="absolute top-1/2 left-0 w-2 h-[1px] bg-white/50 -rotate-45" /></div></div>}
                                                                {style === 'gray' && <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-gray-500" /><div className="w-2 h-2 rounded-full bg-gray-500" /><div className="w-2 h-2 rounded-full bg-gray-500" /></div>}
                                                                {style === 'none' && <div className="text-[10px] uppercase font-bold tracking-tighter">None</div>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-3 border-t border-white/5">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span>Frame Padding</span>
                                                            <button onClick={() => setPadding(64)} className="text-[10px] opacity-30 hover:opacity-100 transition-opacity"><RotateCcw size={10} /></button>
                                                        </div>
                                                        <span className="text-xs opacity-50">{padding}px</span>
                                                    </div>
                                                    <input
                                                        type="range" min="8" max="128" step="4" value={padding}
                                                        onChange={(e) => setPadding(Number(e.target.value))}
                                                        className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className={`space-y-3 pt-3 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span>Window Radius</span>
                                                            <button onClick={() => setBorderRadius(12)} className="text-[10px] opacity-30 hover:opacity-100 transition-opacity"><RotateCcw size={10} /></button>
                                                        </div>
                                                        <span className="text-xs opacity-50">{borderRadius}px</span>
                                                    </div>
                                                    <input
                                                        type="range" min="0" max="40" step="2" value={borderRadius}
                                                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                                                        className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className={`space-y-4 pt-4 border-t ${sectionBorderClass}`}>
                                                    <div className="flex items-center justify-between">
                                                        <label className={`text-[10px] font-bold uppercase tracking-widest ${sectionTitleClass}`}>Window Dimensions</label>
                                                        <button
                                                            onClick={() => {
                                                                setFrameWidth(640);
                                                                setFrameHeight(320);
                                                            }}
                                                            className="text-[10px] opacity-30 hover:opacity-100 transition-opacity"
                                                            title="Reset to Default"
                                                        >
                                                            <RotateCcw size={10} />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Width</span>
                                                            <span className="opacity-50">{frameWidth || 'Auto'}</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="1400" step="10" value={frameWidth}
                                                            onChange={(e) => setFrameWidth(Number(e.target.value))}
                                                            className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Height</span>
                                                            <span className="opacity-50">{frameHeight || 'Auto'}</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="1200" step="10" value={frameHeight}
                                                            onChange={(e) => setFrameHeight(Number(e.target.value))}
                                                            className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                    </div>
                                                </div>

                                                <div className={`space-y-3 pt-3 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between items-center text-sm mb-1">
                                                        <span>Show File Name</span>
                                                        <Toggle checked={showFileName} onChange={() => setShowFileName(!showFileName)} />
                                                    </div>
                                                    {showFileName && (
                                                        <input
                                                            type="text"
                                                            value={fileName}
                                                            onChange={(e) => setFileName(e.target.value)}
                                                            placeholder="script.js"
                                                            className={`w-full p-2 px-3 rounded-md text-xs border outline-none ${inputClass}`}
                                                        />
                                                    )}
                                                </div>

                                                <div className={`space-y-3 pt-3 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span>Drop Shadow</span>
                                                        <Toggle checked={hasShadow} onChange={() => setHasShadow(!hasShadow)} />
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span>Watermark</span>
                                                        <Toggle checked={watermark} onChange={() => setWatermark(!watermark)} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {settingsTab === 'editor' && (
                                            <div className="tab-content-enter space-y-5">
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-bold uppercase tracking-widest ${sectionTitleClass}`}>Typography</label>
                                                    <div className="pt-1">
                                                        <select
                                                            value={fontFamily === 'custom' ? 'custom' : (FONTS.some(f => f.value === fontFamily) ? fontFamily : 'custom')}
                                                            onChange={(e) => {
                                                                if (e.target.value === 'custom') {
                                                                    fontInputRef.current?.click();
                                                                } else {
                                                                    setFontFamily(e.target.value);
                                                                }
                                                            }}
                                                            className={`w-full p-2 rounded-md text-sm border outline-none ${inputClass}`}
                                                        >
                                                            {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                                                            {!FONTS.some(f => f.value === fontFamily) && fontFamily !== 'custom' && (
                                                                <option key={fontFamily} value={fontFamily}>{fontFamily} (Custom)</option>
                                                            )}
                                                        </select>
                                                        <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleFontUpload} />
                                                    </div>
                                                </div>

                                                <div className={`space-y-2 pt-2 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Font Size</span>
                                                        <span className="opacity-50 text-xs">{fontSize}px</span>
                                                    </div>
                                                    <input
                                                        type="range" min="12" max="24" step="1" value={fontSize}
                                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                                        className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className={`space-y-2 pt-3 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Line Spacing</span>
                                                        <span className="opacity-50 text-xs">{lineHeight}x</span>
                                                    </div>
                                                    <input
                                                        type="range" min="1" max="2.5" step="0.1" value={lineHeight}
                                                        onChange={(e) => setLineHeight(Number(e.target.value))}
                                                        className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className={`space-y-2 pt-3 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Character Spacing</span>
                                                        <span className="opacity-50 text-xs">{letterSpacing}px</span>
                                                    </div>
                                                    <input
                                                        type="range" min="-2" max="10" step="0.5" value={letterSpacing}
                                                        onChange={(e) => setLetterSpacing(Number(e.target.value))}
                                                        className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>

                                                <div className={`flex items-center justify-between pt-3 border-t ${sectionBorderClass}`}>
                                                    <span className="text-sm">Line Numbers</span>
                                                    <Toggle checked={showLineNumbers} onChange={() => setShowLineNumbers(!showLineNumbers)} />
                                                </div>

                                                <div className={`space-y-3 pt-3 border-t ${sectionBorderClass}`}>
                                                    <div className="flex justify-between items-center text-sm mb-2">
                                                        <span>Editor Theme Color</span>
                                                        {customWindowBg && (
                                                            <button
                                                                onClick={() => setCustomWindowBg('')}
                                                                className="text-[10px] text-indigo-500 hover:text-indigo-400 font-bold uppercase tracking-tighter"
                                                            >
                                                                Reset
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-md border border-white/10 shadow-inner flex-shrink-0"
                                                            style={{ backgroundColor: customWindowBg || '#1e1e1e' }}
                                                        />
                                                        <div className="flex-1">
                                                            <HexColorPicker
                                                                color={customWindowBg || '#1e1e1e'}
                                                                onChange={setCustomWindowBg}
                                                                style={{ width: '100%', height: '60px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`space-y-4 pt-4 border-t ${sectionBorderClass}`}>
                                                    <div className="flex items-center justify-between">
                                                        <label className={`text-[10px] font-bold uppercase tracking-widest ${sectionTitleClass}`}>Editor Dimensions</label>
                                                        <button
                                                            onClick={() => {
                                                                setEditorWidth(460);
                                                                setEditorHeight(160);
                                                            }}
                                                            className="text-[10px] opacity-30 hover:opacity-100 transition-opacity"
                                                            title="Reset to Default"
                                                        >
                                                            <RotateCcw size={10} />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Width</span>
                                                            <span className="opacity-50">{editorWidth || 'Auto'}</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="1200" step="10" value={editorWidth}
                                                            onChange={(e) => setEditorWidth(Number(e.target.value))}
                                                            className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex justify-between text-xs">
                                                            <span>Height</span>
                                                            <span className="opacity-50">{editorHeight || 'Auto'}</span>
                                                        </div>
                                                        <input
                                                            type="range" min="0" max="800" step="10" value={editorHeight}
                                                            onChange={(e) => setEditorHeight(Number(e.target.value))}
                                                            className="w-full accent-indigo-500 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        {settingsTab === 'misc' && (
                                            <div className="tab-content-enter space-y-4">
                                                <div className={`p-3 rounded-lg border text-xs leading-relaxed ${appTheme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' : 'bg-indigo-50/50 border-indigo-200 text-indigo-700'}`}>
                                                    Manage your SyntaRay configuration or share your current design.
                                                </div>

                                                <button
                                                    onClick={handleCopyShareLink}
                                                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                                                >
                                                    <Zap size={14} />
                                                    Copy Share Link
                                                </button>

                                                <div className="space-y-3 pt-2 border-t border-white/5">
                                                    <label className={`text-[10px] font-bold uppercase tracking-widest ${sectionTitleClass}`}>Export Quality</label>
                                                    <div className="relative flex p-1 rounded-lg bg-black/10 dark:bg-black/40 isolation-auto">
                                                        {/* The Sliding Pill */}
                                                        <div
                                                            className="absolute top-1 bottom-1 left-1 rounded-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] bg-indigo-500 shadow-lg shadow-indigo-500/20"
                                                            style={{
                                                                width: 'calc(33.333% - 2.66px)',
                                                                transform: `translateX(${exportPixelRatio === 1 ? '0' : exportPixelRatio === 2 ? '100%' : '200%'})`,
                                                            }}
                                                        />
                                                        {[1, 2, 4].map((ratio) => (
                                                            <button
                                                                key={ratio}
                                                                onClick={() => setExportPixelRatio(ratio)}
                                                                className={`relative z-10 flex-1 py-1 px-2 text-[10px] font-bold transition-colors duration-200 ${exportPixelRatio === ratio ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                                            >
                                                                {ratio}x
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                                                    <button
                                                        onClick={() => configFileInputRef.current?.click()}
                                                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-xs font-semibold ${appTheme === 'dark'
                                                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                                                            : 'bg-black/[0.03] hover:bg-black/[0.06] border-black/5 text-black'}`}
                                                    >
                                                        <Download size={14} className="rotate-180" />
                                                        Import Config
                                                    </button>
                                                    <input
                                                        ref={configFileInputRef}
                                                        type="file"
                                                        accept=".json"
                                                        className="hidden"
                                                        onChange={handleImportConfig}
                                                    />

                                                    <button
                                                        onClick={handleExportConfig}
                                                        className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-xs font-semibold ${appTheme === 'dark'
                                                            ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                                                            : 'bg-black/[0.03] hover:bg-black/[0.06] border-black/5 text-black'}`}
                                                    >
                                                        <Download size={14} />
                                                        Export Config
                                                    </button>

                                                    <button
                                                        onClick={handleReset}
                                                        className={`col-span-2 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all text-xs font-bold ${appTheme === 'dark'
                                                            ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
                                                            : 'bg-red-50 hover:bg-red-100 border-red-100 text-red-600'}`}
                                                    >
                                                        <RotateCcw size={14} />
                                                        Reset All Settings to Default
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    {/* Divider */}
                    <div className={`hidden md:block w-[1px] h-6 ml-6 mr-6 self-center flex-shrink-0 ${appTheme === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />

                    {/* Action Buttons */}
                    <div className="flex-1 flex items-center justify-center gap-3">
                        {/* Copy Button */}
                        <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-2 w-32 py-2.5 rounded-lg border font-medium transition-all duration-300 active:scale-95 whitespace-nowrap ${copying
                                ? 'bg-green-500/10 border-green-500 text-green-500 shadow-lg shadow-green-500/10'
                                : (appTheme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5')
                                }`}
                        >
                            {copying ? <Check size={18} /> : <Copy size={18} />}
                            <span className="text-sm">{copying ? 'Copied' : 'Copy'}</span>
                        </button>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onMouseDown={(e) => { e.stopPropagation(); setActivePopover(activePopover === 'export' ? null : 'export'); }}
                                className="flex items-center justify-center gap-2 w-32 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
                            >
                                <Download size={18} />
                                <span className="text-sm">Export</span>
                                <ChevronDown size={14} className="opacity-70" />
                            </button>

                            {activePopover === 'export' && (
                                <div ref={popoverRef} className={`absolute right-0 top-14 w-[160px] p-2 rounded-xl border backdrop-blur-2xl z-50 animate-dropdown shadow-2xl ${popoverClass}`} onMouseDown={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleExport('png')}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors text-left group"
                                    >
                                        <span className="font-medium text-sm">PNG Image</span>
                                        <div className="text-[10px] opacity-40 group-hover:opacity-100 font-bold">.png</div>
                                    </button>
                                    <button
                                        onClick={() => handleExport('jpeg')}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors text-left group"
                                    >
                                        <span className="font-medium text-sm">JPG Image</span>
                                        <div className="text-[10px] opacity-40 group-hover:opacity-100 font-bold">.jpg</div>
                                    </button>
                                    <button
                                        onClick={() => handleExport('webp')}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors text-left group"
                                    >
                                        <span className="font-medium text-sm">WebP Image</span>
                                        <div className="text-[10px] opacity-40 group-hover:opacity-100 font-bold">.webp</div>
                                    </button>
                                    <button
                                        onClick={() => handleExport('svg')}
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors text-left group"
                                    >
                                        <span className="font-medium text-sm">SVG Vector</span>
                                        <div className="text-[10px] opacity-40 group-hover:opacity-100 font-bold">.svg</div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
