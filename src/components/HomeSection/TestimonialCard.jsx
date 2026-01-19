import Image from "next/image";

export default function TestimonialCard({ item }) {
  return (
    <div className="rounded-3xl bg-[#FFF6EA] p-10 h-full flex flex-col justify-between">

      <div>
        <h3 className="font-semibold text-lg text-black">
          {item.title}
        </h3>

        <p className="mt-4 text-gray-700 leading-relaxed">
          “{item.quote}”
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Image
          src={item.avatar}
          alt={item.author}
          width={40}
          height={40}
          className="rounded-full"
        />

        <div>
          <div className="text-sm font-medium text-black">
            {item.author}
          </div>
          <div className="text-xs text-gray-600">
            {item.role}
          </div>
        </div>
      </div>
    </div>
  );
}
