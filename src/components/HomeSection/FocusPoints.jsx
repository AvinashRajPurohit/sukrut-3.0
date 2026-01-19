"use client";

export default function FocusPoints({ data, active, onChange }) {
  return (
    <div className="space-y-8">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-1 text-xs">
        ⚡ {data.badge}
      </span>

      {/* Title */}
      <h2 className="text-3xl font-semibold leading-snug">
        {data.title.split("\n").map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
      </h2>

      {/* Points */}
      <div className="space-y-3 pt-6">
        {data.items.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full text-left rounded-xl p-4 transition-all
                ${isActive
                  ? "bg-[#3A3225] border border-[#E39A2E]"
                  : "bg-black/30 hover:bg-black/40"}
              `}
            >
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-300 mt-1">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
