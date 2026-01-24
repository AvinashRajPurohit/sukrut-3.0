export default function ReviewCard({ item, className = "" }) {
  const isValue = "description" in item && !("quote" in item);
  if (isValue) {
    return (
      <div
        className={`
          min-w-[260px] w-[260px] sm:min-w-[360px] sm:w-[360px] md:min-w-[420px] md:w-[420px] lg:min-w-[500px] lg:w-[500px]
          h-[240px] sm:h-[260px] md:h-[280px] lg:h-[300px]
          rounded-2xl md:rounded-3xl
          bg-white
          p-4 sm:p-5 md:p-7
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          border border-gray-100
          relative
          overflow-hidden
          transition-transform duration-300
          hover:-translate-y-1
          ${className}
        `.trim()}
      >
        {/* Premium background shapes */}
        <div className="absolute -top-8 -right-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#E39A2E]/[0.07] pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#E39A2E]/[0.05] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E39A2E]/[0.04] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-32 h-16 sm:w-40 sm:h-20 rounded-t-full bg-[#E39A2E]/[0.04] pointer-events-none -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-4 right-12 w-px h-16 sm:h-20 bg-[#E39A2E]/[0.08] pointer-events-none rotate-12" />
        <div className="absolute bottom-12 left-8 w-12 h-px sm:w-16 bg-[#E39A2E]/[0.06] pointer-events-none -rotate-6" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#E39A2E]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

        {/* Content: flex column to push tag to bottom */}
        <div className="relative flex flex-col h-full">
          <div className="flex items-start gap-3">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#E39A2E] shrink-0 mt-1" />
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-3 sm:mt-4 text-sm md:text-[15px] text-gray-700 leading-relaxed line-clamp-4 sm:line-clamp-none">
                {item.description}
              </p>
            </div>
          </div>
          {/* Bottom: tag pill in empty space */}
          {item.tag && (
            <div className="mt-auto pt-4 sm:pt-5 flex justify-end">
              <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium tracking-wide bg-[#E39A2E]/[0.08] text-[#E39A2E] border border-[#E39A2E]/15">
                {item.tag}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  /* Testimonial (legacy): author + quote */
  return (
    <div
      className={`
        min-w-[260px] w-[260px] sm:min-w-[360px] sm:w-[360px] md:min-w-[420px] md:w-[420px] lg:min-w-[500px] lg:w-[500px]
        h-[240px] sm:h-[260px] md:h-[280px] lg:h-[300px]
        rounded-2xl md:rounded-3xl
        bg-white
        p-4 sm:p-5 md:p-7
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        border border-gray-100
        relative
        overflow-hidden
        transition-transform duration-300
        hover:-translate-y-1
        ${className}
      `.trim()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#E39A2E]/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:14px_14px]" />
      <div className="relative flex items-center gap-3 md:gap-4">
        <img
          src={item.avatar}
          alt={item.author}
          className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-[#E39A2E]/20"
        />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
            {item.author}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">
            {item.role}
          </div>
        </div>
      </div>
      <div className="relative mt-4 sm:mt-5 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <p className="relative mt-4 md:mt-6 text-sm md:text-[15px] text-gray-700 leading-relaxed line-clamp-4 sm:line-clamp-none">
        <span className="text-[#E39A2E] text-xl font-serif leading-none mr-1">"</span>
        {item.quote}
        <span className="text-[#E39A2E] text-xl font-serif leading-none ml-1">"</span>
      </p>
    </div>
  );
}
