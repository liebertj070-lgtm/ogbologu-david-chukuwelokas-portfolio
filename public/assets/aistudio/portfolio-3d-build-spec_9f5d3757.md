# BUILD SPEC + PROMPT: Hyper-Realistic 3D Portfolio (Google AI Studio)

> **How to use this file:** Paste **PART 1 (Master Prompt)** into Google AI Studio's Build mode as your first message. Then paste **PART 4 (Phase Prompts)** one at a time as you go. Attach images from **PART 3 (Image Slots)** when a phase asks for them. PART 2 is the content source of truth the AI must pull from.

---

# PART 1: MASTER PROMPT

You are a senior creative developer and 3D web designer. Build my personal portfolio as a **hyper-realistic, cinematic 3D website** with bold movement, deep interactivity and polished animation. It must feel like an award-winning (Awwwards-level) experience, while still working as a real portfolio that recruiters can scan and clients can contact me from.

**Rules of engagement**
- Use the content in PART 2 as the only source of truth. Never invent projects, metrics, clients, testimonials or job titles. Where something is marked **[PLACEHOLDER]** or **[IMAGE SLOT]**, build a clean, obvious, easy-to-swap slot.
- Work in the phases listed in PART 4. After each phase: say what you built, list every decision you made on your own and why, and list exactly what you need from me (images, links, files).
- When something is ambiguous, take initiative, pick the stronger option, build it, and explain your reasoning afterward. Do not stop to ask me upfront.
- Do not leave dead links, lorem ipsum, or broken layouts. Everything on screen must be real content or a clearly labelled placeholder.

## The concept: "THE DOCKYARD STUDIO"

I work at a naval dockyard and I design, build and film. So the whole site is **one continuous cinematic 3D space**: a vast, dark, moody dockyard hangar that doubles as a creative studio. Wet concrete floor with reflections, steel beams, cranes and gantry lights overhead, volumetric light shafts through the roof, floating dust particles, soft fog. The visitor **flies through this space as they scroll**, passing through three zones, each one a pillar of what I do:

1. **DESIGN zone:** floating glass UI screens and wireframe frames, a Figma-style cursor drifting among them.
2. **BUILD zone:** glowing code monoliths and a live-looking terminal wall, device mockups (laptop + phone) rendering the real Kelvjessia site.
3. **CREATE zone:** a cinema camera on a rig, a rotating film reel, a wall of video monitors, light panels and a clapperboard.

