import Link from "next/link";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: readonly [string, string, string];
};

export function PlaceholderPage({ eyebrow, title, description, highlights }: PlaceholderPageProps) {
  return (
    <main className="min-h-[82svh] bg-paper px-6 pt-36 pb-24 text-ink">
      <section className="mx-auto max-w-[1180px]">
        <p className="m-0 text-[11px] font-bold tracking-[.16em] text-brand uppercase">{eyebrow}</p>
        <h1 className="mt-5 mb-0 max-w-[920px] font-display text-[clamp(54px,7vw,104px)] font-bold leading-[.9] tracking-[-.07em] text-balance">{title}</h1>
        <p className="mt-8 max-w-[620px] text-[clamp(17px,2vw,22px)] leading-[1.5] text-muted">{description}</p>
        <div className="mt-16 grid grid-cols-3 border-y border-ink/12 max-md:grid-cols-1">
          {highlights.map((item, index) => <div key={item} className="min-h-[180px] border-r border-ink/12 p-7 last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0"><span className="text-xs font-bold text-brand">0{index + 1}</span><h2 className="mt-12 mb-0 font-display text-2xl font-bold tracking-[-.04em]">{item}</h2></div>)}
        </div>
        <div className="mt-12 flex flex-wrap gap-3"><Link className="rounded-full bg-brand px-6 py-3 text-sm font-bold text-white no-underline" href="/request-demo">Request a Demo</Link><Link className="rounded-full border border-ink/18 px-6 py-3 text-sm font-bold text-ink no-underline" href="/product">Explore the product</Link></div>
      </section>
    </main>
  );
}
