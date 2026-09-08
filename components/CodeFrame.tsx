'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { highlightCode, getThemeColors, getContrastColor } from '@/lib/shiki';
import hljs from 'highlight.js';

export default function CodeFrame() {
    const {
        code, language, theme, background, padding,
        showLineNumbers, setCode, fileName, showFileName, fontFamily,
        fontSize, windowTheme, hasShadow, watermark, showWindowControls,
        editorWidth, editorHeight, frameWidth, frameHeight, lineHeight, letterSpacing,
        customWindowBg, borderRadius, highlightedLines, setHighlightedLines,
        glassOpacity, glassBlur, showGrain
    } = useStore();

    const [highlightedHtml, setHighlightedHtml] = useState('');
    const [windowBg, setWindowBg] = useState('#1e1e1e');
    const [detectedLanguage, setDetectedLanguage] = useState(language);
    const [fileNameColor, setFileNameColor] = useState('rgba(255, 255, 255, 0.7)');

    // Effect to handle detection and highlighting
    useEffect(() => {
        const t = setTimeout(async () => {
            let langToUse = language;

            if (language === 'auto') {
                try {
                    // 1. Detect using highlight.js with a restricted list for better accuracy
                    const commonLangs = [
                        'javascript', 'typescript', 'python', 'html', 'css', 'json',
                        'bash', 'go', 'rust', 'java', 'cpp', 'csharp', 'php',
                        'ruby', 'sql', 'yaml', 'markdown'
                    ];
                    const result = hljs.highlightAuto(code, commonLangs);
                    const detected = result.language;

                    // 2. Map aliases to Shiki-supported names
                    const aliasMap: Record<string, string> = {
                        'js': 'javascript',
                        'ts': 'typescript',
                        'py': 'python',
                        'rb': 'ruby',
                        'sh': 'bash',
                        'yml': 'yaml',
                        'md': 'markdown'
                    };

                    langToUse = (detected && aliasMap[detected]) || detected || 'text';

                    // 3. Robust heuristics for short snippets or detection misses
                    if (!detected || langToUse === 'text') {
                        const trimmed = code.trim();
                        if (trimmed.startsWith('<') || trimmed.includes('</')) langToUse = 'html';
                        else if (trimmed.includes('import ') || trimmed.includes('const ') || trimmed.includes('export ')) langToUse = 'javascript';
                        else if (trimmed.includes('def ') || trimmed.includes('print(')) langToUse = 'python';
                        else if (trimmed.includes('func ') && trimmed.includes(' package ')) langToUse = 'go';
                        else if (trimmed.startsWith('{') || trimmed.startsWith('[')) langToUse = 'json';
                    }

                    setDetectedLanguage(langToUse);
                } catch (e) {
                    console.warn('Auto-detection failed:', e);
                    langToUse = 'text';
                }
            } else {
                setDetectedLanguage(language);
            }

            try {
                const [html, colors] = await Promise.all([
                    highlightCode(code, langToUse, theme, showLineNumbers, highlightedLines),
                    getThemeColors(theme)
                ]);
                setHighlightedHtml(html);
                setWindowBg(colors.bg);

                // Calculate file name color based on background
                const bgToUse = customWindowBg || colors.bg;
                setFileNameColor(getContrastColor(bgToUse));
            } catch (error) {
                console.error('Highlighting failed:', error);
                // Fallback to text highlighting
                const fallbackHtml = await highlightCode(code, 'text', theme, showLineNumbers, highlightedLines);
                setHighlightedHtml(fallbackHtml);
            }
        }, 10); // Reduced to 15ms for instant feedback while keeping minimal debouncing
        return () => clearTimeout(t);
    }, [code, language, theme, showLineNumbers, highlightedLines, customWindowBg]);


    // Internal toggle logic mapping
    const showControls = windowTheme !== 'none';

    // Cursor Logic
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);

    const updateCursorPosition = () => {
        if (!textareaRef.current || !measureRef.current) return;

        const { selectionStart } = textareaRef.current;
        const textBeforeCaret = code.substring(0, selectionStart);
        const lines = textBeforeCaret.split('\n');

        const row = lines.length - 1;
        const col = lines[lines.length - 1].length;

        const charWidth = measureRef.current.getBoundingClientRect().width + letterSpacing;
        const currentLineHeight = fontSize * lineHeight;

        // Calculate Base Offsets
        const basePaddingLeft = showLineNumbers ? 68 : 16;
        const basePaddingTop = 16; // p-4 = 1rem = 16px

        const x = basePaddingLeft + (col * charWidth);
        const y = basePaddingTop + (row * currentLineHeight);

        setCursorPos({ x, y });
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 100);
    };

    useEffect(() => {
        updateCursorPosition();
        window.addEventListener('resize', updateCursorPosition);

        // Handle global Ctrl+A to redirect to editor
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                const target = e.target as HTMLElement;
                const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

                if (!isInput && textareaRef.current) {
                    e.preventDefault();
                    textareaRef.current.focus();
                    textareaRef.current.select();
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            window.removeEventListener('resize', updateCursorPosition);
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [code, showLineNumbers, fontSize, fontFamily, lineHeight, letterSpacing]);

    return (
        <div className="w-full flex justify-center p-4 md:p-8 pt-12 md:pt-5 overflow-x-auto md:overflow-x-hidden z-10 relative no-scrollbar">
            <div className="relative group/canvas">
                {/* Modern Glassy Frame Wrapper */}
                <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-[3rem] blur-xl opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative p-4 md:p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-[2px] shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] ring-1 ring-white/5 overflow-hidden">

                    {/* Hidden Measure Element */}
                    <span
                        ref={measureRef}
                        className="absolute opacity-0 pointer-events-none whitespace-pre font-mono"
                        style={{
                            fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace`,
                            fontSize: `${fontSize}px`,
                            letterSpacing: `${letterSpacing}px`,
                        }}
                    >
                        M
                    </span>

                    {/* Export Container */}
                    <div
                        id="code-frame-export"
                        className="relative flex items-center justify-center pointer-events-auto"
                        style={{
                            backgroundImage: (background.includes('gradient') || background.includes('url')) ? background : 'none',
                            backgroundColor: (background.includes('gradient') || background.includes('url')) ? 'transparent' : background,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            padding: `${padding}px`,
                            minWidth: frameWidth > 0 ? `${frameWidth}px` : 'min-content',
                            maxWidth: frameWidth > 0 ? `${frameWidth}px` : '100vw',
                            height: frameHeight > 0 ? `${frameHeight}px` : 'auto',
                            overflow: 'clip',
                        }}
                    >
                        <div
                            className={`relative overflow-hidden transition-shadow duration-300 ${hasShadow ? 'shadow-2xl' : ''}`}
                            style={{
                                backgroundColor: (glassBlur > 0 || glassOpacity < 100)
                                    ? 'transparent'
                                    : (customWindowBg || windowBg),
                                boxShadow: hasShadow ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                                width: editorWidth > 0 ? `${editorWidth}px` : 'auto',
                                height: editorHeight > 0 ? `${editorHeight}px` : 'auto',
                                minWidth: '200px',
                                borderRadius: `${borderRadius}px`,
                            }}
                        >
                            {/* Glass & Grain Layers */}
                            <div className="absolute inset-0 z-0 pointer-events-none" style={{ borderRadius: 'inherit', overflow: 'hidden', transform: 'translateZ(0)' }}>
                                {(glassBlur > 0 || glassOpacity < 100) && (
                                    <div
                                        className="absolute inset-0 transition-all duration-300"
                                        style={{
                                            backgroundColor: customWindowBg || windowBg,
                                            opacity: glassOpacity / 100,
                                            backdropFilter: `blur(${glassBlur}px)`,
                                            WebkitBackdropFilter: `blur(${glassBlur}px)`,
                                            borderRadius: 'inherit',
                                        }}
                                    />
                                )}
                                {showGrain && (
                                    <div
                                        className="absolute inset-0 opacity-[0.12] mix-blend-soft-light"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                            borderRadius: 'inherit'
                                        }}
                                    />
                                )}
                            </div>

                            {/* Window Title Bar */}
                            <div
                                className="h-12 px-4 flex items-center justify-between select-none relative z-10"
                                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                            >
                                <div className="flex gap-2 w-20">
                                    {showControls && windowTheme === 'mac' && (
                                        <>
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        </>
                                    )}
                                    {showControls && windowTheme === 'gray' && (
                                        <>
                                            <div className="w-3 h-3 rounded-full bg-zinc-600" />
                                            <div className="w-3 h-3 rounded-full bg-zinc-600" />
                                            <div className="w-3 h-3 rounded-full bg-zinc-600" />
                                        </>
                                    )}
                                </div>
                                {showFileName && (
                                    <div
                                        className="text-xs font-mono font-medium truncate max-w-[200px] text-center transition-colors duration-300"
                                        style={{
                                            fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace`,
                                            color: fileNameColor
                                        }}
                                    >
                                        {fileName}
                                    </div>
                                )}
                                <div className="flex justify-end gap-3 w-20">
                                    {showControls && windowTheme === 'windows' && (
                                        <>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-colors duration-300" style={{ color: fileNameColor }}><path d="M2 6h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="transition-colors duration-300" style={{ color: fileNameColor }}><rect x="1.5" y="1.5" width="7" height="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-colors duration-300" style={{ color: fileNameColor }}><path d="M3 3l6 6M9 3L3 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Code Area */}
                            <div className="relative group">

                                {/* Custom Smooth Cursor */}
                                <div
                                    className={`absolute w-0.5 bg-white pointer-events-none z-20 transition-all duration-100 ease-out export-exclude ${isTyping ? 'opacity-100' : 'animate-pulse'}`}
                                    style={{
                                        left: `${cursorPos.x}px`,
                                        top: `${cursorPos.y}px`,
                                        height: `${fontSize * lineHeight}px`,
                                        boxShadow: isTyping ? '0 0 8px 1px rgba(255, 255, 255, 0.5)' : 'none' // Motion blur feel
                                    }}
                                />

                                <textarea
                                    ref={textareaRef}
                                    value={code}
                                    onChange={(e) => { setCode(e.target.value); updateCursorPosition(); }}
                                    onKeyUp={updateCursorPosition}
                                    onClick={updateCursorPosition}
                                    onSelect={updateCursorPosition}
                                    spellCheck={false}
                                    className="absolute inset-0 w-full h-full p-4 font-mono bg-transparent caret-transparent resize-none outline-none z-10 whitespace-pre overflow-hidden text-transparent"
                                    style={{
                                        fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace`,
                                        fontSize: `${fontSize}px`,
                                        lineHeight: lineHeight,
                                        letterSpacing: `${letterSpacing}px`,
                                        paddingLeft: showLineNumbers ? '4.25rem' : '1rem',
                                    }}
                                    onMouseDown={(e) => {
                                        // Toggle Line Highlight if ALT is held
                                        if (e.altKey) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const y = e.clientY - rect.top - 24; // 24 is p-6
                                            const line = Math.floor(y / (fontSize * lineHeight)) + 1;
                                            if (line > 0 && line <= code.split('\n').length) {
                                                if (highlightedLines.includes(line)) {
                                                    setHighlightedLines(highlightedLines.filter(l => l !== line));
                                                } else {
                                                    setHighlightedLines([...highlightedLines, line]);
                                                }
                                                e.preventDefault();
                                            }
                                        }
                                    }}
                                />

                                <div
                                    className="p-4 overflow-hidden pointer-events-none font-mono relative z-0"
                                    style={{
                                        fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace`,
                                        fontSize: `${fontSize}px`,
                                        lineHeight: lineHeight,
                                        letterSpacing: `${letterSpacing}px`,
                                        backgroundColor: 'transparent',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                                />
                            </div>
                        </div>

                        {watermark && (
                            <div className="absolute bottom-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 text-[10px] font-bold tracking-tighter select-none pointer-events-none shadow-xl">
                                <div className="w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-sm transform rotate-45 shadow-sm" />
                                <span>Made with SyntaRay</span>
                            </div>
                        )}
                    </div>

                    <style jsx global>{`
          pre.shiki {
            background-color: transparent !important;
            margin: 0;
            padding: 0;
            overflow: visible !important;
            font-family: inherit !important;
          }
           code {
            font-family: inherit !important;
          }
          textarea::-webkit-scrollbar {
             width: 0px;
             background: transparent;
           }
        `}</style>
                </div>
            </div>
        </div>
    );
}
