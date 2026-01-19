import FocusSection from "@/components/HomeSection/FocusSection";
import Hero from "@/components/HomeSection/Hero";


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
    </main>
  );
}
