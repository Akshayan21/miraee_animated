"use client";

// Product Hero — rebuilt to the Wope-style reference: white theme, warm
// radial glow + converging rays behind a big centered headline, a single
// pill-shaped input+CTA bar, a trust line, and a browser-chrome mockup
// window below. All in Miraee's own brand colors (brand orange), not the
// reference's dark/purple palette — only the composition is borrowed.
//
// The mockup window's screen content is a placeholder (this project's own
// public/assets/ui-admin-dashboard.webp, the user's own product screen.
//
// The real site navbar (SiteHeader, root layout) is untouched and not
// referenced here at all.
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import styles from "./ProductHero.module.css";

export function ProductHero() {
  const section = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const copy = root.querySelector<HTMLElement>(`.${styles.copy}`);
      const mockup = root.querySelector<HTMLElement>(`.${styles.mockup}`);
      if (!copy) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Copy is above the fold — a load-in fade is right for it.
        gsap.fromTo(copy, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });

        // The mockup sits partly below the fold, so a load-in fade meant
        // most visitors scrolled onto an already-settled window — it never
        // registered as "revealed". Scroll-triggered instead: fades/rises
        // once as it actually enters view, same pattern used elsewhere on
        // this site (e.g. ExperiencesSection's reveal-on-scroll tiles).
        // `start: "top 100%"` — while it's `visibility:hidden` it still
        // reserves its normal-flow layout space, so a later trigger (e.g.
        // "top 88%") left a stretch of blank page between the trust line
        // and wherever the mockup actually was before its top edge got
        // close enough to fire. Firing right as it starts entering the
        // viewport keeps that gap to what the mockup's own reveal
        // animation (40px rise) covers, not extra scroll distance on top.
        if (mockup) {
          gsap.fromTo(
            mockup,
            { autoAlpha: 0, y: 40, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: mockup, start: "top 100%", toggleActions: "play none none reverse" } },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} className={styles.section} aria-labelledby="product-hero-title">
      <div className={styles.glow} aria-hidden="true">
        <svg className={styles.rays} viewBox="0 0 1200 500" preserveAspectRatio="none">
          {Array.from({ length: 13 }).map((_, i) => {
            const angle = -60 + i * 10;
            const rad = (angle * Math.PI) / 180;
            const x2 = 600 + Math.sin(rad) * 700;
            const y2 = 40 + Math.cos(rad) * 700;
            return <line key={i} x1="600" y1="40" x2={x2} y2={y2} />;
          })}
        </svg>
        <span className={styles.star1} />
        <span className={styles.star2} />
        <span className={styles.star3} />
        <span className={styles.star4} />
      </div>

      <div className={styles.copy}>
        <h1 id="product-hero-title" className={styles.headline}>
          Welcome to the agentic era of travel.
        </h1>
        <p className={styles.lede}>
          We have moved beyond the digital search-and-click era. Miraee offers a swarm of AI agents that execute the entire travel lifecycle end to end, with a human always in the loop.
        </p>

        <form
          className={styles.inputBar}
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = "/request-demo";
          }}
        >
          <input
            type="email"
            required
            placeholder="Enter your work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Work email"
          />
          <button type="submit">Request a Demo</button>
        </form>
      </div>

      <div className={styles.mockup}>
        <div className={styles.mockupBar}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.navIcons} aria-hidden="true">
            ‹
          </span>
          <div className={styles.addressBar}>
            <img className={styles.addressIcon} src="/brand/icons/favicon.png" alt="" />
            app.miraee.com/trip/overview
          </div>
          <div className={styles.tabs} aria-hidden="true">
            <span className={styles.tabChip}>Trip · SFO–NRT</span>
            <span className={styles.tabChip}>Approvals</span>
            <span className={styles.tabChipPlus}>+</span>
          </div>
        </div>
        <div className={styles.mockupScreen}>
          {/* eslint-disable-next-line @next/next/no-img-element -- existing static UI export */}
          <img src="/assets/ui-admin-dashboard.webp" alt="Miraee trip overview dashboard" />
        </div>
      </div>
    </section>
  );
}
