import data from "@/components/data/values.json";
import EnvelopeReviews from "./ReviewEnvelope";

export default function WhyClientsSection() {
  return (
    <section className="bg-white py-10 pb-60">
      <div className="mx-auto max-w-[90%] px-6">

        <div className="text-center mb-24">
          <span className="inline-flex gap-2 rounded-full border px-4 py-2 text-sm text-[#E39A2E]">
            ⚡ {data.badge}
          </span>
          <h2 className="mt-6 text-4xl font-semibold text-black">
            {data.heading}
          </h2>
        </div>

        <EnvelopeReviews items={data.items} />
      </div>
    </section>
  );
}
