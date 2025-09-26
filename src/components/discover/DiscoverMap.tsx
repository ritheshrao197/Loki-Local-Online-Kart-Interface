'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Seller } from '@/lib/types';

// Fix for default icon not showing up in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default.src,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default.src,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default.src,
});

interface DiscoverMapProps {
  sellers: Seller[];
  selectedSeller: Seller | null;
}

function MapUpdater({ sellers, selectedSeller }: DiscoverMapProps) {
    const map = useMap();
    useEffect(() => {
        if (selectedSeller && selectedSeller.location) {
            map.flyTo([selectedSeller.location.lat, selectedSeller.location.lng], 13);
        } else if (sellers.length > 0) {
            const validLocations = sellers.filter(s => s.location).map(s => [s.location!.lat, s.location!.lng] as L.LatLngTuple);
            if(validLocations.length > 0) {
                map.fitBounds(validLocations, { padding: [50, 50] });
            }
        }
    }, [selectedSeller, sellers, map]);
    return null;
}

export default function DiscoverMap({ sellers, selectedSeller }: DiscoverMapProps) {
  const validSellers = sellers.filter(seller => seller.location);
  
  if (typeof window === 'undefined') {
    return <div className="w-full h-full bg-muted animate-pulse"></div>;
  }

  const defaultPosition: L.LatLngTuple = (validSellers.length > 0 && validSellers[0].location) 
    ? [validSellers[0].location.lat, validSellers[0].location.lng] 
    : [20.5937, 78.9629]; // Default to center of India if no sellers have location

  return (
    <MapContainer center={defaultPosition} zoom={5} scrollWheelZoom={true} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validSellers.map(seller => (
        seller.location && (
            <Marker key={seller.id} position={[seller.location.lat, seller.location.lng]}>
            <Popup>
                {seller.name}
            </Popup>
            </Marker>
        )
      ))}
       <MapUpdater sellers={sellers} selectedSeller={selectedSeller} />
    </MapContainer>
  );
}
