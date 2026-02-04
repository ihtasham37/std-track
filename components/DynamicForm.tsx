(profile: UserProfile) => void;
  initialData?: UserProfile | null;
}

const DynamicForm: React.FC<Props> = ({ mode, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: '', age: 20, education: 'Bachelor\'s Degree', country: '', skills: [], interests: [], targetField: '', targetCountry: '', language: 'English', targetCity: '', targetJob: ''
  });
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        skills: initialData.skills || [],
        interests: initialData.interests || []
      });
    }
  }, [initialData]);

  const handleAddTag = (type: 'skills' | 'interests') => {
    if (inputVal.trim()) {
      const currentTags = formData[type] || [];
      if (!currentTags.includes(inputVal.trim())) {
        setFormData({ ...formData, [type]: [...currentTags, inputVal.trim()] });
        setInputVal('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const interests = formData.interests || [];
    if (mode === 'SKILL' && interests.length === 0) return alert("Add the skill you want to learn!");
    if (mode === 'JOB' && !formData.targetJob) return alert("Please specify the target job!");
    onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
          {mode === 'SKILL' ? 'Skill Architect' : mode === 'UNIVERSITY' ? 'University Scout' : mode === 'SCHOLARSHIP' ? 'Scholarship Finder' : 'Job Agent'}
        </h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Required Parameters</p>
      </div>

      <div className="glass rounded-[32px] p-8 border border-white/5 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
              <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:border-blue-500" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Age</label>
              <input type="number" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:border-blue-500" value={formData.age || 20} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Education Level</label>
            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white appearance-none focus:border-blue-500" value={formData.education || "Bachelor's Degree"} onChange={e => setFormData({...formData, education: e.target.value})}>
              <option className="bg-slate-900">High School</option>
              <option className="bg-slate-900">Bachelor's Degree</option>
              <option className="bg-slate-900">Master's Degree</option>
              <option className="bg-slate-900">PhD</option>
            </select>
          </div>

          {mode === 'SKILL' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skill to Master</label>
                <div className="flex gap-2">
                  <input type="text" className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag('interests'))} placeholder="e.g. Flutter Development"/>
                  <button type="button" onClick={() => handleAddTag('interests')} className="px-5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.interests || []).map(i => (
                    <span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20 flex items-center gap-2">
                      {i}
                      <X size={14} className="cursor-pointer" onClick={() => setFormData({...formData, interests: (formData.interests || []).filter(x => x !== i)})}/>
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><Languages size={10}/> Language Preference</label>
                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white focus:border-blue-500" value={formData.language || ''} onChange={e => setFormData({...formData, language: e.target.value})} placeholder="e.g. English" />
              </div>
            </>
          )}

          {mode === 'UNIVERSITY' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Country</label>
                  <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.country || ''} onChange={e => setFormData({...formData, country: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Field</label>
                  <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetField || ''} onChange={e => setFormData({...formData, targetField: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={10}/> Targeted City / Region</label>
                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetCity || ''} onChange={e => setFormData({...formData, targetCity: e.target.value})} />
              </div>
            </>
          )}

          {mode === 'SCHOLARSHIP' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Study Field</label>
                  <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetField || ''} onChange={e => setFormData({...formData, targetField: e.target.value, interests: [e.target.value]})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Country</label>
                  <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetCountry || ''} onChange={e => setFormData({...formData, targetCountry: e.target.value})} />
               </div>
            </div>
          )}

          {mode === 'JOB' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest"><Briefcase size={10}/> Targeted Job Title</label>
                <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetJob || ''} onChange={e => setFormData({...formData, targetJob: e.target.value})} placeholder="e.g. Senior Frontend Engineer"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Country</label>
                    <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetCountry || ''} onChange={e => setFormData({...formData, targetCountry: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">City (Optional)</label>
                    <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white" value={formData.targetCity || ''} onChange={e => setFormData({...formData, targetCity: e.target.value})} />
                 </div>
              </div>
            </>
          )}

          <button type="submit" className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl">Engage Artificial Intelligence</button>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
