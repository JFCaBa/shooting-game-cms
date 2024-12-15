// Example of using the API URL in a fetch call
const API_URL = process.env.REACT_APP_API_URL;

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const fetchDrones = async () => {
  try {
    const response = await fetch(`${API_URL}/drones`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching drones:', error);
    throw error;
  }
};