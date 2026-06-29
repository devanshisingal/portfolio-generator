/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Laptop, Compass, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface GalaxyBackgroundProps {
  onEnter: () => void;
}

export default function GalaxyBackground({ onEnter }: GalaxyBackgroundProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505] text-white select-none flex flex-col justify-between p-8 font-sans">
      {/* Immersive Space Stars and Nebula */}
      <div className="absolute inset-0 bg-radial-at-t from-[#0d0d0d] via-[#050505] to-[#000000] z-0" />
      
      {/* Nebula glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />

      {/* Shooting Stars (Meteors) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-12 left-1/4 w-0.5 h-16 bg-gradient-to-b from-white to-transparent rotate-[-45deg] opacity-60 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-24 left-2/3 w-0.5 h-20 bg-gradient-to-b from-white to-transparent rotate-[-45deg] opacity-40 animate-pulse" style={{ animationDuration: '4.5s' }} />
        <div className="absolute top-48 left-10 w-0.5 h-12 bg-gradient-to-b from-white to-transparent rotate-[-45deg] opacity-50 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-10 right-12 w-0.5 h-14 bg-gradient-to-b from-white to-transparent rotate-[-45deg] opacity-70 animate-pulse" style={{ animationDuration: '3.8s' }} />
      </div>

      {/* Header Container (Replicating exact layout and bordered look in attached image) */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center mt-6 z-10">
        <div className="w-full flex items-center justify-between border-t border-b border-white/10 py-2 px-4 bg-white/[0.02] backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs tracking-[0.3em] text-cyan-400 font-mono">A MESSAGE FROM EARTH</span>
          </div>
          <div className="text-xs tracking-[0.3em] text-cyan-400 font-mono">EST. 2026</div>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-center tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 uppercase mt-4 mb-2 drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] font-mono">
          HELLO FELLOW GALAXY MEMBER
        </h1>

        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/10 relative mt-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* "I AM JAY" or main dynamic name / title greeting in center */}
      <div className="flex flex-col items-center justify-center flex-1 my-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center"
        >
          <div className="text-cyan-400 tracking-[0.4em] text-sm uppercase mb-3 font-mono">COSMIC PORTFOLIO GENERATOR</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-widest text-white drop-shadow-[0_5px_15px_rgba(255,255,255,0.1)] font-mono">
            I AM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-500">GALAXY AI</span>
          </h2>
        </motion.div>
      </div>

      {/* Earth rising from the bottom with Astronaut sitting on it holding a laptop */}
      <div className="relative w-full flex justify-center z-10 pointer-events-none select-none">
        {/* Massive Planetary Globe at the bottom */}
        <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] rounded-full bg-gradient-to-t from-[#0d0d0d] via-cyan-950 to-cyan-500 overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.2)] flex items-end justify-center translate-y-[55%] border border-cyan-300/20">
          
          {/* Planetary oceans & continents highlights (using layered glow/shapes) */}
          <div className="absolute inset-0 opacity-20 bg-radial-at-c from-cyan-500 via-slate-900 to-transparent scale-[1.2]" />
          <div className="absolute top-10 left-12 w-28 h-20 bg-cyan-500/20 rounded-full filter blur-xl rotate-45" />
          <div className="absolute top-24 right-16 w-36 h-24 bg-blue-500/20 rounded-full filter blur-xl -rotate-12" />
          <div className="absolute bottom-40 left-1/3 w-32 h-20 bg-cyan-500/10 rounded-full filter blur-xl" />
          
          {/* Atmosphere outer glow ring */}
          <div className="absolute inset-0 rounded-full ring-[15px] ring-cyan-200/20 blur-[4px]" />
          <div className="absolute inset-0 rounded-full ring-[40px] ring-blue-500/10 blur-[15px]" />
        </div>

        {/* Astronaut sitting on top of the globe */}
        <div className="absolute -top-[15px] sm:-top-[35px] md:-top-[55px] flex flex-col items-center justify-center">
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >
            {/* Beautiful Astronaut Glowing Figure */}
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center">
              
              {/* Helmet Glow Visor */}
              <div className="absolute w-10 h-8 sm:w-14 sm:h-11 bg-cyan-400/80 rounded-t-full filter blur-[1px] top-1.5 sm:top-2.5 flex items-center justify-center overflow-hidden border border-white/20">
                <div className="w-full h-full bg-gradient-to-tr from-cyan-500 via-cyan-300 to-white opacity-90" />
              </div>
              
              {/* Astronaut suit outline / laptop icon */}
              <div className="absolute bottom-2.5 sm:bottom-4 flex items-center gap-1 text-gray-200">
                <Laptop className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400 filter drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
              </div>
              
              {/* Glowing signal rings radiating */}
              <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-ping opacity-70" />
            </div>

            {/* Astronaut legs dangling helper */}
            <div className="w-2.5 h-8 bg-cyan-400/20 rounded-b-full filter blur-[0.5px] mt-[-5px]" />
          </motion.div>
        </div>

        {/* CLICK TO OPEN triggers custom entrance overlay */}
        <div className="absolute -top-[100px] sm:-top-[150px] md:-top-[200px] pointer-events-auto">
          <motion.button
            onClick={onEnter}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 bg-white text-black font-mono text-sm font-bold tracking-[0.25em] cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center gap-2 group border border-transparent rounded-xl"
          >
            <Compass className="w-5 h-5 text-black group-hover:rotate-45 transition-transform duration-500" />
            CLICK TO OPEN
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
          </motion.button>
        </div>
      </div>

      {/* Decorative corners similar to telemetry layout in image */}
      <div className="absolute top-4 left-4 border-t-2 border-l-2 border-white/10 w-8 h-8 pointer-events-none" />
      <div className="absolute top-4 right-4 border-t-2 border-r-2 border-white/10 w-8 h-8 pointer-events-none" />
      <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-white/10 w-8 h-8 pointer-events-none" />
      <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-white/10 w-8 h-8 pointer-events-none" />
    </div>
  );
}
