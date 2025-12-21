import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CodeSnapState {
    code: string;
    language: string;
    theme: string;
    background: string;
    padding: number;
    showLineNumbers: boolean;
    showWindowControls: boolean;
    fileName: string;
    fontFamily: string;
    fontSize: number;
    windowTheme: 'none' | 'mac' | 'gray' | 'outline' | 'windows';
    borderRadius: number;
    hasShadow: boolean;
    watermark: boolean;
    showFileName: boolean;
    appTheme: 'dark' | 'light';
    editorWidth: number;
    editorHeight: number;
    frameWidth: number;
    frameHeight: number;
    lineHeight: number;
    letterSpacing: number;
    customWindowBg: string; // New field for custom editor background
    highlightedLines: number[];
    exportPixelRatio: number;
    glassOpacity: number;
    glassBlur: number;
    showGrain: boolean;
    toast: { message: string, type: 'success' | 'error' | 'info' } | null;
    dialog: {
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    } | null;

    setCode: (code: string) => void;
    setLanguage: (lang: string) => void;
    setTheme: (theme: string) => void;
    setBackground: (bg: string) => void;
    setPadding: (padding: number) => void;
    setShowLineNumbers: (show: boolean) => void;
    setShowWindowControls: (show: boolean) => void;
    setFileName: (name: string) => void;
    setShowFileName: (show: boolean) => void;
    setFontFamily: (font: string) => void;
    setFontSize: (size: number) => void;
    setWindowTheme: (theme: 'none' | 'mac' | 'gray' | 'outline' | 'windows') => void;
    setBorderRadius: (radius: number) => void;
    setHasShadow: (has: boolean) => void;
    setWatermark: (has: boolean) => void;
    setAppTheme: (theme: 'dark' | 'light') => void;
    setEditorWidth: (width: number) => void;
    setEditorHeight: (height: number) => void;
    setFrameWidth: (width: number) => void;
    setFrameHeight: (height: number) => void;
    setLineHeight: (height: number) => void;
    setLetterSpacing: (spacing: number) => void;
    setCustomWindowBg: (color: string) => void;
    setHighlightedLines: (lines: number[]) => void;
    setExportPixelRatio: (ratio: number) => void;
    setGlassOpacity: (opacity: number) => void;
    setGlassBlur: (blur: number) => void;
    setShowGrain: (show: boolean) => void;
    setToast: (toast: { message: string, type: 'success' | 'error' | 'info' } | null) => void;
    setDialog: (dialog: { title: string, message: string, onConfirm: () => void, onCancel?: () => void } | null) => void;
    reset: () => void;
}

const initialState = {
    code: `function helloWorld() {
  console.log("Hello, SyntaRay!");
}`,
    language: 'auto',
    theme: 'one-dark-pro',
    background: 'linear-gradient(140deg, rgb(165, 142, 251), rgb(233, 191, 248))',
    padding: 64,
    showLineNumbers: true,
    showWindowControls: true,
    fileName: 'script.js',
    showFileName: true,
    fontFamily: 'JetBrains Mono',
    fontSize: 14,
    windowTheme: 'mac' as const,
    hasShadow: true,
    watermark: true,
    appTheme: 'dark' as 'dark' | 'light',
    editorWidth: 460,
    editorHeight: 160,
    frameWidth: 640,
    frameHeight: 320,
    lineHeight: 1.5,
    letterSpacing: 0,
    customWindowBg: '', // Default to empty (theme determined)
    borderRadius: 12,
    highlightedLines: [],
    exportPixelRatio: 2,
    glassOpacity: 100,
    glassBlur: 0,
    showGrain: false,
    toast: null,
    dialog: null,
};

export const useStore = create<CodeSnapState>()(
    persist(
        (set) => ({
            ...initialState,

            setCode: (code) => set({ code }),
            setLanguage: (language) => set({ language }),
            setTheme: (theme) => set({ theme }),
            setBackground: (background) => set({ background }),
            setPadding: (padding) => set({ padding }),
            setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
            setShowWindowControls: (showWindowControls) => set({ showWindowControls }),
            setFileName: (fileName) => set({ fileName }),
            setShowFileName: (showFileName) => set({ showFileName }),
            setFontFamily: (fontFamily) => set({ fontFamily }),
            setFontSize: (fontSize) => set({ fontSize }),
            setWindowTheme: (windowTheme) => set({ windowTheme }),
            setHasShadow: (hasShadow) => set({ hasShadow }),
            setWatermark: (watermark) => set({ watermark }),
            setAppTheme: (appTheme) => set({ appTheme }),
            setEditorWidth: (editorWidth) => set({ editorWidth }),
            setEditorHeight: (editorHeight) => set({ editorHeight }),
            setFrameWidth: (frameWidth) => set({ frameWidth }),
            setFrameHeight: (frameHeight) => set({ frameHeight }),
            setLineHeight: (lineHeight) => set({ lineHeight }),
            setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
            setCustomWindowBg: (customWindowBg) => set({ customWindowBg }),
            setBorderRadius: (borderRadius) => set({ borderRadius }),
            setHighlightedLines: (highlightedLines) => set({ highlightedLines }),
            setExportPixelRatio: (exportPixelRatio) => set({ exportPixelRatio }),
            setGlassOpacity: (glassOpacity) => set({ glassOpacity }),
            setGlassBlur: (glassBlur) => set({ glassBlur }),
            setShowGrain: (showGrain) => set({ showGrain }),
            setToast: (toast) => set({ toast }),
            setDialog: (dialog) => set({ dialog }),
            reset: () => set((state) => ({
                ...initialState,
                appTheme: state.appTheme // Preserve current theme
            })),
        }),
        {
            name: 'syntaray-storage',
            partialize: (state) => {
                const { toast, dialog, ...persisted } = state;
                return persisted;
            },
        }
    )
);
