
import React, { useState, useEffect, useRef } from 'react';
import { AIResult, UserProfile } from '../types';
import { ChevronLeft, Send, Sparkles, ExternalLink, Trash2, Eraser, Youtube, Globe, Landmark, Award, Briefcase, Edit3 } from 'lucide-react';
import { askAcademicQuestionStream } from '../services/gemini';
import { auth, saveChatMessage, listenToChat, deleteChatMessage, clearChatHistory } from '../services/firebase';

interface Props {
  result: AIResult;
  onGoBack: () => void;
  onEdit: (profile: UserProfile) => void;
}

const AIResultDashboard: React.FC<Props> = ({ result, onGoBack, onEdit }) => {
  const [activeDetail, setActiveDetail] = useState<{ type: string, data: any } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.currentUser || !result.id || !activeDetail) return;
    return listenToChat(auth.currentUser.uid, `${result.id}_${activeDetail.data.name || activeDetail.data.title}`, setChatHistory);
  }, [result.id, activeDetail]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingText]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !auth.currentUser || !activeDetail) return;
    const msg = chatInput.trim();
    const storageId = `${result.id}_${activeDetail.data.name || activeDetail.data.title}`;
    
    setChatInput('');
    setStreamingText("");
    await saveChatMessage(auth.currentUser.uid, storageId, { role: 'user', text: msg, timestamp: Date.now() });
    setIsChatLoading(true);

    let fullResponse = "";
    try {
      const stream = askAcademicQuestionStream(msg, chatHistory, {
        ...result,
        selectedDetail: activeDetail.data.name || activeDetail.data.title
      });
      for await (const text of stream) {
        fullResponse += text;
        setStreamingText(fullResponse);
      }
      await saveChatMessage(auth.currentUser.uid, storageId, { role: 'ai', text: fullResponse, timestamp: Date.now() });
    } catch (e: any) {
       console.error(e);
    } finally { 
      setIsChatLoading(false); 
      setStreamingText("");
    }
  };

  const handleClearHistory = async () => {
     if (activeDetail && confirm("Purge conversation history?")) {
        const storageId = `${result.id}_${activeDetail.data.name || activeDetail.data.title}`;
        await clearChatHistory(auth.currentUser!.uid, storageId);
     }
  };

  if (activeDetail) {
    return (
      <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-20 max-w-5xl mx-auto">
        <button onClick={() => setActiveDetail(null)} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
          <ChevronLeft size={16} /> Return to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
           <div className="glass rounded-[48px] p-10 border border-white/5 shadow-2xl space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-4">
                 {activeDetail.type === 'uni' && <Landmark size={32} className="text-indigo-400" />}
                 {activeDetail.type === 'sch' && <Award size={32} className="text-emerald-400" />}
                 {activeDetail.type === 'job' && <Briefcase size={32} className="text-orange-400" />}
                 {activeDetail.type === 'course' && (activeDetail.data.type === 'youtube' ? <Youtube size={32} className="text-red-500" /> : <Globe size={32} className="text-blue-500" />)}
                 <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{activeDetail.data.name || activeDetail.data.title}</h1>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">{activeDetail.data.description}</p>
              <div className="bg-white/5 p-6 rounded-3xl space-y-3">
                 {activeDetail.data.company && <p className="text-sm font-bold text-slate-300">Organization: <span className="text-orange-400">{activeDetail.data.company}</span></p>}
                 {activeDetail.data.provider && <p className="text-sm font-bold text-slate-300">Provider: <span className="text-emerald-400">{activeDetail.data.provider}</span></p>}
                 {activeDetail.data.platform && <p className="text-sm font-bold text-slate-300">Platform: <span className="text-blue-400">{activeDetail.data.platform}</span></p>}
                 {activeDetail.data.location && <p className="text-sm font-bold text-slate-300">Location: <span className="text-white">{activeDetail.data.location}</span></p>}
                 {activeDetail.data.coverage && <p className="text-sm font-bold text-slate-300">Coverage: <span className="text-white">{activeDetail.data.coverage}</span></p>}
              </div>
              <a href={activeDetail.data.website || activeDetail.data.link || activeDetail.data.url} target="_blank" className="block text-center py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl">Engage Portal <ExternalLink size={14} className="inline ml-2" /></a>
           </div>

           <div className="flex flex-col h-full min-h-[600px] space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black text-white flex items-center gap-2">AI ADVISOR <Sparkles size={20} className="text-blue-500" /></h2>
                 <button onClick={handleClearHistory} className="p-2 text-slate-500 hover:text-red-400"><Eraser size={18}/></button>
              </div>
              <div className="glass rounded-[40px] p-8 border border-white/5 flex-1 flex flex-col">
                 <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide mb-6 pr-2">
                    {chatHistory.length === 0 && <div className="h-full flex items-center justify-center text-slate-700 opacity-40 font-black text-[10px] uppercase tracking-[0.4em] text-center px-10">Neural Interface Standby... Ask about this item.</div>}
                    {chatHistory.sort((a,b) => a.timestamp - b.timestamp).map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2`}>
                        <div className="relative max-w-[90%]">
                           <div className={`rounded-3xl px-6 py-5 shadow-2xl border chat-bubble ${msg.role === 'user' ? 'bg-blue-600 text-white border-blue-500 rounded-br-none' : 'bg-slate-800/80 text-slate-200 border-white/10 rounded-bl-none'}`}>
                             {msg.text}
                           </div>
                           <button onClick={() => deleteChatMessage(auth.currentUser!.uid, `${result.id}_${activeDetail.data.name || activeDetail.data.title}`, msg.id)} className="absolute -top-3 -right-3 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={10}/></button>
                        </div>
                      </div>
                    ))}
                    {streamingText && (
                      <div className="flex justify-start">
                        <div className="rounded-3xl px-6 py-5 bg-slate-800/80 text-slate-200 border border-white/10 rounded-bl-none max-w-[90%] chat-bubble shadow-2xl typing-cursor">
                          {streamingText}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>
                 <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type your inquiry..." className="flex-1 px-6 py-4 bg-slate-900 border border-white/10 text-white text-sm font-bold outline-none rounded-2xl focus:border-blue-500 transition-all shadow-inner"/>
                    <button disabled={isChatLoading || !chatInput.trim()} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"><Send size={20}/></button>
                 </form>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onGoBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
          <ChevronLeft size={16} /> Exit Registry
        </button>
        <button onClick={() => onEdit(result.profile)} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg glow-button">
          <Edit3 size={16} /> Re-configure Search
        </button>
      </div>

      <div className="space-y-10">
         <div className="glass rounded-[40px] p-10 border border-white/5 shadow-2xl space-y-4">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
               {result.mode === 'SKILL' ? 'Mastery Hub' : result.mode === 'UNIVERSITY' ? 'Institutional Registry' : result.mode === 'SCHOLARSHIP' ? 'Financial Aid Directory' : 'Career agent logs'}
            </h1>
            <p className="text-slate-400 text-lg font-medium italic leading-relaxed">"{result.summary}"</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.mode === 'SKILL' && (result.courses || []).map((c, i) => (
               <div key={i} onClick={() => setActiveDetail({ type: 'course', data: c })} className="glass p-8 rounded-[32px] border border-white/5 hover:border-blue-500/40 hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="p-4 bg-white/5 text-blue-500 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                     {c.type === 'youtube' ? <Youtube size={28}/> : <Globe size={28}/>}
                  </div>
                  <h4 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors mb-2 leading-tight">{c.title}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">{c.platform}</p>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{c.description}</p>
               </div>
            ))}

            {result.mode === 'UNIVERSITY' && (result.universities || []).map((uni, i) => (
               <div key={i} onClick={() => setActiveDetail({ type: 'uni', data: uni })} className="glass p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/40 hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="p-4 bg-white/5 text-indigo-500 rounded-2xl w-fit mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                     <Landmark size={28}/>
                  </div>
                  <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors mb-2 leading-tight">{uni.name}</h4>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mb-4">{uni.degree}</p>
                  <p className="text-slate-500 text-xs line-clamp-2">{uni.description}</p>
               </div>
            ))}

            {result.mode === 'SCHOLARSHIP' && (result.scholarships || []).map((sch, i) => (
               <div key={i} onClick={() => setActiveDetail({ type: 'sch', data: sch })} className="glass p-8 rounded-[32px] border border-white/5 hover:border-emerald-500/40 hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="p-4 bg-white/5 text-emerald-500 rounded-2xl w-fit mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                     <Award size={28}/>
                  </div>
                  <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors mb-2 leading-tight">{sch.name}</h4>
                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-4">{sch.coverage}</p>
                  <p className="text-slate-500 text-xs line-clamp-2">{sch.description}</p>
               </div>
            ))}

            {result.mode === 'JOB' && (result.jobs || []).map((j, i) => (
               <div key={i} onClick={() => setActiveDetail({ type: 'job', data: j })} className="glass p-8 rounded-[32px] border border-white/5 hover:border-orange-500/40 hover:scale-[1.02] transition-all cursor-pointer group">
                  <div className="p-4 bg-white/5 text-orange-500 rounded-2xl w-fit mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-inner">
                     <Briefcase size={28}/>
                  </div>
                  <h4 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors mb-2 leading-tight">{j.title}</h4>
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2">{j.company}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4">{j.location}</p>
                  <p className="text-slate-500 text-xs line-clamp-2">{j.description}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AIResultDashboard;
