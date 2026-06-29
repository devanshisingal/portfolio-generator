/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnalyticsSummary } from "../types";
import { Trophy, Users, HelpCircle, ArrowRightLeft, Clock, BarChart2, Star, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

interface AnalyticsViewProps {
  username: string;
}

export default function AnalyticsView({ username }: AnalyticsViewProps) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${username}/analytics`);
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [username]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#070114] text-white flex flex-col items-center justify-center font-mono">
        <RefreshCcw className="w-8 h-8 text-purple-400 animate-spin mb-2" />
        <span>SYNCHRONIZING TELEMETRY STREAMS...</span>
      </div>
    );
  }

  const data = analytics || {
    totalVisitors: 0,
    avgTimeSpentMin: 0,
    totalQuestions: 0,
    clickThroughRate: 0,
    visitorsOverTime: [],
    mostViewedProjects: [],
  };

  // Safe max calculation for line charts
  const maxVisitors = data.visitorsOverTime.length > 0
    ? Math.max(...data.visitorsOverTime.map(v => v.visitors), 10)
    : 10;

  return (
    <div className="w-full min-h-screen bg-[#070114] text-white p-6 md:p-12 font-sans relative overflow-x-hidden text-left">
      {/* Stars back */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f133c_1px,transparent_1px),linear-gradient(to_bottom,#1f133c_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Module Header */}
        <div className="border-b border-purple-500/10 pb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-purple-300 uppercase tracking-widest mb-1">STELLAR TELEMETRY CONSOLE</div>
            <h2 className="text-3xl font-bold font-mono">VISITOR ANALYTICS DASHBOARD</h2>
            <p className="text-xs text-gray-400 mt-1">Track recruiters interacting with your portfolio page. Discover which projects spark interest and what questions the AI chatbot answered.</p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 text-purple-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Reload Data Streams"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Scorecards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Visitors', val: data.totalVisitors, icon: <Users className="w-4 h-4 text-purple-400" />, desc: 'Recruiters landed' },
            { label: 'Avg Time Spent', val: `${data.avgTimeSpentMin} min`, icon: <Clock className="w-4 h-4 text-blue-400" />, desc: 'Active duration' },
            { label: 'AI Q&A Queries', val: data.totalQuestions, icon: <HelpCircle className="w-4 h-4 text-pink-400" />, desc: 'Recruiter prompts' },
            { label: 'Project CTR', val: `${data.clickThroughRate}%`, icon: <ArrowRightLeft className="w-4 h-4 text-cyan-400" />, desc: 'Link conversion rate' },
          ].map((card, i) => (
            <div key={i} className="p-5 rounded-xl border border-purple-500/15 bg-[#0c0422]/60 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-purple-400">{card.label}</span>
                {card.icon}
              </div>
              <div className="text-2xl font-bold font-mono text-white">{card.val}</div>
              <div className="text-[10px] text-gray-500 font-mono italic">{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Custom Line/Bar Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Traffic over time (8 columns) */}
          <div className="md:col-span-8 p-6 rounded-xl border border-purple-500/15 bg-[#09031c] space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <span className="text-xs font-mono text-purple-300 uppercase tracking-widest font-bold">TELEMETRY TRAFFIC STREAM (WEEKLY)</span>
              <span className="text-[9px] font-mono text-gray-500">LINE SCAN</span>
            </div>

            {/* Custom SVG Line graph */}
            <div className="relative h-64 w-full bg-[#070114]/50 border border-purple-500/5 rounded-lg p-2 overflow-hidden flex items-end">
              
              {/* Grid Y lines */}
              <div className="absolute inset-x-0 top-0 border-b border-purple-950/20 text-[8px] font-mono text-gray-700 pl-2 pt-1">Max: {maxVisitors}</div>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-purple-950/20 text-[8px] font-mono text-gray-700 pl-2">Mid: {Math.floor(maxVisitors / 2)}</div>
              
              <svg className="w-full h-[90%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* SVG path mapping */}
                <path
                  d={`M ${data.visitorsOverTime.map((v, i) => {
                    const x = (i / Math.max(data.visitorsOverTime.length - 1, 1)) * 100;
                    const y = 100 - (v.visitors / maxVisitors) * 100;
                    return `${x} ${y}`;
                  }).join(" L ")}`}
                  fill="none"
                  stroke="url(#purpleGlow)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Fill area below curve */}
                <path
                  d={`M 0 100 L ${data.visitorsOverTime.map((v, i) => {
                    const x = (i / Math.max(data.visitorsOverTime.length - 1, 1)) * 100;
                    const y = 100 - (v.visitors / maxVisitors) * 100;
                    return `${x} ${y}`;
                  }).join(" L ")} L 100 100 Z`}
                  fill="url(#purpleGradientFill)"
                  opacity="0.15"
                />

                {/* Definitions */}
                <defs>
                  <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="purpleGradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Hover Node points */}
              <div className="absolute inset-x-0 bottom-1 flex justify-between px-4">
                {data.visitorsOverTime.map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-purple-300 font-semibold">{v.visitors}</span>
                    <span className="text-[9px] font-mono text-gray-500 mt-1">{v.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most viewed projects (4 columns) */}
          <div className="md:col-span-4 p-6 rounded-xl border border-purple-500/15 bg-[#09031c] space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <span className="text-xs font-mono text-purple-300 uppercase tracking-widest font-bold">PROJECT INTEREST</span>
              <BarChart2 className="w-4 h-4 text-purple-400" />
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {data.mostViewedProjects.map((proj, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-gray-200 truncate max-w-[150px]" title={proj.projectTitle}>
                      {proj.projectTitle}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{proj.views} views</span>
                  </div>
                  
                  {/* custom percentage bar */}
                  <div className="w-full h-2 rounded bg-purple-950/40 overflow-hidden border border-purple-500/5">
                    <div className="h-full bg-cyan-400" style={{ width: `${Math.min(proj.views, 100)}%` }} />
                  </div>
                </div>
              ))}

              {data.mostViewedProjects.length === 0 && (
                <div className="text-xs text-gray-500 font-mono text-center py-10">No clicks recorded yet. Try custom clicks.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
