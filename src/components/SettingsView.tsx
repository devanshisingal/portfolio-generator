/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { ShieldAlert, Trash2, Key, Link2, EyeOff, ShieldCheck, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SettingsViewProps {
  onPurgeData: () => Promise<void>;
}

export default function SettingsView({ onPurgeData }: SettingsViewProps) {
  const [domainInput, setDomainInput] = useState("");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [domainSaved, setDomainSaved] = useState(false);

  const handlePurge = async () => {
    if (!window.confirm("CRITICAL WARNING: This will completely delete all your generated portfolios and metrics. Continue?")) return;
    
    setDeleting(true);
    try {
      await onPurgeData();
      alert("Database purged. You will be redirected to the landing deck.");
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDomainSave = (e: FormEvent) => {
    e.preventDefault();
    setDomainSaved(true);
    setTimeout(() => setDomainSaved(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#070114] text-white p-6 md:p-12 font-sans relative overflow-x-hidden text-left">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f133c_1px,transparent_1px),linear-gradient(to_bottom,#1f133c_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        
        {/* Module Header */}
        <div className="border-b border-purple-500/10 pb-6">
          <div className="text-xs font-mono text-purple-300 uppercase tracking-widest mb-1">COMMAND DECK SETTINGS</div>
          <h2 className="text-3xl font-bold font-mono">SECTOR SETTINGS & PRIVACY</h2>
          <p className="text-xs text-gray-400 mt-1">Configure custom domains, set public/private telemetry access control, or purge cached databases.</p>
        </div>

        {/* Custom Domain Settings Card */}
        <div className="p-6 rounded-2xl border border-purple-500/15 bg-[#0c0422]/60 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-500/5 pb-2">
            <Link2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-purple-300">Custom Domain Broadcast</h3>
          </div>
          
          <form onSubmit={handleDomainSave} className="space-y-3">
            <p className="text-xs text-gray-400 leading-relaxed">Map your personalized domain name (e.g., jaydevs.com) to route recruiter queries directly to your Galaxy portfolio page.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={domainInput}
                onChange={e => setDomainInput(e.target.value)}
                placeholder="e.g. www.jaydevs.com"
                className="flex-1 px-4 py-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-purple-400 text-white placeholder-purple-850/40"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold font-mono tracking-wider text-white cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                SAVE DOMAIN
              </button>
            </div>
            {domainSaved && (
              <span className="text-[10px] font-mono text-emerald-400 block pt-1">Custom domain successfully mapped to routing registries!</span>
            )}
          </form>
        </div>

        {/* Privacy controls */}
        <div className="p-6 rounded-2xl border border-purple-500/15 bg-[#0c0422]/60 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-500/5 pb-2">
            <EyeOff className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-purple-300">Telemetry Access Controls</h3>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/15 border border-purple-500/5">
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs font-bold font-mono text-white">Public Search Indexability</h4>
              <p className="text-[10px] text-gray-500 max-w-sm">Allow search crawlers and public recruiters to discover your telemetry metrics in our aggregate pool.</p>
            </div>

            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              {privacyMode ? <ToggleRight className="w-10 h-10 text-purple-400" /> : <ToggleLeft className="w-10 h-10 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* API Credentials Documentation */}
        <div className="p-6 rounded-2xl border border-[#a855f7]/25 bg-[#0c0422]/60 backdrop-blur-md space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.05)]">
          <div className="flex items-center gap-2 border-b border-purple-500/5 pb-2">
            <Key className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-purple-300">Gemini Neural Keys</h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your portfolio website calls are processed through Google AI Studio's server-side neural gateways. This hides your API credentials securely from the public, guaranteeing robust defense parameters.
          </p>
          <div className="p-3.5 bg-purple-950/20 border border-purple-500/15 rounded-xl flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-300">GEMINI_API_KEY</span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">PROTECTED SECRETS</span>
          </div>
        </div>

        {/* Destructive purger */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-red-500/15 pb-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-red-400">CRITICAL PURGATORY CONTROL</h3>
          </div>
          <p className="text-xs text-red-200/80 leading-relaxed">Puging the database completely clears your portfolio records, custom themes, and viewer telemetry charts on disk. This operation is irreversible.</p>
          <button
            onClick={handlePurge}
            disabled={deleting}
            className="px-5 py-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-xs font-bold font-mono tracking-wider text-red-400 cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "PURGING MEMORY..." : "PURGE ENTIRE CACHE"}
          </button>
        </div>

      </div>
    </div>
  );
}
