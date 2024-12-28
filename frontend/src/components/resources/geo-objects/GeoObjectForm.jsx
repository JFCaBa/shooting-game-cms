import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../../../utils/api';

const GeoObjectForm = ({ onSubmit, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [manualPlayerId, setManualPlayerId] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      if (response && response.data && Array.isArray(response.data)) {
        setPlayers(response.data);
      } else {
        console.error('Invalid players data received:', response);
        setPlayers([]);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude || 0
          });
          setLocationError('');
        },
        (error) => {
          setLocationError(
            error.code === 1 ? 'Please allow location access.' :
            error.code === 2 ? 'Unable to determine location.' :
            'Location request timed out.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    setSelectedPlayer(playerId);


    const player = players.find(p => p.playerId === playerId);
    if (player?.location) {
      setLocation({
        latitude: player.location.latitude || 0,
        longitude: player.location.longitude || 0,
        altitude: player.location.altitude || 0
      });
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const playerId = useManualInput ? manualPlayerId : selectedPlayer;
  
    if (!playerId) {
      setLocationError('Please provide a player ID');
      return;
    }
  
    try {
      await api.post('/geo-objects/assign', {
        playerId,
        location
      });
      onClose();
    } catch (error) {
      console.error('Error assigning geo object:', error);
      setLocationError('Failed to assign geo object');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Assign Geo Object
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {locationError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{locationError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Player
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="useManualInput"
                      checked={useManualInput}
                      onChange={(e) => setUseManualInput(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="useManualInput" className="ml-2 text-sm text-gray-600">
                      Enter Player ID manually
                    </label>
                  </div>
                </div>

                {useManualInput ? (
                  <input
                    type="text"
                    value={manualPlayerId}
                    onChange={(e) => setManualPlayerId(e.target.value)}
                    placeholder="Enter Player ID"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                ) : (
                  <select
                    value={selectedPlayer}
                    onChange={handlePlayerChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    required
                  >
                    <option value="">Select a player</option>
                    {Array.isArray(players) && players.map(player => (
                      <option key={player.playerId} value={player.playerId}>
                        {player.playerId}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Location</h3>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Use Current Location
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={location.latitude}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={location.longitude}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Altitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="altitude"
                    value={location.altitude}
                    onChange={handleLocationChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeoObjectForm;