/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { ResumeOptimization } from "../types";
import { Sparkles, ArrowRight, ShieldCheck, FileCheck, RefreshCcw, Award, Star } from "lucide-react";
import { motion } from "motion/react";

export default function ResumeOptimizerView() {
  const [bulletText, setBulletText] = useState("");
  const [roleTarget, setRoleTarget] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeOptimization | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (e: FormEvent) => {
    e.preventDefault();
    if (!bulletText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletText,
          roleTarget,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to consult optimizer.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to optimize telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrefill = (bullet: string) => {
    setBulletText(bullet);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Module Header */}
        <div className="border-b border-white/10 pb-6 text-left">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">ASTRO ATS COMPILER</div>
          <h2 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">RESUME BUILDER & OPTIMIZER</h2>
          <p className="text-xs text-gray-400 mt-1">Upgrade your resume bullet points. Input standard bullet text, select target role, and let Gemini rewrite them using Google's metrics-driven XYZ formula.</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono text-center">
            {error}
          </div>
        )}

        {/* Input Panel */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 shadow-lg">
          <form onSubmit={handleOptimize} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left md:col-span-2">
                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Standard Resume Bullet Point / Description</label>
                <textarea
                  required
                  value={bulletText}
                  onChange={e => setBulletText(e.target.value)}
                  placeholder="e.g. I was responsible for coding the web dashboard and optimized database speed."
                  className="w-full h-24 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white placeholder-zinc-700/80 resize-none"
                />
              </div>

              <div className="space-y-1.5 text-left md:col-span-2">
                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Target Role / Industry</label>
                <select
                  value={roleTarget}
                  onChange={e => setRoleTarget(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0c0c0c] border border-white/10 text-xs font-mono text-white focus:outline-none"
                >
                  <option value="Software Engineer">Software Engineer (Full-Stack/Backend)</option>
                  <option value="Frontend Developer">Frontend Developer (React/UI-UX)</option>
                  <option value="DevOps / Cloud Architect">DevOps / Cloud Solutions Architect</option>
                  <option value="Data Scientist / ML Engineer">Data Scientist / Machine Learning Engineer</option>
                  <option value="Product Manager">Technical Product Manager</option>
                </select>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-left">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Weak Bullets:</span>
              <button
                type="button"
                onClick={() => handlePrefill("I worked on the server code and fixed bugs so it didn't crash.")}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-[10px] font-mono rounded cursor-pointer"
              >
                "Worked on server code..."
              </button>
              <button
                type="button"
                onClick={() => handlePrefill("Designed a new landing page for our bank product and added images.")}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-[10px] font-mono rounded cursor-pointer"
              >
                "Designed a landing page..."
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !bulletText.trim()}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin text-black" />
                  RECONSTITUTING ATOMS...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                  OPTIMIZE WITH GOOGLE XYZ
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Deck */}
        {result && (
          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-md overflow-hidden shadow-2xl text-left">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>XYZ METRIC RECONSTITUTE REPORT</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">ATS OPTIMIZED</span>
            </div>

            <div className="p-6 space-y-6">
              {/* Score card */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Estimated ATS Score Increase</div>
                  <div className="w-48 bg-white/5 h-2 rounded-full overflow-hidden border border-white/10 mt-1">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${result.atsScore}%` }} />
                  </div>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 font-bold">+{result.atsScore - 50}% SCORE</div>
              </div>

              {/* XYZ result block */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Google XYZ Best In Class Rewrite
                </h3>
                <p className="text-xs text-gray-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10 font-mono select-all">
                  "{result.optimizedText}"
                </p>
                <div className="text-[10px] font-mono text-zinc-500 leading-tight">
                  X = Accomplished ... Y = Quantified Metric ... Z = Technology & Methodology
                </div>
              </div>

              {/* Alternate candidates */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wide">
                  Alternative Candidates
                </h3>
                <div className="space-y-2">
                  {result.bulletPoints.map((alt, i) => (
                    <p key={i} className="text-xs text-gray-300 leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5 font-mono">
                      "{alt}"
                    </p>
                  ))}
                </div>
              </div>

              {/* Professional advice */}
              <div className="p-4 rounded-xl bg-cyan-950/10 border border-cyan-500/20 space-y-2">
                <h3 className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wide flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  Keyword Injector & ATS Advice
                </h3>
                <div className="space-y-1">
                  {result.suggestions.map((advice, i) => (
                    <div key={i} className="text-xs text-cyan-100/90 leading-relaxed font-sans flex gap-1.5">
                      <Star className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{advice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
