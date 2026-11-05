import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Mountain, Waves, Compass, Sparkles, Wheat, Trees, ArrowRight } from 'lucide-react';
import { DESTINATION_CATEGORIES } from '../../constants/haryanaData';

const iconMap = {
  Landmark,
  Mountain,
  Waves,
  Compass,
  Sparkles,
  Wheat,
};

export const CategoryBrowse = () => {
  return (
    <section className="py-16 bg-cream-50/70 border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-forest-800 uppercase block mb-1">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
              Browse by Tourism Category
            </h2>
          </div>
          <Link
            to="/explore"
            className="mt-3 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950 transition-colors"
          >
            Explore all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATION_CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.icon] || Landmark;
            return (
              <Link
                key={cat.id}
                to={`/explore?category=${encodeURIComponent(cat.id)}`}
                className="group relative p-6 bg-white rounded-2xl border border-stone-200/80 hover:border-forest-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 group-hover:bg-forest-800 group-hover:text-white transition-colors duration-300 mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 group-hover:text-forest-900 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-forest-800">
                  <span>{cat.count}</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View places <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
