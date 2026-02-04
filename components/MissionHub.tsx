import React from 'react';
import { AppMode } from '../types';
import { Zap, Landmark, Award, Briefcase, ArrowRight } from 'lucide-react';

interface Props {
  onSelect: (mode: AppMode) => void;
}

const MissionHub: React.FC<Props> = ({ onSelect }) => {
  const options = [
    { 
      id: 'SKILL' as AppMode, 
      title: 'Skill Architect', 
      desc: 'Master a new skill with curated YouTube paths and platforms.', 
      icon: <Zap size={32} />, 
      color: 'blue' 
    },
    { 
      id: 'UNIVERSITY' as AppMode, 
      title: 'University Scout', 
      desc: 'Explore top institutions for your target academic field.', 
      icon: <Landmark size={32} />, 
      color: 'indigo' 
    },
    { 
      id: 'SCHOLARSHIP' as AppMode, 
      title: 'Scholarship Finder', 
      desc: 'Uncover financial aid and global scholarship opportunities.', 
      icon: <Award size={32} />, 
      color: 'emerald' 
    },
    { 
      id: 'JOB' as AppMode, 
      title: 'Job Agent', 
      desc: 'Access job opportunities tailored to your career goals.', 
      icon: <Briefcase size={32} />, 
      color: 'orange' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">STDTRACK HUB</h1>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">Integrated Intelligence Protocols</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((opt) => (
          <div 
            key={opt.id} 
            onClick={() => onSelect(opt.id)}
            className="glass rounded-[40px] p-8 border border-white/5 group hover:border-blue-500/40 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
          >
            <div className={`p-5 bg-${opt.color}-500/10 text-${opt.color}-500 rounded-2xl w-fit mb-8 shadow-inner group-hover:scale-110 transition-transform`}>
              {opt.icon}
            </div>
            <h3 className="text-xl font-black text-white mb-4 tracking-tight group-hover:text-blue-400 transition-colors">{opt.title}</h3>
            <p className="text-slate-400 text-[13px] font-medium leading-relaxed mb-10">{opt.desc}</p>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:translate-x-2 transition-transform">
              Initiate protocol <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionHub;