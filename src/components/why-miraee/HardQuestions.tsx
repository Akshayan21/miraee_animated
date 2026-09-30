"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { hardQuestionsIntro, hardQuestions } from "@/data/whyMiraee";
import styles from "./HardQuestions.module.css";

export function HardQuestions() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const section = root.current;
    if (!section) return;
    const intro = section.querySelector<HTMLElement>("[data-hq-intro]");
    const stage = section.querySelector<HTMLElement>("[data-hq-stage]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-hq-card]", section);
    const progress = section.querySelector<HTMLElement>("[data-hq-progress]");
    const glow = section.querySelector<HTMLElement>(`.${styles.glow}`);
    if (!intro || !stage || !progress || cards.length !== hardQuestions.length) return;
    const panel = section.querySelector<HTMLElement>("[data-hq-panel]");
    if (!panel) return;
    // Hold the complete bento only when every answer fits below the navigation.
    // Re-measure on resize, font loading, and content reflow without shrinking text.
    const fitQuery = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const updateReadingHold = () => {
      const fits = fitQuery.matches && panel.offsetHeight <= window.innerHeight - 80;
      section.toggleAttribute("data-reading-hold", fits);
    };
    const observer = new ResizeObserver(updateReadingHold);
    observer.observe(panel);
    window.addEventListener("resize", updateReadingHold);
    fitQuery.addEventListener("change", updateReadingHold);
    updateReadingHold();
    const mm = gsap.matchMedia();
    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      immersive: "(min-width: 1024px)",
    }, (context) => {
      if (!context.conditions?.motion) return;

      if (context.conditions?.immersive) {
        gsap.fromTo(
          intro.children,
          { autoAlpha: 0.2, y: 54, z: -90, rotateX: 8 },
          {
            autoAlpha: 1,
            y: 0,
            z: 0,
            rotateX: 0,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: { trigger: intro, start: "top 96%", end: "top 58%", scrub: 0.65 },
          },
        );

        cards.forEach((card, index) => {
          const columnDirection = index % 2 === 0 ? -1 : 1;
          const depth = 150 + (index % 3) * 45;
          gsap.fromTo(
            card,
            {
              autoAlpha: 0.08,
              x: columnDirection * (70 + (index % 3) * 16),
              y: 100 + (index % 2) * 24,
              z: -depth,
              rotateX: 12 + (index % 2) * 3,
              rotateY: columnDirection * -9,
              scale: 0.9,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 98%",
                end: "top 56%",
                scrub: 0.8,
              },
            },
          );
        });

        if (glow) {
          gsap.fromTo(glow, { yPercent: -10, scale: 0.82 }, {
            yPercent: 28,
            scale: 1.18,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
          });
        }
      } else {
        gsap.fromTo(
          intro.children,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: intro, start: "top 84%", once: true },
          },
        );

        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, x: index % 2 === 0 ? -24 : 24, y: 34, scale: 0.98 },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
            },
          );
        });
      }

      cards.forEach((row) => {
        gsap.fromTo(row.querySelectorAll("i"), { scaleX: 0, transformOrigin: "left" }, {
          scaleX: 1, duration: 0.45, ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
      });
      gsap.fromTo(progress, { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: stage, start: "top 85%", end: "bottom 65%", scrub: true },
      });
    });
    return () => {
      mm.revert();
      observer.disconnect();
      window.removeEventListener("resize", updateReadingHold);
      fitQuery.removeEventListener("change", updateReadingHold);
      section.removeAttribute("data-reading-hold");
    };
  }, { scope: root });

  return <section ref={root} data-why-scene="Objections" className={styles.section} aria-labelledby="hard-questions-title"><div className={styles.sticky} data-hq-panel>
    <div className={styles.glow} aria-hidden="true" />
    <header className={styles.intro} data-hq-intro><p>{hardQuestionsIntro.eyebrow}</p><h2 id="hard-questions-title">{hardQuestionsIntro.title}</h2><span>Six concerns. Six direct answers.</span></header>
    <div className={styles.stage} data-hq-stage>
      {[0, 2, 4].map((start) => (
        <div className={styles.readingRow} key={start} data-hq-row>
          <div className={styles.rowCards}>
            {hardQuestions.slice(start, start + 2).map((item, offset) => (
              <article className={`${styles.card} ${styles[`card${start + offset + 1}`]}`} data-hq-card key={item.question}>
                <div className={styles.cardTop}><span>0{start + offset + 1}</span><i aria-hidden="true" /></div>
                <h3>{item.question}</h3><p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className={styles.progress} aria-hidden="true"><i data-hq-progress /></div>
  </div></section>;
}
