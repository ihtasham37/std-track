import React, { useState, useEffect } from 'react';
import { UserProfile, AIResult, AppMode } from './types';
import MissionHub from './components/MissionHub';
import DynamicForm from './components/DynamicForm';
import AIResultDashboard from './components/AIResultDashboard';
import ProfileView from './components/ProfileView';
import { Auth } from './components/Auth';
import Sidebar from './components/Sidebar';
import { auth, saveUserRoadmap, fetchUserRoadmaps, saveUserProfile, fetchUserProfile, deleteUserRoadmap } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { generateAIContent } from './services/gemini';
import { Loader2, GraduationCap, Menu, LogOut, Home, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [results, setResults] = useState<AIResult[]>([]);
  const [currentResultId, setCurrentResultId] = useState<string | null>(null);
  const [view, setView] = useState<'hub' | 'form' | 'dashboard' | 'profile'>('hub');
  const [activeMode, setActiveMode] = useState<AppMode>('SKILL');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const currentResult = results.find(r => r.id === currentResultId);

  useEffect(() => {
    // Monitor auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const [saved, p] = await Promise.all([
            fetchUserRoadmaps(user.uid),
            fetchUserProfile(user.uid)
          ]);
          setResults(saved as AIResult[]);
          setProfileData(p);
        } catch (e) {
          console.error("Critical: Initial Data Sync Failed", e);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleModeSelect = (mode: AppMode) => {
    setActiveMode(mode);
    setView('form');
    setErrorState(null);
  };

  const handleFormSubmit = async (profile: UserProfile) => {
    if (!currentUser) return;
    setIsLoading(true);
    setErrorState(null);
    try {
      // Save profile updates
      await saveUserProfile(currentUser.uid, profile);
      
      // Call Gemini AI
      const aiData = await generateAIContent(activeMode, profile);
      
      const newResult: AIResult = {
        ...aiData,
        id: Math.random().toString(36).substr(2, 9),
        mode: activeMode,
        timestamp: Date.now(),
        profile,
        title: profile.targetJob || profile.targetField || profile.interests?.[0] || 'AI Strategy'
      };

      // Persistence
      await saveUserRoadmap(currentUser.uid, newResult);
      setResults(prev => [newResult, ...prev]);
      setCurrentResultId(newResult.id);
      setView('dashboard');
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      setErrorState(err.message || "The AI engine is currently unavailable. Please verify your API Key in Netlify settings.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617]">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Initializing Neural Link...</p>
    </div>
  );

  if (!currentUser) return <Auth />;

  return (
    <div className="min-h-screen flex flex-col relative bg-[#020617]">
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center glass bg-black/40">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">Synthesizing Blueprint</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Querying Gemini Intelligence...</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="glass sticky top-0 z-40 h-20 border-b border-white/5 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-2 text-slate-400 hover:text-white transition-all bg-white/5 rounded-xl border border-white/5"
            >
              <Menu size={24} />
            </button>
            <button onClick={() => setView('hub')} className="flex items-center gap-3">
              <GraduationCap className="text-blue-500" size={28} />
              <span className="font-black text-xl tracking-tighter text-white uppercase italic hidden sm:block">StdTrack AI</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setView('hub')} className="p-2.5 text-slate-400 hover:text-white"><Home size={20} /></button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <button onClick={() => signOut(auth)} className="p-2.5 text-slate-400 hover:text-red-400"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        user={currentUser}
        profile={profileData}
        results={results}
        onSelectResult={(id) => { setCurrentResultId(id); setView('dashboard'); setIsSidebarOpen(false); }}
        onDeleteResult={async (id) => { 
           await deleteUserRoadmap(currentUser.uid, id);
           setResults(prev => prev.filter(r => r.id !== id));
           if (currentResultId === id) setView('hub');
        }}
        onRenameResult={() => {}} 
        onProfileClick={() => { setView('profile'); setIsSidebarOpen(false); }}
      />

      <main className="flex-1 max-w-7xl mx-auto p-4 sm:p-10 w-full animate-fade-in">
        {errorState && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p className="text-xs font-bold">{errorState}</p>
            <button onClick={() => setErrorState(null)} className="ml-auto text-[10px] font-black uppercase">Dismiss</button>
          </div>
        )}

        {view === 'hub' && <MissionHub onSelect={handleModeSelect} />}
        {view === 'form' && <DynamicForm mode={activeMode} onSubmit={handleFormSubmit} initialData={profileData} />}
        {view === 'dashboard' && currentResult && (
          <AIResultDashboard result={currentResult} onGoBack={() => setView('hub')} onEdit={() => setView('form')} />
        )}
        {view === 'profile' && (
          <ProfileView 
            roadmaps={results} 
            onSelectRoadmap={(id) => { setCurrentResultId(id); setView('dashboard'); }} 
            onBack={() => setView('hub')} 
            onUpdateProfile={(p) => setProfileData(p)}
          />
        )}
      </main>
      
      {/* Footer Branding */}
      <footer className="py-10 text-center opacity-20 border-t border-white/5 mt-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">StdTrack Neural Network &copy; 2024</p>
      </footer>
    </div>
  );
};

export default App;