
'use client';

import { useEffect, useRef } from 'react';
import type { Seller } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

interface DiscoverMapProps {
  sellers: Seller[];
  selectedSeller: Seller | null;
}

function DiscoverMap({ sellers, selectedSeller }: DiscoverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Filter sellers with valid locations
  const validSellers = sellers.filter(seller => seller.location);

  // Effect for initializing and cleaning up the map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) {
      return;
    }

    // Prevent re-initialization
    if (mapInstanceRef.current) {
        return;
    }

    let map: any;

    const initMap = async () => {
      try {
        const L = await import('leaflet');

        // Fix for Leaflet marker icons in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        
        const center = (validSellers.length > 0 && validSellers[0].location)
          ? [validSellers[0].location.lat, validSellers[0].location.lng]
          : [20.5937, 78.9629]; // Default to center of India

        map = L.map(mapContainerRef.current!).setView(center as L.LatLngExpression, 5);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        validSellers.forEach(seller => {
          if (seller.location) {
            L.marker([seller.location.lat, seller.location.lng])
              .addTo(map)
              .bindPopup(seller.name);
          }
        });
        
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect for updating the map view when selectedSeller changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedSeller?.location) {
      import('leaflet').then(L => {
        const center: [number, number] = [selectedSeller.location!.lat, selectedSeller.location!.lng];
        mapInstanceRef.current.setView(center, 13);
      });
    }
  }, [selectedSeller]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg bg-gray-100"
      style={{ minHeight: '400px' }}
    />
  );
}

export default DiscoverMap;
