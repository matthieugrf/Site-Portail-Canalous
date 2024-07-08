import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, ListGroup, FormControl, InputGroup } from 'react-bootstrap';
import { searchPorts } from '../services/itineraryService';
import { debounce } from 'lodash';

import Nord from '../basins/Nord';
import Ouest from '../basins/Ouest';
import CentreOuest from '../basins/CentreOuest';
import Sud from '../basins/Sud';
import Seine from '../basins/Seine';
import Est from '../basins/Est';
import Centre from '../basins/Centre';
import SaoneRhone from '../basins/SoaneRhone';
import mapImage from '../img/cartes_france/france/france-belgique.jpg';

const ItineraryPage = () => {
  const [selectedBasin, setSelectedBasin] = useState(null);
  const [startSearchTerm, setStartSearchTerm] = useState('');
  const [endSearchTerm, setEndSearchTerm] = useState('');
  const [startSearchResults, setStartSearchResults] = useState([]);
  const [endSearchResults, setEndSearchResults] = useState([]);
  const [startPort, setStartPort] = useState(null);
  const [endPort, setEndPort] = useState(null);

  const debouncedStartSearch = useCallback(
    debounce(async (query) => {
      if (query.length > 0) {
        try {
          const data = await searchPorts(query);
          setStartSearchResults(data.ports);
        } catch (error) {
          console.error('Erreur lors de la recherche des ports:', error);
        }
      } else {
        setStartSearchResults([]);
      }
    }, 300),
    []
  );

  const debouncedEndSearch = useCallback(
    debounce(async (query) => {
      if (query.length > 0) {
        try {
          const data = await searchPorts(query);
          setEndSearchResults(data.ports);
        } catch (error) {
          console.error('Erreur lors de la recherche des ports:', error);
        }
      } else {
        setEndSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedStartSearch(startSearchTerm);
  }, [startSearchTerm, debouncedStartSearch]);

  useEffect(() => {
    debouncedEndSearch(endSearchTerm);
  }, [endSearchTerm, debouncedEndSearch]);

  const handleStartSearchChange = (e) => {
    setStartSearchTerm(e.target.value);
  };

  const handleEndSearchChange = (e) => {
    setEndSearchTerm(e.target.value);
  };

  const handleSelectPort = (port, type) => {
    if (type === 'start') {
      setStartPort(port);
      setStartSearchResults([]);
      setStartSearchTerm(port.nom);
    } else {
      setEndPort(port);
      setEndSearchResults([]);
      setEndSearchTerm(port.nom);
    }
  };

  const handleBasinClick = (basin) => {
    setSelectedBasin(basin);
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h1>Welcome to the Boat Rental Portal</h1>
          <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>
          <img src={mapImage} usemap="#france-map" alt="Carte des bassins" fluid />
          <map name="france-map">
            {/* Area definitions */}
            <area shape="poly" coords="208,94,225,88,231,72,234,39,260,30,278,19,280,27,287,25,290,27,315,16,335,22,345,30,342,47,355,50,361,57,359,66,355,74,348,73,346,80,347,85,352,88,347,95,340,92,324,88,318,101,311,106,284,108,255,107,241,107,220,100" href="#" onClick={() => handleBasinClick('Nord')} alt="Nord" />
            <area shape="poly" coords="113,124,120,137,121,154,122,158,109,158,102,162,94,159,85,165,63,147,56,148,52,153,50,158,30,159,26,161,18,167,6,169,6,173,16,179,23,179,19,186,19,191,3,194,4,199,12,204,25,204,30,208,39,207,67,216,72,223,89,227,91,236,108,245,101,252,102,258,107,263,158,261,187,254,203,246,204,206,204,189,199,171,190,169,126,134" href="#" onClick={() => handleBasinClick('Ouest')} alt="Ouest" />
            <area shape="poly" coords="109,263,112,272,134,281,139,291,138,299,132,296,131,299,136,312,145,312,169,319,179,322,206,326,211,312,210,297,204,272,202,259,203,246,182,256,152,262,119,262" href="#" onClick={() => handleBasinClick('CentreOuest')} alt="CentreOuest" />
            <area shape="poly" coords="135,312,137,319,134,338,134,382,128,410,119,424,113,425,113,429,128,435,128,440,132,443,140,445,161,454,195,455,211,455,225,460,227,468,233,470,244,469,253,474,287,473,285,445,299,426,306,426,318,420,333,423,335,421,333,419,328,388,319,366,319,355,295,345,262,335,223,328,179,322,146,312" href="#" onClick={() => handleBasinClick('Sud')} alt="Sud" />
            <area shape="poly" coords="208,94,190,101,180,109,175,109,175,114,183,122,171,128,143,123,135,114,131,104,126,104,120,108,118,108,110,103,108,112,113,118,113,125,137,140,165,155,187,167,201,171,224,174,258,174,289,174,320,171,335,169,330,148,324,139,315,133,309,130,306,121,309,113,311,106,280,108,241,107,221,100" href="#" onClick={() => handleBasinClick('Seine')} alt="Seine" />
            <area shape="poly" coords="325,88,347,95,348,101,355,102,365,111,366,115,380,118,398,117,423,133,459,137,463,145,460,151,452,161,450,166,445,188,441,204,445,221,429,228,423,227,417,231,421,237,411,244,408,245,388,243,355,245,352,221,342,193,334,168,330,147,322,136,310,130,306,119,311,105,318,100,325,88" href="#" onClick={() => handleBasinClick('Est')} alt="Est" />
            <area shape="poly" coords="199,170,204,189,203,242,202,262,209,296,211,311,207,326,240,333,273,338,302,347,318,355,321,318,324,285,331,261,339,251,351,245,355,245,352,222,342,193,337,174,335,168,300,174,256,174,224,174,209,174" href="#" onClick={() => handleBasinClick('Centre')} alt="Centre" />
            <area shape="poly" coords="410,244,393,269,392,278,410,273,422,300,418,309,421,315,414,331,408,341,412,343,421,355,418,368,419,380,425,383,436,385,446,386,441,401,440,413,410,424,398,438,381,439,366,431,350,427,339,429,338,423,333,420,331,407,327,385,319,366,319,349,321,315,324,289,329,266,336,253,345,247,357,245,380,243,401,243" href="#" onClick={() => handleBasinClick('SaoneRhone')} alt="Saône-Rhône" />
          </map>
          {selectedBasin === 'Nord' && <Nord />}
          {selectedBasin === 'Ouest' && <Ouest />}
          {selectedBasin === 'CentreOuest' && <CentreOuest />}
          {selectedBasin === 'Sud' && <Sud />}
          {selectedBasin === 'Seine' && <Seine />}
          {selectedBasin === 'Est' && <Est />}
          {selectedBasin === 'Centre' && <Centre />}
          {selectedBasin === 'SaoneRhone' && <SaoneRhone />}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
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
          <ListGroup className="mt-4">
            {startSearchResults.map((port, index) => (
              <ListGroup.Item key={index} onClick={() => handleSelectPort(port, 'start')}>
                {port.nom}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
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
          <ListGroup className="mt-4">
            {endSearchResults.map((port, index) => (
              <ListGroup.Item key={index} onClick={() => handleSelectPort(port, 'end')}>
                {port.nom}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Port de Départ: {startPort ? startPort.nom : 'Non sélectionné'}</h3>
        </Col>
        <Col>
          <h3>Port d'Arrivée: {endPort ? endPort.nom : 'Non sélectionné'}</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default ItineraryPage;
