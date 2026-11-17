import * as THREE from 'three';
import type { QualityMode, ResolvedQuality } from '../types/portfolio';

export function detectSoftwareGl(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function hasWebGLSupport(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function resolveQualityTier(
  mode: QualityMode,
  isSoftwareGl: boolean,
  isMobile: boolean
): ResolvedQuality {
  if (mode !== 'auto') return mode;
  if (isSoftwareGl) return 'low';
  if (isMobile) return 'low';
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  if (cores <= 4) return 'medium';
  return 'high';
}

/** Procedural wet-concrete albedo + puddle roughness maps (zero external textures) */
export function createWetConcreteTextures(maxAnisotropy = 4) {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  // Base dark wet slate concrete
  cCtx.fillStyle = '#12151B';
  cCtx.fillRect(0, 0, size, size);

  // Base medium-matte concrete roughness (0.55)
  rCtx.fillStyle = 'rgb(140, 140, 140)';
  rCtx.fillRect(0, 0, size, size);

  // Deterministic pseudo-random grit & expansion slabs
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 3200; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 3.5;
    const v = 14 + Math.floor(rand() * 18);
    cCtx.fillStyle = `rgba(${v}, ${v + 2}, ${v + 6}, 0.35)`;
    cCtx.fillRect(x, y, r, r);

    const rv = 110 + Math.floor(rand() * 75);
    rCtx.fillStyle = `rgba(${rv}, ${rv}, ${rv}, 0.25)`;
    rCtx.fillRect(x, y, r * 2, r * 2);
  }

  // Glossy wet puddles (very low roughness = dark pixels in roughnessMap)
  for (let p = 0; p < 16; p++) {
    const px = rand() * size;
    const py = rand() * size;
    const pr = 36 + rand() * 88;
    const grad = rCtx.createRadialGradient(px, py, 4, px, py, pr);
    grad.addColorStop(0, 'rgba(18, 18, 18, 0.92)');
    grad.addColorStop(0.65, 'rgba(28, 28, 28, 0.65)');
    grad.addColorStop(1, 'rgba(140, 140, 140, 0)');
    rCtx.fillStyle = grad;
    rCtx.beginPath();
    rCtx.arc(px, py, pr, 0, Math.PI * 2);
    rCtx.fill();

    const cGrad = cCtx.createRadialGradient(px, py, 4, px, py, pr);
    cGrad.addColorStop(0, 'rgba(7, 9, 13, 0.55)');
    cGrad.addColorStop(1, 'rgba(18, 21, 27, 0)');
    cCtx.fillStyle = cGrad;
    cCtx.beginPath();
    cCtx.arc(px, py, pr, 0, Math.PI * 2);
    cCtx.fill();
  }

  // Concrete expansion seams & subtle dockyard floor markings
  cCtx.strokeStyle = 'rgba(5, 6, 9, 0.75)';
  cCtx.lineWidth = 2;
  rCtx.strokeStyle = 'rgb(210, 210, 210)';
  rCtx.lineWidth = 2;
  for (let g = 0; g < 4; g++) {
    const pos = (g * size) / 4;
    cCtx.beginPath();
    cCtx.moveTo(pos, 0);
    cCtx.lineTo(pos, size);
    cCtx.moveTo(0, pos);
    cCtx.lineTo(size, pos);
    cCtx.stroke();

    rCtx.beginPath();
    rCtx.moveTo(pos, 0);
    rCtx.lineTo(pos, size);
    rCtx.moveTo(0, pos);
    rCtx.lineTo(size, pos);
    rCtx.stroke();
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.RepeatWrapping;
  colorMap.repeat.set(8, 28);
  colorMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(8, 28);
  roughnessMap.anisotropy = maxAnisotropy;

  return { colorMap, roughnessMap };
}

/** Procedural brushed steel roughness map */
export function createBrushedSteelRoughnessMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgb(52, 52, 52)';
  ctx.fillRect(0, 0, size, size);

  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let y = 0; y < size; y++) {
    const v = 32 + Math.floor(rand() * 44);
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.5)`;
    ctx.fillRect(0, y, size, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Procedural lit blueprint plaque texture for IMG-01..IMG-21 slots & project screens */
export function createSlotScreenTexture(options: {
  slotId: string;
  title: string;
  subtitle: string;
  accent?: string;
  secondary?: string;
  lines?: string[];
  badge?: string;
  width?: number;
  height?: number;
}) {
  const w = options.width ?? 640;
  const h = options.height ?? 420;
  const accent = options.accent ?? '#FF6A1A';
  const secondary = options.secondary ?? '#4DE1FF';

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Dark studio screen gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0D1017');
  bg.addColorStop(1, '#141923');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle calibration grid
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Corner brackets
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  const pad = 20;
  const len = 26;
  const corners: [number, number, number, number][] = [
    [pad, pad, 1, 1],
    [w - pad, pad, -1, 1],
    [pad, h - pad, 1, -1],
    [w - pad, h - pad, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * len, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * len);
    ctx.stroke();
  }

  // Top bar
  ctx.fillStyle = accent;
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillText(options.slotId, 38, 52);

  if (options.badge) {
    ctx.fillStyle = secondary;
    ctx.font = '500 13px "JetBrains Mono", monospace';
    ctx.fillText(options.badge, 38, 76);
  }

  // Title
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 30px "Syne", sans-serif';
  const words = options.title.split(' ');
  let line = '';
  let ty = 135;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > w - 80) {
      ctx.fillText(line, 38, ty);
      line = word;
      ty += 36;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, 38, ty);

  // Subtitle
  ctx.fillStyle = '#94A3B8';
  ctx.font = '400 16px "Inter", sans-serif';
  ctx.fillText(options.subtitle.slice(0, 62), 38, ty + 34);

  // Additional UI wireframe bars or metadata lines
  const lines = options.lines ?? [];
  let ly = ty + 74;
  ctx.font = '500 13px "JetBrains Mono", monospace';
  for (const l of lines.slice(0, 4)) {
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(38, ly - 18, w - 76, 28);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(l.slice(0, 56), 48, ly);
    ly += 38;
  }

  // Bottom slot status line
  ctx.fillStyle = 'rgba(255, 106, 26, 0.14)';
  ctx.fillRect(38, h - 62, w - 76, 30);
  ctx.fillStyle = accent;
  ctx.font = '500 12px "JetBrains Mono", monospace';
  ctx.fillText(`IMAGE SLOT · ${options.slotId} · READY FOR ASSET SWAP`, 48, h - 42);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Procedural code monolith texture */
export function createCodeMonolithTexture(title: string, lines: string[], accent = '#4DE1FF') {
  const w = 512;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#07090E';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(77, 225, 255, 0.08)';
  ctx.fillRect(0, 0, w, 58);
  ctx.fillStyle = accent;
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText(title, 24, 36);

  ctx.font = '400 15px "JetBrains Mono", monospace';
  let y = 94;
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];
      ctx.fillStyle = text.trim().startsWith('//')
        ? '#64748B'
        : text.includes('export') || text.includes('async') || text.includes('SELECT')
          ? '#FF6A1A'
          : text.includes('supabase') || text.includes('mapbox') || text.includes('paystack')
            ? '#4DE1FF'
            : '#CBD5E1';
      ctx.fillText(text, 24, y);
      y += 28;
      if (y > h - 30) break;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Procedural high-contrast A4 CV document texture for the finale studio tables */
export function createCvSheetTexture(variant: 'uiux' | 'video', maxAnisotropy = 4) {
  const w = 512;
  const h = 724;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const accent = variant === 'uiux' ? '#FF6A1A' : '#0284C7';
  const badgeLabel = variant === 'uiux' ? 'UI/UX & FRONTEND CV · PDF' : 'VIDEO, AI & GRAPHICS CV · PDF';

  // Crisp ivory paper stock
  ctx.fillStyle = '#F7F5F0';
  ctx.fillRect(0, 0, w, h);

  // Top accent rule
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, w, 12);

  // Subtle paper border
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);

  // Header
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 24px "Syne", sans-serif';
  ctx.fillText('OGBOLOGU DAVID C.', 34, 56);

  ctx.fillStyle = accent;
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText(
    variant === 'uiux'
      ? 'UI/UX DESIGNER · FIGMA · DESIGN-TO-CODE'
      : 'AI CONTENT CREATOR · VIDEO EDITOR · GRAPHICS',
    34,
    80
  );

  ctx.fillStyle = '#475569';
  ctx.font = '400 11px "Inter", sans-serif';
  ctx.fillText('Lagos, Nigeria  |  07077348537  |  liebertj070@gmail.com', 34, 100);

  // Divider
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(34, 114, w - 68, 1.5);

  const drawSection = (title: string, y: number, lines: string[]) => {
    ctx.fillStyle = accent;
    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillText(title, 34, y);
    ctx.fillStyle = '#1E293B';
    ctx.font = '400 12px "Inter", sans-serif';
    let cy = y + 22;
    for (const line of lines) {
      ctx.fillText(line, 34, cy);
      cy += 20;
    }
    return cy + 14;
  };

  let nextY = 142;
  if (variant === 'uiux') {
    nextY = drawSection('PROFILE', nextY, [
      'Computer Science student & UI/UX designer building',
      'from Figma flows & prototypes to Next.js production.',
    ]);
    nextY = drawSection('SELECTED PROJECTS', nextY, [
      '• Kelvjessia Transport — Figma + Next.js + Supabase',
      '• Food Delivery App — Competitive UX & Prototype',
      '• JUTIMA Retail System — MySQL + Node.js/Express',
    ]);
    nextY = drawSection('DESIGN & TECH STACK', nextY, [
      'Figma, Wireframing, User Flows, Responsive UI,',
      'Next.js, Tailwind CSS, Supabase, MySQL, Git/GitHub',
    ]);
    drawSection('EXPERIENCE', nextY, [
      '• Intern — Naval Dockyard Limited (Jul 2026–Present)',
      '• B.Sc. Computer Science — Augustine University',
    ]);
  } else {
    nextY = drawSection('PROFILE', nextY, [
      'Creative technologist producing documentary video,',
      'AI-assisted storytelling, and branded event visuals.',
    ]);
    nextY = drawSection('VIDEO, AI & DESIGN TOOLS', nextY, [
      '• DaVinci Resolve, CapCut, Pacing & Text Motion',
      '• ChatGPT, Veo, ElevenLabs, AI33Pro, Prompt Eng.',
      '• Adobe Photoshop & Canva — Posters & Flyers',
    ]);
    nextY = drawSection('EXPERIENCE & SERIES', nextY, [
      '• Naval Dockyard Documentary & Event Graphics',
      '• First Man on the Sun · Megan’s Bakery (TikTok)',
    ]);
    drawSection('EDUCATION', nextY, [
      'B.Sc. Computer Science — Augustine University (2027)',
    ]);
  }

  // Footer PDF Action Pill
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(34, h - 72, w - 68, 40);
  ctx.fillStyle = accent;
  ctx.fillRect(34, h - 72, 8, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText(badgeLabel, 56, h - 47);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/** Procedural golden-hour harbour sky & water reflection backdrop (zero external textures) */
export function createHarbourBackdropTexture() {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Dusk-to-amber sky (top 68%)
  const horizonY = Math.floor(h * 0.68);
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#090D18');
  skyGrad.addColorStop(0.38, '#1E213A');
  skyGrad.addColorStop(0.68, '#7C383B');
  skyGrad.addColorStop(0.88, '#DC6B2E');
  skyGrad.addColorStop(1, '#FFC478');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, horizonY);

  // Soft setting sun radial bloom near center-right
  const sunX = w * 0.56;
  const sunY = horizonY - 12;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 150);
  sunGrad.addColorStop(0, 'rgba(255, 244, 214, 0.92)');
  sunGrad.addColorStop(0.28, 'rgba(255, 178, 92, 0.45)');
  sunGrad.addColorStop(1, 'rgba(255, 106, 26, 0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, w, horizonY);

  // Atmospheric layered cloud wisps
  ctx.fillStyle = 'rgba(22, 24, 40, 0.34)';
  for (let i = 0; i < 8; i++) {
    const cx = (i * 78 + 30) % w;
    const cy = 28 + (i % 4) * 26;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70 + (i % 3) * 25, 9 + (i % 2) * 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Harbour water reflection band (bottom 32%)
  const waterGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  waterGrad.addColorStop(0, '#3C282B');
  waterGrad.addColorStop(0.45, '#141B29');
  waterGrad.addColorStop(1, '#080B12');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // Shimmering golden-hour sun path ripples on the water
  for (let y = horizonY + 3; y < h; y += 4) {
    const t = (y - horizonY) / (h - horizonY);
    const spread = 16 + t * 55;
    const alpha = Math.max(0.08, 0.55 - t * 0.48);
    ctx.fillStyle = `rgba(255, 176, 94, ${alpha})`;
    ctx.fillRect(sunX - spread * 0.5 + Math.sin(y * 0.7) * 6, y, spread, 1.8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

