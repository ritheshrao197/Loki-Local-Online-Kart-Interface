
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

  // Effect for initializing and managing the map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) {
      return;
    }
    
    // Initialize map only if it doesn't already exist
    if (!mapInstanceRef.current) {
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

          mapInstanceRef.current = L.map(mapContainerRef.current!).setView(center as L.LatLngExpression, 5);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current);
          
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };

      initMap();
    }
    
    // Add markers
    if(mapInstanceRef.current) {
        // Clear existing markers
        mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer instanceof import('leaflet').Marker) {
                mapInstanceRef.current.removeLayer(layer);
            }
        });
        
        // Add new markers
        validSellers.forEach(seller => {
          if (seller.location) {
            import('leaflet').then(L => {
                L.marker([seller.location!.lat, seller.location!.lng])
              .addTo(mapInstanceRef.current)
              .bindPopup(seller.name);
            });
          }
        });
    }


    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [validSellers]);

  // Effect for updating the map view when selectedSeller changes
  useEffect(() => {
    if (mapInstanceRef.current && selectedSeller?.location) {
      import('leaflet').then(() => {
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
