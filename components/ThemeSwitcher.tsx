import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const themes = [
    { id: 'blue', color: '#1E40AF', name: 'Blue' },
    { id: 'emerald', color: '#047857', name: 'Emerald' },
    { id: 'purple', color: '#6D28D9', name: 'Purple' },
    { id: 'orange', color: '#C2410C', name: 'Orange' },
    { id: 'rose', color: '#BE123C', name: 'Rose' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors relative"
        title="Change Theme"
      >
        <Palette className="w-5 h-5" />
        <span 
          className="absolute top-2 right-2 w-2 h-2 rounded-full border border-slate-800"
          style={{ backgroundColor: themes.find(t => t.id === theme)?.color || themes[0].color }}
        ></span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider mb-1">Select Theme</p>
          <div className="grid grid-cols-5 gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 border-2 ${theme === t.id ? 'border-slate-800' : 'border-transparent'}`}
                style={{ backgroundColor: t.color }}
                title={t.name}
              >
                {theme === t.id && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-500 font-medium">{themes.find(t => t.id === theme)?.name} Theme</span>
          </div>
        </div>
      )}
    </div>
  );
};