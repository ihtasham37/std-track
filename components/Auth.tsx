import React, { useState } from 'react';
import { auth, googleProvider, saveUserProfile, fetchUserProfile } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { Loader2, Mail, Lock, User, AtSign, ArrowLeft, Info } from 'lucide-react';

export const Auth: React.FC = () => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (view === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: fullName });
        await saveUserProfile(user.uid, {
          fullName,
          username: username.startsWith('@') ? username : `@${username}`,
          email,
          secretKey: password,
          age: 20,
          education: 'Bachelor\'s Degree',
          country: '',
          skills: [],
          interests: []
        });
      } else if (view === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccess("Recovery instructions sent to your email.");
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const existingProfile = await fetchUserProfile(user.uid);
      if (!existingProfile) {
        await saveUserProfile(user.uid, {
          fullName: user.displayName || 'Anonymous User',
          username: `@${user.email?.split('@')[0] || 'user'}`,
          email: user.email,
          secretKey: 'social_auth',
          age: 20,
          education: 'Bachelor\'s Degree',
          country: '',
          skills: [],
          interests: []
        });
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-[420px] glass rounded-[40px] ${view === 'signup' ? 'p-6' : 'p-10'} text-white shadow-2xl border border-white/5 animate-in fade-in zoom-in-95 duration-500 overflow-y-auto max-h-[95vh] scrollbar-hide`}>
        
        {view === 'forgot' && (
          <button 
            onClick={() => {
              setView('login');
              setSuccess('');
              setError('');
            }} 
            className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        )}

        <div className={`text-center ${view === 'signup' ? 'mb-4' : 'mb-8'}`}>
          <h1 className="text-3xl font-black tracking-tighter mb-1 italic uppercase">
            {view === 'login' ? 'LOGIN' : view === 'signup' ? 'NEW IDENTITY' : 'RESET KEY'}
          </h1>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">
            StdTrack Neural Authentication
          </p>
        </div>

        <form onSubmit={handleAuth} className={view === 'signup' ? 'space-y-3' : 'space-y-5'}>
          {view === 'signup' && (
            <>
              <div className="space-y-1 bg-white/5 p-2 rounded-xl border border-white/5">
                <label className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em] px-1">Full Identity Name</label>
                <div className="flex items-center gap-2 px-1 pb-1">
                  <User size={12} className="text-blue-500 opacity-50" />
                  <input type="text" className="w-full bg-transparent outline-none text-xs font-bold" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" required />
                </div>
              </div>
              <div className="space-y-1 bg-white/5 p-2 rounded-xl border border-white/5">
                <label className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em] px-1">Global Handle</label>
                <div className="flex items-center gap-2 px-1 pb-1">
                  <AtSign size={12} className="text-blue-500 opacity-50" />
                  <input type="text" className="w-full bg-transparent outline-none text-xs font-bold" value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" required />
                </div>
              </div>
            </>
          )}

          <div className={`space-y-1 bg-white/5 ${view === 'signup' ? 'p-2' : 'p-3'} rounded-xl border border-white/5`}>
            <label className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em] px-1">Registry Email</label>
            <div className="flex items-center gap-2 px-1 pb-1">
              <Mail size={14} className="text-blue-500 opacity-50" />
              <input type="email" className="w-full bg-transparent outline-none text-xs font-bold" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@stdtrack.ai" required />
            </div>
          </div>
          
          {view !== 'forgot' && (
            <div className={`space-y-1 bg-white/5 ${view === 'signup' ? 'p-2' : 'p-3'} rounded-xl border border-white/5`}>
              <label className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em] px-1">Secure Passkey</label>
              <div className="flex items-center gap-2 px-1 pb-1">
                <Lock size={14} className="text-blue-500 opacity-50" />
                <input type="password" className="w-full bg-transparent outline-none text-xs font-bold" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
          )}

          {view === 'signup' && (
            <div className="space-y-1 bg-white/5 p-2 rounded-xl border border-white/5">
              <label className="text-[8px] font-black opacity-40 uppercase tracking-[0.2em] px-1">Verify Passkey</label>
              <div className="flex items-center gap-2 px-1 pb-1">
                <Lock size={12} className="text-blue-500 opacity-50" />
                <input type="password" className="w-full bg-transparent outline-none text-xs font-bold" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
          )}

          {view === 'login' && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={() => {
                  setView('forgot');
                  setSuccess('');
                  setError('');
                }} 
                className="text-[9px] font-black uppercase text-blue-400 hover:text-white transition-all tracking-widest"
              >
                Forgot Passkey?
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-[10px] font-bold text-center bg-red-400/10 py-2 rounded-xl border border-red-400/20">{error}</p>}
          
          {success && (
            <div className="space-y-3">
              <p className="text-emerald-400 text-[10px] font-bold text-center bg-emerald-400/10 py-2 rounded-xl border border-emerald-400/20">{success}</p>
              {view === 'forgot' && (
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
                  <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                    If you do not receive the recovery link within 5-6 seconds, please check your email's <span className="text-blue-400 font-black">spam folder</span>.
                  </p>
                </div>
              )}
            </div>
          )}

          <button disabled={loading} className={`w-full ${view === 'signup' ? 'py-3' : 'py-4'} bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] glow-button flex items-center justify-center gap-2`}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : (view === 'login' ? 'LOGIN' : view === 'signup' ? 'SIGNUP' : 'Send Recovery')}
          </button>
        </form>

        {(view === 'login' || view === 'signup') && (
          <>
            <div className={`relative ${view === 'signup' ? 'my-4' : 'my-8'}`}>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center"><span className="bg-slate-900/50 px-3 text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] backdrop-blur-sm">OR</span></div>
            </div>

            <button 
              onClick={handleGoogleAuth}
              className={`w-full ${view === 'signup' ? 'py-3' : 'py-4'} bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 flex items-center justify-center gap-3 transition-all`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {view === 'login' ? 'GOOGLE LOGIN' : 'GOOGLE SIGNUP'}
            </button>
          </>
        )}

        <div className={`mt-6 text-center text-[10px] font-bold`}>
          <span className="opacity-40">
            {view === 'login' ? "No verified identity?" : "Already synchronized?"}
          </span>
          <button 
            onClick={() => {
              setView(view === 'login' ? 'signup' : 'login');
              setError('');
              setSuccess('');
            }} 
            className="text-blue-400 ml-2 hover:underline tracking-widest uppercase"
          >
            {view === 'login' ? 'CREATE NEW' : 'LOGIN'}
          </button>
        </div>
      </div>
    </div>
  );
};