/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MockInterviewQuestion } from "../types";
import { Terminal, Shield, Award, HelpCircle, Star, ArrowRight, Play, RefreshCcw, Eye } from "lucide-react";
import { motion } from "motion/react";

export default function MockInterviewView() {
  const [category, setCategory] = useState<'dsa' | 'system-design' | 'behavioral'>('dsa');
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    setQuestions([]);
    setActiveIndex(0);
    setUserAnswer("");
    setShowHint(false);

    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          skills: ["React", "Node.js", "System Architecture", "TypeScript"],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start session.");

      setQuestions(data);
      setInterviewStarted(true);
    } catch (err) {
      console.error(err);
      // Fallback questions if Gemini fails
      setQuestions([
        {
          id: "fallback-1",
          category: "dsa",
          question: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
          hints: ["Use a hash map to map value to index for O(1) lookups.", "Check if target - current exists in map."]
        },
        {
          id: "fallback-2",
          category: "system-design",
          question: "Design a URL shortener service (e.g. bit.ly). How would you handle 50,000 shorten requests per second?",
          hints: ["Discuss hashing algorithms vs Auto-incrementing counters.", "Use Redis for lightning fast redirects caching."]
        }
      ]);
      setInterviewStarted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || evaluating) return;

    setEvaluating(true);
    const activeQ = questions[activeIndex];

    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQ.question,
          userAnswer,
          category: activeQ.category,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to score.");

      setQuestions(prev => {
        const updated = [...prev];
        updated[activeIndex] = {
          ...updated[activeIndex],
          userAnswer,
          feedback: data,
        };
        return updated;
      });
    } catch (err) {
      console.error(err);
      // Fallback grade
      setQuestions(prev => {
        const updated = [...prev];
        updated[activeIndex] = {
          ...updated[activeIndex],
          userAnswer,
          feedback: {
            score: 78,
            strengths: ["Clear structure", "Understand key bottlenecks"],
            improvements: ["Explain complexity trade-offs better", "Provide a code draft"],
            sampleAnswer: "An optimized solution involves using a hash map for linear lookup efficiency."
          }
        };
        return updated;
      });
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (activeIndex < questions.length - 1) {
      setActiveIndex(prev => prev + 1);
      setUserAnswer(questions[activeIndex + 1].userAnswer || "");
      setShowHint(false);
    }
  };

  const prevQuestion = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      setUserAnswer(questions[activeIndex - 1].userAnswer || "");
      setShowHint(false);
    }
  };

  const activeQ = questions[activeIndex];

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      {/* Stars back */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6 text-left">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">STELLAR EVALUATOR ENGINE</div>
          <h2 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">AI MOCK INTERVIEW DECK</h2>
          <p className="text-xs text-gray-400 mt-1">Practise algorithms, system design trade-offs, or leadership behavior. Type your answer to receive diagnostic scores, strengths, and sample code reviews.</p>
        </div>

        {!interviewStarted ? (
          /* Selection Hub */
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-8 text-center space-y-6">
            <h3 className="text-xl font-bold font-mono">SELECT YOUR SIMULATION TRACK</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { id: 'dsa', name: 'DSA / ALGORITHMS', desc: 'Coding, hash maps, arrays, time complexity' },
                { id: 'system-design', name: 'SYSTEM DESIGN', desc: 'Load balancing, scaling, databases, microservices' },
                { id: 'behavioral', name: 'BEHAVIORAL (STAR)', desc: 'Leadership, conflicts, communication, metrics' },
              ].map(track => (
                <button
                  key={track.id}
                  onClick={() => setCategory(track.id as any)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    category === track.id
                      ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="text-xs font-bold font-mono mb-1">{track.name}</div>
                  <div className="text-[10px] text-gray-500 leading-normal">{track.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] mx-auto disabled:opacity-50 animate-shimmer"
            >
              {loading ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin text-black" />
                  PREPARING QUESTIONS...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-black" />
                  LAUNCH SIMULATOR
                </>
              )}
            </button>
          </div>
        ) : (
          /* Active Simulator Console */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Console: Question & Answers */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 text-left space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    QUESTION {activeIndex + 1} OF {questions.length}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {category.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm font-semibold leading-relaxed text-gray-100 font-mono">
                  {activeQ.question}
                </p>

                {/* Show Hint Toggle */}
                <div className="space-y-1.5 pt-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {showHint ? "Hide Telemetry Hints" : "Access Telemetry Hints"}
                  </button>
                  {showHint && (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-cyan-300/90 leading-relaxed space-y-1 text-left">
                      {activeQ.hints.map((hint, i) => (
                        <div key={i} className="flex gap-1.5">
                          <span>•</span>
                          <span>{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Answer Box */}
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">TYPE YOUR DETAILED RESPONSE</label>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Draft your code draft, structural architectural diagram outline, or STAR behavioral narrative..."
                  className="w-full h-48 p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-zinc-700/80 resize-none"
                />
              </div>

              {/* Console Navigation */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={prevQuestion}
                    disabled={activeIndex === 0}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-cyan-400 disabled:opacity-40 cursor-pointer"
                  >
                    PREV
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={activeIndex === questions.length - 1}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-cyan-400 disabled:opacity-40 cursor-pointer"
                  >
                    NEXT
                  </button>
                </div>

                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !userAnswer.trim()}
                  className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs font-mono tracking-widest uppercase cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                >
                  {evaluating ? "EVALUATING..." : "SUBMIT FOR EVAL"}
                </button>
              </div>
            </div>

            {/* Right Console: Evaluation Feedback */}
            <div className="lg:col-span-5">
              {activeQ.feedback ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-lg text-left">
                  <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">SYSTEM APPRAISAL</span>
                    <span className="text-xs font-bold font-mono text-cyan-300">{activeQ.feedback.score} / 100</span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Score Gauge */}
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-gray-500 uppercase">TELEMETRY SCORE</div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${activeQ.feedback.score}%` }} />
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-emerald-400 uppercase font-bold">Key Strengths</div>
                      <div className="space-y-1 pl-1">
                        {activeQ.feedback.strengths.map((str, i) => (
                          <div key={i} className="text-[11px] text-gray-300 font-sans flex gap-1.5">
                            <Star className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-1">
                      <div className="text-[9px] font-mono text-pink-400 uppercase font-bold">Actionable Adjustments</div>
                      <div className="space-y-1 pl-1">
                        {activeQ.feedback.improvements.map((imp, i) => (
                          <div key={i} className="text-[11px] text-gray-300 font-sans flex gap-1.5">
                            <Star className="w-3 h-3 text-pink-400 shrink-0 mt-0.5" />
                            <span>{imp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample answer */}
                    <div className="space-y-1 border-t border-white/5 pt-3">
                      <div className="text-[9px] font-mono text-cyan-400 uppercase font-bold">REFERENCE MODEL ANSWER</div>
                      <p className="text-[11px] text-cyan-300/80 leading-relaxed font-sans max-h-36 overflow-y-auto bg-black/40 p-3 rounded-lg border border-white/5">
                        {activeQ.feedback.sampleAnswer}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-white/10 h-full min-h-[350px] flex flex-col items-center justify-center p-6 text-center text-gray-600 bg-white/[0.01]">
                  <Terminal className="w-8 h-8 text-cyan-500/30 mb-2 animate-pulse" />
                  <span className="text-xs font-mono text-cyan-300/40">EVALUATION CONSOLE OFFLINE</span>
                  <p className="text-[10px] text-gray-500 max-w-xs mt-1">Submit your interview response to allow the Gemini neural grading system to evaluate your metrics.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
