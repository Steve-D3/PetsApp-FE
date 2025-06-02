// src/components/atoms/Map.tsx
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface MapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
}

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "0.5rem",
};

export function Map({
  address,
  lat,
  lng,
  zoom = 15,
  className = "",
}: MapProps) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) {
        setError("No address provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.results[0]) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          throw new Error(data.error_message || "Could not geocode address");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Could not load map location");
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) {
      setCoordinates({ lat, lng });
      setLoading(false);
    } else if (address) {
      geocodeAddress();
    } else {
      setLoading(false);
      setError("No location data provided");
    }
  }, [address, lat, lng]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={containerStyle}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 text-sm ${className}`}
        style={containerStyle}
      >
        {error || "Map location not available"}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg shadow ${className}`}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordinates}
          zoom={zoom}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={coordinates} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
