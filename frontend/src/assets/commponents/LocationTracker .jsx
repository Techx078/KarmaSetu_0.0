// components/LocationTracker.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet Marker Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationTracker = ({ userLocation, providerLocation }) => {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (userLocation && providerLocation) {
      const dist = calculateDistance(userLocation, providerLocation);
      setDistance(dist.toFixed(2));
    }
  }, [userLocation, providerLocation]);

  // Haversine Formula to calculate distance
  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Radius of the Earth (KM)
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in KM
  };

  return (
    <div className="mt-4">
      <h4 className="text-indigo-700 font-semibold text-sm mb-2">
        Live Location Tracking (Distance: {distance} km)
      </h4>
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "250px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation}>
          <Popup>User Location</Popup>
        </Marker>
        <Marker position={providerLocation}>
          <Popup>Provider Location</Popup>
        </Marker>
        <Polyline positions={[userLocation, providerLocation]} color="blue" />
      </MapContainer>
    </div>
  );
};

export default LocationTracker;
