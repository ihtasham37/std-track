
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { X, BrainCircuit, Sparkles, Home } from 'lucide-react';
import { fetchUserProfile, auth } from '../services/firebase';

interface Props {
  onSubmit: (profile: UserProfile) => void;
  initialData?: UserProfile | null;
}

const WelcomeForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '', age: 20, education: 'Bachelor\'s Degree', country: '', skills: [], interests: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (initialData) {
        setFormData({ ...initialData, skills: [], interests: [] });
      } else if (auth.currentUser) {
        const p = await fetchUserProfile(auth.currentUser.uid);
        if (p) {
          // Keep name/country/age/education but clear skills and interests as per user request
          setFormData({
            ...p,
            skills: [],
            interests: []
          });
        }
      }
      setLoading(false);
    };
    load();
  }, [initialData]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = formData.skills || [];
    const interests = formData.interests || [];
    if (formData.name && formData.country && skills.length > 0 && interests.length > 0) {
      onSubmit(formData);
    } else {
      alert("Please ensure all fields are filled, including at least one skill and one interest.");
    }
  };

  if (loading) return <div className="py-20 flex flex-col items-center"><BrainCircuit className="animate-spin text-blue-500 mb-4" /> <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Syncing Identity...</span></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-start">
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
          <Home size={16} /> Main Page
        </button>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-blue-500/10 text-blue-500 rounded-2xl mb-2">
          <Sparkles size={24} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Identity & Vision</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Build your learning blueprint from scratch</p>
      </div>

      <div className="glass rounded-[32px] p-8 border border-white/5 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Full Legal Name</label>
              <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl outline-none text-sm font-bold text-white transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Alex Mercer" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Region/Country</label>
              <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl outline-none text-sm font-bold text-white transition-all" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="e.g. Pakistan" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Age</label>
              <input type="number" required className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl outline-none text-sm font-bold text-white transition-all" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}/>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Academic Level</label>
              <select className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl outline-none text-sm font-bold text-white transition-all appearance-none" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}>
                <option className="bg-slate-900">High School</option>
                <option className="bg-slate-900">Associate Degree</option>
                <option className="bg-slate-900">Bachelor's Degree</option>
                <option className="bg-slate-900">Master's Degree</option>
                <option className="bg-slate-900">PhD</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Active Skills (Required)</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl outline-none text-sm font-bold text-white transition-all" placeholder="Enter skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}/>
              <button type="button" onClick={handleAddSkill} className="px-5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.skills.map(s => <span key={s} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20 flex items-center gap-2 animate-in zoom-in duration-300">{s}<X size={14} className="cursor-pointer hover:text-red-400" onClick={() => setFormData({...formData, skills: formData.skills.filter(x => x !== s)})}/></span>)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Future Interests (Required)</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl outline-none text-sm font-bold text-white transition-all" placeholder="Enter interest..." value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}/>
              <button type="button" onClick={handleAddInterest} className="px-5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.interests.map(i => <span key={i} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 flex items-center gap-2 animate-in zoom-in duration-300">{i}<X size={14} className="cursor-pointer hover:text-red-400" onClick={() => setFormData({...formData, interests: formData.interests.filter(x => x !== i)})}/></span>)}
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-400 hover:text-white transition-all transform active:scale-[0.98]">Initialize Roadmap Generation</button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeForm;
