import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ArrowRight, Compass, Filter } from 'lucide-react';
import { HARYANA_DISTRICTS } from '../../constants/haryanaData';
import { Button } from '../common/Button';

export const Hero = () => {
  const [keyword, setKeyword] = useState('');
  const [district, setDistrict] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (district && district !== 'All') params.append('district', district);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 w-80 h-80 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-900 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Discover The Uncharted Side of Haryana</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-forest-950 leading-[1.15]">
            Beyond the Highways:{' '}
            <span className="text-terracotta-600 italic">Hidden Treasures</span> of Haryana
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Lesser-known lake sanctuaries, 5,000-year-old Harappan citadels, Mughal water palaces, and quiet Shivalik pine valleys — curated in one verified destination portal.
          </p>

          {/* Unified Search Box */}
          <div className="mt-10 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-forest-950/5 border border-stone-200/90 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              {/* Keyword input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 w-full border-b sm:border-b-0 sm:border-r border-stone-200">
                <Search className="w-5 h-5 text-forest-700 shrink-0" />
                <input
                  type="text"
                  placeholder="Search ruins, lakes, forts, hills (e.g. Tikkar Taal)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
                />
              </div>

              {/* District dropdown */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-stone-200">
                <MapPin className="w-5 h-5 text-terracotta-600 shrink-0" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-transparent text-sm text-stone-800 focus:outline-none cursor-pointer"
                >
                  <option value="">All 22 Districts</option>
                  {HARYANA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search submit button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto px-6 py-3 shrink-0"
                icon={Compass}
              >
                Find Destinations
              </Button>
            </form>
          </div>

          {/* Quick tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Popular Searches:</span>
            {['Morni Hills', 'Narnaul Jal Mahal', 'Rakhigarhi', 'Bhindawas Wetland', 'Tosham Rock'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/explore?keyword=${encodeURIComponent(tag)}`)}
                  className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-forest-100 hover:text-forest-900 text-stone-700 transition-colors border border-stone-200/70"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 text-center">
            <span className="block font-serif text-2xl font-bold text-forest-900">22</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Districts Covered</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 text-center">
            <span className="block font-serif text-2xl font-bold text-terracotta-600">5000+ BCE</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Harappan History</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 text-center">
            <span className="block font-serif text-2xl font-bold text-forest-900">250+</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Migratory Bird Species</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 text-center">
            <span className="block font-serif text-2xl font-bold text-emerald-700">100%</span>
            <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Verified Coordinates</span>
          </div>
        </div>
      </div>
    </section>
  );
};

