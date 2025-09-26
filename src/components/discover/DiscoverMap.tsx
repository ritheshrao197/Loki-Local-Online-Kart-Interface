'use client';

import { useEffect, useRef } from 'react';
import type { Seller } from '@/lib/types';

interface DiscoverMapProps {
  sellers: Seller[];
  selectedSeller: Seller | null;
}

function DiscoverMap({ sellers, selectedSeller }: DiscoverMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Filter sellers with valid locations
  const validSellers = sellers.filter(seller => seller.location);

  useEffect(() => {
    // Function to update existing map
    const updateMap = () => {
      if (mapInstanceRef.current && selectedSeller?.location) {
        import('leaflet').then(L => {
          const center: [number, number] = [selectedSeller.location!.lat, selectedSeller.location!.lng];
          mapInstanceRef.current.setView(center, 13);
        });
      }
    };

    // Only initialize map on client side
    if (typeof window !== 'undefined' && mapContainerRef.current) {
      // Check if map is already initialized
      if (mapInstanceRef.current) {
        // If map exists, just update it
        updateMap();
        return;
      }

      // Load leaflet dynamically
      const initMap = async () => {
        try {
          const L = await import('leaflet');
          
          // Fix for Leaflet marker icons
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });

          // Make sure container is clear
          if (mapContainerRef.current) {
            mapContainerRef.current.innerHTML = '';
          }

          // Determine center position
          const center = selectedSeller?.location
            ? [selectedSeller.location.lat, selectedSeller.location.lng]
            : (validSellers.length > 0 && validSellers[0].location)
                ? [validSellers[0].location.lat, validSellers[0].location.lng]
                : [20.5937, 78.9629]; // Default to center of India

          const zoom = selectedSeller ? 13 : 5;

          // Create map instance
          const map = L.map(mapContainerRef.current!).setView(center as L.LatLngExpression, zoom);
          mapInstanceRef.current = map;

          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Add markers
          validSellers.forEach(seller => {
            if (seller.location) {
              const marker = L.marker([seller.location.lat, seller.location.lng]).addTo(map);
              marker.bindPopup(seller.name);
              markersRef.current.push(marker);
            }
          });

          // Fit bounds if no specific seller is selected
          if (!selectedSeller && validSellers.length > 1) {
            const bounds = L.latLngBounds(
              validSellers
                .filter(s => s.location)
                .map(s => [s.location!.lat, s.location!.lng])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      };

      initMap();
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        // Remove all markers
        markersRef.current.forEach(marker => {
          marker.remove();
        });
        markersRef.current = [];
        
        // Remove map
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sellers, selectedSeller]); // Dependencies on sellers and selectedSeller

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-lg bg-gray-100"
      style={{ minHeight: '400px' }}
    />
  );
}

export default DiscoverMap;