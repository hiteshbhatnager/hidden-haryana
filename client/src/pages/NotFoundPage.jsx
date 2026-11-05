import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
      <div className="max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl font-bold font-serif shadow-sm">
          404
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Unmapped Territory
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          The trail you followed doesn't seem to lead anywhere on the map of Haryana. Let's get you back on the right path.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="sm" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" size="sm" icon={Search}>
              Explore Destinations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
