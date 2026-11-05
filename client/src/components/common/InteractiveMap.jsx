import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Navigation } from 'lucide-react';

// Fix default leaflet marker icon resolution in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export const InteractiveMap = ({
  latitude,
  longitude,
  title,
  district,
  category,
  zoom = 12,
  className = 'h-80 w-full rounded-2xl overflow-hidden',
}) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className={`flex items-center justify-center bg-stone-100 text-stone-500 text-sm ${className}`}>
        Coordinates unavailable for interactive map
      </div>
    );
  }

  const position = [lat, lng];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className={`relative border border-stone-200 shadow-sm z-0 ${className}`}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="p-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                {category || 'Destination'}
              </span>
              <h4 className="font-bold text-sm text-stone-900 mt-0.5">{title}</h4>
              <p className="text-xs text-stone-600 mb-2">{district}, Haryana</p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-800 hover:text-forest-950 underline"
              >
                <span>Navigate here</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Floating Directions Shortcut Pill */}
      <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-stone-200 flex items-center gap-2 text-xs">
        <Navigation className="w-3.5 h-3.5 text-forest-700" />
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-stone-800 hover:text-forest-800 transition-colors"
        >
          Open in Maps
        </a>
      </div>
    </div>
  );
};

