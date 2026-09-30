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
      desktop: "(min-width: 769px)",
    }, (context) => {
      if (!context.conditions?.motion) return;
      // Keep the copy static; only the decorative accents animate.
      cards.forEach((row) => {
        gsap.fromTo(row.querySelectorAll("i"), { scaleX: 0, transformOrigin: "left" }, {
          scaleX: 1, duration: 0.25, ease: "power2.out",
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

  return <section ref={root} className={styles.section} aria-labelledby="hard-questions-title"><div className={styles.sticky} data-hq-panel>
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
