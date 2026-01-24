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
    <main role="main" className="mx-auto max-w-full overflow-x-hidden">
      
      {/* 1. HERO (ID: hero) */}
      <div id="hero">
        <Hero />
      </div>

      {/* 2. FOCUS (ID: focus) */}
      <div id="focus">
        <FocusSection />
      </div>

      {/* 3. IMPACT (ID: impact) */}
      <div id="impact">
        <ImpactSection />
      </div>

      {/* 4. FEATURE (ID: capabilities) */}
      <div id="capabilities">
        <FeatureCardsSection />
      </div>

      {/* 5. WHY CLIENTS (ID: clients) */}
      <div id="clients">
        <WhyClientsSection />
      </div>

      {/* 6. WORKFLOW (ID: workflow) */}
      <div id="workflow">
        <WorkflowSection />
      </div>

       {/* 7. PROCESS (ID: process) */}
      <div id="process">
        <ProcessSection />
      </div>
       {/* <TeamSection/> */}
      {/* 8. CTA (ID: contact) */}
      <div id="contact">
        <CTASection />
      </div>

    </main>
  );
}