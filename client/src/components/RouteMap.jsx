import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../lib/api';
import SectionHeading from './SectionHeading';
import { MOCK_RIDES } from '../data/mockData';

export default function RouteMap() {
  const [places, setPlaces] = useState(MOCK_RIDES.completed);

  useEffect(() => {
    api
      .get('/rides', { params: { status: 'completed' } })
      .then((res) => {
        const withCoords = (res.data || []).filter((r) => r.lat != null && r.lng != null);
        if (withCoords.length) setPlaces(withCoords);
      })
      .catch(() => {});
  }, []);

  const pins = places.filter((p) => p.lat != null && p.lng != null);

  return (
    <section id="map" className="section-pad container-x">
      <SectionHeading
        center
        eyebrow="The Conquests"
        title="Places we've conquered."
        subtitle="Every pin is a story, a campfire, and a few thousand kilometres."
      />

      <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 shadow-glow">
        <MapContainer
          center={[28.6, 81.5]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: '520px', width: '100%' }}
        >
          {/* Dark tile theme (no token required) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {pins.map((p) => (
            <CircleMarker
              key={p._id}
              center={[p.lat, p.lng]}
              radius={9}
              pathOptions={{ color: '#F5A623', fillColor: '#F5A623', fillOpacity: 0.85, weight: 2 }}
            >
              <Popup>
                <strong style={{ color: '#F5A623' }}>{p.location || p.title}</strong>
                <br />
                <span style={{ fontSize: 12 }}>{p.title}</span>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
