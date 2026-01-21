import FeatureCard from "./FeatureCard";
import cards from "@/components/data/featureCards.json";

export default function FeatureCardsSection() {
  return (
    <section className="py-44">
      {/* ===== CENTER HEADER ===== */}
      <div className="mx-auto  text-center mb-20">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-4 py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-transform hover:scale-105 cursor-default">
  {/* Pulsing Dot Animation */}
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
  </span>

  {/* Text Styling */}
  <span className="text-xs font-bold tracking-widest text-[#E39A2E] ">
    Core Capabilities
  </span>
</span>
        <h2 className="mt-6 text-4xl font-semibold leading-snug text-black">
          Systems Built for Scale, Performance & Longevity
        </h2>
      </div>
      <div className="mx-auto max-w-[90%] grid grid-cols-[2fr_1fr] gap-6 py-10">

        <div className="flex flex-col gap-6">

          <div className="grid grid-cols-[2fr_1fr] gap-5">
            <div className="h-[550px]">
              <FeatureCard item={cards[0]} />
            </div>

            <div className="h-[550px]">
              <FeatureCard item={cards[1]} />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-5">
            <div className="h-[360px]">
              <FeatureCard item={cards[3]} />
            </div>

            <div className="h-[360px]">
              <FeatureCard item={cards[4]} />
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-6">

          <div className="h-[350px]">
            <FeatureCard item={cards[2]} />
          </div>

          <div className="h-[560px]">
            <FeatureCard item={cards[5]} />
          </div>

        </div>

      </div>
    </section>
  );
}
