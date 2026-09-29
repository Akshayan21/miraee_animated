"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

const orbitItems = [
  { label: "Flights", icon: "✈", tone: "sky", ring: "outer", x: 49, y: -2 },
  { label: "Hotels", icon: "H", tone: "hotel", ring: "outer", x: 63, y: 2 },
  { label: "Cab & ground travel", icon: "↗", tone: "cab", ring: "outer", x: 76, y: 10 },
  { label: "Tourist spots", icon: "◎", tone: "place", ring: "outer", x: 87, y: 24 },
  { label: "Business meetings", icon: "▦", tone: "meeting", ring: "outer", x: 94, y: 41 },
  { label: "Business travel", icon: "◇", tone: "travel", ring: "outer", x: 96, y: 61 },
  { label: "Finance", icon: "$", tone: "finance", ring: "outer", x: 89, y: 79 },
  { label: "Expenses", icon: "≡", tone: "expense", ring: "outer", x: 77, y: 91 },
  { label: "Management", icon: "M", tone: "management", ring: "outer", x: 62, y: 98 },
  { label: "Duty of care", icon: "+", tone: "care", ring: "outer", x: 37, y: 98 },
  { label: "Travel policy", icon: "✓", tone: "policy", ring: "outer", x: 22, y: 91 },
  { label: "Approvals", icon: "⌁", tone: "approval", ring: "outer", x: 10, y: 79 },
  { label: "Traveller", icon: "•", tone: "traveller", ring: "outer", x: 4, y: 61 },
  { label: "Travel admin", icon: "A", tone: "admin", ring: "outer", x: 6, y: 40 },
  { label: "Visa & documents", icon: "□", tone: "visa", ring: "outer", x: 13, y: 23 },
  { label: "Rail", icon: "Ⅱ", tone: "rail", ring: "outer", x: 25, y: 10 },
  { label: "Dining", icon: "◒", tone: "dining", ring: "outer", x: 38, y: 2 },
  { label: "Itinerary", icon: "⌇", tone: "itinerary", ring: "inner", x: 49, y: 14 },
  { label: "TAVO calling", icon: "☎", tone: "tavo", ring: "inner", x: 68, y: 20 },
  { label: "TACO support", icon: "○", tone: "taco", ring: "inner", x: 82, y: 36 },
  { label: "Receipts", icon: "R", tone: "receipt", ring: "inner", x: 84, y: 63 },
  { label: "Spend analytics", icon: "↗", tone: "analytics", ring: "inner", x: 69, y: 80 },
  { label: "HR", icon: "HR", tone: "hr", ring: "inner", x: 49, y: 87 },
  { label: "Leadership", icon: "L", tone: "leadership", ring: "inner", x: 30, y: 80 },
  { label: "Trip changes", icon: "↻", tone: "changes", ring: "inner", x: 16, y: 63 },
  { label: "Events", icon: "E", tone: "events", ring: "inner", x: 16, y: 37 },
  { label: "Trip requests", icon: "+", tone: "request", ring: "inner", x: 30, y: 20 },
] as const;

// Keep the original atlas index when curating the visible subjects.
const heroItems = orbitItems.map((item, imageIndex) => ({ ...item, imageIndex }))
  .filter(item => [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 17, 18, 19, 20, 21, 23].includes(item.imageIndex));

