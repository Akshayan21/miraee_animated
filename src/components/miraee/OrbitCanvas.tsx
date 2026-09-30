"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion/gsap";

/** Curated travel moments: flight, hotel, cab, destination, meeting, traveler,
 * receipt, map, passport, rail, travel app, expense, analytics, airport,
 * luggage and hotel check-in. Avoid generic portraits that weaken the story. */
const subjects = Array.from({ length: 16 }, (_, index) => index);
/** Orbit waits for the hero copy's own entrance to finish before it opens. */
const ORBIT_START_DELAY = 0.9;

/** Precomputed no-WebGL fallback dot positions (literal Tailwind classes — no per-render arbitrary interpolation). */
const fallbackDots = [
  { subject: 0, left: "left-[93%]", top: "top-[50%]", bgPosition: "bg-[position:0%_0%]" },
  { subject: 1, left: "left-[80.4%]", top: "top-[81.8%]", bgPosition: "bg-[position:33.333%_0%]" },
  { subject: 2, left: "left-[50%]", top: "top-[95%]", bgPosition: "bg-[position:66.667%_0%]" },
  { subject: 3, left: "left-[19.6%]", top: "top-[81.8%]", bgPosition: "bg-[position:100%_0%]" },
  { subject: 4, left: "left-[7%]", top: "top-[50%]", bgPosition: "bg-[position:0%_33.333%]" },
  { subject: 5, left: "left-[19.6%]", top: "top-[18.2%]", bgPosition: "bg-[position:33.333%_33.333%]" },
  { subject: 6, left: "left-[50%]", top: "top-[5%]", bgPosition: "bg-[position:66.667%_33.333%]" },
  { subject: 7, left: "left-[80.4%]", top: "top-[18.2%]", bgPosition: "bg-[position:100%_33.333%]" },
];
const vertex = `
precision mediump float;
attribute vec2 position;
uniform vec2 resolution, center, size;
uniform float rotation;
varying vec2 local;
void main() {
  local = position;
  vec2 p = position * size;
  p = mat2(cos(rotation), sin(rotation), -sin(rotation), cos(rotation)) * p;
  vec2 screen = (center + p) / resolution * 2.0 - 1.0;
  gl_Position = vec4(screen.x, -screen.y, 0.0, 1.0);
}`;
const fragment = `
precision mediump float;
uniform sampler2D atlas;
uniform vec2 cell;
uniform float alpha;
varying vec2 local;
vec4 sampleDisc(vec2 p) {
  float coverage = 1.0 - smoothstep(.965, 1.0, length(p));
  vec2 uv = clamp(p * .5 + .5, .015, .985);
  vec3 color = texture2D(atlas, (cell + uv) / vec2(4.0, 4.0)).rgb;
  float luminance = dot(color, vec3(.2126,.7152,.0722));
  color = mix(vec3(luminance), color, 1.04);
  color = (color - .5) * 1.08 + .5;
  // A subtle curved highlight gives the photographic disc a polished surface.
  color += .035 * pow(max(0.0, 1.0-length(p-vec2(-.4,-.6))), 3.0);
  return vec4(color, coverage);
}
void main() {
  vec2 p = local;
  vec4 base = sampleDisc(p);
  float a = base.a;
  vec3 color = base.rgb;
  // A thin brand-coloured ring at the disc edge — without it these little
  // photos had no contrast against the white hero background and read as
  // a fuzzy scattered blur instead of a set of distinct travel snapshots.
  float ring = smoothstep(.82,.92,length(p)) * (1.0-smoothstep(.94,1.02,length(p)));
  color = mix(color, vec3(.898,.337,.008), ring*.55);
  gl_FragColor = vec4(color, a * alpha);
}`;

