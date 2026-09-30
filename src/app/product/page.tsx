import type { Metadata } from "next";
import { ProductHero } from "@/components/product/ProductHero";
import { DesignedForEveryone } from "@/components/product/DesignedForEveryone";
import { PlatformCapabilities } from "@/components/product/PlatformCapabilities";
import { SavingsFlywheel } from "@/components/product/SavingsFlywheel";
import { ConnectedSystems } from "@/components/product/ConnectedSystems";
import { TabhiAdvantage } from "@/components/product/TabhiAdvantage";
import { FaqSection } from "@/components/product/FaqSection";
import { CtaSection } from "@/components/miraee/CtaSection";

export const metadata: Metadata = {
  title: "Miraee Product — One journey, one connected experience",
  description: "See how Miraee keeps planning, booking, approvals, support and expenses connected in one product.",
};

export default function ProductPage() {
  return (
    <main>
      <ProductHero />
      <DesignedForEveryone />
      <PlatformCapabilities />
      <SavingsFlywheel />
      <ConnectedSystems />
      <TabhiAdvantage />
      <FaqSection />
      <CtaSection primaryHref="/request-demo" secondaryHref="/pricing" />
    </main>
  );
}
