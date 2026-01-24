export default function ProcessStep({ step, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full md:w-36 md:min-w-0 lg:w-40 md:flex-shrink-0 gap-3 md:gap-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E39A2E]/50 focus-visible:ring-offset-2 group"
      aria-current={active ? "step" : undefined}
    >
      {/* DOT */}
      <div
        className={`
          w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shrink-0 z-10
          transition-all duration-500 ease-out
          ${
            active
              ? "bg-[#E39A2E] scale-125 shadow-[0_0_0_4px_rgba(227,154,46,0.15)] sm:shadow-[0_0_0_6px_rgba(227,154,46,0.15)]"
              : "bg-gray-300 scale-100 group-hover:bg-gray-400"
          }
        `}
      />

      {/* TEXT — on mobile: flex-1 beside dot; on desktop: below dot */}
      <div className="flex-1 min-w-0 md:flex-initial mt-0 md:mt-2 lg:mt-4 transition-colors duration-300">
        <div
          className={`
            text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-tight
            ${active ? "text-[#E39A2E]" : "text-gray-400 group-hover:text-gray-600"}
          `}
        >
          {step.title}
        </div>
        <div
          className={`
            mt-0.5 sm:mt-1 md:mt-2 lg:mt-4 text-[10px] sm:text-xs md:text-sm leading-snug
            ${active ? "text-[#E39A2E]/90" : "text-gray-400 group-hover:text-gray-500"}
          `}
        >
          {step.subtitle}
        </div>
      </div>
    </button>
  );
}
