import React, { useState } from 'react';
import { DanceStyle, GeneratedRoutine } from '../types';
import { generateChoreography } from '../services/gemini';
import { Wand2, Music, AlertCircle, Play, Info } from 'lucide-react';

export const ChoreoGenerator: React.FC = () => {
  const [selectedStyles, setSelectedStyles] = useState<DanceStyle[]>([]);
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [vibe, setVibe] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [routine, setRoutine] = useState<GeneratedRoutine | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleStyle = (style: DanceStyle) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleGenerate = async () => {
    if (selectedStyles.length === 0) {
      setError("Please select at least one style.");
      return;
    }
    if (!vibe) {
      setError("Please describe the song vibe.");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    setRoutine(null);

    try {
      const result = await generateChoreography(selectedStyles, difficulty, vibe);
      setRoutine(result);
    } catch (err) {
      setError("Failed to generate choreography. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStyleColor = (style: string) => {
      switch(style) {
          case 'Ballet': return 'text-pink-300 border-pink-300';
          case 'Hip Hop': return 'text-hiphop-neon border-hiphop-neon';
          case 'K-Pop': return 'text-kpop-blue border-kpop-blue';
          case 'Jazz': return 'text-purple-400 border-purple-400';
          default: return 'text-gray-300 border-gray-300';
      }
  }

  return (
    <div className="p-6 md:p-10 min-h-screen pb-24 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Choreography Lab
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* Styles */}
                <div className="bg-panel-gray p-6 rounded-2xl border border-gray-800">
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Select Styles</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(DanceStyle).map((style) => (
                            <button
                                key={style}
                                onClick={() => toggleStyle(style)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                                    selectedStyles.includes(style)
                                    ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="bg-panel-gray p-6 rounded-2xl border border-gray-800">
                     <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Difficulty Level</label>
                     <div className="flex bg-black/30 rounded-lg p-1">
                        {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`flex-1 py-2 text-xs md:text-sm rounded-md transition-colors ${
                                    difficulty === level ? 'bg-gray-700 text-white font-bold' : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                     </div>
                </div>

                {/* Vibe */}
                <div className="bg-panel-gray p-6 rounded-2xl border border-gray-800">
                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Music Vibe</label>
                    <textarea
                        value={vibe}
                        onChange={(e) => setVibe(e.target.value)}
                        placeholder="e.g. Upbeat K-pop song with a heavy trap beat, or a sad piano ballet piece..."
                        className="w-full bg-black/30 border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-hiphop-neon focus:outline-none h-24 resize-none"
                    />
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-jazz-purple to-kpop-blue hover:from-purple-600 hover:to-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
                >
                    {isGenerating ? (
                        <span className="flex items-center">Generating Steps...</span>
                    ) : (
                        <span className="flex items-center"><Wand2 size={18} className="mr-2" /> Generate Routine</span>
                    )}
                </button>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-2">
                {!routine && !isGenerating && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl min-h-[400px]">
                        <Music size={48} className="mb-4 opacity-50" />
                        <p className="text-lg">Configure your preferences to generate a routine.</p>
                    </div>
                )}

                {isGenerating && (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-white space-y-4">
                         <div className="w-16 h-16 border-4 border-t-hiphop-neon border-r-kpop-blue border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
                         <p className="animate-pulse text-sm uppercase tracking-widest font-mono">Maestro is crafting steps...</p>
                    </div>
                )}

                {routine && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Header Card */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 p-6 md:p-8 rounded-3xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                             
                             <div className="relative z-10">
                                <div className="flex items-center space-x-2 text-xs font-bold text-hiphop-neon uppercase tracking-widest mb-2">
                                    <span>{routine.difficulty}</span>
                                    <span>•</span>
                                    <span>{selectedStyles.join(' + ')}</span>
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">{routine.title}</h3>
                                <div className="flex items-center text-gray-400 text-sm">
                                    <Music size={14} className="mr-2" />
                                    <span>Suggested Track: {routine.musicSuggestion}</span>
                                </div>
                             </div>
                        </div>

                        {/* Steps Timeline */}
                        <div className="space-y-4">
                            {routine.steps.map((step, index) => (
                                <div key={index} className="bg-panel-gray/50 border border-gray-800 hover:border-gray-600 p-5 rounded-xl transition-colors group flex flex-col md:flex-row gap-4">
                                    {/* Count Circle */}
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold font-mono text-lg shadow-inner group-hover:border-white/20 transition-colors">
                                            {step.count}
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-white font-semibold text-lg">{step.action}</h4>
                                            <span className={`text-xs px-2 py-1 rounded border ${getStyleColor(step.styleFocus)}`}>
                                                {step.styleFocus}
                                            </span>
                                        </div>
                                        <div className="flex items-start text-gray-400 text-sm bg-black/20 p-3 rounded-lg">
                                            <Info size={14} className="mr-2 mt-0.5 flex-shrink-0 text-kpop-blue" />
                                            <p>{step.technicalNote}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <button className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                                <Play size={16} className="mr-2" /> Practice Mode (Coming Soon)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};