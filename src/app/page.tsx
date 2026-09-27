"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic entrance
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.from(ctaRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.8,
      });

      // Subtle parallax on the background
      gsap.to(".hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full relative flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 hero-bg w-full h-[120%] -top-[10%]">
          <Image
            src="/images/optimized/spider-man/Spider Man-1600.webp"
            alt="Spider-Verse Hero Background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-top opacity-40 mix-blend-lighten"
          />
          {/* Gradients to blend into the void */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          <h1 
            ref={titleRef}
            className="font-display text-7xl md:text-9xl uppercase tracking-tighter text-white drop-shadow-2xl"
            style={{ textShadow: "0 0 40px rgba(225, 29, 72, 0.4)" }}
          >
            GeeksForGeeks:<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500">
              Into the Spider-Verse
            </span>
          </h1>
          
          <div ref={ctaRef} className="mt-12 flex flex-col sm:flex-row gap-6 items-center">
            <Link 
              href="/heroes"
              className="group relative px-8 py-4 bg-red-600 text-white font-display text-2xl uppercase tracking-widest overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] rounded-sm"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex items-center gap-2">
                Meet the Roster <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/register"
              className="px-8 py-4 glass text-white font-display text-2xl uppercase tracking-widest transition-all hover:bg-white/10 hover:border-white/30 rounded-sm"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Statement Section (Rule 3) */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center px-6 py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl uppercase text-white/90 mb-8">
            Six Heroes. One Legacy.
          </h2>
          <p className="font-sans text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
            The multiverse is vast, but true power lies in unity. This isn&apos;t just another event—it&apos;s a convergence of Earth&apos;s mightiest minds and bravest souls. Prepare to explore the roster, uncover their stories, and claim your place in the legacy.
          </p>
        </div>
      </section>
    </div>
  );
}
