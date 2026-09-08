'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Feedback() {
    const { toast, setToast, dialog, setDialog, appTheme } = useStore();

    // Toast state
    const [toastVisible, setToastVisible] = useState(false);
    const [activeToast, setActiveToast] = useState<typeof toast>(null);

    // Dialog state
    const [dialogVisible, setDialogVisible] = useState(false);
    const [activeDialog, setActiveDialog] = useState<typeof dialog>(null);

    // Handle Toast
    useEffect(() => {
        if (toast) {
            // The active toast/dialog is copied into local state so the exit
            // animation can keep rendering it after the store value is cleared.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveToast(toast);
            // Small delay to ensure entry animation triggers
            const timer = setTimeout(() => setToastVisible(true), 10);

            const autoHide = setTimeout(() => {
                setToastVisible(false);
                setTimeout(() => {
                    setToast(null);
                    setActiveToast(null);
                }, 400); // Wait for exit animation
            }, 3000);

            return () => {
                clearTimeout(timer);
                clearTimeout(autoHide);
            };
        }
    }, [toast, setToast]);

    // Handle Dialog
    useEffect(() => {
        if (dialog) {
            // The active toast/dialog is copied into local state so the exit
            // animation can keep rendering it after the store value is cleared.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveDialog(dialog);
            // Small delay to trigger animation
            const timer = setTimeout(() => setDialogVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setDialogVisible(false);
            const timer = setTimeout(() => setActiveDialog(null), 400);
            return () => clearTimeout(timer);
        }
    }, [dialog]);

    const closeDialog = () => {
        setDialog(null);
    };

    const glassyClass = appTheme === 'dark'
        ? 'bg-black/60 border-white/10 text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]'
        : 'bg-white/70 border-black/10 text-black shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]';

    return (
        <div className="select-none">
            {/* Toasts */}
            {activeToast && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none ${toastVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'}`}>
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border backdrop-blur-3xl ${glassyClass}`}>
                        <div className="flex-shrink-0">
                            {activeToast.type === 'success' && <CheckCircle2 size={20} className="text-green-500" />}
                            {activeToast.type === 'error' && <XCircle size={20} className="text-red-500" />}
                            {activeToast.type === 'info' && <Info size={20} className="text-indigo-400" />}
                        </div>
                        <span className="text-sm font-bold tracking-tight whitespace-nowrap">{activeToast.message}</span>
                    </div>
                </div>
            )}

            {/* Dialog Overlay */}
            {activeDialog && (
                <div className={`fixed inset-0 z-[110] flex items-center justify-center p-6 transition-all duration-500 ${dialogVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500"
                        onClick={closeDialog}
                        style={{ opacity: dialogVisible ? 1 : 0 }}
                    />

                    <div className={`relative w-full max-w-sm rounded-[3rem] border backdrop-blur-[40px] p-10 flex flex-col items-center text-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${dialogVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'} ${glassyClass}`}>
                        <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-inner">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>

                        <h3 className="text-2xl font-extrabold tracking-tight mb-3">Wait a second!</h3>
                        <p className="text-[15px] opacity-60 mb-10 leading-relaxed font-semibold">
                            {activeDialog.message}
                        </p>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => {
                                    if (activeDialog.onCancel) activeDialog.onCancel();
                                    closeDialog();
                                }}
                                className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${appTheme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    activeDialog.onConfirm();
                                    closeDialog();
                                }}
                                className="flex-1 py-4 rounded-[1.5rem] bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-500/30 active:scale-95"
                            >
                                Confirm
                            </button>
                        </div>

                        <button
                            onClick={closeDialog}
                            className={`absolute top-8 right-8 p-2 rounded-full transition-all duration-200 ${appTheme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'} opacity-40 hover:opacity-100`}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
