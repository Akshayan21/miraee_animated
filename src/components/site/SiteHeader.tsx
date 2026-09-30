"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Product", href: "/product" },
  { label: "Why Miraee", href: "/why-miraee" },
  { label: "Pricing", href: "/pricing" },
  { label: "Solutions", href: "/solutions" },
  { label: "AI & Technology", href: "/ai-technology" },
  { label: "Company", href: "/company" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-3.5 pointer-events-none" data-gsap="site-header">
      <div className={`pointer-events-auto relative flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[color-mix(in_srgb,var(--color-background-deep)_92%,transparent)] shadow-[0_6px_20px_rgba(0,0,0,.14)] backdrop-blur-[20px] transition-[width,height,padding] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${compact ? "h-[52px] w-[300px] max-w-full pr-1.5 pl-4 max-lg:w-[340px]" : "h-[60px] w-[1120px] max-w-full pr-2 pl-5 max-lg:w-auto max-lg:gap-6 max-md:h-[56px] max-md:pl-4"}`}>
        <Link className="inline-flex flex-shrink-0 items-center gap-2.5 no-underline" href="/" aria-label="Miraee home">
          <img className="block h-[21px] w-auto" src="/brand/icons/Miraee_Logo.png" alt="Miraee" />
        </Link>

        <nav className={`flex min-w-0 flex-[0_1_auto] items-center justify-center gap-0.5 overflow-hidden text-[13.5px] font-semibold whitespace-nowrap transition-[max-width,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] max-lg:hidden ${compact ? "hidden" : "max-w-[720px] opacity-100"}`} aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.href} className={`rounded-full px-[13px] py-[9px] no-underline transition-colors duration-200 hover:bg-white/8 hover:text-white ${pathname === item.href ? "bg-white/8 text-white" : "text-white/72"}`} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2.5">
          <Link className={`overflow-hidden rounded-full border text-[13px] font-bold whitespace-nowrap text-white no-underline transition-[max-width,opacity,border-color,background-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:border-white/32 hover:bg-white/6 max-md:hidden ${compact ? "hidden" : "max-w-[110px] border-white/16 px-[18px] py-2.5 opacity-100"}`} href="/sign-in">Sign In</Link>
          <Link className="rounded-full bg-brand px-5 py-2.5 text-[13px] font-bold whitespace-nowrap text-white no-underline transition-transform duration-150 active:scale-95 max-md:px-3.5 max-md:text-xs" href="/request-demo">Request a Demo</Link>
          <button className="relative hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/16 bg-transparent max-lg:flex" type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
            <i className={`absolute h-[1.5px] w-[15px] rounded bg-white transition-transform ${menuOpen ? "rotate-45" : "-translate-y-[3px]"}`} />
            <i className={`absolute h-[1.5px] w-[15px] rounded bg-white transition-transform ${menuOpen ? "-rotate-45" : "translate-y-[3px]"}`} />
          </button>
        </div>

        {menuOpen && (
          <nav className="absolute top-[calc(100%+10px)] right-0 grid min-w-[240px] gap-1 rounded-2xl border border-white/10 bg-background-deep p-2 shadow-[0_20px_50px_rgba(0,0,0,.28)] lg:hidden" aria-label="Mobile navigation">
            {navigation.map((item) => <Link key={item.href} className="rounded-xl px-4 py-3 text-sm font-semibold text-white/76 no-underline hover:bg-white/8 hover:text-white" href={item.href}>{item.label}</Link>)}
            <Link className="rounded-xl px-4 py-3 text-sm font-semibold text-white/76 no-underline hover:bg-white/8 hover:text-white md:hidden" href="/sign-in">Sign In</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
