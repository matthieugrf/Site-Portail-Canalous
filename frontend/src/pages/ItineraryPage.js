import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, ListGroup, FormControl, InputGroup, Button } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow, MarkerClustererF } from '@react-google-maps/api';
import { debounce } from 'lodash';
import { searchPorts, getPorts, calculateItinerary } from '../services/itineraryService';
import swapIcon from '../img/doublefleches.jpeg'; // Assurez-vous de fournir le chemin correct à votre icône
import '../style/ItineraryPage.css'; // Importez le fichier CSS

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = { lat: 46.603354, lng: 1.888334 };

const ItineraryPage = () => {
  const [startSearchTerm, setStartSearchTerm] = useState('');
  const [endSearchTerm, setEndSearchTerm] = useState('');
  const [startSearchResults, setStartSearchResults] = useState([]);
  const [endSearchResults, setEndSearchResults] = useState([]);
  const [startPort, setStartPort] = useState(null);
  const [endPort, setEndPort] = useState(null);
  const [ports, setPorts] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const findNearestPort = useCallback((latitude, longitude) => {
    let minDistance = Infinity;
    let nearestPort = null;

    if (ports && ports.length > 0) {
      ports.forEach(port => {
        const portLat = parseFloat(port.Port_MapX);
        const portLng = parseFloat(port.Port_MapY);
        const distance = Math.sqrt(Math.pow(latitude - portLat, 2) + Math.pow(longitude - portLng, 2));
        if (distance < minDistance) {
          minDistance = distance;
          nearestPort = port;
        }
      });
    }

    if (nearestPort) {
      setStartPort(nearestPort);
      setStartSearchTerm(nearestPort.Port_Nom);
    }
  }, [ports]);

  const debouncedStartSearch = useCallback(
    debounce(async (query) => {
      if (query && query.length > 0) {
        try {
          const data = await searchPorts(query);
          setStartSearchResults(data.ports.filter(p => p.Port_Id !== startPort?.Port_Id && p.Port_Id !== endPort?.Port_Id));
        } catch (error) {
          console.error('Erreur lors de la recherche des ports:', error);
        }
      } else {
        setStartSearchResults([]);
      }
    }, 300),
    [startPort, endPort]
  );

  const debouncedEndSearch = useCallback(
    debounce(async (query) => {
      if (query && query.length > 0) {
        try {
          const data = await searchPorts(query);
          setEndSearchResults(data.ports.filter(p => p.Port_Id !== startPort?.Port_Id && p.Port_Id !== endPort?.Port_Id));
        } catch (error) {
          console.error('Erreur lors de la recherche des ports:', error);
        }
      } else {
        setEndSearchResults([]);
      }
    }, 300),
    [startPort, endPort]
  );

  useEffect(() => {
    debouncedStartSearch(startSearchTerm);
  }, [startSearchTerm, debouncedStartSearch]);

  useEffect(() => {
    debouncedEndSearch(endSearchTerm);
  }, [endSearchTerm, debouncedEndSearch]);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const data = await getPorts();
        setPorts(data.ports);
      } catch (error) {
        console.error('Erreur lors de la récupération des ports:', error);
      }
    };

    fetchPorts();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          findNearestPort(latitude, longitude);
        },
        error => {
          console.error('Erreur lors de la récupération de la position:', error);
        }
      );
    } else {
      console.error('La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }, [ports, findNearestPort]);

  const handleStartSearchChange = (e) => {
    setStartSearchTerm(e.target.value);
  };

  const handleEndSearchChange = (e) => {
    setEndSearchTerm(e.target.value);
  };

  const handleSelectPort = (port, type) => {
    if (type === 'start') {
      setStartPort(port);
      setStartSearchTerm(port.Port_Nom);
      setStartSearchResults([]);
    } else {
      setEndPort(port);
      setEndSearchTerm(port.Port_Nom);
      setEndSearchResults([]);
    }
  };

  const handleCalculateItinerary = async () => {
    if (!startPort?.Port_Id || !endPort?.Port_Id) {
      alert('Veuillez sélectionner les ports de départ et d\'arrivée');
      return;
    }

    try {
      const data = await calculateItinerary(startPort.Port_Id, endPort.Port_Id);
      setItinerary(data.itinerary);
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
    }
  };

  const handleSwapPorts = () => {
    const temp = startPort;
    setStartPort(endPort);
    setEndPort(temp);
    setStartSearchTerm(endPort ? endPort.Port_Nom : '');
    setEndSearchTerm(startPort ? startPort.Port_Nom : '');
  };

  const handleMarkerClick = (port) => {
    setSelectedPort(port);
  };

  const handleSetPortFromMap = (port, type) => {
    if (type === 'start') {
      setStartPort(port);
      setStartSearchTerm(port.Port_Nom);
    } else {
      setEndPort(port);
      setEndSearchTerm(port.Port_Nom);
    }
    setSelectedPort(null);
  };

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

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={4}>
          <h1>Bienvenue</h1>
          <div className="search-container">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Choisissez un point de départ ou cliquez"
                aria-label="Choisissez un point de départ ou cliquez"
                aria-describedby="start-port"
                value={startSearchTerm}
                onChange={handleStartSearchChange}
              />
              <InputGroup.Text id="start-port">🚩</InputGroup.Text>
            </InputGroup>
            <Button variant="secondary" onClick={handleSwapPorts} className="swap-button">
              <img src={swapIcon} alt="Swap" className="swap-icon" />
            </Button>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Choisissez une destination..."
                aria-label="Choisissez une destination..."
                aria-describedby="end-port"
                value={endSearchTerm}
                onChange={handleEndSearchChange}
              />
              <InputGroup.Text id="end-port">📍</InputGroup.Text>
            </InputGroup>
          </div>
          <ListGroup className="mt-4">
            {startSearchResults.map((port, index) => (
              <ListGroup.Item key={index} onClick={() => handleSelectPort(port, 'start')}>
                {port.Port_Nom}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <ListGroup className="mt-4">
            {endSearchResults.map((port, index) => (
              <ListGroup.Item key={index} onClick={() => handleSelectPort(port, 'end')}>
                {port.Port_Nom}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button className="mt-4" onClick={handleCalculateItinerary}>Calculer l'itinéraire</Button>
          {itinerary && (
            <div className="mt-4">
              <h2>Itinéraire</h2>
              <pre>{JSON.stringify(itinerary, null, 2)}</pre>
            </div>
          )}
        </Col>
        <Col md={8}>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              onLoad={map => setMap(map)}
              onUnmount={() => setMap(null)}
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
                    <Button onClick={() => handleSetPortFromMap(selectedPort, 'start')}>
                      Définir comme départ
                    </Button>
                    <Button onClick={() => handleSetPortFromMap(selectedPort, 'end')}>
                      Itinéraire vers ce port
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div>Loading...</div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ItineraryPage;
