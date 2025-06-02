import { useState, useEffect } from "react";

interface MapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
}

export function Map({ address, className = "", zoom = 15 }: MapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.google) {
      setError("Google Maps not loaded");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const position = results[0].geometry.location;

        if (map) {
          map.setCenter(position);
          if (marker) {
            marker.setPosition(position);
          } else {
            const newMarker = new window.google.maps.Marker({
              position,
              map,
            });
            setMarker(newMarker);
          }
        }
      } else {
        setError("Could not find location");
      }
    });
  }, [address, map, marker]);

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <div
        style={{ width: "100%", height: "100%", minHeight: "300px" }}
        ref={(ref) => {
          if (ref && !map && window.google) {
            const newMap = new window.google.maps.Map(ref, {
              zoom,
              center: { lat: 0, lng: 0 },
              disableDefaultUI: true,
            });
            onMapLoad(newMap);
          }
        }}
      />
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
}
