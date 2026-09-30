import type { Metadata } from "next";
import { WhyMiraeeHero } from "@/components/why-miraee/WhyMiraeeHero";
import { ComparisonTable } from "@/components/why-miraee/ComparisonTable";
import { ImplementationSteps } from "@/components/why-miraee/ImplementationSteps";
import { HardQuestions } from "@/components/why-miraee/HardQuestions";
import { CtaSection } from "@/components/miraee/CtaSection";

export const metadata: Metadata = {
  title: "Why Miraee — Same Trip, Different Operating Model",
  description: "See how Miraee compares to a legacy TMC or first-gen T&E tool, how fast programs go live, and answers to the hard questions.",
};

export default function WhyMiraeePage() {
  return (
    <main>
      <WhyMiraeeHero />
      <ComparisonTable />
      <ImplementationSteps />
      <HardQuestions />
      <CtaSection primaryHref="/request-demo" secondaryHref="/pricing" />
    </main>
  );
}
