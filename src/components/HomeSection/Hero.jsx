import Image from "next/image";
import Link from "next/link";
import heroData from "@/components/data/hero.json";
import HeroMockup from "../Mockups/HeroMockup";


export default function Hero() {
  return (
    <section
      className="relative w-full bg-white py-24"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto px-6  pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <div className="flex gap-10">

          {/* Side vertical nav */}
          <nav
            aria-label="Section navigation"
            className="hidden lg:flex flex-col gap-3 text-xs text-gray-400 pt-2 whitespace-nowrap cursor-pointer"
          >
            {heroData.sideNav.map((item) => (
              <span key={item} className="cursor-default">
                {item}
              </span>
            ))}
          </nav>

          {/* Main content */}
          <div className="px-16 space-y-5">
            <span className="block text-sm tracking-widest text-gray-500 mb-4">
              {heroData.badge}
            </span>

            <h1
              id="hero-heading"
              className="text-4xl lg:text-[55px] font-semibold leading-tight text-black"
            >
              {heroData.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-xl text-gray-600 text-lg leading-relaxed">
              {heroData.description}
            </p>

            <Link
              href={heroData.cta.href}
              className="inline-block mt-8 rounded-lg border border-[#E39A2E] hover:bg-[#E39A2E] hover:text-white px-6 py-3 text-md font-medium text-[#E39A2E] transition-colors"
            >
              {heroData.cta.label}
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
       
          <div className="relative flex justify-center">
  <HeroMockup />
</div>
       

      </div>

      {/* SUPPORT SECTION BELOW HERO */}
<div className="mx-auto max-w-[90%] px-6 -mt-10">
  <div
    className="
      flex flex-col lg:flex-row items-start lg:items-center
      justify-between gap-6
      rounded-t-2xl border bg-white/20 backdrop-blur-3xl h-48 
      px-8 py-6
    "
  >
    {/* Left */}
    <div className="flex items-center gap-4">
        <div className="border-gray-100 border px-2 py-2 rounded-2xl bg-white/20 backdrop-blur-3xl">
      <Image
        src={heroData.supportSection.icon}
        alt=""
        width={40}
        height={40}
      />
</div>
      <h2 className="text-2xl font-medium text-black">
        {heroData.supportSection.title}
      </h2>
    </div>

    {/* Right */}
    <p className="max-w-md text-gray-600 text-md leading-relaxed text-justify">
      {heroData.supportSection.description}
    </p>
  </div>
</div>

    </section>
  );
}
