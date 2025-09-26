
'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import type { Seller } from '@/lib/types';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


interface DiscoverMapProps {
  sellers: Seller[];
  selectedSeller: Seller | null;
}

function MapUpdater({ sellers }: { sellers: Seller[] }) {
    const map = useMap();
    useEffect(() => {
        const validLocations = sellers.filter(s => s.location).map(s => [s.location!.lat, s.location!.lng] as L.LatLngTuple);
        if(validLocations.length > 0) {
            const bounds = L.latLngBounds(validLocations);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [sellers, map]);
    return null;
}

export default function DiscoverMap({ sellers, selectedSeller }: DiscoverMapProps) {
  const validSellers = sellers.filter(seller => seller.location);
  
  if (typeof window === 'undefined') {
    return <div className="w-full h-full bg-muted animate-pulse"></div>;
  }

  const center: L.LatLngTuple = selectedSeller?.location 
    ? [selectedSeller.location.lat, selectedSeller.location.lng] 
    : (validSellers.length > 0 && validSellers[0].location) 
        ? [validSellers[0].location.lat, validSellers[0].location.lng] 
        : [20.5937, 78.9629]; // Default to center of India if no sellers have location
    
  const zoom = selectedSeller ? 13 : 5;

  return (
    <MapContainer key={selectedSeller?.id || 'initial'} center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validSellers.map(seller => (
        seller.location && (
            <Marker key={seller.id} position={[seller.location.lat, seller.location.lng]} icon={customIcon}>
            <Popup>
                {seller.name}
            </Popup>
            </Marker>
        )
      ))}
       {!selectedSeller && <MapUpdater sellers={validSellers} />}
    </MapContainer>
  );
}

