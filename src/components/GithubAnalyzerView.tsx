/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Terminal, Code, Cpu, ShieldCheck, Compass, GitBranch, ArrowRight, Loader } from "lucide-react";
import { motion } from "motion/react";

interface AnalysisResult {
  repoName: string;
  techStack: string[];
  architecture: string;
  designDecisions: string;
  complexity: string;
  recruiterExplanation: string;
}

export default function GithubAnalyzerView() {
  const [repoUrl, setRepoUrl] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoUrl,
          prompt: customPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze repository.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Network issue connecting to architect core.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrefill = (url: string) => {
    setRepoUrl(url);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      {/* Background design */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Module Header */}
        <div className="border-b border-white/10 pb-6 text-left">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">ASTRO ENGINE ANALYZER</div>
          <h2 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">GITHUB REPOSITORY INSPECTOR</h2>
          <p className="text-xs text-gray-400 mt-1">Submit a GitHub repository link, and our Gemini Architect will inspect the structure, trade-offs, complexity, and tech stack.</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono text-center">
            {error}
          </div>
        )}

        {/* Input Panel */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 shadow-lg">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Repository Link</label>
                <div className="relative">
                  <GitBranch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    required
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    placeholder="e.g. github.com/sophiashen/aura-ledger"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white placeholder-zinc-700/80"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Ask Specific Questions (Optional)</label>
                <div className="relative">
                  <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={e => setCustomPrompt(e.target.value)}
                    placeholder="e.g. How does authentication work? Is it scale-safe?"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white placeholder-zinc-700/80"
                  />
                </div>
              </div>
            </div>

            {/* Quick pre-fill suggestion pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-left">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Preset Demos:</span>
              <button
                type="button"
                onClick={() => handlePrefill("https://github.com/sophiashen/aura-ledger")}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-[10px] font-mono rounded cursor-pointer transition-colors"
              >
                sophiashen/aura-ledger
              </button>
              <button
                type="button"
                onClick={() => handlePrefill("https://github.com/sophiashen/cosmic-analytics")}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-[10px] font-mono rounded cursor-pointer transition-colors"
              >
                sophiashen/cosmic-analytics
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !repoUrl.trim()}
              className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-black" />
                  ANALYZING CODE STRUCTURE...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 text-black" />
                  INITIATE SYSTEM INSPECTION
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Console */}
        {result && (
          <div className="rounded-2xl border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-md overflow-hidden shadow-2xl relative text-left">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>ARCHITECT REPORT FOR: <strong className="text-white">{result.repoName}</strong></span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">SYSTEM STABLE</span>
            </div>

            <div className="p-6 space-y-6">
              {/* Grid: Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 uppercase font-bold">Tech Stack Detected</div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.techStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 uppercase font-bold">Code Complexity Level</div>
                  <div className="text-sm font-bold font-mono text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    {result.complexity}
                  </div>
                </div>
              </div>

              {/* Architecture block */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wide flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Software Architectural Model
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10 font-mono">
                  {result.architecture}
                </p>
              </div>

              {/* Design Decisions */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Engineering Trade-offs & Decisions
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10 font-mono">
                  {result.designDecisions}
                </p>
              </div>

              {/* Recruiter Translation */}
              <div className="p-4 rounded-xl bg-cyan-950/10 border border-cyan-500/20 space-y-2">
                <h3 className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wide flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Recruiter Translation (Plain English)
                </h3>
                <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
                  {result.recruiterExplanation}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
