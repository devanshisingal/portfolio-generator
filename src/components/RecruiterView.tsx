/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Portfolio } from "../types";
import PublicPortfolioView from "./PublicPortfolioView";
import { Bot, UserCheck, Code, Award, FolderHeart, Sparkles, FileDown, Compass } from "lucide-react";
import { motion } from "motion/react";

interface RecruiterViewProps {
  portfolio: Portfolio;
}

export default function RecruiterView({ portfolio }: RecruiterViewProps) {
  const [downloading, setDownloading] = useState(false);

  // Group skills logically for recruiter clarity
  const languages = portfolio.skills.filter(s => ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'C++', 'Java'].includes(s));
  const frameworks = portfolio.skills.filter(s => ['React', 'Node.js', 'Next.js', 'Express', 'Angular', 'Vue', 'Tailwind CSS'].includes(s));
  const infraAndDatabases = portfolio.skills.filter(s => !languages.includes(s) && !frameworks.includes(s));

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Create simple resume mock download
      const content = `
RESUME SUMMARY: ${portfolio.name}
${portfolio.title}
Contact: ${portfolio.contact.email}

BIO:
${portfolio.bio}

SKILLS:
${portfolio.skills.join(", ")}

PROJECTS:
${portfolio.projects.map(p => `- ${p.title}: ${p.description}`).join("\n")}
      `;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${portfolio.id}_stellar_resume.txt`;
      link.click();
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Module Header */}
        <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">RECRUITMENT PLATFORM SECTOR</div>
            <h2 className="text-3xl font-bold font-mono flex items-center gap-2">
              <UserCheck className="w-8 h-8 text-cyan-400" />
              RECRUITER RADAR VIEW
            </h2>
            <p className="text-xs text-gray-400 mt-1">High-density visual layout optimizing credentials, grouped skills, top-impact projects first, and direct Q&A.</p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold font-mono tracking-wider flex items-center gap-2 text-black cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
          >
            <FileDown className="w-4 h-4" />
            {downloading ? "GENERATING..." : "EXPORT TXT RESUME"}
          </button>
        </div>

        {/* High Density Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Grouped Skills and Summary Info (Left 7 Columns) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Quick Profile Bio */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-cyan-400">EXECUTIVE SUMMARY</h3>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold font-mono text-white">{portfolio.name}</h4>
                <div className="text-xs font-mono text-cyan-400 uppercase">{portfolio.title}</div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{portfolio.bio}</p>
            </div>

            {/* Structured Grouped Skills */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-cyan-400">GROUPED SKILL INDEX</h3>
              </div>

              <div className="space-y-4 text-xs">
                {/* Languages */}
                {languages.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-gray-500 uppercase font-bold">Languages</div>
                    <div className="flex flex-wrap gap-1.5">
                      {languages.map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-cyan-400">{sk}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Frameworks */}
                {frameworks.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-gray-500 uppercase font-bold">Libraries & Frameworks</div>
                    <div className="flex flex-wrap gap-1.5">
                      {frameworks.map((sk, i) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-blue-400">{sk}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Databases, tools, infra */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-gray-500 uppercase font-bold">Infrastructure & Databases</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(infraAndDatabases.length > 0 ? infraAndDatabases : portfolio.skills).map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-white/5 border border-white/10 font-mono text-teal-400">{sk}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* High Impact Projects List */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-widest uppercase font-bold text-cyan-400 pl-1">TOP PERFORMANCE PROJECTS</h3>
              <div className="space-y-4">
                {portfolio.projects.map((proj) => (
                  <div key={proj.id} className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-base font-mono text-white">{proj.title}</h4>
                      <span className="text-[9px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded uppercase">HIGH IMPACT</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {proj.techStack.map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono text-cyan-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* AI Q&A Recruiter Chat (Right 5 columns, rendered in premium card) */}
          <div className="lg:col-span-5 flex flex-col h-[580px] bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Visual Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-b border-white/10 flex items-center justify-between text-white shadow-md">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="text-xs font-mono tracking-wider font-bold">RECRUITER INTERROGATOR AI</span>
              </div>
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>

            {/* Embedded Chat window */}
            <div className="flex-1 overflow-hidden relative">
              <PublicPortfolioView portfolio={portfolio} isMockup={true} />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
