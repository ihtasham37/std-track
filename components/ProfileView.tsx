
import React, { useState, useEffect } from 'react';
import { auth, fetchUserProfile, saveUserProfile } from '../services/firebase';
import { UserProfile, AIResult } from '../types';
import { User, Mail, Lock, Loader2, ArrowLeft, Shield, CheckCircle2, Home, Eye, EyeOff, Save, Edit3 } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateProfile } from 'firebase/auth';

interface Props {
  roadmaps: AIResult[];
  onSelectRoadmap: (id: string) => void;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileView: React.FC<Props> = ({ onBack, onUpdateProfile }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  
  const [newPass, setNewPass] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (auth.currentUser) {
        const p = await fetchUserProfile(auth.currentUser.uid);
        setUserProfile(p);
        setEditData(p || {});
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveProfile = async () => {
    if (!auth.currentUser || !editData.fullName) return;
    setUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName: editData.fullName });
      await saveUserProfile(auth.currentUser.uid, editData);
      setUserProfile(editData as UserProfile);
      onUpdateProfile(editData as UserProfile);
      setIsEditing(false);
      setUpdateMsg("Profile updated successfully");
    } catch (e: any) {
      setUpdateMsg(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !oldPass || !newPass) return;
    setUpdating(true);
    setUpdateMsg('');
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email!, oldPass);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPass);
      // Also update stored secretKey for visual reference
      const updatedProfile = { ...userProfile!, secretKey: newPass };
      await saveUserProfile(auth.currentUser.uid, updatedProfile);
      setUserProfile(updatedProfile);
      setUpdateMsg("Security key rotated successfully!");
      setNewPass(''); setOldPass('');
    } catch (err: any) {
      setUpdateMsg(err.message.replace('Firebase:', ''));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center p-20"><Loader2 className="animate-spin text-blue-500 mb-4" /><p className="text-xs font-black uppercase text-slate-500 tracking-widest">Accessing identity core...</p></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft size={16} /> Exit Identity Hub
        </button>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-blue-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">
          <Home size={16} /> Home
        </button>
      </div>

      <div className="glass rounded-[40px] p-8 border border-white/5 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <User size={44} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">{userProfile?.fullName || auth.currentUser?.displayName}</h2>
            <p className="text-blue-500 font-bold text-sm uppercase tracking-widest">{userProfile?.username}</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-slate-300 hover:text-white'}`}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <div className="flex gap-6 border-b border-white/5 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {['info', 'security'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-[10px] font-black uppercase tracking-[0.2em] pb-3 border-b-2 transition-all ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {tab === 'info' ? 'Identity Data' : 'Security Protocols'}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in duration-500">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Full Name</label>
                  {isEditing ? (
                    <input className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white" value={editData.fullName} onChange={e => setEditData({...editData, fullName: e.target.value})}/>
                  ) : (
                    <p className="font-bold text-white text-lg">{userProfile?.fullName}</p>
                  )}
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">User Handle</label>
                  {isEditing ? (
                    <input className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-white" value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})}/>
                  ) : (
                    <p className="font-bold text-blue-400 text-lg">{userProfile?.username}</p>
                  )}
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Mail size={20} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Record</p>
                    <p className="font-bold text-white">{auth.currentUser?.email}</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4 relative group">
                  <div className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Lock size={20} /></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Key</p>
                    <p className="font-bold text-white font-mono">{showSecret ? userProfile?.secretKey : '••••••••'}</p>
                  </div>
                  <button onClick={() => setShowSecret(!showSecret)} className="text-slate-500 hover:text-white"><Eye size={18}/></button>
                </div>
              </div>

              {isEditing && (
                <button 
                  onClick={handleSaveProfile}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin" size={16}/> : <Save size={18}/>} Save Identity Updates
                </button>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div className="p-5 bg-blue-600/5 border border-blue-500/20 rounded-[32px] flex items-center gap-4">
                <Shield className="text-blue-500" size={24} />
                <div className="flex-1">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Security Integrity</p>
                   <p className="text-sm font-medium text-slate-300 leading-relaxed">System protected by end-to-end encryption. Rotate keys periodically.</p>
                </div>
                <CheckCircle2 size={18} className="text-blue-500 opacity-50" />
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Rotate Authentication Key</h3>
                   <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-500">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
                <input type={showPass ? "text" : "password"} placeholder="Confirm Current Key" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white focus:border-blue-500" value={oldPass} onChange={e => setOldPass(e.target.value)} required />
                <input type={showPass ? "text" : "password"} placeholder="New Security Key" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-sm font-bold text-white focus:border-blue-500" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                <button disabled={updating} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 glow-button flex items-center justify-center gap-2">
                  {updating ? <Loader2 className="animate-spin" size={16}/> : 'Verify & Rotate Key'}
                </button>
              </form>
            </div>
          )}

          {updateMsg && (
            <p className={`mt-6 text-center text-xs font-bold p-4 rounded-2xl animate-in fade-in duration-300 ${updateMsg.toLowerCase().includes('success') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {updateMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
