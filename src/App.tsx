/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Portfolio, UserSession } from "./types";
import ParticleTrain from "./components/ParticleTrain";
import GalaxyBackground from "./components/GalaxyBackground";
import LandingView from "./components/LandingView";
import AuthView from "./components/AuthView";
import OnboardingView from "./components/OnboardingView";
import StudioView from "./components/StudioView";
import RecruiterView from "./components/RecruiterView";
import MockInterviewView from "./components/MockInterviewView";
import ResumeOptimizerView from "./components/ResumeOptimizerView";
import GithubAnalyzerView from "./components/GithubAnalyzerView";
import AnalyticsView from "./components/AnalyticsView";
import SettingsView from "./components/SettingsView";
import { 
  Sliders, UserCheck, Bot, FileCheck, Terminal, 
  BarChart2, Settings, LogOut, Compass, Sparkles, Globe 
} from "lucide-react";
import { motion } from "motion/react";

type ViewState = 'welcome' | 'landing' | 'auth' | 'onboarding' | 'dashboard';
type TabState = 'studio' | 'recruiter' | 'interview' | 'resume' | 'github' | 'analytics' | 'settings';

export default function App() {
  const [view, setView] = useState<ViewState>('welcome');
  const [activeTab, setActiveTab] = useState<TabState>('studio');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  const [session, setSession] = useState<UserSession>({
    isAuthenticated: false,
    userId: null,
    email: null,
    name: null,
  });

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const handleAuthSuccess = async (user: { id: string; email: string; name: string; username: string }) => {
    setSession({
      isAuthenticated: true,
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    setUsername(user.username);

    // Fetch their portfolio if it already exists
    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio/${user.username}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
        setView('dashboard');
      } else {
        // No portfolio exists yet, prompt onboarding
        setView('onboarding');
      }
    } catch (err) {
      console.error(err);
      setView('onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardComplete = async (newUsername: string) => {
    setUsername(newUsername);
    try {
      const res = await fetch(`/api/portfolio/${newUsername}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error(err);
    }
    setView('dashboard');
    setActiveTab('studio');
  };

  const handleSavePortfolio = async (updatedPortfolio: Portfolio) => {
    try {
      const res = await fetch(`/api/portfolio/${username}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPortfolio),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurgeData = async () => {
    // Clear state on purge
    setSession({
      isAuthenticated: false,
      userId: null,
      email: null,
      name: null,
    });
    setPortfolio(null);
    setUsername("");
    setView('landing');
  };

  const handleLogout = () => {
    setSession({
      isAuthenticated: false,
      userId: null,
      email: null,
      name: null,
    });
    setPortfolio(null);
    setUsername("");
    setView('landing');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white">
      {/* High impact cursor trailing particles */}
      <ParticleTrain />

      {/* Main viewport router */}
      {view === 'welcome' && (
        <GalaxyBackground onEnter={() => setView('landing')} />
      )}

      {view === 'landing' && (
        <LandingView 
          onStart={() => { setAuthMode('register'); setView('auth'); }} 
          onGoToAuth={(mode) => { setAuthMode(mode); setView('auth'); }}
        />
      )}

      {view === 'auth' && (
        <AuthView 
          onAuthSuccess={handleAuthSuccess} 
          onBackToLanding={() => setView('landing')} 
        />
      )}

      {view === 'onboarding' && session.userId && (
        <OnboardingView 
          userId={session.userId} 
          onOnboardComplete={handleOnboardComplete} 
        />
      )}

      {view === 'dashboard' && portfolio && (
        <div className="flex flex-col min-h-screen">
          
          {/* Dashboard Header Menu */}
          <header className="w-full bg-[#0c0c0c] border-b border-white/10 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Brand Logo & Profile details */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold font-mono tracking-wider shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  G
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold font-mono tracking-wider block leading-none text-cyan-400">
                    GalaxyFolio Control
                  </span>
                  <a 
                    href={`/api/portfolio/${username}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-mono text-gray-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <Globe className="w-2.5 h-2.5" />
                    galaxyfolio.io/{username}
                  </a>
                </div>
              </div>

              {/* Navigation Hub */}
              <nav className="flex flex-wrap items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10 max-w-full overflow-x-auto">
                {[
                  { id: 'studio', label: 'Studio', icon: <Sliders className="w-3.5 h-3.5" /> },
                  { id: 'recruiter', label: 'Recruiter View', icon: <UserCheck className="w-3.5 h-3.5" /> },
                  { id: 'interview', label: 'Mock Interview', icon: <Bot className="w-3.5 h-3.5" /> },
                  { id: 'resume', label: 'ATS Optimizer', icon: <FileCheck className="w-3.5 h-3.5" /> },
                  { id: 'github', label: 'Repo Analyzer', icon: <Terminal className="w-3.5 h-3.5" /> },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-cyan-500/10 border border-cyan-400/40 text-white shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* User Session Profile Box */}
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[11px] font-bold font-mono text-white leading-tight">{session.name}</span>
                  <span className="text-[9px] font-mono text-gray-500">{session.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 bg-white/5 hover:bg-red-900/20 border border-white/10 hover:border-red-500/30 rounded-lg text-gray-400 hover:text-red-400 cursor-pointer transition-all"
                  title="Log out of Control Room"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </header>

          {/* Master View Router panel */}
          <main className="flex-1">
            {activeTab === 'studio' && (
              <StudioView 
                portfolio={portfolio} 
                onSavePortfolio={handleSavePortfolio} 
              />
            )}

            {activeTab === 'recruiter' && (
              <RecruiterView portfolio={portfolio} />
            )}

            {activeTab === 'interview' && (
              <MockInterviewView />
            )}

            {activeTab === 'resume' && (
              <ResumeOptimizerView />
            )}

            {activeTab === 'github' && (
              <GithubAnalyzerView />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView username={username} />
            )}

            {activeTab === 'settings' && (
              <SettingsView onPurgeData={handlePurgeData} />
            )}
          </main>

        </div>
      )}
    </div>
  );
}
