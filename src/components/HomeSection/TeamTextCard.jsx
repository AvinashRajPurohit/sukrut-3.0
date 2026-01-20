export default function TeamTextCard({ member, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-[260px] h-[300px]
        rounded-3xl bg-gray-100
        p-6 text-left
        hover:bg-gray-200 transition
      "
    >
      <h3 className="font-semibold text-black">{member.name}</h3>
      <p className="text-sm text-gray-500">{member.role}</p>

      <p className="mt-4 text-sm text-gray-600 line-clamp-4">
        {member.bio}
      </p>
    </button>
  );
}
