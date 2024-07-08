import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Navbar,
  Nav,
} from 'react-bootstrap';
import { getPortsByCanalId } from '../services/itineraryService';
import { preloadImages } from '../utils/imagePreloader';
import fondImage from '../img/cartes_france/1_Nord/fond.jpg'; // Importer l'image de fond directement
import deule from '../img/cartes_france/1_Nord/deule.png';
import lys from '../img/cartes_france/1_Nord/lys.png';
import espierre from '../img/cartes_france/1_Nord/espierre.png';
import roubaix from '../img/cartes_france/1_Nord/roubaix.png';
import nbp from '../img/cartes_france/1_Nord/nbp.png';
import charleroi from '../img/cartes_france/1_Nord/charleroi.png';
import historique from '../img/cartes_france/1_Nord/historique.png';
import centre from '../img/cartes_france/1_Nord/centre.png';
import pommeroeul from '../img/cartes_france/1_Nord/pommeroeul.png';
import blaton from '../img/cartes_france/1_Nord/blaton.png';
import hautEscaut from '../img/cartes_france/1_Nord/haut-escaut.png';
import bossuit from '../img/cartes_france/1_Nord/bossuit.png';
import lens from '../img/cartes_france/1_Nord/lens.png';
import bethune from '../img/cartes_france/1_Nord/bethune.png';
import scarpeSuperieure from '../img/cartes_france/1_Nord/scarpe-superieure.png';
import scarpeInferieure from '../img/cartes_france/1_Nord/scarpe-inferieure.png';
import sambreBelge from '../img/cartes_france/1_Nord/sambre-belge.png';
import sambre from '../img/cartes_france/1_Nord/sambre.png';
import escautGrdGabarit from '../img/cartes_france/1_Nord/escaut-grd-gabarit.png';
import escaut from '../img/cartes_france/1_Nord/escaut.png';
import canalStQuentin from '../img/cartes_france/1_Nord/canal-st-quentin.png';
import canalSambreOise from '../img/cartes_france/1_Nord/canal-sambre-oise.png';
import canalGrdGabarit from '../img/cartes_france/1_Nord/canal-grd-gabarit.png';
import aa from '../img/cartes_france/1_Nord/aa.png';
import canalCalais from '../img/cartes_france/1_Nord/canal-calais.png';
import houlle from '../img/cartes_france/1_Nord/houlle.png';
import bergues from '../img/cartes_france/1_Nord/bergues.png';
import bourbourg from '../img/cartes_france/1_Nord/bourbourg.png';
import canalFurnes from '../img/cartes_france/1_Nord/canal-furnes.png';
import canalNord from '../img/cartes_france/1_Nord/canal-nord.png';
import stOmer from '../img/cartes_france/1_Nord/st-omer.png';
import sommeAmont from '../img/cartes_france/1_Nord/somme-amont.png';
import sommeAval from '../img/cartes_france/1_Nord/somme-aval.png';
import sommeMaritime from '../img/cartes_france/1_Nord/somme-maritime.png';
import baieDeSomme from '../img/cartes_france/1_Nord/baie-de-somme.png';
import bassinSeine from '../img/cartes_france/1_Nord/bassin-seine.png';
import bassinEst from '../img/cartes_france/1_Nord/bassin-est.png';

import '../App.css';

