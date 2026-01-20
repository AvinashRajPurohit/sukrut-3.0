import Image from 'next/image';
import Link from 'next/link';
import aboutData from '@/components/data/about.json';

export default function JournalSection() {
  const { journal } = aboutData;

  return (
    <section
      className="relative w-full bg-white py-20 lg:py-32"
      aria-labelledby="journal-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            id="journal-heading"
            className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 mb-4"
          >
            {journal.title}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            {journal.subtitle}
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {journal.articles.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Article Image */}
              <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                <Image
                  src={article.image.src}
                  alt={article.image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {article.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <time>{article.date}</time>
                  <span className="text-gray-500">
                    {article.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="text-center">
          <Link
            href={journal.cta.href}
            className="inline-block px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            {journal.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
