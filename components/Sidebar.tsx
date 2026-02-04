import React, { useState } from 'react';
import { AIResult, UserProfile, AppMode } from '../types';
import { User, X, ChevronDown, ChevronRight, Trash2, Edit2, Download, LogOut, Zap, Landmark, Award, Briefcase, Search } from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: UserProfile | null;
  results: AIResult[];
  onSelectResult: (id: string) => void;
  onDeleteResult: (id: string) => void;
  onRenameResult: (id: string, newTitle: string) => void;
  onProfileClick: () => void;
}

const Sidebar: React.FC<Props> = ({ isOpen, onClose, user, profile, results, onSelectResult, onDeleteResult, onRenameResult, onProfileClick }) => {
  const [expandedSections, setExpandedSections] = useState<Record<AppMode, boolean>>({
    SKILL: true, UNIVERSITY: true, SCHOLARSHIP: true, JOB: true
  });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (mode: AppMode) => {
    setExpandedSections(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const handleDownload = (result: AIResult) => {
    let content = `STDTRACK AI - ${result.mode} REPORT\n`;
    content += `==============================\n`;
    content += `Title: ${result.title || 'Analysis Report'}\n`;
    content += `Summary: ${result.summary}\n\n`;

    if (result.courses && result.courses.length > 0) {
      content += `CURATED COURSES:\n`;
      result.courses.forEach((c, i) => {
        content += `${i + 1}. ${c.title} [${c.platform}]\n   Link: ${c.url}\n   Desc: ${c.description}\n\n`;
      });
    }

    if (result.universities && result.universities.length > 0) {
      content += `TARGETED INSTITUTIONS:\n`;
      result.universities.forEach((u, i) => {
        content += `${i + 1}. ${u.name} - ${u.degree}\n   Location: ${u.location}\n   Portal: ${u.website}\n\n`;
      });
    }

    if (result.scholarships && result.scholarships.length > 0) {
      content += `FINANCIAL OPPORTUNITIES:\n`;
      result.scholarships.forEach((s, i) => {
        content += `${i + 1}. ${s.name} (${s.provider})\n   Coverage: ${s.coverage}\n   Link: ${s.link}\n\n`;
      });
    }

    if (result.jobs && result.jobs.length > 0) {
      content += `CAREER OPPORTUNITIES:\n`;
      result.jobs.forEach((j, i) => {
        content += `${i + 1}. ${j.title} at ${j.company}\n   Location: ${j.location}\n   Link: ${j.link}\n\n`;
      });
    }

    content += `Generated via StdTrack AI Hub\nDate: ${new Date(result.timestamp).toLocaleString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(result.title || 'report').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRename = (id: string, currentTitle: string) => {
    const newTitle = prompt("Update identifier for this session:", currentTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
      onRenameResult(id, newTitle.trim());
    }
  };

  const getIcon = (mode: AppMode) => {
    switch (mode) {
      case 'SKILL': return <Zap size={16} />;
      case 'UNIVERSITY': return <Landmark size={16} />;
      case 'SCHOLARSHIP': return <Award size={16} />;
      case 'JOB': return <Briefcase size={16} />;
    }
  };

  const getColor = (mode: AppMode) => {
    switch (mode) {
      case 'SKILL': return 'text-blue-500';
      case 'UNIVERSITY': return 'text-indigo-500';
      case 'SCHOLARSHIP': return 'text-emerald-500';
      case 'JOB': return 'text-orange-500';
    }
  };

  const filteredResults = results.filter(r => 
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.summary || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modes: AppMode[] = ['SKILL', 'UNIVERSITY', 'SCHOLARSHIP', 'JOB'];

  return (
    <div className={`fixed top-0 left-0 h-full w-80 glass z-[50] border-r border-white/10 flex flex-col shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 italic">Command History</h2>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={20}/></button>
      </div>

      <div className="p-6 flex items-center gap-4 border-b border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-all" onClick={onProfileClick}>
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
          <User size={24} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-white font-bold truncate text-sm uppercase italic tracking-tighter">{profile?.fullName || user.displayName || 'Authorized User'}</p>
          <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest truncate">{profile?.username || user.email}</p>
        </div>
      </div>

      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search History..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-blue-500/50 transition-all"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
        {modes.map(mode => {
          const modeResults = filteredResults.filter(r => r.mode === mode);
          if (modeResults.length === 0) return null;

          return (
            <div key={mode} className="space-y-2">
              <button 
                onClick={() => toggleSection(mode)}
                className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all p-2 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className={getColor(mode)}>{getIcon(mode)}</span>
                  {mode === 'SKILL' ? 'Skills' : mode === 'UNIVERSITY' ? 'Universities' : mode === 'SCHOLARSHIP' ? 'Scholarships' : 'Jobs'}
                </div>
                {expandedSections[mode] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
              </button>

              {expandedSections[mode] && (
                <div className="space-y-1 pl-2">
                  {modeResults.map(res => (
                    <div key={res.id} className="group relative flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all">
                      <button 
                        onClick={() => onSelectResult(res.id)}
                        className="flex-1 text-left text-xs font-bold text-slate-300 truncate pr-2 group-hover:text-white transition-colors"
                      >
                        {res.title || res.profile.interests?.[0] || 'Session Log'}
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handleRename(res.id, res.title || res.profile.interests?.[0] || ''); }} className="p-1.5 text-slate-500 hover:text-blue-400" title="Rename"><Edit2 size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDownload(res); }} className="p-1.5 text-slate-500 hover:text-emerald-400" title="Export as TXT"><Download size={12}/></button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteResult(res.id); }} className="p-1.5 text-slate-500 hover:text-red-400" title="Purge"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/5">
        <button onClick={() => signOut(auth)} className="w-full py-4 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
          <LogOut size={16} /> Terminate Link
        </button>
      </div>
    </div>
  );
};

export default Sidebar;