export function HeroState() {
  const hero = useRef<HTMLDivElement>(null);
  const lensId = useId().replaceAll(":", "");
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const visual = element.querySelector<HTMLElement>(".hero-visual")!;
    const copy = element.querySelector<HTMLElement>(".hero-copy")!;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = Array.from(visual.querySelectorAll<HTMLElement>(".orbit-node:not(.lens-node)"));
    const lensNodes = Array.from(visual.querySelectorAll<HTMLElement>(".lens-node"));
    const rings = [0, 1, 2].map(layer => nodes.filter((_, index) => index % 3 === layer));
    let width = 0, height = 0, centerX = 0, centerY = 0, radiusX = 0, radiusY = 0;
    let elapsed = 0;
    let stageHeight = 0, visualTop = 0;
    let visible = true;
    const render = () => {
      rings.forEach((ring, ringIndex) => {
        const rx = radiusX + ringIndex * width * 0.038;
        const ry = radiusY + ringIndex * height * 0.13;
        ring.forEach((node, index) => {
          const progress = media.matches ? 1 : Math.min(1, Math.max(0, (elapsed - 0.15 - index * 0.035 - ringIndex * 0.16) / 1.8));
          const entrance = 1 - Math.pow(1 - progress, 3);
          const angle = index / ring.length * Math.PI * 2 - Math.PI / 2 + ringIndex * 0.66 + elapsed * (0.20 - ringIndex * 0.022);
          // Project a tilted orbit plane: the far side recedes, the near side advances.
          const depth = Math.cos(angle + 0.6);
          const perspective = 1 / (1 + depth * 0.22);
          const spread = 0.38 + entrance * 0.62;
          const breathing = 1 + Math.sin(angle * 2 + ringIndex * 0.7) * 0.045;
          const planeX = Math.cos(angle) * rx * breathing;
          const planeY = Math.sin(angle) * ry * breathing;
          const tilt = -0.24;
          const x = centerX + (planeX * Math.cos(tilt) - planeY * Math.sin(tilt)) * perspective * spread;
          const y = centerY + (planeX * Math.sin(tilt) + planeY * Math.cos(tilt)) * perspective * spread;
          node.style.opacity = String(entrance);
          const size = (0.65 + entrance * 0.35) * perspective * (0.72 + ringIndex * 0.18);
          const facing = 0.78 + 0.22 * Math.abs(Math.sin(angle + 0.4));
          node.style.zIndex = String(Math.round(10 - depth * 4));
          node.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${-14 + Math.sin(angle) * 12}deg) scale(${size * facing},${size})`;
          const lens = lensNodes[nodes.indexOf(node)];
          lens.style.transform = node.style.transform;
          lens.style.opacity = node.style.opacity;
          lens.style.zIndex = node.style.zIndex;
        });
      });
    };
    const measure = () => {
      width = visual.offsetWidth;
      height = visual.offsetHeight;
      stageHeight = element.clientHeight;
      visualTop = visual.offsetTop;
      visual.style.setProperty("--lens-top", `${-visualTop}px`);
      visual.style.setProperty("--lens-bottom", `${stageHeight - visualTop}px`);
      centerX = element.clientWidth / 2 - visual.offsetLeft;
      centerY = copy.offsetTop + copy.offsetHeight / 2 - visual.offsetTop;
      // An ellipse must clear the copy's corners as well as its horizontal edges.
      radiusX = Math.max(copy.offsetWidth * 0.86 + 35, width * 0.2);
      radiusY = Math.max(copy.offsetHeight * 0.85 + 65, height * 0.33);
      render();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(copy);
    media.addEventListener("change", measure);
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    visibility.observe(element);
    const tick = (_time: number, delta: number) => {
      if (media.matches || document.hidden || !visible || element.style.visibility === "hidden") return;
      elapsed += Math.min(delta, 50) / 1000;
      render();
    };
    measure();
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); observer.disconnect(); visibility.disconnect(); media.removeEventListener("change", measure); };
  }, []);
  return (
    <div className="hero-state" ref={hero}>
      <div className="hero-visual" aria-label="Miraee connects every part of business travel">
        <span className="orbit-path orbit-path-outer" aria-hidden="true" />
        <span className="orbit-path orbit-path-inner" aria-hidden="true" />
        {heroItems.map((item, index) => (
          <div
            className={`orbit-node orbit-${item.ring} tone-${item.tone}`}
            style={{
              left: 0,
              top: 0,
              "--node-index": index,
              "--image-x": `${(item.imageIndex % 6) * 20}%`,
              "--image-y": `${Math.floor(item.imageIndex / 6) * 25}%`,
            } as React.CSSProperties}
            key={item.label}
          >
            <span className="orbit-node-image" aria-hidden="true"><i>{item.icon}</i></span>
            <span className="orbit-tooltip">{item.label}</span>
          </div>
        ))}
        <svg width="0" height="0" aria-hidden="true" className="lens-definition">
          <defs>
            <filter id={lensId} x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.025" numOctaves="1" seed="8" result="lens-map" />
              <feDisplacementMap in="SourceGraphic" in2="lens-map" scale="14" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="0.45" />
            </filter>
          </defs>
        </svg>
        <div className="orbit-edge-lens" aria-hidden="true">
          <div className="orbit-lens-field" style={{ filter: `url(#${lensId})` }}>
            {heroItems.map(item => <div key={item.label} className={`orbit-node lens-node orbit-${item.ring}`} style={{ left: 0, top: 0, "--image-x": `${(item.imageIndex % 6) * 20}%`, "--image-y": `${Math.floor(item.imageIndex / 6) * 25}%` } as React.CSSProperties}><span className="orbit-node-image" /></div>)}
          </div>
        </div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">AI-native business travel</p>
        <h1>The travel &amp; expense platform that actually does the work.</h1>
        <p className="hero-lede">Meet Miraee. State your intent, and our AI agents search, book, pay, coordinate, recover, and file your expenses. Effortless for travelers, strictly controlled for finance, and rewarding for everyone.</p>
        <div className="hero-actions">
          <a href="#meet-mirai" className="button button-primary">Meet Mirai <span>↗</span></a>
        </div>
      </div>
    </div>
  );
}
