import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Hidden <span className="text-terracotta-500">Haryana</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              A community-driven digital archive and discovery platform bringing visibility to Haryana's unmapped lakes, ancient forts, Harappan ruins, and tranquil biodiversity havens.
            </p>
            <div className="pt-2 text-xs text-stone-500 flex items-center gap-1.5">
              <span>🌾 Preserving local heritage with care</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore & Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/explore?isHiddenGem=true" className="hover:text-emerald-400 transition-colors">
                  Curated Hidden Gems
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Nature%20%26%20Hills" className="hover:text-emerald-400 transition-colors">
                  Shivalik Foothills & Treks
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Archaeological%20Sites" className="hover:text-emerald-400 transition-colors">
                  Indus Valley Sites
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Districts in focus */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Highlighted Districts
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/explore?district=Panchkula" className="hover:text-emerald-400 transition-colors">
                  Panchkula (Morni & Shivalik)
                </Link>
              </li>
              <li>
                <Link to="/explore?district=Mahendragarh" className="hover:text-emerald-400 transition-colors">
                  Mahendragarh (Narnaul Heritage)
                </Link>
              </li>
              <li>
                <Link to="/explore?district=Hisar" className="hover:text-emerald-400 transition-colors">
                  Hisar (Rakhigarhi & Asigarh Fort)
                </Link>
              </li>
              <li>
                <Link to="/explore?district=Yamunanagar" className="hover:text-emerald-400 transition-colors">
                  Yamunanagar (Kalesar Forest)
                </Link>
              </li>
              <li>
                <Link to="/explore?district=Jhajjar" className="hover:text-emerald-400 transition-colors">
                  Jhajjar (Bhindawas Ramsar Wetland)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Tourism Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Tourism Information
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Chandigarh / Panchkula, Haryana, India</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@hiddenharyana.org</span>
              </p>
              <div className="mt-4 p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                <span className="font-semibold text-emerald-300 block mb-1">
                  Haryana Tourism Helpline
                </span>
                <span className="text-stone-300">Toll-Free: 1800-180-2166 (09:00 - 18:00)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Hidden Haryana. Built for authentic local tourism discovery.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-stone-400">Privacy & Terms</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-stone-400">Verification Guidelines</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-stone-400">Contributor Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
