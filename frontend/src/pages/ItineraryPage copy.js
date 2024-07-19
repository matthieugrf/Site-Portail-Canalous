import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, ListGroup, FormControl, InputGroup, Button, Accordion } from 'react-bootstrap';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow, MarkerClustererF, Polyline } from '@react-google-maps/api';
import { debounce } from 'lodash';
import { searchPorts, getPorts, calculateItinerary } from '../services/itineraryService';
import swapIcon from '../img/doublefleches.jpeg';
import '../style/ItineraryPage.css';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const defaultCenter = { lat: 46.603354, lng: 1.888334 };

const ItineraryPage = () => {
  const [ports, setPorts] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState(null);
  const [selectedPort, setSelectedPort] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const [steps, setSteps] = useState([
    { id: null, searchTerm: '', searchResults: [] },
    { id: null, searchTerm: '', searchResults: [] },
  ]);
  const [nearestPort, setNearestPort] = useState(null);

  const { isLoaded } = useJsApiLoader({
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

    setNearestPort(nearestPort);
  }, [ports]);

  const debouncedSearch = useCallback(
    debounce(async (query, index) => {
      if (query && query.length > 0) {
        try {
          const data = await searchPorts(query);
          const newSteps = [...steps];
          newSteps[index].searchResults = data.ports.filter(p => !steps.map(step => step.id).includes(p.Port_Id));
          if (index === 0 && nearestPort) {
            newSteps[index].searchResults.unshift({ ...nearestPort, Port_Nom: 'Port le plus proche' });
          }
          setSteps(newSteps);
        } catch (error) {
          console.error('Erreur lors de la recherche des ports:', error);
        }
      } else {
        const newSteps = [...steps];
        newSteps[index].searchResults = index === 0 && nearestPort ? [{ ...nearestPort, Port_Nom: 'Port le plus proche' }] : [];
        setSteps(newSteps);
      }
    }, 300),
    [steps, nearestPort]
  );

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

  const handleSearchChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index].searchTerm = e.target.value;
    setSteps(newSteps);
    debouncedSearch(e.target.value, index);
  };

  const handleSelectPort = (port, index) => {
    const newSteps = [...steps];
    newSteps[index] = { id: port.Port_Id, searchTerm: port.Port_Nom, searchResults: [] };
    setSteps(newSteps);
  };

  const handleCalculateItinerary = async () => {
    const points = steps.map(step => step.id).filter(id => id !== null);
    if (points.length < 2) {
      alert('Veuillez sélectionner au moins un port de départ et un port d\'arrivée');
      return;
    }

    try {
      const data = await calculateItinerary(points);
      console.log('Itineraries:', data);
      setItineraries(data);
      setSelectedItineraryIndex(0);
      const bounds = calculateBounds(itineraries[selectedItineraryIndex]);
      map.fitBounds(bounds);
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
    }
  };

  const handleAddStep = () => {
    const newSteps = [...steps];
    newSteps.splice(steps.length - 1, 0, { id: null, searchTerm: '', searchResults: [] });
    setSteps(newSteps);
  };

  const handleRemoveStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleMoveStep = (index, direction) => {
    const newSteps = [...steps];
    const [removedStep] = newSteps.splice(index, 1);
    newSteps.splice(index + direction, 0, removedStep);
    setSteps(newSteps);
  };

  const handleSwapPorts = () => {
    const newSteps = [...steps];
    [newSteps[0], newSteps[newSteps.length - 1]] = [newSteps[newSteps.length - 1], newSteps[0]];
    setSteps(newSteps);
  };

  const handleMarkerClick = (port) => {
    setSelectedPort(port);
  };

  const handleSetPortFromMap = (port, index) => {
    const newSteps = [...steps];
    newSteps[index] = { id: port.Port_Id, searchTerm: port.Port_Nom, searchResults: [] };
    setSteps(newSteps);
    setSelectedPort(null);
  };

  const handleAddStepFromMap = (port) => {
    const newSteps = [...steps];
    newSteps.splice(steps.length - 1, 0, { id: port.Port_Id, searchTerm: port.Port_Nom, searchResults: [] });
    setSteps(newSteps);
    setSelectedPort(null);
  };

  const calculateBounds = (itinerary) => {
    const bounds = new window.google.maps.LatLngBounds();
    if (!itinerary || !itinerary.details || !itinerary.details.paths) return bounds;
  
    itinerary.details.paths.forEach(troncon => {
      troncon.path.forEach(point => {
        bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
      });
    });
  
    return bounds;
  };
  const handleItinerarySelection = (index) => {
    setSelectedItineraryIndex(index);
    if (map && itineraries[index]) {
      const bounds = calculateBounds(itineraries[index]);
      map.fitBounds(bounds);
    }
  };

  const userLocationIcon = isLoaded && {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 15,
    fillColor: '#007BFF',
    fillOpacity: 1,
    strokeWeight: 0,
  };

  const createKey = (port) => `${port.Port_Id}-${port.Port_MapX}-${port.Port_MapY}`;

  const getItineraryTronconsPaths = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.paths) {
      return [];
    }

    return selectedItinerary.details.paths.map((troncon, index) => (
      <Polyline
        key={index}
        path={troncon.path}
        options={{ strokeColor: '#0000FF', strokeOpacity: 0.8, strokeWeight: 5 }}
      />
    ));
  };

  const getItineraryLocks = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.canals) {
      return [];
    }

    return Object.values(selectedItinerary.details.canals).flatMap((canal) => canal.troncons.flatMap((troncon) => troncon.tronconLocks.map((lock, index) => ({
      position: { lat: parseFloat(lock.Ecluse_MapX), lng: parseFloat(lock.Ecluse_MapY) },
      title: lock.Ecluse_Nom,
      key: `${index}`
    }))));
  };

  const getItineraryPontsLevis = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.canals) {
      return [];
    }

    return Object.values(selectedItinerary.details.canals).flatMap((canal) => canal.troncons.flatMap((troncon) => troncon.tronconPontsLevis.map((pontLevis, index) => ({
      position: { lat: parseFloat(pontLevis.Pontlevis_MapX), lng: parseFloat(pontLevis.Pontlevis_MapY) },
      title: pontLevis.Pontlevis_Nom,
      key: `${index}`
    }))));
  };

  const getItineraryCanals = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.canals) {
      return [];
    }

    return Object.values(selectedItinerary.details.canals);
  };

  const getItinerarySummaries = () => {
    return itineraries.map((itinerary, index) => {
      const name = itinerary.name;
      const details = itinerary.details;

      return (
        <ListGroup.Item key={index} onClick={() => handleItinerarySelection(index)}>
          <strong>{name}</strong> - {details.total_Km} km, {details.total_Ecluses} écluses, {details.total_Temps.toFixed(2)} heures
        </ListGroup.Item>
      );
    });
  };

  const selectedItinerary = selectedItineraryIndex !== null ? itineraries[selectedItineraryIndex] : null;

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={4}>
          <h1>Bienvenue</h1>
          <div className="search-container">
            {steps.map((step, index) => (
              <InputGroup className="mb-3" key={index}>
                <FormControl
                  placeholder={`Choisissez un ${index === 0 ? 'point de départ' : index === steps.length - 1 ? 'point d\'arrivée' : 'étape'}`}
                  aria-label={`Choisissez un ${index === 0 ? 'point de départ' : index === steps.length - 1 ? 'point d\'arrivée' : 'étape'}`}
                  value={step.searchTerm}
                  onChange={(e) => handleSearchChange(e, index)}
                  onClick={() => {
                    if (index === 0 && nearestPort && !steps[index].searchResults.find(p => p.Port_Id === nearestPort.Port_Id)) {
                      const newSteps = [...steps];
                      newSteps[index].searchResults.unshift({ ...nearestPort, Port_Nom: 'Port le plus proche' });
                      setSteps(newSteps);
                    }
                  }}
                />
                <InputGroup.Text>{index === 0 ? '🚩' : index === steps.length - 1 ? '📍' : '➡️'}</InputGroup.Text>
                {index > 0 && index < steps.length - 1 && (
                  <>
                    <Button variant="danger" onClick={() => handleRemoveStep(index)} className="remove-step-button">X</Button>
                    <Button variant="secondary" onClick={() => handleMoveStep(index, -1)} className="move-step-button">↑</Button>
                    <Button variant="secondary" onClick={() => handleMoveStep(index, 1)} className="move-step-button">↓</Button>
                  </>
                )}
              </InputGroup>
            ))}
            <Button variant="secondary" onClick={handleSwapPorts} className="swap-button">
              <img src={swapIcon} alt="Swap" className="swap-icon" />
            </Button>
            <Button variant="secondary" onClick={handleAddStep} className="add-step-button">Ajouter une étape</Button>
          </div>
          {steps.map((step, stepIndex) => (
            <ListGroup className="mt-4" key={stepIndex}>
              {step.searchResults.map((port, index) => (
                <ListGroup.Item key={index} onClick={() => handleSelectPort(port, stepIndex)}>
                  {port.Port_Nom}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ))}
          <Button className="mt-4" onClick={handleCalculateItinerary}>Calculer l'itinéraire</Button>
          {itineraries.length > 0 && (
            <div className="mt-4">
              <h2>Itinéraires</h2>
              <ListGroup>{getItinerarySummaries()}</ListGroup>
            </div>
          )}
          {selectedItinerary && (
            <div className="mt-4">
              <h2>Détails de l'itinéraire</h2>
              <Accordion defaultActiveKey="0">
                {getItineraryCanals(selectedItinerary).map((canal, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>{canal.LIBELLE}</Accordion.Header>
                    <Accordion.Body>
                      <p><strong>Distance:</strong> {canal.DISTANCE}</p>
                      <p><strong>Nombre d'écluses:</strong> {canal.NBECLUSE}</p>
                      <p><strong>Tirant d'eau:</strong> {canal.TIREAU}</p>
                      <p><strong>Tirant d'air:</strong> {canal.TIRAIR}</p>
                      <p><strong>Longueur:</strong> {canal.LONGUEUR}</p>
                      <p><strong>Largeur:</strong> {canal.LARGEUR}</p>
                      <p><strong>Description:</strong> {canal.DESCRIPTIF}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
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
                    <Button onClick={() => handleSetPortFromMap(selectedPort, 0)}>
                      Définir comme départ
                    </Button>
                    <Button onClick={() => handleSetPortFromMap(selectedPort, steps.length - 1)}>
                      Itinéraire vers ce port
                    </Button>
                    <Button onClick={() => handleAddStepFromMap(selectedPort)}>
                      Ajouter comme étape
                    </Button>
                  </div>
                </InfoWindow>
              )}

              {selectedItinerary && getItineraryTronconsPaths(selectedItinerary)}

              {selectedItinerary && getItineraryLocks(selectedItinerary).map((lock, index) => (
                <MarkerF
                  key={index}
                  position={lock.position}
                  title={lock.title}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(30, 30)
                  }}
                />
              ))}

              {selectedItinerary && getItineraryPontsLevis(selectedItinerary).map((pontLevis, index) => (
                <MarkerF
                  key={index}
                  position={pontLevis.position}
                  title={pontLevis.title}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    scaledSize: new window.google.maps.Size(30, 30)
                  }}
                />
              ))}
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
