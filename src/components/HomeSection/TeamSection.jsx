import data from "@/components/data/team.json";
import TeamCarousel from "./TeamCarousel";

export default function TeamSection() {
  return (
    <section className="py-28 bg-white">
      <div className="mx-auto max-w-[90%] px-6">

        {/* HEADER */}
        <div className="flex items-center justify-center mb-16">
          <h2 className="text-5xl font-semibold text-black text-center">
            {data.heading}
          </h2>
        </div>

        <TeamCarousel members={data.members} />

      </div>
    </section>
  );
}
