import FeatureCardsSection from "@/components/HomeSection/FeatureCardsSection";
import FocusSection from "@/components/HomeSection/FocusSection";
import Hero from "@/components/HomeSection/Hero";
import ImpactSection from "@/components/HomeSection/ImpactSection";
import ProcessSection from "@/components/HomeSection/ProcessSection";
import TeamSection from "@/components/HomeSection/TeamSection";
import WhyClientsSection from "@/components/HomeSection/WhyClientsSection";


export default function Home() {
  return (
    <main
      role="main"
      className="mx-auto px-6 py-20 space-y-32"
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
       {/* HOME – PROCESS SECTION */}
      <ProcessSection/>
      <TeamSection/>
    </main>
  );
}
