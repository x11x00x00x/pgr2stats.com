import axios from 'axios';
import { EndpointType } from '../types';

const BASE_URL = 'https://api.pgr2stats.com/api';

export const fetchData = async (endpoint: EndpointType, id?: string) => {
  try {
    const url = id 
      ? `${BASE_URL}/${endpoint}_${id}`
      : `${BASE_URL}/${endpoint}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} data:`, error);
    return [];
  }
};

export const fetchLeaderboard = async (id: string) => {
  return fetchData('leaderboard', id);
};

export const fetchArcade = async () => {
  return fetchData('arcade');
};

export const fetchOfflineTop10 = async () => {
  return fetchData('offlinetop10');
};

export const fetchMatches = async () => {
  return fetchData('matches');
}; 