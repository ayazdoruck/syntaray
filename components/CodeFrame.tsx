'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { highlightCode, getThemeColors } from '@/lib/shiki';
import hljs from 'highlight.js';

export default function CodeFrame() {
    const {
        code, language, theme, background, padding,
        showLineNumbers, setCode, fileName, showFileName, fontFamily,
        fontSize, windowTheme, hasShadow, watermark, showWindowControls,
        editorWidth, editorHeight, frameWidth, frameHeight, lineHeight, letterSpacing,
        customWindowBg, borderRadius
    } = useStore();

    const [highlightedHtml, setHighlightedHtml] = useState('');
    const [windowBg, setWindowBg] = useState('#1e1e1e');
    const [detectedLanguage, setDetectedLanguage] = useState(language);

    // Effect to handle detection and highlighting
    useEffect(() => {
        const t = setTimeout(async () => {
            let langToUse = language;

            if (language === 'auto') {
                try {
                    // 1. Detect using highlight.js
                    const result = hljs.highlightAuto(code);
                    const detected = result.language;

                    // 2. Simple mapping for common mismatches/aliases if needed
                    // Shiki serves most standard names well. 
                    // However, hljs might return 'js' while shiki wants 'javascript' etc.
                    // For now, we trust the output or fallback to text.
                    langToUse = detected || 'text';

                    // Simple heuristic override if detection fails for specific patterns
                    if (!detected) {
                        if (code.trim().startsWith('<') || code.includes('</div>')) langToUse = 'html';
                        else if (code.includes('import ') || code.includes('const ')) langToUse = 'javascript';
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
                    highlightCode(code, langToUse, theme),
                    getThemeColors(theme)
                ]);
                setHighlightedHtml(html);
                setWindowBg(colors.bg);
            } catch (error) {
                console.error('Highlighting failed:', error);
                // Fallback to text highlighting
                const fallbackHtml = await highlightCode(code, 'text', theme);
                setHighlightedHtml(fallbackHtml);
            }
        }, 10); // Reduced to 15ms for instant feedback while keeping minimal debouncing
        return () => clearTimeout(t);
    }, [code, language, theme]);

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
        const basePaddingLeft = showLineNumbers ? 72 : 24;
        const basePaddingTop = 24; // p-6 = 1.5rem = 24px

        const x = basePaddingLeft + (col * charWidth);
        const y = basePaddingTop + (row * currentLineHeight);

        setCursorPos({ x, y });
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 100);
    };

    useEffect(() => {
        updateCursorPosition();
        window.addEventListener('resize', updateCursorPosition);
        return () => window.removeEventListener('resize', updateCursorPosition);
    }, [code, showLineNumbers, fontSize, fontFamily, lineHeight, letterSpacing]);

    return (
        <div className="w-full min-h-[500px] flex items-center justify-center p-6 overflow-hidden z-10 relative rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-sm shadow-2xl ring-1 ring-white/5">

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
                className="relative transition-all duration-300 ease-in-out flex items-center justify-center pointer-events-auto"
                style={{
                    background: background,
                    padding: `${padding}px`,
                    minWidth: frameWidth > 0 ? `${frameWidth}px` : 'min-content',
                    maxWidth: frameWidth > 0 ? `${frameWidth}px` : '100%',
                    height: frameHeight > 0 ? `${frameHeight}px` : 'auto',
                }}
            >
                <div
                    className={`relative overflow-hidden transition-shadow duration-300 ${hasShadow ? 'shadow-2xl' : ''}`}
                    style={{
                        backgroundColor: customWindowBg || windowBg,
                        boxShadow: hasShadow ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                        width: editorWidth > 0 ? `${editorWidth}px` : undefined,
                        height: editorHeight > 0 ? `${editorHeight}px` : undefined,
                        minWidth: editorWidth > 0 ? '0' : '300px',
                        borderRadius: `${borderRadius}px`,
                    }}
                >
                    {/* Window Title Bar */}
                    <div
                        className="h-12 px-4 flex items-center justify-between select-none"
                        style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
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
                                className="text-xs text-white/40 font-mono font-medium truncate max-w-[200px] text-center opacity-60"
                                style={{ fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace` }}
                            >
                                {fileName}
                            </div>
                        )}
                        <div className="flex justify-end gap-3 w-20">
                            {showControls && windowTheme === 'windows' && (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40"><path d="M2 6h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-white/40"><rect x="1.5" y="1.5" width="7" height="7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/40"><path d="M3 3l6 6M9 3L3 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
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
                            className="absolute inset-0 w-full h-full p-6 font-mono bg-transparent caret-transparent resize-none outline-none z-10 whitespace-pre overflow-hidden text-transparent"
                            style={{
                                fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace`,
                                fontSize: `${fontSize}px`,
                                lineHeight: lineHeight,
                                letterSpacing: `${letterSpacing}px`,
                                paddingLeft: showLineNumbers ? '4.5rem' : '1.5rem',
                            }}
                        />

                        <div
                            className="p-6 overflow-hidden pointer-events-none font-mono"
                            style={{
                                fontFamily: `"${fontFamily}", ui-monospace, SFMono-Regular, monospace`,
                                fontSize: `${fontSize}px`,
                                lineHeight: lineHeight,
                                letterSpacing: `${letterSpacing}px`,
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
            counter-reset: line;
            font-family: inherit !important;
          }
          code .line::before {
            content: counter(line);
            counter-increment: line;
            display: ${showLineNumbers ? 'inline-block' : 'none'};
            width: 1.5rem;
            margin-right: 1.5rem;
            text-align: right;
            color: rgba(128, 128, 128, 0.4); 
            font-size: 0.9em;
          }
          textarea::-webkit-scrollbar {
             width: 0px;
             background: transparent;
           }
        `}</style>
        </div>
    );
}
