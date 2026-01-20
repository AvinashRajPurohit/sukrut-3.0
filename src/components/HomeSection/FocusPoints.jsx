"use client";

import {
  FiBox,
  FiCode,
  FiCloud,
} from "react-icons/fi";

const ICON_MAP = {
  product: FiBox,
  code: FiCode,
  cloud: FiCloud,
};

export default function FocusPoints({ data, active, onChange }) {
  return (
    <div className="space-y-6 ">
      {data.items.map((item) => {
        const isActive = active === item.id;
        const Icon = ICON_MAP[item.icon];

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              relative w-full text-left  px-6 py-8
              transition-all duration-300 cursor-pointer
              ${isActive
                ? "bg-[#3A3225] border border-[#E39A2E]"
                : "bg-black/30 hover:bg-black/40"}
            `}
          >
            {/* 🔥 ACTIVE LEFT LINE */}
            {isActive && (
              <span className="absolute left-0 top-0 h-full w-1 bg-[#E39A2E]" />
            )}

            <div className="flex items-center gap-4">
              {/* ICON */}
              <div
                className={`
                  flex h-12 w-12 items-center justify-center rounded-md
                  ${isActive ? "bg-[#E39A2E]/20 text-[#E39A2E]" : "bg-white/10 text-gray-300"}
                `}
              >
                <Icon size={22} />
              </div>

              {/* TEXT */}
              <div>
                <h3 className="font-medium text-lg text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
