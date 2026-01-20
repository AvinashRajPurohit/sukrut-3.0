import CTASection from "@/components/HomeSection/CTASection";
import FeatureCardsSection from "@/components/HomeSection/FeatureCardsSection";
import FocusSection from "@/components/HomeSection/FocusSection";
import Hero from "@/components/HomeSection/Hero";
import ImpactSection from "@/components/HomeSection/ImpactSection";
import ProcessSection from "@/components/HomeSection/ProcessSection";
import TeamSection from "@/components/HomeSection/TeamSection";
import WhyClientsSection from "@/components/HomeSection/WhyClientsSection";
import WorkflowSection from "@/components/HomeSection/WorkflowSection";


export default function Home() {
  return (
    <main
      role="main"
      className="mx-auto"
    >
      {/* HERO */}
      <Hero />
      {/* HOME – FOCUS SECTION */}
      <FocusSection />
      {/* HOME – IMPACT SECTION */}
      <ImpactSection />
      {/* HOME – FEATURE SECTION */}
      <FeatureCardsSection />
      {/* HOME – WHY CLIENT SECTION */}
      <WhyClientsSection />
      <WorkflowSection/>
       {/* HOME – PROCESS SECTION */}
      <ProcessSection/>
      <TeamSection/>
      <CTASection/>

    </main>
  );
}
