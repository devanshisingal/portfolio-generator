/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Portfolio } from "../types";
import PublicPortfolioView from "./PublicPortfolioView";
import { Sliders, Monitor, Globe, Check, Eye, Save, Cloud, Palette, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface StudioViewProps {
  portfolio: Portfolio;
  onSavePortfolio: (updated: Portfolio) => Promise<void>;
}

export default function StudioView({ portfolio, onSavePortfolio }: StudioViewProps) {
  const [editedPortfolio, setEditedPortfolio] = useState<Portfolio>({ ...portfolio });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleUpdateField = (key: keyof Portfolio, value: any) => {
    setEditedPortfolio(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setToastMsg(null);
    try {
      await onSavePortfolio(editedPortfolio);
      setToastMsg("Stellar adjustments successfully broadcasted!");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      console.error(err);
      setToastMsg("Broadcast failed. Check system console.");
    } finally {
      setSaving(false);
    }
  };

  const themes: { id: Portfolio['theme']; name: string; desc: string; icon: string }[] = [
    { id: 'galaxy', name: 'Space Galaxy', desc: 'Deep violet starry universe layout', icon: '🌌' },
    { id: 'cyberpunk', name: 'Cyberpunk Grid', desc: 'Retro neon red and glowing cyan accents', icon: '👾' },
    { id: 'minimal', name: 'Stark Minimalist', desc: 'Clean, light-mode modern editorial layout', icon: '📄' },
    { id: 'terminal', name: 'Retro Terminal', desc: 'Classic hacker green monospaced console', icon: '📟' },
  ];

  const fonts: { id: Portfolio['fontClass']; name: string }[] = [
    { id: 'font-sans', name: 'Inter Sans-Serif' },
    { id: 'font-space', name: 'Space Grotesk (Tech)' },
    { id: 'font-mono', name: 'JetBrains Mono' },
    { id: 'font-serif', name: 'Playfair Display' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#070114] text-white flex flex-col md:flex-row font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-purple-900 border border-purple-400 text-purple-100 text-xs font-mono tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.8)] animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Editor Controls Panel (Left side) */}
      <div className="w-full md:w-[350px] bg-[#0c0422]/90 border-r border-purple-500/15 p-6 flex flex-col justify-between overflow-y-auto space-y-6 md:h-[calc(100vh-65px)] sticky top-16 z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-purple-500/10 pb-3">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold font-mono tracking-wider uppercase">Studio Controls</h2>
          </div>

          {/* Theme Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold block text-left">Portfolio Template Theme</label>
            <div className="grid grid-cols-1 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleUpdateField('theme', t.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                    editedPortfolio.theme === t.id
                      ? "bg-purple-600/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                      : "bg-[#0e062c]/50 border-purple-500/10 hover:border-purple-500/30"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold font-mono">{t.name}</div>
                    <div className="text-[9px] text-gray-500 leading-normal mt-0.5">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Font Picker */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold block">Typography Style</label>
            <select
              value={editedPortfolio.fontClass}
              onChange={(e) => handleUpdateField('fontClass', e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#0e062c] border border-purple-500/20 text-xs font-mono text-purple-100 focus:outline-none focus:border-purple-400"
            >
              {fonts.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Text Editor overrides */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-1.5 pb-1 border-b border-purple-500/5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <label className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold">Bio Tuner Overrides</label>
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">Astronaut Headline Title</label>
              <input
                type="text"
                value={editedPortfolio.title}
                onChange={e => handleUpdateField('title', e.target.value)}
                className="w-full p-2 rounded bg-purple-950/20 border border-purple-500/10 text-xs font-mono text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-gray-500 uppercase">Biography Text</label>
              <textarea
                value={editedPortfolio.bio}
                onChange={e => handleUpdateField('bio', e.target.value)}
                className="w-full h-24 p-2 rounded bg-purple-950/20 border border-purple-500/10 text-xs font-sans text-white resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Public Status Toggle */}
          <div className="space-y-2 text-left pt-2">
            <label className="text-[10px] font-mono text-purple-300 uppercase tracking-wider font-bold block">Telemetry Broadcast Status</label>
            <button
              onClick={() => handleUpdateField('isPublished', !editedPortfolio.isPublished)}
              className={`w-full p-3 rounded-xl border text-center font-mono font-semibold tracking-wider text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
                editedPortfolio.isPublished
                  ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                  : "bg-red-600/10 border-red-500/20 text-red-400"
              }`}
            >
              <Cloud className="w-4 h-4" />
              {editedPortfolio.isPublished ? "PUBLISHED (LIVE)" : "DRAFT (OFFLINE)"}
            </button>
          </div>
        </div>

        {/* Save button (Always at bottom) */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-xs font-bold tracking-widest uppercase font-mono flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all"
        >
          <Save className="w-4 h-4" />
          {saving ? "TRANSMITTING..." : "SAVE CHANGES"}
        </button>
      </div>

      {/* Live Preview Display (Right side) */}
      <div className="flex-1 bg-[#050110] p-6 flex flex-col h-[calc(100vh-65px)] overflow-y-auto z-10 relative">
        {/* Device frame header */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between border-b border-purple-500/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-mono text-purple-300 uppercase tracking-wider">LIVE STUDIO PREVIEW CANVAS</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Live Mockup wrapper */}
        <div className="w-full max-w-5xl mx-auto rounded-xl border border-purple-500/10 bg-black/40 shadow-[0_0_45px_rgba(0,0,0,0.8)] overflow-hidden flex-1">
          <PublicPortfolioView portfolio={editedPortfolio} isMockup={true} />
        </div>
      </div>

    </div>
  );
}
