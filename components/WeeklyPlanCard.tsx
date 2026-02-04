
import React from 'react';
import { Task } from '../types';
import { ExternalLink, Clock, PlayCircle } from 'lucide-react';

interface Props {
  task: Task;
}

const WeeklyPlanCard: React.FC<Props> = ({ task }) => {
  return (
    <div className="glass rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all hover:scale-[1.01] flex flex-col sm:flex-row sm:items-center gap-5 group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="bg-blue-500/10 text-blue-500 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
        <PlayCircle size={28} />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-black text-white text-lg tracking-tight group-hover:text-blue-400 transition-colors">{task.title}</h4>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <span className="text-blue-400/80">{task.platform}</span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="opacity-50" />
            {task.duration}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        <a 
          href={`https://www.google.com/search?q=${encodeURIComponent(task.course + ' ' + task.platform)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-white/5"
        >
          View Resource <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default WeeklyPlanCard;
