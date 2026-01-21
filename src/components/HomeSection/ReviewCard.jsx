export default function ReviewCard({ item }) {
  return (
    <div
      className="
        w-[500px] h-[300px]
        rounded-3xl
        bg-white
        p-7
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        border border-gray-100
        relative
        overflow-hidden
        transition-transform duration-300
        hover:-translate-y-1
      "
    >

      {/* soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E39A2E]/5 via-transparent to-transparent pointer-events-none" />
<div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:14px_14px]" />
      {/* header */}
      <div className="relative flex items-center gap-4">
        <img
          src={item.avatar}
          alt={item.author}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#E39A2E]/20"
        />
        <div>
          <div className="font-semibold text-gray-900">
            {item.author}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {item.role}
          </div>
          
        </div>
      </div>
      <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      {/* quote */}
      <p className="relative mt-6 text-[15px] text-gray-700 leading-relaxed">
        <span className="text-[#E39A2E] text-xl font-serif leading-none mr-1">
          “
        </span>
        {item.quote}
        <span className="text-[#E39A2E] text-xl font-serif leading-none ml-1">
          ”
        </span>
      </p>
    </div>
  );
}
