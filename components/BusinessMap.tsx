"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface BusinessMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
}

export default function BusinessMap({
  latitude,
  longitude,
  zoom = 15,
  className = "",
}: BusinessMapProps) {
  const position = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <div className={`h-[450px] w-full overflow-hidden rounded-2xl ${className}`}>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <Map
          defaultCenter={position}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={true}
        >
          <Marker position={position} />
        </Map>
      </APIProvider>
    </div>
  );
}