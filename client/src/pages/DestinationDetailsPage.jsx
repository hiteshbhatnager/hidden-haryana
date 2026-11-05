import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  IndianRupee,
  Sparkles,
  Calendar,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  ChevronLeft,
  Share2,
  Bookmark,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { DestinationCard } from '../components/common/DestinationCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { InteractiveMap } from '../components/common/InteractiveMap';

export const DestinationDetailsPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setSelectedImageIndex(0);
      try {
        const res = await destinationService.getByIdOrSlug(idOrSlug);
        setData(res);
      } catch (err) {
        console.error('Error loading destination:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data?.destination?.name || 'Hidden Haryana Destination',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader message="Gathering destination history & directions..." />
      </div>
    );
  }

  if (error || !data?.destination) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Destination Not Found
        </h2>
        <p className="mt-2 text-stone-600 text-sm">
          {error || "We couldn't locate this destination in our Haryana registry."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="primary" size="sm" onClick={() => navigate('/explore')}>
            Browse All Destinations
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const { destination, relatedDestinations = [] } = data;
  const images = destination.images && destination.images.length > 0 ? destination.images : [
    { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', caption: destination.name }
  ];

  const currentImage = images[selectedImageIndex] || images[0];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${destination.coordinates?.latitude},${destination.coordinates?.longitude}`;

  return (
    <article className="py-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Link to="/" className="hover:text-stone-900">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-stone-900">Destinations</Link>
          <span>/</span>
          <Link to={`/explore?district=${encodeURIComponent(destination.district)}`} className="hover:text-stone-900">
            {destination.district}
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold truncate">{destination.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare} icon={Share2}>
            {copied ? 'Copied Link!' : 'Share'}
          </Button>
        </div>
      </div>

      {/* Main Title & District */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="forest" size="md">
            {destination.category}
          </Badge>
          {destination.isHiddenGem && (
            <Badge variant="gem" size="md" icon={Sparkles}>
              Verified Hidden Gem
            </Badge>
          )}
          {destination.verificationStatus === 'verified' && (
            <Badge variant="default" size="md" icon={ShieldCheck} className="text-emerald-700 bg-emerald-50 border-emerald-200">
              Verified by Local Tourism
            </Badge>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight">
          {destination.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-600">
          <span className="flex items-center gap-1.5 font-medium text-stone-800">
            <MapPin className="w-4 h-4 text-terracotta-600" />
            {destination.district}, {destination.state || 'Haryana'}
          </span>
          <span>•</span>
          <span className="text-stone-500">
            Coordinates: {destination.coordinates?.latitude?.toFixed(4)}° N, {destination.coordinates?.longitude?.toFixed(4)}° E
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-12 space-y-3">
        <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-stone-900 shadow-md">
          <img
            src={currentImage.url}
            alt={currentImage.caption || destination.name}
            className="w-full h-full object-cover"
          />
          {currentImage.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 sm:p-6 text-white text-xs sm:text-sm">
              {currentImage.caption}
            </div>
          )}
        </div>

        {/* Thumbnail selector */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === selectedImageIndex
                    ? 'border-forest-700 ring-2 ring-forest-600'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Columns: Description, History, Facilities, Tips */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <section>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3">
              Overview & Landscape
            </h2>
            <p className="text-stone-700 leading-relaxed text-base sm:text-lg">
              {destination.description}
            </p>
          </section>

          {/* Historical and cultural information */}
          {destination.history && (
            <section className="bg-cream-100/60 border border-stone-200/90 rounded-2xl p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-3 flex items-center gap-2">
                <span>📜 Historical & Cultural Significance</span>
              </h2>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {destination.history}
              </p>
            </section>
          )}

          {/* Available Facilities */}
          {destination.facilities && destination.facilities.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-4">
                Available Facilities & Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200/80 shadow-sm text-sm font-medium text-stone-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Visitor Tips */}
          {destination.visitorTips && destination.visitorTips.length > 0 && (
            <section className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 sm:p-8">
              <h2 className="font-serif text-xl font-bold text-amber-950 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Insider Traveler Tips</span>
              </h2>
              <ul className="space-y-3">
                {destination.visitorTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-stone-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Interactive Map */}
          {destination.coordinates?.latitude && destination.coordinates?.longitude && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-forest-700" />
                  <span>Interactive Map & Geography</span>
                </h2>
                <span className="text-xs text-stone-500 font-medium">
                  {destination.coordinates.latitude.toFixed(4)}° N, {destination.coordinates.longitude.toFixed(4)}° E
                </span>
              </div>
              <p className="text-xs text-stone-600">
                Explore local topography, access routes and surrounding terrain in {destination.district} district.
              </p>
              <InteractiveMap
                latitude={destination.coordinates.latitude}
                longitude={destination.coordinates.longitude}
                title={destination.name}
                district={destination.district}
                category={destination.category}
                className="h-80 sm:h-96 w-full rounded-2xl"
              />
            </section>
          )}
        </div>

        {/* Right 1 Column: Sticky Visiting Info Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-lg shadow-stone-900/5 space-y-6 lg:sticky lg:top-28">
            <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
              Visitor Information
            </h3>

            {/* Entry Fee */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                  Entry Fee
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {destination.entryFee?.isFree ? 'Free Admission' : `₹${destination.entryFee?.amount} per person`}
                </span>
                {destination.entryFee?.details && (
                  <p className="text-xs text-stone-500 mt-0.5">{destination.entryFee.details}</p>
                )}
              </div>
            </div>

            {/* Visiting Hours */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                  Visiting Hours
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {destination.visitingHours?.openTime || '09:00 AM'} – {destination.visitingHours?.closeTime || '06:00 PM'}
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  {destination.visitingHours?.days || 'Open all days'}
                </p>
                {destination.visitingHours?.notes && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2">
                    {destination.visitingHours.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Best Season */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block">
                  Ideal Season
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {destination.visitingHours?.bestTimeToVisit || 'October to March'}
                </span>
              </div>
            </div>

            {/* Navigation CTA */}
            <div className="pt-2">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-forest-800 hover:bg-forest-900 text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all text-sm"
              >
                <Navigation className="w-4 h-4 text-emerald-300" />
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
              </a>
              <p className="text-center text-[11px] text-stone-400 mt-2">
                Opens exact verified GPS coordinates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
        <section className="mt-20 pt-16 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              More in {destination.district} & Similar Collections
            </h2>
            <Link to="/explore" className="text-xs font-semibold text-forest-800 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDestinations.map((rel) => (
              <DestinationCard key={rel._id || rel.slug} destination={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
