import Link from "next/link";

const groups = [
  { title: "Product", links: [["Product", "/product"], ["AI travel assistant", "/ai-technology"], ["Integrations", "/product"], ["Implementation", "/product"]] },
  { title: "Solutions", links: [["Employees", "/solutions"], ["Finance", "/solutions"], ["Travel leads", "/solutions"], ["Use cases", "/solutions"]] },
  { title: "Company", links: [["Why Miraee", "/why-miraee"], ["Company", "/company"], ["Resources", "/company"], ["Careers", "/company"]] },
  { title: "Get started", links: [["Request a Demo", "/request-demo"], ["Pricing", "/pricing"], ["Sign In", "/sign-in"], ["Savings analysis", "/pricing"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="[padding:clamp(48px,7vw,88px)_clamp(24px,7vw,64px)_24px] bg-background-deep text-white">
      <div className="mx-auto grid max-w-[1360px] grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10 text-sm text-[#aaa5ae] max-lg:grid-cols-2">
        <div className="max-lg:col-span-2">
          <Link className="inline-flex items-center gap-2.5 no-underline" href="/"><img className="block h-[30px] w-auto" src="/brand/icons/Miraee_Logo.png" alt="Miraee" /></Link>
          <p className="mt-4 mb-0 max-w-[30ch] leading-[1.6]">Your team&apos;s personal travel agent. Booking, support and expenses, together.</p>
          <div className="mt-6 text-[11px] font-bold tracking-[.14em] text-[#857f8c] uppercase">Travel Limitless</div>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <b className="mb-3 block text-sm text-white">{group.title}</b>
            {group.links.map(([label, href]) => <Link key={label} className="block py-2 text-[#aaa5ae] no-underline transition-colors duration-200 hover:text-brand" href={href}>{label}</Link>)}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-[clamp(40px,6vw,72px)] flex max-w-[1360px] flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-xs font-semibold tracking-[.06em] text-[#857f8c] max-md:flex-col max-md:items-start">
        <span>© 2026 Miraee · a Tabhi group company</span>
        <div className="flex flex-wrap gap-5"><Link className="text-[#aaa5ae] no-underline transition-colors hover:text-brand" href="/company">Terms &amp; Conditions</Link><Link className="text-[#aaa5ae] no-underline transition-colors hover:text-brand" href="/company">Privacy Policy</Link></div>
        <span>Mondee One · Miraee · Abhee — three products, one platform</span>
      </div>
    </footer>
  );
}
