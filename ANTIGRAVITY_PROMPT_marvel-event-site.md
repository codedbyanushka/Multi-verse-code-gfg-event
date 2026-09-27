# 🦸 PROMPT FOR ANTIGRAVITY — Marvel-Themed Event Website
### GeeksForGeeks Student Chapter, Bennett University — Junior Core Round 1

Paste this whole file into Antigravity's Manager view as the initial task brief.
Wherever it says `<YOU>`, fill in the blank before pasting.

---

## 0. NON-NEGOTIABLE GROUND RULES (read first, obey always)

1. **No generic template energy.** No "Bootstrap hero + 3 feature cards + footer" layout. Every section must have a distinct visual idea. If a section looks like it came from a website builder, redo it.
2. **Multi-page, not a single scroller.** Minimum: `Home`, `Heroes/Roster` (with each Avenger getting a full cinematic section — see rule 3), `Event/Schedule`, `Register`. Navigation between them must be smooth (animated transitions, not a hard reload) — see Phase 3.
3. **One full-bleed cinematic hero-style section per Avenger**, scroll-stitched together on the Heroes page like chapters of a trailer — not a grid of small cards. Each section: full-viewport character art, the hero's name in bold display type, a short *original* story blurb (see rule 9), and a signature accent color for that character, while the overall type system, spacing, and motion language stay identical across all of them so it reads as one cohesive experience, not six different websites glued together. Transition between each hero with a GSAP scroll-triggered effect (crossfade, wipe, or scale — pick one and use it consistently).
4. **Supabase is ONLY for Google login/auth.** Do not add a database-backed AI assistant, chatbot, comments system, live chat, admin dashboard, analytics dashboard, or any other "extra feature" nobody asked for. If you're tempted to add something beyond auth + storing a registration row, stop and ask instead of building it.
5. **Only use the images I provide** for real Marvel visuals (see Phase 1). Do not fetch Marvel logos, character renders, or movie stills from the internet — only my local `assets/marvel-raw/` folder. Everything else (backgrounds, glows, particles, UI chrome) should be built with code (CSS/SVG/Canvas), not scraped images.
6. **Every image must render perfectly at every breakpoint** — no stretching, no squashing, no cropped-out faces/logos. Build the responsive image pipeline in Phase 1 before you touch layout, and use `object-fit`, `aspect-ratio`, and `<picture>`/`srcset` everywhere. This is graded — treat it as a hard requirement, not a nice-to-have.
7. **Work in phases, and use parallel agents where the work doesn't depend on itself** (Manager view → spin up separate agent runs for independent phases, e.g. "image pipeline" + "design research" can run at the same time; "auth" can run parallel to "content sections"). Merge and test at the end of each phase before moving on.
8. **Use Skills. Don't reinvent GSAP/Tailwind/Supabase patterns from scratch** — see Phase 0.5.
9. **Character stories must be written in your own words, never copy-pasted.** When researching each Avenger online (Phase 2.5), read a couple of sources for facts (real name, origin, key trait, one signature moment), then write a short 2–4 sentence blurb yourself. Never paste verbatim text from Wikipedia, the Marvel wiki, or anywhere else — that's someone else's copyrighted writing, and copy-pasted text is also an easy way to get flagged for plagiarism in judging. Facts are fine to use; the sentences must be your own.

---

## 1. Project Concept

- **Theme: The Avengers Roster.** Not one character — the whole team, but presented as a cinematic "character select / trailer reel" experience rather than a flat directory. Pick your roster now: `<YOU: e.g. Iron Man, Captain America, Thor, Hulk, Black Widow, Hawkeye, Spider-Man, Doctor Strange — 5 to 8 max. More than 8 dilutes the polish; each one needs a fully realized section, not a shrunken afterthought.>`
- **Unifying visual system:** one shared dark cinematic base (deep charcoal/black) so each hero's accent color pops against it, one shared type system (see Typography below), and one shared motion pattern for entering/leaving each hero section. This is what stops "all the Avengers" from feeling like a generic mashup — the *frame* is consistent even though each *hero* has a distinct accent color pulled from their own identity (Iron Man red/gold, Hulk green, Cap blue/red/white, Thor navy/silver, Widow black/red, etc.).
- **Event name:** `<YOU>`
- **Event date/time/venue:** `<YOU>`
- **Tagline:** `<YOU, or let the agent draft 3 options in Phase 2>`
- **Typography:** one bold condensed/display font for headlines (comic/sci-fi feel), one clean grotesk for body text. Pull from Google Fonts. Same two fonts used for every hero section — only the accent color changes.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Needed for Supabase auth callbacks, multi-page routing with shared layout/nav, and `next/image` for responsive image optimization out of the box |
| Styling | **Tailwind CSS** | Fast, consistent spacing/typography scale, easy responsive utilities |
| Animation | **GSAP + ScrollTrigger**, plus **Lenis** for buttery smooth scrolling | Industry-standard for cinematic scroll-driven sites; Lenis fixes the "janky native scroll" feel |
| Auth | **Supabase Auth — Google OAuth provider only** | Nothing else from Supabase. No Supabase database tables beyond a minimal `registrations` table if a registration form is wired up |
| Image pipeline | **Sharp (Node)** for local resizing/format conversion + `next/image` for runtime responsive delivery | See Phase 1 |
| Hosting | **Vercel** (native Next.js support, instant deploys, free tier) | One-click deploy, works perfectly with Next.js + Supabase env vars |
| Icons | **Lucide / Font Awesome** | For UI chrome (menu, arrows, socials) — never for "Marvel" content |

