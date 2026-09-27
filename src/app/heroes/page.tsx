"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { heroes } from "@/data/heroes";

export default function HeroesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".hero-panel") as HTMLElement[];

      panels.forEach((panel, i) => {
        // Pin each section so the next one scrolls over it (wipe effect)
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true,
          pinSpacing: false,
        });

        // Animate content inside the panel as it enters
        const content = panel.querySelector(".hero-content");
        const image = panel.querySelector(".hero-image");

        gsap.fromTo(
          content,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: panel,
              start: "top center",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          image,
          { opacity: 0, scale: 1.1 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top center",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#050505]">
      {heroes.map((hero, index) => (
        <section
          key={hero.id}
          className="hero-panel relative w-full h-screen overflow-hidden flex items-center shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-10"
          style={{ zIndex: index }}
        >
          {/* Background overlay with the hero's accent color to frame letterboxed contain images */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{ 
              background: `radial-gradient(circle at 75% 50%, ${hero.accentColor}40 0%, transparent 60%)` 
            }}
          />

          {/* Hero Image Container */}
          <div className="absolute inset-0 md:left-1/3 w-full md:w-2/3 h-full hero-image z-0">
            <Image
              src={`/images/optimized/${hero.imageSlug}/${hero.name}-1600.webp`}
              alt={hero.name}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              priority={index === 0}
              className="object-cover md:object-contain object-top md:object-right opacity-60 md:opacity-100"
            />
            {/* Gradient mask to blend the image seamlessly into the left text panel */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full hero-content">
            <div className="md:w-1/2 mt-32 md:mt-0">
              <h3 
                className="font-display text-2xl md:text-3xl uppercase tracking-widest mb-2"
                style={{ color: hero.accentColor }}
              >
                {hero.title}
              </h3>
              <h2 className="font-display text-7xl md:text-9xl uppercase leading-none text-white drop-shadow-xl mb-8">
                {hero.name}
              </h2>
              
              <div className="glass p-6 md:p-8 rounded-sm relative overflow-hidden group">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ backgroundColor: hero.accentColor }}
                />
                <div 
                  className="absolute left-0 top-0 w-1 h-full"
                  style={{ backgroundColor: hero.accentColor }}
                />
                <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                  {hero.blurb}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
