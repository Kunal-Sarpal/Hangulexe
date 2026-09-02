import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icons from '../Icons';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  tabs, 
  activeTab, 
  onTabChange, 
  children, 
  width = 'max-w-2xl' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="club-settings-modal fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/55 backdrop-blur-[2px] transition-all"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white w-full ${width} rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200/80 max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-scale-in`} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Title, Subtitle, Close Button & Tabs */}
        <div className="bg-white border-b border-zinc-200/80 px-6 sm:px-8 pt-6 pb-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
              {subtitle && <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-normal">{subtitle}</p>}
            </div>
            <button 
              type="button"
              onClick={onClose} 
              className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 cursor-pointer"
            >
              <Icons.Close className="w-4 h-4" />
            </button>
          </div>

          {tabs && tabs.length > 0 && (
            <div className="flex items-center gap-6 mt-5 border-b border-zinc-200 -mb-4 overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange && onTabChange(tab)}
                  className={`pb-3 text-xs sm:text-sm font-semibold tracking-tight transition-all cursor-pointer whitespace-nowrap border-b-2 ${
                    activeTab === tab 
                      ? 'border-zinc-900 text-zinc-900 font-bold' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Modal Body */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
