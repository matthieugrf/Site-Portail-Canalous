import React from 'react';
import { Stepper, Step, StepLabel, StepContent, Paper, Typography, Box } from '@mui/material';

const formatTime = (totalHours) => {
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours}h ${minutes}min`;
};

const ItineraryDetails = ({ itinerary }) => {
  const renderTronconDetails = (troncon) => (
    <Box mb={2}>
      <Typography><strong>Distance:</strong> {troncon.troncon_Km} km</Typography>
      <Typography><strong>Temps:</strong> {formatTime(troncon.tronconTemps)}</Typography>
      <Typography><strong>Nombre d'écluses:</strong> {troncon.Troncon_Ecluses}</Typography>
      <Typography><strong>Vitesse max:</strong> {troncon.Troncon_Vmax} km/h</Typography>
      <Typography><strong>Présence de tunnel:</strong> {troncon.Troncon_Tunnel ? 'Oui' : 'Non'}</Typography>
      <Typography><strong>Nombre de ponts-levis:</strong> {troncon.Troncon_NbPontLevis}</Typography>
      <Typography><strong>Chantiers au port de départ:</strong> {troncon.portChantiers1.join(', ')}</Typography>
      <Typography><strong>Loueurs au port de départ:</strong> {troncon.portLoueurs1.join(', ')}</Typography>
    </Box>
  );

  return (
    <Box mt={2}>
      {itinerary.details.canals.map((canal, canalIndex) => (
        <Box key={canalIndex} mb={2}>
          <Typography variant="h6">
            {canal.LIBELLE} : {formatTime(canal.tempsCanal)} - {canal.DISTANCE} km - {canal.NBECLUSE} écl - TE : {canal.TIREAU} m - TA : {canal.TIRAIR} m - long : {canal.LONGUEUR} m - larg : {canal.LARGEUR} m
          </Typography>
          <Stepper orientation="vertical">
            {canal.troncons.map((troncon, tronconIndex) => (
              <Step key={tronconIndex} active>
                <StepLabel>
                  <Typography variant="subtitle1">Tronçon {tronconIndex + 1}</Typography>
                </StepLabel>
                <StepContent>
                  {renderTronconDetails(troncon)}
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      ))}
    </Box>
  );
};

export default ItineraryDetails;
