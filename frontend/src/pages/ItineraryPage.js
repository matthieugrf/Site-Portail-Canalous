import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Button, Offcanvas, ListGroup, FormControl, InputGroup, Accordion } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { debounce } from 'lodash';
import { Typography, Stepper, Step, StepLabel, StepContent, Tooltip } from '@mui/material';
import { searchPorts, getPorts, calculateItinerary } from '../services/itineraryService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import '../style/ItineraryPage.css';

import swapIcon from '../img/swap_vert.svg';
import lockIcon from '../img/v3/ecluse.png';
import jonctionIcon from '../img/v3/ico_jonction.png';
import halteIcon from '../img/v3/ico_halte.png';
import classicPortIcon from '../img/v3/ico_port.png';
import tunnelIcon from '../img/v3/ico_tunnel.png';
import pontIcon from '../img/v3/ico_pont.gif';


const formatTime = (totalHours) => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours}h ${minutes}min`;
};

const defaultCenter = [46.603354, 1.888334];

const isValidLatLng = (lat, lng) => !isNaN(lat) && !isNaN(lng);

const ItineraryPage = () => {
  const [ports, setPorts] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState(null);
  const [showLocks, setShowLocks] = useState(true);
  const [showPontsLevis, setShowPontsLevis] = useState(true);
  const [showHaltes, setShowHaltes] = useState(true);
  const [showJonctions, setShowJonctions] = useState(true);
  const [showClassicPorts, setShowClassicPorts] = useState(true);
  const [showPortsHorsItineraire, setShowPortsHorsItineraire] = useState(true);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [showTunnels, setShowTunnels] = useState(true);
  const [selectedPort, setSelectedPort] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [steps, setSteps] = useState([
    { id: null, searchTerm: '', searchResults: [] },
    { id: null, searchTerm: '', searchResults: [] },
  ]);
  const [nearestPort, setNearestPort] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const mapRef = useRef(null);

  const findNearestPort = useCallback((latitude, longitude) => {
    let minDistance = Infinity;
    let nearestPort = null;

    if (ports && ports.length > 0) {
      ports.forEach(port => {
        if (port.Port_Type === 1 || port.Port_Type === 2 || port.Port_Type === 4) {
          const portLat = parseFloat(port.Port_MapX);
          const portLng = parseFloat(port.Port_MapY);
          if (isValidLatLng(portLat, portLng)) {
            const distance = Math.sqrt(Math.pow(latitude - portLat, 2) + Math.pow(longitude - portLng, 2));
            if (distance < minDistance) {
              minDistance = distance;
              nearestPort = port;
            }
          }
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
            newSteps[index].searchResults.unshift(nearestPort);
          }
          setSteps(newSteps);
        } catch (error) {
          console.error('Erreur lors de la recherche des ports:', error);
        }
      } else {
        const newSteps = [...steps];
        newSteps[index].searchResults = index === 0 && nearestPort ? [nearestPort] : [];
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
          setCenter([latitude, longitude]);
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

  const isItineraryPort = (port) => {
    return selectedItinerary && getItineraryPorts(selectedItinerary).some(itineraryPort => itineraryPort?.Port_Id === port.Port_Id);
  };

  const getItineraryPorts = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.canals) {
      return [];
    }

    return Object.values(selectedItinerary.details.canals).flatMap((canal) =>
      canal.troncons.flatMap((troncon) => [
        ports.find((port) => port.Port_Id === troncon.Troncon_Port1Id),
        ports.find((port) => port.Port_Id === troncon.Troncon_Port2Id)
      ])
    );
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
      // Adjust map bounds to fit the selected itinerary
      const bounds = new L.LatLngBounds();
      const selectedItinerary = data[0]; // Assuming the first itinerary is the one to fit

      if (selectedItinerary && selectedItinerary.details && selectedItinerary.details.paths) {
        selectedItinerary.details.paths.forEach((troncon) => {
          troncon.path.forEach((point) => {
            bounds.extend([point.lat, point.lng]);
          });
        });
      }

      if (mapRef.current) {
        mapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
    }
  };

  const handleAddStep = () => {
    return new Promise((resolve) => {
      const newSteps = [...steps];
      newSteps.splice(steps.length - 1, 0, { id: null, searchTerm: '', searchResults: [] });
      setSteps(newSteps);
      resolve(newSteps);
    });
  };
  
  const handleRemoveStep = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleStepUp = (index) => {
    if (index <= 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
  };

  const handleStepDown = (index) => {
    if (index >= steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
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
  };

  const handleAddStepAndSetPort = (port) => {
    console.log('Setting port from map2');
    const newSteps = [...steps];
    newSteps.splice(steps.length - 1, 0, { id: null, searchTerm: '', searchResults: [] });
    newSteps[newSteps.length-2] = { id: port.Port_Id, searchTerm: port.Port_Nom, searchResults: [] };
    console.log(newSteps)
    setSteps(newSteps);
  };  
  
  const handleItinerarySelection = (index) => {
    setSelectedItineraryIndex(index);

    // Adjust map bounds to fit the selected itinerary
    const bounds = new L.LatLngBounds();
    const selectedItinerary = itineraries[index];

    if (selectedItinerary && selectedItinerary.details && selectedItinerary.details.paths) {
      selectedItinerary.details.paths.forEach((troncon) => {
        troncon.path.forEach((point) => {
          bounds.extend([point.lat, point.lng]);
        });
      });
    }

    if (mapRef.current) {
      mapRef.current.fitBounds(bounds);
    }
  };

  const userLocationIcon = new L.Icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [30, 30],
  });

  const iconUrls = {
    1: classicPortIcon ,
    2: halteIcon,
    3: jonctionIcon,
    4: halteIcon,
    5: halteIcon,
    6: tunnelIcon,
    default: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  };

  const createKey = (port) => `${port.Port_Id}-${port.Port_MapX}-${port.Port_MapY}`;

  const getItineraryTronconsPaths = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.paths) {
      return [];
    }

    return selectedItinerary.details.paths.map((troncon, index) => (
      <Polyline
        key={index}
        positions={troncon.path.map((point) => [point.lat, point.lng])}
        color="#0000FF"
        opacity={0.8}
        weight={5}
      />
    ));
  };

  const getItineraryLocks = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.canals) {
      return [];
    }

    return Object.values(selectedItinerary.details.canals).flatMap((canal) => canal.troncons.flatMap((troncon) => troncon.tronconLocks.map((lock, index) => ({
      position: [parseFloat(lock.Ecluse_MapX), parseFloat(lock.Ecluse_MapY)],
      title: lock.Ecluse_Nom,
      key: `${index}`
    }))));
  };

  const getItineraryPontsLevis = (selectedItinerary) => {
    if (!selectedItinerary || !selectedItinerary.details || !selectedItinerary.details.canals) {
      return [];
    }

    return Object.values(selectedItinerary.details.canals).flatMap((canal) => canal.troncons.flatMap((troncon) => troncon.tronconPontsLevis.map((pontLevis, index) => ({
      position: [parseFloat(pontLevis.Pontlevis_MapX), parseFloat(pontLevis.Pontlevis_MapY)],
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
        <ListGroup.Item
          key={index}
          className={`list-group-item-itinerary ${selectedItineraryIndex === index ? 'selected' : ''}`}
          onClick={() => handleItinerarySelection(index)}
        >
          <strong>{name} : </strong>
          <span>{parseInt(details.total_Km)} km, {details.total_Ecluses} écl, {formatTime(details.total_Temps.toFixed(2))}</span>
        </ListGroup.Item>
      );
    });
  };

  const zoomToCanal = (canal) => {
    const bounds = new L.LatLngBounds();

    canal.troncons.forEach((troncon) => {
      const port1 = ports.find((port) => port.Port_Id === troncon.Troncon_Port1Id);
      const port2 = ports.find((port) => port.Port_Id === troncon.Troncon_Port2Id);
      if (port1) {
        const latLng1 = [parseFloat(port1.Port_MapX), parseFloat(port1.Port_MapY)];
        if (isValidLatLng(latLng1[0], latLng1[1])) {
          bounds.extend(latLng1);
        }
      }
      if (port2) {
        const latLng2 = [parseFloat(port2.Port_MapX), parseFloat(port2.Port_MapY)];
        if (isValidLatLng(latLng2[0], latLng2[1])) {
          bounds.extend(latLng2);
        }
      }
    });

    if (mapRef.current) {
      mapRef.current.fitBounds(bounds);
    }
  };

  const zoomToPort = (port) => {
    if (mapRef.current && port) {
      setSelectedPort(port);
      const latLng = [parseFloat(port.Port_MapX), parseFloat(port.Port_MapY)];
      if (isValidLatLng(latLng[0], latLng[1])) {
        mapRef.current.setView(latLng, 14); // Adjust the zoom level as needed
      }
    }
  };

  const renderTronconDetails = (troncon) => {
    const port1 = ports.find((port) => port.Port_Id === troncon.Troncon_Port1Id);
    const port2 = ports.find((port) => port.Port_Id === troncon.Troncon_Port2Id);
    if (!port1 || !port2) {
      return null;
    }
    const cleanHTML = (htmlString) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      let textContent = doc.body.textContent || '';

      // Remove excessive whitespace
      textContent = textContent.replace(/\s+/g, ' ').trim();

      // Normalize line breaks
      textContent = textContent.replace(/<br\s*\/?>/gi, '\n');

      // Decode HTML entities
      const textarea = document.createElement('textarea');
      textarea.innerHTML = textContent;
      textContent = textarea.value;

      return textContent;
    };

    return (
      <div onClick={() => zoomToPort(port2)}>
        <StepLabel>
          <Typography variant="subtitle1">
            <strong>Pk {troncon.port2_pk} {port2.Port_Nom}</strong>
          </Typography>
        </StepLabel>
        <StepContent>
          <Typography>
            📏 {parseInt(troncon.troncon_Km * 10) / 10} km - ⏱️ {formatTime(troncon.tronconTemps)}
          </Typography>
          <Typography>
            🚧 {troncon.Troncon_Ecluses} écl - 🏎️ {troncon.Troncon_Vmax} km/h
          </Typography>

          {troncon.Troncon_Tunnel && parseFloat(troncon.Troncon_Tunnel) > 0 && (
            <Typography>🚇 Tunnel : {parseFloat(troncon.Troncon_Tunnel)} km </Typography>
          )}
          {troncon.Troncon_NbPontLevis > 0 && (
            <Typography>🌉 {troncon.Troncon_NbPontLevis} ponts-levis</Typography>
          )}
          {troncon.portChantiers1.length > 0 && (
            <Tooltip title={`🏗️ Chantiers: ${troncon.portChantiers1.map((chantier) => chantier.NOM).join(', ')}`}>
              <span style={{ color: 'red', fontWeight: 'bold', cursor: 'pointer' }}>■</span>
            </Tooltip>
          )}
          {troncon.portLoueurs1.length > 0 && (
            <Tooltip title={`🚤 Loueurs: ${troncon.portLoueurs1.map((loueur) => loueur.SOCIETE).join(', ')}`}>
              <span style={{ color: 'green', fontWeight: 'bold', cursor: 'pointer' }}>■</span>
            </Tooltip>
          )}
          {port2.Port_Embranchement_Info && (
            <Typography>🔗 Embranchement: {cleanHTML(port2.Port_Embranchement_Info)}</Typography>
          )}
        </StepContent>
      </div>
    );
  };

  const renderDetails = (selectedItinerary) => {
    return (
      <Accordion defaultActiveKey="0">
        {getItineraryCanals(selectedItinerary).map((canal, canalIndex) => (
          <Accordion.Item
            eventKey={`${canalIndex}`}
            key={canalIndex}
            onClick={() => zoomToCanal(canal)}
          >
            <Accordion.Header>
              <Typography variant="h7">
                <strong>{canal.LIBELLE}</strong> : {formatTime(canal.tempsCanal)} - {canal.DISTANCE} km - {canal.NBECLUSE} écl
              </Typography>
            </Accordion.Header>
            <Accordion.Body>
              <Stepper orientation="vertical">
                {canal.troncons.map((troncon, tronconIndex) => {
                  const isLastTroncon = tronconIndex === canal.troncons.length - 1;
                  if (!isLastTroncon) {
                    return (
                      <Step key={tronconIndex} active>
                        {renderTronconDetails(troncon)}
                      </Step>
                    )
                  } else {
                    const port2 = ports.find((port) => port.Port_Id === troncon.Troncon_Port2Id);

                    return (
                      <Step key={tronconIndex + 1} active>
                        <div onClick={() => zoomToPort(port2)}>
                          <StepLabel>
                            <strong>Pk {troncon.port2_pk} {ports.find((port) => port.Port_Id === troncon.Troncon_Port2Id).Port_Nom}</strong>
                          </StepLabel>
                        </div>
                      </Step>
                    );
                  }

                })}
              </Stepper>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  const LegendBox = () => (
    <div className="legend-box">
      <h4>🗺️ Map</h4>
      <div>
        <input type="checkbox" id="showPortsHorsItineraire" checked={showPortsHorsItineraire} onChange={() => setShowPortsHorsItineraire(!showPortsHorsItineraire)} />
        <label htmlFor="showPortsHorsItineraire">Ports</label>
      </div>
      <div>
        <input type="checkbox" id="showUserLocation" checked={showUserLocation} onChange={() => setShowUserLocation(!showUserLocation)} />
        <label htmlFor="showUserLocation">Localisation</label>
      </div>
    </div>
  );

  const ItineraryBox = () => (
    <div className="itinerary-box">
      <h4>📍 Itinéraire</h4>
      <div>
        <input type="checkbox" id="showClassicPorts" checked={showClassicPorts} onChange={() => setShowClassicPorts(!showClassicPorts)} />
        <label htmlFor="showClassicPorts">
          <img src={classicPortIcon} alt="Port classique" style={{ width: '20px', verticalAlign: 'middle' }} /> Ports classiques
        </label>
      </div>
      <div>
        <input type="checkbox" id="showHaltes" checked={showHaltes} onChange={() => setShowHaltes(!showHaltes)} />
        <label htmlFor="showHaltes">
          <img src={halteIcon} alt="Halte" style={{ width: '20px', verticalAlign: 'middle' }} /> Ports haltes
        </label>
      </div>
      <div>
        <input type="checkbox" id="showJonctions" checked={showJonctions} onChange={() => setShowJonctions(!showJonctions)} />
        <label htmlFor="showJonctions">
          <img src={jonctionIcon} alt="Jonction" style={{ width: '20px', verticalAlign: 'middle' }} /> Jonctions
        </label>
      </div>
      <div>
        <input type="checkbox" id="showTunnels" checked={showTunnels} onChange={() => setShowTunnels(!showTunnels)} />
        <label htmlFor="showTunnels">
          <img src={tunnelIcon} alt="Tunnel" style={{ width: '20px', verticalAlign: 'middle' }} /> Tunnels
        </label>
      </div>
      <div>
        <input type="checkbox" id="showLocks" checked={showLocks} onChange={() => setShowLocks(!showLocks)} />
        <label htmlFor="showLocks">
          <img src={lockIcon} alt="Écluse" style={{ width: '20px', verticalAlign: 'middle' }} /> Écluses
        </label>
      </div>
      <div>
        <input type="checkbox" id="showPontsLevis" checked={showPontsLevis} onChange={() => setShowPontsLevis(!showPontsLevis)} />
        <label htmlFor="showPontsLevis">
          <img src={pontIcon} alt="Pont-levis" style={{ width: '20px', verticalAlign: 'middle' }} /> Ponts-levis
        </label>
      </div>
    </div>
  );
  

  const selectedItinerary = selectedItineraryIndex !== null ? itineraries[selectedItineraryIndex] : null;

  return (
    <Container fluid className="app-container">
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        whenCreated={mapInstance => {
          mapRef.current = mapInstance;
          
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LegendBox />
        <ItineraryBox />

        {showUserLocation && (
          <Marker
            position={center}
            title="Vous êtes ici"
            icon={userLocationIcon}
          />
        )}

{ports
  .filter(port => isItineraryPort(port))
  .filter(port =>
    (showClassicPorts && port.Port_Type === 1) ||
    (showHaltes && port.Port_Type === 2) ||
    (showJonctions && port.Port_Type === 3) ||
    (showHaltes && port.Port_Type === 4) ||
    (showHaltes && port.Port_Type === 5) ||
    (showTunnels && port.Port_Type === 6) ||
    (showPortsHorsItineraire && !isItineraryPort(port))
  )
  .map((port) => {
    const lat = parseFloat(port.Port_MapX);
    const lng = parseFloat(port.Port_MapY);
    if (isValidLatLng(lat, lng)) {
      return (
        <Marker
          key={createKey(port)}
          position={[lat, lng]}
          title={port.Port_Nom}

          icon={L.icon({
            iconUrl: iconUrls[port.Port_Type] || iconUrls.default,
            iconSize: [25, 25],
          })}
        >
            <Popup
              position={[lat, lng]}
            >
              <div>
                <h2>{port.Port_Nom}</h2>
                <p><strong>Type de port :</strong> {port.Port_Type === 1 ? 'Port classique' : port.Port_Type === 2 ? 'Halte' : port.Port_Type === 3 ? 'Jonction' : port.Port_Type === 4 ? 'Escale' : port.Port_Type === 5 ? 'Bief' : port.Port_Type === 6 ? 'Tunnel' : 'Jonction'}</p>
                <p>Plus de détails ici...</p>
                <Button onClick={() => handleSetPortFromMap(port, 0)}>
                  Définir comme départ
                </Button>                
                <Button onClick={() => {
                    console.log('Adding step5');
                    handleAddStepAndSetPort(port);             
                   }}>
                  Ajouter comme étape
                </Button>
                <Button onClick={() => handleSetPortFromMap(port, steps.length - 1)}>
                  Définir comme arrivée
                </Button>



              </div>
            </Popup>
        </Marker>
      );
    }
    return null;
  })
}

{showPortsHorsItineraire && ports
  .filter(port => [1, 2, 4].includes(port.Port_Type) && !isItineraryPort(port))
  .map((port) => {
    const lat = parseFloat(port.Port_MapX);
    const lng = parseFloat(port.Port_MapY);
    if (isValidLatLng(lat, lng)) {
      return (
        <Marker
          key={createKey(port)}
          position={[lat, lng]}
          title={port.Port_Nom}
          icon={L.icon({
            iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            iconSize: [40, 40],
          })}
        >
          
            <Popup
              position={[lat, lng]}
            >
              <div>
                <h2>{port.Port_Nom}</h2>
                <p><strong>Type de port :</strong> {port.Port_Type === 1 ? 'Port classique' : port.Port_Type === 2 ? 'Halte' : port.Port_Type === 3 ? 'Jonction' : port.Port_Type === 4 ? 'Escale' : port.Port_Type === 5 ? 'Bief' : port.Port_Type === 6 ? 'Tunnel' : 'Jonction'}</p>
                <p>Plus de détails ici...</p>
                <Button onClick={() => handleSetPortFromMap(port, 0)}>
                  Définir comme départ
                </Button>
                <Button onClick={() => {
                    console.log('Adding step2');
                    handleAddStepAndSetPort(port);
                  }}> 
                  Ajouter comme étape
                </Button>
                <Button onClick={() => handleSetPortFromMap(port, steps.length - 1)}>
                  Définir comme arrivée
                </Button>

                
                 

              </div>
            </Popup>
        </Marker>
      );
    }
    return null;
  })}


        {selectedItinerary && getItineraryTronconsPaths(selectedItinerary)}

        {showLocks && selectedItinerary && getItineraryLocks(selectedItinerary).map((lock, index) => (
          <Marker
            key={index}
            position={lock.position}
            title={lock.title}
            icon={L.icon({
              iconUrl: lockIcon, // Replace with the actual path to the lock icon
              iconSize: [25, 25],
            })}
          />
        ))}

        {showPontsLevis && selectedItinerary && getItineraryPontsLevis(selectedItinerary).map((pontLevis, index) => (
          <Marker
            key={index}
            position={pontLevis.position}
            title={pontLevis.title}
            icon={L.icon({
              iconUrl: pontIcon, // Replace with the actual path to the pont-levis icon
              iconSize: [25, 25],
            })}
          />
        ))}
      </MapContainer>

      <Button
        variant="primary"
        className="sidebar-toggle"
        onClick={() => setShowOffcanvas(true)}
      >
        ☰
      </Button>

      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        backdrop={false}
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Bienvenue</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="search-container">
            {steps.map((step, index) => (
              <InputGroup className="mb-3" key={index}>
                <FormControl
                  placeholder={`Choisissez un ${index === 0 ? 'point de départ' : index === steps.length - 1 ? 'point d\'arrivée' : 'étape'}`}
                  aria-label={`Choisissez un ${index === 0 ? 'point de départ' : index === steps.length - 1 ? 'point d\'arrivée' : 'étape'}`}
                  value={step.searchTerm}
                  onChange={(e) => handleSearchChange(e, index)}
                  onClick={() => {
                    if (index === 0 && nearestPort) {
                      const newSteps = [...steps];
                      newSteps[index].searchResults.unshift(nearestPort);
                      setSteps(newSteps);
                    }
                  }}
                />
                <InputGroup.Text>{index === 0 ? '🚩' : index === steps.length - 1 ? '📍' : '➡️'}</InputGroup.Text>
                {index > 0 && index < steps.length - 1 && (
                  <>
                    <Button variant="danger" onClick={() => handleRemoveStep(index)} className="remove-step-button">
                      X
                    </Button>
                    <Button variant="secondary" onClick={() => handleStepUp(index)} className="step-up-button">
                      ↑
                    </Button>
                    <Button variant="secondary" onClick={() => handleStepDown(index)} className="step-down-button">
                      ↓
                    </Button>
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
                  {port.Port_Id === nearestPort?.Port_Id ? 'Port le plus proche' : port.Port_Nom}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ))}
          <Button className="mt-1" onClick={handleCalculateItinerary}>Calculer l'itinéraire</Button>

          {itineraries.length > 0 && (
            <div className="mt-3">
              <ListGroup>{getItinerarySummaries()}</ListGroup>
            </div>
          )}
          {selectedItinerary && (
            <div className="mt-4">
              <h3>Détails de l'itinéraire</h3>
              {renderDetails(selectedItinerary)}
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {!showOffcanvas && (
        <div className="itinerary-info" onClick={() => setShowOffcanvas(true)}>
          <span>{steps[0]?.searchTerm || 'Départ'} ➔ {steps[steps.length - 1]?.searchTerm || 'Arrivée'}</span>
        </div>
      )}
    </Container>
  );
};

export default ItineraryPage;
