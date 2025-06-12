import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw', // Full viewport width
  height: '100vh', // Full viewport height
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1,
};

// Default center (can be user's initial location)
const defaultCenter = {
  lat: 28.6139, // Example: New Delhi
  lng: 77.209,
};

function LiveTracking({ destination, driverLocation }) {
  // User's current location
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.GOOGLE_MAP_API_KEY, // Ensure you have set this in your .env file
  });

  // Get user's live location every 10 seconds
  useEffect(() => {
    let intervalId;
    if (navigator.geolocation) {
      // Initial fetch
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      // Poll every 10 seconds
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(loc);
            setMapCenter(loc);
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Choose what to show: user, driver, destination
  // Props: destination (lat/lng), driverLocation (lat/lng)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={15}
        >
          {/* User marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              label={{ text: 'You', color: 'white', fontWeight: 'bold' }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
          )}
          {/* Driver marker */}
          {driverLocation && (
            <Marker
              position={driverLocation}
              label={{ text: 'Driver', color: 'white', fontWeight: 'bold' }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              }}
            />
          )}
          {/* Destination marker */}
          {destination && (
            <Marker
              position={destination}
              label={{ text: 'Destination', color: 'white', fontWeight: 'bold' }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              }}
            />
          )}
        </GoogleMap>
      )}
      {!isLoaded && <div>Loading map...</div>}
    </div>
  );
}

export default LiveTracking;