**Palette:** near-black graphite and wet-steel greys, one hot accent (**signal orange #FF6A1A**) used for lights, cursor, CTAs and highlights, and a cool cyan (#4DE1FF) as a secondary rim light. White text with high contrast.
**Typography:** Display: **Syne** (800 weight, large, tight). Body: **Inter**. Labels/UI: **JetBrains Mono**. All from Google Fonts.

## Experience flow (scroll-driven camera path)

0. **Loader:** full-screen cinematic preloader with a real progress counter (0 to 100) and my initials "ODC" forming from particles or light, then a smooth camera push into the hangar. Never show an unstyled flash.
1. **Hero:** a giant 3D "JOHAN" (or "OGBOLOGU DAVID") in polished chrome/brushed steel, lit by orange and cyan lights, standing in the hangar. Letters react to the mouse (subtle magnetic tilt, light sweeping across the metal). Subtitle line cycles through: *UI/UX Designer / Front-end Builder / Video Editor / AI Content Creator*. Two CTAs: "Enter the Studio" (scrolls on) and "Contact me". Small "Scroll" indicator.
2. **About:** camera drifts to a lit workbench area. Short bio appears as floating text panels. Include a **[IMAGE SLOT: portrait]** as a hologram-like framed photo with a soft parallax tilt.
3. **Zone 1, DESIGN:** camera glides among floating glass frames. The **Food Delivery App** and **Kelvjessia** designs are shown as tilting glass screens. Hover = panel lifts and glows, click = camera flies into the panel and opens the full case study as an overlay.
4. **Zone 2, BUILD:** monoliths with scrolling code, a laptop and phone mockup showing Kelvjessia live (iframe of https://kelvjessia2.vercel.app/ if the browser allows it, otherwise a screenshot **[IMAGE SLOT]**). Skills appear as glowing chips orbiting or docking onto the monoliths, grouped as in PART 2.
5. **Zone 3, CREATE:** camera moves past a cinema rig into a wall of monitors. Each monitor is a project card (Naval Dockyard documentary, AI influencer videos, children's AI video, One Fact One World, graphics gallery). Hover plays a muted preview or loop **[IMAGE/VIDEO SLOT]**; click opens a lightbox/overlay.
6. **Experience:** a physical timeline: a lit rail along the floor with two glowing nodes (Naval Dockyard Limited, AI Content Creation), each unfolding into a card when the camera arrives.
7. **CV + Contact finale:** camera rises to a "control room" window overlooking the dockyard at golden hour. Two big 3D buttons: **Download UI/UX CV** and **Download Video & Content CV**. Contact block with email, phone and a working contact form (mailto fallback). End with a footer and a "Back to start" button that flies the camera back.

## Realism requirements (this is what makes it "hyper-realistic")

- **Renderer:** Three.js via **React Three Fiber + @react-three/drei + @react-three/postprocessing**. ACES Filmic tone mapping, sRGB output, physically correct lights.
- **Materials:** `MeshPhysicalMaterial` everywhere it matters: brushed steel (roughness map feel, anisotropy), wet concrete (low roughness, clearcoat for puddle-like reflections), real glass with transmission + thickness + IOR for the screens, emissive materials for lights and monitors.
- **Lighting:** an HDRI environment (drei `Environment`), one or two key lights with soft shadows, orange + cyan rim lights, **volumetric light shafts / god rays**, animated spotlights sweeping the floor, subtle fog.
- **Post-processing:** Bloom (strong on emissives), Depth of Field that focuses on whatever the camera is looking at, subtle Chromatic Aberration, Film Grain/Noise, Vignette, SMAA anti-aliasing, optional SSAO/N8AO for contact shading.
- **Reflections:** `MeshReflectorMaterial` (drei) or equivalent on the floor so objects reflect convincingly.
- **Atmosphere:** floating dust/spark particles that drift and react to light; occasional sparks from a welding point in the distance; subtle camera sway/breathing so nothing ever feels frozen.
- **Assets:** if you cannot load external GLB models reliably, **build the objects procedurally from primitives, extrusions and lathe geometry** (beams, cranes, monitors, camera rig, film reel, monoliths) and make them look good through materials and lighting. If you do use external models, use only CORS-safe CDN-hosted ones with a procedural fallback.

## Movement and interactivity (go big, but keep it controlled)

- **Scroll-driven camera path** (drei `ScrollControls` or GSAP ScrollTrigger + Lenis for smooth inertia). Camera eases, banks slightly on turns, and uses subtle FOV changes for speed.
- **Mouse parallax** on the whole scene (camera drifts a few degrees toward the cursor).
- **Custom cursor:** a small orange dot + trailing ring that grows over interactive objects, with a label ("View", "Play", "Open"). Magnetic effect on buttons.
- **Hover physics:** project panels tilt toward the cursor in 3D, lift, glow, and cast shifting reflections.
- **Click-to-fly:** clicking a project flies the camera to it, dims everything else with DOF, and opens an overlay with the case-study content. A clear "Close" returns the camera to its exact scroll position.
- **Text animation:** headlines reveal with split-letter or mask animations; numbers count up; body text fades in per line.
- **Micro-interactions:** buttons depress in 3D, skill chips jiggle and snap into place, monitors flicker on when approached, light panels brighten as the camera nears.
- **Optional sound design** (OFF by default, with a clear toggle): low ambient hangar hum, soft UI ticks. Never autoplay audio.
- **One easter egg:** pressing a key (e.g. "C") or clicking the clapperboard triggers a short cinematic "action!" flash with a camera-flash effect.
- **Keyboard + accessibility:** arrow keys / page up / page down move between sections, Tab reaches every interactive element, visible focus states.

## Performance and fallbacks (non-negotiable)

- Cap device pixel ratio at 2 (1.5 on mobile). Use `AdaptiveDpr`/performance regression so quality drops gracefully instead of stuttering.
- **Quality tiers:** High (desktop GPU), Medium, Low (mobile). On Low: fewer particles, no volumetric shafts, simpler post-processing, shorter shadows. Detect tier automatically and allow a manual "Quality: Auto / High / Low" toggle in a small settings menu.
- Lazy-load heavy assets per zone. Show the loader until the first zone is truly ready.
- **`prefers-reduced-motion`:** switch to a calm mode: no camera flight, no parallax or particles, simple fades only.
- **No WebGL / very low-end device:** show a polished **2D fallback version** of the full portfolio (same content, clean responsive layout) so recruiters never see a blank page.
- **Real HTML content** must exist in the DOM (headings, paragraphs, links) layered over or alongside the canvas for SEO, screen readers and text selection. Do not render all text only inside WebGL.
- Target a stable 60fps on a mid-range laptop and 30+ on a mid-range phone.

## Technical stack (Google AI Studio compatible)

- **React + Vite + TypeScript**, single-page app (no Next.js/SSR, no backend).
- **three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, GSAP (+ScrollTrigger) or Framer Motion, Lenis.** Tailwind CSS for the 2D/UI layer.
- All content in one typed file: `src/data/content.ts`, so I can edit text, projects and links without touching components.
- Reusable components: Loader, SceneRoot, CameraRig, Hangar, DesignZone, BuildZone, CreateZone, ProjectPanel, CaseStudyOverlay, SkillChip, TimelineNode, Cursor, QualityMenu, Fallback2D, ContactForm.
- Clean folder structure and short comments explaining non-obvious decisions.
- Responsive: desktop-first for the 3D experience, with a thoughtfully adapted mobile layout (touch drag/scroll controls, simpler scene, larger tap targets). Test mentally at 360px, 768px, 1280px, 1920px.
- SEO and meta: title, description, Open Graph tags, favicon (an orange "O" or "ODC" mark).
- Contact form: submits via a free form service **[PLACEHOLDER: I will supply the endpoint]**, with a mailto fallback to liebertj070@gmail.com.

## Things to avoid

Generic template look, stock photos, lorem ipsum, giant unoptimised textures, autoplaying sound, jittery or nauseating camera motion, text that is hard to read over the 3D scene (always add a subtle backing panel or gradient behind text), and any content that only exists inside the canvas.

---

# PART 2: CONTENT (SOURCE OF TRUTH)

## Who I am

- **Name:** Ogbologu David Chuwueloka (I go by **Johan**)
- **Based in:** Lagos, Nigeria
- **Phone:** 07077348537
- **Email:** liebertj070@gmail.com
- **Roles I want to be found for:** UI/UX Designer, Design-to-Code Builder, Video Editor, AI Content Creator, Graphic Designer
- **Education:** B.Sc. Computer Science, Augustine University, Ilara-Epe, Lagos. Currently 300 level, expected graduation 2027. Relevant coursework: UI/UX, Frontend Development, Database Design, Computer Architecture, Computer Security.
- **Secondary school:** SSCE, Maryland Comprehensive Secondary School, Maryland, Lagos (2018 to 2024)

**The one-line pitch:** I design it in Figma, I build it in code, and I tell its story in video.

**Short bio (use as the About-section base, you may tighten it):**
I'm a computer science student and creative technologist in Lagos. I design interfaces in Figma and build what I design: I took a transport booking platform from user flows and desktop and mobile screens all the way to a deployed Next.js website that real people can sign up and log in to. Alongside that, I edit video, make AI-assisted content, and design posters and flyers. I'm currently an intern at Naval Dockyard Limited, where I produce documentary-style video and branded event materials.

---

## Experience (exact content)

**Intern, Naval Dockyard Limited, Lagos, Nigeria** | 31 July 2026 to present
- Produced and edited a documentary-style video covering personnel, workshops, engineering activities and the working environment at the Dockyard.
- Planned the visual flow, selected footage and structured clips into a coherent story, editing in CapCut and DaVinci Resolve (timing, transitions, text, effects).
- Designed branded posters, flyers and promotional materials for events in Canva and Adobe Photoshop.
- Applied supervisor feedback across iterations to improve structure, presentation and clarity.

**AI Content Creation, Self-directed**
- Develop concepts and detailed prompts for AI-generated video, specifying characters, environments, camera perspective, movement, atmosphere and lighting.
- Combine AI-generated visuals, AI voiceovers (ElevenLabs, AI33Pro) and conventional editing (DaVinci Resolve: sequencing, timing, captions, transitions, pacing) into finished cinematic and social-media-style content.
- Made AI-assisted video projects using ChatGPT for concepts and visual assets, then Veo and YouTube AI tools for video.
- Content types produced: AI influencer videos (a matcha lifestyle video, a wig-selling video), and a children's entertainment video of a baby playing with toys.
- Run a cultural facts series called **"One Fact, One World"** (YouTube/TikTok). **[PLACEHOLDER: add channel links and thumbnails]**

---

## Projects (exact content)

### A. Kelvjessia, Transport Booking Website (FLAGSHIP, UI/UX Design + Frontend Build)
**Stack:** Figma, Next.js, Tailwind, Supabase
**Links:**
- Live site: https://kelvjessia2.vercel.app/
- Figma design file: https://www.figma.com/design/kLmUqdMDjB4tSUPsYL5byr/Kelvjessia-%E2%80%94-Transport-Website-UI-UX
- Desktop prototype: https://www.figma.com/proto/kLmUqdMDjB4tSUPsYL5byr/Kelvjessia-%E2%80%94-Transport-Website-UI-UX?page-id=1%3A2&node-id=4-2&p=f&viewport=237%2C67%2C0.08&t=iI88o8FVjWRFLidf-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=4%3A2
- Mobile prototype: https://www.figma.com/proto/kLmUqdMDjB4tSUPsYL5byr/Kelvjessia-%E2%80%94-Transport-Website-UI-UX?page-id=1%3A3&node-id=12-2&p=f&viewport=87%2C293%2C0.21&t=LYgcsGt7Vkeui4pn-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=12%3A2

(Use the exact URLs above without editing them.)

**Summary:** A booking platform for seats and parcels between Ilara-Epe and eight Lagos destinations.
**Highlights:**
- Designed desktop and mobile screens in Figma for booking seats and sending parcels, with clickable prototypes for both.
- Mapped the full user journey (sign up, route selection, seat selection, payment, live tracking, trip history, admin and dispatcher views) and documented it in a sitemap, user flows and a build spec.
- Simplified the experience through design decisions: removed guest checkout and student-ID requirements, and unified the seat map across desktop and mobile with clear Available / Selected / Taken states.
- Built and deployed it as a working website with email authentication, Paystack payments (test mode), Mapbox route tracking, optional live location sharing, and database-level seat locking to prevent double bookings.

**Case-study page structure:** Problem, Users, Journey/flows, Design decisions, Screens (desktop + mobile), Build and tech, What I'd do next. **[PLACEHOLDER: screenshots, I will supply]**

### B. Food Delivery App, UI/UX Design
**Stack:** Figma
**Links:**
- Design file: https://www.figma.com/design/bv5T7tVttqZllaVkTSywVR/Untitled?node-id=0-1&t=zAqh0lV5qCV67Jmv-1
- Interactive prototype: https://www.figma.com/proto/bv5T7tVttqZllaVkTSywVR/Untitled?page-id=0%3A1&node-id=2-2&p=f&viewport=674%2C171%2C0.36&t=1FjrqBbcY6PPL0JG-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=2%3A2

**Highlights:**
- Researched Glovo, Chowdeck and DoorDash to compare restaurant discovery, menu browsing, cart and checkout, and used the findings to shape the design.
- Mapped the ordering journey (Home/Search, Restaurant, Menu, Food Details, Cart, Checkout, Confirmation) and designed the screens with a clickable prototype of the core ordering flow.
- Prioritised clear calls to action, simple navigation, transparent pricing and consistent components over decoration.

### C. JUTIMA, Retail Store Management System (University project)
**Stack:** MySQL, Node.js/Express, HTML/CSS/JS
Database design project with a minimal frontend. Produced lo-fi wireframes ahead of a supervisor demo, then built the full-stack system. Show as a smaller card, no full case study.

### D. Video and AI content (grid cards)
- Naval Dockyard documentary-style video **[PLACEHOLDER: embed/link, check with my supervisor before making it public]**
- AI influencer videos (matcha, wigs) **[PLACEHOLDER: links]**
- Children's AI entertainment video **[PLACEHOLDER: link]**
- "One Fact, One World" series **[PLACEHOLDER: links]**
- Posters, flyers and branded promo materials: Graphic Design Portfolio folder: https://drive.google.com/drive/folders/1shUa_fQ1Mb3TxiI0WmvBqsdi-2w3CeBX (link out, and leave a gallery slot for images I'll add)

---

## Skills (group exactly like this)

- **UI/UX:** Figma, Wireframing, Interactive Prototyping, User Flows, Information Architecture, Competitor Analysis, Visual Hierarchy, Responsive Design (Desktop and Mobile), Design-to-Code Implementation
- **Frontend and Data:** HTML/CSS, Next.js, Tailwind CSS, Supabase, MySQL, Python, Git/GitHub
- **Video and Motion:** CapCut, DaVinci Resolve, Video Editing, Transitions and Effects, Pacing, Text Animation
- **AI and Content:** AI Video Generation, Prompt Engineering, Generative AI, Visual Storytelling, AI-Assisted Scripting
- **Graphic Design:** Canva, Adobe Photoshop, Posters, Flyers, Branded Promotional Materials

Show these as clean grouped lists or chips, not percentage bars.

---

---

# PART 3: IMAGE SLOTS (what I will send you, and when)

I will attach images in the chat when a phase asks for them. Name each slot exactly like this so assets map cleanly. If an image isn't supplied yet, use a tasteful placeholder (a labelled, lit empty frame), never a stock photo.

| Slot ID | What it is | Used where |
|---|---|---|
| IMG-01 | Portrait / profile photo of me | About section, hologram frame; also favicon crop |
| IMG-02 to IMG-06 | Kelvjessia screenshots (landing, seat selection, payment, tracking, admin) | Design zone glass panels, Build zone laptop/phone, case study |
| IMG-07 to IMG-10 | Food Delivery App screens (home, menu, cart, checkout) | Design zone panels, case study |
| IMG-11 | Naval Dockyard documentary thumbnail or still | Create zone monitor |
| IMG-12 to IMG-14 | AI videos thumbnails (matcha influencer, wig-selling, children's video) | Create zone monitors |
| IMG-15 | "One Fact, One World" logo / thumbnail | Create zone monitor |
| IMG-16 to IMG-21 | Posters / flyers / branded materials | Graphics gallery |
| IMG-22 | Any texture or reference photo of the real Dockyard (optional, only if allowed) | Environment inspiration / floor texture |
| IMG-23 | Reference screenshots of 3D sites I like (optional) | Style matching |

When I attach an image and say its slot ID, wire it into that slot immediately and show me where it landed.

---

# PART 4: PHASE PROMPTS (paste one at a time)

**PHASE 1 (Foundation + hangar):**
"Start Phase 1. Set up the React + Vite + TypeScript project with R3F, drei, postprocessing, GSAP, Lenis and Tailwind. Create `content.ts` from PART 2. Build the loader and the hyper-realistic hangar environment (reflective wet floor, steel beams, cranes, HDRI, volumetric light shafts, fog, dust particles) with the full post-processing stack and the quality-tier system. Add the custom cursor. Show an empty hangar I can already fly the camera through with scroll. Report what you decided and why."

**PHASE 2 (Hero + About):**
"Phase 2. Build the 3D chrome name hero with mouse-reactive lighting and cycling role line, the CTAs, and the About section with the portrait hologram frame (use IMG-01 if attached, otherwise a placeholder). Add the split-text reveal animations."

**PHASE 3 (Design zone):**
"Phase 3. Build the DESIGN zone: glass screens for Kelvjessia and the Food Delivery App with hover tilt/lift/glow, click-to-fly, and the CaseStudyOverlay with the full case-study structure and links from PART 2. Use my attached screenshots in the right slots."

**PHASE 4 (Build zone):**
"Phase 4. Build the BUILD zone: code monoliths, terminal wall, laptop and phone mockups showing Kelvjessia (iframe or screenshots), and the skill chips docking animation grouped exactly as in PART 2. Add JUTIMA as a smaller card."

**PHASE 5 (Create zone):**
"Phase 5. Build the CREATE zone: cinema rig, film reel, monitor wall with project cards, hover previews, lightbox, graphics gallery linking to my folder, and the clapperboard easter egg."

**PHASE 6 (Experience + CV + Contact):**
"Phase 6. Build the floor-rail experience timeline, the control-room finale with both CV download buttons (files at /public/cv/), the contact form with mailto fallback, footer and 'Back to start' flight."

**PHASE 7 (Polish + resilience):**
"Phase 7. Add the 2D fallback version, reduced-motion mode, keyboard navigation, mobile layout and touch controls, SEO/OG tags, optional sound toggle (off by default), and run a performance pass. List anything still heavy and how you reduced it. Then give me deployment steps."

**FIX / TWEAK PROMPT (reuse any time):**
"Keep everything else exactly as it is. Only change: [what]. Explain what you changed and why. If the change risks performance, tell me first how you'll keep 60fps."