/** One coordinate space keeps the orbit and optical boundary in phase. */
export function OrbitCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) { setFallback(true); return; }
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      shaders.push(shader);
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "Orbit shader failed");
      return shader;
    };
    const program = gl.createProgram()!;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Orbit program failed");
    } catch {
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program);
      setFallback(true); return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Tessellation makes refraction continuous instead of stretching a flat quad.
    const mesh: number[] = [];
    for (let y = 0; y < 28; y++) for (let x = 0; x < 16; x++) {
      const x0 = x/8-1, x1 = (x+1)/8-1, y0 = y/14-1, y1 = (y+1)/14-1;
      mesh.push(x0,y0,x1,y0,x0,y1,x0,y1,x1,y0,x1,y1);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(["resolution", "center", "size", "rotation", "cell", "alpha", "atlas"].map(key => [key, gl.getUniformLocation(program, key)]));
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uniforms.atlas, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, elapsed = 0, loaded = false, visible = true, disposed = false;
    // Selector matches the data-gsap attribute now used in place of the old
    // ".hero-state" class throughout this component tree.
    const hero = canvas.closest<HTMLElement>('[data-gsap="hero-state"]');
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const render = () => {
      if (!loaded || disposed || gl.isContextLost()) return;
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.resolution, width, height);
      const mobile = width < 769;
      const tilt = -.24;
      const discs = Array.from({ length: 16 }, (_, index) => {
        const layer = index < 8 ? 0 : 1;
        const count = 8;
        const slot = index - (layer === 0 ? 0 : 8);
        // Each ring receives a different half of the curated story. Using
        // `slot` here repeated only the first eight images on both rings and
        // hid the expense, rail, app and airport moments entirely.
        const subject = subjects[index];
        const phase = -slot/count*Math.PI*2 - (layer === 0 ? .25 : .9);
        const progress = media.matches ? 1 : clamp((elapsed - ORBIT_START_DELAY - .12 - layer*1.05 - slot*.055)/.55);
        const opening = progress*progress*(3-2*progress);
        const angle = phase + elapsed * (layer === 0 ? .29 : -.23);
        const depth = Math.cos(angle);
        const perspective = 1 / (1 + depth * .18);
        const rx = mobile ? width*(layer === 0 ? .72 : 1.08) : width*(layer === 0 ? .34 : .49);
        const ry = height*(layer === 0 ? .42 : .68);
        const spread = .96 + .04*opening;
        const px = Math.cos(angle) * rx;
        const py = Math.sin(angle) * ry;
        const x = width/2 + (px*Math.cos(tilt)-py*Math.sin(tilt))*perspective*spread;
        const y = height*.5 + (px*Math.sin(tilt)+py*Math.cos(tilt))*perspective*spread;
        // Bigger than the original (.019/.032) — at that size the mosaic
        // photos were too small to read as anything but coloured blur.
        const radius = (mobile ? 22 : Math.min(width*.027,height*.046)) * perspective * (layer === 0 ? .95 : 1.05);
        return { subject, x, y, depth, radius, angle, opening };
      }).sort((a,b) => b.depth-a.depth);
      for (const disc of discs) {
        gl.uniform2f(uniforms.center, disc.x, disc.y);
        gl.uniform2f(uniforms.size, disc.radius*(.9+.1*Math.abs(Math.sin(disc.angle+.5))), disc.radius);
        // Original swung the whole photo through ±.7 radians (near
        // upside-down at the extremes) — a travel snapshot rotated that far
        // stops reading as a photo at all. Kept near-upright with only a
        // small wobble for life.
        gl.uniform1f(uniforms.rotation, Math.sin(disc.angle)*.12);
        gl.uniform2f(uniforms.cell, disc.subject%4, Math.floor(disc.subject/4));
        gl.uniform1f(uniforms.alpha, disc.opening);
        gl.drawArrays(gl.TRIANGLES, 0, mesh.length/2);
      }
    };
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
      gl.viewport(0,0,canvas.width,canvas.height); render();
    };
    const image = new Image();
    image.onload = () => {
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      loaded = true; resize();
    };
    image.onerror = () => { if (!disposed) setFallback(true); };
    image.src = "/product/hero-orbit-atlas-v2.png";
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(canvas);
    const tick = (_time: number, delta: number) => {
      if (!loaded || media.matches || !visible || document.hidden || hero?.style.visibility === "hidden") return;
      elapsed += Math.min(delta, 50)/1000; render();
    };
    const lost = (event: Event) => { event.preventDefault(); setFallback(true); };
    canvas.addEventListener("webglcontextlost", lost);
    media.addEventListener("change", render);
    gsap.ticker.add(tick);
    return () => {
      disposed = true; image.onload = null; image.onerror = null;
      observer.disconnect(); visibility.disconnect(); gsap.ticker.remove(tick);
      media.removeEventListener("change", render); canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteBuffer(buffer); gl.deleteTexture(texture); gl.deleteProgram(program); shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, []);
  return <>
    <canvas ref={ref} className={`absolute inset-0 w-full h-full ${fallback ? "invisible" : ""}`} aria-hidden="true" />
    {fallback && (
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        {fallbackDots.map((dot) => (
          <span
            key={dot.subject}
            className={`absolute size-12 rounded-full border border-brand/35 shadow-[0_12px_28px_-16px_rgba(69,14,20,.5)] -translate-x-1/2 -translate-y-1/2 bg-[url('/product/hero-orbit-atlas-v2.png')] [background-size:400%_400%] ${dot.left} ${dot.top} ${dot.bgPosition}`}
          />
        ))}
      </div>
    )}
  </>;
}
