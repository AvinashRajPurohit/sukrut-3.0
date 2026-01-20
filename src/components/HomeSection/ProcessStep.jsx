export default function ProcessStep({ step, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        relative flex flex-col items-center text-center w-40
        cursor-pointer focus:outline-none group
      "
      aria-current={active ? "step" : undefined}
    >
      {/* DOT */}
      <div
  className={`
    w-4 h-4 rounded-full z-10
    transition-all duration-500 ease-out
    ${
      active
        ? "bg-[#E39A2E] scale-125 shadow-[0_0_0_6px_rgba(227,154,46,0.15)]"
        : "bg-gray-300 scale-100 group-hover:bg-gray-400"
    }
  `}
/>


      {/* TEXT */}
      <div className="mt-6 transition-colors duration-300">
        {/* TITLE */}
        <div
          className={`
            text-lg font-medium
            ${active ? "text-[#E39A2E]" : "text-gray-400 group-hover:text-gray-600"}
          `}
        >
          {step.title}
        </div>

        {/* SUBTITLE */}
        <div
          className={`
            mt-4 text-sm leading-snug
            ${
              active
                ? "text-[#E39A2E]/90"
                : "text-gray-400 group-hover:text-gray-500"
            }
          `}
        >
          {step.subtitle}
        </div>
      </div>
    </button>
  );
}
