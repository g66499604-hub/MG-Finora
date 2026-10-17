import React, { useState } from 'react';
import { Lock, Mail, User, Shield, AlertCircle, CheckCircle, X, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured, supabase, OWNER_EMAIL, OWNER_NAME } from '../utils/supabaseClient';
import { AuditLogger } from '../utils/auditLogger';
import { useI18n } from '../i18n/I18nContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { email: string; displayName: string; role: 'owner' | 'admin' | 'member' }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasSupabase = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (hasSupabase && supabase) {
        if (mode === 'signin') {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) throw signInError;
          const userEmail = data.user?.email || email;
          const isOwner = userEmail.toLowerCase() === OWNER_EMAIL.toLowerCase();
          AuditLogger.log('AUTH_SIGNIN', 'User', `User signed in: ${userEmail}`, data.user?.id);
          onAuthSuccess({
            email: userEmail,
            displayName: data.user?.user_metadata?.full_name || userEmail.split('@')[0],
            role: isOwner ? 'owner' : 'member'
          });
          onClose();
        } else if (mode === 'signup') {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: displayName || email.split('@')[0] }
            }
          });
          if (signUpError) throw signUpError;
          setSuccess('Account created successfully! Check your email or sign in.');
          AuditLogger.log('AUTH_SIGNUP', 'User', `New user registered: ${email}`);
          setMode('signin');
        } else if (mode === 'reset') {
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
          if (resetError) throw resetError;
          setSuccess('Password reset link sent to your email.');
          AuditLogger.log('AUTH_RESET_PASSWORD', 'User', `Password reset requested for: ${email}`);
        }
      } else {
        // Local Vault Mode Simulated Authentication
        if (mode === 'signin' || mode === 'signup') {
          const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
          const name = displayName || (isOwner ? OWNER_NAME : email.split('@')[0]);
          AuditLogger.log('LOCAL_AUTH_LOGIN', 'User', `Local Vault Session started for: ${email}`);
          onAuthSuccess({
            email,
            displayName: name,
            role: isOwner ? 'owner' : 'member'
          });
          onClose();
        } else {
          setSuccess('Password reset recorded for local profile.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOwnerAccess = () => {
    setEmail(OWNER_EMAIL);
    onAuthSuccess({
      email: OWNER_EMAIL,
      displayName: OWNER_NAME,
      role: 'owner'
    });
    AuditLogger.log('OWNER_QUICK_ACCESS', 'System', `Owner session authorized: ${OWNER_NAME}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0C1830] border border-[#E8C66D]/30 w-full max-w-md rounded-2xl p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-gradient-gold text-[#0C1830]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {mode === 'signin' ? t('action_sign_in') : mode === 'signup' ? t('action_sign_up') : t('action_reset_password')}
            </h3>
            <p className="text-xs text-slate-400">MG-Finora Enterprise Authentication</p>
          </div>
        </div>

        {/* Backend Connectivity Status Badge */}
        <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
          hasSupabase 
            ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
        }`}>
          {hasSupabase ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />}
          <div>
            <div className="font-semibold">
              {hasSupabase ? 'Supabase PostgreSQL Backend Active' : 'Encrypted Local Vault Mode'}
            </div>
            <div className="text-[11px] opacity-80">
              {hasSupabase ? 'Synchronized with Cloud Database & Auth' : 'Ready for standalone GitHub Pages usage'}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl mb-4 text-xs bg-red-950/60 border border-red-500/40 text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl mb-4 text-xs bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Mian Muhammad Hassan Jan"
                  className="w-full bg-[#111C30] border border-slate-700 focus:border-[#E8C66D] rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#111C30] border border-slate-700 focus:border-[#E8C66D] rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111C30] border border-slate-700 focus:border-[#E8C66D] rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold bg-[#E8C66D] hover:bg-[#F5D98E] text-[#0C1830] transition shadow-lg shadow-[#E8C66D]/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : mode === 'signin' ? t('action_sign_in') : mode === 'signup' ? t('action_sign_up') : 'Send Reset Link'}
          </button>
        </form>

        {/* Quick Founder / Owner Fast Track Access */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleQuickOwnerAccess}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium bg-[#172A47] hover:bg-[#1f375c] text-[#E8C66D] border border-[#E8C66D]/30 flex items-center justify-center gap-2 transition"
          >
            <span>👑 Instant Sign In as Founder ({OWNER_NAME})</span>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            {mode === 'signin' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="hover:text-[#E8C66D] underline"
                >
                  Create an Account
                </button>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="hover:text-slate-200"
                >
                  Forgot Password?
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="hover:text-[#E8C66D] underline mx-auto"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
