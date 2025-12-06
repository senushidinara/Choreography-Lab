import React, { useState, useEffect } from 'react';
import { DailyChallenge } from '../types';
import { generateDailyChallenge, submitGrading } from '../services/gemini';
import { Calendar, Clock, Target, CheckCircle2, Star, Award, Dumbbell, Move, RefreshCcw } from 'lucide-react';

export const DailyRoutine: React.FC = () => {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'challenge' | 'workout'>('challenge');

  // Dance Challenge State
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [challengeGrade, setChallengeGrade] = useState<number>(0);
  const [challengeNotes, setChallengeNotes] = useState('');
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [submittingChallengeGrade, setSubmittingChallengeGrade] = useState(false);

  // Workout State
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [workoutGrade, setWorkoutGrade] = useState<number>(0);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [workoutFeedback, setWorkoutFeedback] = useState<string | null>(null);
  const [submittingWorkoutGrade, setSubmittingWorkoutGrade] = useState(false);

  // Load from local storage or generate
  useEffect(() => {
    const saved = localStorage.getItem('pulse_daily_challenge');
    const savedDate = localStorage.getItem('pulse_daily_date');
    const today = new Date().toISOString().split('T')[0];

    if (saved && savedDate === today) {
      setChallenge(JSON.parse(saved));
    } else {
      fetchNewChallenge();
    }
  }, []);

  const fetchNewChallenge = async () => {
    setLoading(true);
    resetStates();
    try {
      const newChallenge = await generateDailyChallenge();
      setChallenge(newChallenge);
      localStorage.setItem('pulse_daily_challenge', JSON.stringify(newChallenge));
      localStorage.setItem('pulse_daily_date', new Date().toISOString().split('T')[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetStates = () => {
    setChallengeCompleted(false);
    setChallengeGrade(0);
    setChallengeNotes('');
    setChallengeFeedback(null);
    setWorkoutCompleted(false);
    setWorkoutGrade(0);
    setWorkoutNotes('');
    setWorkoutFeedback(null);
  };

  const handleSubmitChallengeGrade = async () => {
    if (!challenge || challengeGrade === 0) return;
    setSubmittingChallengeGrade(true);
    try {
      const response = await submitGrading('Challenge', challenge.title, challengeGrade, challengeNotes);
      setChallengeFeedback(response);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingChallengeGrade(false);
    }
  };

  const handleSubmitWorkoutGrade = async () => {
    if (!challenge || workoutGrade === 0) return;
    setSubmittingWorkoutGrade(true);
    try {
      const response = await submitGrading('Workout', challenge.workout.title, workoutGrade, workoutNotes);
      setWorkoutFeedback(response);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingWorkoutGrade(false);
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen overflow-y-auto pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">Daily Routine</h2>
                <p className="text-gray-400">Consistency is the key to mastery.</p>
            </div>
            <button 
                onClick={fetchNewChallenge}
                className="text-xs text-gray-500 hover:text-white flex items-center gap-1"
            >
                <RefreshCcw size={12} /> Refresh Plan
            </button>
        </div>

        {loading && (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-hiphop-neon border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse text-sm tracking-widest uppercase">Maestro is designing today's session...</p>
             </div>
        )}

        {!loading && challenge && (
            <div>
                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b border-gray-800 pb-2">
                    <button
                        onClick={() => setActiveTab('challenge')}
                        className={`flex items-center pb-2 px-4 transition-colors relative ${
                            activeTab === 'challenge' 
                            ? 'text-white font-bold' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <Move size={18} className="mr-2" />
                        Fusion Challenge
                        {activeTab === 'challenge' && <div className="absolute bottom-[-9px] left-0 w-full h-1 bg-hiphop-neon rounded-t-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('workout')}
                        className={`flex items-center pb-2 px-4 transition-colors relative ${
                            activeTab === 'workout' 
                            ? 'text-white font-bold' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        <Dumbbell size={18} className="mr-2" />
                        Conditioning Workout
                        {activeTab === 'workout' && <div className="absolute bottom-[-9px] left-0 w-full h-1 bg-kpop-blue rounded-t-full"></div>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Content Card */}
                    <div className="bg-panel-gray border border-gray-800 rounded-3xl p-8 relative overflow-hidden min-h-[500px]">
                        
                        {activeTab === 'challenge' ? (
                            <div className="animate-fadeIn">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-jazz-purple opacity-20 blur-[50px] rounded-full"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full border border-gray-700 font-bold uppercase tracking-wider">
                                            {challenge.styleMix.join(' + ')}
                                        </span>
                                        <div className="flex items-center text-gray-400 text-xs">
                                            <Clock size={12} className="mr-1" />
                                            {challenge.durationMinutes} mins
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4 text-white leading-tight">{challenge.title}</h3>
                                    <p className="text-gray-300 leading-relaxed mb-8">{challenge.description}</p>

                                    <div className="bg-black/30 rounded-xl p-5 mb-8">
                                        <h4 className="flex items-center text-sm font-bold text-hiphop-neon uppercase tracking-wider mb-4">
                                            <Target size={16} className="mr-2" /> Focus Points
                                        </h4>
                                        <ul className="space-y-3">
                                            {challenge.focusPoints.map((point, i) => (
                                                <li key={i} className="flex items-start text-sm text-gray-300">
                                                    <span className="w-1.5 h-1.5 bg-kpop-blue rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {!challengeCompleted ? (
                                        <button 
                                            onClick={() => setChallengeCompleted(true)}
                                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-hiphop-neon transition-colors flex items-center justify-center group"
                                        >
                                            <CheckCircle2 size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                                            Mark Challenge Complete
                                        </button>
                                    ) : (
                                        <div className="w-full bg-green-900/30 border border-green-500/30 text-green-400 py-3 rounded-xl flex items-center justify-center font-medium">
                                            <CheckCircle2 size={18} className="mr-2" />
                                            Challenge Done
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fadeIn">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-kpop-blue opacity-10 blur-[50px] rounded-full"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full border border-gray-700 font-bold uppercase tracking-wider">
                                            {challenge.workout.focusArea}
                                        </span>
                                        <div className="flex items-center text-gray-400 text-xs">
                                            <Clock size={12} className="mr-1" />
                                            {challenge.workout.durationMinutes} mins
                                        </div>
                                    </div>

                                    <h3 className="text-3xl font-bold mb-4 text-white leading-tight">{challenge.workout.title}</h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        {challenge.workout.exercises.map((ex, i) => (
                                            <div key={i} className="bg-black/30 p-4 rounded-xl border border-gray-800">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-white">{ex.name}</h4>
                                                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-200">{ex.sets} x {ex.reps}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 italic">{ex.instruction}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {!workoutCompleted ? (
                                        <button 
                                            onClick={() => setWorkoutCompleted(true)}
                                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-kpop-blue hover:text-white transition-colors flex items-center justify-center group"
                                        >
                                            <CheckCircle2 size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                                            Mark Workout Complete
                                        </button>
                                    ) : (
                                        <div className="w-full bg-green-900/30 border border-green-500/30 text-green-400 py-3 rounded-xl flex items-center justify-center font-medium">
                                            <CheckCircle2 size={18} className="mr-2" />
                                            Workout Done
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grading Section - Dynamic based on active Tab */}
                    <div className="h-full">
                        {activeTab === 'challenge' ? (
                            <div className={`transition-all duration-500 h-full ${challengeCompleted ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}`}>
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 h-full flex flex-col">
                                    {!challengeFeedback ? (
                                        <>
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                                <Award size={20} className="mr-2 text-yellow-500" />
                                                Grade Challenge
                                            </h3>
                                            
                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() => setChallengeGrade(num)}
                                                            className={`w-7 h-7 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                                                challengeGrade === num 
                                                                ? 'bg-hiphop-neon text-black scale-110' 
                                                                : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6 flex-1">
                                                <textarea
                                                    value={challengeNotes}
                                                    onChange={(e) => setChallengeNotes(e.target.value)}
                                                    placeholder="How was your flow? Note specific difficulties..."
                                                    className="w-full h-full min-h-[100px] bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-hiphop-neon resize-none placeholder-gray-600"
                                                ></textarea>
                                            </div>

                                            <button
                                                onClick={handleSubmitChallengeGrade}
                                                disabled={challengeGrade === 0 || submittingChallengeGrade}
                                                className="w-full bg-gradient-to-r from-jazz-purple to-purple-600 hover:to-purple-500 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                            >
                                                {submittingChallengeGrade ? 'Submitting...' : 'Submit Evaluation'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col h-full justify-center items-center text-center animate-fadeIn">
                                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,165,0,0.3)]">
                                                <span className="text-2xl font-bold text-black">{challengeGrade}</span>
                                            </div>
                                            <h3 className="text-xl font-serif font-bold text-white mb-4">Challenge Feedback</h3>
                                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl relative w-full mb-4">
                                                <p className="text-gray-200 italic">{challengeFeedback}</p>
                                            </div>
                                            <button 
                                                onClick={() => { setChallengeFeedback(null); setChallengeCompleted(false); setChallengeGrade(0); setChallengeNotes(''); }}
                                                className="text-xs text-gray-500 hover:text-white"
                                            >
                                                Retry Grading
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={`transition-all duration-500 h-full ${workoutCompleted ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}`}>
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 h-full flex flex-col">
                                    {!workoutFeedback ? (
                                        <>
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                                <Dumbbell size={20} className="mr-2 text-kpop-blue" />
                                                Grade Workout
                                            </h3>
                                            
                                            <div className="mb-6">
                                                <div className="flex justify-between items-center mb-2">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                                        <button
                                                            key={num}
                                                            onClick={() => setWorkoutGrade(num)}
                                                            className={`w-7 h-7 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-bold transition-all ${
                                                                workoutGrade === num 
                                                                ? 'bg-kpop-blue text-black scale-110' 
                                                                : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                                                            }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mb-6 flex-1">
                                                <textarea
                                                    value={workoutNotes}
                                                    onChange={(e) => setWorkoutNotes(e.target.value)}
                                                    placeholder="Did you hit all reps? How was your endurance?"
                                                    className="w-full h-full min-h-[100px] bg-black/50 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-kpop-blue resize-none placeholder-gray-600"
                                                ></textarea>
                                            </div>

                                            <button
                                                onClick={handleSubmitWorkoutGrade}
                                                disabled={workoutGrade === 0 || submittingWorkoutGrade}
                                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-400 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                            >
                                                {submittingWorkoutGrade ? 'Submitting...' : 'Submit Evaluation'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col h-full justify-center items-center text-center animate-fadeIn">
                                            <div className="w-16 h-16 bg-gradient-to-br from-kpop-blue to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                                                <span className="text-2xl font-bold text-black">{workoutGrade}</span>
                                            </div>
                                            <h3 className="text-xl font-serif font-bold text-white mb-4">Workout Feedback</h3>
                                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl relative w-full mb-4">
                                                <p className="text-gray-200 italic">{workoutFeedback}</p>
                                            </div>
                                            <button 
                                                onClick={() => { setWorkoutFeedback(null); setWorkoutCompleted(false); setWorkoutGrade(0); setWorkoutNotes(''); }}
                                                className="text-xs text-gray-500 hover:text-white"
                                            >
                                                Retry Grading
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};