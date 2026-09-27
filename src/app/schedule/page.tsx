"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const scheduleData = [
  { time: "09:00 AM", title: "Registration & Briefing", desc: "Check-in at the main hall and assemble your team.", color: "#E11D48" },
  { time: "10:30 AM", title: "Keynote: The Multiverse of Tech", desc: "Opening ceremony and introduction to the hackathon tracks.", color: "#1D4ED8" },
  { time: "12:00 PM", title: "Hacking Begins", desc: "Dive into the Spider-Verse. Start building your solutions.", color: "#22C55E" },
  { time: "03:00 PM", title: "Mentorship Session 1", desc: "Avengers assemble! Get guidance from industry experts.", color: "#F59E0B" },
  { time: "06:00 PM", title: "Dinner & Networking", desc: "Refuel like a hero. Connect with fellow developers.", color: "#9333EA" },
  { time: "08:00 PM", title: "Midnight Code Sprint", desc: "The endgame approaches. Push your limits.", color: "#00E5FF" },
];

export default function SchedulePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal cards in batches
      ScrollTrigger.batch(".schedule-card", {
        interval: 0.1,
        batchMax: 3,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeave: (batch) => gsap.set(batch, { opacity: 0, y: -50, overwrite: true }),
        onEnterBack: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
        onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
      });

      // Animate the timeline line drawing down
      gsap.fromTo(
        ".timeline-line",
        { height: 0 },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top center",
            end: "bottom center",
            scrub: true,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="font-display text-6xl md:text-8xl uppercase tracking-tighter text-white">
          Event <span className="text-red-500">Schedule</span>
        </h1>
        <p className="font-sans text-xl text-gray-400 mt-4 max-w-2xl mx-auto font-light">
          Your mission timeline. Stay sharp and keep track of critical objectives.
        </p>
      </div>

      <div className="timeline-container relative w-full max-w-4xl mx-auto">
        {/* The central timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 rounded-full -translate-x-1/2 overflow-hidden">
          <div className="timeline-line w-full bg-gradient-to-b from-red-600 via-blue-600 to-purple-600" />
        </div>

        <div className="flex flex-col gap-12">
          {scheduleData.map((item, i) => (
            <div 
              key={i} 
              className={`schedule-card opacity-0 translate-y-12 relative flex flex-col md:flex-row items-start md:items-center ${
                i % 2 === 0 ? "md:flex-row-reverse text-left md:text-right" : "text-left"
              }`}
            >
              {/* Timeline Dot */}
              <div 
                className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-[#050505] -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                style={{ backgroundColor: item.color }}
              />

              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="glass p-6 md:p-8 rounded-sm hover:-translate-y-2 transition-transform duration-300 group border-l-4" style={{ borderLeftColor: item.color }}>
                  <span 
                    className="font-display text-2xl tracking-widest block mb-2"
                    style={{ color: item.color }}
                  >
                    {item.time}
                  </span>
                  <h3 className="font-display text-4xl uppercase text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sans text-gray-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
