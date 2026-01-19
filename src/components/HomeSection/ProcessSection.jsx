import data from "@/components/data/process.json";
import ProcessTimeline from "./ProcessTimeline";
import Link from "next/link";

export default function ProcessSection() {
  return (
    <section className="py-28 bg-white shadow-md rounded-4xl">
      <div className="mx-auto max-w-[90%] px-6">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">

          {/* LEFT */}
          <div>
            <h2 className="text-5xl max-w-lg font-semibold text-black leading-tight">
              {data.heading}
            </h2>
          </div>

          {/* RIGHT */}
          <div className="space-y-10 flex flex-col items-end">
            <Link
              href={data.cta.href}
              className="inline-flex mt-6 rounded-full border border-gray-500 px-4 py-2 text-sm bg-white text-black hover:bg-black hover:text-white transition"
            >
              {data.cta.label}
            </Link>
            
            <p className="text-gray-600 leading-relaxed max-w-lg">
              {data.description}
            </p>

            
          </div>

        </div>

        {/* TIMELINE */}
        <div className="py-20">
        <ProcessTimeline steps={data.steps} />
</div>
      </div>
    </section>
  );
}
