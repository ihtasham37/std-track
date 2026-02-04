
import React, { useState } from 'react';
import { DailyLog } from '../types';
import { Send, CheckCircle2 } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  logs: DailyLog[];
}

const ProgressSection: React.FC<Props> = ({ onSubmit, logs }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
          placeholder="I finished the Python basic syntax videos and completed the first exercise set..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
        >
          <Send size={18} />
        </button>
      </form>

      {logs.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Logs</h4>
          <div className="space-y-3">
            {logs.slice(-3).reverse().map((log, i) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">
                    {new Date(log.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-700 line-clamp-2 italic">"{log.update}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
