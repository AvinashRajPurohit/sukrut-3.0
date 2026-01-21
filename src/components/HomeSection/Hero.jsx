import Image from "next/image";
import Link from "next/link";
import heroData from "@/components/data/hero.json";
import HeroMockup from "../Mockups/HeroMockup";

export default function Hero() {
  return (
    <section
      className="relative w-full bg-white py-10 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Visual Decor: Subtle background glow behind the mockup area (Does not affect layout) */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-b from-blue-50/50 to-white -z-10 blur-3xl opacity-60" />

      <div className="mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE */}
        <div className="flex gap-10">

          {/* Side vertical nav */}
          <nav
            aria-label="Section navigation"
            className="hidden lg:flex flex-col gap-4 text-[11px] font-bold tracking-widest text-gray-300 pt-2 whitespace-nowrap cursor-pointer uppercase"
          >
            {heroData.sideNav.map((item, index) => (
              <div key={item} className="flex flex-col items-center group">
                <span className="writing-vertical-rl transition-colors duration-300 group-hover:text-[#E39A2E]">
                  {item}
                </span>
                {/* Decorative line between items */}
                {index !== heroData.sideNav.length - 1 && (
                   <div className="w-[1px] h-4 bg-gray-100 my-2" />
                )}
              </div>
            ))}
          </nav>

          {/* Main content */}
          <div className="px-16 space-y-6">
            
            {/* Styled Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-16">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E39A2E] mr-2 animate-pulse" />
              <span className="block text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
                {heroData.badge}
              </span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl lg:text-[58px] font-bold leading-[1.1] text-gray-900 tracking-tight"
            >
              {heroData.title.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-8 max-w-xl text-gray-500 text-lg leading-relaxed font-medium">
              {heroData.description}
            </p>

            {/* Improved Button UI */}
            <div className="mt-8">
              <Link
                href={heroData.cta.href}
                className="
                  inline-flex items-center justify-center 
                  rounded-xl bg-[#E39A2E] text-white 
                  px-8 py-4 text-md font-semibold 
                  shadow-lg shadow-orange-200 
                  transition-all duration-300 
                  hover:bg-[#d68b1d] hover:shadow-orange-300 hover:-translate-y-0.5
                "
              >
                {heroData.cta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
<div className="relative flex justify-center items-center">

  {/* BOTTOM FADE MASK */}
  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 
                  bg-gradient-to-t from-white to-transparent z-20" />

  {/* Subtle glow specifically behind the model center */}
  <div className="absolute w-[300px] h-[300px] bg-blue-100 rounded-full blur-[80px] -z-10" />

  <HeroMockup />
</div>
       
      </div>

      {/* SUPPORT SECTION BELOW HERO */}
      <div className="mx-auto max-w-[90%] px-6 -mt-10 relative z-20">
        <div
          className="
            flex flex-col lg:flex-row items-start lg:items-center
            justify-between gap-6
            rounded-t-2xl border border-gray-100 
            bg-white/70 backdrop-blur-xl 
            shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]
            h-auto lg:h-48 
            px-8 py-8
          "
        >
          {/* Left */}
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-16 h-16 border-white border px-2 py-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-sm">
              <Image
                src={heroData.supportSection.icon}
                alt=""
                width={32}
                height={32}
                className="opacity-90"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {heroData.supportSection.title}
            </h2>
          </div>

          {/* Right */}
          <p className="max-w-md text-gray-500 text-md leading-relaxed text-justify font-medium">
            {heroData.supportSection.description}
          </p>
        </div>
      </div>

    </section>
  );
}