If Antigravity strongly prefers a different but equivalent stack (e.g. Vite + React Router instead of Next.js), it may switch **only if** it can still satisfy: file-based or clean routing across 3 pages, image optimization pipeline, and Supabase Google auth. Otherwise stick to the table above.

---

## 3. Image Assets — Folder, Pipeline, and "Don't Let It Stretch" Fix

### Folder structure (create these exactly)

```
/assets/marvel-raw/ironman/     ← one subfolder per Avenger, exact lowercase hero-slug names
/assets/marvel-raw/captain-america/
/assets/marvel-raw/thor/
/assets/marvel-raw/hulk/
/assets/marvel-raw/black-widow/
/assets/marvel-raw/... (one per hero in your roster)
/public/images/optimized/      ← generated by the script below, DO NOT hand-edit
/public/images/optimized/{hero}/{name}-320.webp
/public/images/optimized/{hero}/{name}-640.webp
/public/images/optimized/{hero}/{name}-1024.webp
/public/images/optimized/{hero}/{name}-1600.webp
/public/images/optimized/{hero}/{name}-original.webp
```

I will create `/assets/marvel-raw/<hero-slug>/` for each Avenger and paste that character's downloaded images into their own subfolder before you run the pipeline. The script should process subfolders recursively and keep the hero grouping in `manifest.json` so the frontend can pull "all images for Iron Man" as one set.

### Step 1 — Build a resize/optimize script

Write a Node script (`scripts/optimize-images.mjs`) using **sharp** that, for every image in `assets/marvel-raw/`:
- generates WebP (and AVIF if easy) versions at widths **320 / 640 / 1024 / 1600** plus the original width capped at 2400px,
- preserves aspect ratio (never force-stretch a source image to a fixed box),
- strips EXIF/metadata to cut file size,
- outputs a `manifest.json` mapping each source filename → its generated variants + **natural aspect ratio** (width/height), so the frontend knows the correct `aspect-ratio` to reserve before the image loads (prevents layout shift).
- Add an npm script: `"optimize-images": "node scripts/optimize-images.mjs"`.

### Step 2 — Use responsive image markup everywhere, never a fixed `<img width height>` on a hero

For every image on the site:
```tsx
<Image
  src={variant.src}
  alt="..."
  fill                       // when the container defines the box
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover', objectPosition: 'center' }} // or 'contain' for full-character art that must not crop
/>
```
Rules to actually stop the stretching problem:
- **Never** set both a fixed CSS `width` and `height` on an image without `object-fit`. That's what causes distortion.
- Use `object-fit: cover` for background/atmosphere images (cropping is fine), and `object-fit: contain` for hero character art where cropping would cut off a face, logo, or important detail — pair `contain` with a background color/gradient that matches the theme so letterboxing looks intentional, not broken.
- Use the `manifest.json` aspect ratios to set a CSS `aspect-ratio` on the container so there's zero layout shift.
- Art-direct crops per breakpoint where it matters (e.g. a wide character pose needs a tighter vertical crop on mobile) using Tailwind's responsive `object-position` classes, or `<picture>` with different source images per breakpoint if a single crop genuinely can't work at both a 21:9 desktop hero and a 9:16 mobile hero.
- Test at 320px, 375px, 768px, 1024px, 1440px, 1920px widths. If anything looks stretched or cropped wrong at any of these, fix the `object-fit`/`object-position`/`sizes` for that image specifically — don't apply a blanket fix.

### Step 3 — Mobile-specific optimization
- Serve the 320/640 variants on mobile via `sizes` — don't ship a 2400px image to a phone.
- Reduce or disable the heaviest GSAP/particle effects on mobile via `matchMedia` (see Phase 4) — mobile GPUs choke on effects that are fine on desktop.
- Lazy-load every image below the fold (`loading="lazy"`, native with `next/image` by default except priority hero images).

---

## 4. Phased Build Plan

Run phases 1 and "Design Research" in parallel where marked. Verify/test at the end of every phase before moving to the next — don't let errors compound.

