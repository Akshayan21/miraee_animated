"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion/gsap";

const subjects = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 15, 17, 18, 19, 20, 21, 22, 23];
const vertex = `
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
uniform float edge, direction, alpha;
varying vec2 local;
vec4 sampleDisc(vec2 p) {
  float coverage = 1.0 - smoothstep(.965, 1.0, length(p));
  vec2 uv = clamp(p * .5 + .5, .015, .985);
  vec3 color = texture2D(atlas, (cell + uv) / vec2(6.0, 5.0)).rgb;
  float luminance = dot(color, vec3(.2126,.7152,.0722));
  color = mix(vec3(luminance), color, .9);
  // A subtle curved highlight gives the photographic disc a polished surface.
  color += .035 * pow(max(0.0, 1.0-length(p-vec2(-.4,-.6))), 3.0);
  return vec4(color, coverage);
}
void main() {
  vec2 p = local;
  p.x += edge * .38 * (p.y*p.y-.25) * direction;
  p.x *= 1.0 + edge * .32 * p.y * direction;
  float split = edge * .065 * (0.3 + abs(p.y));
  vec4 base = sampleDisc(p);
  vec4 red = sampleDisc(p + vec2(split, 0.0));
  vec4 blue = sampleDisc(p - vec2(split, 0.0));
  float a = max(base.a, max(red.a, blue.a));
  vec3 color = vec3(mix(1.0,red.r,red.a), mix(1.0,base.g,base.a), mix(1.0,blue.b,blue.a));
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(["resolution", "center", "size", "rotation", "cell", "edge", "direction", "alpha", "atlas"].map(key => [key, gl.getUniformLocation(program, key)]));
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
    const hero = canvas.closest<HTMLElement>(".hero-state")!;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const render = () => {
      if (!loaded || disposed || gl.isContextLost()) return;
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.resolution, width, height);
      const mobile = width < 769;
      const tilt = -.27;
      const discs = subjects.map((subject, index) => {
        const layer = index < 6 ? 0 : index < 13 ? 1 : 2;
        const count = layer === 0 ? 6 : 7;
        const slot = index - (layer === 0 ? 0 : layer === 1 ? 6 : 13);
        const phase = slot / count * Math.PI * 2 + layer * .43 - 1.3;
        const progress = media.matches ? 1 : clamp((elapsed - layer * .13 - slot * .025) / 2.15);
        const opening = 1 - Math.pow(1-progress, 4);
        const angle = phase + elapsed * .19 + (1-opening) * .6;
        const depth = Math.sin(angle + .4);
        const perspective = 1 / (1 + depth * .16);
        const rx = mobile ? width * (.66 + layer * .22) : Math.max(255, width * .18) + layer * width * .071;
        const ry = height * (.36 + layer * .22);
        const spread = .18 + .82 * opening;
        const px = Math.cos(angle) * rx;
        const py = Math.sin(angle) * ry;
        const x = width/2 + (px*Math.cos(tilt)-py*Math.sin(tilt))*perspective*spread;
        const y = height*.52 + (px*Math.sin(tilt)+py*Math.cos(tilt))*perspective*spread;
        const edge = media.matches ? 0 : Math.pow(clamp((height*.15-Math.min(y,height-y))/(height*.15)), 1.7);
        const radius = (mobile ? 23 : Math.min(43, width*.027)) * perspective * (.82+layer*.13) * (.45+.55*opening);
        return { subject, x, y, edge, depth, radius, angle, opening };
      }).sort((a,b) => b.depth-a.depth);
      for (const disc of discs) {
        gl.uniform2f(uniforms.center, disc.x, disc.y);
        gl.uniform2f(uniforms.size, disc.radius*(.73+.2*Math.abs(Math.cos(disc.angle))), disc.radius*(1+disc.edge*3.8));
        gl.uniform1f(uniforms.rotation, -.28+Math.sin(disc.angle)*.24 + disc.edge*(disc.x/width-.5)*.65);
        gl.uniform2f(uniforms.cell, disc.subject%6, Math.floor(disc.subject/6));
        gl.uniform1f(uniforms.edge, disc.edge);
        gl.uniform1f(uniforms.direction, disc.y<height/2 ? -1 : 1);
        gl.uniform1f(uniforms.alpha, disc.opening);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
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
    image.src = "/product/hero-orbit-mosaic.png";
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(canvas);
    const tick = (_time: number, delta: number) => {
      if (!loaded || media.matches || !visible || document.hidden || hero.style.visibility === "hidden") return;
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
    <canvas ref={ref} className="orbit-canvas" aria-hidden="true" style={fallback ? { visibility: "hidden" } : undefined} />
    {fallback && <div className="orbit-fallback" aria-hidden="true">{subjects.slice(0,8).map((subject,index) => <span key={subject} style={{ left: `${50+43*Math.cos(index*Math.PI/4)}%`, top: `${50+45*Math.sin(index*Math.PI/4)}%`, backgroundPosition: `${subject%6*20}% ${Math.floor(subject/6)*25}%` }} />)}</div>}
  </>;
}
