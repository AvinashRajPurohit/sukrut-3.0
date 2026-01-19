import Image from "next/image";

export default function TestimonialVideo({ poster }) {
  return (
    <div className="relative rounded-3xl overflow-hidden h-[420px] flex items-center justify-center bg-black">

      <Image
        src={poster}
        alt="Client testimonial video"
        fill
        className="h-full w-full"
        priority
      />

      {/* PLAY BUTTON */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
          ▶
        </div>
      </div>
    </div>
  );
}
