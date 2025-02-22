import React, { useEffect, useState, useRef } from 'react';
import { Map as MapIcon, Navigation, Search } from 'lucide-react';
import L from 'leaflet';

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

function App() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  const locations: Location[] = [
    { id: 1, name: 'برج خليفة، دبي', lat: 25.197197, lng: 55.274376 },
    { id: 2, name: 'المسجد الحرام، مكة المكرمة', lat: 21.422487, lng: 39.826206 },
    { id: 3, name: 'الأهرامات، القاهرة', lat: 29.979235, lng: 31.134202 },
    { id: 4, name: 'برج العرب، دبي', lat: 25.141667, lng: 55.185833 },
  ];

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([25.276987, 55.296249], 10);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13);
            L.marker([latitude, longitude])
              .addTo(mapRef.current)
              .bindPopup('موقعك الحالي')
              .openPopup();
          }
        });
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationClick = (location: Location) => {
    if (mapRef.current) {
      mapRef.current.setView([location.lat, location.lng], 13);
      L.marker([location.lat, location.lng])
        .addTo(mapRef.current)
        .bindPopup(location.name)
        .openPopup();
    }
  };

  const handleCurrentLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.setView(currentLocation, 13);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4">
          <div className="search-container">
            <h1 className="h4 mb-3 d-flex align-items-center">
              <MapIcon className="me-2" />
              تطبيق الخريطة
            </h1>
            
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="ابحث عن موقع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text">
                <Search size={18} />
              </span>
            </div>

            <button
              className="btn btn-primary mb-3 w-100 d-flex align-items-center justify-content-center"
              onClick={handleCurrentLocation}
            >
              <Navigation className="me-2" size={18} />
              موقعي الحالي
            </button>

            <div className="location-list">
              {filteredLocations.map(location => (
                <div
                  key={location.id}
                  className="location-item p-2 border-bottom"
                  onClick={() => handleLocationClick(location)}
                >
                  {location.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div ref={mapContainerRef} id="map"></div>
        </div>
      </div>
    </div>
  );
}

export default App;