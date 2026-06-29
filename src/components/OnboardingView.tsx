/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { FileText, Github, Linkedin, Sparkles, Plus, Trash2, Award, FolderGit2, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

interface OnboardingViewProps {
  userId: string;
  onOnboardComplete: (username: string) => void;
}

export default function OnboardingView({ userId, onOnboardComplete }: OnboardingViewProps) {
  const [resumeText, setResumeText] = useState("");
  const [githubUser, setGithubUser] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(["TypeScript", "React", "Node.js"]);
  
  const [certInput, setCertInput] = useState("");
  const [certs, setCerts] = useState<string[]>(["AWS Certified Cloud Practitioner"]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projects, setProjects] = useState<{ title: string; description: string }[]>([
    {
      title: "Nebula Drive",
      description: "An encrypted cloud filesystem with block storage optimizations."
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addCert = () => {
    if (certInput.trim() && !certs.includes(certInput.trim())) {
      setCerts([...certs, certInput.trim()]);
      setCertInput("");
    }
  };

  const removeCert = (index: number) => {
    setCerts(certs.filter((_, i) => i !== index));
  };

  const addProject = () => {
    if (projectTitle.trim() && projectDesc.trim()) {
      setProjects([...projects, { title: projectTitle.trim(), description: projectDesc.trim() }]);
      setProjectTitle("");
      setProjectDesc("");
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Pre-fills mock highly-polished "Star Developer" data for instant, robust demoing
  const prefillStellarData = () => {
    setResumeText(`SOPHIA SHEN
sophia.shen@gmail.com | github.com/sophiashen | linkedin.com/in/sophiashen

EXPERT FULL-STACK ENGINEER
Highly technical leader with 4+ years of building ultra-fast cloud services, microservices, and AI models.

EXPERIENCE:
- Senior Cloud Engineer at Astra Labs (June 2024 - Present): Built real-time processing stream using Apache Kafka and Express with 99.99% system availability. Optimized query speeds by 40% with smart caching.
- Full Stack Developer at Cosmic Dynamics (Sept 2022 - May 2024): Designed web dashboards using Next.js, tailwind, and Postgres. Migrated microservices to Docker.

EDUCATION:
- Stanford University, MS in Computer Science (2020-2022)
- UC Berkeley, BS in Computer Engineering (2016-2020)`);
    setGithubUser("sophiashen");
    setLinkedinUrl("linkedin.com/in/sophiashen");
    setSkills(["TypeScript", "React", "PostgreSQL", "Docker", "Apache Kafka", "Redis", "Next.js", "Express"]);
    setCerts(["AWS Certified Solutions Architect", "Google Cloud Professional Engineer"]);
    setProjects([
      {
        title: "Aura Ledger",
        description: "High-throughput blockchain indexing service that synchronizes transactions under 30ms."
      },
      {
        title: "Cosmic Analytics",
        description: "A serverless log aggregator dashboard parsing 50,000 requests/sec with real-time graphs."
      }
    ]);
  };

  const handleIngest = async () => {
    setLoading(true);
    setError(null);
    setLoadingLogs(["Initiating hyperwave broadcast connection...", "Pasting raw resume and metadata payload..."]);

    const runLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setLoadingLogs((prev) => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    try {
      // Fake a series of ultra high-tech visual status logs to engage the user
      await runLog("Injecting text stream into Gemini LLM analyzer pipeline...", 1000);
      await runLog("Structuring bio using first-person display typography...", 1000);
      await runLog("Synthesizing key professional highlights and experiences...", 900);
      await runLog("Mapping project bullet points to structured JSON...", 900);
      await runLog("Embedding skill credentials into galactic portfolio matrix...", 800);

      const response = await fetch("/api/portfolio/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resumeText,
          githubUser,
          linkedinUrl,
          skills,
          projects,
          certifications: certs,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ingest processing failed");
      }

      await runLog("Broadcasting final database writes and launching customization studio...", 500);
      setTimeout(() => {
        onOnboardComplete(data.username);
      }, 500);

    } catch (err: any) {
      setError(err.message || "Failed to parse data");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070114] text-white p-6 md:p-12 font-sans flex flex-col items-center">
      {/* Stars back */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f133c_1px,transparent_1px),linear-gradient(to_bottom,#1f133c_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="w-full max-w-4xl z-10 space-y-8 mt-6">
        {/* Step Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-purple-500/10 pb-6 gap-4">
          <div>
            <div className="text-xs font-mono text-purple-300 uppercase tracking-widest mb-1">DATA ONBOARD DECK</div>
            <h2 className="text-3xl font-bold font-mono">FEED THE AI ENGINE</h2>
            <p className="text-xs text-gray-400 mt-1">Submit your professional telemetry so the model can generate your personalized portfolio website.</p>
          </div>

          <button
            onClick={prefillStellarData}
            className="px-4 py-2.5 rounded-lg bg-[#14083a] hover:bg-[#1f0e54] border border-purple-500/30 text-xs font-semibold font-mono tracking-wider flex items-center gap-2 text-purple-200 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            PRE-FILL DEMO ASTRONAUT DATA
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-mono text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-[#0c0422]/60 backdrop-blur-md rounded-2xl border border-purple-500/10 p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-purple-400 absolute animate-pulse" />
            </div>

            <h3 className="text-xl font-bold font-mono text-center">GENERATING YOUR COSMIC PORTFOLIO</h3>
            
            {/* High-fidelity logging console */}
            <div className="w-full max-w-lg bg-[#070114] border border-purple-500/20 rounded-lg p-4 font-mono text-xs text-purple-300/80 space-y-1.5 h-48 overflow-y-auto shadow-inner text-left">
              {loadingLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-purple-600 font-semibold">&gt;&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="w-1.5 h-3.5 bg-purple-400 inline-block animate-pulse mt-1" />
            </div>
            
            <p className="text-[11px] text-gray-500 font-mono italic">Please hold, our Gemini agent is writing and formatting your live webpage...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Hand Form */}
            <div className="space-y-6">
              {/* PDF text Paste */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <label className="text-xs font-mono text-purple-300 uppercase tracking-widest font-bold">PASTE RESUME OR BIO TEXT</label>
                </div>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste details of your background, experience bullet points, or education here to allow the AI to parse everything automatically..."
                  className="w-full h-48 p-4 rounded-xl bg-purple-950/15 border border-purple-500/20 text-sm font-mono focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 text-white placeholder-purple-800/50 resize-none"
                />
              </div>

              {/* Profiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Github className="w-3.5 h-3.5 text-purple-400" />
                    <label className="text-[10px] font-mono text-purple-300 uppercase font-bold">GITHUB USERNAME</label>
                  </div>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={e => setGithubUser(e.target.value)}
                    placeholder="e.g. sophiashen"
                    className="w-full px-3 py-2.5 rounded-lg bg-purple-950/15 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-purple-400 text-white placeholder-purple-800/50"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Linkedin className="w-3.5 h-3.5 text-purple-400" />
                    <label className="text-[10px] font-mono text-purple-300 uppercase font-bold">LINKEDIN PROFILE URL</label>
                  </div>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    placeholder="e.g. linkedin.com/in/sophiashen"
                    className="w-full px-3 py-2.5 rounded-lg bg-purple-950/15 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-purple-400 text-white placeholder-purple-800/50"
                  />
                </div>
              </div>

              {/* Ingest Button (Bottom left on desktop) */}
              <button
                onClick={handleIngest}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all font-mono tracking-widest uppercase mt-4"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                PROCESS AI INGEST
              </button>
            </div>

            {/* Right Hand Form: Dynamic Skills & Projects Lists */}
            <div className="space-y-6">
              {/* Skills Deck */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <label className="text-xs font-mono text-purple-300 uppercase tracking-widest font-bold">SKILLS CREDENTIAL DECK</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="e.g. Kubernetes (Press Enter)"
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-950/15 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-purple-400 text-white placeholder-purple-800/50"
                  />
                  <button
                    onClick={addSkill}
                    className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-24 overflow-y-auto">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#13072e] border border-purple-500/20 text-xs font-mono text-purple-200"
                    >
                      {skill}
                      <button onClick={() => removeSkill(index)} className="hover:text-red-400 ml-1">
                        &times;
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <span className="text-[10px] font-mono text-gray-600">No custom skills added yet.</span>
                  )}
                </div>
              </div>

              {/* Certifications Deck */}
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-pink-400" />
                  <label className="text-xs font-mono text-pink-300 uppercase tracking-widest font-bold">CERTIFICATIONS</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={certInput}
                    onChange={e => setCertInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCert()}
                    placeholder="e.g. CKAD Certified Kubernetes (Press Enter)"
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-950/15 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-pink-400 text-white placeholder-purple-800/50"
                  />
                  <button
                    onClick={addCert}
                    className="px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-20 overflow-y-auto">
                  {certs.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1e0722] border border-pink-500/20 text-xs font-mono text-pink-200"
                    >
                      {cert}
                      <button onClick={() => removeCert(index)} className="hover:text-red-400 ml-1">
                        &times;
                      </button>
                    </span>
                  ))}
                  {certs.length === 0 && (
                    <span className="text-[10px] font-mono text-gray-600">No certifications listed yet.</span>
                  )}
                </div>
              </div>

              {/* Projects Addition */}
              <div className="space-y-2 text-left border-t border-purple-500/10 pt-4">
                <div className="flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <label className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-bold">ADD WORK / PROJECTS</label>
                </div>
                <div className="space-y-2 bg-purple-950/10 p-3 rounded-lg border border-purple-500/10">
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder="Project Title (e.g. Astro Engine)"
                    className="w-full px-3 py-2 rounded-lg bg-purple-950/15 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white placeholder-purple-800/50"
                  />
                  <textarea
                    value={projectDesc}
                    onChange={e => setProjectDesc(e.target.value)}
                    placeholder="Short description / Bullet points (AI will fully expand this beautifully)"
                    className="w-full h-16 p-2 rounded-lg bg-purple-950/15 border border-purple-500/20 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white placeholder-purple-800/50 resize-none"
                  />
                  <button
                    type="button"
                    onClick={addProject}
                    className="w-full py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-semibold font-mono tracking-wider cursor-pointer"
                  >
                    ADD TO TELEMETRY
                  </button>
                </div>

                {/* Listed Projects */}
                <div className="space-y-2 max-h-32 overflow-y-auto pt-2">
                  {projects.map((proj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#070114]/50 border border-purple-500/10 text-xs"
                    >
                      <div className="text-left">
                        <div className="font-bold font-mono text-purple-300">{proj.title}</div>
                        <div className="text-gray-500 truncate max-w-xs">{proj.description}</div>
                      </div>
                      <button onClick={() => removeProject(index)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-[10px] font-mono text-gray-600 text-center py-2">No projects added yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
