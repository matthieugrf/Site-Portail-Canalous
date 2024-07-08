import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;


export const calculateItinerary = async (startId, endId) => {
  try {
    const response = await axios.get(`${API_URL}/itinerary/calculate`, {
      params: { startId, endId },
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating itinerary:', error);
    throw error;
  }
};


export const getPortsByCanalId = async (canalId) => {
  try {
    const response = await axios.get(`${API_URL}/itinerary/ports/${canalId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ports:', error);
    throw error;
  }
};

export const searchPorts = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/itinerary/ports/search`, { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Error searching ports:', error);
    throw error;
  }
};

export const getPorts = async () => {
  try {
    const response = await axios.get(`${API_URL}/itinerary/ports`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ports:', error);
    throw error;
  }
};

export const getEcluses = async () => {
  try {
    const response = await axios.get(`${API_URL}/itinerary/ecluses`);
    return response.data;
  }
  catch (error) {
    console.error('Error fetching ecluses:', error);
    throw error;
  }
};