import axios from 'axios';

const MISP_URL = process.env.REACT_APP_MISP_URL;
const MISP_API_KEY = process.env.REACT_APP_MISP_API_KEY;

const mispApi = axios.create({
  baseURL: MISP_URL,
  headers: {
    'Authorization': MISP_API_KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const fetchMispEvents = async () => {
  try {
    const response = await mispApi.get('/events/index');
    return response.data;
  } catch (error) {
    console.error('Error fetching MISP events:', error);
    throw error;
  }
};

export const fetchMispEvent = async (eventId) => {
  try {
    const response = await mispApi.get(`/events/view/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching MISP event ${eventId}:`, error);
    throw error;
  }
};