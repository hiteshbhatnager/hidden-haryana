import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { destinationService } from '../../services/destinationService';
import { DestinationCard } from '../common/DestinationCard';
import { Button } from '../common/Button';

export const HiddenGemsSection = () => {
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGems = async () => {
      try {
        const data = await destinationService.getHiddenGems();
        setHiddenGems(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching hidden gems:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGems();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-stone-900 via-charcoal-900 to-stone-950 text-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Off The Beaten Track</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Lesser-Known Hidden Gems
            </h2>
            <p className="mt-2 text-stone-400 text-sm max-w-xl">
              Escape the tourist rush. These secluded sanctuaries and historical sites offer peaceful exploration and authentic local hospitality.
            </p>
          </div>

          <Link
            to="/explore?isHiddenGem=true"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            See all secret spots <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-stone-400">Finding hidden gems...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hiddenGems.map((gem) => (
              <DestinationCard key={gem._id || gem.slug} destination={gem} />
            ))}
          </div>
        )}

        {/* Discovery tip banner */}
        <div className="mt-14 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Know a secluded spot in your district?</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Help local tourism flourish by submitting photos, visiting hours and travel tips to our verification desk.
              </p>
            </div>
          </div>
          <Link to="/about">
            <Button variant="accent" size="sm" className="whitespace-nowrap">
              Learn How We Verify
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
