/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Mail, Lock, User, Github, Sparkles, LogIn, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AuthViewProps {
  onAuthSuccess: (user: { id: string; email: string; name: string; username: string }) => void;
  onBackToLanding: () => void;
}

export default function AuthView({ onAuthSuccess, onBackToLanding }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = mode === 'register' ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    setLoading(true);
    // Simulate high-fidelity social login
    setTimeout(() => {
      onAuthSuccess({
        id: "oauth-user-123",
        email: `astronaut.${provider}@galaxy.io`,
        name: `Major Tom (${provider})`,
        username: "majortom",
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070114] flex flex-col justify-center items-center p-6 text-white overflow-hidden font-sans">
      {/* Decorative lines & orbits */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f133c_1px,transparent_1px),linear-gradient(to_bottom,#1f133c_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-purple-500/10 pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-pink-500/5 pointer-events-none animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-purple-500/20 bg-[#0c0422]/60 backdrop-blur-md p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)] z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center cursor-pointer" onClick={onBackToLanding}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold tracking-wider font-mono mb-2 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            G
          </div>
          <span className="font-extrabold tracking-wider font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-purple-300">
            GalaxyFolio Portal
          </span>
          <p className="text-xs text-purple-300 font-mono tracking-widest mt-1 uppercase">SECURE GALAXY ENTRY</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono text-center">
            {error}
          </div>
        )}

        {mode === 'forgot' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-mono tracking-wide">RESET SECTOR CODES</h3>
            <p className="text-xs text-gray-400">Enter your telemetry email. We will broadcast a validation wave to reset your command codes.</p>
            
            {forgotSent ? (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-300 font-mono text-center space-y-4">
                <p>Telemetry beam sent successfully! Check your inbox for coordinates.</p>
                <button
                  onClick={() => { setMode('login'); setForgotSent(false); }}
                  className="text-purple-300 hover:text-white font-semibold underline text-[11px]"
                >
                  Return to Landing Deck
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-purple-300 uppercase">Telemetry Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. astronaut@galaxy.io"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white placeholder-purple-700/60 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-200"
                >
                  Broadcast Wave
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[11px] text-gray-500 hover:text-purple-300 font-mono"
                  >
                    Cancel and login
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-purple-300 uppercase">Astronaut Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jay Shepard"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white placeholder-purple-700/60 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-purple-300 uppercase">Telemetry Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. astronaut@galaxy.io"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white placeholder-purple-700/60 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono text-purple-300 uppercase">Access Passkey</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-purple-400 hover:text-purple-300 hover:underline font-mono"
                  >
                    Forgot codes?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white placeholder-purple-700/60 font-mono"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] disabled:opacity-50 transition-all duration-200 uppercase font-mono tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'register' ? 'Launch Portfolio' : 'Authorize Entry'}
                  <LogIn className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            {/* Toggle Modes */}
            <div className="text-center text-xs text-gray-500 font-mono pt-2">
              {mode === 'register' ? (
                <span>
                  Already on roster?{" "}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline"
                  >
                    Log In
                  </button>
                </span>
              ) : (
                <span>
                  New recruit?{" "}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline"
                  >
                    Assemble Bio
                  </button>
                </span>
              )}
            </div>

            {/* Social Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-purple-500/10"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">COSMIC FEDERATION SINGLE SIGN-ON</span>
              <div className="flex-grow border-t border-purple-500/10"></div>
            </div>

            {/* Social SSO buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl bg-[#0e062c] hover:bg-[#150a3e] border border-purple-500/10 hover:border-purple-500/30 text-xs font-semibold font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Github className="w-4 h-4 text-purple-300" /> GITHUB
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="py-2.5 px-4 rounded-xl bg-[#0e062c] hover:bg-[#150a3e] border border-purple-500/10 hover:border-purple-500/30 text-xs font-semibold font-mono tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" /> GOOGLE
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
