import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { destinationService } from '../../services/destinationService';
import { DestinationCard } from '../common/DestinationCard';
import { Loader } from '../common/Loader';

export const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await destinationService.getFeatured();
        setDestinations(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured destinations:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Editor's Spotlight</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Featured Destinations
          </h2>
          <p className="mt-2 text-stone-600 text-sm max-w-xl">
            Remarkable heritage landmarks and scenic nature spots that showcase Haryana's unique geography and deep history.
          </p>
        </div>

        <Link
          to="/explore?isFeatured=true"
          className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950 transition-colors"
        >
          View all featured <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <Loader message="Loading featured places..." />
      ) : error ? (
        <div className="text-center py-12 p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-sm">
          Failed to load featured destinations. Please ensure the backend server is running.
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-12 text-stone-500 text-sm">
          No featured destinations found at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <DestinationCard key={dest._id || dest.slug} destination={dest} />
          ))}
        </div>
      )}
    </section>
  );
};

