import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, Sparkles, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { DestinationCard } from '../components/common/DestinationCard';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { HARYANA_DISTRICTS, DESTINATION_CATEGORIES } from '../constants/haryanaData';

export const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = searchParams.get('category') || '';
  const districtParam = searchParams.get('district') || '';
  const isHiddenGemParam = searchParams.get('isHiddenGem') === 'true';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [keyword, setKeyword] = useState(keywordParam);
  const [destinations, setDestinations] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Sync search input if URL changes
  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  // Fetch destinations when searchParams change

  // Update query params helper
  const updateFilter = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined || value === 'All') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 whenever filters change, unless page itself is changing
    if (!('page' in updates)) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter({ keyword });
  };

  const clearAllFilters = () => {
    setKeyword('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    keywordParam || categoryParam || districtParam || isHiddenGemParam
  );

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Explore Haryana's Hidden Heritage
        </h1>
        <p className="mt-2 text-stone-600 text-sm max-w-2xl">
          Search and filter unmapped sanctuaries, forts, lakes, and prehistoric archaeological sites across all 22 districts.
        </p>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 flex items-center gap-2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus-within:ring-2 focus-within:ring-forest-600 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, history, district..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => {
                setKeyword('');
                updateFilter({ keyword: '' });
              }}
              className="text-xs text-stone-400 hover:text-stone-600 px-1"
            >
              Clear
            </button>
          )}
        </form>

        {/* Mobile Filter Toggle & Sort Select */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-stone-700 bg-stone-100 rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          <div className="flex items-center gap-2 text-sm text-stone-600">
            <span className="hidden sm:inline font-medium text-xs uppercase tracking-wider text-stone-400">
              Sort by:
            </span>
            <select
              value={sortParam}
              onChange={(e) => updateFilter({ sort: e.target.value })}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Added</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside
          className={`md:block ${showMobileFilter ? 'block' : 'hidden'
            } md:col-span-1 space-y-6 bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border md:border-none border-stone-200`}
        >
          {/* Active filter reset */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Filters Applied
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> Reset All
              </button>
            </div>
          )}

          {/* Hidden Gem Toggle */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isHiddenGemParam}
                onChange={(e) =>
                  updateFilter({ isHiddenGem: e.target.checked ? 'true' : null })
                }
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Hidden Gems Only</span>
              </div>
            </label>
            <p className="mt-1 text-[11px] text-stone-500 ml-7">
              Show crowd-free, secluded places with verified tranquility.
            </p>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => updateFilter({ category: null })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${!categoryParam
                    ? 'bg-forest-800 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                  }`}
              >
                All Categories
              </button>
              {DESTINATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateFilter({ category: cat.id })}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${categoryParam === cat.id
                      ? 'bg-forest-800 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                    }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* District Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Districts of Haryana
            </h3>
            <select
              value={districtParam}
              onChange={(e) => updateFilter({ district: e.target.value })}
              className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-forest-600 focus:outline-none cursor-pointer"
            >
              <option value="">All 22 Districts</option>
              {HARYANA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Destination Content */}
        <div className="md:col-span-3">
          {loading ? (
            <Loader message="Searching Haryana destinations..." />
          ) : error ? (
            <div className="p-8 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-center text-sm">
              <p className="font-semibold">Unable to fetch destinations.</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                No destinations match your filters
              </h3>
              <p className="mt-2 text-stone-500 text-sm max-w-md mx-auto">
                Try searching with a broader keyword, clearing the district filter, or exploring all categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={clearAllFilters}
                icon={RefreshCcw}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div>
              {/* Results count header */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
                <span>
                  Showing <strong className="text-stone-900">{destinations.length}</strong> of{' '}
                  <strong className="text-stone-900">{pagination.total}</strong> destinations
                </span>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((dest) => (
                  <DestinationCard key={dest._id || dest.slug} destination={dest} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => updateFilter({ page: pagination.page - 1 })}
                    icon={ChevronLeft}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateFilter({ page: p })}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${p === pagination.page
                              ? 'bg-forest-800 text-white'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => updateFilter({ page: pagination.page + 1 })}
                    icon={ChevronRight}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
