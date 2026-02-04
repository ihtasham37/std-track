
import React from 'react';
import { Briefcase, ArrowUpRight } from 'lucide-react';

interface Props {
  path: string;
}

const CareerCard: React.FC<Props> = ({ path }) => {
  return (
    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-indigo-500/30 hover:bg-white/[0.08] transition-all">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
          <Briefcase size={22} />
        </div>
        <span className="font-black text-white tracking-tight text-sm uppercase">{path}</span>
      </div>
      <a 
        href={`https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(path)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-600 group-hover:text-indigo-400 transition-all p-2 hover:bg-white/5 rounded-lg"
      >
        <ArrowUpRight size={22} />
      </a>
    </div>
  );
};

export default CareerCard;
