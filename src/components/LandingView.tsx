/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Sparkles, ArrowRight, UserCheck, Bot, FileCheck, Terminal, Heart, Trophy, Globe, Compass } from "lucide-react";

interface LandingViewProps {
  onStart: () => void;
  onGoToAuth: (mode: 'login' | 'register') => void;
}

export default function LandingView({ onStart, onGoToAuth }: LandingViewProps) {
  return (
    <div className="relative w-full min-h-screen bg-[#070114] text-white overflow-x-hidden font-sans">
      {/* Sparkly Starry Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f133c_1px,transparent_1px),linear-gradient(to_bottom,#1f133c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Floating Nebula */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-96 right-10 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Sticky Sub-Header Nav */}
      <header className="sticky top-0 w-full z-30 bg-[#070114]/80 backdrop-blur-md border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold tracking-wider font-mono">
              G
            </div>
            <span className="font-extrabold tracking-wider font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-purple-300">
              GalaxyFolio
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onGoToAuth('login')}
              className="text-sm font-medium text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button 
              onClick={onStart}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold tracking-wider font-mono transition-all duration-200 border border-purple-400/40 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)]"
            >
              CLAIM YOUR SPACE
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center z-10">
        {/* Sparkly Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300 tracking-wider mb-8 uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          The Next Gen AI Portfolio Platform
        </motion.div>

        {/* Big Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none mb-6 max-w-5xl mx-auto"
        >
          Your portfolio <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
            that speaks for you.
          </span>
        </motion.h1>

        {/* Supporting Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gray-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Instant imports from GitHub & PDF resumes. Interactive split-screen design studio. A built-in AI assistant to answer recruiters' hard questions 24/7.
        </motion.p>

        {/* CTA Button Group */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold tracking-wide flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.9)]"
          >
            Build My AI Portfolio
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-purple-950/20 hover:bg-purple-900/30 border border-purple-500/20 text-purple-200 hover:text-white font-medium tracking-wide transition-all duration-200 cursor-pointer"
          >
            Explore Features
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center gap-4 border-t border-purple-950 pt-8"
        >
          <div className="text-xs uppercase font-mono tracking-widest text-purple-300">
            Trusted by creators and developers working at
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-50 text-sm font-semibold tracking-widest font-mono">
            <span>GOOGLE</span>
            <span>STRIPE</span>
            <span>META</span>
            <span>SPACEX</span>
            <span>NETFLIX</span>
          </div>
        </motion.div>
      </section>

      {/* Demo Mockup Section */}
      <section className="relative max-w-5xl mx-auto px-6 mb-24 z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="rounded-2xl border border-purple-500/20 bg-[#0c0422]/60 backdrop-blur-md p-2 shadow-[0_0_60px_rgba(168,85,247,0.15)] relative overflow-hidden group"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/10 bg-[#0e042a]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="px-6 py-1 rounded-md bg-[#070114] text-[10px] font-mono text-purple-400 border border-purple-500/5">
              galaxyfolio.io/jay-galaxy
            </div>
            <div className="w-8" />
          </div>

          {/* Interactive Split-Screen Mockup Representation */}
          <div className="grid grid-cols-1 md:grid-cols-5 bg-[#08021a] min-h-[400px]">
            {/* Editor Sidebar (Left) */}
            <div className="md:col-span-2 border-r border-purple-500/10 p-4 space-y-4 bg-purple-950/10 text-left">
              <div className="text-xs font-mono text-purple-300 uppercase tracking-widest pb-2 border-b border-purple-500/10">AI Customizer</div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Selected Template</label>
                <div className="p-2.5 rounded-lg bg-[#0c0422] border border-purple-500/20 text-xs font-mono flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-purple-400" /> Space Galaxy (Active)
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase">AI Prompt Tuner</label>
                <div className="p-3 rounded-lg bg-[#0e062c] text-[11px] font-mono text-cyan-300 border border-cyan-500/20 leading-relaxed relative overflow-hidden">
                  <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  "Write an astronaut-themed resume introduction highlighting my Kubernetes, React, and server-side TypeScript expertise..."
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Generated Skills Suggested</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['TypeScript', 'React', 'Kubernetes', 'Gemini SDK'].map(sk => (
                    <span key={sk} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Public Portfolio Preview (Right) */}
            <div className="md:col-span-3 p-6 flex flex-col justify-between bg-radial-at-t from-purple-950/20 via-[#0a0320] to-[#04000b] relative text-left">
              <div className="absolute top-4 right-4 text-[9px] font-mono text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">LIVE PREVIEW</div>
              
              <div className="space-y-4">
                <div className="text-xs tracking-widest text-purple-300 font-mono">HELLO FELLOW GALAXY MEMBER</div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold font-mono">I AM JAY DEVS</h3>
                  <p className="text-xs text-gray-400 font-mono">FULL STACK STELLAR ARCHITECT</p>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-purple-500/30 pl-3">
                  "Engineered distributed orbit databases processing 1M+ planetary signals using Node.js and Gemini-based neural parsing pipelines."
                </p>

                {/* Simulated Recruiter Box */}
                <div className="mt-6 border border-purple-500/20 rounded-xl p-3 bg-purple-950/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-purple-300">
                    <Bot className="w-3 h-3 text-purple-400" /> ASK MY AI CHATBOT
                  </div>
                  <div className="text-[10px] font-mono bg-[#0c0422] p-1.5 rounded text-gray-300">
                    "What distributed databases does Jay know?"
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 pl-1">
                    "Jay has hands-on proficiency with Redis, CockroachDB, and Firestore databases..."
                  </div>
                </div>
              </div>

              <div className="text-[9px] font-mono text-gray-600 mt-6 flex justify-between border-t border-purple-500/5 pt-2">
                <span>EST. 2026</span>
                <span>CRAFTED VIA GALAXYFOLIO</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Feature Preview */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-purple-950 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Everything you need for job-hunting. <br />
            <span className="text-purple-400">Powered by Gemini.</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
            No more hours spent aligning cards. Type your details once, customize visually, and let our agents handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: RAG Recruiter Chat */}
          <div className="p-6 rounded-2xl border border-purple-500/10 bg-[#0c0422]/40 backdrop-blur-xs space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">RAG Recruiter Chat</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your personal chatbot answers interview questions about you based directly on your work history. It sells your skills 24/7.
            </p>
          </div>

          {/* Card 2: GitHub Analyzer */}
          <div className="p-6 rounded-2xl border border-purple-500/10 bg-[#0c0422]/40 backdrop-blur-xs space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">GitHub Repo Analyzer</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Let the AI inspect your repository code to summarize the technical architecture, stack, design trade-offs, and complexity.
            </p>
          </div>

          {/* Card 3: ATS Optimizer */}
          <div className="p-6 rounded-2xl border border-purple-500/10 bg-[#0c0422]/40 backdrop-blur-xs space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Resume ATS Optimizer</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Input resume bullet points and leverage Google's XYZ metric formula to rewrite them for optimal Applicant Tracking score.
            </p>
          </div>

          {/* Card 4: Live Customization Studio */}
          <div className="p-6 rounded-2xl border border-purple-500/10 bg-[#0c0422]/40 backdrop-blur-xs space-y-4 text-left md:col-span-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Framer-Style Customization Studio</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Toggle themes instantly (Space Galaxy, Cyberpunk, stark minimal, or geek terminal), modify color hex schemes, alter fonts, and add/delete sections in real-time on our split-screen workspace.
            </p>
          </div>

          {/* Card 5: Analytics Dashboard */}
          <div className="p-6 rounded-2xl border border-purple-500/10 bg-[#0c0422]/40 backdrop-blur-xs space-y-4 text-left">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Visitor Analytics</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Keep an eye on who is looking at your profile. Track recruiter traffic, question click-throughs, and time spent on your page.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-950 py-8 text-center text-xs text-gray-600 font-mono z-10 relative">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-3 h-3 text-purple-500 fill-purple-500" /> for the Cosmic Developers. EST 2026.
        </p>
      </footer>
    </div>
  );
}
