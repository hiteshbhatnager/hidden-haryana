import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ArrowUpRight, Clock, IndianRupee } from 'lucide-react';
import { Badge } from './Badge';

export const DestinationCard = ({ destination, variant = 'default' }) => {
  const primaryImage =
    destination.images && destination.images.length > 0
      ? destination.images[0].url
      : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  const identifier = destination.slug || destination._id;

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-forest-400 hover:shadow-xl transition-all duration-300">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant="forest" size="sm" className="bg-white/90 backdrop-blur-md text-forest-950 font-semibold shadow-sm">
            {destination.category}
          </Badge>

          {destination.isHiddenGem && (
            <Badge variant="gem" size="sm" className="bg-amber-500 text-stone-950 font-bold shadow-md" icon={Sparkles}>
              Hidden Gem
            </Badge>
          )}
        </div>

        {/* Bottom location in image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 font-medium drop-shadow-sm bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
            {destination.district}, Haryana
          </span>

          {destination.rating && (
            <span className="flex items-center gap-1 font-bold bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {destination.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Content body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-forest-800 transition-colors line-clamp-1">
            <Link to={`/destinations/${identifier}`} className="focus:outline-none">
              {destination.name}
            </Link>
          </h3>

          <p className="mt-2 text-stone-600 text-sm line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Metadata footer */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1 text-stone-700 font-medium">
            {destination.entryFee?.isFree ? (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Free Entry
              </span>
            ) : (
              <span className="flex items-center text-stone-800 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                <IndianRupee className="w-3 h-3 inline" />
                {destination.entryFee?.amount || 25}
              </span>
            )}
          </div>

          <Link
            to={`/destinations/${identifier}`}
            className="inline-flex items-center gap-1 font-semibold text-forest-800 hover:text-forest-950 group-hover:translate-x-0.5 transition-transform"
          >
            Explore
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
