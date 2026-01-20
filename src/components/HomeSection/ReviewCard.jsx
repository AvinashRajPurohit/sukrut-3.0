export default function ReviewCard({ item, className = "" }) {
  return (
    <div
      className={`
        absolute w-[320px] rounded-2xl bg-white p-6
        shadow-xl border border-gray-100
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        <img
          src={item.avatar}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-medium text-black">{item.author}</div>
          <div className="text-xs text-gray-500">{item.role}</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        “{item.quote}”
      </p>
    </div>
  );
}
