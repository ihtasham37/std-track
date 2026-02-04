
import React, { useState, useEffect } from 'react';
/* Use AIResult as the core roadmap type instead of missing Roadmap member */
import { AIResult, UniversitySuggestion, UserProfile } from '../types';
import WeeklyPlanCard from './WeeklyPlanCard';
import CareerCard from './CareerCard';
import { BookOpen, Target, ChevronLeft, Send, Sparkles, ExternalLink, Edit3, Home, Eraser, Trash2, UserCog } from 'lucide-react';
// Fix: changed askAcademicQuestion to askAcademicQuestionStream
import { askAcademicQuestionStream } from '../services/gemini';
import { auth, saveChatMessage, listenToChat, deleteChatMessage, clearChatHistory } from '../services/firebase';

interface Props {
  /* AIResult is the correct exported type from types.ts */
  roadmap: AIResult;
  onUpdateProgress: (update: string) => void;
  onGoBack: () => void;
  onEditProfile?: (profile: UserProfile) => void;
}

const RoadmapDashboard: React.FC<Props> = ({ roadmap, onGoBack, onEditProfile }) => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [view, setView] = useState<'dashboard' | 'university-list' | 'university-detail'>('dashboard');
  const [selectedUni, setSelectedUni] = useState<UniversitySuggestion | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  // Added local state for streaming feedback if needed, though primarily used to collect response
  const [streamingText, setStreamingText] = useState("");

  useEffect(() => {
    if (!auth.currentUser || !roadmap.id) return;
    return listenToChat(auth.currentUser.uid, roadmap.id, setChatHistory);
  }, [roadmap.id]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !auth.currentUser) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    await saveChatMessage(auth.currentUser.uid, roadmap.id, { role: 'user', text: userMsg, timestamp: Date.now() });
    setIsChatLoading(true);
    setStreamingText("");

    try {
      // Fix: Use askAcademicQuestionStream and iterate over the generator
      const stream = askAcademicQuestionStream(userMsg, chatHistory, {
        mode: roadmap.mode,
        selectedDetail: selectedUni?.name || roadmap.profile.interests[0],
        country: roadmap.profile.country,
        interests: roadmap.profile.interests
      });
      
      let fullResponse = "";
      for await (const chunk of stream) {
        fullResponse += chunk;
        setStreamingText(fullResponse);
      }
      await saveChatMessage(auth.currentUser.uid, roadmap.id, { role: 'ai', text: fullResponse, timestamp: Date.now() });
    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsChatLoading(false); 
      setStreamingText("");
    }
  };

  const handleDeleteMsg = async (msgId: string) => {
    if (auth.currentUser) await deleteChatMessage(auth.currentUser.uid, roadmap.id, msgId);
  };

  const handleClearChat = async () => {
    if (confirm("Permanently clear this conversation?") && auth.currentUser) {
      await clearChatHistory(auth.currentUser.uid, roadmap.id);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4">
          <button onClick={onGoBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">
            <ChevronLeft size={16} /> Archive
          </button>
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-blue-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">
            <Home size={16} /> Main Page
          </button>
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          {['dashboard', 'university-list'].map((v) => (
            <button 
              key={v}
              onClick={() => setView(v as any)}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${view === v || (view === 'university-detail' && v === 'university-list') ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {v === 'dashboard' ? 'Roadmap' : 'Institutions'}
            </button>
          ))}
        </div>
      </div>

      {view === 'dashboard' && (
        <div className="space-y-8">
          <div className="glass rounded-[40px] p-10 border border-white/5 flex flex-col md:flex-row gap-8 items-start shadow-2xl relative overflow-hidden group">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black text-white tracking-tight">Active Blueprint: {roadmap.profile.interests[0]}</h1>
                <button 
                  onClick={() => onEditProfile && onEditProfile(roadmap.profile)}
                  className="p-2 bg-white/5 text-slate-400 hover:text-blue-500 hover:bg-white/10 rounded-xl transition-all"
                  title="Modify Profile & Re-architect"
                >
                  <UserCog size={20}/>
                </button>
              </div>
              <p className="text-slate-400 text-lg font-medium italic leading-relaxed">"{roadmap.summary}"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight"><BookOpen className="text-blue-500" size={24} /> Weekly Schedule</h2>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {/* AIResult properties like weekly_plan are optional, added null check */}
                  {(roadmap.weekly_plan || []).map(wp => (
                    <button key={wp.week} onClick={() => setActiveWeek(wp.week)} className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${activeWeek === wp.week ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300'}`}>
                      {wp.week}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                {/* Handling optional properties with optional chaining */}
                {(roadmap.weekly_plan || []).find(w => w.week === activeWeek)?.tasks?.map((task, idx) => <WeeklyPlanCard key={idx} task={task} />)}
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight"><Target className="text-indigo-500" size={24} /> Future Roles</h2>
              <div className="grid gap-4">
                {/* Handling optional career_suggestions */}
                {(roadmap.career_suggestions || []).map((path, idx) => <CareerCard key={idx} path={path} />)}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'university-list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
          {/* Changed university_suggestions to universities to match the exported AIResult interface */}
          {(roadmap.universities || []).map((uni, idx) => (
            <div key={idx} onClick={() => { setSelectedUni(uni); setView('university-detail'); }} className="glass rounded-[32px] p-8 border border-white/5 shadow-xl hover:border-blue-500/40 hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden">
              <h3 className="text-xl font-black text-white leading-tight group-hover:text-blue-400 transition-colors mb-2">{uni.name}</h3>
              <p className="text-blue-500 font-black text-[9px] uppercase tracking-[0.2em] mb-4">{uni.degree}</p>
              <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">{uni.description}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'university-detail' && selectedUni && (
        <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
          <div className="glass rounded-[48px] p-12 border border-white/5 shadow-2xl space-y-6">
            <h1 className="text-4xl font-black text-white tracking-tight">{selectedUni.name}</h1>
            <p className="text-slate-400 text-base font-medium leading-relaxed">{selectedUni.description}</p>
            <a href={selectedUni.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">Official Portal <ExternalLink size={18}/></a>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">Academic Advisor <Sparkles size={20} className="text-blue-500" /></h2>
              <button onClick={handleClearChat} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                <Eraser size={14} /> Clear Chat
              </button>
            </div>
            
            <div className="glass rounded-[40px] p-8 border border-white/5 min-h-[500px] flex flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide mb-8 pr-2">
                {chatHistory.length === 0 && <div className="h-full flex items-center justify-center text-slate-700 opacity-50 font-bold uppercase tracking-widest">Query the advisor about {selectedUni.name}</div>}
                {chatHistory.sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0)).map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group/msg animate-in slide-in-from-bottom-2`}>
                    <div className="relative max-w-[90%]">
                      <div className={`rounded-[28px] px-7 py-5 shadow-2xl border text-[14px] chat-bubble ${msg.role === 'user' ? 'bg-blue-600 text-white border-blue-500 rounded-br-none' : 'bg-slate-800/80 text-slate-200 border-white/10 rounded-bl-none'}`}>
                        {msg.text}
                      </div>
                      <button 
                        onClick={() => handleDeleteMsg(msg.id)} 
                        className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover/msg:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Show streaming response if active */}
                {streamingText && (
                  <div className="flex justify-start">
                    <div className="relative max-w-[90%]">
                      <div className="rounded-[28px] px-7 py-5 bg-slate-800/80 text-slate-200 border border-white/10 rounded-bl-none text-[14px] chat-bubble shadow-2xl animate-pulse">
                        {streamingText}
                      </div>
                    </div>
                  </div>
                )}
                {isChatLoading && !streamingText && <div className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Reasoning engine processing...</div>}
              </div>
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={`Ask anything about ${selectedUni.name}...`} className="flex-1 px-8 py-5 bg-slate-900 border border-white/10 text-white text-sm font-bold outline-none rounded-3xl focus:border-blue-500 transition-all"/>
                <button disabled={isChatLoading || !chatInput.trim()} className="p-5 bg-blue-600 text-white rounded-[24px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"><Send size={24}/></button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapDashboard;
