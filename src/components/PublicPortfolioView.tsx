/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from "react";
import { Portfolio, ChatMessage } from "../types";
import { Mail, Github, Linkedin, Briefcase, GraduationCap, Code, Compass, Send, Bot, ExternalLink, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

interface PublicPortfolioViewProps {
  portfolio: Portfolio;
  isMockup?: boolean; // if true, disables server track-view triggers
}

export default function PublicPortfolioView({ portfolio, isMockup = false }: PublicPortfolioViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Hello! I am ${portfolio.name}'s AI Recruiter Assistant. Ask me anything about their tech stack, experience, projects, or work history!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Trigger track-view on load
  useEffect(() => {
    if (!isMockup) {
      fetch(`/api/portfolio/${portfolio.id}/track-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "view" }),
      }).catch(err => console.error("Tracking view error:", err));
    }
  }, [portfolio.id, isMockup]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingChat) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setSendingChat(true);

    // Track analytics question click
    if (!isMockup) {
      fetch(`/api/portfolio/${portfolio.id}/track-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "question" }),
      }).catch(err => console.error(err));
    }

    try {
      const response = await fetch(`/api/portfolio/${portfolio.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to process chat");
      }

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: "error",
        sender: "ai",
        text: `Error connecting to telepathic link: ${err.message || 'Check network connection'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setSendingChat(false);
    }
  };

  const trackProjectClick = (projectId: string) => {
    if (!isMockup) {
      fetch(`/api/portfolio/${portfolio.id}/track-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "projectClick", projectId }),
      }).catch(err => console.error(err));
    }
  };

  // Preset question buttons for quick recruiter access
  const presetQuestions = [
    `What skills do you have?`,
    `Explain your best project.`,
    `Why should I hire you?`,
  ];

  const triggerPresetQuestion = (question: string) => {
    setInputMessage(question);
  };

  // Theme-specific CSS classes
  const getThemeStyles = () => {
    switch (portfolio.theme) {
      case "cyberpunk":
        return {
          wrapper: "bg-[#09090b] text-[#00ffcc] font-mono",
          card: "bg-black/90 border-2 border-[#ff0055] p-6 shadow-[0_0_15px_rgba(255,0,85,0.4)]",
          titleGlow: "text-transparent bg-clip-text bg-gradient-to-r from-[#ff0055] via-yellow-400 to-[#00ffcc] drop-shadow-[0_0_10px_rgba(0,255,204,0.5)] font-black uppercase tracking-wider",
          badge: "bg-[#00ffcc]/10 border border-[#00ffcc]/40 text-[#00ffcc] px-2.5 py-1 text-xs",
          button: "bg-gradient-to-r from-[#ff0055] to-yellow-400 text-black font-extrabold uppercase hover:shadow-[0_0_15px_rgba(255,0,85,0.4)]",
          borderLine: "border-t-2 border-dashed border-[#00ffcc]/20",
          header: "border-b-4 border-double border-[#ff0055] pb-4 bg-black/40",
          chatHeader: "bg-[#ff0055] text-black font-bold uppercase",
          chatWindow: "bg-black border-2 border-[#ff0055]/40 text-green-400 font-mono",
          inputField: "bg-[#111] border-2 border-[#00ffcc] focus:border-[#ff0055] text-white",
          accentText: "text-[#00ffcc]",
          border: "border-[#ff0055]/20",
          iconColor: "text-[#00ffcc]",
          subCard: "bg-black border border-[#ff0055]/30 text-white",
          userMsg: "bg-[#ff0055] text-black font-semibold rounded-t-xl rounded-l-xl rounded-tr-none",
          aiMsg: "bg-black border border-[#00ffcc]/30 text-white rounded-t-xl rounded-r-xl rounded-tl-none",
          presetBtn: "bg-black hover:bg-[#ff0055]/10 text-[#00ffcc] border border-[#00ffcc]/30",
          chatSubmit: "bg-[#ff0055] text-black hover:bg-pink-600",
          timelineLine: "border-[#00ffcc]/20",
          timelineDotBg: "bg-black border border-[#ff0055]",
          timelineDotCore: "bg-[#00ffcc]"
        };
      case "minimal":
        return {
          wrapper: "bg-[#fafafa] text-[#18181b] font-sans",
          card: "bg-white border border-[#e4e4e7] p-6 rounded-lg shadow-sm hover:shadow-md transition-all",
          titleGlow: "text-[#18181b] font-extrabold tracking-tight",
          badge: "bg-[#f4f4f5] border border-[#e4e4e7] text-[#27272a] px-3 py-1 text-xs rounded-full",
          button: "bg-black hover:bg-zinc-800 text-white rounded-lg",
          borderLine: "border-t border-zinc-200",
          header: "border-b border-zinc-200 pb-6 bg-white",
          chatHeader: "bg-[#18181b] text-white font-medium rounded-t-lg",
          chatWindow: "bg-[#fafafa] border border-zinc-200 text-zinc-800 font-sans",
          inputField: "bg-white border border-zinc-300 focus:border-black text-black rounded-lg",
          accentText: "text-[#18181b]",
          border: "border-zinc-200",
          iconColor: "text-zinc-600",
          subCard: "bg-zinc-100/50 border border-zinc-200 text-zinc-800",
          userMsg: "bg-black text-white rounded-t-xl rounded-l-xl rounded-tr-none",
          aiMsg: "bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-t-xl rounded-r-xl rounded-tl-none",
          presetBtn: "bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300",
          chatSubmit: "bg-black hover:bg-zinc-800 text-white rounded-lg",
          timelineLine: "border-zinc-200",
          timelineDotBg: "bg-zinc-100 border border-zinc-400",
          timelineDotCore: "bg-zinc-800"
        };
      case "terminal":
        return {
          wrapper: "bg-[#030712] text-[#22c55e] font-mono",
          card: "bg-black border border-[#22c55e] p-6 shadow-[0_0_10px_rgba(34,197,94,0.1)] relative before:absolute before:top-2 before:left-2 before:w-1 before:h-1 before:bg-[#22c55e]",
          titleGlow: "text-[#22c55e] font-bold tracking-widest text-lg md:text-xl",
          badge: "bg-green-950/20 border border-[#22c55e] text-[#22c55e] px-2 py-0.5 text-xs font-mono",
          button: "bg-[#22c55e] text-black font-semibold uppercase hover:bg-green-400",
          borderLine: "border-t border-green-900/40",
          header: "border-b border-green-900/60 pb-4 bg-black/50",
          chatHeader: "bg-[#22c55e] text-black font-bold font-mono",
          chatWindow: "bg-[#020617] border border-[#22c55e]/40 text-[#22c55e] font-mono",
          inputField: "bg-black border border-[#22c55e] text-[#22c55e] focus:ring-1 focus:ring-green-400",
          accentText: "text-[#22c55e]",
          border: "border-green-900/30",
          iconColor: "text-[#22c55e]",
          subCard: "bg-black border border-[#22c55e]/20 text-green-400",
          userMsg: "bg-[#22c55e] text-black font-bold rounded-t-xl rounded-l-xl rounded-tr-none",
          aiMsg: "bg-black border border-[#22c55e]/40 text-[#22c55e] rounded-t-xl rounded-r-xl rounded-tl-none",
          presetBtn: "bg-black hover:bg-green-900/20 text-[#22c55e] border border-[#22c55e]/30",
          chatSubmit: "bg-[#22c55e] text-black hover:bg-green-400",
          timelineLine: "border-green-900/30",
          timelineDotBg: "bg-black border border-[#22c55e]",
          timelineDotCore: "bg-[#22c55e]"
        };
      case "galaxy":
      default:
        return {
          wrapper: "bg-[#050505] text-[#fafafa] font-sans",
          card: "bg-white/[0.02] border border-white/10 p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:border-white/20 transition-all",
          titleGlow: "text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-500 drop-shadow-[0_4px_8px_rgba(34,211,238,0.3)] font-black uppercase tracking-wider font-mono",
          badge: "bg-white/5 border border-white/10 text-cyan-400 px-3 py-1 text-xs rounded-full",
          button: "bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl",
          borderLine: "border-t border-white/5",
          header: "border-b border-white/10 pb-6 bg-white/[0.02]",
          chatHeader: "bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-white/10 text-white font-semibold font-mono rounded-t-xl",
          chatWindow: "bg-[#0c0c0c]/80 backdrop-blur-lg border border-white/10 text-white font-sans",
          inputField: "bg-white/5 border border-white/10 focus:border-cyan-400 text-white rounded-xl",
          accentText: "text-cyan-400",
          border: "border-white/10",
          iconColor: "text-cyan-400",
          subCard: "bg-white/[0.02] border border-white/10 text-white",
          userMsg: "bg-cyan-500 text-black font-semibold rounded-t-xl rounded-l-xl rounded-tr-none",
          aiMsg: "bg-white/5 border border-white/10 text-gray-200 rounded-t-xl rounded-r-xl rounded-tl-none",
          presetBtn: "bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10",
          chatSubmit: "bg-cyan-500 hover:bg-cyan-400 text-black",
          timelineLine: "border-white/10",
          timelineDotBg: "bg-white/5 border border-white/10",
          timelineDotCore: "bg-cyan-400"
        };
    }
  };

  const st = getThemeStyles();
  const fontClass = portfolio.fontClass || "font-sans";

  return (
    <div className={`w-full min-h-screen ${st.wrapper} ${fontClass} p-4 sm:p-8 transition-colors duration-500 relative`}>
      {/* Background decoration for space theme */}
      {portfolio.theme === "galaxy" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/10 via-[#050505] to-[#000000] pointer-events-none z-0" />
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Main Resume Content (Left 8 columns on large, 12 otherwise) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cover Header */}
          <header className={`w-full ${st.header} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-xl ${st.subCard}`}>
            <div className="space-y-2 text-left">
              <span className={`text-xs tracking-widest ${st.accentText} font-mono font-semibold uppercase`}>PORTFOLIO SECTOR</span>
              <h1 className={`text-3xl sm:text-4xl ${st.titleGlow}`}>{portfolio.name}</h1>
              <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase font-mono">{portfolio.title}</p>
            </div>

            {/* Quick social connections */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={`mailto:${portfolio.contact.email}`}
                className={`p-2.5 rounded-lg ${st.subCard} hover:opacity-80 flex items-center justify-center cursor-pointer transition-colors`}
                title="Email Candidate"
              >
                <Mail className="w-4 h-4" />
              </a>
              {portfolio.contact.github && (
                <a
                  href={`https://${portfolio.contact.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2.5 rounded-lg ${st.subCard} hover:opacity-80 flex items-center justify-center cursor-pointer transition-colors`}
                  title="GitHub Link"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.contact.linkedin && (
                <a
                  href={`https://${portfolio.contact.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2.5 rounded-lg ${st.subCard} hover:opacity-80 flex items-center justify-center cursor-pointer transition-colors`}
                  title="LinkedIn Link"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </header>

          {/* About / Bio section */}
          <section className={`${st.card} text-left space-y-4`}>
            <div className={`flex items-center gap-2 border-b ${st.border} pb-2`}>
              <Compass className={`w-4 h-4 ${st.iconColor}`} />
              <h2 className="text-xs font-mono tracking-widest uppercase font-semibold">Telemetry Summary</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-300 font-sans">{portfolio.bio}</p>
          </section>

          {/* Skills deck */}
          <section className={`${st.card} text-left space-y-4`}>
            <div className={`flex items-center gap-2 border-b ${st.border} pb-2`}>
              <Code className={`w-4 h-4 ${st.iconColor}`} />
              <h2 className="text-xs font-mono tracking-widest uppercase font-semibold">Skill Inventory</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(portfolio.skills || []).map((skill, index) => (
                <span key={index} className={`${st.badge} font-mono font-medium`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Projects showcase */}
          <section className="space-y-4 text-left">
            <h2 className={`text-xs font-mono tracking-widest uppercase font-bold ${st.accentText} pl-1`}>Projects Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(portfolio.projects || []).map((project) => (
                <div
                  key={project.id}
                  onClick={() => trackProjectClick(project.id)}
                  className={`${st.card} cursor-pointer hover:-translate-y-1 transition-all flex flex-col justify-between`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold font-mono text-base">{project.title}</h3>
                      <ExternalLink className={`w-4 h-4 ${st.iconColor} opacity-60`} />
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">{project.description}</p>
                  </div>
                  
                  {/* Tech tags */}
                  <div className={`flex flex-wrap gap-1.5 pt-4 border-t ${st.border} mt-4`}>
                    {(project.techStack || []).map((tech, i) => (
                      <span key={i} className={`${st.badge} !px-2 !py-0.5 !text-[9px]`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experiences list */}
          <section className={`${st.card} text-left space-y-4`}>
            <div className={`flex items-center gap-2 border-b ${st.border} pb-2`}>
              <Briefcase className={`w-4 h-4 ${st.iconColor}`} />
              <h2 className="text-xs font-mono tracking-widest uppercase font-semibold">Experience History</h2>
            </div>
            <div className="space-y-6">
              {(portfolio.experience || []).map((exp) => (
                <div key={exp.id} className={`relative pl-6 border-l-2 ${st.timelineLine} space-y-1`}>
                  <div className={`absolute w-3.5 h-3.5 rounded-full ${st.timelineDotBg} top-1 -left-1.5 flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${st.timelineDotCore}`} />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="font-bold text-sm">{exp.role}</h3>
                    <span className="text-[10px] font-mono text-gray-500">{exp.duration}</span>
                  </div>
                  <div className={`text-xs font-mono ${st.accentText}`}>{exp.company}</div>
                  <p className="text-xs text-gray-400 pt-1 font-sans leading-relaxed">{exp.description}</p>
                </div>
              ))}
              {(portfolio.experience || []).length === 0 && (
                <div className="text-xs text-gray-600 font-mono">No work experience entries added.</div>
              )}
            </div>
          </section>

          {/* Education list */}
          <section className={`${st.card} text-left space-y-4`}>
            <div className={`flex items-center gap-2 border-b ${st.border} pb-2`}>
              <GraduationCap className={`w-4 h-4 ${st.iconColor}`} />
              <h2 className="text-xs font-mono tracking-widest uppercase font-semibold">Education Spectrum</h2>
            </div>
            <div className="space-y-4">
              {(portfolio.education || []).map((edu) => (
                <div key={edu.id} className={`space-y-1 pl-4 border-l ${st.border}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <span className="text-[10px] font-mono text-gray-500">{edu.duration}</span>
                  </div>
                  <div className={`text-xs font-mono ${st.accentText}`}>{edu.school}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* AI Recruiter Q&A Chatbot (Right 4 columns) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-[550px] flex flex-col">
          <div className={`w-full ${st.chatHeader} p-4 flex items-center justify-between shadow-md`}>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="text-xs font-mono tracking-wider uppercase">INTERACTIVE RECRUITER ASSISTANT</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>

          <div className={`flex-1 p-4 overflow-y-auto space-y-3 flex flex-col ${st.chatWindow}`}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] ${m.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
              >
                <div
                  className={`p-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? st.userMsg
                      : st.aiMsg
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[8px] font-mono text-gray-500 mt-1">{m.timestamp}</span>
              </div>
            ))}
            
            {sendingChat && (
              <div className={`flex items-center gap-1.5 text-[10px] font-mono ${st.accentText} opacity-80 italic self-start ${st.subCard} p-2 rounded-lg`}>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span>Synchronizing neural matrix...</span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick preset questions */}
          <div className={`p-2 border-t ${st.border} bg-white/[0.01] flex gap-1 overflow-x-auto select-none`}>
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => triggerPresetQuestion(q)}
                className={`flex-shrink-0 text-[10px] font-mono px-2 py-1 ${st.presetBtn} rounded-md cursor-pointer transition-all`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSendMessage} className={`p-3 border-t ${st.border} bg-white/[0.02] flex gap-2`}>
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask me a question about this candidate..."
              className={`flex-1 px-3 py-2 text-xs focus:outline-none ${st.inputField}`}
            />
            <button
              type="submit"
              disabled={sendingChat || !inputMessage.trim()}
              className={`p-2 ${st.chatSubmit} rounded-lg flex items-center justify-center cursor-pointer transition-all`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
