"use client";

import { 
    MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Client Leaflet icon fix
// eslint-disable-next-line
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
    // eslint-disable-next-line
    properties: any[];
    centerLat: number;
    centerLng: number;
    radiusInMiles: number;
    onMapClick: (lat: number, lng: number) => void;
}

// The invisible camera controller
// eslint-disable-next-line
function MapBoundsUpdater({ properties }: { properties: any[] }) {
    const map = useMap();

    useEffect(() => {
        if (properties && properties.length > 0) {
            //  Create a bounding box that includes all the new pins
            const validCoords = properties
                .map(p => {
                    if (p.latitude && p.longitude) {
                        return [p.latitude, p.longitude] as [number, number];
                    }
                    return null;
                })
                .filter(Boolean) as [number, number][];
                
            if (validCoords.length > 0) {
                const bounds = L.latLngBounds(validCoords);
                map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
            }
        }
    }, [properties, map]);

    return null;
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function Map({ properties, centerLat, centerLng, radiusInMiles, onMapClick }: MapProps) {
    console.log("MAP RECEIVED PROPERTIES => ", properties);
    
    // Convert miles to meters for the Leaflet Circle component
    const radiusInMeters = radiusInMiles * 1609.34;

    return (
        <MapContainer
            center={[centerLat, centerLng]}
            zoom={11}
            scrollWheelZoom={false}
            className="h-125 w-full rounded-xl shadow-sm border border-gray-200 z-0"
        >

            <ClickHandler onMapClick={onMapClick} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapBoundsUpdater properties={properties} />

            {/* Visualizing the PostGIS search radius */}
            <Circle
                center={[centerLat, centerLng]}
                radius={radiusInMeters}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            />

            {/* Plotting the return properties */}
            {properties.map((prop) => {
                const lat = prop.latitude;
                const lng = prop.longitude;

                // If we couldn't find valid coordinates, skip rendering this specific pin
                if (!lat || !lng) return null;

                return (
                    <Marker key={prop.id} position={[prop.latitude, prop.longitude ]}>
                        <Popup>
                            <div className="font-sans">
                                <h3 className="font-bold text-gray-800">{prop.title}</h3>
                                <p className="text-blue-600 font-extrabold mt-1">
                                    ${Number(prop.price).toLocaleString()}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}