### Phase 0 — Setup (sequential, ~15 min)
- Scaffold Next.js + TypeScript + Tailwind project.
- Set up folder structure from Section 3.
- Set up Supabase project + `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (I will provide these, or you scaffold the client and I fill in keys after).

### Phase 0.5 — Install Skills & Do Design Research (parallel with Phase 1)
Give Antigravity this sub-prompt directly:

> "Before writing any UI code, do the following:
> 1. Search for and install/reference relevant Antigravity Skills for: GSAP + ScrollTrigger scroll-driven websites, Tailwind CSS component patterns, and modern frontend 'taste' / visual design systems. Known real-world skill sources to look for: the `gsap-framer-scroll-animation` skill pattern (covers ScrollTrigger.batch, scrub animations, pinned timelines, parallax layers, horizontal scroll, Lenis smooth scroll, `matchMedia` responsive setup, accessibility, and performance/cleanup — recreate this knowledge as a local skill if you can't fetch it directly), plus any general 'frontend design taste' or 'UI polish' skill available in your skills marketplace.
> 2. Separately, research (via your built-in browser) 3–5 real award-winning cinematic/interactive websites (Awwwards, Godly, Land-book) for scroll-driven layout ideas, and 3–5 examples of Marvel/superhero fan or promo sites for visual-language ideas (typography, color, motion — not to copy assets from).
> 3. Summarize findings as a short internal design brief (color usage, motion patterns, layout ideas, typography pairing) before writing code, and follow it consistently across every page so the site doesn't feel stitched together from different ideas."

Do this as its own parallel agent run so it doesn't block the image pipeline work.

### Phase 1 — Image Pipeline (parallel with Phase 0.5)
- Build `scripts/optimize-images.mjs` (Section 3).
- Run it against a couple of placeholder/sample images to confirm it works before I've even pasted the real Marvel images in, so the pipeline is proven before it matters.
- Output `manifest.json`.

### Phase 2 — Home Page: Hero + Navigation
- Build the primary cinematic hero (full viewport, animated headline entrance via GSAP, atmospheric optimized image or CSS/SVG effect behind it, clear CTA to "Meet the Avengers" / Heroes page and to Register).
- Build a smooth, sticky/transparent-to-solid-on-scroll nav bar with animated underline/active states, and page-transition animation between routes (Next.js `layout.tsx` + a transition wrapper, e.g. fade+slide on route change).

### Phase 2.5 — Hero Story Research (can run parallel with Phase 2)
For each Avenger in the roster: research via the built-in browser (real name, origin, one defining trait, one signature moment/quote-worthy trait), then write an **original** 2–4 sentence blurb per Ground Rule 9 — never copy-pasted. Also pick that hero's accent color (see Section 1). Output all of this as a small local data file (e.g. `data/heroes.ts`) so the Roster page just maps over it — don't hardcode each section by hand.

### Phase 3 — Heroes/Roster Page + Content Pages
- **Heroes page**: one full-bleed cinematic section per Avenger from `data/heroes.ts` (Ground Rule 3) — character art, name, blurb, accent color — scroll-stitched with a consistent GSAP transition between each. This is the centerpiece of the site; give it the most polish.
- **Event/Schedule page**: event info cards, highlights/tracks, a vertical or horizontal scroll-driven timeline (this is where GSAP ScrollTrigger pinning/parallax should shine).
- **Register page**: styled form (name, email, college/section, etc.) — on submit, write a row to a minimal Supabase table (only if I've asked for that; otherwise it can `mailto:` or link to a Google Form).
- Reuse one consistent card/section component system across pages — don't invent a new visual language per page.

### Phase 4 — Interactions & Motion Polish
- Scroll-reveal batching (`ScrollTrigger.batch`) for cards/sections.
- 2–3 signature interactions max, well executed: e.g. magnetic/tilt hover on cards, custom cursor, animated countdown to event day, or a subtle particle/glow field that reacts to scroll or mouse.
- Wrap heavier effects in `gsap.matchMedia()` so mobile gets a lighter version instead of a broken/laggy one.

### Phase 5 — Auth (Supabase, parallel with Phase 3/4)
- "Sign in with Google" button via Supabase Auth only.
- Store nothing beyond what's needed to identify a registrant. No AI assistant, no extra Supabase features — re-read Ground Rule #4 if tempted.

### Phase 6 — Responsiveness + QA Pass
- Test every page at 320 / 375 / 768 / 1024 / 1440 / 1920px.
- Confirm no image stretching/cropping issues (Section 3, Step 2).
- Confirm nav/page transitions work on mobile (touch scroll, no jank).
- Lighthouse check: aim for reasonable performance/accessibility scores — don't ship a site that scores red across the board because of unoptimized images or blocking scripts.

### Phase 7 — Deploy + Handoff
- Push to GitHub with a clear README (concept, tech stack, how to run locally, env vars needed).
- Deploy to Vercel, confirm the live link works end-to-end including Google login.
- Write the 3–4 sentence concept explanation needed for submission.

---

## 5. Definition of "Done" (use this as your own checklist before telling me it's ready)

- [ ] Feels cinematic and specific to each hero, while the overall site still feels like one designed system, not six mismatched ones
- [ ] Every Avenger in the roster gets a full cinematic section with an original (non-copy-pasted) story blurb + smooth animated nav across all pages
- [ ] Every image is sharp, correctly cropped/contained, and never stretched at any breakpoint
- [ ] Mobile experience is lighter/optimized, not just a squeezed desktop layout
- [ ] Google login works via Supabase and nothing else Supabase-related was added
- [ ] 2–3 interactions are deeply polished rather than many things half-done
- [ ] Live Vercel link + GitHub repo + README are all ready
