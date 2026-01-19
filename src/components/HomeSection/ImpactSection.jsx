import impactData from "@/components/data/impact.json";
import OrbitCircles from "./OrbitGraphic";

export default function ImpactSection() {
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-[90%] px-6">

        {/* 🔥 CENTER HEADER (SAME PATTERN AS FOCUS) */}
        <div className="text-center  mx-auto mb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E39A2E] px-4 py-2 text-sm text-[#E39A2E]">
            ⚡ {impactData.badge}
          </span>

          <h2 className="mt-6 text-4xl font-semibold leading-snug text-black">
            {impactData.title}
          </h2>
        </div>

        {/* 🔥 CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center justify-between py-20">

          {/* LEFT CONTENT */}
          <div>
            <p className="text-4xl max-w-2xl leading-relaxed text-gray-700">
              {impactData.heading.line1}
              <span className="text-gray-500">
                {impactData.heading.line2}
              </span>
            </p>

            {/* STATS */}
            <div className="mt-16 grid grid-cols-2 gap-x-16 gap-y-12">
              {impactData.stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-semibold text-black">
                    {stat.value}
                  </div>
                  <div className="mt-2 h-px w-1/2 bg-gray-300" />
                  <div className="mt-2 text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
<div className="h-full w-full mx-auto">
          {/* RIGHT VISUAL */}
          <OrbitCircles points={impactData.orbitPoints} />
</div>
        </div>
      </div>
    </section>
  );
}
