import data from "@/components/data/team.json";
import TeamCarousel from "./TeamCarousel";

export default function TeamSection() {
  return (
    <section className=" bg-white">
      <div className="mx-auto px-6">

        {/* HEADER */}
        <div className="flex items-center justify-center">
          <h2 className="text-5xl font-bold text-black text-center">
            {data.heading}
          </h2>
        </div>

        <TeamCarousel members={data.members} />

      </div>
    </section>
  );
}