const Nord = () => {
  const [highlightedImage, setHighlightedImage] = useState(fondImage);
  const [ports, setPorts] = useState([]);
  const [selectedCanal, setSelectedCanal] = useState(null);

  useEffect(() => {
    const images = [
      fondImage,
      deule,
      lys,
      espierre,
      roubaix,
      nbp,
      charleroi,
      historique,
      centre,
      pommeroeul,
      blaton,
      hautEscaut,
      bossuit,
      lens,
      bethune,
      scarpeSuperieure,
      scarpeInferieure,
      sambreBelge,
      sambre,
      escautGrdGabarit,
      escaut,
      canalStQuentin,
      canalSambreOise,
      canalGrdGabarit,
      aa,
      canalCalais,
      houlle,
      bergues,
      bourbourg,
      canalFurnes,
      canalNord,
      stOmer,
      sommeAmont,
      sommeAval,
      sommeMaritime,
      baieDeSomme,
      bassinSeine,
      bassinEst,
    ];

    preloadImages(images);
  }, []);
  const handleMouseOver = (canalImage) => {
    setHighlightedImage(canalImage);
  };

  const handleMouseOut = () => {
    setHighlightedImage(fondImage);
  };


  
  const handleAreaClick = async (canalId) => {
    console.log(`Canal ${canalId} clicked`);
    try {
      const data = await getPortsByCanalId(canalId);
      console.log('Response:', data);
      setPorts(data.ports);
      setSelectedCanal(canalId);
    } catch (error) {
      console.error('Erreur lors de la récupération des ports:', error);
    }
  };


  return (
    <Container>
    <h2 className="my-4">Bassin Nord</h2>
    <Row>
      <Col>
      <div style={{ width: '100%', maxWidth : '500px' , margin : '0 auto' ,background: `url(${fondImage})` }}>
        <img src={highlightedImage} width="500" height="303" useMap="#map" alt="Bassin Nord" className='img-fluid' />
        <map name="map">
          <area shape="poly" coords="211,109,217,103,225,114,223,122,208,136,203,136,203,131,209,126,210,118,215,115"  onClick={() => handleAreaClick(7)} onMouseOver={() => handleMouseOver(deule)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="162,114,171,121,191,120,210,110,217,104,240,90,239,81,223,94,207,100,202,106,184,114"  onClick={() => handleAreaClick(21)} onMouseOver={() => handleMouseOver(lys)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="234,101,238,110,246,110,246,101,234,100"  onClick={() => handleAreaClick(160)} onMouseOver={() => handleMouseOver(espierre)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="220,107,226,116,237,110,233,100"  onClick={() => handleAreaClick(14)} onMouseOver={() => handleMouseOver(roubaix)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="255,128,258,133,278,141,283,143,306,143,306,136,285,138,280,137,277,134,270,128,257,125"  onClick={() => handleAreaClick(511)} onMouseOver={() => handleMouseOver(nbp)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="326,113,334,114,334,119,340,131,347,133,350,150,343,146,342,138,335,140,332,135,332,130,325,121"  onClick={() => handleAreaClick(366)} onMouseOver={() => handleMouseOver(charleroi)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="333,134,336,141,323,142,329,135"  onClick={() => handleAreaClick(582)} onMouseOver={() => handleMouseOver(historique)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="306,136,306,143,324,142,329,134,334,134,330,128,323,131,321,136"  onClick={() => handleAreaClick(173)} onMouseOver={() => handleMouseOver(centre)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="269,141,272,152,286,143,280,142,277,139"  onClick={() => handleAreaClick(166)} onMouseOver={() => handleMouseOver(pommeroeul)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="276,132,284,138,292,121,290,113,283,112,283,121"  onClick={() => handleAreaClick(333)} onMouseOver={() => handleMouseOver(blaton)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="249,98,257,100,250,105,251,114,258,124,255,131,262,139,255,141,249,128,250,123,244,115,245,109,246,101"  onClick={() => handleAreaClick(421)} onMouseOver={() => handleMouseOver(hautEscaut)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="244,83,240,91,249,98,255,100,254,92,245,84"  onClick={() => handleAreaClick(632)} onMouseOver={() => handleMouseOver(bossuit)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="205,142,211,148,208,151,196,156,194,150,205,143"  onClick={() => handleAreaClick(12)} onMouseOver={() => handleMouseOver(lens)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="178,133,187,137,182,146,174,142"  onClick={() => handleAreaClick(3)} onMouseOver={() => handleMouseOver(bethune)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="217,159,222,166,209,172,194,174,192,167,204,162,211,162"  onClick={() => handleAreaClick(23)} onMouseOver={() => handleMouseOver(scarpeSuperieure)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="225,149,225,157,235,156,255,153,263,142,259,139,255,141,249,147,231,148"  onClick={() => handleAreaClick(24)} onMouseOver={() => handleMouseOver(scarpeInferieure)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="316,161,320,169,333,165,352,153,366,149,374,145,390,147,391,136,372,136,351,145,350,151,345,148,340,148,327,157"  onClick={() => handleAreaClick(124)} onMouseOver={() => handleMouseOver(sambreBelge)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="273,189,281,195,292,191,298,181,299,175,308,172,314,172,320,169,315,161,292,169,289,180,280,185"  onClick={() => handleAreaClick(22)} onMouseOver={() => handleMouseOver(sambre)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="260,135,262,144,265,148,257,163,249,163,242,170,229,171,227,178,239,178,250,174,264,167,272,151,270,140"  onClick={() => handleAreaClick(536)} onMouseOver={() => handleMouseOver(escautGrdGabarit)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="251,174,237,178,231,187,240,191"  onClick={() => handleAreaClick(18)} onMouseOver={() => handleMouseOver(escaut)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="232,188,240,191,243,199,241,211,246,232,239,245,247,258,242,263,232,245,237,230,230,206"  onClick={() => handleAreaClick(15)} onMouseOver={() => handleMouseOver(canalStQuentin)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="272,189,281,195,283,211,256,248,253,263,237,274,231,269,242,263,248,258,251,239,274,209"  onClick={() => handleAreaClick(8)} onMouseOver={() => handleMouseOver(canalSambreOise)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="141,60,148,60,144,71,144,79,144,93,160,109,163,114,172,121,186,130,204,131,208,136,210,141,226,149,225,160,231,170,229,175,223,174,222,167,216,159,211,148,205,143,198,138,186,137,178,133,157,119,142,102,137,91,137,81,140,60"  onClick={() => handleAreaClick(19)} onMouseOver={() => handleMouseOver(canalGrdGabarit)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="130,64,124,67,132,80,139,82,138,79,130,64"  onClick={() => handleAreaClick(1)} onMouseOver={() => handleMouseOver(aa)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="105,71,132,80,137,82,135,86,129,90,113,89,101,84,98,71"  onClick={() => handleAreaClick(5)} onMouseOver={() => handleMouseOver(canalCalais)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="137,90,140,98,127,99,127,95"  onClick={() => handleAreaClick(20)} onMouseOver={() => handleMouseOver(houlle)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="162,62,156,65,161,73,168,70"  onClick={() => handleAreaClick(2)} onMouseOver={() => handleMouseOver(bergues)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="158,57,163,63,143,76,134,77,134,72,138,72,146,69,156,56"  onClick={() => handleAreaClick(4)} onMouseOver={() => handleMouseOver(bourbourg)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="158,57,164,67,176,61,171,56"  onClick={() => handleAreaClick(6)} onMouseOver={() => handleMouseOver(canalFurnes)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="222,173,229,178,227,195,218,212,213,222,216,241,214,248,220,272,212,273,209,248,206,220,215,196,222,174"  onClick={() => handleAreaClick(17)} onMouseOver={() => handleMouseOver(canalNord)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="140,97,144,105,131,108,129,100,140,97"  onClick={() => handleAreaClick(13)} onMouseOver={() => handleMouseOver(stOmer)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="232,243,236,253,214,251,214,247,217,241"  onClick={() => handleAreaClick(9)} onMouseOver={() => handleMouseOver(sommeAmont)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="207,216,206,225,197,222,180,230,172,227,157,233,134,223,107,206,111,200,125,202,154,224,172,217,182,219,197,215"  onClick={() => handleAreaClick(10)} onMouseOver={() => handleMouseOver(sommeAval)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="112,200,109,192,92,180,87,187,108,207"  onClick={() => handleAreaClick(11)} onMouseOver={() => handleMouseOver(sommeMaritime)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="93,179,87,188,78,186,77,178,82,174,89,176"  onClick={() => handleAreaClick(565)} onMouseOver={() => handleMouseOver(baieDeSomme)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="203,291,203,285,212,273,220,272,231,270,238,275,248,284,261,280,272,283,278,294,277,300,265,289,249,292,232,284,230,276,221,279,216,285,207,292,200,298"  onClick={() => handleAreaClick(5)} onMouseOver={() => handleMouseOver(bassinSeine)} onMouseOut={handleMouseOut} />
          <area shape="poly" coords="390,136,389,146,392,170,384,183,384,187,376,189,376,205,370,212,369,223,377,227,378,231,381,249,394,249,388,234,389,226,382,214,389,207,386,198,386,195,395,191,400,168,398,142,416,136,430,132,437,130,433,121,423,124,413,127,403,130,394,134"  onClick={() => handleAreaClick(6)} onMouseOver={() => handleMouseOver(bassinEst)} onMouseOut={handleMouseOut} />
        </map>
      </div>
      </Col>
      </Row>
      {selectedCanal && (
        <Row className="mt-4">
          <Col>
            <h3>Ports disponibles pour le canal {selectedCanal}</h3>
            <ListGroup>
              {ports.map((port, index) => (
                <ListGroup.Item key={index}>{port.nom}</ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Nord;
