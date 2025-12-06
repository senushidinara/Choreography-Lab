import React from 'react';
import { ViewState } from '../types';
import { Mic2, Music4, MessageSquare, LayoutGrid, Radio, CalendarCheck } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'home', label: 'Studio Home', icon: LayoutGrid },
    { id: 'daily', label: 'Daily Challenge', icon: CalendarCheck },
    { id: 'coach', label: 'Coach Maestro', icon: MessageSquare },
    { id: 'generator', label: 'Create Choreo', icon: Music4 },
    { id: 'library', label: 'My Routines', icon: Radio }, // Placeholder for saved
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full md:w-64 md:h-full bg-panel-gray border-t md:border-t-0 md:border-r border-gray-800 z-50">
      <div className="flex flex-col h-full">
        <div className="hidden md:flex items-center justify-center h-20 border-b border-gray-800">
          <h1 className="text-2xl font-serif italic text-white font-bold tracking-wider">
            Pulse <span className="text-hiphop-neon">&</span> Plié
          </h1>
        </div>
        
        <div className="flex md:flex-col justify-around md:justify-start md:p-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as ViewState)}
                className={`flex flex-col md:flex-row items-center md:px-4 md:py-3 mb-2 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'text-black bg-gradient-to-r from-white to-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <Icon size={20} className="mb-1 md:mb-0 md:mr-3" />
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="hidden md:block p-6">
          <div className="bg-gradient-to-br from-jazz-purple to-blue-900 rounded-xl p-4 text-center">
            <h3 className="font-bold text-sm mb-2">Pro Tip</h3>
            <p className="text-xs text-gray-200 italic">"Keep your core tight even when you drop the beat."</p>
          </div>
        </div>
      </div>
    </nav>
  );
};