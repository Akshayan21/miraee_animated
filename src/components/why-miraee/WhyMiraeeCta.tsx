import Link from "next/link";
import { whyMiraeeClosing } from "@/data/whyMiraee";

export function WhyMiraeeCta() {
  return (
    <section className="bg-background-deep px-6 py-[clamp(80px,10vw,150px)] text-center text-white">
      <div className="mx-auto max-w-[760px]">
        <h2 className="m-0 font-display text-[clamp(42px,6vw,84px)] font-bold leading-[.95] tracking-[-.05em]">{whyMiraeeClosing.title}</h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-white/60">{whyMiraeeClosing.body}</p>
        <Link href="/request-demo" className="mt-9 inline-flex rounded-full bg-brand px-7 py-4 text-sm font-bold text-white no-underline transition-transform active:scale-[.98]">{whyMiraeeClosing.cta}</Link>
      </div>
    </section>
  );
}
