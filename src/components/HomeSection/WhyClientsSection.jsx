import data from "@/components/data/values.json";
import TestimonialVideo from "./TestimonialVideo";
import TestimonialCard from "./TestimonialCard";


export default function WhyClientsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[90%] px-6">

        {/* 🔹 CENTER HEADER */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E39A2E] px-4 py-2 text-sm text-[#E39A2E]">
            ⚡ {data.badge}
          </span>

          <h2 className="mt-6 text-3xl lg:text-4xl font-semibold tracking-tight text-black">
            {data.heading}
          </h2>
        </div>

        {/* 🔹 GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

          {data.items.map((item) => {
            if (item.type === "video") {
              return <TestimonialVideo key={item.id} poster={item.poster} />;
            }

            return <TestimonialCard key={item.id} item={item} />;
          })}

        </div>
      </div>
    </section>
  );
}
