import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { ChatInterface } from './components/ChatInterface';
import { ChoreoGenerator } from './components/ChoreoGenerator';
import { DailyRoutine } from './components/DailyRoutine';
import { ViewState } from './types';
import { PlayCircle, Award, Users, CalendarCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'daily':
        return <DailyRoutine />;
      case 'coach':
        return <ChatInterface />;
      case 'generator':
        return <ChoreoGenerator />;
      case 'library':
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-dark-stage p-10 text-center">
                <Award size={64} className="text-jazz-purple mb-4" />
                <h2 className="text-3xl font-serif mb-2">My Routine Library</h2>
                <p className="text-gray-500">Save your favorite generated choreographies here.</p>
                <button 
                    onClick={() => setCurrentView('generator')}
                    className="mt-6 px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
                >
                    Create First Routine
                </button>
            </div>
        );
      default:
        return <HomeView onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-stage text-white font-sans selection:bg-hiphop-neon selection:text-black">
      <Navigation currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 md:ml-64 relative">
        {renderContent()}
      </main>
    </div>
  );
};

const HomeView: React.FC<{ onChangeView: (view: ViewState) => void }> = ({ onChangeView }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background Image Placeholder using Picsum */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://picsum.photos/1920/1080?grayscale&blur=2" 
            alt="Dance Studio Background" 
            className="w-full h-full object-cover opacity-20"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-dark-stage via-dark-stage/80 to-transparent"></div>
      </div>

      <div className="relative z-10 p-8 md:p-16 max-w-6xl mx-auto flex flex-col justify-center min-h-screen">
        <span className="text-hiphop-neon font-bold tracking-widest uppercase mb-4 animate-fadeIn">The Future of Dance Training</span>
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight animate-slideUp">
          Master the art of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-kpop-blue to-jazz-purple">Fusion Dance</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Pulse & Plié is your AI-powered personal coach. Blend the discipline of Ballet with the grit of Hip Hop and the flair of K-Pop. Generate unique routines and get technical feedback instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div 
            onClick={() => onChangeView('daily')}
            className="group cursor-pointer bg-panel-gray/60 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl hover:bg-gray-800 hover:border-white transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CalendarCheck size={24} className="text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
                Start your day with a randomly generated fusion exercise and grade your performance.
            </p>
          </div>

          <div 
            onClick={() => onChangeView('coach')}
            className="group cursor-pointer bg-panel-gray/60 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl hover:bg-gray-800 hover:border-hiphop-neon transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-jazz-purple rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 flex items-center">
                Talk to Maestro 
                <span className="ml-2 text-xs bg-hiphop-neon text-black px-2 py-0.5 rounded font-bold">AI</span>
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
                Get personalized advice on technique, style corrections, and performance tips.
            </p>
          </div>

          <div 
            onClick={() => onChangeView('generator')}
            className="group cursor-pointer bg-panel-gray/60 backdrop-blur-sm border border-gray-700 p-6 rounded-2xl hover:bg-gray-800 hover:border-kpop-blue transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-kpop-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlayCircle size={24} className="text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Generate Choreography</h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
                Create unique 8-count routines mixing styles like Ballet, Jazz, and K-Pop instantly.
            </p>
          </div>
        </div>
        
        <div className="mt-16 flex items-center space-x-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Decorative Logos for 'Trust' */}
             <div className="text-xs font-mono uppercase tracking-widest">Styles Supported</div>
             <div className="h-px bg-gray-700 flex-1"></div>
             <span className="font-bold">BALLET</span>
             <span className="font-bold">CONTEMPORARY</span>
             <span className="font-bold">JAZZ</span>
             <span className="font-bold">HIP HOP</span>
             <span className="font-bold">K-POP</span>
        </div>
      </div>
    </div>
  );
};

export default App;