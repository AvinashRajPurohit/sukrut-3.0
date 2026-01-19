import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function MenuAction({ data }) {
  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className="flex items-center  gap-10"
    >
      {data.items.map((item) => {
        const isCaseStudy = item.title === "Case Studies";

        return (
          <Link
            key={item.id}
            href={item.href}
            className="
              flex items-center gap-1.5
              text-sm font-medium text-gray-800
              hover:text-[#E39A2E]
              transition-colors
            "
          >
            <span>{item.title}</span>

            {/* Icon only for Case Studies */}
            {isCaseStudy && (
              <FiArrowUpRight
                size={14}
                className="text-gray-500"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
