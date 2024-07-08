import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow, MarkerClustererF } from '@react-google-maps/api';
import { Button } from 'react-bootstrap';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = { lat: 46.603354, lng: 1.888334 };

const GoogleMapComponent = ({ ports, setStartPort, setEndPort, startPort, endPort }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [selectedPort, setSelectedPort] = useState(null);

  const onLoad = useCallback(map => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        error => {
          console.error('Erreur lors de la récupération de la position:', error);
        }
      );
    } else {
      console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }, []);

  // Icône personnalisée pour la localisation de l'utilisateur
  const userLocationIcon = isLoaded && {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: '#007BFF',
    fillOpacity: 1,
    strokeWeight: 0,
  };

  // Fonction pour gérer le clustering des marqueurs
  const createKey = (port) => `${port.Port_Id}-${port.Port_MapX}-${port.Port_MapY}`;

  if (loadError) {
    return <div>Erreur lors du chargement de Google Maps</div>;
  }

  const handleMarkerClick = (port) => {
    setSelectedPort(port);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      }}
      zoom={8}
    >
      <MarkerF
        position={center}
        title="Vous êtes ici"
        icon={userLocationIcon}
      />

      <MarkerClustererF>
        {(clusterer) =>
          ports.map((port) => (
            <MarkerF
              key={createKey(port)}
              position={{ lat: parseFloat(port.Port_MapX), lng: parseFloat(port.Port_MapY) }}
              title={port.Port_Nom}
              onClick={() => handleMarkerClick(port)}
              clusterer={clusterer}
            />
          ))
        }
      </MarkerClustererF>

      {selectedPort && (
        <InfoWindow
          position={{ lat: parseFloat(selectedPort.Port_MapX), lng: parseFloat(selectedPort.Port_MapY) }}
          onCloseClick={() => setSelectedPort(null)}
        >
          <div>
            <h2>{selectedPort.Port_Nom}</h2>
            <p>Plus de détails ici...</p>
            <Button onClick={() => {
              setEndPort(selectedPort);
              setSelectedPort(null);
            }}>Itinéraire vers ce port</Button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <div>Loading...</div>;
};

export default GoogleMapComponent;
