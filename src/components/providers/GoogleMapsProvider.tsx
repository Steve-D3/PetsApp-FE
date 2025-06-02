// src/components/providers/GoogleMapsProvider.tsx
import { LoadScript } from '@react-google-maps/api';
import type { ReactNode } from 'react';

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      loadingElement={<div>Loading...</div>}
    >
      {children}
    </LoadScript>
  );
}