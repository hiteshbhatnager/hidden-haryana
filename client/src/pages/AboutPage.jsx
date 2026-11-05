import React from 'react';
import { Compass, CheckCircle2, Shield, Users, Landmark, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const AboutPage = () => {
  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-terracotta-600" />
          <span>About Hidden Haryana</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Uncovering Forgotten Heritage & Untouched Nature
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          A centralized, open-access tourism platform solving discovery gaps and fragmented tourism records across Haryana.
        </p>
      </div>

      {/* The Two Core Problems We Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
            01
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Lesser-Known Destinations Remain Invisible
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            While major highways and transit hubs buzz with activity, magnificent 16th-century Mughal water palaces in Narnaul, Gupta-era inscriptions in Tosham, and peaceful Shivalik foothills in Morni receive meager footfall and almost no promotion.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-lg">
            02
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Scattered & Unreliable Tourism Information
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Travelers face fragmented blogs, broken government links, outdated visiting hours, and misleading pin locations. We assemble precise GPS navigation, entry fees, amenities, and historical records in one place.
          </p>
        </div>
      </div>

      {/* Our Verification Process */}
      <div className="bg-forest-900 text-white p-8 sm:p-12 rounded-3xl space-y-8 relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Field Ground Truth
          </span>
          <h2 className="font-serif text-3xl font-bold">
            How We Document & Verify Each Destination
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Every entry on Hidden Haryana undergoes strict verification before being featured on our discovery channels.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-forest-800">
          <div className="space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-base">GPS Co-ordinates</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              We test on-ground access roads and provide direct Google Maps waypoints to avoid confusing detours.
            </p>
          </div>
          <div className="space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-base">Visiting Timings & Fees</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Timings are verified directly with ASI boards, local district administration, and forest departments.
            </p>
          </div>
          <div className="space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h4 className="font-bold text-base">Amenities & Safety</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              We document parking availability, child-friendly paths, and local seasonal conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Join the Mission CTA */}
      <div className="text-center bg-cream-100/70 border border-stone-200 p-8 sm:p-12 rounded-3xl space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Explore or Contribute to Hidden Haryana
        </h2>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Start exploring today or apply as an authorized tourism contributor to document destinations in your hometown.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Link to="/explore">
            <Button variant="primary" size="md">
              Start Exploring Now
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="md">
              Create an Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
