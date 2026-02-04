
import React from 'react';
/* Replace missing Roadmap type with AIResult */
import { AIResult } from '../types';
import { Trash2, Calendar, MapPin, ChevronRight, GraduationCap } from 'lucide-react';

interface Props {
  /* roadmaps is an array of AIResult objects */
  roadmaps: AIResult[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const RoadmapList: React.FC<Props> = ({ roadmaps, onSelect, onDelete }) => {
  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="text-center py-16 glass rounded-[32px] border border-white/5">
        <GraduationCap size={56} className="mx-auto text-slate-700 mb-6 opacity-40" />
        <h2 className="text-xl font-black text-white tracking-tight">Archives Empty</h2>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Generate your first blueprint to start</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Operation Chronicles</h1>
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[9px] font-black tracking-widest">
          {roadmaps.length} Blueprints
        </span>
      </div>

      <div className="grid gap-4">
        {roadmaps.map(roadmap => (
          <div 
            key={roadmap.id}
            className="glass rounded-3xl border border-white/5 p-6 flex items-center gap-6 group hover:border-blue-500/30 hover:bg-white/[0.08] transition-all cursor-pointer relative overflow-hidden"
            onClick={() => onSelect(roadmap.id)}
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={20} className="text-blue-500" />
            </div>
            
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
              <GraduationCap size={24} />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">
                  {roadmap.profile.interests?.[0] || 'Unknown'} Mastery
                </h3>
                <span className="text-[9px] text-slate-500 flex items-center gap-1 font-black uppercase tracking-widest">
                  <Calendar size={12} className="opacity-50" /> {new Date(roadmap.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-[9px] text-slate-400 font-black uppercase tracking-widest">
                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
                  <MapPin size={10} className="text-blue-500" /> {roadmap.profile.country}
                </span>
                <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  {roadmap.profile.education}
                </span>
                <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/10">
                  {(roadmap.logs || []).length} Progress Updates
                </span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(roadmap.id); }}
              className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              title="Purge Roadmap"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapList;
