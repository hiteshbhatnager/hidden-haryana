import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { destinationService } from '../../services/destinationService';
import { DestinationCard } from '../common/DestinationCard';

export const RecentlyAdded = () => {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await destinationService.getRecent();
        setRecent(data);
      } catch (err) {
        console.error('Error fetching recent destinations:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (!loading && recent.length === 0) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest-800 mb-2">
            <Clock className="w-3.5 h-3.5 text-forest-700" />
            <span>Freshly Catalogued</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Recently Added Destinations
          </h2>
          <p className="mt-2 text-stone-600 text-sm max-w-xl">
            Newly verified sites mapped with visiting timings, entry details, and road conditions.
          </p>
        </div>

        <Link
          to="/explore?sort=newest"
          className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950 transition-colors"
        >
          View all recent <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recent.map((dest) => (
          <DestinationCard key={dest._id || dest.slug} destination={dest} />
        ))}
      </div>
    </section>
  );
};

